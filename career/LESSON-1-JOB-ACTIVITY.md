# Lesson 1 customer job practice

The original TypeScript/ES-module Moneybread City interface now presents “Run the
job” in place of the Lesson 1 city-building selection as the main activity.
The original city-project transaction remains in a separate City responsibilities
disclosure so existing choices, financial rules and progression remain usable.
Other lessons retain their project interface. The earlier lesson comic, work
activities, Arcade and Bonus controls are unchanged.

## Existing data and learning sequence

The practice jobs reuse `jobs` from `career/simulation.ts`:

| City job | Customer payment | Original supplies |
| --- | ---: | ---: |
| Neighborhood helper | 100 bread | 0 bread |
| School tutor | 130 bread | 10 bread |
| Studio creator | 155 bread | 25 bread |

Bread is the existing city's game money. No $100/$25/$40/$15 fallback scenario
was needed because payment and supplies already exist. Yard care, study help and
creating a product connect these jobs to the existing Lesson 1 activities.

Students identify a customer need, choose the work, consider materials, labor
and overhead, adjust estimates, compare payment against all three costs, and
explain how their work creates value. Labor and overhead have no authoritative
prices in the existing data. Their starting zero estimates are explicitly not
claims that time or equipment is free. Changing supplies is also clearly marked
as a practice assumption, not a change to the game's published price.

“Check the Job” gives feedback for remaining money, exact cost coverage, and a
shortfall. Remaining money is payment minus the listed costs, not guaranteed
profit. Examples of overhead describe shared transport, equipment or workspace
supplies; there is a reminder not to count a supply twice.

## State and rules

Practice accepts whole-number estimates from 0 to 10,000 bread per category;
blank, negative, fractional or out-of-range values cannot produce valid totals
or be checked. All categories are added exactly once. Estimates and local notes
are held in `CityUI`, outside financial/scoring saves. They survive rerender and
normal in-app navigation but reset on reload. Notes prefill the existing final
city reflection; that reflection is saved through its existing submit action.

There are no new rewards, wallet deductions, guaranteed outcomes or permanent
job prices. The original paid work, allocation, city project, service cost and
reflection rules remain in `applyCity`; no simulation transactions were changed.

## Artwork and validation

The supplied Run the Job image is included unchanged at
`assets/crew/lesson-one-run-the-job.jpg`. Working HTML controls replace its
painted buttons and amounts on desktop. Phones show the same image with a clear
link to the touch-sized controls beneath it. Both sets of controls share the
same state and arithmetic. Existing canonical guide portraits remain in use.
The illustrated sample prices are not new permanent game prices.
Responsive cards, numeric controls, focus outlines, live totals, short feedback
motion, and reduced-motion overrides support mouse, keyboard and touch.

Checks: build/typecheck; 128 Node tests; 12 job-planning Chromium scenarios across
320/390/768/1440px and all three jobs, including reduced motion, live arithmetic,
invalid inputs, shortfalls, unchanged saved financial data, reflection and onward
city progression; existing Career city and Lesson 1 comic browser regressions.
