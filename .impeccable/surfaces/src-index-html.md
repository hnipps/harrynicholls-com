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

THESIS: A resume set like a well-made page. One column, a serif for the name and a sans for the reading, one ink. It refuses the developer-portfolio arrangement of hero, project cards and skill badges, and it refuses a governing metaphor.

OWN-WORLD: Chosen by the user in the type lab. Both palettes were tuned by the user in the lab's Colour tab and share one key hue (260, blue) with a red accent 120 degrees away (hue 20), a triadic relation. Light is Blue ink: saturated blue ink on near-white paper, red for underlines and marks. Dark is Blue night: pale blue ink on near-black navy, a coral mark. It follows the reader's system setting until they use the switcher, which is then remembered. The switcher is the dot of the "i" in the name: a sun by day, a moon by night. The name is set in Instrument Serif; everything else in Hyperlegible Sans, upright for the record and italic for section heads and asides. No cards, no boxes. The only icons are the five contact glyphs and the switcher's moon and sun. Beyond the one blue and the one red mark, colour arrives only with the album covers and photos; until they exist the galleries wait as one row of blank tiles in a single paper tint.

STORY: The reader learns who Harry is in two sentences, sees where he has worked and what he built on his own, then sees a year of real commits, his records and his photos, and knows how to write to him.

FIRST VIEWPORT: The name at display size, outdented on wide screens so it starts at the left edge of the page, in line with the hairlines and the margin heads. Four short intro paragraphs under it at body size, in the text column, in Harry's own words. Then a row of five icon links: email, GitHub, LinkedIn, Substack and X. Selected work begins at the fold. Section heads hang in the left margin on wide screens.

FORM: The category standard, chosen by the user as the standing exit (the plain personal page, after hamiltonulmer.com). seed: none (unavailable). The roll ran degraded, with no challengers and no catalog, and printed no seed reference. Signature interaction: the commit graph inks in week by week when the reader scrolls to it, as dots sized by the day's count, and names the day under the pointer or finger. On a phone the year stacks into two half-years so a day stays big enough to touch. Build path: code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
