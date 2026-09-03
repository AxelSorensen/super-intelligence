# 🤖 Superintelligence

A choose-your-own-adventure text game about AI safety, built as a branching story with a survey attached.

![Superintelligence screenshot](docs/screenshot.png)

## Features

- 💬 **Branching narrative** — story nodes and choices driven by a `nodes.json` graph, walked one node at a time
- 🖊️ **Terminal-style typing effect** — text types itself out character by character in a monospace, green-on-black terminal look
- 💾 **Resume support** — progress is checkpointed via cookies so a player can leave and resume where they stopped
- 📝 **Built-in survey** — an end-of-game survey (`Survey.vue`) with results view (`SurveyResults.vue`)
- ✏️ **Node editor** — a separate `/editor` page for building/editing the story graph without hand-writing JSON

## Installation

```bash
git clone <this repo>
cd super-intelligence
npm install
```

## Usage

```bash
npm run dev
```

Then open the local Nuxt dev server URL printed in the terminal. `/` is the game, `/editor` is the story-graph editor.

## Built with

- [Nuxt 3](https://nuxt.com/) / Vue 3
- Tailwind CSS
- Firebase (`nuxt-vuefire`)
- Matter.js (physics, via `matter-js`/`poly-decomp`)

## Status

✅ Runs cleanly — `npm install && npm run dev` verified working (HTTP 200 on localhost:3000) as of 2026-09-03. Personal/experimental project — the story data lives in checked-in JSON files (including stray copies like `nodes_1 copy.json`), suggesting the editor and content are still being iterated on rather than finalized.
