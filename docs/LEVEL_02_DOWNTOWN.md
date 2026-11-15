# Arcade Level 2: Building Income Streams

The native browser JavaScript/Canvas framework is retained. Only Arcade Level 2 uses `DowntownRunner`; Career/Bonus Level 2 and all other levels still use `FinancialRunner`. Level selection and character selection stay in the existing Arcade setup.

## Flow and controls

The selected character introduces downtown through a short speech-bubble scene. Students compare savings interest, bond interest, stock dividends and fund distributions, then explore the avenue in three lanes. At 25 and 60 collected tokens, safe stopped choice scenes offer another stream or keeping the current plan. Choices clear the upcoming approach and give fresh reaction time. No choice grants virtual pay, XP or guaranteed business outcomes. The existing 100-token target, life losses, token/scoring functions and device-local score submission are retained.

Left/Right (or A/D) dodge; Up/Space jumps, Down ducks, S slides, P/Escape pauses. Touch buttons and horizontal roadway swipes provide equivalents. Normal running uses the selected rear-view cycle. Optional F/K and directional stunts now work across runner modes; the extra flip-box reward and slide boosts are described below. Side-view cycles and ladders are not substituted into the forward view. A lane hazard always leaves two open lanes; word groups and hazards do not spawn on top of each other. The camera has a stable vanishing point, with slower distant storefront markers, faster lamps/pedestrians/paving cues and near road markings. Reduced motion stills scenery motion and poses.

Vocabulary uses existing definitions for investment income, interest, bonds, dividends, stocks, ETFs, risk, Needs/Wants and loans. Income stream uses Lesson 2's exact first sentence. The original seven income-type words remain in the vocabulary set. Examples and opportunity descriptions are practice context, with no invented rates or promised returns. Recaps list the income examples actually explored. The existing Read This Screen behavior reads the currently displayed scene/word and example.

## Rear-view artwork

All six original rear-view PNG sheets are installed from `CMI_Moneybread_City_Rear_View_Run_Sheets.zip`, with exact archive/member provenance and SHA-256 hashes. Both Maya and Ruby have real transparent alpha channels in the supplied files. Source bytes are preserved; only filenames were normalized to descriptive `CMI_` names.

Kanyon, Everest, Sofia and Zion use 1774 × 887 source sheets; Maya and Ruby use 1536 × 1024 sheets. Each has a reviewed 4 × 2 grid. Metadata in `career/rear-run-cycles.json` records all eight cells, visible bounds, a stable body scale/baseline, and an 80 ms frame duration (0.64-second loop). Raised feet stay raised instead of being snapped to the floor. The selected character loads only their own rear-view cycle. Normal running never renders a side/front cycle. Jumping and ducking retain their existing physics; the same rear artwork remains facing into the avenue. Dedicated rear jump/duck sheets were not supplied.

The run waits for the selected rear sheet to decode before starting. Missing or failed art has a temporary back-facing fallback; it never substitutes another character or switches to a side-facing run. Reduced motion uses a still rear pose, with scenery motion suppressed.

The empty downtown background was generated as a separate scene layer from the supplied visual direction, without baked-in characters, vocabulary or obstacles. Its source dimensions and hash are in the image audit. Dynamic tokens, signs, controls, vocabulary and characters stay separate and accessible. Original illustrated downtown reference artwork remains intact.

## Validation completed

Build and TypeScript checks passed. All 187 unit tests passed, including full 100-token forward runs at rookie/intermediate/expert pace, safe choices without money awards, lane/jump/duck collisions, and vocabulary/recap accuracy. Browser checks passed at 320×568, 390×844, 844×390 and 1440×900 for intro, keyboard/touch choices, lane controls, jump/duck, vocabulary, two/three-stream recaps, and no page overflow. Existing Level 1 Arcade/Bonus Needs/Wants checks and Arcade levels 1→2→3 progression passed. All 258 audited image files decoded through HTTP across both entry points. Rear-view validation now covers all six characters and 48 poses on desktop/phone, including loading gates and no temporary characters during normal running.

## Investment income, jumps and shared stunt rewards · 46.34

The four downtown stops now compare savings interest, bond interest, stock dividends and fund distributions. Definitions reuse the existing vocabulary; examples distinguish possible income from promised returns. The original income-type words remain available. Needs/Wants, loan, interest, stocks, bonds, dividends, funds and risk are reinforced through route pickups. Source curriculum title/scripture and Career activity rules are unchanged.

Raised Needs/Wants/income arcs require a jump. Ground-level words introduce collection first. Separate debt balls/loan hurdles can be jumped or dodged, followed by clear recovery space. Floating upper platforms are 144/176 screen-physics pixels above the roadway, below the existing 256-pixel normal jump apex. They accept descending landings, permit jumping off, and drop the player safely back to the road when passed; forward motion never freezes on a deck.

Three original animated patrons cross predictably and finish moving lanes before the contact zone. Touching one only slows movement briefly; it removes no money or life and earns no stunt reward. Other lanes remain clear. Vocabulary collapses to a readable word badge during nearby action to avoid covering patrons/pickups; Read word opens a full definition/example and deliberately pauses. Closing resumes only a previously running game. Read This Screen remains available. Reduced motion keeps the art poses/effects restrained without disabling necessary route movement.

Occasional slide gates give a three-second, 18% speed burst. Downtown then presents an income-card jump encounter. Across all runner modes, F/K and deliberate directional combinations are available; ordinary boxes still award $5 fictional bonus dollars, while a flip onto a question box awards $10 total ($5 extra) once. Free flips and kicks alone earn no money. Career post-run bonus dollars still use the existing Bonus Wallet; no lesson budget/net-worth transaction is changed. Forward flips rotate the same rear-view artwork; dedicated rear flip/kick pose sheets were not supplied.

LEVEL_02_IMAGE_PROMPTS.md lists reused Level 1 images and exact CMI_ filenames/prompts for requested investment, debt/loan, slide booster, question box and Bonus Wallet illustrations. Three walking-patron sheets are already generated/installed. The other new replacement-art entries remain image requests; current game illustrations remain playable.
