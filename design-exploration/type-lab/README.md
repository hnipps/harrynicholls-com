# Type and colour lab

A local panel for trying typefaces and palettes on the real home page. Nothing here is deployed: the lab lives outside `src/` and is injected by a dev server.

```sh
sh design-exploration/type-lab/fetch-fonts.sh   # once; fonts are not committed
python3 scripts/lab-server.py                   # then open http://127.0.0.1:3148/
```

- **Pairings** set all three roles at once. **Mix by role** sets them one at a time: display is the name, text is the reading face, detail is section heads, dates and labels.
- Text and detail faces are scaled to the same x-height as the shipped text face, so options are compared at the same apparent size.
- **Your own font** takes any `.woff2`, `.otf` or `.ttf` you drop on it. Dropped fonts last until you reload.
- The choice is kept in the URL, so a link reproduces it. **Copy choice** puts it on the clipboard.

Not fetched, because neither has a direct download: Lastik (https://www.thatthattype.com/fonts/lastik) and Bispo (https://www.behance.net/gallery/6779205/New-Bispo-Free-Font). Fonts from https://ifthisfindsyou.app/fonts are generated in the browser. Download any of these and drop them on the panel.
