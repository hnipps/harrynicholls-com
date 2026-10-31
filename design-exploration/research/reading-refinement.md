# Reading studies refinement

References viewed live at 1440px on 30 October 2026:

- [Einar Wahlstrøm](https://wahlstroem.no/): a small masthead, conversational prose, journal entries, highlighted text links.
- [Hamilton Ulmer](https://www.hamiltonulmer.com/): warm paper, centred narrow column, modest sans-serif identity, serif introduction, small central object and aligned work rows.
- [Balfron Tower](https://www.balfrontower.org/): question-led archive, red disclosure links and progressively revealed documentation.

The existing seeds and direction identities are retained; this is refinement, not another random direction draw. The photographic and biographical inventory remains the actual six projects, original interfaces, current engineering role, fatherhood and woodworking. No reference artwork or text was copied into the portfolio. Reference thumbnails are local review material only.

Argument: introduce the engineer → show the actual projects → give personal context → offer full technical evidence → invite contact.

On Working index, Harry’s tools become a compact searchable directory. On A personal letter, the practical question behind each tool becomes a way into its story. The styles are isolated in `reading-studies.css`; the other prototypes, production source and shared JavaScript were not edited for this refinement.

## Critique

ROUND 1
Seen in one second: a small personal document, rather than a display-led portfolio.
Idea (one sentence): the working collection of useful tools becomes either a directory or a letter with expandable project questions.
Live thing: real project search / six native question disclosures.
Layout words by section: hero=small masthead and continuous prose / work=aligned directory or question index / about=reading column / proof=real interface collection and complete case study / contact=plain correspondence links.
Scores: design 6.5 · usability 7 · creativity 7 · content 8 → overall 7.0.
Caps applied: the skill’s display-site rubric caps still pages and small document compositions; the modest scale and stillness are deliberate user-reference adaptations. These are subjective self-scores, not external review.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Working index’s 12px metadata was too small (`working-after/desktop-fold.jpg`). Raised all visible metadata and captions to at least 13px.
2. The letter’s number-plus prefixes wrapped on phones (`letter-after/mobile-fold.jpg`). Removed decorative numbering and retained a single plus/minus disclosure indicator.
3. Existing gallery images showed the previous styles. Replaced desktop/phone captures and updated reference notes and initial comparison selection.

ROUND 2
Seen in one second: Working index is a compact engineering home page; A personal letter is a quieter, more literary journal.
Idea (one sentence): each project is accessible as either a scannable entry or an answer to a familiar question.
Live thing: search including empty results / native keyboard-operable project disclosures.
Layout words by section: as above, with simpler phone disclosure prefixes and readable metadata.
Scores: design 6.5 · usability 7 · creativity 7 · content 8 → overall 7.0.
Caps applied: same reference-led scale and stillness; no inflated score to satisfy a display-site rubric.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The small gitrove object is not readable as a full interface (`working-final/desktop-fold.jpg`). It links to the full case study and large screenshots; its purpose here is a small example of the work, in the position of Hamilton’s diagram.
2. The letter hides some project detail until requested (`letter-final/mobile-fold.jpg`). Each disclosure is native and all six project names remain visible; a separate picture collection supports browsing.
3. Longer personal context repeats some introduction facts (`letter-final/desktop-page-01.jpg`). Kept the existing source biography intact for comparison; editorial tightening can follow a chosen direction.

## Checks and intentional adaptations

- Browser checks at 1440, 768 and 390px: no horizontal overflow, no broken loaded images, all internal anchors resolve.
- Search tested with one result and zero results. Letter tested by keyboard Enter; native disclosures and content remain available with JavaScript disabled.
- All five gallery studies remain, with updated screenshots and reference metadata.
- Final inspector: 0 unaccepted FAIL after explicit allowances. Working index: `focal-point`, `still-page`, `empty-screens`; letter: `focal-point`, `still-page`. These are documented reference-led exceptions: making headings large, adding entrance motion, or widening the reading column would contradict the user’s requested sites. Raw first-pass reports are retained locally and show these findings.
- Remaining warnings: warm cream, small title, no footage; Working index also has a heuristic name-only-title warning despite the role and description directly below it. No relevant documentary footage exists in the source assets.
- Final screenshots at all three widths and full-page contact sheets were visually reviewed. No deployment or production restyle was performed.

Evidence is in `.taste-skill/refinement/` locally: reference captures, before captures, first-pass and final inspector reports, screenshots, and `verify.mjs`.
