# Pilot lesson interaction standard

This is a pilot for user review. Do not build the complete weekly curriculum until the user approves the pilot and supplies the lesson list. The retained curriculum data is not an approved level sequence.

Target controls simple enough for ages 4–5, with financial detail available to grown-ups. This requires playtesting with children; automated checks verify operation, not developmental suitability.

For each later weekly level:

1. One visible goal and one short spoken/visual prompt.
2. An original animated setting with large, obvious objects and destinations.
3. A small hands-on activity: move, sort, collect, build, or match. Reading a lesson is not a prerequisite.
4. Immediate visual feedback after each action. Incorrect drops give a gentle retry, not a penalty.
5. A visible financial consequence: earned money, used supplies, savings paying a bill, or money owed.
6. A short reward and replay loop. Details live behind “Why?” or the grown-up menu.
7. One continuous cause-and-effect story. Money or choices from one activity must visibly travel into the next activity and change its result.

Keep controls at least 64px where possible, support pointer dragging plus tap/tap and keyboard alternatives, avoid mandatory timers, respect reduced motion, and preserve progress mid-activity. Animate the art inside a target rather than moving the target itself. Read-to-me uses browser speech when supported; voice availability varies.

Use `src/drag.js` for pointer interaction and `src/play.js` for the current illustrated activities. Pure state transitions keep finances separate from rendering. New weekly mechanics will need their own transition and renderer; these two pilot missions do not implement arbitrary lessons automatically.

The user's Money Magic, codeSpark, and Mario references describe engagement and easy controls. Use original art, characters, sound, and layouts. Money Magic could not be inspected from this workspace (proxy returned 403); no claim of matching its exact mechanics is made.
