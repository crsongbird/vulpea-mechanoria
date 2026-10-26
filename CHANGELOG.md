# Changelog

Newest first. Each release is named from Sol outward (docs/releases.md).

## Venus (2026-10-26)

- **A wider ring.** The band is now 20 km across, on a ring some 350 km in radius (2,200 km round). The rim walls stand
  3 km tall, a far haze on either side; the mountains are taller too, and stay under the walls.
- **Air instead of fog.** Distant land fades into a pale blue haze that stops thickening, so the arch overhead stays in
  sight however far off it is.
- **A middle distance.** The land from a few kilometres out to about 50 km is drawn at 250 m detail, and rebuilt as you
  walk on. The rest of the ring is coarser.
- **Stepped land only here and there.** The shelves and terraces now come in about one region in five, not everywhere.
- **Snow where it belongs.** The snowline rises with the taller mountains: about 1.2 km on this seed.
- **No seams of light between chunks.** Each point's shading now comes from the heights around it, the same from either
  side of a join.

### Under the hood
- `src/haze.js`: a material plugin, in GLSL and WGSL, that mixes toward the haze before the engine's fog step. Scene fog
  is off.
- `src/farRing.js`: 64 coarse segments, a finer middle distance over the three about the player (the coarse ones there
  hidden), and both walls in their own meshes.
- `src/world/land.js` takes the band's width in metres (`bandM`); the walls' spill mountains and the lapse rate follow
  it.
- The design draft now holds Ruby's answers: one canon ring with seeds for its state; a rare human with a fox
  companion, its spells and the switch to play as the fox; dying and waking at a shrine; many builds, as in Hades;
  Nausicaä among the inspirations; a ring that wobbles for day and night, its outer face solar panels, reactors and
  besieged spacedocks.
- `docs/other-worlds.md`: Mars, Titan, Enceladus, a gas-giant platform, Venus and alien worlds, and how gates reach them.
- A test that the band is 20 km wide and no land stands above the walls.

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
