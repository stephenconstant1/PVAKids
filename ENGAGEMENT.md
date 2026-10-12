# Campaign interaction standard

Money Ops is a 32-mission financial-life campaign for grades 6–8. The player keeps one financial profile from earning and saving through investing, business, property, giving, and the finale.

Automated checks verify operation; classroom playtesting should still guide language, pacing, and difficulty.

Every weekly mission should provide:

1. One visible goal and one short spoken/visual prompt.
2. An original animated setting with large, obvious objects and destinations.
3. A short interactive decision or activity. Reading a long lesson is never a prerequisite.
4. Immediate visual feedback after each action. Incorrect drops give a gentle retry, not a penalty.
5. A visible financial consequence: earned money, used supplies, savings paying a bill, or money owed.
6. A short reward, mission medal, and replay loop.
7. One continuous cause-and-effect story. Money or choices from one activity must visibly travel into the next activity and change its result.

Keep controls at least 44px, support keyboard navigation, avoid mandatory timers, respect reduced motion, and preserve progress after every decision. The opening hands-on missions support pointer dragging plus tap/tap and keyboard alternatives. Read-to-me uses browser speech when supported; voice availability varies.

Use `src/drag.js` for pointer interaction and `src/play.js` for reusable mission frames. Pure state transitions keep finances separate from rendering. Missions 5–32 use the shared briefing → decision → consequence → challenge → debrief system with mission-specific visual simulators.

The user's Money Magic, codeSpark, and Mario references describe engagement and easy controls. Use original art, characters, sound, and layouts. Money Magic could not be inspected from this workspace (proxy returned 403); no claim of matching its exact mechanics is made.
