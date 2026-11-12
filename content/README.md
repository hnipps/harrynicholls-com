# Home page content

`scripts/build-home.py` reads these files and rewrites the generated regions of `src/index.html`. Run `npm run build` after editing, then commit `src/`.

## albums.json

One entry per record, in the order they should appear.

```json
{ "title": "Album title", "artist": "Artist", "cover": "/albums/album-title.jpg", "url": "https://..." }
```

- `cover` is a square image saved under `src/albums/`. 600px wide is plenty.
- `url` is optional. With one, the cover links out.
- An entry with an empty `title` renders as a blank placeholder square.

## photos.json

```json
{ "src": "/photos/workshop.jpg", "alt": "What is in the photo", "caption": "Optional caption" }
```

- Images go under `src/photos/`, cropped 4:5.
- An entry with an empty `src` renders as a blank placeholder frame.

## contributions.json

Generated. The deploy workflow refreshes it from GitHub every day with `python3 scripts/build-home.py --fetch`. The committed copy is the fallback if GitHub cannot be reached.
