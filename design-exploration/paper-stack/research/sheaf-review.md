> The hover arrangement and return flight have since been refined from the user’s two sketches. See [the current hover/flip review](paper-flip-review.md).

# Printed reverses and discarded-paper navigation

The current paper-stack experiment keeps its six complete portfolio documents and refines the physical navigation. The existing directions and seeds are retained; this is a component refinement with a user-specified paper metaphor, so there was no new direction draw.

On this page, Harry’s previously opened portfolio views become a small, usable sheaf of discarded paper.

## Decisions

- The curl belongs to the document’s top. Its position, reflected print and clipping plane account for the active document’s scroll. It leaves the viewport as the visitor reads; there is no persistent notch in the upper-left corner.
- The sheaf belongs to the viewport. It starts empty and appears only after the first discard. Each outgoing view leaves the page, stays offscreen briefly and arrives as a paper corner at the bottom-right.
- A paper is identified by its existing palette and a quiet reverse-side print: red pluses, dark diagonal strokes on acid yellow, dots, blue squares, green index lines or blue angle brackets. Print opacity is 12–22%. No new photos, footage, downloaded art or sample content were introduced; these are code-drawn navigation materials.
- Hovering or focusing expands the sheaf. On touch, the first tap opens it and a subsequent tap chooses a paper. The expanded fan has a stable hover region; on phones, vertical separation exposes a 44px band for each sheet.
- Selecting a discarded paper animates its live HTML document back into the page. That paper leaves the sheaf and the outgoing view becomes the newest paper. There is one paper per visited view, excluding the active view. Future views are discovered through the corner.
- The chosen view and ordered history are remembered. Existing saved views migrate to a sequential history. Reset restores the letter and clears the sheaf.
- No visible text labels are printed on the papers. Every paper is a native button with an accessible view name. Focus spreads the papers; arrow keys, Home and End move through them; Escape dismisses the fan. The corner is first in keyboard reading order. Reduced motion switches views without bounce or paper flights.

The user explicitly requested printed patterns and physical paper surfaces. The patterns, reverse shading and floating-paper shadows are purposeful materials for this interaction. The underlying theme layouts, source content and standalone variants remain unchanged.

## Critique

ROUND 1
Seen in one second: the approved letter, now without a persistent change-view label.
Idea (one sentence): the discarded views accumulate as printed stationery that can be brought back.
Live thing: peel, collect, fan and restore the real portfolio documents.
Layout words by section: document=existing portfolio / top corner=document anchored / paper backs=quiet repeated print / sheaf=small viewport corner / expanded selection=overlapping papers / return=live page flight.
Scores: design 8 · usability 7.7 · creativity 8.7 · content 8 → overall 8.1.
Caps applied: reviewed as an interaction component within the approved themes, rather than redrawing the complete pages.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A narrow mobile fan exposed insufficient width per paper (first `mobile-spread.jpg`). Added vertical separation so each paper has an exposed 44px band, including at narrower phone widths.
2. The return flight hid the old curl but retained its corner cutout (`final/paper-return-mid-flight.jpg`, early capture). The outgoing background now becomes flat while the selected live page returns.
3. The page preceded the curl in keyboard order (before markup). Moved the native corner button ahead of the frame, verified with a real first Tab press.

ROUND 2
Seen in one second: a calm letter with a faint plus-printed curl; the sheaf appears only after an intentional change of view.
Idea (one sentence): the paper itself is the navigation history.
Live thing: reversible peel, timed discard arrival, stable fan and animated restore.
Layout words by section: unchanged approved documents, with document-anchored corner and viewport-anchored history.
Scores: design 8 · usability 8.2 · creativity 8.7 · content 8 → overall 8.2.
Caps applied: the user’s existing small-scale reading style is retained; no unrelated entrance animation was added to the content.
Top three problems (most visible first), each with the screenshot it shows in and the decision:
1. The cards identify the views through material and print rather than a miniature page front (`final/five-papers-spread-desktop.jpg`). This is deliberate: the discarded sheet is reverse-up, and its exact name remains available to assistive technology.
2. The open phone fan covers some reading content (`final/five-papers-spread-mobile.jpg`). It opens only on intent, provides full targets and dismisses on an outside tap or Escape; the collapsed version remains small.
3. The reverse remains a shaded geometric paper approximation (`final/paper-return-mid-flight.jpg`). A material/cloth simulation is outside this lightweight, live-HTML experiment.

These are self-critique scores, not external evaluations.

## Verification

- Nine geometry, history and material tests pass, including a scrolled-away fold, unique papers under repeated navigation and one distinct, low-contrast print per view.
- [Sheaf browser checks](sheaf-browser-checks.txt) pass for fresh state, document anchoring, print reflection, delayed arrival, fixed-position history, real mouse hover/click, live return animation, history ordering, no duplicates, three viewport widths, touch, keyboard, persistence and reset.
- The full six-theme site regression suite passes with navigation adapted to the sheaf. It retains project links, complete cases, search, filters, matrix controls, touch peeling, reading context, storage-disabled behavior and the no-JavaScript fallback.
- The fan is visually reviewed and its buttons are within the viewport at 1440, 768 and 390px. Every mobile paper’s exposed target resolves to that paper in the browser hit test. No button has visible text; all have accessible names.
- First Tab reaches the corner. A focused return-flight check confirms that no orphaned cutout remains on the outgoing page.
- Source lint: 0 FAIL, 0 WARN for the six changed/new host and geometry/material files.
- The approved letter document also passes its normal three-width inspection with 0 unaccepted FAIL, retaining the existing small-heading/still-page adaptations. Its three existing warnings concern the approved cream/small masthead and absent documentary footage. The inspector cannot measure inside host iframes; the new host geometry and navigation are measured directly by the browser checks.
- All final host screenshots and the letter’s fold/full-page captures were visually reviewed after the changes. Local evidence is under `.taste-skill/sheaf/`.
- Preservation hashes confirm that the five original variants and shared style files remain unchanged.
- Structural check: no gating regression. New-code findings were reviewed: callback/getter detection, a class-length advisory, nested-binding duplication detection and the deliberately handled localStorage failure. These do not indicate broken behavior.

The stack is still a local experiment. Production source and the separate style gallery are preserved.
