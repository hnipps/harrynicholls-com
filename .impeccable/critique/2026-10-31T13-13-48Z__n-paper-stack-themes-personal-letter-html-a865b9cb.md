---
target: personal-letter
total_score: 22
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/personal-letter.html"
target_fingerprint: "sha256:064bc54c890ee08532ed1418d84f9546676929e3dc52e51039860437c3fee34d"
target_path: /Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/personal-letter.html
timestamp: 2026-10-31T13-13-48Z
slug: n-paper-stack-themes-personal-letter-html-a865b9cb
closed: true
---
Method: dual-agent (A: /root/design_assessment · B: /root/technical_assessment)

# personal-letter.html

Design specificity: high. The question-led index, Georgia prose, restrained red links and handwritten-style signoff make a convincing personal letter from a person who builds useful tools. Preserve this composition and tone.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
|1|Visibility of system status|3|Plus/minus disclosure state; opened content is immediate.|
|2|Match with real world|4|Projects start with recognizable personal questions.|
|3|User control and freedom|2|Long case studies lack a local return; hash links replace history.|
|4|Consistency and standards|4|Underlines, restrained accent and native disclosures cohere.|
|5|Error prevention|3|Clear project labels; image links could explain destination better.|
|6|Recognition rather than recall|3|Question and project name stay together; lower story return requires remembering position.|
|7|Flexibility and efficiency|n/a|Personal portfolio, no expert workflow required.|
|8|Aesthetic and minimalist design|3|Beautifully quiet, but biography repeats the opening.|
|9|Error recovery|n/a|No user input or recoverable transaction.|
|10|Help and documentation|n/a|Self-explanatory portfolio surface.|
|Total||22/28|Good, 79%.|

Strengths: (1) Questions turn technical work into human motives. (2) Native generous-height question rows work comfortably on phone. (3) Warm prose and uncluttered line lengths support sustained reading.

Priority issues:
- **P2: Biography repeats the introduction before the picture route.** `.hero .introduction` and `#about > div > p:first-child` both repeat engineer/dad/woodworker/Toronto/remote. On phone this repeats information after a long question index and delays visual evidence. Fix: retain the personal introduction and start About with the existing ev.energy paragraph, or replace its first paragraph with genuinely new information. Suggested command: `$impeccable distill`.
- **P2: Reading a full project has no short return path.** `theme-content.js` uses `history.replaceState` for same-page links; the full gitrove study has no return link and the question summary can be far above the reader. Fix: preserve native hash history/pushState, and add a quiet “Back to questions” link after each complete story, linking `#work`. Keep the native close affordance. Suggested command: `$impeccable harden`.
- **P2: Important small links need more touch area.** Mobile `.navigation > a` is approximately 66×20px; footer LinkedIn 49×20 and X 9×20. Fix: add a 44px minimum hit area with inline-flex/padding while preserving current type size and understated appearance. Suggested command: `$impeccable adapt`.

Cognitive load: low (one checklist failure: six sibling project choices exceed four; they are short, predictable and already grouped). No memory bridge for opening a question. Prose duplication adds unnecessary reading. Emotional journey: warm welcome → curiosity at questions → credibility in story → reading valley before returning to the index → warm contact. End each study with a quiet return to questions to close that loop.

Personas: Jordan understands question labels immediately but hears the opening biography twice. Casey can tap question rows easily but the “Write to me” and X targets are small. Sam benefits from native details and visible focus styling; project hash navigation should move focus to the revealed heading, rather than only scrolling.

Minor: `.image-container img` are static screenshots with no enlargement; on phone they communicate composition, not interface details. Optional P3: link each to the original file with an explicit accessible name. Questions: Could About add something the letter has not already told us? What is the most natural way to return from a long answer to the next question?


## Combined assessment and authorized fix plan

**P1:** Browser evidence confirms the skip link does not transfer focus. Repair destination focus on all internal navigation. **P2:** Preserve meaningful fragment history and provide contextual study-end return links. Enlarge isolated social/contact targets. Add topic headings to long studies, place existing visual evidence earlier, and offer original-image enlargement.

Remove the duplicated opening biography in About. Enlarge standalone header and footer contact targets. Preserve the quiet letter hierarchy and cream paper.

The independent assessments agree that existing visual identities should be preserved. The visual review identifies a mobile reading valley; browser evidence confirms the shared focus/history defect. Cognitive load and persona observations are recorded above.

Deterministic CLI scan: 3 findings (overused-font, flat-type-hierarchy, cream-palette), aggregate location design-exploration/paper-stack/themes/personal-letter.html:0. These style warnings are intentional incumbent conventions, not confirmed usability failures. The opening letter uses Georgia; the Signal headline uses Impact. Atlas runtime em-dash advice counts table absence marks and is a false positive. No confirmed contrast failure; atlas filter text passes after correct alpha composition (~4.67:1).

Browser evidence: desktop 1440px, tablet 768px, phone 390px, and 720px reflow equivalent to 200% desktop zoom. No broken local images/fragments, horizontal overflow, missing image alt or app exceptions. Runtime detector injection executed in headless tabs; no persistent user-visible overlay remains. External destinations and actual screen-reader output were not tested.

Questions skipped: user explicitly authorized all findings to be fixed for these five views; bare HTML is excluded.


## Resolution

All actionable findings above were fixed within this view’s existing identity. Verified with the reading-browser regression on both source and built documents: desktop, tablet, phone and 320px reflow; skip-link focus; project destination focus; browser Back; study-end returns; original screenshot links; contact targets; view-specific controls. All 16 existing geometry/state/flex tests pass. Bare HTML and its behavior script are byte-for-byte unchanged.

The initial scores remain archived baseline scores; no second critique score is claimed. Detector style cues judged intentional and development-server artifacts are not open usability defects.
