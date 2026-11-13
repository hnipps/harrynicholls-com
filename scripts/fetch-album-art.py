#!/usr/bin/env python3
"""Fill in cover art and Apple Music links for content/albums.json.

For every album without a cover, look it up in Apple's public iTunes Search
API, save its 600px cover to src/albums/, and record the cover path and the
Apple Music link. Albums that already have a cover are left alone, so it is
safe to re-run after adding new ones. Run `npm run build` afterwards.

    python3 scripts/fetch-album-art.py
"""
import http.client
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ALBUMS = ROOT / 'content' / 'albums.json'
COVERS = ROOT / 'src' / 'albums'
STOREFRONTS = ('CA', 'US', 'GB')
# Names Apple files an artist under, where it differs from how the list writes it.
ALIASES = {'outkast': 'outkast', 'rhcp': 'red hot chili peppers'}


def plain(text):
    return re.sub(r'[^a-z0-9]+', '', text.lower())


def slug(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def get(url, attempts=4):
    request = urllib.request.Request(url, headers={'User-Agent': 'album-art-fetch'})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except (OSError, http.client.HTTPException):  # a dropped connection or a rate limit
            if attempt == attempts - 1:
                raise
            time.sleep(20 * (attempt + 1))


def search(country, **params):
    time.sleep(3.5)  # Apple allows about 20 searches a minute
    query = urllib.parse.urlencode({'entity': 'album', 'country': country, **params})
    return json.loads(get(f'https://itunes.apple.com/search?{query}')).get('results', [])


def find(title, artist):
    """The album itself: the same artist, and the same title or that title plus an
    edition in brackets ("Purple (Deluxe Edition)"). Never a B-sides or remix release."""
    want_title, want_artist = plain(title), plain(ALIASES.get(artist.lower(), artist))

    def is_match(result):
        name = result.get('collectionName', '')
        base = re.split(r'\s*[\(\[]', name, maxsplit=1)[0]
        return want_artist == plain(result.get('artistName', '')) and plain(base) == want_title

    # Apple's keyword search leaves out some albums. The dependable route is to find
    # the artist and read their whole discography.
    for country in STOREFRONTS:
        artists = [a for a in search(country, term=artist, entity='musicArtist', limit=10)
                   if plain(a.get('artistName', '')) == want_artist]
        for found in artists[:3]:
            time.sleep(3.5)
            lookup = urllib.parse.urlencode({'id': found['artistId'], 'entity': 'album', 'limit': 200, 'country': country})
            albums = json.loads(get(f'https://itunes.apple.com/lookup?{lookup}')).get('results', [])
            matches = [r for r in albums if r.get('wrapperType') == 'collection' and is_match(r)]
            if matches:
                return min(matches, key=lambda r: len(r['collectionName']))

    for country in STOREFRONTS:
        for params in ({'term': f'{artist} {title}', 'limit': 50},
                       {'term': title, 'attribute': 'albumTerm', 'limit': 100},
                       {'term': artist, 'attribute': 'artistTerm', 'limit': 200}):
            matches = [r for r in search(country, **params) if is_match(r)]
            if matches:
                # Prefer the plain release over deluxe and anniversary editions.
                return min(matches, key=lambda r: len(r['collectionName']))
    return None


def main():
    albums = json.loads(ALBUMS.read_text())
    COVERS.mkdir(parents=True, exist_ok=True)
    missing = []
    for album in albums:
        if album.get('cover') or not album.get('title'):
            continue
        try:
            match = find(album['title'], album['artist'])
        except (OSError, http.client.HTTPException) as error:
            missing.append(f'{album["artist"]}: {album["title"]}  (lookup failed: {error})')
            continue
        if not match:
            missing.append(f'{album["artist"]}: {album["title"]}  (not found)')
            continue
        name = f'{slug(album["artist"])}-{slug(album["title"])}.jpg'
        art = re.sub(r'/\d+x\d+bb\.', '/600x600bb.', match['artworkUrl100'])
        (COVERS / name).write_bytes(get(art))
        album['cover'] = f'/albums/{name}'
        if not album.get('url'):
            album['url'] = match['collectionViewUrl'].split('?')[0]
        print(f'ok    {album["artist"]}: {album["title"]}  <-  "{match["collectionName"]}" by {match["artistName"]} ({match.get("releaseDate", "")[:4]})')
        ALBUMS.write_text(json.dumps(albums, indent=2, ensure_ascii=False) + '\n')  # keep progress if a later lookup fails
    for line in missing:
        print(f'MISS  {line}')
    return 1 if missing else 0


if __name__ == '__main__':
    sys.exit(main())
