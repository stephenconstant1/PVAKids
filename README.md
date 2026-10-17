# Financial Freedom: Money Ops

Money Ops is a complete, static 32-mission financial education campaign with an integrated Financial Runner. One persistent profile carries the player's lesson progress, financial simulation, runner participation, arcade coins, arcade XP, achievements, and selected character from Week 1 through the finale.

## Run

From this directory:

```sh
npm start
```

Open `http://127.0.0.1:8080`. There is no application install, backend, account, or build step. Career Mode progress is stored in local storage on the current browser origin.

Choose **Career Mode** for one saved hero and the connected 32-lesson financial journey. Choose **Arcade Mode** to play any runner level at any time with any of the six characters. Arcade Mode is temporary: its character choice, scores, coins, XP, and results are never written to the Career save file and disappear when Arcade Mode is closed.

Run the complete state and calculation suite with `npm test`.

Each new lesson opens with an optional pre-lesson runner lasting up to 1 minute 30 seconds at a slower, kid-friendly pace. Completing the lesson unlocks an optional bonus runner of up to three minutes. **START LESSON NOW** and **SKIP BONUS RUN** always keep the educational path available. Runner rewards earned inside the saved Career journey are stored separately from simulated net worth. Standalone Arcade Mode never saves its rewards.

During a run, use **Space** or **Up Arrow** to jump, **Down Arrow** to duck, and **P** or **Escape** to pause. Touch players can tap to jump or swipe down to duck. The on-screen controls include pause, restart, and an immediate lesson/continue action.

The optional Playwright regression requires Playwright outside this repository and a system Chromium:

```sh
NODE_PATH=/tmp/money-ops-validation/node_modules npm run test:browser
```

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

## Architecture

- `src/content.js` and `src/missions-*.js`: 32-week curriculum and data-driven mission schemas
- `src/characters.js`: recurring cast and original vector portraits
- `src/engine.js`: mission flow, progression, events, replay, XP, badges, and medals
- `src/finance.js`: financial state, effects, and net-worth accounting
- `src/simulators.js`: interest, budget, tax, debt, portfolio, business, inflation, and property calculations
- `src/persistence.js`: versioned local save and migration
- `src/play.js`: illustrated activities, shared mission renderer, visual simulators, and campaign route
- `src/runner-config.js`: distinct hazards, rewards, environments, and power-ups for all 32 lessons
- `src/runner.js`: Canvas physics, rendering, controls, collisions, timer, scoring, and animation states
- `src/runner-state.js`: saved pre-run, lesson, bonus-run, comparison, and arcade progression
- `src/app.js`: navigation, HUD, accessibility, settings, and interaction controller
- `src/audio.js`: original synthesized music and sound effects with mute and volume controls
- `src/teacher.js`: modular student, mission, classroom, JSON, and CSV summary adapters
- `tests/`: full campaign, accounting, persistence, calculations, activities, classroom export, and browser regression
- `RUNNER_ASSETS.md`: current original artwork coverage and procedural placeholder inventory

Week 1 follows the supplied **Earning & Creating Value** terminology, including **Your Time, Your Skills, Your Ideas** and **You provide value → someone provides money**. Week 10 preserves the supplied **50/30/20 Rule**, **SMART** goal terminology, and Proverbs 21:5 principle. Unsupplied poster text is not represented as a verbatim poster quotation.
