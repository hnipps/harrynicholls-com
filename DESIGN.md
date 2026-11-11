---
name: harrynicholls.com
description: A signed letter, then a numbered log of questions, set in the Slow Victory toolkit v0.4.
colors:
  paper: "oklch(0.955 0 0)"
  surface: "oklch(0.905 0 0)"
  ink: "oklch(0.14 0 0)"
  muted: "oklch(0.44 0 0)"
  signal-text: "oklch(0.56 0.205 32)"
  track-text: "oklch(0.40 0.19 264)"
  hazard: "oklch(0.90 0.20 122)"
  mark: "oklch(0.90 0.20 122 / .6)"
  card: "oklch(0.99 0.004 90)"
  card-ink: "oklch(0.14 0 0)"
  paper-dark: "oklch(0.16 0 0)"
  surface-dark: "oklch(0.22 0 0)"
  ink-dark: "oklch(0.93 0 0)"
  muted-dark: "oklch(0.70 0 0)"
  signal-text-dark: "oklch(0.70 0.20 32)"
  track-text-dark: "oklch(0.72 0.14 264)"
  mark-dark: "oklch(0.90 0.20 122 / .2)"
typography:
  display:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "11.2cqi"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.3rem, 2.7vw, 2.05rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  headline-contact:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.45rem, 4.6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.018em"
  lede:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2.1vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.42
  body:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.06em"
    fontFeature: "\"tnum\", \"zero\""
  caption:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.02em"
    fontFeature: "\"tnum\", \"zero\""
  code:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.86em"
    fontWeight: 500
    fontFeature: "\"tnum\", \"zero\""
  note:
    fontFamily: "Hyperlegible Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "-0.012em"
  hand:
    fontFamily: "Casimir Dunmore, cursive"
    fontSize: "clamp(3.4rem, 6.2vw, 4.6rem)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "\"ss03\""
  hand-large:
    fontFamily: "Casimir Dunmore, cursive"
    fontSize: "clamp(3rem, 7.4vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1
rounded:
  none: "0px"
spacing:
  gap-narrow: "0.6rem"
  gap: "1rem"
  grid: "1.25rem"
  rail-narrow: "2.2rem"
  rail: "3.4rem"
  gutter: "clamp(1rem, 3.2vw, 2.5rem)"
  section: "clamp(3.5rem, 8vw, 6.5rem)"
  measure: "36rem"
  page: "76rem"
components:
  nav:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "1.1rem 0 0.95rem"
  rule-head:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "0 0 0.7rem"
  log-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "1.05rem 0 0.95rem"
  log-row-open:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.signal-text}"
    typography: "{typography.headline}"
  log-number:
    textColor: "{colors.signal-text}"
    typography: "{typography.label}"
    width: "{spacing.rail}"
  link-highlight:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    padding: "0 0.14em"
  link-highlight-hover:
    backgroundColor: "{colors.hazard}"
    textColor: "{colors.card-ink}"
  code-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.none}"
    padding: "0.12em 0.4em"
  screenshot-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.none}"
  desk-note-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-ink}"
    typography: "{typography.note}"
    rounded: "{rounded.none}"
    padding: "3.5rem 1.6rem 1.75rem"
    width: "min(29rem, 100%)"
  signature:
    textColor: "{colors.signal-text}"
    typography: "{typography.hand}"
  email-link:
    textColor: "{colors.ink}"
    typography: "{typography.headline-contact}"
  email-link-hover:
    textColor: "{colors.signal-text}"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "0.6rem 0.9rem"
---

# Design System: harrynicholls.com

## Overview

**Creative North Star: "A Letter, Then a Log"**

The page is a signed letter whose postscript is a numbered log of questions. The ground is photocopy-grey paper with no chroma, the ink is near-black, and every division is a 1px ink rule with square corners. Three voices do all the talking: Hyperlegible Sans says things, Space Grotesk in tracked caps counts and labels things, and a felt-tip hand in Signal red-orange signs them. The feeling is the calm of an instrument that works, with the warmth of a note left on a desk.

Colour is livery, not decoration. Signal marks the hand, the row numbers and whatever is open or under the pointer. Hazard is a highlighter pulled behind inline links. Track is the focus ring. Nothing else on the page has a hue, apart from the full-colour screenshots held inside ink rules and one ruled index card.

The system is one hand-written static page: one stylesheet of custom properties, no framework, no build step. Stories open through native `<details>`, so the page works with scripts off. Light and dark themes follow `prefers-color-scheme` and swap seven tokens; nothing else changes. The page rejects cream or beige "artisanal" paper, gradient text, glass cards, glow effects, and mono-on-black terminal dark mode.

**Key Characteristics:**
- Chroma-free grey ground, near-black ink, 1px ink rules, square corners throughout.
- Three type voices with fixed jobs: say (Hyperlegible Sans), count (Space Grotesk caps), sign (Casimir Dunmore).
- Three livery colours with fixed jobs: Signal for state and the hand, Hazard for the highlighter, Track for focus.
- A full-width caps greeting, then a narrow letter column pushed right, then a full-width log.
- Motion on one axis only: 3px nudges to the right and left-to-right wipes, no bounce.
- Flat everywhere except one tilted index card, the only object that casts a shadow.

### Open decisions

These three are built one way but are not settled. They are the owner's to decide and must not be read as system rules.

1. **Desk-note card: typed or handwritten.** The card is built typed in Hyperlegible Sans Bold because every alternate of the hand misreads at sentence length. Handwriting there needs the owner's approval of the typed card, or the sentences supplied as an asset in his own hand.
2. **The signature's capital H.** The signature uses the font's `ss03` alternate; the H is narrow and can read as a K. It needs sign-off or a vector of the real signature.
3. **The og:image.** It is the previous site's social card and does not match this page.

## Colors

A photocopy: greys with zero chroma for everything structural, and three saturated livery colours that each do one job.

### Primary
- **Signal** (`signal-text`, `signal-text-dark`): a red-orange felt-tip. It colours the signature and "Keep in touch", the row numbers, the question of an open or hovered row, hover states on plain links and captions, and the 1.5px underline under every inline link. On light paper it reaches 4.5:1 with almost no margin, so it must not be lightened; the dark theme swaps in a lighter value.

### Secondary
- **Hazard** (`hazard`, with `mark` and `mark-dark` as its translucent forms): an acid yellow-green highlighter. `mark` sits behind inline links at rest (60% alpha on light, 20% on dark); the full `hazard` fills the link on hover and colours text selection. Text on full Hazard is always the fixed near-black, in both themes.

### Tertiary
- **Track** (`track-text`, `track-text-dark`): cobalt. It is the focus ring and nothing else: a 3px solid outline offset 3px (inset 3px on log rows).

### Neutral
- **Paper** (`paper`, `paper-dark`): the page ground, and the opaque backing of a sticky open row.
- **Surface** (`surface`, `surface-dark`): one step off Paper. It backs inline code and sits behind screenshots while they load.
- **Ink** (`ink`, `ink-dark`): all body and display text, and every rule. Rules are Ink, not a separate grey.
- **Muted** (`muted`, `muted-dark`): secondary labels only: section rule heads, project names in the log, metadata keys, captions, the copyright line.
- **Card** and **Card Ink** (`card`, `card-ink`): the index card and its text. These do not change on dark: the card stays a light object on a dark desk. Card is the only surface with any warmth (chroma 0.004).

### Named Rules
**The No-Chroma Ground Rule.** Paper, Surface, Ink and Muted carry zero chroma in both themes. The page ground is never tinted warm or cool. The index card is the single warm-white object.

**The Livery Rule.** Each colour has one job. Signal marks state and the hand. Hazard highlights links. Track rings focus. None of them fills a panel, a button or a background area.

**The Text-Token Rule.** Signal and Track are applied through their `-text` tokens, which change on dark. Hazard and the card colours are fixed across themes.

## Typography

**Display Font:** Hyperlegible Sans (with Helvetica Neue, Arial, sans-serif)
**Body Font:** Hyperlegible Sans (same stack)
**Label Font:** Space Grotesk, variable 300 to 700, used at 500 (with Helvetica Neue, Arial, sans-serif)
**Hand:** Casimir Dunmore (with cursive)

**Character:** One legible grotesque does both the shouting and the reading, in Bold and Regular only. A second, more mechanical grotesque counts and labels in small tracked caps with tabular figures and a slashed zero. A felt-tip hand signs. All four files are self-hosted Latin subsets with `font-display: swap`; the two Hyperlegible weights are preloaded.

### Hierarchy
- **Display** (700, 11.2cqi of the hero column with a `clamp(2.6rem, 10.4vw, 7.8rem)` fallback, line-height 1, -0.045em, uppercase, nowrap): the greeting only. It fills the column edge to edge on one line; at 40rem and below it breaks to two lines at 19.4cqi, line-height 1.02. Its left edge is pulled out by its own tracking so the stem meets the rule above.
- **Headline** (700, `clamp(1.3rem, 2.7vw, 2.05rem)`, 1.12, -0.022em, sentence case, balanced): the question in each log row.
- **Headline, contact** (700, `clamp(1.45rem, 4.6vw, 3.4rem)`, 1.1, -0.03em): the email address, underlined at 0.07em.
- **Title** (700, 1.3rem, 1.2, -0.018em): sub-headings inside a story, with 2.4rem above and 0.6rem below.
- **Lede** (400, `clamp(1.25rem, 2.1vw, 1.5rem)`, 1.42): the first paragraph of the letter and of About, and each story's one-line summary (max 34ch).
- **Body** (400, 1.0625rem, 1.55): running text. Letter and About columns cap at 36rem; story paragraphs at 66ch; `text-wrap: pretty`.
- **Body small** (400, 0.95rem, 1.45): values in the story metadata column.
- **Label** (500, 0.74rem, 1.5, +0.06em, uppercase, `"tnum"`, `"zero"`): nav, section rule heads, row numbers, project names, metadata keys, tech lists (0.7rem), strip captions, footer row, "Back to questions".
- **Caption** (500, 0.8rem, +0.02em, sentence case): the line under a story screenshot. The label face without caps, because it is a full sentence.
- **Code** (500, 0.86em, `"tnum"`, `"zero"`): inline code, in the label face on Surface. There is no monospace face in the system.
- **Note** (700, 1.2rem on a fixed 28px line, -0.012em): the sentence on the index card; the line height equals the card's ruling.
- **Hand** (400, `clamp(3.4rem, 6.2vw, 4.6rem)`, line-height 1, `"ss03"`) and **Hand large** (400, `clamp(3rem, 7.4vw, 5.4rem)`): the signature and "Keep in touch", both in Signal.

### Named Rules
**The Three Voices Rule.** Hyperlegible Sans says things, Space Grotesk counts and labels things, the hand signs things. A fourth face is never added, and no voice does another's job.

**The Caps Rule.** Uppercase belongs to the greeting and to the label voice. Questions, sub-headings, the email and captions are sentence case.

**The Two Hands Rule.** The hand appears twice on a page, at word length: the signature and "Keep in touch". It is always Signal, always tilted, and never the only place a fact appears.

## Layout

One centred page, 76rem at most, with a fluid gutter (`clamp(1rem, 3.2vw, 2.5rem)`). Inside it there are two widths of attention. Full width belongs to things that are scanned: the nav, the greeting, the log, the screenshot strip, the contact block. A narrow 36rem column pushed to the right (right margin `clamp(0rem, 9vw, 8rem)`) belongs to things that are read: the letter and About.

The log is a four-column row: a number rail (3.4rem), the question, the project name right-aligned, and a 1.5rem toggle, on a 1rem gap, baseline aligned. Everything that hangs under a row (the story, the postscript) indents by rail plus gap so it lines up with the question, not the number. An open story is a two-column grid: a sticky metadata column (11rem to 15rem, topped with an ink rule) and the text column, with a `clamp(1.5rem, 4vw, 3.5rem)` gutter. Story images cap at 60rem and pair up in an auto-fit grid with a 19rem minimum. The screenshot strip is four equal columns on a 1.25rem gap.

Vertical rhythm is fluid rather than stepped: sections open with `clamp(3.5rem, 8vw, 6.5rem)` of space, the contact block with `clamp(4rem, 9vw, 7.5rem)`. Rows are tight (about 1rem above and below) so six questions read as one list.

Two breakpoints. At 52rem and below the story drops to one column, the metadata column stops sticking, the tech list runs in two columns, and the strip becomes two by two. At 40rem and below the rail narrows to 2.2rem and the gap to 0.6rem, the greeting breaks to two lines, the project name moves under its question, the story and postscript lose their indent, and the letter column takes the full width. Print lays every story open and removes the toggles.

## Elevation & Depth

Flat. Depth is carried by ink rules and by the single step from Paper to Surface. An open row's summary sticks to the top of the viewport on an opaque Paper ground with a rule beneath it; that is layering by rule, not by shadow.

### Shadow Vocabulary
- **Card on desk** (`box-shadow: 0 1px 1px oklch(0 0 0 / .12), 0 2px 4px oklch(0 0 0 / .08), 0 14px 28px -14px oklch(0 0 0 / .4)`): the index card only. A soft contact shadow plus a tucked drop, so the card reads as a physical object lying on the page.

### Named Rules
**The One Object Rule.** Only the index card casts a shadow, and only the card and the hand are tilted (card -1.4deg, signature -3deg, "Keep in touch" -2deg). Everything else is flat and square to the page.

## Shapes

Square corners everywhere: there is no border radius in the system. Structure is drawn with 1px Ink rules: under the nav, under each section head, between log rows, above the metadata column, above the footer row, and as a full frame around every screenshot. Underlines are 1.5px. The toggle is a plus drawn from two 2px bars, 0.95rem square, whose vertical bar collapses to leave a minus when the row is open. The one curved form is the spiral mark, a single 6.5-unit round-capped stroke with an arrowhead, drawn in `currentColor` at 1.6rem in the nav.

**The Hairline Rule.** Rules are 1px and Ink. They separate; they never box text in. The only framed things are images.

## Components

Quiet and mechanical: components are rows, rules and links, not boxes. Every interactive response is the same pair, a shift to Signal and a 3px nudge to the right, on `cubic-bezier(.16, 1, .3, 1)` over 350ms.

### Navigation
A single row above a 1px rule, in the label voice. Left: the spiral mark and the name, linking home; the spiral slides 3px right on hover (600ms). Right: one text link, "Write to me", underlined with a 1.5px Signal inset line, turning Signal on hover. No menu, no mobile variant; it is the same row at every width.

### Section rule head
A section's own heading set in the label voice, Muted, over a 1px rule. The log's head carries a bracketed count on the right. It is the heading itself: it is never stacked above a larger display heading as an eyebrow.

### Log row
The signature component. A native `<details>` summary laid out as number, question, project name, toggle, between 1px rules.
- **Rest:** number in Signal (label voice), question in Ink (headline), project name in Muted (label voice), plus toggle in Ink.
- **Hover:** the question turns Signal and moves 3px right.
- **Open:** the question stays Signal, the plus closes to a bar, the summary sticks to the top of the viewport on Paper, and the story wipes in left to right over 600ms (`clip-path`), the direction the spiral unwinds.
- **Focus:** Track ring, inset 3px.
- **Narrow:** the project name drops to a second line under the question.
- **Script:** none needed to open. A small script only opens the right row when a link or URL hash points into a story.

### Inline link (highlighter)
Links inside prose: no text decoration, a `mark` highlight behind the words with 0.14em of side padding, and a 1.5px Signal line along the bottom. On hover the highlight goes to full Hazard and the text to fixed near-black. Used in the letter, About, the postscript and stories. Links in the nav and footer row are plain label-voice links without the highlight.

### Story metadata
A narrow column topped by a 1px rule. Keys are label voice in Muted, each on its own line; values are body small. The tech list is label voice at 0.7rem, one item per line.

### Inline code
Label face at 0.86em on Surface, square, 0.12em by 0.4em padding. A paragraph made only of commands turns each into its own block (0.4em by 0.65em padding, 0.4rem apart).

### Screenshot frame
Screenshots run in full colour inside a 1px Ink frame on Surface, never tinted, cropped or rounded. In a story each is a link to the full-size file with a caption beneath that turns Signal and nudges right on hover. In the strip they are cropped to 3168:2176 with a label-voice caption and link to their story.

### Desk note (index card)
One ruled index card closing a story: warm-white, 29rem wide at most, tilted -1.4deg, with the card shadow. A red margin line sits 2.6rem from the top (`oklch(0.62 0.16 25 / .55)`, 1.5px) and blue rules repeat every 28px below it (`oklch(0.75 0.06 240 / .55)`); the text sits on those rules. No tape, pins or curl. It keeps its light colours on the dark theme. At most one per story; two of the six stories have one. Whether its text is typed or handwritten is an open decision (see Overview).

### Signature and sign-off
"Harry" in the hand, Signal, rotated -3deg from its bottom-left corner, closing the letter. With scripts and motion both on it is written once on load: a left-to-right wipe over 900ms after a 350ms delay. "Keep in touch" uses the same hand at -2deg as the contact heading. The `ss03` capital H is an open decision (see Overview).

### Contact block
The hand heading, then the email address as a large bold underlined link that turns Signal on hover, then a footer row over a 1px rule: label-voice links in Ink, the copyright line in Muted pushed right.

### Focus and skip link
Every focusable element gets a 3px solid Track outline, offset 3px. A skip link in Ink on Paper appears at the top-left on focus.

### Motion
One easing (`cubic-bezier(.16, 1, .3, 1)`), two durations (350ms for controls, 600ms for type and wipes), one axis. Movement is either a 3px shift right or a left-to-right `clip-path` wipe. Under `prefers-reduced-motion: reduce` all durations collapse and the signature is simply present.

## Do's and Don'ts

### Do:
- **Do** keep Paper, Surface, Ink and Muted at zero chroma in both themes, and let rules use Ink.
- **Do** give each colour its one job: Signal for state and the hand, Hazard behind links, Track for the focus ring.
- **Do** use the `-text` tokens for Signal and Track so the dark theme stays above 4.5:1.
- **Do** set anything that counts, labels or names in the label voice: Space Grotesk 500, 0.74rem, +0.06em, caps, tabular figures, slashed zero.
- **Do** answer hover with the same pair everywhere: Signal colour and a 3px move to the right, 350ms, `cubic-bezier(.16, 1, .3, 1)`.
- **Do** frame screenshots in a 1px Ink rule and leave them in full colour.
- **Do** build disclosure on native `<details>` so the page works with scripts off, and give every animation a reduced-motion path.

### Don't:
- **Don't** tint the page ground. No cream or beige paper; the index card is the only warm-white object.
- **Don't** round a corner or add a shadow to anything but the index card.
- **Don't** use Signal, Hazard or Track as a panel, button or section fill.
- **Don't** set sentences in the hand, use it more than twice on a page, or let it be the only place a fact appears.
- **Don't** set questions or sub-headings in caps; caps are for the greeting and the label voice.
- **Don't** add a fourth typeface or a monospace face; code uses the label face on Surface.
- **Don't** use gradient text, glass cards, glow effects, or mono-on-black terminal styling.
- **Don't** add bounce, vertical slides or fades; motion is a rightward nudge or a left-to-right wipe.
