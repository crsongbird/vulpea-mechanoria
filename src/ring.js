// THE RING'S CURVE IN THE SCENE. The game keeps the player at the scene's origin and turns the world under them (a
// floating origin), so the numbers near the eye stay small however far round the ring the player walks:
//
// - A place on the floor is (x, z) in ring metres: x along the ring (0 to the circumference, then round again), z across.
// - The scene's y is up where the player stands, toward the ring's centre, which hangs a radius overhead at (0, R, 0).
// - Each mesh is built in its own frame, about a point of the floor (xc): a vertex at (x, h, z) sits at
//   `bendAt(x - xc, h, z)`, so the mesh's own numbers stay small too.
// - Each frame the mesh is turned about the ring's centre by how far round the ring it is from the player (`place`).
//
// The floor rises ahead and behind, about 90 m over 5 km, and arches overhead to meet itself 141 km up.
// Engine-free: these are numbers only, so the tests can check them.

/** A vertex of a mesh built about the floor point xc: dx = x − xc metres along, h up off the floor, z across. */
export function bendAt(R, dx, h, z){
  const t = dx/R, r = R - h;
  return [r*Math.sin(t), R - r*Math.cos(t), z];
}

/** The shortest way round from a to b, metres (−C/2 … C/2). */
export function roundDiff(a, b, C){
  let d = (b - a) % C; if(d > C/2) d -= C; else if(d < -C/2) d += C; return d;
}

/** Where a mesh built about xc stands for a player at xp: its position and its turn about the scene's z axis. */
export function placeOf(R, C, xc, xp){
  const phi = roundDiff(xp, xc, C)/R;
  return { x: R*Math.sin(phi), y: R - R*Math.cos(phi), turn: phi };
}

/** Put a Babylon mesh (or TransformNode) where placeOf says. */
export function place(mesh, R, C, xc, xp){
  const p = placeOf(R, C, xc, xp);
  mesh.position.set(p.x, p.y, 0); mesh.rotation.z = p.turn;
}
