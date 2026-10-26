# Changelog

Newest first. Each release is named from Sol outward (docs/releases.md).

## Mercury (2026-10-26)

- **The ring curves.** The land rises ahead and behind you and sweeps up into an arch across the sky; halfway round, the
  far side of the ring hangs straight overhead. Both rim walls stand along the band's edges, 1.2 km tall, all the way
  round.
- **The whole band is drawn near you**, wall to wall, so you can see the land at your feet run to both walls.
- **Seas and lakes curve with the land,** shallow water paler and deep water darker.
- New start options: `?x=` metres round the ring and `?pitch=` degrees to look up.

### Under the hood
- `src/ring.js`: a floating origin. The player stays at the scene's origin; every mesh is built about its own place on
  the floor and turned about the ring's centre each frame. Tests check that a point lands where the ring puts it from
  any chunk, that the floor rises as d²/2R, and that the far side is a diameter up.
- `src/farRing.js`: the whole ring as one coarse mesh with both walls, lit from overhead and hazed once when built, drawn
  without fog, a few metres under the near land.
- Chunks are a whole number round the ring (about 256 m each), cover the band's full width, and reach 12 chunks ahead
  and behind with five detail levels. Slopes come from the height grid itself.
- Logarithmic depth on every material, so land at your feet and the arch 141 km up share one depth buffer.
- Docs: the design draft (`docs/design.md`), other worlds (`docs/other-worlds.md`), the Babylon.js engine reference
  (`docs/engine/babylon.md`) and four prior-art studies: Risk of Rain 2's art, Breath of the Wild's open air, Arena and
  survival games, and foxes, machines and shrines. More reference came from PoetryPress: its scene ideas, space scenes
  and renderer notes.

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
