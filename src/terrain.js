// THE LAND AS MESHES: square chunks of the world's land (world/land.js) laid round the player, finer near and coarser
// far, each a grid of heights with colours by biome. A chunk is built once for its place and detail and kept; the set
// is updated as the player crosses chunk lines. Skirts hang from every chunk's edge so the joins between details never
// open. Works in metres: x along the ring, z across the band, y up.
import { Mesh, VertexData, StandardMaterial, Color3 } from '@babylonjs/core';
import { LK_BIOMES } from './world/land.js';
import { BIOME_COLOURS, SAND, ROCK, SNOW } from './palette.js';

export const CHUNK = 256;            // metres a side
const RINGS = [[1, 64], [2, 32], [4, 16]];   // [chunks out from the player's chunk, quads a side] — near to far

export function makeTerrain(scene, world){
  const mat = new StandardMaterial('land', scene);
  mat.specularColor = new Color3(0, 0, 0); mat.useVertexColor = true;   // (flat-lit, coloured by its vertices)
  const kept = new Map();
  const colourAt = (x, z, h) => {
    if(h < 1.5) return SAND;
    const w = world.biomes(x, z, h), c = [0, 0, 0];
    for(let i = 0; i < LK_BIOMES.length; i++){ const b = BIOME_COLOURS[LK_BIOMES[i].name]; c[0] += b[0]*w[i]; c[1] += b[1]*w[i]; c[2] += b[2]*w[i]; }
    const slope = Math.min(1, Math.abs(world.height(x + 4, z) - world.height(x - 4, z))/8 + Math.abs(world.height(x, z + 4) - world.height(x, z - 4))/8);
    const rock = Math.max(0, Math.min(1, (slope - 0.45)/0.4)), snow = Math.max(0, Math.min(1, (h - world.snowline)/40));
    for(let k = 0; k < 3; k++){ c[k] += (ROCK[k] - c[k])*rock; c[k] += (SNOW[k] - c[k])*snow; }
    return c; };
  const build = (cx, cz, n) => {
    const x0 = cx*CHUNK, z0 = cz*CHUNK, step = CHUNK/n, N = n + 1, pos = [], col = [], idx = [];
    for(let j = 0; j < N; j++) for(let i = 0; i < N; i++){ const x = x0 + i*step, z = z0 + j*step, h = world.height(x, z, step); pos.push(x, h, z); const c = colourAt(x, z, h); col.push(c[0], c[1], c[2], 1); }
    for(let j = 0; j < n; j++) for(let i = 0; i < n; i++){ const a = j*N + i; idx.push(a, a + 1, a + N, a + 1, a + N + 1, a + N); }   // (wound for Babylon's left-handed front faces)
    // (normals from the grid alone; then the skirt: each edge's vertices copied, with their normals, and copied again a
    //  little way down, joined both sides, so the joins between details never open and never shade)
    const nrm = []; VertexData.ComputeNormals(pos, idx, nrm);
    const drop = step*2, edge = list => { for(let k = 0; k + 1 < list.length; k++){ const a = list[k], b = list[k + 1], base = pos.length/3;
      for(const [v, d] of [[a, 0], [b, 0], [a, drop], [b, drop]]){ pos.push(pos[v*3], pos[v*3 + 1] - d, pos[v*3 + 2]); col.push(col[v*4], col[v*4 + 1], col[v*4 + 2], 1); nrm.push(nrm[v*3], nrm[v*3 + 1], nrm[v*3 + 2]); }
      idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2, base, base + 2, base + 1, base + 1, base + 2, base + 3); } };
    const S = [...Array(N).keys()]; edge(S.map(i => i)); edge(S.map(i => n*N + i)); edge(S.map(j => j*N)); edge(S.map(j => j*N + n));
    const mesh = new Mesh(`land ${cx},${cz},${n}`, scene), vd = new VertexData();
    vd.positions = pos; vd.indices = idx; vd.colors = col; vd.normals = nrm; vd.applyToMesh(mesh);
    mesh.material = mat; mesh.isPickable = false; mesh.freezeWorldMatrix(); return mesh; };
  let at = null;
  return { update(px, pz){
    const cx = Math.floor(px/CHUNK), cz = Math.floor(pz/CHUNK), key0 = cx + ',' + cz; if(key0 === at) return; at = key0;
    const want = new Set(), R = RINGS[RINGS.length - 1][0];
    for(let dz = -R; dz <= R; dz++) for(let dx = -R; dx <= R; dx++){ const r = Math.max(Math.abs(dx), Math.abs(dz)), n = (RINGS.find(([k]) => r <= k) || RINGS[RINGS.length - 1])[1];
      const key = `${cx + dx},${cz + dz},${n}`; want.add(key); if(!kept.has(key)) kept.set(key, build(cx + dx, cz + dz, n)); }
    for(const [k, m] of kept) if(!want.has(k)){ m.dispose(); kept.delete(k); } } };
}
