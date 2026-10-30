# Paper stack

The source for the live portfolio homepage and its standalone design exploration. Open <http://127.0.0.1:3031/design-exploration/paper-stack/> while serving the repository root on port 3031.

The first visit starts as **A personal letter**, with no papers in the bottom-right. After 550ms, its top-left corner lifts and settles with a short spring. The corner belongs to the document and scrolls away as the visitor reads. Click the corner to play the peel, or drag it down/right. Release below 36% of the viewport diagonal to spring back; release beyond that point to finish. Dragging remains reversible until release. Each newly exposed sheet has a slightly different resting angle and spring frequency.

The initial page order is Letter → Signal press → Dot matrix → Project atlas → Working index → HTML, finally. Each view has exactly one location: current page, underneath the current page, or discarded in the corner sheaf. HTML stays at the bottom of the main pages and never enters the sheaf or gets a curled corner. The last sheet uses browser-default serif text and blue hyperlinks, with native reset buttons. A centered reading measure, comfortable leading and bounded screenshots keep it usable without losing the raw HTML character.

A discarded sheet leaves briefly, then arrives as a printed paper corner in the bottom-right. The sheaf stays within reach while reading. Hover, focus, or a first tap opens a nested fan against the viewport corner. The open fan exposes a generous strip of every sheet in a fixed order. Hover or keyboard focus slides only the printed face of the selected paper 28px to the left in 260ms. Its button remains anchored and the extended paper is also clickable. Other sheets never move or change depth on hover. There is no delayed reordering, pointer tracking or hover timer. Selecting a paper pulls its full-size printed back across the page, flips it edge-on to reveal the live front, and settles it onto the current view. The previous current page stays underneath the retrieved sheet. Only peeling a sheet adds it to the corner sheaf. There is one paper per discarded styled view, with no visible labels. Views still in the main deck never appear in the corner sheaf. Its print and palette identify it. Future views are discovered by peeling rather than pre-populated in a menu.

The current view, ordered main-page deck and ordered discarded papers are saved in localStorage. Retrieving a paper removes it from the sheaf and places it on top of the current main-page deck. Peeling reveals the next actual sheet in that deck rather than the next theme in the original numeric sequence. Reset returns to the letter and empties the sheaf; `?reset` does the same. Earlier saved visits migrate to disjoint page/sheaf locations; any stored HTML paper is removed from the sheaf. If HTML is current, all five styled sheets are discarded.

Each theme includes the full biography, links, six projects, six original case studies and original screenshots. The letter holds complete notes inside its question disclosures; the other styled sheets have native case-study disclosures. Project navigation opens the relevant story in the current theme. Changing themes carries the current section across when it has an equivalent. Search, filters, image treatment controls and the technology matrix remain functional.

These are isolated copies. The original five studies are preserved, except for the explicitly requested restoration of Working index to its exact pre-refinement hash. Production source is untouched.

## Implementation

- `index.html`: the stack, physical corner, view controls, source-comment wave and no-JavaScript theme links.
- `paper-stack.js`: gesture lifecycle, timing, keyboard access, theme persistence and section matching.
- `peel-geometry.js`: document-coordinate clipping against the fold plane and reflection of the lifted part of the sheet.
- `paper-materials.js`: six low-contrast reverse prints and the existing theme palettes.
- `paper-state.js`: exclusive page/sheaf locations, retrieval, peel order and saved-session repair.
- `paper-sheaf.js`: paper arrival, nested fan navigation, mouse-only hover lifting, touch opening, focus and arrow-key behavior.
- `paper-return.js`: actual corner-pose capture, flexible-renderer orchestration and a matte fallback. The live iframe is never moved or reloaded.
- `paper-snapshot.js`: a temporary viewport picture of the selected theme, including visible images and the current scroll position.
- `paper-flex.js`: connected sheet geometry with integrated tangent angles, twist and inextensible strips.
- `paper-webgl.js`: a short-lived, matte two-sided mesh; diffuse lighting, bounded texture resolution and cleanup after landing.
- `paper-stack.css`: the stack and floating paper/controls. Shading and shadows model the lifted paper rather than decoration on the portfolio.
- `themes/`: complete, independently readable theme documents; inactive sheets are inert and hidden from accessibility APIs.
- `build-themes.py`: regenerate the isolated documents from the existing studies and original project stories. Never writes to the originals. Run with `python3 design-exploration/paper-stack/build-themes.py` from the repository root.

The active and upcoming pages are real HTML documents, clipped at the crease. The reverse side is drawn as a shaded SVG surface reflected across the same crease. This is a lightweight geometric paper approximation, not a cloth simulation. Only the active and next sheets load initially; later sheets load as needed. No framework, package dependency or external animation service is used. The forward peel uses live HTML and SVG. Returning a paper uses a transient picture on a deforming mesh, then restores the original live HTML without moving, reloading or replacing its iframe.

The corner reverse carries a quiet repeating print: muted red pluses, dark diagonal strokes, dots, blue squares, green index lines, or blue angle brackets. The print follows the reflected paper geometry. Approaching the corner gently raises it, with a short return on exit. A contact line at the crease and a shadow whose reach follows the lift give it depth without idle movement.

The matte flexible treatment preserves the stable fan and its 28px pull-out. Selection now uses a connected 64 × 16 mesh over 1650ms. Its tangent changes across the sheet, so the leading edge, middle and trailing edge have different orientations during the turn. Text and images follow that curvature. The sheet flattens onto the original live page, then its corner lifts. Glossy sweeps, inset highlights and reflected-light overlays have been removed. The only moving surface lighting is diffuse shading derived from its orientation. If HTML capture or WebGL is unavailable, a matte DOM turn preserves navigation.

Reduced motion shows the resting corner without a bounce and changes the sheet immediately, without card flights. Native paper buttons have accessible view names, visible focus, arrow-key navigation and Escape dismissal. They have no visible text labels. The corner precedes the page in keyboard reading order. Without JavaScript, the first full letter remains readable and all six standalone themes are linked. Storage-disabled visitors can still use the experiment. The wave comment is also printed with its greeting in the developer console.

## Validation

```sh
node --test design-exploration/paper-stack/tests/geometry.test.mjs design-exploration/paper-stack/tests/history.test.mjs design-exploration/paper-stack/tests/flex.test.mjs
node design-exploration/paper-stack/tests/browser.mjs
node design-exploration/paper-stack/tests/sheaf-browser.mjs
node design-exploration/paper-stack/tests/polish-browser.mjs
node design-exploration/paper-stack/tests/flex-browser.mjs
node design-exploration/paper-stack/tests/locations-browser.mjs
node design-exploration/paper-stack/tests/peel-polish-browser.mjs
node design-exploration/paper-stack/tests/scroll-browser.mjs
```

Run the browser checks from the repository root with Node 22+, Chrome/Chromium and the repository served on port 3031 (`python3 -m http.server 3031 --bind 127.0.0.1`). They use the installed design-taste-frontend skill’s dependency-free CDP client; set `DESIGN_TASTE_SKILL` to its directory if it is not installed under `~/.agents/skills/`. `CHROME_PATH` can select a browser executable. `PAPER_STACK_URL` can point the tests at a different server. See [site checks](research/browser-checks.txt), [sheaf checks](research/sheaf-browser-checks.txt), [polish checks](research/polish-browser-checks.txt), [current stable fan review](research/stable-fan-review.md), [earlier polish review](research/polish-review.md), [earlier hover/flip review](research/paper-flip-review.md) and the [earlier design review](research/design-review.md).

The [flexible paper review](research/flexible-review.md) and [flight checks](research/flex-browser-checks.txt) cover the latest material and motion treatment. The stable fan review still applies to navigation geometry.

This is a local design study. Nothing has been deployed.

The [page-location checks](tests/locations-browser.mjs) verify repeated retrieval, dynamic curl targets, bare HTML as the permanent floor, reload, reset and migration of old saved sessions. The [location review](research/locations-review.md) describes the state change.

## Site homepage

The paper stack is the main site experience. `npm run build` generates `src/index.html` and `src/portfolio-views/` from this source and the shared theme files. `npm run deploy` runs that build before the existing static upload. The root homepage keeps canonical, social and structured metadata from `site-head.html`; only standalone theme documents retain `noindex`.

To review the deployable site locally, run `npm run build`, then `python3 -m http.server 3033 --bind 127.0.0.1 --directory src` and open `http://127.0.0.1:3033/`. Set `PAPER_STACK_URL=http://127.0.0.1:3033/` to run browser checks against the actual homepage. Browser checking still needs access to the source tree for its preservation fixtures. Edit source files here rather than the generated copies in `src/portfolio-views/`.

This integration supersedes earlier research notes describing the stack as an isolated local-only study. Those notes are historical validation records. The gallery remains available under `design-exploration/`, while the deployed root serves the full paper experience directly. No deployment is performed by creating the PR.
