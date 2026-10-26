/**
 * wildKit.js — THE WILD THINGS: herds, flocks and single creatures, where each one is at any moment and how it is
 * painted (Ruby: "wildlife still travel on short predictable paths and do not really move or scatter, we should
 * probably have more wildlife in general (birds, small things)"; docs/prior-art/ringworld-wildlife.md).
 *
 * WHERE: every place is a pure function of a group's own seed, a member's number and the clock (wkAt), so nothing is
 * remembered from frame to frame, a film can begin anywhere, and a game could ask the same question of the same deer
 * and get the same answer (Ruby: the generators kept "fast and portable … so we can later use it inside of a game
 * engine"). A group lives in ERAS (wkEra): stretches of its own length, each ending in a move (a herd walking on or
 * bolting, a flock flushing, a heron flying down the shore), so its paths never close into loops. Between moves each
 * member drifts on smooth noise (wkWander), never a sine's circle. Places are metres from the group's home, across (x)
 * and along (z) the ground, with y its height above it.
 *
 * HOW: each creature in a few flat shapes (wkPaint), by the colours its caller lit ({ dark, lit, mat(rgb) → { body,
 * lit, dark } }), at (X, Y) where it meets the ground, m pixels to a metre, facing dir (+1 to the right), side (how
 * side-on it is seen, 0 to 1); its gait, wingbeat and pose from its state.
 */
// (the kit's own hash of three integers to 0..1, so it needs nothing from the land)
export const wkHash = (a, b, s) => { let h = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x632be5ab, 0x165667b1) ^ Math.imul(s | 0, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b); h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35); return ((h ^ (h >>> 16)) >>> 0)/4294967296; };
// smooth noise in time, -1..1: hashed knots a unit apart, eased between (quintic), so its value and its slope are
// continuous and it never repeats
export const wkNoise = (s, t) => { const i = Math.floor(t), f = t - i, u = f*f*f*(f*(f*6 - 15) + 10), a = wkHash(i, 7, s); return 2*(a + (wkHash(i + 1, 7, s) - a)*u) - 1; };
// a wandering offset, -1..1 on each axis: three octaves, the slowest turning over about every tau seconds
export const wkWander = (s, t, tau) => { let x = 0, z = 0, a = 1, k = 1, n = 0;
  for(let o = 0; o < 3; o++){ x += a*wkNoise(s + o*101, t*k/tau); z += a*wkNoise(s + o*101 + 53, t*k/tau); n += a; a *= 0.5; k *= 2.3; } return [1.6*x/n, 1.6*z/n]; };
// A GROUP'S ERAS: era k begins near k·P (up to a quarter of P either way), so each lasts half to one and a half P
const wkStart = (s, k, P) => k*P + (wkHash(k, 3, s) - 0.5)*0.5*P;
export const wkEra = (s, t, P) => { let k = Math.floor(t/P); if(t < wkStart(s, k, P)) k--; else if(t >= wkStart(s, k + 1, P)) k++; const t0 = wkStart(s, k, P); return { k, t0, d: wkStart(s, k + 1, P) - t0 }; };
const wkSmooth = p => p <= 0 ? 0 : p >= 1 ? 1 : p*p*(3 - 2*p);

// WHAT EACH KIND IS (metres, seconds, metres a second; docs/prior-art/ringworld-wildlife.md): how many in a group, how
// it moves (its `way`), how big (size: a body's length, a bird's span), and its colours
export const WK_KINDS = {
  // the ground's walkers: a home that moves each era (range), walked to or bolted for (bolt: how often an era opens in
  // flight), the herd re-forming round it (spread), each grazing on its own drift between (wander, over tau)
  deer:      { way: 'walk', n: [3, 8], P: 170, range: 45, spread: 4, walk: 1.2, run: 9, bolt: 0.4, wander: 3, tau: 32, size: 1.6, stride: 4.2, coat: [146, 98, 60] },
  elk:       { way: 'walk', n: [2, 6], P: 220, range: 60, spread: 6, walk: 1.1, run: 8, bolt: 0.3, wander: 3, tau: 40, size: 2.3, stride: 4.6, coat: [118, 84, 58] },
  hare:      { way: 'hop', n: [1, 3], P: 24, range: 6, spread: 5, walk: 2.4, run: 10, bolt: 0.18, wander: 0.5, tau: 9, size: 0.55, stride: 1.1, coat: [152, 124, 90] },
  fox:       { way: 'prowl', n: [1, 1], P: 80, range: 35, spread: 0, walk: 2.1, run: 9, bolt: 0.08, wander: 0.8, tau: 14, size: 0.75, stride: 1.4, coat: [196, 98, 44] },
  // the ground's birds, flushed all at once and wheeling down elsewhere (hgt: how high they rise)
  rooks:     { way: 'flock', n: [5, 12], P: 55, range: 28, spread: 8, fly: 9, wander: 1.3, tau: 7, size: 0.85, hgt: [5, 14], coat: [30, 30, 36], body: 0.46, breast: [44, 44, 52], bill: [86, 84, 90], tail: 0.7 },
  pigeons:   { way: 'flock', n: [4, 10], P: 40, range: 20, spread: 5, fly: 10, wander: 1.0, tau: 6, size: 0.65, hgt: [4, 11], coat: [128, 132, 146], body: 0.33, breast: [170, 150, 170], face: [96, 140, 120], wing: [150, 154, 166] },
  starlings: { way: 'flock', n: [6, 16], P: 34, range: 22, spread: 6, fly: 10, wander: 1.2, tau: 5, size: 0.4, hgt: [3, 9], coat: [44, 46, 54], body: 0.21, breast: [58, 60, 72], gloss: [90, 70, 130], bill: [214, 190, 70] },
  sparrows:  { way: 'flock', n: [4, 10], P: 26, range: 14, spread: 2.5, fly: 6, wander: 0.7, tau: 4, size: 0.24, hgt: [1.5, 4], coat: [134, 104, 76], body: 0.15, breast: [196, 180, 152], face: [92, 84, 78] },
  // (Ruby, 2026-10-25: "increase the size of and diversity of birds (and colors, shading, etc)": the colourful ones,
  //  each by its field marks, docs/prior-art/ringworld-wildlife.md §8: breast, wing patch, face, tail, bill)
  magpies:   { way: 'flock', n: [2, 5], P: 60, range: 22, spread: 5, fly: 7, wander: 1.1, tau: 8, size: 0.58, hgt: [3, 9], coat: [22, 24, 30], body: 0.44, breast: [242, 242, 238], patch: [238, 238, 234], gloss: [70, 120, 110], tail: 1.6 },
  jays:      { way: 'flock', n: [1, 3], P: 70, range: 24, spread: 6, fly: 7, wander: 1.2, tau: 9, size: 0.55, hgt: [4, 10], coat: [190, 146, 124], body: 0.34, breast: [206, 172, 150], wing: [40, 38, 42], patch: [74, 128, 214], face: [236, 230, 222], tail: 0.9 },
  goldfinches: { way: 'flock', n: [6, 14], P: 24, range: 12, spread: 3, fly: 7, wander: 0.8, tau: 4, size: 0.23, hgt: [1.5, 5], coat: [176, 138, 98], body: 0.13, breast: [238, 228, 212], wing: [26, 24, 26], patch: [246, 206, 40], face: [208, 42, 40] },
  parakeets: { way: 'flock', n: [5, 12], P: 40, range: 30, spread: 6, fly: 12, wander: 1, tau: 6, size: 0.45, hgt: [6, 16], coat: [98, 194, 84], body: 0.3, breast: [158, 220, 110], wing: [64, 156, 66], patch: [232, 222, 92], bill: [214, 44, 44], tail: 1.7 },
  robins:    { way: 'flock', n: [1, 2], P: 30, range: 10, spread: 2, fly: 6, wander: 0.6, tau: 5, size: 0.21, hgt: [1, 3], coat: [128, 108, 78], body: 0.13, breast: [230, 118, 50], face: [230, 118, 50] },
  // on the water: a slow drift, now and then up-ended to feed
  ducks:     { way: 'paddle', n: [2, 7], spread: 3, wander: 5, tau: 38, size: 0.55, coat: [116, 96, 74], head: [40, 88, 60] },
  swans:     { way: 'paddle', n: [1, 3], spread: 4, wander: 7, tau: 55, size: 1.4, coat: [240, 238, 232], head: [240, 238, 232] },
  // at the water's edge: still, a slow step, the strike, and now and then a long slow flight down the shore
  heron:     { way: 'wade', n: [1, 1], P: 90, range: 6, fly: 9, flyOff: 45, flies: 0.22, size: 0.95, coat: [150, 156, 164] },
  egret:     { way: 'wade', n: [1, 1], P: 90, range: 6, fly: 8, flyOff: 45, flies: 0.22, size: 1.0, coat: [246, 246, 240], bill: [232, 192, 52] },
  // in the air: circling on a thermal and gliding to the next; hawking for insects on noise (amp: how far, hgt: how high)
  raptor:    { way: 'soar', n: [1, 2], P: 160, size: 1.3, speed: 9, coat: [96, 72, 52] },
  swallows:  { way: 'hawk', n: [3, 7], tau: 10, amp: 18, hgt: [1.2, 9], size: 0.32, flap: 5, coat: [36, 40, 64] },
  swifts:    { way: 'hawk', n: [4, 9], tau: 14, amp: 40, hgt: [22, 65], size: 0.42, flap: 6, coat: [42, 40, 40] },
  bats:      { way: 'hawk', n: [3, 8], tau: 6, amp: 7, hgt: [3, 14], size: 0.28, flap: 6, coat: [44, 36, 34] },
  butterflies: { way: 'hawk', n: [1, 3], tau: 3, amp: 2, hgt: [0.3, 1.6], size: 0.07, flap: 5, coat: [230, 200, 90] },
  dragonflies: { way: 'dart', n: [1, 3], P: 2.6, range: 2, hgt: [0.4, 1.4], size: 0.09, coat: [70, 140, 170] },
  // the magic world's own (Ruby, 2026-10-25: "cute slimes, chocobo-like birds and such (legally distinct)";
  // docs/prior-art/ringworld-magic-creatures.md): slimes, low mounds of jelly that hop about and bounce where they sit,
  // squashing as they gather and land and stretching as they leap; striders, tall flightless runners of the open
  // country as emus are (size: a slime's width, a strider's height)
  slimes:    { way: 'hop', body: 'slime', n: [1, 4], P: 40, range: 8, spread: 2.5, walk: 1.2, run: 4, bolt: 0.1, wander: 1.2, tau: 10, size: 0.5, stride: 0.9, coat: [120, 200, 150] },
  striders:  { way: 'walk', body: 'strider', n: [2, 5], P: 150, range: 50, spread: 5, walk: 1.4, run: 12, bolt: 0.3, wander: 3, tau: 30, size: 2, stride: 2.75, coat: [176, 150, 112] },
  // (Ruby, 2026-10-25: "a wider diversity of wildlife, medium and small predators, fantastic life": the hunters, each by
  //  its country and its hours and fewer than what they hunt; docs/prior-art/ringworld-wildlife.md §9. belly: its
  //  underparts (a badger's legs and belly black); a stoat bounds, a lynx creeps, a wolf pack trots and lies up)
  stoat:     { way: 'prowl', body: 'hunter', n: [1, 1], P: 30, range: 14, spread: 0, walk: 1.6, run: 6, bolt: 0.15, wander: 0.8, tau: 6, size: 0.3, stride: 0.45, coat: [150, 96, 56], belly: [236, 222, 196] },
  badger:    { way: 'prowl', body: 'hunter', n: [1, 2], P: 90, range: 25, spread: 2, walk: 0.9, run: 4, bolt: 0.05, wander: 1, tau: 16, size: 0.8, stride: 0.6, coat: [146, 142, 136], belly: [38, 36, 36], pounce: 0 },
  lynx:      { way: 'prowl', body: 'hunter', n: [1, 1], P: 120, range: 40, spread: 0, walk: 1.0, run: 12, bolt: 0.06, wander: 0.6, tau: 20, size: 1.0, stride: 1.2, coat: [176, 140, 102], belly: [228, 216, 198] },
  wolves:    { way: 'walk', body: 'hunter', n: [4, 8], P: 200, range: 80, spread: 5, walk: 2.2, run: 11, bolt: 0.2, wander: 2, tau: 30, size: 1.2, stride: 1.7, coat: [126, 120, 110], belly: [214, 208, 196] },
  jackals:   { way: 'walk', body: 'hunter', n: [1, 3], P: 110, range: 50, spread: 3, walk: 1.8, run: 10, bolt: 0.2, wander: 1.6, tau: 20, size: 0.85, stride: 1.2, coat: [178, 146, 104], belly: [230, 218, 196] },
  // (the night's and the open field's hunters of the air: an owl quartering low and slow on its broad round wings; a
  //  kestrel hanging on the wind over one spot, its head still, then sliding on to the next or dropping on its prey)
  owls:      { way: 'hawk', n: [1, 1], tau: 30, amp: 26, hgt: [1.5, 5], size: 0.9, flap: 1.4, coat: [206, 170, 120], face: [246, 240, 228] },
  kestrel:   { way: 'hover', n: [1, 1], P: 30, range: 35, hgt: [6, 12], size: 0.75, flap: 7, fly: 8, coat: [176, 100, 60], head: [128, 134, 148] },
  // (the magic world's fantastic ones, kinds of folklore and of no one's game, docs/prior-art/ringworld-magic-creatures.md
  //  §3–6: drakes, two-legged and winged, soaring as a raptor does; sky rays, vast and slow, rowing the high air in pods;
  //  lantern moths glowing softly by night; moonharts, pale deer with one horn and a mane of their region's light)
  drakes:    { way: 'soar', body: 'drake', n: [1, 2], P: 180, size: 4.2, speed: 11, coat: [92, 74, 104] },
  skyrays:   { way: 'cruise', body: 'ray', n: [1, 3], size: 38, speed: 4.5, hgt: [170, 380], R: [320, 760], beat: 7, coat: [64, 78, 112], belly: [178, 192, 216] },
  lanternmoths: { way: 'hawk', body: 'moth', n: [3, 8], tau: 8, amp: 3.5, hgt: [0.6, 4], size: 0.2, flap: 3, coat: [214, 196, 160] },
  moonharts: { way: 'walk', n: [2, 4], P: 190, range: 45, spread: 4, walk: 1.1, run: 9, bolt: 0.25, wander: 3, tau: 34, size: 1.7, stride: 4.2, coat: [226, 222, 214] },
  // a skein of geese passing over in its V, once in an era, against the wind
  geese:     { way: 'skein', n: [7, 15], P: 520, speed: 16, hgt: [120, 240], size: 1.6, coat: [110, 104, 96] },
};
export const WK_FLYERS = ['raptor', 'swallows', 'swifts', 'bats', 'geese', 'butterflies', 'dragonflies', 'owls', 'kestrel', 'drakes', 'skyrays', 'lanternmoths'];
// (the birds: drawn larger than life still, as a painter does birds so that they read, Ruby: "increase the size of … birds")
export const WK_BIRDS = ['rooks', 'pigeons', 'starlings', 'sparrows', 'magpies', 'jays', 'goldfinches', 'parakeets', 'robins', 'heron', 'egret', 'raptor', 'swallows', 'swifts', 'geese', 'owls', 'kestrel'];
export const wkCount = (kind, s) => { const K = WK_KINDS[kind]; return K.n[0] + Math.floor(wkHash(s, 1, 5)*(K.n[1] - K.n[0] + 1)); };

// a walker's or a flock's LEG into era k: where its member j is bound (round the era's home), when it sets off, how fast
const wkLeg = (K, s, j, k, n) => { const t0 = wkStart(s, k, K.P), q = k*61 + j, home = [K.range*(2*wkHash(k, 21, s) - 1), K.range*0.8*(2*wkHash(k, 22, s) - 1)];
  const an = wkHash(q, 23, s)*Math.PI*2, rd = K.spread*Math.sqrt(wkHash(q, 24, s)*n), p1 = [home[0] + Math.cos(an)*rd, home[1] + Math.sin(an)*rd];
  const bolt = K.way === 'flock' || wkHash(k, 25, s) < K.bolt, sp = (K.way === 'flock' ? K.fly : bolt ? K.run : K.walk)*(0.85 + 0.3*wkHash(q, 26, s));
  const dep = t0 + (K.way === 'flock' ? 0.7 : bolt ? 0.9 : 10)*wkHash(q, 27, s) + (bolt && K.way !== 'flock' ? 0.7 : 0);
  return { t0, p1, bolt, sp, dep, q }; };
// how far a leg goes (from the last era's place, so it needs nothing older) and so how long it takes
// (a flock's way round its wheel counted in; never so long that the next era's leg would begin before it ends)
const wkSpan = (K, s, j, k, n) => { const L = wkLeg(K, s, j, k, n), P = wkLeg(K, s, j, k - 1, n), dist = Math.hypot(L.p1[0] - P.p1[0], L.p1[1] - P.p1[1]), loop = K.way === 'flock' ? 2*Math.PI*(5 + 9*wkHash(k, 29, s)) : 0;
  return { L, P, dist, T: Math.min((dist + loop)/L.sp + (K.way === 'flock' ? 1.5 : 0.4), wkStart(s, k + 1, K.P) - L.dep - 0.5) }; };
// where it grazes after a leg: the leg's end, drifted by its own wander since it arrived
const wkGraze = (K, s, j, L, T, t) => { const w = wkWander(s + j*97, t, K.tau), w0 = wkWander(s + j*97, L.dep + T, K.tau); return [L.p1[0] + (w[0] - w0[0])*K.wander, L.p1[1] + (w[1] - w0[1])*K.wander]; };

// WHERE member j of a group of kind (its seed s) is at time t: { x, z, y (metres), pose, ph (its gait or wingbeat's
// turn), head (0 down … 1 up), on (0 … 1: whether it is here at all) } (env: { wind: [way, m/s] })
// (a slime's own bounce on top of where it is: a hop every second or two of its own, sitting or on its way, gathering
//  itself flat before it and squashing as it lands, stretched in the air, a jelly's wobble after. sq: -1 squashed …
//  +1 stretched, its volume kept by its painter)
export function wkAt(kind, s, j, t, env = {}){ const st = wkAt0(kind, s, j, t, env), K = WK_KINDS[kind]; if(K.body !== 'slime' || !st.on) return st;
  const per = 1.4 + 1.2*wkHash(j, 40, s), tt = t + wkHash(j, 41, s)*per, u = (tt % per)/per, up = 0.3;
  const y = u < up ? 0.55*K.size*Math.sin(Math.PI*u/up) : 0, wob = u >= up && u < up + 0.3 ? 0.12*Math.sin((u - up)*60)*(1 - (u - up)/0.3) : 0;
  const sq = u < up ? 0.28*Math.sin(Math.PI*u/up) : u < up + 0.08 ? -0.4*(1 - (u - up)/0.08) : u > 0.9 ? -0.35*wkSmooth((u - 0.9)/0.1) : wob;
  return { ...st, y, sq }; }
function wkAt0(kind, s, j, t, env = {}){
  const K = WK_KINDS[kind], n = wkCount(kind, s), tt = t + (K.P ? wkHash(s, 2, 9)*K.P*30 : wkHash(s, 4, 9)*500);
  switch(K.way){
  case 'walk': case 'hop': case 'prowl': case 'flock': {
    const e = wkEra(s, tt, K.P), { L, P, dist, T } = wkSpan(K, s, j, e.k, n), Pp = wkSpan(K, s, j, e.k - 1, n);
    const alertBy = wkSmooth((wkNoise(s + j*17, tt/7) - 0.15)/0.35), grazeFace = (LL, TT, ux, uz) => Math.atan2(uz, ux) + 1.3*(wkNoise(s + j*5, tt/40) - wkNoise(s + j*5, (LL.dep + TT)/40));
    // (Ruby: "a deer not always eating": between moves each member keeps its own rhythm of grazing, standing to look
    //  round, and lying down to rest and chew, slowly, a member at a time; a ground bird hops now and then and flicks
    //  its wings. lie: how far down it lies, 0 standing … 1 lying; hop: a ground bird's hop, in metres)
    const act = wkNoise(s + j*31, tt/55), lie = K.way === 'walk' ? wkSmooth((-0.22 - act)/0.22) : 0, look = wkSmooth((act - 0.3)/0.25);
    const hopU = K.way === 'flock' ? (tt*0.7 + wkHash(j, 33, s)*7) % 7 : 9, hop = hopU < 0.45 ? 0.12*K.size*Math.sin(Math.PI*hopU/0.45) : 0;
    if(tt < L.dep || dist < 1e-6){ const LL = tt < L.dep ? P : L, TT = tt < L.dep ? Pp.T : T, g = wkGraze(K, s, j, LL, TT, tt), ux = LL.p1[0] - (tt < L.dep ? Pp.P : P).p1[0], uz = LL.p1[1] - (tt < L.dep ? Pp.P : P).p1[1];
      const warn = L.bolt && K.way !== 'flock' ? wkSmooth((tt - (L.dep - 1.2))/0.6) : 0;
      return { x: g[0], z: g[1], y: hop, face: grazeFace(LL, TT, ux, uz), pose: K.way === 'flock' ? 'peck' : 'graze', ph: tt*(K.way === 'flock' ? 0.9 : 0.12) + j*0.37, head: Math.max(warn, alertBy*(K.way === 'hop' ? 1 : 0.7), look, lie*0.8), lie: lie*(1 - warn), flick: hop > 0 ? 1 : 0, on: 1 }; }
    const from = wkGraze(K, s, j, P, Pp.T, L.dep), p = Math.min(1, (tt - L.dep)/T);
    if(p >= 1){ const g = wkGraze(K, s, j, L, T, tt), settle = wkSmooth((tt - L.dep - T)/20); return { x: g[0], z: g[1], y: hop, face: grazeFace(L, T, L.p1[0] - from[0], L.p1[1] - from[1]), pose: K.way === 'flock' ? 'peck' : 'graze', ph: tt*0.9 + j*0.37, head: Math.max(alertBy*0.7, look*settle, lie*settle*0.8), lie: lie*settle, flick: hop > 0 ? 1 : 0, on: 1 }; }
    const dx = L.p1[0] - from[0], dz = L.p1[1] - from[1], dl = Math.hypot(dx, dz) || 1e-6, nx = -dz/dl, nz = dx/dl;
    // (a bolt and a walk ease on and off; a flock's flight wheels once round as it goes, rising and
    //  settling, the birds loosening in the air and closing up as they land)
    const ea = wkSmooth(p), spread = (wkHash(L.q, 28, s) - 0.5)*2;
    let x = from[0] + dx*ea, z = from[1] + dz*ea, y = 0;
    if(K.way === 'flock'){ const wr = 5 + 9*wkHash(e.k, 29, s), sg = wkHash(e.k, 30, s) < 0.5 ? 1 : -1, th0 = Math.atan2(dz, dx) - Math.PI/2*sg;
      const fl = pp => { const ep = wkSmooth(pp), th = th0 + Math.PI*2*sg*ep, sp2 = spread*4*Math.sin(Math.PI*pp); return [from[0] + dx*ep + wr*(Math.cos(th) - Math.cos(th0)) + nx*sp2, from[1] + dz*ep + wr*(Math.sin(th) - Math.sin(th0)) + nz*sp2]; };
      const [fx, fz] = fl(p), [gx, gz] = fl(Math.min(1, p + 0.02));
      return { x: fx, z: fz, y: (K.hgt[0] + (K.hgt[1] - K.hgt[0])*wkHash(e.k, 31, s))*wkSmooth(p/0.3)*wkSmooth((1 - p)/0.35), face: Math.atan2(gz - fz, gx - fx), pose: 'fly', ph: (tt - L.dep)*4.5 + j*0.31, head: 1, on: 1 }; }
    // (a bolting herd fans out as it runs and closes again as it stops: scattered, then a herd)
    const lat = L.bolt ? spread*dl*0.22*Math.sin(Math.PI*ea) : spread*0.6*Math.sin(Math.PI*ea); x += nx*lat; z += nz*lat;
    const gone = ea*dl;
    if(K.way === 'hop'){ const hops = gone/(L.bolt ? 2.6 : 0.8); y = Math.abs(Math.sin(Math.PI*hops))*(L.bolt ? 0.35 : 0.18); }
    // (a fox now and then ends its trot in the mouser's pounce: up half a metre and down, nose first)
    if(K.way === 'prowl' && !L.bolt && wkHash(e.k, 32, s) < 0.35*(K.pounce ?? 1)){ const q = (gone - (dl - 1.6))/1.6; if(q > 0) y = 0.5*Math.sin(Math.PI*Math.min(1, q)); if(q > 0) return { x, z, y, face: Math.atan2(dz, dx), pose: 'pounce', ph: q, head: 0.5, on: 1 }; }
    return { x, z, y, face: Math.atan2(dz + nz*0.001, dx + nx*0.001), pose: L.bolt ? 'run' : 'walk', ph: gone/K.stride, head: L.bolt ? 0.8 : 0.45, on: 1 }; }
  case 'paddle': { const an = wkHash(j, 33, s)*Math.PI*2, rd = K.spread*Math.sqrt(wkHash(j, 34, s)*n), w = wkWander(s + j*91, tt, K.tau), w2 = wkWander(s + j*91, tt + 1, K.tau);
    const x = Math.cos(an)*rd + w[0]*K.wander, z = Math.sin(an)*rd + w[1]*K.wander, vx = (w2[0] - w[0])*K.wander, vz = (w2[1] - w[1])*K.wander;
    return { x, z, y: 0, face: Math.atan2(vz, vx), pose: 'swim', ph: Math.min(1, Math.hypot(vx, vz)/0.4), head: 1 - wkSmooth((wkNoise(s + j*9, tt/9) - 0.45)/0.25), on: 1 }; }
  case 'wade': { const e = wkEra(s, tt, K.P), spot = k => [K.flyOff*(2*wkHash(k, 35, s) - 1)*(wkHash(k, 36, s) < K.flies ? 1 : 0.08), K.range*(2*wkHash(k, 37, s) - 1)];
    // (its spot is the last era's but for a step; in a flying era, a long way down the shore)
    const cum = k => { let x = 0, z = 0; for(let q = k - 3; q <= k; q++){ const p = spot(q); x += p[0]; z += p[1]*0.3; } return [x, z]; };
    const a = cum(e.k - 1), b = cum(e.k), fly = wkHash(e.k, 36, s) < K.flies, dl = Math.hypot(b[0] - a[0], b[1] - a[1]), T = Math.min(fly ? dl/K.fly + 3 : dl/0.25 + 1, e.d - 5), p = (tt - e.t0 - 4)/T;
    if(p <= 0 || p >= 1){ const at = p <= 0 ? a : b; return { x: at[0], z: at[1], y: 0, face: Math.atan2(b[1] - a[1], b[0] - a[0]) + 0.8*wkNoise(s, tt/50), pose: 'stand', ph: 0, head: wkSmooth((wkNoise(s + 3, tt/5) - 0.55)/0.2), on: 1 }; }
    const ea = wkSmooth(p); return { x: a[0] + (b[0] - a[0])*ea, z: a[1] + (b[1] - a[1])*ea, y: fly ? 7*wkSmooth(p/0.25)*wkSmooth((1 - p)/0.3) : 0, face: Math.atan2(b[1] - a[1], b[0] - a[0]), pose: fly ? 'fly' : 'wade', ph: fly ? (tt - e.t0)*1.4 : ea*dl/0.6, head: 0.6, on: 1 }; }
  case 'soar': { const e = wkEra(s, tt, K.P), [wa, ws] = env.wind || [0, 3], drift = Math.min(2, ws*0.25), sgn = wkHash(s + j, 38, 1) < 0.5 ? 1 : -1;
    const circ = k => { const R0 = 22 + 16*wkHash(k*7 + j, 39, s); return { c: [160*(2*wkHash(k*7 + j, 40, s) - 1), 160*(2*wkHash(k*7 + j, 41, s) - 1)], r: R0, th: wkHash(k*7 + j, 42, s)*Math.PI*2, h0: 30 + 20*wkHash(k*7 + j, 43, s) }; };
    const at = (C, k, t0, u) => { const th = C.th + sgn*u*K.speed/C.r; return [C.c[0] + Math.cos(wa)*drift*u + C.r*Math.cos(th), C.c[1] + Math.sin(wa)*drift*u + C.r*Math.sin(th), C.h0 + 0.9*u, th]; };
    const C = circ(e.k), up = e.d*0.78, u = tt - e.t0;
    if(u < up){ const [x, z, y, th] = at(C, e.k, e.t0, u); return { x, z, y, face: th + sgn*Math.PI/2, pose: 'soar', ph: u*0.6, head: 1, on: 1 }; }
    const [x0, z0, y0] = at(C, e.k, e.t0, up), C1 = circ(e.k + 1), x1 = C1.c[0] + C1.r*Math.cos(C1.th), z1 = C1.c[1] + C1.r*Math.sin(C1.th), q = wkSmooth((u - up)/(e.d - up));
    return { x: x0 + (x1 - x0)*q, z: z0 + (z1 - z0)*q, y: y0 + (C1.h0 - y0)*q, face: Math.atan2(z1 - z0, x1 - x0), pose: 'glide', ph: u*0.6, head: 1, on: 1 }; }
  case 'hawk': { const an = wkHash(j, 44, s)*Math.PI*2, rd = K.amp*0.3*Math.sqrt(wkHash(j, 45, s)), w = wkWander(s + j*131, tt, K.tau), w2 = wkWander(s + j*131, tt + 0.08, K.tau), hy = wkNoise(s + j*7 + 1, tt/(K.tau*0.8));
    return { x: Math.cos(an)*rd + w[0]*K.amp, z: Math.sin(an)*rd + w[1]*K.amp, y: K.hgt[0] + (K.hgt[1] - K.hgt[0])*(0.5 + 0.5*hy), face: Math.atan2(w2[1] - w[1], w2[0] - w[0]), pose: 'fly', ph: tt*K.flap + j*0.4, head: 1, on: 1 }; }
  case 'dart': { const e = wkEra(s + j*29, tt, K.P), sp = k => [K.range*(2*wkHash(k, 46, s + j) - 1), K.range*(2*wkHash(k, 47, s + j) - 1), K.hgt[0] + (K.hgt[1] - K.hgt[0])*wkHash(k, 48, s + j)];
    const a = sp(e.k - 1), b = sp(e.k), p = wkSmooth((tt - e.t0)/0.5), jit = wkWander(s + j*7, tt, 0.6);
    return { x: a[0] + (b[0] - a[0])*p + jit[0]*0.08, z: a[1] + (b[1] - a[1])*p + jit[1]*0.08, y: a[2] + (b[2] - a[2])*p, face: Math.atan2(b[1] - a[1], b[0] - a[0]), pose: p < 1 ? 'dart' : 'hover', ph: tt*9 + j, head: 1, on: 1 }; }
  case 'skein': { const e = wkEra(s, tt, K.P), [wa] = env.wind || [0, 3], hd = wa + Math.PI + (wkHash(e.k, 49, s) - 0.5)*1.4, Lh = 1100, Dp = 2*Lh/K.speed;
    if(wkHash(e.k, 50, s) > 0.75) return { on: 0 }; const ts = e.t0 + wkHash(e.k, 51, s)*Math.max(0, e.d - Dp), u = (tt - ts)*K.speed - Lh; if(u < -Lh || u > Lh) return { on: 0 };
    const ca = Math.cos(hd), sa = Math.sin(hd), off = 160*(2*wkHash(e.k, 52, s) - 1), r = Math.ceil(j/2), side = j % 2 ? -1 : 1, wob = wkWander(s + j*3, tt, 9);
    const back = r*3.4 + wob[0]*0.6, lat = side*r*2.3 + wob[1]*0.5, H = K.hgt[0] + (K.hgt[1] - K.hgt[0])*wkHash(e.k, 53, s);
    return { x: ca*(u - back) - sa*(off + lat), z: sa*(u - back) + ca*(off + lat), y: H + wob[1]*2, face: hd, pose: 'fly', ph: tt*3 + j*0.7, head: 1, on: Math.min(1, (Lh - Math.abs(u))/(Lh*0.2)) }; }
  // (a kestrel's hunt: it hangs on the wind over one spot, facing into it, its head held still while its wings beat fast;
  //  then it slides on to the next, or now and then drops, wings half shut, to the grass and rises again)
  case 'hover': { const e = wkEra(s + j*41, tt, K.P), [wa] = env.wind || [0, 3], spot = k => [K.range*(2*wkHash(k, 57, s + j) - 1), K.range*(2*wkHash(k, 58, s + j) - 1), K.hgt[0] + (K.hgt[1] - K.hgt[0])*wkHash(k, 59, s + j)];
    const a = spot(e.k), b = spot(e.k + 1), u = (tt - e.t0)/e.d, stoop = wkHash(e.k, 60, s + j) < 0.3, hv = 0.66, sd = 0.1, w = wkWander(s + j*13, tt, 2.5);
    if(u < hv){ const dn = stoop ? wkSmooth((u - (hv - sd))/sd) : 0;
      return { x: a[0] + w[0]*0.25, z: a[1] + w[1]*0.25, y: a[2]*(1 - dn) + 0.4*dn + w[1]*0.15, face: wa + Math.PI, pose: dn > 0.05 ? 'stoop' : 'hover', ph: tt*K.flap, head: 0, on: 1 }; }
    const p = wkSmooth((u - hv)/(1 - hv)), y0 = stoop ? 0.4 : a[2];
    return { x: a[0] + (b[0] - a[0])*p, z: a[1] + (b[1] - a[1])*p, y: y0 + (b[2] - y0)*p + 2*Math.sin(Math.PI*p), face: Math.atan2(b[1] - a[1], b[0] - a[0]), pose: 'glide', ph: tt*K.flap*0.4, head: 1, on: 1 }; }
  // (a pod of sky rays rowing round a wide circle of their own, high and slow, one behind another, rising and sinking
  //  on the air as whales do on the sea; ph their wings' slow beat)
  case 'cruise': { const R = K.R[0] + (K.R[1] - K.R[0])*wkHash(s, 54, 1), sgn = wkHash(s, 55, 1) < 0.5 ? 1 : -1, th = wkHash(s, 56, 1)*Math.PI*2 + sgn*(tt*K.speed - j*K.size*1.7)/R;
    const lat = (j % 2 ? 1 : -1)*Math.ceil(j/2)*K.size*0.9, rr = R + lat, h = K.hgt[0] + (K.hgt[1] - K.hgt[0])*(0.5 + 0.5*wkNoise(s + 3, tt/160)) + 6*wkNoise(s + j*11, tt/30);
    return { x: rr*Math.cos(th), z: rr*Math.sin(th), y: h, face: th + sgn*Math.PI/2, pose: 'fly', ph: tt/K.beat + j*0.27, head: 1, on: 1 }; }
  }
  return { on: 0 };
}

// (How they were painted on PoetryPress's canvas is left behind: here a creature is a model drawn by the engine, placed
//  where wkAt says it is.)
