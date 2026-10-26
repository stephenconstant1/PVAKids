# Money Ops movement and obstacle metrics

The game uses TypeScript, not Unreal/C++. All physics values below are world pixels;
render zoom is 4. Values come from career/platform-physics.ts and runner-physics.ts.

| Metric | World pixels | Rendered pixels |
| --- | ---: | ---: |
| Standing hitbox | 12 × 26 | 48 × 104 |
| Duck hitbox | 12 × 14 | 48 × 56 |
| Walking jump rise | 64 | 256 |
| Full-speed jump rise | 80 | 320 |

Gravity is 4800 world px/s². Launch speed is sqrt(2 × gravity × jumpHeight).
Jump rise is launchSpeed² / (2 × gravity); flight time is 2 × launchSpeed / gravity.
Owned boots and existing speed settings still apply. No double jump exists.

Editable route metrics live in career/waterfront-route.ts. Overhead underside height
is max(standing height − 4px, max(duck hitbox height, tallest measured duck artwork) + 12px).
It must remain below the standing hitbox height. This protects both the collision
box and all six full-size duck poses without scaling the artwork.

A ground hurdle's height is limited to 36% of the minimum normal jump rise.
Its maximum width additionally depends on speed and time spent ABOVE the hurdle:

    clearanceTime = 2 × sqrt(launchSpeed² − 2 × gravity × (hurdleHeight + topBuffer)) / gravity
    obstacleWidth ≤ speed × (clearanceTime − timingBuffer) − standingHitboxWidth

These equations use rendered units consistently. The route reserves a full flight,
0.24 s landing recovery, and at least 1 s safe running after the previous encounter.
It uses the maximum pace for that intensity, includes the boots flight margin and
player width, then adds a varied gap. Three-coin arcs have 66–70px center spacing
(24–28px between coin edges) and stay separate from hazards.

Tests simulate trajectories and collisions, not just these formulas. They cover
all difficulty settings, overhead release, single-jump coin arcs, wall/floor/ceiling
collisions and phone controls. Source artwork and jump/duck clips are unchanged.

Running (1).fbx supplies one 19-interval loop at 30 FPS (633.33 ms). The offline
Blender extractor scripts/inspect-running-fbx.py writes career/run-motion.json.
The extracted reference includes hip-relative foot and hand travel. Source poses
remain stored in row-major order; runtime playback is described below.
no new character art, mesh import, root travel or limb deformation is used.
Baked sprite art limits exact joint-level correspondence to the FBX. Jump and duck
animation timing is independent and unchanged.

The approved replacement source sheets are 4×4, measured as 16 disconnected
components each. scripts/import-updated-run-sheets.py removes exterior white and
uniformly scales each complete pose to the existing 124px visual height.
All poses share a face-based horizontal anchor and fixed floor baseline.

Version 46.6: The FBX remains the motion reference; comfortable sprite playback
is now 800 ms with 16 equal 50 ms holds to avoid rapid uneven frame changes.
Editable playbackOrder arrays visit all approved poses once in a loop, selected
by deterministic wrap-inclusive visual transition minimization. Reproduce with
python3 scripts/tune-run-playback.py after importing source sheets. No character
pixels, jump/duck clips, physics, scoring or coin objective changed.

Version 46.7 pacing: The first two configured jump hazards are introduced alone,
then two configured duck hazards, then the existing randomized hazard set.
Lessons without a configured duck hazard retain their source hazard set.
Action cues mark jump/duck hazards. No lesson vocabulary or hazard identity changed.
Stomps require a downward crossing of the obstacle top from above; side contacts
retain existing damage. Existing bounce, score and XP values are unchanged.
Entity collisions run in <=1/120 s steps, supplementing the existing 16px tile
physics substeps, so slow display frames cannot skip narrow hazards.

Validation: 192 full simulated routes (all 32 × both modes × all intensities);
eight complete browser routes (six phone mode/intensity pairs plus two desktops);
30/60/120/144 FPS tile/jump/wall checks with keyboard/touch. Bonus normally uses
standard pace in the UI; its other intensities are exercised through the harness.
No physical-phone or human playtest was performed.

Version 46.8 gameplay clarification:
- A shuffled bag preserves reward/hazard balance without repeating a four-slot
  sequence. Each run introduces one jump hazard then one duck hazard when the
  source lesson has both.
- Gap planning follows current normal pace with an 8% acceleration margin,
  capped at the difficulty maximum; slow-power expiration is accounted for.
  Existing one-second safe-running/recovery metrics remain.
- Overhead obstacles are now thin suspended beams, not ground-shaped boxes.
  Their underside remains at the calculated duck clearance.
- S or the dedicated Slide button triggers a 0.5 s grounded slide using the
  existing forward-slide pose. Ground boxes break during the active slide
  without losing a life. Down remains the held duck action. Airborne slide is
  rejected; pause/blur clears it. No new character artwork is invented.

Running art limitation: The supplied replacement 16-pose sheets repeat many
extended-leg positions and do not supply a reliable full contact/passing/
recovery sequence for opposing legs. Reordering and retiming cannot manufacture
missing knee-bend poses. The run art is NOT claimed fixed in 46.8; corrected
canonical artwork is needed for complete leg turnover.
