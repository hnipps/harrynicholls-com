---
version: 1
slug: "src-index-html"
primary_target: "src/index.html"
related_targets: []
---

# Home page: resume with character

Scope: `src/index.html`, the whole home page. Visitor mode: Read.

Audience and job: a hiring manager, recruiter or screening agent gives the page about a minute and leaves knowing Harry's track record and how to reach him. Peers and potential gitrove or Crosscheck users are second.

Content, in order: name, intro and contact above the fold; selected work (employment); side projects; commit graph; albums; photos; writing; contact again in the footer. Everything is in the HTML in reading order and works with JavaScript off.

Constraints: static HTML in `src/`, generated regions rebuilt by `scripts/build-home.py`. Albums and photos are placeholders until Harry supplies them. No phone number. No colleague names.

Unresolved: the album list, the photo files, and Harry's own wording for the link asides.

## Direction contract

THESIS: A resume set like a well-made page of a book. One column, one typeface, one ink. It refuses the developer-portfolio arrangement of hero, project cards and skill badges, and it refuses a governing metaphor.

OWN-WORLD: Blue-black fountain-pen ink on cool white paper, with a proofreader's persimmon pencil for underlines and marks. Literata throughout, roman for the record and italic for section heads and asides. No cards, no boxes, no icons beyond one copy mark. Colour arrives only with the album covers; until they exist the galleries wait as one row of blank tiles in a single paper tint.

STORY: The reader learns who Harry is in two sentences, sees where he has worked and what he built on his own, then sees a year of real commits, his records and his photos, and knows how to write to him.

FIRST VIEWPORT: The name at display size, outdented on wide screens so it starts at the left edge of the page, in line with the hairlines and the margin heads. Two intro paragraphs under it, in the text column. Then the email address with a copy control and four labelled profile links, each with a short aside. Selected work begins at the fold. Section heads hang in the left margin on wide screens.

FORM: The category standard, chosen by the user as the standing exit (the plain personal page, after hamiltonulmer.com). seed: 16369518 (the key the roll printed; it ran degraded, with no challengers and no catalog). Signature interaction: the commit graph inks in week by week when the reader scrolls to it, as dots sized by the day's count, and names the day under the pointer or finger. On a phone the year stacks into two half-years so a day stays big enough to touch. Build path: code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
