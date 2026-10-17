# Financial Runner artwork status

The selection screens and lessons use the six original Money Ops student portraits in `assets/cast/`. The runner uses dedicated right-facing character cutouts in `assets/runner/` so each student looks toward incoming obstacles.

The current runner environments, hazards, collectibles, power-ups, particles, labels, and parallax scenery are original Canvas-drawn game art. Each of the 32 lesson configurations has unique named hazard and reward sets. All 64 hazards receive their own generated color, pattern, dimensions, and motion variant, while a small shared set of geometric symbols provides a consistent temporary icon system.

The Canvas engine animates the directional cutouts with state-specific movement, rotation, scaling, flashing, and effects for running, jumping, falling, landing, ducking, collecting, taking damage, celebrating, and mission completion.

Future frame-by-frame sprite sheets can replace these cutouts by updating only the character renderer in `src/runner.js`. The 32 lesson configurations and game flow do not need to change.
