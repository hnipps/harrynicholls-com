#!/usr/bin/env python3
"""Rebuild the generated regions of src/index.html.

Three regions are generated, each between `<!-- build:NAME -->` markers:

  graph   the commit graph, from content/contributions.json
  albums  the album gallery, from content/albums.json
  photos  the photo album, from content/photos.json

Run with --fetch to refresh content/contributions.json from GitHub first. That
needs GITHUB_TOKEN in the environment. If the fetch fails, the committed data is
kept and the build carries on, so a GitHub outage never breaks a deploy.
"""
import argparse
import json
import math
import os
import re
import sys
import urllib.request
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'src' / 'index.html'
CONTENT = ROOT / 'content'
LOGIN = 'hnipps'

PITCH = 14          # distance between dot centres, in SVG units
R_REST = 1.1        # a day with no contributions
R_MIN, R_MAX = 1.6, 6.2
ALBUM_HUES = (268, 40, 150, 320, 95, 210)

QUERY = '''query($login: String!) { user(login: $login) { contributionsCollection {
  contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }'''


def fetch():
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        raise RuntimeError('GITHUB_TOKEN is not set')
    request = urllib.request.Request(
        'https://api.github.com/graphql',
        data=json.dumps({'query': QUERY, 'variables': {'login': LOGIN}}).encode(),
        headers={'Authorization': f'bearer {token}', 'User-Agent': 'harrynicholls.com-build'})
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    calendar = payload['data']['user']['contributionsCollection']['contributionCalendar']
    weeks = [[{'date': d['date'], 'count': d['contributionCount']} for d in w['contributionDays']]
             for w in calendar['weeks']]
    if len(weeks) < 52:
        raise RuntimeError(f'expected a year of weeks, got {len(weeks)}')
    return {'login': LOGIN, 'total': calendar['totalContributions'], 'weeks': weeks}


def long_date(d, year=True):
    return f'{d.day} {d.strftime("%B")}' + (f' {d.year}' if year else '')


def graph(data):
    weeks = data['weeks']
    days = [d for w in weeks for d in w]
    counts = [d['count'] for d in days]
    active = sorted(c for c in counts if c)
    cap = active[int(len(active) * 0.9)] if active else 1  # outliers saturate, they don't flatten the rest
    first, last = date.fromisoformat(days[0]['date']), date.fromisoformat(days[-1]['date'])
    busiest = max(days, key=lambda d: d['count'])

    # Two halves: side by side they read as one year, and on a phone they stack
    # so the dots stay big enough to touch.
    split = math.ceil(len(weeks) / 2)
    halves, base, previous = [], 0, None
    for part_start, part in ((0, weeks[:split]), (split, weeks[split:])):
        groups = []
        for i, week in enumerate(part):
            dots = []
            for d in week:
                row = (date.fromisoformat(d['date']).weekday() + 1) % 7  # Sunday on the top row
                cx, cy = i * PITCH + PITCH / 2, row * PITCH + PITCH / 2
                if d['count']:
                    r = R_MIN + (R_MAX - R_MIN) * math.sqrt(min(d['count'], cap) / cap)
                    cls = ' class="now"' if d is days[-1] else ''
                else:
                    r, cls = R_REST, ' class="rest"'
                dots.append(f'<circle{cls} cx="{cx:g}" cy="{cy:g}" r="{r:.1f}"/>')
            groups.append(f'<g style="--w:{part_start + i}">{"".join(dots)}</g>')

        # Label every week a new month starts in. The month carries across the
        # halves so a month is never labelled twice.
        months = []
        for i, week in enumerate(part):
            month = date.fromisoformat(week[0]['date'])
            if month.month != previous:
                months.append((i + 1, month.strftime('%b')))
                previous = month.month
        if len(months) > 1 and months[1][0] - months[0][0] < 3:
            months.pop(0)  # a sliver of a month at the left edge would collide with the next label
        months = [m for m in months if m[0] < len(part)]  # nor may one start in the last column and overhang

        halves.append(
            f'<div class="graph-half" style="--weeks:{len(part)}">'
            f'<svg class="graph-dots" viewBox="0 0 {len(part) * PITCH} {7 * PITCH}" '
            f'data-base="{base}" data-weeks="{len(part)}" aria-hidden="true">{"".join(groups)}</svg>'
            f'<ol class="graph-months">{"".join(f"<li style={chr(34)}grid-column:{c}{chr(34)}>{m}</li>" for c, m in months)}</ol>'
            f'</div>')
        base += sum(len(week) for week in part)

    summary = (f'{data["total"]:,} contributions on GitHub in the year to {long_date(last)}. '
               f'The busiest day was {long_date(date.fromisoformat(busiest["date"]), year=False)}, '
               f'with {busiest["count"]:,}.')
    return f'''
<figure class="graph" data-start="{first.isoformat()}" data-counts="{",".join(map(str, counts))}">
<div class="graph-year" style="--span:{split}" role="img" aria-label="{escape(summary)}">
{chr(10).join(halves)}
</div>
<figcaption class="in-measure">
<p><strong>{data["total"]:,}</strong> contributions on <a href="https://github.com/{data.get("login", LOGIN)}">GitHub</a> in the year to {long_date(last)}. Each dot is a day, sized by how much I shipped. The busiest was {long_date(date.fromisoformat(busiest["date"]), year=False)}, with {busiest["count"]:,}.</p>
</figcaption>
</figure>
'''


def waiting(kind, note, count, in_measure=''):
    """The empty state: the note first, then one quiet row of blank tiles."""
    tiles = '<span></span>' * count
    return (f'\n<p class="note{in_measure}">{note}</p>\n'
            f'<div class="{kind} is-waiting" aria-hidden="true">{tiles}</div>\n')


def albums(entries):
    entries = [a for a in entries if a.get('title', '').strip()]
    if not entries:
        return waiting('albums', 'The records are still being chosen. Covers to come.', 4, ' in-measure')
    tiles = []
    for i, a in enumerate(entries):
        hue = ALBUM_HUES[i % len(ALBUM_HUES)]
        title, artist = a.get('title', '').strip(), a.get('artist', '').strip()
        label = escape(f'{title} by {artist}' if artist else title)
        cover = (f'<img class="cover" src="{escape(a["cover"])}" alt="" width="600" height="600" loading="lazy">'
                 if a.get('cover') else '<span class="cover"></span>')
        text = f'<span class="album-title">{escape(title)}</span>'
        if artist:
            text += f' <span class="album-artist">{escape(artist)}</span>'
        inner = f'{cover}<span class="album-label">{text}</span>'
        if a.get('url'):
            tile = f'<a class="album-tile" href="{escape(a["url"])}" aria-label="{label}">{inner}</a>'
        else:
            tile = f'<span class="album-tile">{inner}</span>'
        # Without cover art the label is all there is, so it always shows.
        bare = '' if a.get('cover') else ' is-bare'
        tiles.append(f'<li class="album{bare}" style="--h:{hue}">{tile}</li>')
    return f'\n<ul class="albums" role="list">\n{chr(10).join(tiles)}\n</ul>\n'


def photos(entries):
    entries = [p for p in entries if p.get('src')]
    if not entries:
        return waiting('photos', 'Photos to come.', 6)
    tiles = []
    for p in entries:
        caption = f'<span class="photo-caption">{escape(p["caption"])}</span>' if p.get('caption') else ''
        tiles.append(f'<li class="photo"><img class="frame" src="{escape(p["src"])}" '
                     f'alt="{escape(p.get("alt", ""))}" width="800" height="1000" loading="lazy">{caption}</li>')
    return f'\n<ul class="photos" role="list">\n{chr(10).join(tiles)}\n</ul>\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--fetch', action='store_true', help='refresh contributions from GitHub first')
    args = parser.parse_args()

    contributions = CONTENT / 'contributions.json'
    if args.fetch:
        try:
            contributions.write_text(json.dumps(fetch(), separators=(',', ':')) + '\n')
            print('Fetched contributions from GitHub.')
        except Exception as error:  # keep the last good graph rather than fail the deploy
            print(f'warning: could not fetch contributions ({error}); keeping the committed data.',
                  file=sys.stderr)

    regions = {
        'graph': graph(json.loads(contributions.read_text())),
        'albums': albums(json.loads((CONTENT / 'albums.json').read_text())),
        'photos': photos(json.loads((CONTENT / 'photos.json').read_text())),
    }
    page = PAGE.read_text()
    for name, markup in regions.items():
        pattern = re.compile(rf'(<!-- build:{name} -->).*?(<!-- /build:{name} -->)', re.S)
        if not pattern.search(page):
            sys.exit(f'error: {PAGE} has no "build:{name}" region')
        page = pattern.sub(lambda m: m.group(1) + markup + m.group(2), page)
    PAGE.write_text(page)
    print(f'Built {len(regions)} regions in {PAGE.relative_to(ROOT)}.')


if __name__ == '__main__':
    main()
