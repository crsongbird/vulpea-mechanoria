// THE LAND AS MESHES: chunks of the world's land (world/world.js) laid round the player, finer near and coarser far,
// each a grid of heights coloured by biome, and bent to the ring's curve (ring.js). A chunk is built once for its place
// and detail and kept; the set changes as the player crosses chunk lines, and every chunk is turned into place each
// frame as the player walks. Past them, the far ring (farRing.js) draws the rest, a little lower, so they cover it. Skirts hang from every chunk's edge so the joins between details never open.
// The sea is the land's own surface where the floor lies under it, so it curves with the ring as the land does.
import { Mesh, VertexData, StandardMaterial, Color3 } from '@babylonjs/core';
import { LK_BIOMES } from './world/land.js';
import { BIOME_COLOURS, SAND, ROCK, SNOW, WATER, DEEP } from './palette.js';
import { bendAt, place } from './ring.js';
import { hazed } from './haze.js';

const LODS = [[1, 64], [2, 32], [4, 16], [8, 8], [Infinity, 4]];   // [chunks out from the player's chunk, quads a side]
export const ALONG = 12;                                           // chunks drawn round the player each way (about 3 km)

/** The colour of the land at (x, z), height h: its biomes' colours blended, rock on steep ground, snow up high, sand at
 *  the shore, and under the sea the water, darker as it deepens. slope: rise over run, 0 flat, 1 at 45°. */
export function landColour(world, x, z, h, slope){
  if(h < world.sea){ const d = Math.min(1, (world.sea - h)/30); return WATER.map((c, k) => c + (DEEP[k] - c)*d); }
  if(h < world.sea + 1.5) return SAND.slice();
  const w = world.biomes(x, z, h), c = [0, 0, 0];
  for(let i = 0; i < LK_BIOMES.length; i++){ const b = BIOME_COLOURS[LK_BIOMES[i].name]; c[0] += b[0]*w[i]; c[1] += b[1]*w[i]; c[2] += b[2]*w[i]; }
  const rock = Math.max(0, Math.min(1, (slope - 0.45)/0.4)), snow = Math.max(0, Math.min(1, (h - world.snowline)/40));
  for(let k = 0; k < 3; k++){ c[k] += (ROCK[k] - c[k])*rock; c[k] += (SNOW[k] - c[k])*snow; }
  return c;
}

export function makeTerrain(scene, world){
  const R = world.radius, C = world.circumference, NC = Math.round(C/256), CH = C/NC;   // (a whole number of chunks round)
  const zRows = [Math.floor(-world.width/2/CH), Math.ceil(world.width/2/CH) - 1];
  const mat = new StandardMaterial('land', scene);
  mat.specularColor = new Color3(0, 0, 0); mat.useVertexColor = true; mat.useLogarithmicDepth = true; hazed(mat);
  const kept = new Map();
  const build = (cx, cz, n) => {
    const x0 = cx*CH, z0 = cz*CH, xc = x0 + CH/2, step = CH/n, N = n + 1, pos = [], col = [], idx = [], nrm = [];
    // (the heights first, one more all round, so each vertex's slope comes from its neighbours)
    const M = N + 2, H = new Float64Array(M*M), zAt = j => Math.max(-world.width/2, Math.min(world.width/2, z0 + j*step));
    for(let j = -1; j <= N; j++) for(let i = -1; i <= N; i++) H[(j + 1)*M + i + 1] = world.height(x0 + i*step, zAt(j), step);
    for(let j = 0; j < N; j++) for(let i = 0; i < N; i++){
      const x = x0 + i*step, z = zAt(j), k = (j + 1)*M + i + 1, h = H[k];
      const wet = h < world.sea, gx = wet ? 0 : (Math.max(H[k + 1], world.sea) - Math.max(H[k - 1], world.sea))/(2*step), gz = wet ? 0 : (Math.max(H[k + M], world.sea) - Math.max(H[k - M], world.sea))/(2*step);
      const slope = Math.min(1, (Math.abs(H[k + 1] - H[k - 1]) + Math.abs(H[k + M] - H[k - M]))/(2*step));
      pos.push(...bendAt(R, x - xc, Math.max(h, world.sea), z)); const c = landColour(world, x, z, h, slope); col.push(c[0], c[1], c[2], 1);
      // (its normal from the heights about it, the same from either chunk at a join, turned with the ring's curve)
      const t = (x - xc)/R, nl = Math.hypot(gx, 1, gz), nx = -gx/nl, ny = 1/nl; nrm.push(nx*Math.cos(t) - ny*Math.sin(t), nx*Math.sin(t) + ny*Math.cos(t), -gz/nl); }
    for(let j = 0; j < n; j++) for(let i = 0; i < n; i++){ const a = j*N + i; idx.push(a, a + 1, a + N, a + 1, a + N + 1, a + N); }   // (wound for Babylon's left-handed front faces)
    // (the skirt: each edge's vertices copied, with their normals, and copied again a
    //  little way down, joined both sides, so the joins between details never open and never shade)
    const drop = step*2, edge = list => { for(let k = 0; k + 1 < list.length; k++){ const a = list[k], b = list[k + 1], base = pos.length/3;
      for(const [v, d] of [[a, 0], [b, 0], [a, drop], [b, drop]]){ pos.push(pos[v*3], pos[v*3 + 1] - d, pos[v*3 + 2]); col.push(col[v*4], col[v*4 + 1], col[v*4 + 2], 1); nrm.push(nrm[v*3], nrm[v*3 + 1], nrm[v*3 + 2]); }
      idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2, base, base + 2, base + 1, base + 1, base + 2, base + 3); } };
    const S = [...Array(N).keys()]; edge(S.map(i => i)); edge(S.map(i => n*N + i)); edge(S.map(j => j*N)); edge(S.map(j => j*N + n));
    const mesh = new Mesh(`land ${cx},${cz},${n}`, scene), vd = new VertexData();
    vd.positions = pos; vd.indices = idx; vd.colors = col; vd.normals = nrm; vd.applyToMesh(mesh);
    mesh.material = mat; mesh.isPickable = false; mesh.xc = xc; return mesh; };
  let at = null;
  return {
    chunk: CH,
    /** Lay the chunks round the player at (xp, zp) and turn them into place. */
    update(xp, zp){
      const cx = Math.floor(xp/CH), cz = Math.max(zRows[0], Math.min(zRows[1], Math.floor(zp/CH))), key0 = cx + ',' + cz;
      if(key0 !== at){ at = key0; const want = new Set();
        for(let dz = Math.max(zRows[0], cz - ALONG); dz <= Math.min(zRows[1], cz + ALONG); dz++) for(let dx = -ALONG; dx <= ALONG; dx++){
          const r = Math.max(Math.abs(dx), Math.abs(dz - cz)), n = LODS.find(([k]) => r <= k)[1], kx = ((cx + dx) % NC + NC) % NC, key = `${kx},${dz},${n}`;
          want.add(key); if(!kept.has(key)) kept.set(key, build(kx, dz, n)); }
        for(const [k, m] of kept) if(!want.has(k)){ m.dispose(); kept.delete(k); } }
      for(const m of kept.values()) place(m, R, C, m.xc, xp); },
    count: () => kept.size };
}
