# A personal galaxy

## Intention

Harry's projects become stable places within one personal galaxy. A visitor can travel through the work and understand how the projects relate, while still finding a case study or contact link directly.

The user chose gitrove's restrained dithered astronomical atmosphere, destinations at both section and project scales, and a comparison of multiple arrival behaviours. This storyboard develops those decisions without selecting a final arrival.

## The experience

Overview → Work region → approach gitrove → arrive and read → return.

Work, About, Writing, and Contact are named regions. Work reveals six individual project stars: gitrove, Crosscheck, Recommender, opsdeck, GoHome, and LLM Cover Letters. The camera travels during navigation and rests for reading. Native navigation buttons and stars share destinations. URL fragments restore project, moment, and arrival treatment; browser history returns to earlier states.

The five moment controls show individual compositions. Play the journey sequences them automatically; any manual navigation stops playback. Pause the sky freezes background drift. Reduced motion starts with the sky paused and skips camera transitions. The phone composition gives labels explicit positions and content a vertical reading order.

## Three arrivals

- **Beside the star:** a project page beside a visible anchor; strongest orientation, narrower text/image composition.
- **The reading space:** the destination opens into a broad reading surface with space around the edges; strongest for longer case studies.
- **Around the star:** separate title, prose, screenshot, and links form a local exhibition; strongest spatial feeling, more reading distance on a phone.

All three use the same actual gitrove screenshot and project summary. Other stars link to the original case studies. Crosscheck has no fabricated interface. About, Writing, and Contact use existing biographical content and destinations.

## Scope and technical boundary

This is an interactive visual storyboard, implemented with Canvas 2D and native HTML overlays. It does **not** implement the new HTML-in-Canvas API. It explores the intended geography, motion, and reading experience first.

Next, validate the chosen reading surface with the [Chrome HTML-in-Canvas API](https://developer.chrome.com/docs/web-platform/html-in-canvas): drawable HTML geometry, native links/focus, text selection, hit testing, camera transforms, feature detection, and the equivalent ordinary HTML experience. Confirm current browser support as part of that work. Long case studies currently open on the shared story page; their full in-galaxy reading behaviour is still a design decision.

This prototype intentionally uses authored responsive label placement. It does not yet demonstrate one geometrically continuous layout for every label throughout a flight. The camera targets are fixed; there is no free-flight control or drag-to-pan. These are remaining implementation questions, not proven API capabilities.

## Art direction and assets

The visual reference is [gitrove](https://gitrove.com): near-black, slate dots, sparse pale blue square destinations, restrained orbital marks. No nebula stock image, gradient glow, invented telemetry, or space-game interface. The functional stars are destinations.

Supporting direction draw: seed 7340, pinned-poster composition, palette/type retained for the explicit reference-led brief. Its held spatial composition informs the destination; scroll-driven page blueprints are not imposed on this navigation study.

Project screenshots come from the repository's existing `src/assets/`. The astronomical field is drawn in code. There are no third-party image assets in this concept.

## Review

ROUND 1
Seen in one second: a quiet star field with Harry's name and named places.
Idea: Harry's projects have addresses inside a personal galaxy.
Live thing: camera travel, two-scale star navigation, three selectable arrivals.
Layout words by section: introduction=split / journey=spatial stage / arrivals=comparison / notes=reading.
Scores: design 7.5 · usability 7.5 · creativity 7 · content 8 → overall 7.45.
Caps applied: creativity capped at 7 because a personal galaxy remains adaptable to another portfolio; this study does not claim the concept is unique to Harry.
Top three problems:
1. Work repeated the homepage context and CTA (`journey-work.jpg`); hide those in the Work region.
2. The open-arrival star sat too close to the phone edge (`open-mobile.jpg`); move its anchor inward.
3. The notes heading wrapped to three lines on tablet; shorten it to “The journey”.

ROUND 2
Seen in one second: the intended restrained astronomical field and a readable project destination.
Idea and live thing unchanged.
Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 7.6.
Caps applied: creativity capped at 7; the galaxy is a familiar metaphor. Long phone reading distance remains visible in Around the star. The 7.6 score describes this exploration, not a launch-ready portfolio.
Remaining questions: which arrival feels most like Harry, how much local exploration to allow, and how full case studies stay in the galaxy. No winner has been committed.

## Validation

Browser checks and screenshots cover 1440, 768, and 390px. The suite checks four section stars, six project stars, each arrival, section navigation, a direct About URL, all five storyboard controls, pause/resume, playback start/stop, console errors, and the shortlist's local links. Desktop and phone arrival captures are included alongside tablet captures. Inspector results are recorded in the local `.taste-skill/galaxy-review/` folder.

Production source, deployment configuration, and dependencies were not changed in this round. Nothing was deployed or committed.

Final visual inspector: zero FAIL and two accepted review-tool warnings. “below-fold” is intentional because the journey is followed by three detailed comparisons; “app-title-size” is intentional because the outer page introduces a design exploration rather than an operational dashboard. The galaxy stage itself is a functional interface fragment. A final mobile pass moved Contact above the status text. On tablet, Beside the star deliberately scrolls inside its reading panel; its content remains reachable.

Structural check: `ripwire . --quality-delta` reports no worsening of existing symbols. Its new-symbol findings include the particle drawing loop (complexity 16), callback entry points it cannot resolve as callers, and generated research JSON. The particle loop's projection/culling/colour branches are local to rendering; no unrelated refactor was made to change the metric. JavaScript syntax, source lint, local links, and whitespace checks pass.
