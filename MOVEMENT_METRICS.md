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
is max(duck hitbox height, tallest measured duck artwork) + 12 rendered pixels.
It must remain below the standing hitbox height. This protects both the collision
box and all six full-size duck poses without scaling the artwork.

A ground hurdle's height is limited to 36% of the minimum normal jump rise.
Its maximum width additionally depends on speed and time spent ABOVE the hurdle:

    clearanceTime = 2 × sqrt(launchSpeed² − 2 × gravity × (hurdleHeight + topBuffer)) / gravity
    obstacleWidth ≤ speed × (clearanceTime − timingBuffer) − standingHitboxWidth

These equations use rendered units consistently. The route reserves a full flight,
0.24 s landing recovery, and 0.65 s reaction time after the previous encounter,
plus a randomized gap. Raised coin arcs are separate from hazards.

Tests simulate trajectories and collisions, not just these formulas. They cover
all difficulty settings, overhead release, single-jump coin arcs, wall/floor/ceiling
collisions and phone controls. Source artwork and jump/duck clips are unchanged.

Running.fbx was not found in the repository or accessible attachments. No FBX
motion timing has been inferred or claimed; supply the file before retiming runs.
