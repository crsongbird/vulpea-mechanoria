# Changelog

Newest first. Each release is named from Sol outward (docs/releases.md).

## Sol (2026-10-26)

- **First light.** The seed's ringworld land is laid round you: continents and seas, coasts, plateaus, cliffs, rivers,
  and ten biomes from ice to jungle, coloured by where they meet. You can walk it with WASD or the arrows and the mouse
  (Shift runs), a gamepad's sticks, or a finger.
- It draws with WebGPU where the browser has it, and WebGL2 where not.

### Under the hood
- Carried over from PoetryPress: the land, regions, wildlife and happenings generators (`src/world/`), engine-free
  and pure functions of the seed, with the research behind them in `docs/prior-art/from-poetrypress/` and the idea book.
- Babylon.js 9.29 with Vite. The land is drawn in 256 m chunks of three detail levels round the player, joined by
  skirts.
- Tests for the world: deterministic, seamless round the ring, biome weights whole, you start on land.
