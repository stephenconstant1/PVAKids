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
- Career Mode now displays that **same original image**, with the six crew members
  together in their original city. The illustration is not cropped or stretched.
  Gameplay controls and labels sit below the image, clear of its baked lettering.
- The previously generated `moneybread-city-map.png` is retained as an asset but
  is no longer shown as the Career city or hero background.
- Lesson-dialogue portraits still frame the original artwork; the main city no
  longer pastes a single cropped guide into a different background.
- The original poster is a static illustration. Buildings and crew within it do
  not independently animate. City choices update the separate controls and state.

## Destinations and animation data

`destinations.json` keeps all 32 original lesson titles, source locations and
existing `src/city.js` stop names in order. Lesson 1 is **Earning & Creating Value**
at **Value Village**. District controls and a brief next-stop pulse open the
original lesson, with a static highlight under reduced motion. Coordinates are
retained as editable metadata; the poster has no interactive overlays.

`runner-rigs.json` describes upper/lower limb joints for the six existing runner
images, including source hashes. `runner-stride.ts` draws an articulated Arcade
stride from those source pixels without changing source faces or assets. This
work predates the current focused homepage / Lesson 1 visual review.

## Homepage and focused review

Opening either static entry point always shows the homepage, including when a
Career save exists. Continue Career resumes its saved screen without resetting
progress. Saved players do not see the new-profile form. HOME returns to the
homepage; Arcade remains a separate selectable mode.

Run `npm run build`, `npm start`, then open http://localhost:8080. The focused
browser check is `node scripts/validate-browser.mjs tests/homepage-city-browser.cjs`.

`scripts/build.mjs` synchronizes source, emitted modules, tests, and assets to the
existing `/money-ops/` mirror so both GitHub Pages entry points remain usable.

## Lesson 1 template checklist

The active visual and interaction scope is Lesson 1. Use
[LESSON-1-CHECKLIST.md](LESSON-1-CHECKLIST.md) for the complete review. Keep
visual acceptance separate from automated checks before expanding the template.

## Complete construction-list artwork (45.5)

The runner town-building list still uses the eight existing IDs and names from
`src/city.js`. All eight cards, including those below the fold, use distinct
panorama-inspired building art from `assets/crew/moneybread-landmarks.png`. The
new atlas was generated using the project's `moneybread-city-map.png` panorama
as its architecture/style reference. The original panorama and crew images were
not modified. `landmark-art.json` maps each existing landmark ID to one atlas
tile; it contains no lesson assignments.

`landmark-art.ts` presents the saved construction stages: planned site (0),
foundation (1), structure (2), finishing (3), and complete (4). A translucent
completed-building preview identifies a planned site; a reveal from the base
upward and temporary scaffolding show work progressing. These are visual states
from one finished-building asset per landmark, not separate simulated structures.
The same art and stage appear in the purchase celebration. Each card shows its
stage, 100-coin stage cost, and 400-coin total.

No purchase rules, landmark names, lesson content, or mappings were changed.
Career still earns one construction permit per completed lesson; Arcade keeps
its temporary construction rules. There is no source mapping assigning these
eight landmarks to individual lessons, so none was added.

Verification: `node scripts/validate-browser.mjs tests/landmark-art-browser.cjs`
exercises every card and all 32 actual purchases, including the bottom card by
keyboard, save/reload, phone layouts, reduced motion, fallback text and both
static entry paths. `tests/landmark-art.test.js` checks complete ID/tile coverage
and purchase/stage rendering. No new dependencies were added.
