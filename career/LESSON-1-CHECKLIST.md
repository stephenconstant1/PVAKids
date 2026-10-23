# Lesson 1 template review

Scope: finish Lesson 1 before expanding visual or interaction changes to Lessons
2–32. Keep all existing lessons available and preserve their original wording.
Reuse the finished structure, not Lesson 1's teaching content, for other lessons.

## Source of truth

- Lesson 1: **Earning & Creating Value**.
- Core idea: **Money is earned by creating value through your time, skills,
  ideas, products, and services.**
- Original vocabulary: **time, skills, ideas, products, services, employee,
  self-employed, business owner, creator**.
- Original city stop: **Value Village**; source location: **THE NEIGHBORHOOD**.
- Sources: `src/content.js`, `src/curriculum-language.js`,
  `src/curriculum-meta.js`, `src/play.js`, `src/city.js`.
- Art reference: `assets/crew/money-ops-moneybread-city.jpg`.

Check a box only when its stated evidence exists. Automated functional checks
and visual acceptance are separate. A passing test does not establish that a
character's motion or scenery looks right.

## 1. Entry and navigation

- [ ] Opening the site shows the homepage, including with an existing save.
- [ ] Career and Arcade choices are clear and separate.
- [ ] Continue Career resumes the exact saved activity without resetting money.
- [ ] HOME works on desktop and phone without losing progress.
- [ ] The student can tell whether they are in Career, a Career bonus run, or Arcade.

## 2. Scene plan and city destination

- [ ] Agree on the Lesson 1 scene layout before expanding it to other lessons.
- [ ] Use the original city artwork without replacing buildings or crew likenesses.
- [ ] Show the complete crew reference without stretching or cropping members out.
- [ ] Keep baked-in lettering separate from controls and lesson text.
- [ ] Clearly identify Value Village and the upcoming Lesson 1.
- [ ] Destination selection opens the correct lesson by mouse, touch, and keyboard.
- [ ] Current, completed, and locked states are readable without relying on color.
- [ ] Clearly distinguish static source artwork from an animated playable scene.
- [ ] A missing image gives a readable fallback while navigation still works.

## 3. Crew and art accuracy

- [ ] Kanyon, Maya, Everest, Sofia, Zion, and Ruby keep their original identities.
- [ ] Compare faces, skin tones, hair, clothes, shoes, and colors with the reference.
- [ ] Verify height relationships and body proportions against the chosen reference.
- [ ] Check characters at actual gameplay size, not only enlarged previews.
- [ ] Lighting, perspective, scale, foot placement, and shadows fit the scene.
- [ ] No isolated rectangular cutout or mismatched background around a character.
- [ ] Approve desktop and phone views before reusing this composition.

## 4. Runner scene and animation

- [ ] Capture the actual Week 1 pre-run and bonus run, not a detached animation demo.
- [ ] Replace the flat block scenery with the agreed Lesson 1 environment.
- [x] Enable the coordinated stride in both Lesson 1 Career runs and Arcade Level 1.
- [ ] Legs visibly exchange forward and trailing positions in actual gameplay.
- [ ] Arms swing opposite the legs; elbows and knees bend at natural joints.
- [ ] Feet plant, lift, travel, and return without sliding or hovering.
- [ ] Body lean and grounding support the stride without a whole-image hopping effect.
- [ ] Faces stay intact; clothing joins do not tear, flash, or leave floating pieces.
- [ ] Check source likeness and motion for all six selectable Arcade characters.
- [ ] Jump, landing, duck, damage, collecting, pause, restart, and finish transitions work.
- [ ] Run pace remains readable at Rookie, Intermediate, and Expert settings.
- [ ] Reduced motion preserves understandable gameplay and disables decorative motion.
- [ ] Record a short on-screen run for visual review; still frames alone are insufficient.

## 5. Lesson activity and teaching sequence

- [ ] Opening directions teach the original core idea in plain student language.
- [ ] Use original vocabulary consistently in dialogue, instructions, and feedback.
- [ ] Every activity step is achievable using touch, mouse, and keyboard.
- [ ] Verify the time, skills, and ideas work choices and their original activities.
- [ ] Explain why the student's work creates value and earns income.
- [ ] Give helpful retry feedback without shaming or silently skipping a step.
- [ ] Prevent duplicate rewards from repeated clicks, replays, or reloads.
- [ ] Clearly explain the transition from activity to Career city choices.

## 6. Bread, work, and city consequences

- [ ] Explain that bread means game money.
- [ ] Work shows gross earnings, supply costs, and bread kept.
- [ ] Wallet separates available bread, income, spending, savings, and investments.
- [ ] Lesson 1 does not unlock investment choices that belong to later lessons.
- [ ] Show project and service costs before the student commits.
- [ ] Financial choices have understandable, deterministic consequences.
- [ ] A funded project changes its visible city state and explains why.
- [ ] An insufficient balance offers a recovery path without corrupting progress.
- [ ] Career lesson dollars, city bread, and Arcade rewards remain separate.

## 7. Reflection and progression

- [ ] Reflection connects the student's own choice to an original Lesson 1 term.
- [ ] Explain activity and reflection requirements before unlocking Lesson 2.
- [ ] Completion feedback is readable without animation or sound.
- [ ] Lesson 1 becomes completed, Lesson 2 current, and later lessons stay locked.
- [ ] Replay preserves existing rewards, saved reflection, and city progress.

## 8. Saving, errors, and reset

- [ ] Reload during each major step and resume the correct state.
- [ ] Verify wallet, activity progress, city project, and reflection save together.
- [ ] Display save failures and missing-content states clearly.
- [ ] Reset/rebuild explains exactly what changes and requires confirmation.
- [ ] Export and restore a Career backup without losing Lesson 1 progress.
- [ ] Arcade play and leaving Arcade never overwrite the Career save.

## 9. Access, layout, and performance

- [ ] Review desktop, tablet, and 320/390-pixel phone layouts with no overflow.
- [ ] Text remains readable and important controls have comfortable touch targets.
- [ ] Keyboard focus is visible, follows a sensible order, and reaches every action.
- [ ] Labels and status feedback work without color, animation, or audio alone.
- [ ] Reduced-motion behavior works in the city, lesson activity, and runner.
- [ ] Check loading and real frame timing on a representative phone or tablet.
- [ ] Check browser console for errors and assets for missing requests.
- [ ] Profile actual bottlenecks before changing languages, engines, or dependencies.

## 10. Template acceptance before expansion

- [ ] Complete the whole flow: homepage → Career → destination → pre-run → original
  activity → bonus run → work → allocate bread → city project → reflection → save.
- [ ] Compare the finished scene and moving characters with the supplied reference.
- [ ] Record remaining defects with a screenshot or short clip and exact reproduction.
- [ ] User reviews the Lesson 1 visuals and motion at normal gameplay size.
- [ ] Resolve blocking defects and rerun the focused checks.
- [ ] Freeze the reusable scene, UI, animation, state, and accessibility structure.
- [ ] Document what varies per lesson: original title, vocabulary, activity,
  destination, characters, examples, project connection, and reflection.
- [ ] Expand only after this review; preserve the original one-to-one lesson order.

## Current handoff

Version 45.3 passed functional homepage, Career, Arcade, saving, responsive,
keyboard, reduced-motion, and original-lesson regression checks. That does not
mean its art or animation has visual approval. Its original city-and-crew poster
is static. The Week 1 runner's flat background still needs art work.

Version 45.4 enables the existing articulated stride for Lesson 1's Career
pre-run and bonus run as well as standalone Arcade. Other Career lessons retain
their prior behavior while Lesson 1 is reviewed. Keep visual checkboxes open
until the moving scene is inspected and accepted.

Focused browser verification for 45.4 passed: the actual Career pre-run uses
Kanyon and the bonus run uses Maya; both enable the articulated renderer, advance
the stride clock, and retain jump/pause controls. Build, unit checks, and TypeScript
checks passed. This verifies the animation is connected, not visual acceptance.

## Approved follow-up scope for 45.6

- Apply the approved Everest reference consistently; preserve the other five crew.
- Review the repaired rear-arm visibility and the shared-ground foot recovery.
- Verify 200 coins meets the Lesson 1 goal without ending the run.
- Verify hearts replenish lives up to 5, then finish and bank rewards manually.
- Verify paycheck counts, their city-coin contribution, and no duplicate deposits.
- Keep final visual acceptance open until normal-size gameplay is reviewed.
