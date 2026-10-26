// The ring's curve: a mesh built about one place and turned into place for a player anywhere puts each point of the
// floor where the ring puts it, the floor rising ahead and behind, and the far side of the ring overhead.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bendAt, placeOf, roundDiff } from '../src/ring.js';

const R = 70734, C = 2*Math.PI*R;
// (a point of a mesh built about xc, turned into place for a player at xp, as Babylon does: rotate about z, then move)
const scene = (x, h, z, xc, xp) => { const v = bendAt(R, x - xc, h, z), p = placeOf(R, C, xc, xp), c = Math.cos(p.turn), s = Math.sin(p.turn);
  return [p.x + v[0]*c - v[1]*s, p.y + v[0]*s + v[1]*c, v[2]]; };

test('the floor under the player is at the origin, and up is up', () => {
  const p = scene(5000, 0, 12, 5000, 5000); assert.ok(Math.hypot(p[0], p[1]) < 1e-9 && p[2] === 12);
  const q = scene(5000, 10, 0, 5000, 5000); assert.ok(Math.abs(q[1] - 10) < 1e-9);
});

test('a point is where the ring puts it, whichever chunk it was built in', () => {
  for(const xc of [0, 4000, 4900, 300000]){ const p = scene(5000, 30, 0, xc, 4000), q = scene(5000, 30, 0, 5000, 4000);
    assert.ok(Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6, `built about ${xc}`); }
});

test('the floor rises ahead and behind, about d²/2R', () => {
  for(const d of [1000, 5000, -5000]){ const p = scene(d, 0, 0, d, 0); assert.ok(Math.abs(p[1] - d*d/(2*R)) < 0.5, `${d} m: ${p[1]}`); }
});

test('halfway round, the floor is overhead, a diameter up, and the way round is the short one', () => {
  const p = scene(C/2, 0, 0, C/2, 0); assert.ok(Math.abs(p[1] - 2*R) < 1e-3 && Math.abs(p[0]) < 1e-3);
  assert.ok(Math.abs(roundDiff(10, C - 10, C) + 20) < 1e-6);
  const a = scene(C - 100, 0, 0, C - 100, 50), b = scene(-100, 0, 0, -100, 50); assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6);
});
