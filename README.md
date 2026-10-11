# MONEY OPS v0.2 — Playable vertical slice

A local, no-backend pilot with picture-based controls aimed at ages 4–5 and elementary students. The full weekly curriculum is deferred until the pilot is approved and the user supplies the lesson list. Original vector city artwork and synthesized optional audio; no external APIs, fonts, or runtime dependencies.

## Run

From `PVAKids/money-ops`:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Open the served `index.html` in your browser. ES modules require HTTP rather than opening a file directly. Run engine checks with `npm test` (Node 20+). There is no app install or build step.

Optional browser regression test (server must be running): install Playwright in an external directory with `npm install --prefix /tmp/money-ops-validation --cache /tmp/money-ops-npm-cache playwright`, then run `NODE_PATH=/tmp/money-ops-validation/node_modules node tests/browser.cjs`. It uses system Chromium at `/usr/bin/chromium`; set `CHROMIUM_PATH` if needed. Test dependencies do not enter the app. Screenshots are written to `/tmp`.

## Play

Enter a name and choose a symbol. Mission 1 offers three illustrated jobs: drag leaves into a basket, match pictures for a friend, or drag a brush onto three canvases. Three completed actions earn money. The reward shows pay minus supplies equals earnings. No math question or reading screen blocks play.

Mission 2 uses the existing pretend grown-up paycheck scenario. Drag up to three $250 tokens into a saving jar. Home/food cost $1,750, and the remaining money goes to fun purchases. A $600 repair shows how saved money helps avoid borrowing. Children can drag with mouse/touch, or tap an object and then tap its home; the same buttons work with a keyboard. A read-to-me control uses browser speech if available. Long explanations are collapsed under “Why?”.

The colorful two-stop world is the default home. Detailed finances, profile tools, and mission history remain behind the grown-up menu. The three savings tokens represent simulated amounts rather than real coins of that value.

Both missions autosave at every step, including an unfinished decision or debrief. Returning to the command center preserves the current mission; deploy it again to resume. Finish the current mission before deploying another. Completed missions can be replayed in practice with their original starting balances. Practice outcomes appear in history but do not duplicate campaign money or XP. One random event becomes available after both missions. Net worth = cash + savings + investments + assets − debt.

The visible map contains only the pilot operations. Old curriculum topics remain in the content module but are not presented as an approved weekly plan. The two playable training operations cover earning and emergency savings; they do not claim to implement the entire 32-mission sequence. Monthly income/expenses and credit are simulated; credit starts at 650 and is unchanged in this slice. Higher ranks are defined for later content.

Local storage contains one active profile per browser origin. Export a JSON backup from Profile & save. Import, multi-profile management, teacher mode, backend, authentication, and detailed credit mechanics are not implemented. If storage is unavailable, a warning explains that progress cannot survive closing the tab.

## Architecture

- `src/content.js`: mission definitions, 32-topic roadmap, event and badge catalog.
- `src/engine.js`: pure mission transitions, finance calculations, XP/ranks, replay snapshots, event resolution.
- `src/persistence.js`: versioned local storage and visible error handling.
- `src/app.js`: accessible responsive UI and interaction controller.
- `src/play.js`: illustrated pilot activities, short prompts, savings jar, and two-stop world.
- `src/drag.js`: mouse/touch pointer dragging with tap alternatives.
- `ENGAGEMENT.md`: user-approved scope boundary and future-level interaction standard.
- `src/audio.js`: optional original synthesized effects; muted by default.
- `src/simulators.js`: future investing/compound-growth and business-profit adapters, covered by engine tests but not presented as playable missions.
- `city.svg`, `style.css`: original visual presentation.
- `tests/engine.test.js`: deterministic accounting and progression checks.

New playable missions require content plus appropriate engine transitions and UI handlers. Current renderers support earning and savings flows, not arbitrary new mission mechanics. Future teacher mode can use profile IDs around the isolated state/transition functions.

## After pilot review

Obtain the complete lesson list after the user approves this pilot, then design distinct playable mechanics for each week. Add income streams and flexible spending choices; make optional events interactive; expose investing and business simulations through new missions; add profile import and multiple students; broaden save migrations and classroom reporting. Expand browser regression coverage and accessibility checks with students.

The original repository learning journey remains untouched at `../PVM_Kids_Interactive_Journey_2.html`. The uploaded v0.1 prototype informed the savings scenario and mission loop; its simple styling and global state were replaced.
