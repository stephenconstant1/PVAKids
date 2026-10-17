# Financial Runner artwork status

The playable characters use the six existing original Money Ops student portraits in `assets/cast/`.

The current runner environments, hazards, collectibles, power-ups, particles, labels, and parallax scenery are original Canvas-drawn game art. Each of the 32 lesson configurations has unique named hazard and reward sets. All 64 hazards receive their own generated color, pattern, dimensions, and motion variant, while a small shared set of geometric symbols provides a consistent temporary icon system.

Dedicated illustrated sprite sheets for running, jumping, falling, landing, ducking, collecting, taking damage, celebrating, and mission completion were not present in the supplied repository. Until those approved assets are delivered, the Canvas engine animates the existing full-body character portraits with state-specific movement, rotation, scaling, flashing, and effects. These are intentionally treated as working placeholders and are not described as analyzed curriculum artwork.

To replace a placeholder later, keep the public character names and proportions, add approved original sprite assets under `assets/runner/`, and update only the character renderer in `src/runner.js`. The 32 lesson configurations and game flow do not need to change.
