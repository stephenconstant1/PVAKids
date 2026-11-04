# A Job That Helps the City · motion comic (46.17)

The same eight-panel component (`career/job-comic.ts`) runs inside the existing
Career Lesson 1 page and the direct Run the Job lesson route. No video, new landing
page or external service is used. The Career page keeps its actual lesson title,
scripture, active-character guide, vocabulary definitions and Read This Screen.
The direct route receives those same values from `missions[0]`, the existing cast
and `lessonVocabulary(1)` rather than copied curriculum facts.

## Art inspection and motion plan

`assets/crew/lesson-one-job-comic.jpg` is the supplied flattened eight-panel sheet.
`assets/crew/job-comic/panel-1.png` … `panel-8.png` are the existing high-resolution
standalone redraws. They also have flattened characters, bubbles, lettering and
scenery. Separate canonical portraits exist in `assets/cast/`; running atlases are
not garden-character rigs. No separate face, eye, hair, hand or speech-bubble layers
were found. No pixels are stretched, erased or cut out to simulate such a rig.

Every panel's entire printed artwork stays fixed, including its faces, speech
bubbles, captions, garden signs, seed labels and numbers. Independent HTML captions
stay legible outside scene effects. Scene cues have only a subtle 1.5px drift and
soft opacity change; a separate canonical guide portrait has a 2px, 12fps stepped
reaction. All decorative cues are hidden from assistive technology.

| Panel | Still artwork | Independent motion |
| --- | --- | --- |
| 1 · Customer need | Crew, neighbor, bubble and sign | Gentle highlight around the neighbor/garden problem |
| 2 · Notice the problem | Faces, weeds/flower-bed labels | Highlight reveals the garden work area |
| 3 · Plan useful work | Crew and complete printed checklist | Warm highlight around the plan |
| 4 · Materials | Crew, seed packets and store lettering | Supplies highlight; readable caption entrance |
| 5 · Labor | Every gardening pose and tool | Work-area highlight; guide reaction |
| 6 · Overhead | Van label, shared tools and crew | Shared transport highlight |
| 7 · Practice Example | Original printed math and characters | Separate DOM cost figures enter in order, then remain |
| 8 · Finished garden | All canonical faces and celebration scene | Three small light glints over flowers, then job choice |

The comic surface uses the page's cream/teal palette, feathered image-to-caption
edges and no heavy gold image frame or drop shadow. Nested lesson frames are
softened only on the page hosting this comic. Faces and text are never faded by
scene animations. Readable HTML narration is available for every panel.

## Interaction, sound and financial rules

- Next/Back, Replay and Skip work through native touch/keyboard buttons. Left/Right
  arrows work while the panel has focus. Panels never advance automatically.
- Pause/Continue freezes decorative motion and pauses/resumes current narration.
  Entering a new panel while paused keeps captions and all numbers immediately
  readable. Reduced-motion preferences disable all comic effects.
- Read This Screen uses the existing optional browser speech synthesis and reads
  the current panel and lesson idea. No recorded character voices were found.
  The existing mute/music and synthesized click sound are reused; no new required
  sound files or services are introduced. Everything works without audio.
- Practice Example values come from the same authoritative job-budget constants:
  $100 payment − $25 materials − $40 labor − $15 overhead = $20 left. The remaining
  money is explicitly not guaranteed profit.
- Career completion returns to its original time/skills/product choices. Direct
  completion returns to the existing job board. Neither path awards rewards just
  for viewing, replaying, skipping, pausing or reading the comic.

## Layered sources needed for richer animation

True blinking, lip sync, hand gestures, moving hair/clothing, garden-tool motion,
or multi-plane camera parallax requires layered PSD/SVG sources or exported PNGs:
backgrounds without characters/text; complete character bodies with head/eyes/
mouth/hands/hair/clothes separated; props; speech bubbles and lettering separated.
The present implementation intentionally uses decorative motion and accessible
interface overlays rather than pretending the flattened panels contain rigs.

## Validation

Unit tests check panel order, shared route behavior, context escaping and exact
practice arithmetic. Browser coverage runs all eight panels on both lesson routes
at 320/768/1440px with normal and reduced motion; checks narration, keyboard/touch,
pause/resume, vocabulary, replay/skip, job choices and unchanged scores/wallets.
The full Career workflow regression also checks work, allocation, reflection,
save/reload and Arcade isolation. Both static entry points are built together.

The Neighborhood Bakery preview supplied later in chat was not available as a
workspace file at implementation time. Its exact art has not been replaced or
redrawn; the original downloadable PNG is needed before inserting that asset.

## Files changed

- `career/job-comic.ts`: shared storyboard, lesson context, math, accessible layers.
- `career/types.ts`, `career/ui.ts`: transient comic settings and route integration.
- `src/app.js`: narration, pause, vocabulary, navigation and lesson context wiring.
- `src/lesson-one-comic.js`, `src/play.js`: reuse the storyboard in the existing lesson.
- `career/city.css`: blended surfaces, restrained effects, responsive/reduced motion.
- `index.html`, `scripts/build.mjs`: versioned entry points and current module imports.
- `tests/motion-comic.test.js`, `tests/motion-comic-browser.cjs`, and the existing
  comic flow/browser tests: math, route, accessibility and regression checks.
- Generated TypeScript output in `src/moneybread/` and the `/money-ops/` mirror.

## Face-detail refinement · 46.19

All eight standalone panels were retouched to give the children's small noses
clearer warm-brown contours and subtle shading. The faint light-only marks were
hard to see when the scene was reduced to phone width. Each panel was reviewed
for the six established character identities/outfit colors, facial expressions,
lettering and practice-example arithmetic. Source dimensions remain 1448×1086.
A side-by-side browser preview at 320px confirmed the improved contour visibility.
The panel URLs and module entry versions were refreshed to load the corrected art.

### Scene quote bubbles (46.20)
Lesson and Verse open character quote bubbles within the comic frame. The illustrated speech bubble also opens that scene’s accessible caption and related vocabulary. Scene, Lesson, Words, and Scripture categories use Back/Next pages instead of a scrolling transcript. The source lesson introduction, notes, vocabulary definitions, and scripture remain unchanged; Read This Screen reads the selected quote. Escape closes notes and returns focus to its opener. On narrow or short screens the notes cover the scene while leaving comic navigation available; desktop keeps artwork and notes side by side. Notes persist across panel changes and sound preference redraws without changing progress or finances. Existing reduced-motion and pause behavior remain intact.
