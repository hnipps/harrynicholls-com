---
target: minimal-data
total_score: 22
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/minimal-data.html"
target_fingerprint: "sha256:a109222cfad8f79d04816af245f52ed10ee9150b5a29cafa1664c60f86d04b84"
target_path: /Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/minimal-data.html
timestamp: 2026-10-31T13-13-48Z
slug: tion-paper-stack-themes-minimal-data-html-a66c4db8
closed: true
---
Method: dual-agent (A: /root/design_assessment · B: /root/technical_assessment)

# minimal-data.html

Design specificity: high. The royal-blue technology atlas is a genuine project-data composition and expresses an engineering practice. Keep the table, blue panel and square cell marks. The useful refinement is to make mobile decoding and study reading easier.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
|1|Visibility of system status|4|Technology selection has pressed state, row/column emphasis and updated count.|
|2|Match with real world|3|Mobile “SQL” means SQLite specifically; abbreviations need decoding.|
|3|User control and freedom|2|Project jumps replace history; no local return from story.|
|4|Consistency and standards|4|Atlas controls, table and blue hierarchy are cohesive.|
|5|Error prevention|3|Legend and caption clarify the meaning of cells.|
|6|Recognition rather than recall|3|Full technology controls help, but compact column labels require mapping.|
|7|Flexibility and efficiency|n/a|Portfolio, not an analytics tool requiring power features.|
|8|Aesthetic and minimalist design|3|Purposeful data graphic; technical detail exceeds introductory context.|
|9|Error recovery|n/a|No user input or recoverable transaction.|
|10|Help and documentation|n/a|Legend is sufficient for this small portfolio graphic.|
|Total||22/28|Good, 79%.|

Strengths: (1) Real technology data distinguishes the portfolio from a generic gallery. (2) Native table headings and explicit screen-reader cell descriptions support access. (3) Selecting Python correctly gives “1 with Python” and highlights matching data; All projects is an obvious reset.

Priority issues:
- **P2: Phone column labels make technology identification needlessly indirect.** `.tech-short` uses TS, Py, PG and SQL. “SQL” is ambiguous because the actual column is SQLite; title tooltips on `<abbr>` are not a reliable touch explanation. Fix: use “SQLite” as a wrapped short label and provide visible expansion of PG/TS/Py directly alongside the legend or on selected-column status. Preserve table structure. Suggested command: `$impeccable clarify`.
- **P2: Long story reading has no reliable short path back to the atlas.** `.atlas-table a`/`.atlas-interfaces a` use the shared `replaceState` hash behavior. Fix: preserve history, focus target headings, and add “Back to work map” at study ends. Suggested command: `$impeccable harden`.
- **P2: The dense phone technical study needs subheadings.** `#gitrove-story .story-content > div:nth-child(2)` packs product behavior, ranking and architecture under one heading. Fix: split these existing topics into named subsections and move one current screenshot closer to the product explanation. Suggested command: `$impeccable clarify`.

Cognitive load: moderate (two failures: six visible technology choices exceed four, and users choose among six projects while translating column abbreviations). The table is grouped well and no options need removal. Explain abbreviations and clarify the technology-highlight intent rather than replacing the atlas with cards. Emotional journey: restrained introduction → intriguing blue evidence map → useful product imagery → long technical valley → calm contact.

Personas: Jordan must map “SQL” back to SQLite; Casey cannot rely on hover titles and navigates a dense six-column table; Riley sees correct count changes and clear reset. Sam benefits from table semantics; focus should move with hash navigation. Question: Does every mobile column name identify the exact technology without requiring hover or prior familiarity?


## Combined assessment and authorized fix plan

**P1:** Browser evidence confirms the skip link does not transfer focus. Repair destination focus on all internal navigation. **P2:** Preserve meaningful fragment history and provide contextual study-end return links. Enlarge isolated social/contact targets. Add topic headings to long studies, place existing visual evidence earlier, and offer original-image enlargement.

Use exact mobile technology names instead of ambiguous SQL/PG/TS/Py labels. Enlarge table project anchors to row height. Preserve the blue table and square marks.

The independent assessments agree that existing visual identities should be preserved. The visual review identifies a mobile reading valley; browser evidence confirms the shared focus/history defect. Cognitive load and persona observations are recorded above.

Deterministic CLI scan: 1 finding (overused-font), aggregate location design-exploration/paper-stack/themes/minimal-data.html:0. These style warnings are intentional incumbent conventions, not confirmed usability failures. The opening letter uses Georgia; the Signal headline uses Impact. Atlas runtime em-dash advice counts table absence marks and is a false positive. No confirmed contrast failure; atlas filter text passes after correct alpha composition (~4.67:1).

Browser evidence: desktop 1440px, tablet 768px, phone 390px, and 720px reflow equivalent to 200% desktop zoom. No broken local images/fragments, horizontal overflow, missing image alt or app exceptions. Runtime detector injection executed in headless tabs; no persistent user-visible overlay remains. External destinations and actual screen-reader output were not tested.

Questions skipped: user explicitly authorized all findings to be fixed for these five views; bare HTML is excluded.


## Resolution

All actionable findings above were fixed within this view’s existing identity. Verified with the reading-browser regression on both source and built documents: desktop, tablet, phone and 320px reflow; skip-link focus; project destination focus; browser Back; study-end returns; original screenshot links; contact targets; view-specific controls. All 16 existing geometry/state/flex tests pass. Bare HTML and its behavior script are byte-for-byte unchanged.

The initial scores remain archived baseline scores; no second critique score is claimed. Detector style cues judged intentional and development-server artifacts are not open usability defects.
