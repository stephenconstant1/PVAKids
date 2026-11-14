# Arcade Level 2: Building Income Streams — draft

The native browser JavaScript/Canvas framework is retained. Only Arcade Level 2 uses `DowntownRunner`; Career/Bonus Level 2 and all other levels still use `FinancialRunner`. Level selection and character selection stay in the existing Arcade setup.

## Flow and controls

The selected character introduces downtown through a short speech-bubble scene. Students choose a bakery job, tutoring, repair service or neighborhood market, then explore the avenue in three lanes. At 25 and 60 collected tokens, safe stopped choice scenes offer another stream or keeping the current plan. Choices clear the upcoming approach and give fresh reaction time. No choice grants virtual pay, XP or guaranteed business outcomes. The existing 100-token target, life losses, token/scoring functions and device-local score submission are retained.

Left/Right (or A/D) dodge; Up/Space jumps, Down ducks, S slides, P/Escape pauses. Touch buttons and horizontal roadway swipes provide equivalents. Side-view flip/kick animations and ladders are not substituted into this view; controls and animations outside Level 2 are untouched. A lane hazard always leaves two open lanes; word groups and hazards do not spawn on top of each other. The camera has a stable vanishing point, with slower distant storefront markers, faster lamps/pedestrians/paving cues and near road markings. Reduced motion stills scenery motion and poses.

Vocabulary uses existing definitions for skills, customer, services and business income. Income stream uses Lesson 2's exact first sentence. The original seven income-type words remain in the vocabulary set. New examples/opportunity descriptions are practice context, with no invented prices. Recaps list actually explored paths and the value each created. The existing Read This Screen behavior reads the currently displayed scene/word and example.

## Exact artwork still needed

Rear-view sheets are visible in chat but were not attached as downloadable files. The draft therefore uses an explicitly temporary back-view rendering, never a side-facing or front-facing run sheet. **Do not publish this draft as the completed rear-view artwork integration.** Upload these original PNGs in a ZIP under 32 MiB (or individually):

- `CMI_kanyon-rear-run-sheet.png`
- `CMI_maya-rear-run-sheet.png`
- `CMI_everest-rear-run-sheet.png`
- `CMI_sofia-rear-run-sheet.png`
- `CMI_zion-rear-run-sheet.png`
- `CMI_ruby-rear-run-sheet.png`

Inspect real alpha channels, per-sheet grid sizes and source bounds; Maya/Ruby previews appear to have opaque backgrounds. Do not slice/reconstruct the chat thumbnail or silently replace one character with another. After source review, register eight measured cells, baseline, body height and `reviewed: true` per stable character ID in `career/rear-run-cycles.json`, then rebuild `src/rear-run-manifest.js`. The renderer uses only the selected character's exact entry, preserving source cells and aspect ratio.

The empty downtown background was generated as a separate scene layer from the supplied visual direction, without baked-in characters, vocabulary or obstacles. Its source dimensions and hash are in the image audit. Dynamic tokens, signs, controls, vocabulary and characters stay separate and accessible. Original illustrated downtown reference artwork remains intact.

## Validation completed

Build and TypeScript checks passed. All 175 unit tests passed, including full 100-token forward runs at rookie/intermediate/expert pace, safe choices without money awards, lane/jump/duck collisions, and vocabulary/recap accuracy. Browser checks passed at 320×568, 390×844, 844×390 and 1440×900 for intro, keyboard/touch choices, lane controls, jump/duck, vocabulary, two/three-stream recaps, and no page overflow. Existing Level 1 Arcade/Bonus Needs/Wants checks and Arcade levels 1→2→3 progression passed. All 240 audited image files decoded through HTTP across both entry points. Exact rear-view animation validation remains pending source PNG uploads.
