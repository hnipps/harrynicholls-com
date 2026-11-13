# Home page content

`scripts/build-home.py` reads these files and rewrites the generated regions of `src/index.html`. Run `npm run build` after editing, then commit `src/`.

## albums.json

One entry per record, in the order they should appear.

```json
{ "title": "Album title", "artist": "Artist", "cover": "/albums/album-title.jpg", "url": "https://..." }
```

- To add an album, add an entry with just `title` and `artist` and run `python3 scripts/fetch-album-art.py`. It finds the album in Apple's catalogue, saves the cover to `src/albums/` and fills in `cover` and `url` (the Apple Music page). It leaves albums that already have a cover alone.
- `cover` is a square image saved under `src/albums/`. 600px wide is plenty. You can also add one by hand.
- The gallery is four across, so it looks best with a multiple of four.
- `url` is optional. With one, the cover links out.
- Entries with an empty `title` are skipped. While every entry is empty, the section shows a "covers to come" note and one row of blank tiles.

## photos.json

```json
{ "src": "/photos/workshop.jpg", "thumb": "/photos/workshop-thumb.jpg", "alt": "What is in the photo" }
```

- Prepare every photo with `sh scripts/prepare-photo.sh <input image> <name>`. It takes JPEG or HEIC, writes `src/photos/<name>.jpg` and `src/photos/<name>-thumb.jpg` as web-safe JPEGs, and removes all metadata, including the GPS position phones record. Do not copy photos in by hand.
- The gallery is six across, so it looks best with a multiple of three.
- Entries with an empty `src` are skipped. While every entry is empty, the section shows a "photos to come" note and one row of blank frames.

## contributions.json

Generated. The deploy workflow refreshes it from GitHub every day with `python3 scripts/build-home.py --fetch`. The committed copy is the fallback if GitHub cannot be reached.
