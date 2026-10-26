# Financial Runner artwork status

The selection screens and lessons use the six original Money Ops student portraits in `assets/cast/`. The runner uses dedicated right-facing character cutouts in `assets/runner/` so each student looks toward incoming obstacles.

The current runner environments, hazards, collectibles, power-ups, particles, labels, and parallax scenery are original Canvas-drawn game art. Each of the 32 lesson configurations has unique named hazard and reward sets. All 64 hazards receive their own generated color, pattern, dimensions, and motion variant, while a small shared set of geometric symbols provides a consistent temporary icon system.

The Canvas engine animates the directional cutouts with state-specific movement, rotation, scaling, flashing, and effects for running, jumping, falling, landing, ducking, collecting, taking damage, celebrating, and mission completion.

Future frame-by-frame sprite sheets can replace these cutouts by updating only the character renderer in `src/runner.js`. The 32 lesson configurations and game flow do not need to change.


## Version 45.7 — supplied run and jump sheets

All six characters now use separate 16-pose run and jump atlases in Arcade, pre-lesson Money Run, and Career Bonus runs. Career runners use the selected hero, with the existing six-character picker on the run intro. Bonus goals, wallet, pickups, hazards, jump gravity/velocity, hitboxes, touch and keyboard controls are unchanged. No gamepad support existed.

- `assets/runner/cycles/`: original uploaded JPEGs and transparent PNG atlases.
- `career/run-cycles.json`, `career/jump-cycles.json`: measured source crops, row split, cell sizes, anchors and sequence order.
- `career/run-cycle.ts`: shared rendering and one-shot jump frame selection.
- `scripts/slice-run-sheets.py`: reproducible offline importer (Pillow/numpy/scipy; no browser dependencies). Pass the source attachment directory and optionally `jump`.

Each image was inspected: eight poses per row, two rows, varying sizes and overlapping bounding boxes. Connected character outlines retain limbs/hair extending beyond nominal grid cells. Source RGB pixels are retained without resizing/repainting. Only exterior white background and baked-in ground shadows are removed; enclosed white shoe/eye pixels are retained. Every frame has the same foot baseline and a face-derived horizontal anchor. The game uniformly scales the entire pose.

Running loops in supplied row-major order at 22 fps. Jump input immediately triggers unchanged physics; anticipation/takeoff/airtime frames 0–9 follow flight time, and actual ground contact triggers landing/recovery frames 10–15 over the existing 240ms recovery. The animation never wraps. Another legal jump restarts the one-shot immediately. Pause freezes playback. Reduced motion holds a running pose, uses one airborne pose and one landing pose, and retains the physical jump arc and collision feedback. Missing/failed atlases retain the previous artwork so gameplay remains available.

No separate idle, duck, hit, reward or standalone falling sheets were supplied. Existing static artwork and existing feedback are retained for those states; supplied jump sheets cover landing and the normal airborne descent. No character art or props were invented.

Run locally: `npm run build`, then `npm start` and open http://localhost:8080. Checks: `npm test`, `npm run typecheck`, `npm run test:animations-browser`. Both root and `/money-ops/` entry points are synchronized by the build.


## Version 46.0 — stable running, full-size ducking, and Waterfront spacing

Running still uses all 16 supplied poses, now at 12 fps rather than 22. Per-frame floor anchors preserve the supplied airborne foot lift against a shared source-row ground line, keeping the body steady instead of snapping the whole character down to each foot. Damage retains the run sheet and uses a gentle opacity pulse instead of rapid blinking or changing back to different static character art.

Each character has six compact duck poses in `assets/runner/cycles/*-duck.png`, created from canonical Money Ops identities and low-dodge pose guidance. Source layouts are measured by `scripts/import-duck-sheets.py`. Duck sizing is calibrated to the normal run sprite's face width (glasses width for Zion); no shrink-to-58px or body distortion remains. `career/duck-cycles.json` records matching rendered head measurements. Feet stay grounded, one variation is held until release, and recovery blends back to the same run art. Overhead barriers are raised 32 logical pixels so full-size crouches fit; standing still collides and ducking clears them. Collision damage, ground hazards, jump physics and scoring remain unchanged.

Down Arrow/touch hold and release work in Arcade, Bonus, and pre-lesson Money Run. Pointer cancellation/capture loss, pause, blur, disposal and simultaneous inputs release safely. The downward swipe remains a timed duck in active gameplay time. Airborne duck input is ignored; Up Arrow/Space cannot jump while duck is active; release duck and wait for standing clearance first. Reduced motion holds a static run/duck pose and retains the physical jump. No gamepad support previously existed.

Level 1 is **City Waterfront**, teaching **Earning and Creating Value**. The supplied JPEG is preserved; the active PNG is the requested illustrated adaptation matching the crew. Separate nearby building art adds depth. Skyline, nearby buildings, trees, river, railing and path move at different speeds while the player stays at x=112. The path remains unobstructed. Nearby windows/edges receive a soft bounded pass-by glow. Wind stays above the lane. Pause freezes scenery; reduced motion disables wind/highlights and scenery scrolling. A failed background falls back to the existing renderer.

`career/waterfront-route.ts` and the shared runner schedule Level 1 encounters in route space rather than independent timers: groups of 3–4 coins, individual hazards, and separate utility pickups. Gaps vary and reserve maneuver/recovery time after the last item. Utility slots rotate fairly among due hearts, power-ups and Money Boxes so none disappear from Bonus play. Existing 200-coin goal, survival continuation, reward values, collection rules, lives and persistence remain in place; other 31 levels keep their original spawn scheduling.

Verification: build, TypeScript, unit tests, all six characters in Arcade/Bonus across root and `/money-ops/`, keyboard/touch holds, distinct duck poses, full-size head calibration, overhead clearance, landing recovery, mobile layout and reduced motion. Automated full runs reach 200 coins on desktop Intermediate, phone Expert, phone Bonus, and phone Rookie on the mirrored path, with spacing audits and no invulnerability cheats. Separate dedicated hit/reward sheets are still unavailable; existing feedback is retained.

Run: `npm run build` then `npm start`; open http://localhost:8080. Browser checks: `npm run test:animations-browser` and `node scripts/validate-browser.mjs tests/waterfront-full-run-browser.cjs`.


## Version 46.1 — TypeScript tile movement

`career/platform-physics.ts` now owns floating-point world position, velocity and acceleration. Solid tile boxes are exactly 16×16 world pixels and standing player bounds are 12×26, independent of character frames; ducking uses 12×14, retaining the foot anchor and horizontal center. Collision lookup converts only the current bounds to tile coordinates and reads `level[tileY][tileX]`. Separate horizontal/vertical resolution and bounded physics substeps prevent tunneling, including slow frames and fast motion. A blocked ceiling prevents standing until there is room.

`career/runner-tiles.json` is the editable row-first tile map. The default repeats the existing flat promenade floor; no lesson content or new mandatory obstacles were invented. Above-floor solid tiles are rendered when present. `career/runner-physics.ts` bridges world coordinates to the existing runner. A 4× camera keeps the canonical character art near its previous visual size; tile boxes remain 16×16 in world coordinates. Player/collision positions stay fractional while render positions round to pixels. The camera keeps the auto-runner at its existing screen position and follows high jumps vertically. The mobile canvas now fits its complete bitmap instead of cropping it.

Baseline tuning: walk 93.6 world px/s (1.56 px/frame at 60 FPS), run 153.6 (2.56/frame), acceleration 1200 px/s², gravity 4800 px/s². Walk jump height targets 64 world px and full-run height 80; full-speed range is approximately 56 world px, 3.5 tiles. Rookie/Expert, level difficulty and purchased jump boots still apply their modifiers. The existing auto-run progression blends walking toward running rather than introducing mandatory horizontal controls. Up/Space, Down, touch controls, pause, rewards, objectives and saving remain.

The solid-tile physics layer supports walls, floors, ceilings, corners and signed horizontal velocity. Existing financial hazards retain their damage/stomp rules as separate game entities rather than being silently converted into solid platforms. Gameplay displacement is taken from resolved movement, so hitting a solid wall stops the scrolling world. Existing score and lesson flow remain in the shared runner.

Tests cover 30/60/120/144 FPS benchmarks, 15 FPS and high-speed wall contacts, landing without overlap, ceilings, negative tile coordinates, safe crouch/stand and bounded tile lookup work. Integrated browser checks cover Arcade and Bonus at desktop/phone sizes, keyboard/touch, jump visibility, rendering alignment and actual tile walls. Run the physics browser check with `node scripts/validate-browser.mjs tests/platformer-browser.cjs`.

## Version 46.5 run reference

The six latest 4×4 source sheets replace only the running atlases. Their measured
components are repacked into the existing 8×2 runtime format. Whole poses scale
uniformly to the existing display height; faces, clothing and backpacks are not
repainted or deformed. Jump and duck sheets are unchanged.

Running (1).fbx has one Mixamo action, frames 1–20 at 30 FPS: 19 intervals,
633.333 ms per cycle. The offline Blender extractor writes run-motion.json with
source hash and hip-relative hand/foot samples. The browser uses these motion
beats to retime the ordered sprite poses. It never loads the FBX mesh.

## Version 46.6 playback and route adjustment

The supplied poses have discontinuities when treated as a row-major filmstrip.
Per-character playbackOrder now minimizes whole-pose visual changes, including
the loop seam, without changing source pixels. Equal 50 ms holds produce an
800 ms cycle; the original 633.333 ms FBX remains the reference rather than
forcing its cadence onto uneven drawings. All 16 approved poses remain available.
Coins now appear singly at jump height, separated by full recovery gaps.
The underside of duck bars is raised to 100px, above all duck art/hitboxes and
below the 104px standing collision height. Grounded duck and safe-release checks
remain enforced in Arcade and Bonus.

## Version 46.7 spacious 2D pacing

Jump/jump then duck/duck introductions use each lesson's existing hazard set.
There are no simultaneous hazard combinations. Gaps reserve flight, recovery,
at least one safe second, boots clearance and character width at maximum pace.
Three spaced coins follow a reachable jump arc. Jump/duck action cues accompany
the source financial labels. Entity collision substeps prevent skipped impacts;
falling top crossings produce the existing stomp bounce, while side hits do not.
The 16px grid, floating physics, horizontal follow camera, art and controls remain.

## Version 46.8

Grounded Slide (S / touch Slide) uses existing duck atlas frame 2 for every
character. It safely breaks ground boxes during its 0.5 s active window; Down
continues to hold duck below suspended beams. No new art or props were added.
The run sheets still lack sufficient clear passing/recovery poses for full
leg turnover. Timing/order changes alone cannot fix that source-art limitation.
