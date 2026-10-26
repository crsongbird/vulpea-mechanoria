// THE WORLD IN METRES: the ring's land (land.js, worked in ring units: the ring's radius 1) seen in metres, as the game
// works. x runs along the ring (it comes round after `circumference` metres), z across the band (−width/2 to width/2),
// y up. A pure function of the seed: the same place always has the same land, however it is asked for.
import { lkLand } from './land.js';

export function makeWorld(seed, o = {}){
  const W = 1, L = lkLand(seed, { W, Hw: (o.wallsM ?? 1200)*W*0.00025, forms: o.forms ?? 0.5, z0: 0, blend: 0.5 }), M = L.M;
  return {
    seed, M, circumference: 2*Math.PI/M, width: W/M, sea: 0, snowline: L.snowline/M,
    /** The ground's height at (x, z), metres; fine: the smallest feature wanted, metres. */
    height: (x, z, fine = 4) => L.height(x*M, z*M, fine*M)/M,
    /** The biomes' weights at (x, z) of height h (land.js LK_BIOMES order, summing to 1). */
    biomes: (x, z, h) => L.biomes(x*M, z*M, h*M),
    /** [warmth, moisture], 0..1 each. */
    climate: (x, z, h) => L.climate(x*M, z*M, h*M) };
}
