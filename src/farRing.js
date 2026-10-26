// THE FAR RING: everything past the chunks (terrain.js), in three parts.
// - The whole ring, coarse, cut into SEGS segments round it: the floor rising ahead and behind into the arch overhead.
// - The middle distance: the few segments about the player, rebuilt finer when the player walks into another
//   segment. The coarse segments there are hidden, so the two never overlap.
// - Both rim walls, all the way round.
// The floor parts lie a few metres under the true land, so the finer parts nearer cover them where both are. Their
// colours are lit from overhead once, when built; the air between is the haze's (haze.js).
import { Mesh, VertexData, StandardMaterial, Color3 } from '@babylonjs/core';
import { bendAt, place, roundDiff } from './ring.js';
import { landColour } from './terrain.js';
import { WALL, WALL_TOP } from './palette.js';
import { hazed } from './haze.js';

const SEGS = 64;   // segments round the ring

const unlit = (scene, name) => { const m = hazed(new StandardMaterial(name, scene));
  m.disableLighting = true; m.emissiveColor = new Color3(1, 1, 1); m.diffuseColor = new Color3(0, 0, 0); m.useVertexColor = true;
  m.useLogarithmicDepth = true; m.backFaceCulling = false; return m; };

/** A stretch of the floor from x0, `length` metres along, in `along` × `across` quads, `sink` metres under the land,
 *  built about its middle. */
function floorMesh(scene, world, mat, name, x0, length, along, across, sink){
  const R = world.radius, W = world.width, xc = x0 + length/2, dx = length/along, dz = W/across, N = across + 1, pos = [], col = [], idx = [];
  const H = (x, z) => world.height(x, z, dx);
  for(let i = 0; i <= along; i++) for(let j = 0; j < N; j++){
    const x = x0 + i*dx, z = -W/2 + j*dz, h = H(x, z);
    const gx = (H(x + dx/2, z) - H(x - dx/2, z))/dx, gz = (H(x, Math.min(W/2, z + dz/2)) - H(x, Math.max(-W/2, z - dz/2)))/dz;
    const lit = 0.72 + 0.28/Math.sqrt(1 + gx*gx + gz*gz) - 0.12*Math.max(-1, Math.min(1, gx*0.6 - gz*0.5));
    const c = landColour(world, x, z, h, Math.min(1, Math.hypot(gx, gz)));
    pos.push(...bendAt(R, x - xc, Math.max(h, world.sea) - sink, z)); col.push(c[0]*lit, c[1]*lit, c[2]*lit, 1); }
  for(let i = 0; i < along; i++) for(let j = 0; j < across; j++){ const a = i*N + j, b = a + N; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const mesh = new Mesh(name, scene), vd = new VertexData(); vd.positions = pos; vd.indices = idx; vd.colors = col; vd.applyToMesh(mesh);
  mesh.material = mat; mesh.isPickable = false; mesh.alwaysSelectAsActiveMesh = true; mesh.xc = xc; return mesh;
}

/** Both rim walls, all the way round, in SEGS meshes: up from the floor to their height, and a lip on top. */
function wallMeshes(scene, world, mat){
  const R = world.radius, C = world.circumference, W = world.width, L = C/SEGS, n = 16, out = [];
  for(let s = 0; s < SEGS; s++){ const x0 = s*L, xc = x0 + L/2, pos = [], col = [], idx = [];
    for(const side of [-1, 1]){ const base = pos.length/3;
      for(let i = 0; i <= n; i++){ const x = x0 + i*L/n;
        for(const [h, zz, c] of [[world.sea - 40, side*W/2, WALL], [world.wallsM, side*W/2, WALL], [world.wallsM, side*W/2, WALL_TOP], [world.wallsM + 10, side*(W/2 + 120), WALL_TOP]]){
          pos.push(...bendAt(R, x - xc, h, zz)); col.push(c[0], c[1], c[2], 1); } }
      for(let i = 0; i < n; i++) for(const r of [0, 2]){ const a = base + i*4 + r, b = a + 4; idx.push(a, b, a + 1, b, b + 1, a + 1); } }
    const mesh = new Mesh(`wall ${s}`, scene), vd = new VertexData(); vd.positions = pos; vd.indices = idx; vd.colors = col; vd.applyToMesh(mesh);
    mesh.material = mat; mesh.isPickable = false; mesh.xc = xc; out.push(mesh); }
  return out;
}

export function makeFarRing(scene, world, o = {}){
  const R = world.radius, C = world.circumference, L = C/SEGS, mat = unlit(scene, 'far ring'), wallMat = unlit(scene, 'walls');
  const far = [], walls = wallMeshes(scene, world, wallMat), midHalf = o.midHalf ?? 1;
  for(let s = 0; s < SEGS; s++) far.push(floorMesh(scene, world, mat, `far ${s}`, s*L, L, o.farAlong ?? 16, o.farAcross ?? 16, 40));
  let mid = null, midSeg = null;
  return {
    /** Turn it all into place for a player at xp, rebuilding the middle distance when they walk into another segment. */
    update(xp){
      const seg = Math.floor(xp/L) % SEGS;
      if(seg !== midSeg){ midSeg = seg; if(mid) mid.dispose();
        const x0 = (seg - midHalf)*L, len = (2*midHalf + 1)*L;
        mid = floorMesh(scene, world, mat, 'middle distance', x0, len, Math.round(len/250), o.midAcross ?? 80, 10);
        for(let s = 0; s < SEGS; s++) far[s].setEnabled(Math.abs(roundDiff(seg*L, s*L, C)) > midHalf*L + 1); }
      for(const m of far) if(m.isEnabled()) place(m, R, C, m.xc, xp);
      for(const m of walls) place(m, R, C, m.xc, xp);
      place(mid, R, C, mid.xc, xp); },
    segment: L };
}
