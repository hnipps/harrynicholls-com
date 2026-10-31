# Exclusive paper locations

The main pages now form an ordered deck, with HTML permanently at its bottom. Discarded styled sheets occupy a separate corner sheaf. Every view appears exactly once across those two collections.

Peeling removes the current sheet from the main deck and adds it to the top of the discarded sheaf. Retrieving removes a sheet from that sheaf and places it above the current main deck; the previous current sheet stays underneath. Curl rendering, accessible names, drag hints and completed peels use the deck's actual second sheet. They no longer follow numeric theme order.

Example: after peeling Letter and Signal press, the deck is Dot matrix / Project atlas / Working index / HTML and the corner has Letter / Signal press. Retrieving Letter produces Letter / Dot matrix / Project atlas / Working index / HTML, with only Signal press in the corner. Peeling Letter then reveals Dot matrix.

HTML cannot be retrieved into the corner, discarded, or peeled. When HTML is current, every styled sheet is in the corner. A retrieved styled sheet above HTML can be peeled to reveal HTML again. Reset returns the complete initial deck and empties the corner.

The main deck is persisted alongside the current theme and discarded order. Existing sessions infer the remaining deck from their current view and discarded sheets. Invalid entries, duplicates and saved HTML papers are sanitized; missing views are repaired without breaking exclusivity.

Validation: fifteen state, material, peel and mesh unit tests pass, including 200 mixed transitions with exclusivity checked after every operation. The dedicated real-browser test checks actual under-page layers, corner availability, dynamic peel order, repeated retrieval, reload, reset and legacy migration. The sheaf browser regression passes mouse, flexible return, touch, keyboard, persistence and reset with the new semantics. No browser runtime exceptions were observed. Source lint reports zero failures/warnings. The material and motion treatment is unchanged.
