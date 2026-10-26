# AGENTS.md — Vulpéa Mechanória

How to work on this game. Keep this file short; the long reference lives in `docs/`.

## What it is

An open-world walking and survival game on a ringworld, "land of the mechanical foxes", made by **Ruby**, its owner.
It runs in a web browser (and later as an APK) on phones, keyboards and controllers. The design is in
`docs/design.md`; read it before adding a feature.

- **Engine: Babylon.js** (`@babylonjs/core`, `@babylonjs/gui`, Havok physics). Use what the engine already does before
  writing your own: terrain LOD, instancing, shadows, post-processing, input, physics, the scene optimizer.
  `docs/engine/babylon.md` maps each need to Babylon's documentation. Read the linked page before building.
- **Build: Vite.** Plain ES modules, no framework.

## Commands

```sh
npm install          # once
npm run dev          # the game at a local address, reloading as you edit
npm run build        # the static game in dist/ (relative paths: any static host, or an APK's web view)
npm test             # the world's tests (node --test)
node tools/shot.mjs out.png [?query] [waitMs]   # dist/ in headless Chromium on a software GPU: a screenshot and any page errors
```

URL options: `?seed=N` picks the world; `?gl` forces WebGL2 instead of WebGPU; `?q=low|mid|high` sets the render
scale.

## The map

| Path | What |
|---|---|
| `src/main.js` | boot: opens WebGPU, falling back to WebGL2; scene, sky, lights, the walker's camera |
| `src/terrain.js` | the land's chunks round the player, finer near, coarser far, joined by skirts |
| `src/palette.js` | every colour of the land in one place (placeholder until the art pass) |
| `src/release.js` | the release's name (`docs/releases.md`: from Sol outward) |
| `src/world/` | the world as pure functions of the seed. These are engine-free: no Babylon import |
| `src/world/world.js` | the world in metres: `height`, `biomes`, `climate` |
| `src/world/land.js` | heights, seas, climates and biomes of a ring (carried over from PoetryPress) |
| `src/world/regions.js` · `seedWords.js` | regions, factions, banners and names; the seed word banks |
| `src/world/wild.js` · `happenings.js` | where every creature and every happening (fights, hunts, marches) is at any time |
| `test/` | `node --test` suites |
| `tools/` | headless checks |
| `docs/` | design, engine notes, prior art, releases, the idea book |

## Rules

1. **The world is a pure function of the seed and the place** (and the clock, for what moves). The same place gives the
   same answer however it is asked for, so nothing pops or jumps. Never store what can be computed.
2. **`src/world/` never imports the engine.** It must run in Node for the tests and in a worker.
3. **Metres, seconds, radians.** x runs along the ring and comes round after the circumference; z runs across the
   band; y is up.
4. **Phones first.** Every feature has a low setting. Measure on a phone-sized budget: draw calls, triangles, texture
   memory.
5. **Research before building.** Look up how games and engines do it, and write what you learn into `docs/prior-art/`
   with links. Tag each claim `[src](URL)` or `[est]`.
6. **Look at what you made.** Render it (`tools/shot.mjs`) and judge it by eye. Tests passing is not the same as looking
   right. This sandbox has no real GPU: use the software GPU to check it draws, never to judge speed.
7. **Ruby decides the design.** When a choice changes how the game plays or looks, ask. Address Ruby indirectly
   ("Ruby", "it").

## Shipping a release

1. `npm test` passes, `npm run build` succeeds, and `tools/shot.mjs` shows the game drawing with no page errors.
2. Advance `src/release.js` to the next name (`docs/releases.md`).
3. Add the release at the top of `CHANGELOG.md`: what a player would notice, then `### Under the hood`.
4. Commit with the changelog section as the message and push `main`.
