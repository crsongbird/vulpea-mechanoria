// THE WORLD IN METRES: the ring's land (land.js, worked in ring units: the ring's radius 1) seen in metres, as the game
// works. x runs along the ring (it comes round after `circumference` metres), z across the band (−width/2 to width/2),
// y up from the floor. A pure function of the seed: the same place always has the same land, however it is asked for.
//
// The ring's proportions are PoetryPress's Ringworld at its default Band Width (45): a band 4 km wide on a ring some
// 70 km in radius (444 km round), its rim walls 1.2 km tall. docs/design.md weighs the scale.
import { lkLand } from './land.js';

export const RING_W = 0.012 + 0.22*0.45*0.45;   // (the band's width in ring units, as PoetryPress's ringParams has it)

export function makeWorld(seed, o = {}){
  const W = o.W ?? RING_W, M = W*0.00025, wallsM = o.wallsM ?? 1200;
  const L = lkLand(seed, { W, Hw: wallsM*M, forms: o.forms ?? 0.5, z0: 0, blend: 0.5 });
  return {
    seed, M, radius: 1/M, circumference: 2*Math.PI/M, width: W/M, wallsM, sea: 0, snowline: L.snowline/M,
    /** The ground's height at (x, z), metres; fine: the smallest feature wanted, metres. */
    height: (x, z, fine = 4) => L.height(x*M, z*M, fine*M)/M,
    /** The biomes' weights at (x, z) of height h (land.js LK_BIOMES order, summing to 1). */
    biomes: (x, z, h) => L.biomes(x*M, z*M, h*M),
    /** [warmth, moisture], 0..1 each. */
    climate: (x, z, h) => L.climate(x*M, z*M, h*M) };
}
