# Money Ops — Moneybread City & Arcade

**Earn bread to run the city.** Career Mode now takes place in **Moneybread City**, an interactive illustrated city built through the original 32 lessons. Arcade Mode remains the existing standalone Financial Runner, with all 32 levels, six characters, intensity choices, temporary city rewards, and its device-local initials leaderboard.

The landing uses the supplied full crew image, uncropped, with mode controls below it. Career Mode now shows the same original city-and-crew image with all six characters together. Controls stay below the image. The poster itself is static; building stages and choice feedback appear in the separate interface. Opening the site always shows the homepage, with Continue Career for saved players. No characters were renamed or redrawn.

## Run

The compiled browser files are committed. To play locally with Python 3:

```sh
npm start
```

Open `http://127.0.0.1:8080`. Playing the static site needs no account, backend, payment, or external service. Career saves remain in this browser's existing local storage; Arcade never overwrites them.

To edit the TypeScript city interface or rules, use Node 20.10+:

```sh
npm ci
npm run build
npm test
npm run typecheck
```

TypeScript is the only new development dependency; it provides static checks and emits native browser JavaScript. No runtime library, C++, or WebAssembly was added. The build verifies all 32 original lesson mappings and synchronizes the existing root and `/money-ops/` copies.

## Career Mode: Moneybread City

**Learn → choose work → earn bread → save / spend / invest → improve the city → reflect → next lesson.**

Visit the school for the current original lesson and its interactive activity. Choose a job using time, skills, or ideas; compare pay and supply costs. Plan your bread, fund a district project, and reflect using an original lesson word. The next level unlocks after the activity and reflection. Investment choices unlock with Lesson 5, respect the teaching sequence, and show fixed classroom scenarios, including possible losses, before selection.

Explore the school, homes, shops, park, transit, hospital, bank, and studio. Funded district controls display their stages and animate choice feedback. The bread wallet separates available funds, total income, spending, savings, and investment value. City services need 10 bread each week: keeping a cushion supports the city, while running short slows services with an explanation and a chance to improve next week.

The city wallet is separate from the original lessons' simulated dollars and Arcade coins. Original completed lessons migrate without being erased or paying duplicate rewards. Replay preserves bread and reflections. Rebuilding the map requires confirmation and preserves your finances and lesson progress. Profile → Export career save downloads a complete backup. No external student data collection was added.

Editable curriculum, source provenance, accounting, architecture and art notes are in [career/README.md](career/README.md). All 32 original lesson sources and vocabulary lists were found; none require substitute content.

## Browser validation

The existing Playwright harness expects Playwright available to Node and system Chromium. For example, with Playwright installed outside this repository:

```sh
NODE_PATH=/tmp/money-ops-validation/node_modules npm run test:browser
NODE_PATH=/tmp/money-ops-validation/node_modules npm run test:city-browser
node scripts/validate-browser.mjs tests/homepage-city-browser.cjs
```

Both scripts start an isolated local static server automatically, exercise the real browser interface, then close the server. Override `CHROMIUM_PATH` if Chromium is installed elsewhere. The suites cover the original 32 lessons, Arcade, actual Career work/allocation/build/reflection/save flow, mobile, keyboard interaction, reduced motion, missing-art fallback, and both static entry points.

## Campaign

Missions 1–4 use illustrated drag, tap, and keyboard activities for creating value, building income streams, paying yourself first, and budgeting. Missions 5–32 share a reusable, data-driven mission system:

1. Mission briefing and recurring character conversation
2. Financial decision
3. Visible consequence and financial state update
4. Unexpected event or challenge
5. Second decision
6. Explanation, XP, medal, and debrief

The final mission reports income, savings, investments, business value, property and assets, debt, credit, taxes, giving, achievements, final net worth, and Financial Freedom rank. Completed missions can be replayed from their original snapshots without farming campaign money or XP.

All companies, markets, returns, life events, properties, and prices are fictional simulations. Investment results are never presented as guaranteed.

The Financial Runner clears each level when the student collects 100 rewards. It starts at an approachable pace and rises through five speed stages, one every 20 rewards. Larger labeled hazards make each obstacle readable. A separate live vocabulary stream reinforces the canonical terms for the current lesson without covering the playfield, and the results screen reviews every vocabulary word with a short definition. All 32 lesson configurations use their own curriculum vocabulary. Money Boxes release separate bonus game dollars during post-lesson runs; students can place those dollars in saved, invested, or budgeted buckets, or buy Jump Boots, a Coin Magnet, and Penny the original Money Dragon companion. These game dollars never change the financial simulation's net worth.

All six students have dedicated right-facing runner artwork. Their eyes, faces, bodies, and running poses point toward incoming obstacles while their original front-facing portraits remain in lessons and selection screens.

Lesson characters serve as static guides in contained header frames. Students perform the activities themselves through tracing, choosing, circling, crossing out, tapping, and drag-and-drop interactions. When debts exceed assets, the interface labels the amount “Debt above assets” and explains it instead of showing an unexplained negative net-worth number.

## Architecture

- `src/content.js` and `src/missions-*.js`: 32-week curriculum and data-driven mission schemas
- `src/characters.js`: recurring cast and original vector portraits
- `src/engine.js`: mission flow, progression, events, replay, XP, badges, and medals
- `src/finance.js`: financial state, effects, and net-worth accounting
- `src/simulators.js`: interest, budget, tax, debt, portfolio, business, inflation, and property calculations
- `src/persistence.js`: versioned local save and migration
- `src/play.js`: illustrated activities, shared mission renderer, visual simulators, and campaign route
- `src/runner-config.js`: distinct hazards, rewards, environments, and power-ups for all 32 lessons
- `src/runner.js`: Canvas physics, rendering, controls, collisions, 20-coin goal, scoring, and animation states
- `src/runner-state.js`: saved pre-run, lesson, bonus-run, comparison, and arcade progression
- `src/app.js`: navigation, HUD, accessibility, settings, and interaction controller
- `src/audio.js`: original synthesized music and sound effects with mute and volume controls
- `src/teacher.js`: modular student, mission, classroom, JSON, and CSV summary adapters
- `tests/`: full campaign, accounting, persistence, calculations, activities, classroom export, and browser regression
- `RUNNER_ASSETS.md`: current original artwork coverage and procedural placeholder inventory

Week 1 follows the supplied **Earning & Creating Value** terminology, including **Your Time, Your Skills, Your Ideas** and **You provide value → someone provides money**. Week 10 preserves the supplied **50/30/20 Rule**, **SMART** goal terminology, and Proverbs 21:5 principle. Unsupplied poster text is not represented as a verbatim poster quotation.
