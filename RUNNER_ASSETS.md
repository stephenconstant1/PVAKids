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


## Version 45.8 — randomized ducking and City Waterfront

Down Arrow and the accessible phone-size button now support hold-to-duck and release-to-stand for all six characters in Arcade, Bonus, and pre-lesson Money Run. Six original generated duck variations per character use canonical cast/runner artwork for identity; attached new images were used only for low-dodge pose inspiration. Original reference people, outfits, settings and props were not copied. The Ruby attachment repeated the jump sheet; her duck art was created from canonical Ruby references using the low-dodge guidance. No props were added.

`career/duck-animation.ts` chooses one of six variants per new trigger, avoids an immediate repeat, staggers onset 65–90ms and recovery 110–140ms, and never delays the duck hitbox. `career/duck-cycles.json` records the six-column, three-phase atlases in `assets/runner/cycles/*-duck.png`. `scripts/import-duck-sheets.py` measures the actual transparent component boundaries. Feet share a baseline, and all duck poses use one uniform scale per character (no body/face warping), fitting within 58px of the existing overhead clearance. Release cross-fades recovery into the existing run animation. Reduced motion holds a static low pose.

Keyboard, touch, pointer cancellation/capture loss, pause, blur, disposal, and simultaneous inputs release safely. Canvas downward swipe retains its short duck, measured in active gameplay time. Airborne duck requests are ignored. Up Arrow/Space exits duck directly into the unchanged jump. Existing hitboxes, overhead placement, pickups, scoring, objectives and persistence remain unchanged. No gamepad support previously existed.

Level 1's user-approved lesson title is now **Earning and Creating Value**. Its runner level name is **City Waterfront**, in both Arcade and Bonus runs. The original supplied JPEG is retained at `assets/environments/city-waterfront.jpg`; `city-waterfront.png` is the requested slightly cartoony adaptation matched to the crew. The scene keeps the skyline, river, railing and empty promenade, with a cached edge blend for smooth horizontal repeats. Wind stays above the lane, pauses with the game, and is disabled for reduced motion, which also holds the background still. If the panorama cannot load, the existing procedural renderer remains playable. Career destination ownership, lesson ordering and all financial rules are unchanged.

Checks: `npm run build`, `npm run typecheck`, `npm test`, `npm run test:animations-browser`, and `node scripts/validate-browser.mjs tests/waterfront-browser.cjs`. Run with `npm start`, then open http://localhost:8080. Root and `/money-ops/` entries share the same implementation. Separate dedicated hit/reward sheets remain unavailable; existing feedback remains in use.
