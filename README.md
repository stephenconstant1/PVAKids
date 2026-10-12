# Financial Freedom: Money Ops

Money Ops is a complete, static 32-mission financial education campaign for grades 6–8. One persistent financial profile carries the player's cash, savings, investments, assets, income, expenses, credit, debt, giving, XP, rank, achievements, and mission medals from Week 1 through the finale.

## Run

From this directory:

```sh
npm start
```

Open `http://127.0.0.1:8080`. There is no application install, backend, account, or build step. Progress is stored in local storage on the current browser origin.

Run the complete state and calculation suite with `npm test`.

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
- `src/app.js`: navigation, HUD, accessibility, settings, and interaction controller
- `src/audio.js`: original synthesized music and sound effects with mute and volume controls
- `src/teacher.js`: modular student, mission, classroom, JSON, and CSV summary adapters
- `tests/`: full campaign, accounting, persistence, calculations, activities, classroom export, and browser regression

Week 1 follows the supplied **Earning & Creating Value** terminology, including **Your Time, Your Skills, Your Ideas** and **You provide value → someone provides money**. Week 10 preserves the supplied **50/30/20 Rule**, **SMART** goal terminology, and Proverbs 21:5 principle. Unsupplied poster text is not represented as a verbatim poster quotation.
