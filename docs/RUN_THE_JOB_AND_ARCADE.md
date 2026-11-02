# Run the Job and Arcade follow-up

Run the Job uses a fixed **$100 simulated practice budget** for all three customer
contexts. Minimums and initial values are $25 materials, $40 labor, $15 overhead:
$80 total and $20 remaining. Both illustrated and large inputs share these rules.
Inputs clamp below-minimum values, decrement buttons disable at the minimum,
and valid edits immediately update both sets of totals. Blank, fractional and
out-of-range values cannot pass. Over-budget totals remain visible for revision,
but neither Check the Job control nor its controller can accept them. $0 remaining
is valid. Editing clears prior success feedback.

The practice model remains transient UI state. Original city job payments,
supply costs, financial simulation, wallet, XP and scoring rules are unchanged.
The optional customer reflection still carries into the existing city reflection.

Arcade now offers recurring optional ladders on all 32 levels. Each ladder is
scheduled in route space at least 850 distance units after the previous one,
only after the previous pole has left the active entity list and approaching
hazards have cleared. A 2,400-pixel route reservation protects the approach;
jumping off reserves at least 1,800 pixels of recovery space. Climbing pauses
route movement; release rests, Down descends, and Space jumps off. Reaching the
ground releases the ladder. Each new deck resets its isolated $100 planning
exercise. Career retains its existing single Lesson 1 ladder.

Raised Arcade decks also hold an optional lesson-word card, collected on reaching
the top. The supplied arcade screenshots guide the repeated ladder/platform
structure and clear obstacle corridors within the existing 2D framework.

Illustrated book cards rotate through the active lesson's canonical vocabulary
and existing definitions. They occupy their own safe route slots. Collection
progress counts unique words collected in this run, separately from the existing
reinforcement stream, coin goal, XP, score and money. Missing a card does not
block the run; its term cycles back. Results preserve the reinforcement review.

Optional Arcade tricks use F / Flip and K / Air Kick. F uses the normal jump;
F then K queues a kick after the flip. Mirrored directions alternate. K uses
an existing extended-leg duck pose, without adding attack collision, damage,
obstacle-breaking, extra jump force or rewards. Pause clears an active trick;
reduced motion preserves controls with a static pose instead of rotation.
Normal jump, duck, slide and climb controls remain available.

Reference review: existing run, jump and duck source sheets and metadata were
inspected before implementation. Jump sheets supply tuck poses; duck sheets
supply low extended-leg poses. No dedicated flip/kick source sheets were present.
All source images and canonical identities are preserved. The flip is a Canvas
transform of approved poses, not a newly authored animation sheet.

The active-lesson comic remains in src/lesson-comic.js. Its unit tests and
responsive browser suite verify the existing implementation without rebuilding it.

Focused checks:

- npm run build; npm run typecheck; npm test
- node scripts/validate-browser.mjs tests/job-practice-browser.cjs
- node scripts/validate-browser.mjs tests/arcade-extensions-browser.cjs
- node scripts/validate-browser.mjs tests/money-ladder-browser.cjs
- node scripts/validate-browser.mjs tests/active-lesson-comic-browser.cjs
- npm run test:browser

Browser scripts need Playwright and system Chromium as described in README.md.
