> Historical review of the initial experiment. The current navigation and document anchoring are covered in [the sheaf refinement](sheaf-review.md).

# Paper stack: design and validation

## Intention

A complete personal site comes first. The corner is a brief invitation to discover a second voice. Each peel reveals the same person and the same work, and the final browser-default page makes the layers of presentation the joke. Visitors may stop on any sheet, jump directly to another view or reset. Their last selection is remembered at their request.

On this page, Harry’s collection of portfolio directions becomes a stack of working paper documents.

The approved direction sheets are retained: The page is the object (7311), The name as a monument (7320), and the existing dot-matrix, data-atlas and quiet-index directions. There was no new direction draw: the user supplied the interaction, opening style, first reveal, ending and preservation constraints. Working index was restored by matching its recorded original SHA-256, not by approximating its previous styling.

Subject inventory: Harry Nicholls; engineering at ev.energy; Toronto-area remote practice; three children; woodworking; independently useful software; gitrove’s GitHub digest; Crosscheck’s code verification; Recommender’s personal film taste; opsdeck’s pull requests; GoHome’s home server; LLM Cover Letters’ writing tools.

Argument: introduce the engineer → six actual projects prove the practice → personal context → complete original technical stories → direct contact. All six themes carry this content. All screenshots are existing project assets; the HN raster is the existing Dot matrix artwork. No found photos, invented metrics, testimonial content or sample projects were added. The source-comment ASCII is an original sketch after Hokusai’s Great Wave, credited there, and also printed as the console greeting.

## Interaction decisions

- First lift starts after 550ms and settles about 1.4 seconds after the module starts. No image loading gates it. Browser timing check confirms a visible fold within two seconds.
- The underlying sheet is actual HTML, not a screenshot. Its controls become active after the peel. Hidden sheets are inert and excluded from accessibility APIs.
- Dragging follows the pointer and can reverse continuously. Release beyond 36% of the viewport diagonal commits; shorter or cancelled drags spring back. A click or keyboard activation plays the same transition automatically.
- Rest position and spring frequency vary slightly by sheet. No recurring bounce or forced theme change interrupts reading.
- The current section is carried across themes, including the gitrove ID alias on the raw page. Reset returns to the letter’s top.
- Reduced motion removes the bounce and the automatic travel. No-JavaScript visitors receive the full letter and links to all six standalone documents. Storage failures do not prevent changing views.
- Change view supplies a direct, keyboard-accessible alternative to sequential peeling.

## Critique

ROUND 1
Seen in one second: the approved personal letter, with a small yellow corner beneath it.
Idea (one sentence): peel away the presentation to reveal other complete versions of the same person, then arrive at plain HTML.
Live thing: a reversible physical paper peel, plus the real controls inside every theme.
Layout words by section: opening=approved letter / corner=small floated paper surface / reveal=full-window live page / project reading=same-theme complete documents / ending=browser-default HTML.
Scores: design 7.5 · usability 7.5 · creativity 8.5 · content 8 → overall 7.8.
Caps applied: underlying documents intentionally retain the approved modest headings and still reading surfaces; the signature motion belongs to the stack.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A synthetic focus ring remained around the corner after mouse dragging (`desktop-after-drag.jpg`). Corner focus treatment now follows keyboard input.
2. The last sheet retained an SVG curl despite hiding its button (early `final/bare-html-desktop.jpg`). Fixed SVG visibility through the actual hidden attribute, and added a regression assertion.
3. Five separate case-study headers made the letter’s ending long and empty (`letter-inspect/desktop-page-01.jpg`). The letter now places the complete notes inside its original question disclosures.

ROUND 2
Seen in one second: a calm letter with a small, plausible paper fold; the yellow reveal is a clear change of voice.
Idea (one sentence): the stack rewards curiosity while every exposed sheet remains a usable portfolio.
Live thing: click, drag, reverse, release; choose a view; reset and remember it.
Layout words by section: as above, with case studies integrated into the letter’s questions.
Scores: design 7.7 · usability 8 · creativity 8.5 · content 8 → overall 8.0.
Caps applied: small-heading and still-page style exceptions remain deliberate. The raw HTML page intentionally follows browser defaults and is not judged as a polished display site.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Dot matrix’s copied mark used an incorrect relative path (first `inspect-symbols-pixels/desktop-fold.jpg`). Fixed the generator and checked every local URL; the final inspection has no broken images.
2. The physical reverse is a smooth shaded geometric fold, rather than a full paper-material simulation (`final/partial-desktop.jpg`). This remains the prototype’s visual limit; it keeps the real page live without a raster capture or heavy graphics dependency.
3. A corner can partially cover a small masthead in the broader themes (`final/signal-press-desktop.jpg`). The main title remains clear; phone mastheads have additional top clearance. Temporary occlusion during an intentional drag is inherent to the requested physical interaction.

## Evidence

- Four geometry tests pass: intact start, area conservation, reflected corner/crease alignment, and complete exit across viewport ratios.
- Browser checks pass at 1440, 768 and 390px for all six complete themes: no overflow, duplicate IDs, broken loaded images or missing internal anchors.
- Live behavior checked: short drag and reversal, committed drag, click autoplay, touch drag, keyboard activation, theme persistence, final reset, section preservation, reduced motion, blocked storage and no-JavaScript fallback.
- Search, Signal press filters, Dot matrix’s original-screen control and Project atlas’s technology counts retain their real behavior.
- All 32 unique local document, stylesheet, script and image URLs respond HTTP 200. External links open safely outside the paper frames, and exit links navigate the top-level page.
- A focused check confirms returning directly to the saved final HTML sheet and printing the ASCII-wave welcome in the developer console.
- Final source lint: 0 FAIL. The theme-content stylesheet has one defensible 100vh warning: it is inside a viewport-sized iframe, so that value refers to its own fixed browsing context.
- Styled theme documents were inspected directly at all three widths, with 0 unaccepted FAIL. All accept `still-page` because the peel owns the motion; A personal letter additionally accepts `focal-point` to preserve its approved small-scale reading style. Remaining warnings concern the approved cream/small title and absent documentary footage. The outer stack’s frame geometry and interaction are checked separately by the browser suite; the inspector does not measure typography inside iframes.
- The final HTML sheet is verified to use a browser-default serif body, blue hyperlinks and working native reset buttons. Its lack of presentation is explicitly requested satire.
- Every final theme viewport and the inspection contact sheets were visually reviewed, including the exposed paper and full case-study behavior.
- Preservation hashes confirm the current letter, the other three studies, shared files and production source are unchanged. The restored Working index exactly matches the pre-refinement hash.
- Structural quality check has no gating regression. Its experiment findings are the animation and regular-expression callbacks reported as dead code despite their registrations, and the deliberate storage fallback; all were reviewed.

Detailed browser results: [browser-checks.txt](browser-checks.txt). Local screenshots and raw measurements: `.taste-skill/paper-stack/`. This is a local experiment; production has not been replaced or deployed.
