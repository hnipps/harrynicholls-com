---
target: symbols-pixels
total_score: 22
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/symbols-pixels.html"
target_fingerprint: "sha256:dae9c002cddf8b9d7600c920102fa5daf681dd65611beb271ca88a79ce8a4f35"
target_path: /Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/symbols-pixels.html
timestamp: 2026-10-31T13-13-48Z
slug: on-paper-stack-themes-symbols-pixels-html-9b801232
closed: true
---
Method: dual-agent (A: /root/design_assessment · B: /root/technical_assessment)

# symbols-pixels.html

Design specificity: high. Dot-matrix HN and derived halftone screenshots create a clear visual language with a restrained red action. This is a purposeful treatment, not a reason to redesign the portfolio.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
|1|Visibility of system status|3|Image-treatment pressed state updates and original screens render.|
|2|Match with real world|4|Readable names and plain-language descriptions accompany stylized images.|
|3|User control and freedom|2|Hash history replacement and no study-end return.|
|4|Consistency and standards|4|Dot identity, monochrome treatment and red accent cohere.|
|5|Error prevention|3|Clearly labeled treatment switch; project cards have clear names.|
|6|Recognition rather than recall|3|Gallery is discoverable; lower mobile images are far from treatment control.|
|7|Flexibility and efficiency|n/a|Portfolio; no expert workflow required.|
|8|Aesthetic and minimalist design|3|Distinctive, controlled composition; evidence is intentionally abstracted.|
|9|Error recovery|n/a|No user input or recoverable transaction.|
|10|Help and documentation|n/a|Portfolio needs no separate help.|
|Total||22/28|Good, 79%.|

Strengths: (1) The mark and screenshots share a real print-like vocabulary. (2) Original screens is a useful, working escape from stylization; selected state updates correctly. (3) Mobile moves the gallery into a clear single-column reading path.

Priority issues:
- **P2: Project reading loses the gallery return path.** Same-page project links in `.matrix-project a`/`.other-projects a` are intercepted by `theme-content.js` and replace history. Fix: preserve hash history, focus target headings, and add “Back to software” at the foot of each `.story`. Suggested command: `$impeccable harden`.
- **P2: Long phone studies are hard to scan before reaching screenshots.** `.story-content h3` supplies a single “How it works” label above dense paragraphs. Fix: introduce specific subheads from the existing topic changes, and bring one original screenshot into the initial story explanation. Keep halftone on the index and originals in studies. Suggested command: `$impeccable clarify`.
- **P3: The original-image control is distant from lower phone examples.** `.matrix-controls` sits above a tall single-column spread; by the third/fourth item a user who wants to inspect original screens must scroll back. Fix: add a small “See original screens” link at the end of `.matrix-spread` that switches the existing treatment and returns to the spread, or repeat the existing control there. This preserves dots as the default. Suggested command: `$impeccable polish`.

Cognitive load: low (zero or one failure; four primary gallery choices plus a visibly separate two-project text group). The two-choice treatment control is clearly grouped. Emotional journey: memorable signature → tactile exploration → curiosity → dense explanatory valley → direct contact. Original screenshots reward readers; reach them earlier in a study.

Personas: Jordan can navigate by labels even when halftone details are abstract. Casey reaches lower gallery examples long after the treatment switch. Sam gets text names/descriptions and aria-hidden decorative canvas; navigation focus still needs to follow revealed stories. No claim that halftone itself is an accessibility failure.

Minor: full-study screenshots have no enlargement affordance, limiting phone UI inspection. Question: Can the screen originals remain easy to reach without weakening the printed index?


## Combined assessment and authorized fix plan

**P1:** Browser evidence confirms the skip link does not transfer focus. Repair destination focus on all internal navigation. **P2:** Preserve meaningful fragment history and provide contextual study-end return links. Enlarge isolated social/contact targets. Add topic headings to long studies, place existing visual evidence earlier, and offer original-image enlargement.

Add an originals control after the gallery, returning to the original images. Enlarge standalone text project links. Preserve default halftones and the HN mark.

The independent assessments agree that existing visual identities should be preserved. The visual review identifies a mobile reading valley; browser evidence confirms the shared focus/history defect. Cognitive load and persona observations are recorded above.

Deterministic CLI scan: 1 finding (overused-font), aggregate location design-exploration/paper-stack/themes/symbols-pixels.html:0. These style warnings are intentional incumbent conventions, not confirmed usability failures. The opening letter uses Georgia; the Signal headline uses Impact. Atlas runtime em-dash advice counts table absence marks and is a false positive. No confirmed contrast failure; atlas filter text passes after correct alpha composition (~4.67:1).

Browser evidence: desktop 1440px, tablet 768px, phone 390px, and 720px reflow equivalent to 200% desktop zoom. No broken local images/fragments, horizontal overflow, missing image alt or app exceptions. Runtime detector injection executed in headless tabs; no persistent user-visible overlay remains. External destinations and actual screen-reader output were not tested.

Questions skipped: user explicitly authorized all findings to be fixed for these five views; bare HTML is excluded.


## Resolution

All actionable findings above were fixed within this view’s existing identity. Verified with the reading-browser regression on both source and built documents: desktop, tablet, phone and 320px reflow; skip-link focus; project destination focus; browser Back; study-end returns; original screenshot links; contact targets; view-specific controls. All 16 existing geometry/state/flex tests pass. Bare HTML and its behavior script are byte-for-byte unchanged.

The initial scores remain archived baseline scores; no second critique score is claimed. Detector style cues judged intentional and development-server artifacts are not open usability defects.
