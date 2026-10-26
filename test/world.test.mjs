// world.test.mjs — the world is a pure function of its seed and the place: the same land however it is asked for,
// coming round the ring without a seam, its biomes' weights whole.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeWorld } from '../src/world/world.js';

test('the same seed and place give the same height, a different seed different land', () => {
  const a = makeWorld(7), b = makeWorld(7), c = makeWorld(8);
  for(const [x, z] of [[0, 0], [1234, -800], [9000, 1500]]) assert.equal(a.height(x, z), b.height(x, z));
  assert.notEqual(a.height(5000, 300), c.height(5000, 300));
});

test('the land comes round the ring without a seam', () => {
  const w = makeWorld(11), C = w.circumference;
  for(const z of [-1500, 0, 900]) assert.ok(Math.abs(w.height(100, z) - w.height(100 + C, z)) < 1e-6);
});

test('the biomes at a place weigh one in all', () => {
  const w = makeWorld(3);
  for(const [x, z] of [[0, 0], [700, 400], [12000, -1200]]){ const h = w.height(x, z), s = w.biomes(x, z, h).reduce((p, q) => p + q, 0); assert.ok(Math.abs(s - 1) < 1e-9); }
});

test('you start on land', () => {
  for(const seed of [1, 4, 1793, 99999]) assert.ok(makeWorld(seed).height(0, 0) > 0);
});
