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

    groups = []
    for i, week in enumerate(weeks):
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
        groups.append(f'<g style="--w:{i}">{"".join(dots)}</g>')

    months, previous = [], None
    for i, week in enumerate(weeks):
        start = date.fromisoformat(week[0]['date'])
        if start.month != previous:
            if previous is not None or i == 0:
                months.append((i + 1, start.strftime('%b')))
            previous = start.month
    if len(months) > 1 and months[1][0] - months[0][0] < 3:
        months.pop(0)  # a sliver of a month at the left edge would collide with the next label

    by_month = {}
    for d in days:
        by_month.setdefault(d['date'][:7], 0)
        by_month[d['date'][:7]] += d['count']
    rows = ''.join(
        f'<tr><th scope="row">{date.fromisoformat(m + "-01").strftime("%B %Y")}</th><td>{n:,}</td></tr>'
        for m, n in by_month.items())

    width, height = len(weeks) * PITCH, 7 * PITCH
    summary = (f'{data["total"]:,} contributions on GitHub in the year to {long_date(last)}. '
               f'The busiest day was {long_date(date.fromisoformat(busiest["date"]), year=False)}, '
               f'with {busiest["count"]:,}.')
    return f'''
<figure class="graph" data-start="{first.isoformat()}" data-weeks="{len(weeks)}" data-counts="{",".join(map(str, counts))}">
<svg class="graph-dots" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(summary)}">
{"".join(groups)}
</svg>
<ol class="graph-months" aria-hidden="true">{"".join(f'<li style="grid-column:{c}">{m}</li>' for c, m in months)}</ol>
<figcaption class="in-measure">
<p><strong>{data["total"]:,}</strong> contributions on <a href="https://github.com/{data.get("login", LOGIN)}">GitHub</a> in the year to {long_date(last)}. Each dot is a day, sized by how much I shipped. The busiest was {long_date(date.fromisoformat(busiest["date"]), year=False)}, with {busiest["count"]:,}.</p>
<details><summary>Month by month</summary>
<table><thead><tr><th scope="col">Month</th><th scope="col">Contributions</th></tr></thead><tbody>{rows}</tbody></table>
</details>
</figcaption>
</figure>
'''


def albums(entries):
    tiles = []
    for i, a in enumerate(entries):
        hue = ALBUM_HUES[i % len(ALBUM_HUES)]
        title, artist = a.get('title', '').strip(), a.get('artist', '').strip()
        if not title:
            tiles.append(f'<li class="album is-empty" style="--h:{hue}"><span class="cover"></span></li>')
            continue
        label = escape(f'{title} by {artist}' if artist else title)
        cover = (f'<img class="cover" src="{escape(a["cover"])}" alt="" width="600" height="600" loading="lazy">'
                 if a.get('cover') else '<span class="cover"></span>')
        text = f'<span class="album-title">{escape(title)}</span>'
        if artist:
            text += f' <span class="album-artist">{escape(artist)}</span>'
        inner = cover + text
        if a.get('url'):
            inner = f'<a href="{escape(a["url"])}" aria-label="{label}">{inner}</a>'
        tiles.append(f'<li class="album" style="--h:{hue}">{inner}</li>')
    note = ('\n<p class="note in-measure">The records are still being chosen. Covers to come.</p>'
            if any(not a.get('title', '').strip() for a in entries) else '')
    return f'\n<ul class="albums" role="list">\n{chr(10).join(tiles)}\n</ul>{note}\n'


def photos(entries):
    tiles = []
    for p in entries:
        if not p.get('src'):
            tiles.append('<li class="photo is-empty"><span class="frame"></span></li>')
            continue
        caption = f'<span class="photo-caption">{escape(p["caption"])}</span>' if p.get('caption') else ''
        tiles.append(f'<li class="photo"><img class="frame" src="{escape(p["src"])}" '
                     f'alt="{escape(p.get("alt", ""))}" width="800" height="1000" loading="lazy">{caption}</li>')
    note = ('\n<p class="note">Photos to come.</p>' if any(not p.get('src') for p in entries) else '')
    return f'\n<ul class="photos" role="list">\n{chr(10).join(tiles)}\n</ul>{note}\n'


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
