# Nested hover and a full-size paper turn

The two supplied sketches replace the earlier row-like fan with nested corners cropped by the bottom and right viewport edges. The selected hover sheet pulls farther out and tilts; nearer sheets remain in front. Clicking lifts that sheet out of the pile and turns its printed back over to reveal the live page.

The existing directions are retained. This is a reference-led component refinement, so there was no new direction draw or palette redraw. No page content, standalone direction or production source was changed. No new photographs, sample content or downloaded artwork were added.

On this page, a previously opened portfolio view becomes a full-size sheet pulled from the physical history of the site.

## Implementation decisions

- The expanded fan remains anchored outside the viewport. Its visible top-left corners form nested steps, matching the sketches. Individual hover/focus adds a stronger 18-degree tilt, slight bow and further pull; it preserves the papers’ depth order until selection.
- Mouse hover lifting is explicitly separated from touch. A first tap opens the fan without a sticky hover state; the next tap selects. Actual 44px exposed targets are verified at 390px and also checked at 320px.
- A return is not a thumbnail zoom. The selected paper stays viewport-size throughout. Its initial top-left corner and ink scale match the actual corner being selected, even if a hover transition is unfinished.
- The printed reverse moves across the page before turning. Opposite faces use synchronized perspective rotations; the live front is hidden until the sheet turns past edge-on. The edges bow slightly, lighting moves across the reverse, and a temporary shadow gives the lifted paper depth.
- The iframe is never reparented or reloaded. Existing controls, case-study disclosures and page state remain intact. The view and paper history update when the return finishes. Reduced motion skips the flight and lighting entirely.
- The document-anchored curl, small initial pile, no visible card labels, accessible names, keyboard navigation, persistence and reset remain intact.

## Critique

ROUND 1
Seen in one second: a fan tucked into the corner, with one sheet pulled farther out.
Idea (one sentence): the discarded sheet returns as paper rather than growing like a tile.
Live thing: hover an exposed corner, pull the selected reverse across the page, and turn it to its live front.
Layout words by section: collapsed=nested corner slivers / open=nested reverse-up sheets / individual hover=lift and tilt / return=back, edge, front, flat page.
Scores: design 8 · usability 8 · creativity 8.6 · content 8 → overall 8.1.
Caps applied: component review; the approved portfolio typography and content are unchanged.
Top three problems (most visible first), each with evidence and fix:
1. A generic fully visible fan contradicted the cropped L-shaped arrangement in both sketches. Replaced it with a shared corner anchor and layered, partially offscreen sheets (`hover-pile.jpg`, `hover-letter.jpg`).
2. The old return showed page content immediately and scaled it from a small tile. Replaced it with two faces of a full-size sheet, exposing the printed reverse first (`return-0.jpg` through `return-550.jpg`).
3. A shadow attached to a clipped face was itself clipped away. Added a synchronized cast-shadow layer behind the moving paper (`return-250.jpg`, final capture).

ROUND 2
Seen in one second: a restrained physical pile; individual sheets move while the rest stay nested.
Idea (one sentence): select the material first, then turn it over into the complete site.
Live thing: nested hover and an uninterrupted back-to-front turn.
Layout words by section: corner pile / lifted sheet / reverse across page / edge-on / live front settling flat.
Scores: design 8.3 · usability 8.2 · creativity 8.7 · content 8 → overall 8.3.
Caps applied: the low-contrast print and existing reading scale remain deliberate choices.
Top three remaining tradeoffs:
1. The paper is a perspective-and-bowed-edge approximation, not a cloth simulation. The selected sheet keeps its size and has a real reverse/front relationship.
2. The open fan covers a portion of the page by design, as in the sketches. It appears on intent, closes on an outside interaction or Escape, and remains small while reading.
3. Exact theme names remain nonvisual. Palettes and prints identify the sheets visually; native button names and focus supply precise identities to assistive technology.

These are self-critique scores, not external evaluations.

## Checks and evidence

- Both full browser suites pass: the six complete site themes and the sheaf’s mouse, touch, keyboard, history, reset, scrolling and reduced-motion behavior.
- Tests now search actual exposed corners rather than assuming entire sheets are visible. Every paper remains selectable at 1440, 768 and 390px; narrow-phone 44px targets were additionally checked at 320px.
- The return test verifies that the front initially faces away, the printed reverse exists, the paper does not scale down, the iframe remains under its original parent, and a live-window state sentinel survives the turn.
- Nine existing geometry/history/material tests pass. Source lint reports 0 FAIL, 0 WARN for the changed host and return files. Floating-paper shadows and temporary material lighting are intentional physical effects requested by the user.
- Visual review includes both supplied sketches, closed and nested hover states, an individual lifted sheet, mobile interaction and synchronized captures at 0, 250, 450, 480, 550, 850, 1100 and 1349ms. The edge-on and front-facing phases were inspected directly.
- The page layouts and content remain those already inspected in the earlier rounds. Host interaction checks inspect the actual frames and controls; the general page inspector cannot measure typography inside those frames.
- Structural checks have no gating regression. Existing callback/getter findings and the handled storage fallback were reviewed. Preservation hashes confirm the five standalone variants and shared styles are unchanged.

Local evidence: `.taste-skill/paper-flip/`. Current automated results: [site checks](browser-checks.txt) and [paper checks](sheaf-browser-checks.txt).
