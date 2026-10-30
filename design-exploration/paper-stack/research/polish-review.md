# Paper and raw HTML refinement

Historical review. The delayed layering described below was replaced after user feedback; see [stable fan review](stable-fan-review.md).

The user's screenshots showed a clipped shadow above a tilted paper and a dashed rectangular focus outline around the curl. Hovering a sheet also obscured the papers behind it. The raw HTML ending had overly large screenshots and an uncomfortable full-width text measure.

ROUND 1 — final
Seen in one second: a readable browser-default home page with a quietly printed paper stack at the edge.
Idea (one sentence): Harry's alternate portfolio styles become physical sheets that can be discarded and retrieved.
Live thing: peel the current page, or retrieve a visited view from the paper fan.
Layout words by section: introduction=plain document / projects=native list / biography=reading column / case studies=stacked text and bounded images.
Scores: design 7.5 · usability 8 · creativity 9 · content 9 → overall 8.0
Caps applied: raw HTML intentionally keeps native document hierarchy and rules; this component refinement follows the existing direction without another draw.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. User's stack screenshot: filtered paper shadow ended in a rectangular clipping boundary. Replaced the composited drop-shadow with a local box-shadow that follows the transformed sheet. Final Chrome screenshot `promoted-papers.jpg` has continuous edges. Safari has not been separately tested.
2. User's corner screenshot: keyboard focus appeared as a dashed box. Focus now highlights the SVG fold edge only for keyboard users. `keyboard-fold.jpg` shows the shape cue without the rectangle.
3. Raw ending: oversized images and loose alignment made the joke harder to use. `bare-desktop.jpg`, `bare-tablet.jpg`, `bare-mobile.jpg` and image-section screenshots show a centered 46rem column, 1.5 text leading, compact heading leading and aspect-preserving images no larger than 640 × 400px.

Hover raises papers behind the pointed sheet after 340ms and moves their physical fan slots along with their depth. An initial z-order-only implementation left one paper inaccessible; changing the slots resolved that. Real pointer checks confirm all five papers remain exposed after repeated promotions. Pointer intent is stable when the papers move beneath a stationary cursor. Closing the fan restores chronological order. Keyboard focus uses the same promotion; touch opening and selection retain their existing behavior.

Final focused browser checks pass at 1440, 768 and 390px with no horizontal overflow or runtime exceptions. The complete site suite passes for all six themes. Geometry/history/layer unit checks: 13 passing. Source lint: zero failures and warnings. Structural delta: zero regressions of existing symbols; callback/getter reachability and shared timer cleanup are advisory findings. Original studies and shared assets retain their preservation hashes. No new imagery, sample content or dependencies were introduced.

Screenshots are local working artifacts in `.taste-skill/paper-polish/final/`. This review supersedes the prior hover/flip review for focus, shadows and delayed fan layering. Nothing has been deployed.
