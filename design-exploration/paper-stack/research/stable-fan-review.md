# Stable paper fan

Mode: Experience. Scope: the existing paper navigation and its return-animation starting pose. Preserve all themes, content, materials, history and page-peel behavior.

The earlier delayed reordering passed discrete exposure checks but failed the continuous interaction: papers moved beneath the pointer, causing a change of target and breaking the user's spatial understanding. The fix removes that mechanism rather than adjusting its delay.

Motion thesis: opening exposes all visited sheets in a fixed stepped fan; pointing at a sheet pulls only that sheet sideways. Selecting it continues into the existing full-page flip. No siblings move in response to hover. Opening takes 300ms; the 28px sideways pull takes 220ms, with deceleration and no bounce. Reduced motion removes the spatial transitions.

The native button keeps its original position and depth while its printed face slides. The face is also a pointer target, so both the anchored area and extended edge belong to the same button. Every exposed strip retains a 44px square target. No hover timer, pointer sampling, temporary layering or saved-history changes remain. Shadows move with the printed faces. The return-animation pose includes the current face translation, including an interrupted transition.

One batched browser inspection covered 1440, 768 and 390px. Screenshots in `.taste-skill/stable-sheaf/final/` show the open fan and hovered sheet at all three widths. The fixed strips make every material visible. The phone fan intentionally overlays the page while open and closes on dismissal. The hovered sheet moves left without hiding adjacent strips. No further visual correction was required.

Real pointer regressions hover each of five papers at every width and check at successive intervals that the original cursor still targets the intended sheet, every other paper retains its position/depth, and all five 44px targets remain available. The separate sheaf suite passes mouse selection and full-page return, first-touch opening, touch selection, arrow keys, Escape, reduced motion, history persistence and reset. Focused checks also preserve the readable HTML ending and fold-only keyboard cue. No browser runtime exceptions were observed.

The Impeccable detector reports no findings. Source lint has zero failures/warnings. Nine geometry/history tests pass. Structural comparison reports no regressions of existing symbols. Preservation hashes match for the original studies and production source. Nothing was deployed.
