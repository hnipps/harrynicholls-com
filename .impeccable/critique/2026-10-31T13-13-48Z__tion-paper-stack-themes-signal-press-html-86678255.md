---
target: signal-press
total_score: 23
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 1
target_identity: "file:/Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/signal-press.html"
target_fingerprint: "sha256:70d90f452614103cd9ae9e60f1574b94943ef3127e44ca6d28f0b7eb185d4749"
target_path: /Users/harry.nicholls/repos/harrynicholls-com/design-exploration/paper-stack/themes/signal-press.html
timestamp: 2026-10-31T13-13-48Z
slug: tion-paper-stack-themes-signal-press-html-86678255
closed: true
---
Method: dual-agent (A: /root/design_assessment · B: /root/technical_assessment)

# signal-press.html

Design specificity: high. The lime ground, black compressed headlines, poster hierarchy and dense project titles are the identity. They feel intentional for an assertive maker portfolio. Do not replace the typography, palette or poster scale.

| # | Heuristic | Score | Evidence |
|---|---|---:|---|
|1|Visibility of system status|3|Filter pressed states and counts update correctly.|
|2|Match with real world|4|Plain project descriptions and clear Work/About/Contact.|
|3|User control and freedom|2|Deep story jumps replace history; no end-of-story return.|
|4|Consistency and standards|4|Poster index and calm story panels form a coherent contrast.|
|5|Error prevention|3|Safe actions, clear filters; new-window destinations not announced.|
|6|Recognition rather than recall|4|Project names, short descriptions and thumbnails work together.|
|7|Flexibility and efficiency|n/a|Portfolio; no expert workflow required.|
|8|Aesthetic and minimalist design|3|Strong hierarchy; long study metadata precedes all visual evidence.|
|9|Error recovery|n/a|No user input or recoverable transaction.|
|10|Help and documentation|n/a|Self-explanatory portfolio.|
|Total||23/28|Good, 82%.|

Strengths: (1) Immediate, unmistakable typographic presence. (2) Short project descriptions let users scan beneath large names. (3) “Developer tools” actually produces four visible rows and an updated count; “All work” provides a clear reset.

Priority issues:
- **P2: A case-study jump is effectively a one-way long scroll.** `theme-content.js` replaces browser history, while `#crosscheck`, `#gitrove-story` and other `.story` sections offer no return at their end. Fix: preserve fragment history, focus the revealed heading, and append “Back to selected work” to each story. Suggested command: `$impeccable harden`.
- **P2: Phone case studies make evidence wait behind a long technical block.** `#gitrove-story .story-content > div:nth-child(2)` contains several long paragraphs under one “How it works” heading; images follow the entire implementation explanation. This is readable but hard to skim on a phone, and the visual payoff arrives late. Fix: retain all technical detail, split the existing paragraphs with descriptive subheads (“Daily digest”, “Discover ranking”, “Architecture”), and put a single existing screenshot near the opening paragraph. Suggested command: `$impeccable clarify`.
- **P3: Footer social targets are unnecessarily precise.** `.footer-bottom a` mobile X target is about 11×25px. Fix with 44px hit boxes and modest horizontal spacing; keep poster visual styling. Suggested command: `$impeccable adapt`.

Cognitive load: low (one failure: six project options in the initial index; filters are only three and grouped). Large names create clear hierarchy rather than noise. Emotional journey: energetic poster opening → easy browsing → calmer personal note → slower technical valley → confident contact. The storytelling fix should preserve that energy while making the valley shorter.

Personas: Jordan has clear first actions and descriptions. Casey can use 45px nav and 48px filters; the long phone study lacks a nearby return. Riley sees correct filtering and counts; changing filters does not conceal project access permanently. Sam gets native disclosure and visible focus; hash target focus needs improvement.

Minor: screenshot thumbnails are signposts at mobile size, which is appropriate for the poster. Offer original-image enlargement in the full story if detailed inspection matters. Question: Which single screenshot would make the reader want to continue into the implementation details?


## Combined assessment and authorized fix plan

**P1:** Browser evidence confirms the skip link does not transfer focus. Repair destination focus on all internal navigation. **P2:** Preserve meaningful fragment history and provide contextual study-end return links. Enlarge isolated social/contact targets. Add topic headings to long studies, place existing visual evidence earlier, and offer original-image enlargement.

Rename the broad non-home filter to Tools & writing so its four results match its label. Preserve the lime poster and compressed headline.

The independent assessments agree that existing visual identities should be preserved. The visual review identifies a mobile reading valley; browser evidence confirms the shared focus/history defect. Cognitive load and persona observations are recorded above.

Deterministic CLI scan: 1 finding (overused-font), aggregate location design-exploration/paper-stack/themes/signal-press.html:0. These style warnings are intentional incumbent conventions, not confirmed usability failures. The opening letter uses Georgia; the Signal headline uses Impact. Atlas runtime em-dash advice counts table absence marks and is a false positive. No confirmed contrast failure; atlas filter text passes after correct alpha composition (~4.67:1).

Browser evidence: desktop 1440px, tablet 768px, phone 390px, and 720px reflow equivalent to 200% desktop zoom. No broken local images/fragments, horizontal overflow, missing image alt or app exceptions. Runtime detector injection executed in headless tabs; no persistent user-visible overlay remains. External destinations and actual screen-reader output were not tested.

Questions skipped: user explicitly authorized all findings to be fixed for these five views; bare HTML is excluded.


## Resolution

All actionable findings above were fixed within this view’s existing identity. Verified with the reading-browser regression on both source and built documents: desktop, tablet, phone and 320px reflow; skip-link focus; project destination focus; browser Back; study-end returns; original screenshot links; contact targets; view-specific controls. All 16 existing geometry/state/flex tests pass. Bare HTML and its behavior script are byte-for-byte unchanged.

The initial scores remain archived baseline scores; no second critique score is claimed. Detector style cues judged intentional and development-server artifacts are not open usability defects.
