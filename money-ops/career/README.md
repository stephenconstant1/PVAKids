# Moneybread City — editable curriculum and TypeScript source

Money Ops is the game. Moneybread City is the Career Mode world.

`lessons.json` is an editable snapshot of the existing 32 lessons, in order. Each
entry keeps its original number, title, vocabulary, core idea, examples, dialogue,
and source-file paths. `district` is city gameplay metadata, not a lesson title.
The original interactive activities still run from `src/play.js` and the original
mission data files. No lesson text has been replaced by a generic city lesson.

When updating curriculum, update the original lesson data and this snapshot
together. `npm run build` checks titles, order, vocabulary, ideas, and source paths
against `src/content.js`; a missing or mismatched lesson fails the build with its
level number. Missing curriculum in the UI is labeled “source lesson needed.”
All 32 original lessons were present for this implementation.

- `types.ts`: typed city, wallet, weekly progress, and transaction contracts.
- `simulation.ts`: pure deterministic transactions, validation, migration,
  progression, job pay, project costs, service trade-offs, and investments.
- `ui.ts`: accessible HTML views and original-source crew framing.
- `art.ts`: lightweight fallback building artwork if city scenery cannot load.
- `city.css`: responsive layouts, map regions, construction/reaction animations,
  and reduced-motion overrides.
- `lessons.ts`: typed curriculum access and missing-content detection.
- `index.ts`: interface used by the existing JavaScript app controller.

The TypeScript compiler emits browser ES modules into `src/moneybread/`. These
are committed so GitHub Pages can serve the game without a server-side build.
There is no C++ or WebAssembly dependency. Simulation transactions are isolated
behind `applyCity(state, action, completedLessons)` if profiling ever justifies
another engine.

## Saving and accounting

City state lives at `moneybread` inside the existing `money-ops-v02` Career save.
The existing save schema/version and dollar-based lesson snapshots are retained.
Existing completed lessons migrate as completed, without backdated bread rewards.
New city weeks unlock after the original activity and weekly reflection. Replays
use the original snapshot and never repeat a paid city job.

City bread is separate from original lesson dollars and temporary Arcade coins.
Every transaction preserves:

`available + saved + invested + spent = income + investmentResult`

Investment plans unlock with original Lesson 5. Classroom scenarios are fixed,
disclosed before a choice, and include losses. Project costs and the 10-bread
weekly service cost are visible before commitment. Insufficient service funds
slow the city rather than trapping a student behind an impossible balance.

Rebuilding the city map requires an explicit confirmation and preserves the
wallet, lessons, and reflections. The existing Profile reset still requires its
own confirmation. Profile → Export career save creates a complete local backup.

## Art provenance

- `assets/crew/money-ops-moneybread-city.jpg` is the **unchanged uploaded**
  1280×748 reference image. The landing displays the whole image at its original
  aspect ratio, with mode buttons below it. Its SHA-256 is
  `a1ac7d3dd5c330279336a0b779110b3e594c4bcc6e8753e63c0242d7dae660f4`.
- Career guide frames use SVG viewports into that exact image; no character is
  redrawn, renamed, stretched, or replaced. All six source figures are used as
  guides across the 32 weeks. Existing lesson portraits and directional runner
  sprites remain the established Money Ops crew.
- `assets/crew/moneybread-city-map.png` is a separate, city-only illustrated
  environment generated from the reference's art direction: dimensional school,
  homes, bakery/shops, park, transit, hospital, bank, and studio. It is not the
  lettered poster and contains no substituted crew characters.
- Gameplay labels, district controls, stage indicators, and explanations are
  HTML over the city-only map or beside art. The full lettered poster is never
  used beneath gameplay text or buttons.

`scripts/build.mjs` synchronizes source, emitted modules, tests, and assets to the
existing `/money-ops/` mirror so both GitHub Pages entry points remain usable.
