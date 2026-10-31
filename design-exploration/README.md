# Portfolio exploration

[Try the separate paper-stack experiment](http://127.0.0.1:3031/design-exploration/paper-stack/): peel through all five themes and a final bare HTML page. Existing variants remain available; Working index is restored to its original version.

Five visual directions: three retained studies and two new studies from Symbols and Pixels and Minimal Data. The exploration remains isolated from production source.

From the repository root:

```sh
python3 -m http.server 3031 --bind 127.0.0.1
```

Open <http://127.0.0.1:3031/design-exploration/> for the comparison gallery. Serve the repository root because the studies reuse `src/assets/`.

- `symbols-pixels.html`: Dot matrix, from Symbols and Pixels.
- `minimal-data.html`: Project atlas, from Minimal Data.
- `galaxy/`: the separate earlier journey storyboard, preserved outside the gallery shortlist. See `galaxy/NOTES.md`.
- `working-index.html`: original green directory restored exactly.
- `personal-letter.html`: the refined reading study; see `research/reading-refinement.md`.
- `paper-stack/`: separate interactive experiment with six complete theme documents.
- `reading-studies.css`: styles isolated to those two refinements.
- `signal-press.html`: the retained Slow Victory study.
- `project-stories.html`: the six original case studies shared by the explorations.
- `directions.json`: the five shortlisted concepts and reference links.
- `research/`: direction sheets and historical inspection evidence. Earlier critique files describe the original five-study round.
- `references/`: contextual Are.na thumbnails, linked to their source blocks; publication rights are not asserted.
- `screenshots/`: desktop and phone comparison captures.

Open studio, Night shift, and the baseline are no longer part of the gallery. They were moved to the ignored local `.taste-skill/retired-explorations/` archive. The existing deployment copies only `src/`; this exploration is not deployed.

## New reference studies

Dot matrix and Project atlas were developed by separate subagents and integrated into the five-choice gallery. Each has final desktop/phone captures, source references, notes, and verification under its own `research/` directory. Both pass visual inspection at 1440, 768, and 390px with zero FAIL. Their controls and no-JavaScript fallbacks are verified. Atlas also passes at 320px.

The latest gallery has exactly five choices and four source filters. All local gallery links and resources respond HTTP 200, all preview frames load, and desktop/phone switching passes at all three target widths. The three retained designs and production source are byte-for-byte unchanged. See `research/round2-gallery-verification.txt`.
