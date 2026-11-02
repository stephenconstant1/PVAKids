# Active-lesson comic

The existing lesson page keeps Career Mode, scripture, Read This Screen, the
lesson badge, selected character guide, big idea and vocabulary. An inline comic
now appears before the active lesson's choices. It is not a separate landing
page. The prior Lesson 1 introductory comic stays intact; completing it avoids
showing a second comic automatically, while the generic replay remains available.

`src/lesson-comic.js` builds panels from the active mission's own title, core
idea, dialogue, brief, decision examples, event and takeaway. It does not run
financial effects or select a decision. A curriculum containing the six
entrepreneurship process terms receives six panels in its existing term order:
find a need, generate ideas, research, plan, act, persist. The component checks
that vocabulary, not a hard-coded Lesson 08 identifier. All 32 mission models
are covered by unit tests, and a different lesson is checked in the browser.

The entrepreneurship illustrations use canonical guide/contributor portraits,
word cues, and existing Yard Care, Study Help and Creative Kits examples. Their
$60/$30/$100 details come directly from the active lesson data. The supplied
comic image is visual direction; its separate Lesson 1 practice numbers are not
inserted into the entrepreneurship curriculum.

Next/Back, progress, replay and skip work with mouse, touch, Enter and Space.
A focused panel also accepts Left/Right arrows. Navigation focuses the current
panel or the restored activity heading. Vocabulary buttons expose their state
with aria-pressed and announce definitions through a live status region. Each
cue is available by activation, without relying on hover. Read This Screen keeps
the original big idea and includes the current panel text during the comic.
Panel and character entrance motions are disabled for reduced motion.

Presentation state (`lessonPanel`, `lessonComicDone`) is kept with the current
active lesson. It does not modify wallet values, decisions, experience, scoring,
completed lessons or unlock rules. The original choice activity and event return
unchanged after completion/skip, and retain all effects and controls.

## Existing glossary limitation

`lessonVocabulary` currently returns the lesson big-idea fallback for the six
entrepreneurship terms; there are no separate approved definitions for them in
the glossary. The UI preserves that exact definition and adds an existing lesson
example as context. No new term definitions or scripture wording were invented.

## Validation

- Build and TypeScript checks; 131 Node tests, including active content across
  all 32 lessons, six entrepreneurship cues, source preservation and panel bounds.
- Eight focused Chromium scenarios at 320/390/768/1440px with normal and reduced
  motion: panel navigation, arrows, vocabulary, read-aloud, replay/skip, canonical
  assets, original choice effects, and no horizontal overflow.
- A second active lesson confirms the title, guide and content change with it.
- The existing campaign browser test skips the optional comic to exercise the
  unchanged activities. Its drag helper centers both interaction points for
  taller lesson pages rather than dragging from outside the viewport.
