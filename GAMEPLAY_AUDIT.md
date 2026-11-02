# City Waterfront gameplay audit

## Implementation confirmed

The browser uses native ES modules and Canvas 2D, with TypeScript sources in
`career/` compiled into `src/moneybread/`. `scripts/build.mjs` validates lesson
and asset provenance and synchronizes the root and `/money-ops/` entry points.
The engine is not Unreal. No 3D runtime is used.

Career follows the 32 original lessons. Pre-lesson, post-lesson Bonus, and Arcade
use FinancialRunner; Arcade uses temporary progression while Bonus credits its
existing bonus wallet. Lesson 1 remains **Earning and Creating Value**, in
**City Waterfront**, with a 200-collectible goal and optional continued running.
Other lessons retain their 100-collectible goal. Scoring and accounting are unchanged.

The route auto-runs rightward with a fixed screen-space player position. Space
or Up jumps, Down holds duck, S slides, P/Escape pauses. Touch supports jump,
hold-to-duck and slide buttons plus canvas tap/swipe. Physics uses 16px tiles,
a 12×26 standing / 12×14 duck body, 4× rendering, substepped collision, and
speed-dependent 4–5 tile jump heights. Rookie stays slow; Intermediate and Expert
accelerate, with Expert retaining its 1.5 multiplier. There are no enemies. Level 1 now has an optional climbable pole and a raised
planning deck; all other routes retain their controls. Existing boxes distinguish descending top crossings (stomp) from side
and rising impacts; no new enemy or stunt controls were added.

## Causes and focused changes

- Gravity 4800 produced roughly 0.33–0.37 second jumps. Gravity is now 2400,
  giving about 0.46–0.52 seconds at the same height; boots retain their height
  multiplier. Sprite jump phases still follow actual flight and landing.
- Box sizing allowed only 15ms of timing tolerance. Geometry now reserves 90ms,
  making a clean jump possible without relying on a stomp or slide.
- Coin spacing and heights were fixed despite difficulty and acceleration.
  Three-coin groups now derive spacing and height from the real jump envelope.
  A regression exercises collecting all three with one jump at starting and
  maximum paces in both modes at all difficulties.
- Encounter spacing already isolated jump and duck introductions. It now reserves
  a full boots flight plus 0.32s landing recovery and 1.25s reaction time after
  the last item. The existing shuffle, utilities, skyline and hazards remain.

## Optional Money Ladder route

Level 1 introduces an original pole and a one-way raised landing deck in a safe,
empty stretch before hazards. Players can keep running underneath. Up/Down
climbs only when touching the pole; release holds position, and Space or the Jump
button jumps off. Dedicated hold-to-climb/descend buttons support phones and
keyboard activation. The phone panel appears ahead of the pole; holding CLIMB
before arrival attaches on contact, avoiding a split-second tap requirement. Away from the pole, Up jumps and Down ducks as before.
Input cancellation, blur and pause release held climb directions. Jump, duck,
slide and pause remain available in their established contexts.

Scrolling, encounter timers and score accrual stop while attached. No hazards
or rewards share the introduction, and exiting reserves at least 1800px before
the next encounter spawn. The deck supports a downward landing and allows the
player to drop back to the path after jumping off. No moving-platform or enemy
system was introduced.

At the top, three labeled buckets allocate a separate practice $100:
50% Needs — $50; 30% Wants — $30; 20% Savings / Future — $20.
Each can be allocated once, in any order. The summary explains that earned money
can be planned and divided. The UI explicitly calls 50/30/20 one guideline,
not the only valid budget. Practice is optional and neither changes game wallets,
coins or score nor gates level completion. Players may leave before allocating.
The current character art stays intact; the attached pose uses the existing
2D directional art, with no new skeletal or stunt animation.

Level 1's spawned ground boxes now require jumping; sliding no longer destroys
them. Their existing downward top-crossing stomp still counts as a jump landing.
Other levels keep their working slide-through behavior. Overhead obstacles keep
the duck clearance derived from all six characters' measured duck artwork.

The broader ascending scaffold idea remains a possible later route; this change
adds the requested pole/deck alternate route within the existing autorunner.

## Motion and missing inputs

Existing six-character 16-pose run/jump atlases and six-pose duck atlases use
measured cells, uniform scaling, face anchors and ground baselines. IDs map
jordan→Kanyon, kai→Everest, eli→Zion. No character pixels, colors, costumes or
atlas slicing were changed. Existing run playback is an 800ms reordered loop;
its FBX provenance records 19 intervals at 30 FPS (633.33ms). These are distinct
reference and playback timings, not a skeletal conversion.

`Running (1).fbx` exists and its recorded SHA-256 is validated by the build.
The exact `Running.fbx` name is absent. The following requested inputs are absent
and need to be supplied before reference-based motion changes:

- Kanyon-Corrected-Run-Sheet.png
- Maya-Corrected-Run-Sheet.png
- Everest-Corrected-Run-Sheet.png
- Sofia-Corrected-Run-Sheet.png
- Zion-Corrected-Run-Sheet.png
- Ruby-Corrected-Run-Sheet.png
- Stylish Flip.fbx
- Running Forward Flip.fbx
- Running Forward Flip (1).fbx
- Corkscrew Evade.fbx

The two flip files cannot be compared until both are available. Check sheet cell
boundaries and character identity before importing; the existing importer expects
older numbered JPG inputs and should not be run blindly on corrected PNG sheets.

## Validation

- Build and typecheck; 124 Node tests pass.
- Node regression suite, including all 32 lessons × two phases × three
  difficulties, clean box clearance with ±35ms timing offsets, and complete
  three-coin arcs in one jump at starting/maximum paces.
- `tests/money-ladder-browser.cjs`: 18 Chromium scenarios (Arcade/Bonus × all
  three difficulties × 320/390/1440px), real keyboard/touch climbing, release to
  rest, descent, jump-off, all three $100 allocations, unchanged rewards,
  contextual jump/duck restoration, both entry points and no horizontal overflow.
- `tests/waterfront-full-run-browser.cjs`: eight real Chromium scenarios,
  Arcade/Bonus at all three difficulties on 390px phones and representative
  desktop/root/nested entry points. All reach 200 coins with lives remaining.
- `tests/platformer-browser.cjs`: Arcade/Bonus at 390px and 1440px, keyboard and
  touch jump/duck/slide, 30/60/120/144 FPS, walls, overhead clearance, complete
  canvas visibility and no horizontal overflow.

These are automated fairness checks, not a claim of exhaustive human playtesting.
Longer recovery increases run duration; goals and reward values intentionally stay
unchanged. Full scaffold work and corrected-sheet motion work remain separate.
