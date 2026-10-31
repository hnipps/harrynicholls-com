# Tactile paper

Historical review: the rigid return described here has been replaced by the matte deforming mesh. See [flexible paper review](flexible-review.md).

Mode: Experience. User selected Tactile paper from the three overdrive directions. Scope: the discarded paper materials, selected sheet's return, and the top-left curl. Preserve stable navigation, all six complete themes, content and saved history.

Motion thesis: a sheet is pulled free, turned to expose its live front, and laid onto the page. The corner then lifts as the same paper settles. Hover has fixed targets and no sibling movement. No idle loop or sound is added.

Implementation:
- Fan faces slide the existing 28px; a small curved lower corner, grazing highlight and offset shadow suggest tension in the sheet. The native buttons never change their order, depth or position on hover.
- The 1450ms return has seven authored poses. Asymmetric cubic edge contours flex during the turn and flatten on landing. The printed back, live front and reflected front light share matching transforms. Cast-shadow blur and opacity follow height. Both light layers and all temporary surfaces are removed after completion.
- The corner rises 12% horizontally and 8% vertically on mouse approach, then returns. Its existing reflected material receives a contact line at the crease and a lift-dependent shadow offset. The corner remains anchored to the document and scrolls away with it.
- The new corner starts opening 70ms after landing. Reduced motion retains immediate view selection and removes spatial travel.

Bounded verification: built the full treatment, captured five flight poses plus hover/landing/corner states on desktop and mobile in one inspection batch, corrected the overly fast global easing in one batch, then confirmed the final poses. The first version reached the live front too early; linear timeline timing now lets the authored positions control acceleration and gives the printed back time to read. Final captures are under `.taste-skill/tactile-paper/final/`.

The focused stability checks pass for all five exposed 44px targets at 1440/768/390px, including repeated stationary-pointer checks. Sheaf regressions pass mouse return, touch, arrow navigation, Escape, persistence, reset and reduced motion. Dedicated flight checks confirm the source aligns with the pulled-out paper, all six animations synchronize, temporary surfaces clean up, and the landed corner responds and returns. Nine geometry/history tests pass. Source lint has zero failures/warnings. Structural delta has no regressions of existing symbols. All original-study and production preservation hashes match.

Detector triage: two clipping findings were intentional page/print surfaces, with the navigation and curl already outside those clipping containers. The narrow `clipped-overflow-container` exception is scoped to this experiment's index in `.impeccable/config.json`. The final detector retains two aesthetic warnings: the host's native Arial control text and the user's chosen cream letter palette. Neither warrants changing the approved themes. No unresolved functional findings remain.

Limits: this is a CSS/SVG/DOM paper approximation, not a deformable 3D mesh. Validation used desktop Chrome with phone viewport and touch emulation; physical-device frame rate and other browser engines were not measured. No dependencies, imagery, factual copy or original variants were added or changed. Nothing has been deployed.
