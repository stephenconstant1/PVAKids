# Arcade Level 2: Building Income Streams

The native browser JavaScript/Canvas framework is retained. Only Arcade Level 2 uses `DowntownRunner`; Career/Bonus Level 2 and all other levels still use `FinancialRunner`. Level selection and character selection stay in the existing Arcade setup.

## Flow and controls

The selected character introduces downtown through a short speech-bubble scene. Students choose a bakery job, tutoring, repair service or neighborhood market, then explore the avenue in three lanes. At 25 and 60 collected tokens, safe stopped choice scenes offer another stream or keeping the current plan. Choices clear the upcoming approach and give fresh reaction time. No choice grants virtual pay, XP or guaranteed business outcomes. The existing 100-token target, life losses, token/scoring functions and device-local score submission are retained.

Left/Right (or A/D) dodge; Up/Space jumps, Down ducks, S slides, P/Escape pauses. Touch buttons and horizontal roadway swipes provide equivalents. Side-view flip/kick animations and ladders are not substituted into this view; controls and animations outside Level 2 are untouched. A lane hazard always leaves two open lanes; word groups and hazards do not spawn on top of each other. The camera has a stable vanishing point, with slower distant storefront markers, faster lamps/pedestrians/paving cues and near road markings. Reduced motion stills scenery motion and poses.

Vocabulary uses existing definitions for skills, customer, services and business income. Income stream uses Lesson 2's exact first sentence. The original seven income-type words remain in the vocabulary set. New examples/opportunity descriptions are practice context, with no invented prices. Recaps list actually explored paths and the value each created. The existing Read This Screen behavior reads the currently displayed scene/word and example.

## Rear-view artwork

All six original rear-view PNG sheets are installed from `CMI_Moneybread_City_Rear_View_Run_Sheets.zip`, with exact archive/member provenance and SHA-256 hashes. Both Maya and Ruby have real transparent alpha channels in the supplied files. Source bytes are preserved; only filenames were normalized to descriptive `CMI_` names.

Kanyon, Everest, Sofia and Zion use 1774 × 887 source sheets; Maya and Ruby use 1536 × 1024 sheets. Each has a reviewed 4 × 2 grid. Metadata in `career/rear-run-cycles.json` records all eight cells, visible bounds, a stable body scale/baseline, and an 80 ms frame duration (0.64-second loop). Raised feet stay raised instead of being snapped to the floor. The selected character loads only their own rear-view cycle. Normal running never renders a side/front cycle. Jumping and ducking retain their existing physics; the same rear artwork remains facing into the avenue. Dedicated rear jump/duck sheets were not supplied.

The run waits for the selected rear sheet to decode before starting. Missing or failed art has a temporary back-facing fallback; it never substitutes another character or switches to a side-facing run. Reduced motion uses a still rear pose, with scenery motion suppressed.

The empty downtown background was generated as a separate scene layer from the supplied visual direction, without baked-in characters, vocabulary or obstacles. Its source dimensions and hash are in the image audit. Dynamic tokens, signs, controls, vocabulary and characters stay separate and accessible. Original illustrated downtown reference artwork remains intact.

## Validation completed

Build and TypeScript checks passed. All 177 unit tests passed, including full 100-token forward runs at rookie/intermediate/expert pace, safe choices without money awards, lane/jump/duck collisions, and vocabulary/recap accuracy. Browser checks passed at 320×568, 390×844, 844×390 and 1440×900 for intro, keyboard/touch choices, lane controls, jump/duck, vocabulary, two/three-stream recaps, and no page overflow. Existing Level 1 Arcade/Bonus Needs/Wants checks and Arcade levels 1→2→3 progression passed. All 252 audited image files decoded through HTTP across both entry points. Rear-view validation now covers all six characters and 48 poses on desktop/phone, including loading gates and no temporary characters during normal running.
