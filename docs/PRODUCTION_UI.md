# Viewport-fitted Money Ops screens · 46.18

## What changed

- Home retains its approved single-city-image composition and in-scene links,
  with a newly reconstructed city image and Maya's canonical yellow headband.
- Run the Job uses newly drawn **blank** board artwork. Job pictures are a
  separate four-scene sheet for each existing job. Labels, amounts, inputs,
  steppers, totals and buttons are actual HTML arranged on the blank paper.
- Neighborhood Helper, School Tutor and Studio Creator switch all customer,
  materials, labor and shared-overhead illustrations and descriptions together.
- Comic navigation and sound/text/lesson controls are inside a viewport-fitted
  frame. Lesson context (including scripture and vocabulary) and readable panel
  text open in dialogs inside the same page. The printed panel art is never
  obscured by navigation. Pause, narration, reduced motion and keyboard remain.
- Continue Career has three summaries: Completed, Do This Next, Coming Up. One
  highlighted action at the top resumes the current activity or starts the next
  unlocked lesson. The old repeated navigation, wallet grid and long lesson list
  are absent from the hub. More opens money, profile, teacher and lesson options.
- Each Career step opens on its own page. Three lesson cards or project groups
  appear at a time. Small screens page through choices horizontally; completing
  the existing reflection highlights the next lesson on the hub.

## Artwork resolution: verified output, not metadata claims

| Asset | Actual native pixels |
| --- | --- |
| `assets/crew/production/CMI_moneybread-city-home-crew.png` | 1640 × 959 |
| `assets/crew/production/CMI_run-the-job-interactive-board-background.png` | 1672 × 941 |
| `assets/crew/production/CMI_neighborhood-helper-job-scenes.png` | 1672 × 941 |
| `assets/crew/production/CMI_school-tutor-job-scenes.png` | 1672 × 941 |
| `assets/crew/production/CMI_studio-creator-job-scenes.png` | 1672 × 941 |
| Existing rebuilt comic panels | 1448 × 1086 each |

The image generator was explicitly asked for native 3840px output but returned
these sizes. **These raster assets are not native 4K.** No interpolated enlargement
or DPI tag is presented as additional image detail. True native 4K replacement
artwork remains a limitation. 300 DPI concerns printed physical size; browser
clarity depends on actual pixels and display size.

The rebuilt job's labels, currency, borders and controls render as native browser
text/layout and scale to 4K. The separate job illustrations use much larger source
regions than the old small crops. New source PNGs are copied unchanged from the
image generator; the original source assets remain available in the repository.

## Existing behavior preserved

`career/simulation.ts`, job earnings, scoring, lesson data, saved wallet rules,
project prices, investment scenarios and unlock conditions are unchanged. The
classroom job still pays $100 with required minimums of $25 materials, $40 labor
and $15 overhead. Remaining money must be allocated among Needs, Wants and
Invest / Future, without promising profit or investment returns.

Career uses the existing learned/work/allocation/project/reflection sequence.
The simplified hub does not falsely unlock a lesson early. Replays remain
practice, and saved progress is retained. Optional tools and all 32 lessons
remain accessible through More. Arcade gameplay and controls are unchanged.

## Main source files

- `career/job-practice.ts`: blank-board composition and separate job artwork.
- `career/job-comic.ts`: fitted in-frame controls, readable text/lesson dialogs.
- `career/ui.ts`, `career/types.ts`: simplified hub, single activity, pagination.
- `src/app.js`: existing route wiring, career tools and choice navigation.
- `src/lesson-one-comic.js`, `src/play.js`: current compiled comic import version.
- `career/city.css`: viewport, touch, short-landscape and 4K layout rules.
- `index.html`, `scripts/build.mjs`: coordinated cache versions and both entry points.
- Production artwork in `assets/crew/production/` and generated `/money-ops/` mirror.

## Validation

`tests/production-layout-browser.cjs` verifies all eight comic panels, job switching,
minimum costs, over-budget messages, remaining-money completion, lesson context,
saved-state hub and pagination at 320×568, 390×844, 844×390, 1024×768, 1440×900,
1920×1080 and 3840×2160. It checks actual document scroll bounds and visible controls.
`tests/career-simple-flow-browser.cjs` checks work → plan → project → reflection →
highlighted Lesson 2 on portrait phone, short landscape and desktop. The updated
Career regression starts with the actual original lesson, then verifies financial
steps, save/reload, both entry points and Arcade isolation. Unit checks cover the
next-action decision, unchanged financial rules and remaining-money conservation.

The previously supplied Neighborhood Bakery image is still only a chat preview
in this workspace; its original downloadable PNG is needed for an exact insertion.

`tests/production-comic-browser.cjs` additionally verifies in-frame Back/Next,
replay/skip, vocabulary/scripture dialogs, narration and its text-only fallback,
pause/continue and reduced motion across both comic routes and three screen sizes.
The former inline lesson context and panel text remain available through Lesson
and Text buttons inside the frame, without pushing Next below the viewport.
