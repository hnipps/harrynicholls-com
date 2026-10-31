# Under-page colour and continuous stack movement

Two local defects, with no change to the material direction or page-location model.

The `.sheet` background inherited the active host theme's `--paper`. The bare HTML document has a transparent canvas, so the yellow iframe background showed through until that document became active and changed the host token to white. Every initial or lazily created iframe now receives its own `--sheet-paper`, independent of the host colour. Signal press can remain yellow while the HTML page beneath it is already white.

The sheaf renderer previously replaced every button on every arrival. Newly created elements cannot transition from their predecessors' positions. Reconciliation now retains each existing paper button by its theme index, removes only papers that leave the sheaf, and creates only the arriving paper. Slot changes on retained buttons use the existing 300ms transform transition; the arriving paper keeps its separate flight. Reduced motion still changes positions immediately.

One batched browser pass verified desktop and phone screenshots with Signal press above HTML and all other views in the corner. The exposed corner is white before peeling. A second scenario checks retained node identity, an actual transform transition and more than five distinct intermediate positions while an existing paper moves aside. No correction round was needed. Screenshots and checks: `.taste-skill/peel-polish/`.

The existing sheaf regression passes mouse return, touch, keyboard, persistence, reset and five exposed targets at all three widths. Fifteen state/mesh/geometry tests pass. Source lint: zero failures/warnings. Structural comparison: zero gating regressions. Original variants and production preservation hashes match. No new detector exceptions or dependencies were introduced. Nothing has been deployed.
