---
name: harrynicholls.com
description: A resume set like a well-made page. One column, a serif for the name, a sans for the reading, one coloured mark.
colors:
  paper: "oklch(98.6% 0 0)"
  ink: "oklch(22% 0.01 260)"
  ink-soft: "oklch(44% 0.012 260)"
  hairline: "oklch(88% 0.004 260)"
  rest: "oklch(83% 0.006 260)"
  frame: "oklch(93.5% 0.004 260)"
  pencil: "oklch(55% 0.21 262)"
  pencil-ink: "oklch(44% 0.2 262)"
  pencil-wash: "oklch(92% 0.05 262)"
  paper-dark: "oklch(20% 0.035 268)"
  ink-dark: "oklch(93% 0.015 265)"
  ink-soft-dark: "oklch(75% 0.03 265)"
  hairline-dark: "oklch(34% 0.04 268)"
  rest-dark: "oklch(40% 0.045 268)"
  frame-dark: "oklch(27% 0.035 268)"
  pencil-dark: "oklch(72% 0.17 45)"
  pencil-ink-dark: "oklch(81% 0.13 50)"
  pencil-wash-dark: "oklch(40% 0.09 45)"
typography:
  display:
    fontFamily: "'Instrument Serif', 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(3.25rem, 1.9rem + 6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.012em"
  lede:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.42
  section-head:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.3
  section-head-margin:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "'Hyperlegible Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  tile: "2px"
  round: "50%"
spacing:
  page-inline: "1.25rem"
  margin-col: "10rem"
  gutter: "2.5rem"
  measure: "37rem"
  entry-gap: "2rem"
  section-gap: "3.5rem"
  section-gap-wide: "4.5rem"
components:
  link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  link-hover:
    textColor: "{colors.pencil-ink}"
  copy-button:
    textColor: "{colors.ink-soft}"
    typography: "{typography.body}"
    padding: "0.55rem 0.5rem"
  copy-button-hover:
    textColor: "{colors.ink}"
  copy-button-done:
    textColor: "{colors.pencil-ink}"
  theme-switcher:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.round}"
    size: "2.75rem"
  theme-switcher-hover:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.ink}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "0.5rem 0.75rem"
  waiting-tile:
    backgroundColor: "{colors.frame}"
    rounded: "{rounded.tile}"
  album-title:
    textColor: "{colors.ink}"
    typography: "{typography.small}"
  album-artist:
    textColor: "{colors.ink-soft}"
    typography: "{typography.small}"
  photo-frame:
    backgroundColor: "{colors.frame}"
    rounded: "{rounded.tile}"
  graph-dot:
    backgroundColor: "{colors.ink}"
  graph-dot-rest:
    backgroundColor: "{colors.rest}"
  graph-dot-now:
    backgroundColor: "{colors.pencil}"
---

# Design System: harrynicholls.com

## Overview

**Creative North Star: "The Well-Made Page"**

This is a resume set like a well-made page: one column of reading on plain paper, a serif for the name, a sans for everything else, and a single coloured mark. The name is a description of the craft, not a metaphor to illustrate. Nothing on the page pretends to be a letter, a notebook or a terminal. Character comes from the type, the colour and the spacing, chosen by Harry himself in a local type lab, and from three pieces of real evidence: a year of commits, his records and his photos.

The page is quiet and dense with fact. Sections are separated by a hairline and a hanging head, never by a box. Light and dark are two named palettes, Graphite and cobalt and Night shift. The reader's system setting chooses between them until the reader uses the switcher, and that choice is remembered. The page works in full with JavaScript off; the three scripts (switch the palette, copy the email, read the commit graph) are additions.

It refuses the developer-portfolio arrangement of hero, project cards and skill badges.

**Key Characteristics:**
- One text column (37rem) with section heads hanging in a 10rem left margin on wide screens.
- Instrument Serif for the name only; Hyperlegible Sans for all other text.
- Upright for the record, italic for section heads and asides.
- One coloured mark per palette: cobalt in light, persimmon in dark.
- Flat paper. Hairlines divide; nothing is boxed or carded.
- Two weights, 400 and 700.
- Plain HTML first; motion and scripting are optional extras.

## Colors

Two palettes chosen by Harry in the type lab: near-neutral graphite on white paper with a cobalt mark, and pale ink on deep indigo with a persimmon mark. The CSS custom properties keep one set of names (`--paper`, `--ink`, `--pencil` and so on); the `-dark` tokens above are the same properties under `prefers-color-scheme: dark` or `data-theme="dark"` on the root. The stylesheet declares the Night shift values in both of those blocks, and the two must stay identical. OKLCH is the source of truth.

### Primary
- **Cobalt Mark** (`pencil`): link underlines, list and disclosure markers, the focus ring, the caret, form accent, today's dot on the commit graph and the dot under the pointer. Measures 4.9:1 on paper, so it is safe for marks and large glyphs.
- **Cobalt Ink** (`pencil-ink`): the text colour a link takes on hover, and the "Copied" confirmation. 7.9:1 on paper.
- **Cobalt Wash** (`pencil-wash`): text selection background only.
- **Persimmon Mark** (`pencil-dark`): the same jobs as the cobalt mark in Night shift. 6.9:1 on the indigo paper.
- **Persimmon Ink** (`pencil-ink-dark`): hover and confirmation text in Night shift. 9.5:1.
- **Persimmon Wash** (`pencil-wash-dark`): selection background in Night shift.

### Neutral
- **White Paper** (`paper`, renders #fafafa): the page. Also the `theme-color` for light.
- **Graphite Ink** (`ink`): all primary text, entry names, link text at rest, active commit dots. 16.6:1 on paper.
- **Soft Graphite** (`ink-soft`): dates, roles, asides, notes, captions, margin heads, month labels, the copy control at rest. 7.5:1 on paper.
- **Hairline** (`hairline`): the 1px rule above every section and the footer; the scrollbar thumb.
- **Rest** (`rest`): commit-graph dots for days with no contributions.
- **Frame** (`frame`): waiting tiles, the ground behind a photo while it loads, and the round ground under the theme switcher on hover.
- **Indigo Paper** (`paper-dark`, renders #0f1526): the Night shift page and its `theme-color`.
- **Pale Ink** (`ink-dark`): primary text in Night shift. 14.8:1.
- **Soft Pale Ink** (`ink-soft-dark`): secondary text in Night shift. 8.2:1.
- **Indigo Hairline, Rest and Frame** (`hairline-dark`, `rest-dark`, `frame-dark`): the same three structural roles, tinted toward the paper's indigo.

### Named Rules
**The One Mark Rule.** Each palette has exactly one hue, the pencil. It draws lines, dots, markers and rings. It never fills a block, never backs a button and never sets running text. Text only takes the pencil's ink shade as a response: on hover, or to confirm a copy.

**The Covers Bring the Colour Rule.** Beyond the mark, colour belongs to content: album covers and photographs. The interface around them stays graphite or indigo so the covers are the only saturated things on the page.

**The Reader's Setting Rule.** The palette follows `prefers-color-scheme` until the reader uses the switcher; after that their saved choice wins, in either direction. Every colour token has a value in both palettes; a new token is not finished until it has both.

## Typography

**Display Font:** Instrument Serif (with Iowan Old Style, Georgia, serif)
**Body Font:** Hyperlegible Sans (with ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif)

**Character:** A tall, slightly condensed display serif says the name once, then steps aside for a sans drawn for legibility. Both were chosen by Harry in the type lab and are self-hosted under the SIL Open Font License. Hyperlegible Sans draws a slashed zero by design and has no plain alternate; that is accepted.

### Hierarchy
- **Display** (400, clamp(3.25rem, 1.9rem + 6vw, 5.25rem), line-height 1, tracking -0.012em): the name, the page's only `h1`.
- **Lede** (400, 1.3125rem, line-height 1.42): the first intro paragraph and the footer email address. Each sentence of the lede is kept to its own line where the measure allows.
- **Section head** (400 italic, 1.3125rem, line-height 1.3): `h2` on narrow screens, in ink. From 56rem up it hangs in the margin at body size (1rem, line-height 1.6) in soft ink.
- **Title** (700, 1rem, line-height 1.6): entry names (`h3`): employers, projects, article titles. Album titles use the same weight at the small size.
- **Body** (400, 1rem, line-height 1.6): all reading text. Maximum line length is the 37rem measure. Paragraphs and list items use `text-wrap: pretty`; entry names use `balance`.
- **Small** (400, 0.875rem, line-height 1.35 in captions): dates, the commit readout, the month-by-month table, album text, the colophon's fine print.

Figures are proportional in running text and lining tabular wherever they align: dates beside entry names and the contributions table.

### Named Rules
**The Serif Is the Name Rule.** Instrument Serif appears once, on the name. No other heading, number or pull-out borrows it.

**The Italic Is the Aside Rule.** Upright type carries the record: names, roles, dates, descriptions. Italic carries everything said in passing: section heads, the asides after each contact link, placeholder notes, photo captions, month labels, the graph readout and the copy control.

**The Two Weights Rule.** Only 400 and 700 exist. Bold marks entry names, album titles and the one total in the commit caption. Emphasis inside a paragraph is not bolded.

## Layout

One centred page, 52rem at most (10rem margin column + 2.5rem gutter + 37rem measure + 2.5rem of side padding), with 1.25rem of inline padding at every width. Top padding scales with viewport height (clamp(2.5rem, 9vh, 6.5rem)); bottom padding is 4rem.

- **Below 56rem:** a single column. Each section opens with a 1px hairline, 1.4rem of padding, then its head above its body. Sections sit 3.5rem apart.
- **From 56rem:** the masthead, every section and the footer become a two-column grid: a 10rem margin column and the text column, 2.5rem apart. Section heads hang in the margin column on the first line of their body. Sections sit 4.5rem apart with 1.5rem of padding under the hairline. List bullets hang in the gutter so text keeps one left edge.
- **The name** spans both columns, so on wide screens it starts at the page's left edge, in line with the hairlines and the margin heads, while the intro and contact list sit in the text column.
- **Wide sections** (the commit graph and the albums) span both columns with their head on top. Prose inside them (the caption, the readout, a placeholder note) is indented back to the text column.
- **Below 30rem:** the commit graph stacks into two half-years so a day stays big enough to touch, and an entry's date drops under its name.
- **Rhythm:** entries are 2rem apart; a role line or first paragraph sits 0.45rem under its entry head; list items 0.4rem apart; gallery gaps are 0.75rem, opening to 1.75rem by 1.5rem for albums on wide screens.
- **The theme switcher** has no place of its own: it is the dot of the "i" in the name. Where the browser cannot anchor it there, or the display face has not loaded, it falls back to the page's top right corner (0.75rem down, 0.5rem in).
- **Print:** this is a resume, so print is a first-class layout. Pure black ink on white, soft text #444, hairlines #ccc, the mark #1f4fd6, body at 10.5pt, sections 1.5rem apart, no page padding. The copy control, skip link, graph readout, placeholder notes and any section still waiting for content are removed, and so is the theme switcher. Entries, the graph, albums and photos never break across pages.

### Named Rules
**The One Left Edge Rule.** Wide screens have two left edges and no more: the page edge (name, hairlines, margin heads, wide figures) and the text edge (everything read). New content aligns to one of them.

## Elevation & Depth

Flat. The page is one sheet of paper with no surfaces above it: no cards, panels, sticky bars or overlays. Structure is carried by hairlines and by space. The single exception is a real album cover, which is an object lying on the page and casts a small contact shadow.

### Shadow Vocabulary
- **Cover shadow** (`box-shadow: 0 1px 2px var(--cover-shadow), 0 10px 22px -14px var(--cover-shadow-deep)`): under album cover images only. The shadow colours are the ink at 14% and 45% alpha in light, and a near-black indigo at 50% and 80% in Night shift. A linked cover lifts 3px on hover over 0.35s.

### Named Rules
**The Flat Page Rule.** Only an album cover image casts a shadow. Placeholder tiles, photos, text and controls do not.

## Shapes

Square and plain. The one radius is 2px, used on gallery tiles (covers, photo frames, waiting tiles) and the focus ring. There are no pills, no rounded containers and no borders around anything; the only drawn lines are the 1px section hairline and the link underline. The only circles are the commit-graph dots and the round hover ground of the theme switcher. Tiles keep fixed proportions: album covers are square, photos are 4:5 portrait.

## Components

### Links
The page's main interactive element, and where the mark is seen most.
- **Rest:** text in the surrounding ink, underlined in the pencil (0.085em thick, offset 0.22em).
- **Hover:** text turns to the pencil's ink shade and the underline doubles to 0.17em, over 0.2s with an ease-out curve (cubic-bezier(0.16, 1, 0.3, 1)).
- **Focus:** a 2px pencil outline, 3px off the text, 2px radius. This ring is shared by every focusable element.
- **In soft-ink lines** (entry links, "more" lines): the link itself returns to full ink so it stands out from the sentence around it.
- **Album links** carry no underline; the cover is the affordance.

### Copy control
The only labelled button on the page, and one of its two icon marks.
- **Style:** no border, no background. A 16-unit outline copy mark (1.5 stroke, no fill, 0.95em) and an italic label in soft ink, sitting inline after the email aside. Padding of 0.55rem by 0.5rem with matching negative block margins gives a touch target without disturbing the line.
- **States:** ink on hover; on success the label reads "Copied" in the pencil's ink shade for 2.4s; on failure it says so in words. Hidden until script and the clipboard are available.

### Theme switcher
The dot of the "i" in "Nicholls". It shows the palette in use: a sun by day, a crescent moon in Night shift.
- **Style:** a solid icon in the name's own ink, `max(0.24em, 0.875rem)` across, measured in the display size. The letter's real dot is clipped away at 0.28em and the icon is anchored to the letter (CSS anchor positioning), centred 0.1825em below the top of the line. These numbers are Instrument Serif's and must be re-measured if the display face changes. An invisible 2.75rem square around the dot is the touch target. The moon is mirrored so its heavy side faces the "c", clear of the N's serif.
- **States:** on hover the icon takes the pencil colour. The sun also turns 45 degrees over 0.5s; the moon does not turn, because a crescent's weight is off-centre and turning it reads as a jump. Focus uses the shared pencil ring. Its accessible name and tooltip say "Switch to dark mode" or "Switch to light mode".
- **Fallback:** the script adds `name-ready` to the root only when anchor positioning is supported and Instrument Serif has loaded. Otherwise the letter keeps its dot and the same icon sits in a 2.75rem round button at the page's top right corner, in soft ink, with the frame colour filling the circle on hover.
- **Text:** the heading's text is still "Harry Nicholls". The button is a sibling of the heading, not inside it. In print the letter gets its dot back.
- **Behaviour:** the first click sets the opposite of the current palette on the root and saves it; a small inline script in the head applies a saved choice before first paint, and `theme-color` follows. Hidden without script and in print.

### Contact list
Each line is a labelled link followed by an italic aside in soft ink that says what the link is for. Lines sit 0.3rem apart. The footer repeats the email at lede size and the profiles as a wrapping row.

### Entries
The unit of the resume: a job, a project or an article.
- **Head:** a bold name on the left, a date in small soft ink with tabular figures on the right, aligned on the baseline. The date never wraps.
- **Body:** an optional role line in soft ink, a paragraph, and optionally a bullet list with pencil-coloured markers or a line of links separated by a middle dot.
- **Closing line:** a section may end with one soft-ink sentence pointing to the rest.

### Commit graph (signature)
A year of real GitHub contributions as a field of dots, one per day.
- **Geometry:** weeks are columns and days are rows, Sunday on top, on a 14-unit pitch (a half-year of 27 weeks is 378 by 98 units). A day with nothing is a 1.1-unit dot in the rest colour. An active day is an ink dot whose radius runs from 1.6 to 6.2 units on a square-root scale, capped at the 90th percentile of active days so outliers saturate instead of flattening the rest. Today is drawn in the pencil.
- **Layout:** the year is built as two half-years that sit side by side as one row, each sized by its number of weeks, and stack below 30rem. Month labels sit under the weeks they start in, in italic soft ink at 0.75rem.
- **Reading:** a line under the dots names the day under the pointer or finger ("12 contributions on Tuesday 14 April 2026.") in small italic soft ink, and the dot turns to the pencil. Its resting text is a prompt. Touch scrolling stays vertical.
- **Motion:** when 35% of the graph enters view, the weeks ink in left to right: each fades up 4px over 0.8s, staggered 16ms per week. Reduced motion, no script and print all show the finished graph.
- **Text equivalent:** the figure has a spoken summary, a caption with the bold total and the busiest day, and a disclosed month-by-month table with right-aligned tabular figures.

### Albums
- **Grid:** three columns, four from 56rem.
- **Real tile:** a square cover with the 2px radius and the cover shadow, a bold title and a soft-ink artist under it at the small size (line-height 1.35). An album without cover art shows a square in a pale tint of one of six rotating hues (268, 40, 150, 320, 95, 210).
- **Waiting state:** an italic soft-ink note, then one row of blank square tiles in the frame colour: three on narrow screens, four on wide.

### Photos
- **Grid:** three columns, six from 56rem, held to the measure with 0.75rem gaps.
- **Real tile:** a 4:5 portrait frame, cropped to fill, 2px radius, no shadow, with an optional italic soft-ink caption (0.8125rem).
- **Waiting state:** the same note-then-tiles pattern in 4:5: three tiles on narrow screens, six on wide.

### Skip link
Paper text on an ink block (0.5rem by 0.75rem padding), off-screen until focused. The one place the ink is used as a fill.

## Do's and Don'ts

### Do:
- **Do** set new reading text in Hyperlegible Sans at 1rem and 1.6, inside the 37rem measure.
- **Do** open every section with the 1px hairline and a hanging italic head; let space and the hairline do the dividing.
- **Do** use the pencil for marks only: underlines, markers, the focus ring, a highlighted dot.
- **Do** give every new colour token a Graphite and cobalt value and a Night shift value, and check text against the measured floor (soft ink is 7.5:1 in light, 8.2:1 in dark).
- **Do** use italic soft ink for anything said in passing, and upright ink for the record.
- **Do** use lining tabular figures wherever numbers or dates line up.
- **Do** make every enhancement optional: content in the HTML in reading order, scripted states added on top, motion inside `prefers-reduced-motion: no-preference`.
- **Do** give an empty gallery the waiting state (a note and one row of frame-coloured tiles) and hide it in print.
- **Do** keep print working: a new component needs a decision about how it prints.

### Don't:
- **Don't** use Instrument Serif anywhere but the name.
- **Don't** add cards, boxes, panels, borders or background fills around content.
- **Don't** add icons beyond the two the page has: the copy mark and the switcher's moon and sun.
- **Don't** add a second hue to the interface, or use the pencil as a fill or for running text.
- **Don't** add shadows to anything but an album cover image.
- **Don't** add a weight other than 400 and 700, or bold a phrase inside a paragraph.
- **Don't** build the developer-portfolio arrangement: a hero, project cards, skill badges.
- **Don't** dress the page in a governing metaphor.
- **Don't** force a palette. The system setting decides until the reader uses the switcher, and Night shift's values are kept identical in both places the stylesheet declares them.
- **Don't** put content behind script, hover or an animation that must finish before it can be read.
