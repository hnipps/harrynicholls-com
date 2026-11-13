# Type and colour lab

A local panel for trying typefaces and palettes on the real home page. Nothing here is deployed: the lab lives outside `src/` and is injected by a dev server.

```sh
sh design-exploration/type-lab/fetch-fonts.sh   # once; fonts are not committed
python3 scripts/lab-server.py                   # then open http://127.0.0.1:3148/
```

## Type tab

- **Pairings** set all three roles at once. **Mix by role** sets them one at a time: display is the name, text is the reading face, detail is section heads, dates and labels.
- Text and detail faces are scaled to the same x-height as the shipped text face, so options are compared at the same apparent size.
- **Your own font** takes any `.woff2`, `.otf` or `.ttf` you drop on it. Dropped fonts last until you reload.
- The type choice is kept in the URL, so a link reproduces it. **Copy choice** puts it on the clipboard.

## Colour tab

Light and dark each have their own palette. Use the page's own switcher, or the Light mode / Dark mode buttons, to choose which one you are editing.

A palette is three chosen colours (paper, ink, accent). The other six theme colours are mixed from them, unless you pick one by hand.

- **Hue and harmony:** the key hue is the undertone of paper and ink. Harmony places the accent by its angle from the key hue (monochromatic, analogous, triadic, split-complementary, complementary), drawn on the wheel.
- **Chroma:** how far each colour sits from grey.
- **Value:** lightness, with live contrast ratios against the paper.
- **See it another way:** greyscale shows value alone; three more views simulate colour blindness. These filter the whole window, the panel included.
- **Every colour:** a picker for each theme colour. A hand-picked mixed colour stays pinned until you clear it with its x.
- **Start from** loads a preset into the mode you are editing. **Copy both palettes** puts light and dark together on the clipboard as CSS.

A mode you have not touched is left to the real stylesheet. The first change switches that mode to mixed colours, so the soft ink, hairline and tile colours can shift a little from the hand-tuned shipped values.

Colours are worked in OKLCH, where equal steps in lightness look equal. A colour outside what a screen can show has its chroma pulled in until it fits.

## Motion tab

Tunes the sunset that plays when the theme is switched.

- **Play** switches the theme. **Slow motion** stretches every time by five so you can watch the icon meet the letter.
- **Timing:** how long setting and rising take, their curves, the pause between them, and how long the page's colours take to fade.
- **Shape of the move:** the icon's size at rest, how far it sinks, how small each icon ends, and when it finishes drawing in and starts opening out.
- The green or red line at the top says whether the letter hides the icon the whole way with the current values. It runs the same test that set the shipped values: whenever any part of an icon is below the top of the stem of the "i", the icon must be narrower than the stem.
- **Copy motion** puts the values on the clipboard as the CSS variables the site uses.

## Fonts that are not fetched

Not fetched, because neither has a direct download: Lastik (https://www.thatthattype.com/fonts/lastik) and Bispo (https://www.behance.net/gallery/6779205/New-Bispo-Free-Font). Fonts from https://ifthisfindsyou.app/fonts are generated in the browser. Download any of these and drop them on the panel.
