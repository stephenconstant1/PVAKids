# Lesson 1 customer job practice

“Run the job” uses the supplied image at
`assets/crew/lesson-one-run-the-job.jpg`. Desktop image tools and larger phone
controls share one calculator. The home button and city navigation open it
without prerequisites; the original lesson and city-responsibility flow remain.

## Required practice budget

Every practice job now uses a fixed **$100 customer payment** (100 bread in game
money) and the image's required minimum costs:

| Category | Minimum |
| --- | ---: |
| Materials | $25 |
| Labor | $40 |
| Overhead | $15 |
| Total minimum cost | $80 |
| Remaining at minimums | $20 |

The existing Neighborhood helper, School tutor and Studio creator choices keep
their customer needs and purposes. The $100 budget and these floors are classroom
practice rules for each choice, not permanent real-world prices or changes to
saved city-job rewards. The original city transactions remain unchanged:
Neighborhood helper earns 100 bread with 0 supplies; School tutor earns 130 with
10 supplies; Studio creator earns 155 with 25 supplies.

Students identify a need, choose useful work, consider materials, labor and
shared overhead, allocate the remaining $20, check their plan and explain the
value created for the customer. Remaining money means payment minus listed
costs, not guaranteed profit.

## Controls and validation

- Each category starts at its minimum. Minus buttons and native number-input
  steps cannot take a valid value below that floor.
- Plus buttons stop when the $100 budget is fully allocated.
- Typed amounts below minimum, incomplete values, fractions and values above
  $100 are invalid. Clear inline messages explain the problem.
- A manually entered total over $100 shows the shortfall and disables both
  Check buttons. The action handler independently rejects the plan even if a
  disabled button is bypassed. Exact $100 totals are valid and leave $0.
- Image and large controls update together, with live totals and keyboard/touch
  support. Reduced motion is respected.

Practice estimates and notes are presentation state, outside financial/scoring
saves. They survive rerender and ordinary in-app navigation but reset on reload.
The note prefills the existing final city reflection, which is saved through its
usual submit action. No new rewards or wallet transactions are generated.

The original paid work, allocation, city project, service cost, scripture,
character designs and other lessons are preserved. Version 46.11 refreshes the
entry assets, city renderer and practice rules together.

## Validation

Unit checks cover all three job choices, each minimum, invalid values, exact and
over-budget totals, step-button bounds and unchanged saved city-job data.
Chromium checks cover all jobs at 320/390/768/1440px, including image and touch
controls, keyboard input, reduced motion, disabled-button bypass rejection,
reflection and onward city progression with unchanged financial saves.
