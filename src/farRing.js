// THE FAR RING: the whole ring, coarse, as one mesh — the floor rising ahead and behind into the arch overhead, its
// seas and lands in their colours, and the rim walls along both edges, 1.2 km tall. Near the player the chunks
// (terrain.js) draw the land finely; the far ring lies a few metres under them there, so it shows only past their
// ends. It is lit as the ring's floor is lit, from straight overhead, so its colours are baked in once, with the haze
// of the air between (a placeholder for proper aerial perspective: docs/design.md).
import { Mesh, VertexData, StandardMaterial, Color3 } from '@babylonjs/core';
import { bendAt, place } from './ring.js';
import { landColour } from './terrain.js';
import { SKY, WALL, WALL_TOP } from './palette.js';

const SINK = 8;   // metres the far ring lies under the true land, so the chunks cover it where both are

export function makeFarRing(scene, world, o = {}){
  const R = world.radius, C = world.circumference, W = world.width, along = o.along ?? 1024, across = o.across ?? 16, haze = o.haze ?? 0.3;
  const pos = [], col = [], idx = [], dx = C/along, dz = W/across, N = across + 1;
  const hazed = c => c.map((v, k) => v + (SKY[k] - v)*haze);
  // (the floor: a grid round the whole ring, heights at the grid's own coarseness, lit by its slope as from overhead)
  const H = (x, z) => world.height(x, z, dx);
  for(let i = 0; i < along; i++) for(let j = 0; j < N; j++){
    const x = i*dx, z = -W/2 + j*dz, h = H(x, z);
    const gx = (H(x + dx/2, z) - H(x - dx/2, z))/dx, gz = (H(x, Math.min(W/2, z + dz/2)) - H(x, Math.max(-W/2, z - dz/2)))/dz;
    const lit = 0.72 + 0.28/Math.sqrt(1 + gx*gx + gz*gz) - 0.12*Math.max(-1, Math.min(1, gx*0.6 - gz*0.5));
    const c = landColour(world, x, z, h, Math.min(1, Math.hypot(gx, gz)));
    pos.push(...bendAt(R, x, Math.max(h, world.sea) - SINK, z)); col.push(...hazed(c.map(v => v*lit)), 1); }
  for(let i = 0; i < along; i++){ const i1 = (i + 1) % along;
    for(let j = 0; j < across; j++){ const a = i*N + j, b = i1*N + j; idx.push(a, b, a + 1, b, b + 1, a + 1); } }
  // (the rim walls: up from the floor's edge to their height and a lip on top, inner faces lit as the floor, a little
  //  darker; both walls, all the way round)
  const wall = (z, side) => { const base = pos.length/3;
    for(let i = 0; i < along; i++){ const x = i*dx;
      for(const [h, cc] of [[world.sea - SINK, WALL], [world.wallsM, WALL], [world.wallsM, WALL_TOP], [world.wallsM + 4, WALL_TOP]]){
        const zz = cc === WALL_TOP && h > world.wallsM ? z + side*40 : z; pos.push(...bendAt(R, x, h, zz)); col.push(...hazed(cc), 1); } }
    for(let i = 0; i < along; i++){ const i1 = (i + 1) % along;
      for(const r of [0, 2]){ const a = base + i*4 + r, b = base + i1*4 + r;
        if(side < 0) idx.push(a, b, a + 1, b, b + 1, a + 1); else idx.push(a, a + 1, b, b, a + 1, b + 1); } } };
  wall(-W/2, -1); wall(W/2, 1);
  const mesh = new Mesh('far ring', scene), vd = new VertexData(), mat = new StandardMaterial('far ring', scene);
  vd.positions = pos; vd.indices = idx; vd.colors = col; vd.applyToMesh(mesh);
  mat.disableLighting = true; mat.emissiveColor = new Color3(1, 1, 1); mat.diffuseColor = new Color3(0, 0, 0); mat.useVertexColor = true;
  mat.fogEnabled = false; mat.useLogarithmicDepth = true; mat.backFaceCulling = false;
  mesh.material = mat; mesh.isPickable = false; mesh.alwaysSelectAsActiveMesh = true;
  return { mesh, update(xp){ place(mesh, R, C, 0, xp); } };
}
