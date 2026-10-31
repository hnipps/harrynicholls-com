---
target: working-index
total_score: 26
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/working-index.html"
target_fingerprint: "sha256:47bb4ffbae72ea1749890a8ef2ed9fa3075f46b06e6d29d3b109cf2a81e8a762"
target_path: /Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/working-index.html
timestamp: 2026-10-31T13-13-48Z
slug: ion-paper-stack-themes-working-index-html-4c42e933
closed: true
---
Method: dual-agent (A: /root/design_assessment · B: /root/technical_assessment)

# working-index.html

Design specificity: medium-high. This is a restrained, useful personal directory. The project-purpose-category rows and search are appropriate to its identity. Do not turn the index into a poster or visual gallery.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
|1|Visibility of system status|3|Search count updates, but zero-result count coexists with unrelated surviving thumbnails.|
|2|Match with real world|4|Name, purpose and category are plain and useful.|
|3|User control and freedom|2|Project jumps replace history; no end-of-story index return.|
|4|Consistency and standards|3|Search scopes list only, visually adjacent image strip appears to contradict it.|
|5|Error prevention|3|Clear search label and placeholder; no destructive actions.|
|6|Recognition rather than recall|3|Rows expose purpose/category; empty state gives no recovery instruction.|
|7|Flexibility and efficiency|3|Search efficiently narrows known items without complicating basic browsing.|
|8|Aesthetic and minimalist design|3|Directory hierarchy is quiet and readable.|
|9|Error recovery|2|“0 projects found” identifies the empty result but gives no suggestion or explicit reset.|
|10|Help and documentation|n/a|Self-explanatory small portfolio directory.|
|Total||26/36|Good, 72%.|

Strengths: (1) The row structure exposes exactly the information needed to choose a project. (2) Search is optional and gives a live result count. (3) Mobile rows stack naturally and the 390px page has no overflow.

Priority issues:
- **P2: Empty search looks self-contradictory.** Typing “nonsense” into `#project-search` produces “0 projects found” while the adjacent `.screen-strip` still displays four unlabeled project thumbnails. Fix: filter/hide strip items with the same matching state or clearly separate it as an unfiltered “Featured screenshots” section outside search results. Add a zero-result sentence and “Show all projects” reset. Suggested command: `$impeccable harden`.
- **P2: Case-study links replace browser history and have no local return.** `.project-link`/`.screen-strip a` use shared hash interception. Fix: preserve fragment history, focus the revealed heading and add “Back to index” after each `.story`. Suggested command: `$impeccable harden`.
- **P2: Phone technical detail lacks internal landmarks.** `.story-content` has useful facts but only one broad “How it works” heading above long paragraphs. Fix: split existing product/ranking/architecture topics with descriptive subheads and place the first screenshot earlier. Suggested command: `$impeccable clarify`.

Cognitive load: low (one checklist failure: six sibling project choices; rows group them well and search provides optional narrowing). Zero-result ambiguity adds an avoidable interpretation task. Emotional journey: calm introduction → efficient directory browsing → uncertainty at zero results → sustained technical reading → clear contact. Make recovery immediate and keep the index calm.

Personas: Jordan gets a helpful purpose for every project but has to interpret why images survive zero results. Riley reproduces the exact mismatch with an unmatched query. Casey faces a long scroll back after reading a story; thumbnails themselves are large enough to tap, but do not provide readable UI detail.

Minor: optionally give `.screen-strip a` visible project captions, especially if it remains outside search. Question: What exactly does “0 projects found” promise about the content shown beneath it?


## Combined assessment and authorized fix plan

**P1:** Browser evidence confirms the skip link does not transfer focus. Repair destination focus on all internal navigation. **P2:** Preserve meaningful fragment history and provide contextual study-end return links. Enlarge isolated social/contact targets. Add topic headings to long studies, place existing visual evidence earlier, and offer original-image enlargement.

Filter screenshot links with the project list. Add a visible zero-result explanation and Show all projects reset. Preserve the directory layout.

The independent assessments agree that existing visual identities should be preserved. The visual review identifies a mobile reading valley; browser evidence confirms the shared focus/history defect. Cognitive load and persona observations are recorded above.

Deterministic CLI scan: 1 finding (overused-font), aggregate location design-exploration/paper-stack/themes/working-index.html:0. These style warnings are intentional incumbent conventions, not confirmed usability failures. The opening letter uses Georgia; the Signal headline uses Impact. Atlas runtime em-dash advice counts table absence marks and is a false positive. No confirmed contrast failure; atlas filter text passes after correct alpha composition (~4.67:1).

Browser evidence: desktop 1440px, tablet 768px, phone 390px, and 720px reflow equivalent to 200% desktop zoom. No broken local images/fragments, horizontal overflow, missing image alt or app exceptions. Runtime detector injection executed in headless tabs; no persistent user-visible overlay remains. External destinations and actual screen-reader output were not tested.

Questions skipped: user explicitly authorized all findings to be fixed for these five views; bare HTML is excluded.


## Resolution

All actionable findings above were fixed within this view’s existing identity. Verified with the reading-browser regression on both source and built documents: desktop, tablet, phone and 320px reflow; skip-link focus; project destination focus; browser Back; study-end returns; original screenshot links; contact targets; view-specific controls. All 16 existing geometry/state/flex tests pass. Bare HTML and its behavior script are byte-for-byte unchanged.

The initial scores remain archived baseline scores; no second critique score is claimed. Detector style cues judged intentional and development-server artifacts are not open usability defects.
