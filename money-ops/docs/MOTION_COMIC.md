# A Job That Helps the City · motion comic (46.17)

The same eight-panel component (`career/job-comic.ts`) runs inside the existing
Career Lesson 1 page and the direct Run the Job lesson route. No video, new landing
page or external service is used. The Career page keeps its actual lesson title,
scripture, active-character guide, vocabulary definitions and Read This Screen.
The direct route receives those same values from `missions[0]`, the existing cast
and `lessonVocabulary(1)` rather than copied curriculum facts.

## Art inspection and motion plan

`assets/crew/CMI_lesson-1-a-job-that-helps-the-city-comic-reference.jpg` is the supplied flattened eight-panel sheet.
`assets/crew/job-comic/CMI_job-comic-01-customer-needs-help.png` … `CMI_job-comic-08-choose-a-job.png` are the existing high-resolution
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

### Lesson 1 job journey (46.21)
The comic now opens with three guide-led quote scenes: the source lesson’s big idea, its exact scripture/reference, and its existing time/skills/ideas definitions. Next leads into the same eight approved story panels; Back, Replay, Skip, narration, and reduced-motion support include the opening. These are HTML speech bubbles over existing artwork, with the original character portrait, rather than newly invented curriculum or repainted comic images.

A valid, fully assigned job budget now leads to a Lesson 1 completion screen, the existing post-lesson waterfront run, and Lesson 2. Skipping the optional run also reaches Lesson 2. The activity records completion and a financial snapshot, and uses the existing city legacy-completion mechanism to make Lesson 2 available without requiring the old city work/project/reflection menu. It does not award practice dollars, XP, medals, or city transactions. Earlier financial balances, completed lessons, and later active activities are retained. Saved Career profiles resume the completion/run/next-lesson step; guest practice stays unsaved. Both static entry points include the journey module.

### Current-section breadcrumb (46.23)
A compact, read-only breadcrumb shows the displayed section in the existing header area. It follows Home, Career tools, Arcade, comic opening/story, job costs/money plan, lesson completion, runner setup/play/results, and the active lesson. Image-led pages keep the breadcrumb inside the illustrated page. It uses a labeled navigation landmark, an ordered trail, and `aria-current="page"`; it does not change navigation actions, saves, scoring, or image assets.

### Waterfront needs and wants run (46.25)
Level 1 Arcade and Bonus/pre-lesson runs use illustrated need cards (housing, groceries, water bill) and optional want pickups (toy, game, treat). S or the existing touch Slide control handles need cards without losing a life; jump to collect want groups on the existing reachable arc. The existing Needs and Wants glossary definitions are reused verbatim. Original inline vector illustrations support both HTML previews and Canvas, with labeled categories and action prompts. Need feedback says “handled,” never that a required expense was destroyed or paid. These are learning examples; no bills are charged and no saved spending allocation changes.

Target counts, reward values, runner accounting, optional ladders, difficulty pacing and all other lessons stay in their existing systems. Magnets leave these jump pickups on their arc; ground contact cannot collect them. Definitions in the live vocabulary feed follow the actual need/want collected rather than an unrelated rotating lesson word. Normal jump/duck inputs remain available. The coin goal and no-time-limit run rules are unchanged.

On portrait phones the active Waterfront run keeps the Canvas, live vocabulary picture/definition, and touch actions in one viewport. The breadcrumb moves into the compact run title bar. Optional climb controls appear near a pole; the full Money Ladder panel opens only while attached at its planning checkpoint.

### Higher wants arc (46.26)
Waterfront want pickups sit 32 game pixels higher than their previous positions. Their three-item spacing still follows the existing jump flight, and ordinary coin arcs in other lessons are unchanged. High want labels move below the item to stay readable. Physics tests cover early/on-time/late jumps at the start and fastest paces, for Arcade/Bonus and every difficulty.
