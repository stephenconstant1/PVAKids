# Run the Job · Lesson 1 (46.15)

Home → Lesson 1 → eight-panel comic → one illustrated job board.

The comic now uses eight separate 1448×1086 redraws under
`assets/crew/job-comic/`, guided by the user's supplied original sheet (retained at
`assets/crew/CMI_lesson-1-a-job-that-helps-the-city-comic-reference.jpg`). Every panel has accessible text,
Next/Back, progress, skip and replay. Reduced motion removes the entrance motion.

The board fills the page; Home, three job choices and replay are the only outer
controls. No duplicate calculator, pricing disclaimer or reflection form appears
under it. All cost controls are inside the illustration. Phone layouts stack the
same controls with matching illustrations, without creating a second calculator.

Each choice switches the entire board artwork, customer need and cost details:

- Neighborhood Helper: gloves/seeds/bags, yard-work time, shared tools/transport.
- School Tutor: pencils/learning cards, preparing/explaining, shared books/equipment.
- Studio Creator: paper/art supplies, designing/making, shared tools/workspace.

The tutor and creator board variants preserve the original waterfront layout and
crew artwork style. They are original generated illustrations, not reference SVGs.

## One $100 planning task

Every job has a $100 payment. Required classroom minimums remain materials $25,
labor $40, overhead $15: $80 committed, $20 left. Plus/minus and typed values
update totals immediately. Below-minimum entries clamp to the floor; blanks,
fractions and invalid costs cannot pass. Over-budget totals show the shortfall
and cannot pass even if a disabled Check control is bypassed.

Check the Job opens the remaining-money step inside the same illustrated board.
Students assign the remaining dollars among Needs, Wants and Invest / Future.
All buckets may be zero; the combined allocation must equal the amount remaining.
No negative, fractional, incomplete or over-assigned plan can finish. Exact $100
job costs leave $0 and require no extra spending. Revising costs resets the
allocation. Money remaining means payment less listed costs, not guaranteed profit.
No investment outcome or return is simulated.

This is transient classroom UI state. It does not award XP, change scoring,
transfer wallet money or alter the original saved job prices. Original paid work,
allocation, city responsibilities and lesson progression remain in Career Mode.
The city map, map buttons and rebuild buttons are temporarily hidden; their
saved data is preserved. The Arcade mode and other lesson content remain intact.

## Validation

Unit tests cover original financial rules and conservation of remaining dollars.
Browser checks cover all three jobs at 320/390/768/1440px, illustrated asset
switching, minimums, exact/over budgets, allocation validation including bypass,
keyboard/touch interaction, page overflow, comic navigation and reduced motion.
The Career workflow regression covers actual lesson → paid work → allocation →
project → reflection, save/reload, Arcade isolation and both static entry points.
