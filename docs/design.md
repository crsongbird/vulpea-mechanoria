# Vulpéa Mechanória — design

*Land of the mechanical foxes.* A first draft, written for Ruby to change. Each section ends with what is still open.
Ruby decides the design; nothing here is final until Ruby says so. The research behind each choice is in
`docs/prior-art/`, linked where it is used.

## 0 · What this game is, and what it is not

An open-world walking and survival game on a ringworld. In Ruby's words, "breath of the wild meets Elder Scrolls Arena
meets a walking sim/survival sim", with Risk of Rain 2's look: "give it huge subtle weight to everything".

**Separation from PoetryPress.** Vulpéa is its own project with its own repository, rules, release names (Sol outward)
and docs. PoetryPress keeps its Ringworld as a frozen, picturesque demo that still renders films, and builds other
worlds as scenes of its own. Code moved here once, at Sol (`src/world/`, from PoetryPress's land, regions, wildlife
and happenings kits). From now on nothing is shared by import or by copy-and-sync: an idea worth having in both is
built twice, each project's own way. PoetryPress's docs that came along are reference only
(`docs/prior-art/from-poetrypress/`, `docs/ideas-from-poetrypress.md`).

## 1 · Pillars

1. **Weight.** Everything big moves slowly and lands hard. Machines wind up before they strike; the camera feels their
   footfalls at a distance; the player's load changes their gait. ([ror2-art.md](prior-art/ror2-art.md) §7,
   [arena-and-survival.md](prior-art/arena-and-survival.md) §5)
2. **The ring is the spectacle.** The land curves up ahead and behind into an arch across the sky; the rim walls stand
   at both edges taller than any mountain. Every view should show it. (Built in Mercury: `src/ring.js`,
   `src/farRing.js`.)
3. **Walk anywhere you can see.** Climb anything, glide down, pay in stamina. No invisible walls but the rim walls
   themselves. ([botw-open-air.md](prior-art/botw-open-air.md) §1)
4. **Atmosphere over content.** Sound, light, weather and the reveal of a new place matter more than quest count.
   ([arena-and-survival.md](prior-art/arena-and-survival.md) §8)
5. **Phones first.** Every feature has a low setting; touch, keyboard and gamepad are equals.

## 2 · The world

**Fiction.** Humans are rare. Their villages in the wilds are besieged by machines. The cities glow with neon and are
full of hostile androids, and of "humans" who take their orders from machines. The little robots are shaped like
foxes; natural foxes and kitsune live in the wilds, at shrines and in older, stranger places. Mystical and East Asian
elements run through it: shrines, torii roads, fox-fire. ([foxes-machines-shrines.md](prior-art/foxes-machines-shrines.md))

**The ring.** Generated from a seed, the same seed always the same ring. At Sol it has PoetryPress's proportions: a band
4 km wide, 444 km round, rim walls 1.2 km tall. The land has continents and seas, rivers, coasts, plateaus, ten biomes
and regions with their own factions, banners and names (`src/world/`).

**Places.** Human villages behind walls; neon android cities; shrines on peaks, waterfalls and bound spirit rocks; one
pilgrimage mountain per region, Inari-style, with a torii road to its summit; fox dens; ruins of the ring's builders;
waystones that reveal the map around them. ([botw-open-air.md](prior-art/botw-open-air.md) §4,
[foxes-machines-shrines.md](prior-art/foxes-machines-shrines.md) §4–5)

**Other worlds.** Gates lead off the ring to Mars, Titan, Enceladus, a platform on a gas giant, Venus and alien worlds.
Each is a small world of its own, walked round in minutes. See [other-worlds.md](other-worlds.md).

**Open:**
- **Scale.** Keep the 4 km band (every edge in sight, the walls always close), or widen it toward Halo's tens of km
  (the walls a far haze, more room per region)? The circumference follows from the width.
- Day and night: a sun that moves (as now), or the ringworld's own way, shadow squares eclipsing a sun fixed overhead?
- How rare are humans: a village per region, or fewer?

## 3 · Playing

**The loop.** See something far off, walk to it, find what is there (a shrine, a village, a ruin, a fox), and rest
before the next. Shrine to shrine is a 2–4 minute walk, about one phone session.
([botw-open-air.md](prior-art/botw-open-air.md) §5)

**Survival, gently.** Three meters, Valheim-style: warmth, a stamina wheel, and nourishment that raises your maximums
and never starves you. No thirst. Cold is shown first by the body (shivering, breath fog), not by numbers.
([arena-and-survival.md](prior-art/arena-and-survival.md) §3, [botw-open-air.md](prior-art/botw-open-air.md) §8)

**Modes.** *Wanderer*: no meters, a walking sim. *Pilgrim*: the default. *Exile*: permadeath.
([arena-and-survival.md](prior-art/arena-and-survival.md) §4)

**Growing.** A fox companion gains a tail for each circuit of shrines, up to seven; each tail is a perk (stamina,
warmth, glide, fox-fire). Fox jewels power both kitsune magic and fox-bots.
([foxes-machines-shrines.md](prior-art/foxes-machines-shrines.md) §1–3)

**Fox-fire.** Blue-white kitsunebi is the player's lantern, fire-starter and guide. A wild fox's sickly green light
lures you off the path. ([foxes-machines-shrines.md](prior-art/foxes-machines-shrines.md) §2)

**Machines.** Two eras with two looks: ancient fox-machines in bronze and verdigris, shaped after Jōmon pottery and
haniwa; hostile modern androids in slick neon, with insect and crustacean cues. Every bot has a glowing jewel whose
colour shows its mood. ([botw-open-air.md](prior-art/botw-open-air.md) §7,
[foxes-machines-shrines.md](prior-art/foxes-machines-shrines.md) §6)

**Finding the way.** No quest markers. Bells from shrines and chirps from fox-bots point toward the next place.
([arena-and-survival.md](prior-art/arena-and-survival.md) §7)

**Open:**
- Combat: how much, and what kind? Avoidance and stealth first, or fights with weight?
- Is the player human, kitsune, or a human with a fox companion?
- A tiny chemistry engine (fox-fire, water, frost, charge, wind)? ([botw-open-air.md](prior-art/botw-open-air.md) §2)

## 4 · Look

Risk of Rain 2's language: soft, muted, matte ground; colour grading and fog that change by region; ramp-lit
materials with no photorealism; a gentle outline on creatures and things you can use, none on the land. Saturation and
glow are kept for what matters: fox-fire, shrine lights, android eyes and neon, pickups, threats. Each region has one or
two huge forms you can read through the haze from kilometres off.
([ror2-art.md](prior-art/ror2-art.md))

PoetryPress's Ringworld painting is the mood reference, not the method: its trees, roads and buildings are redrawn
here as low-poly 3D in the same style.

**Open:** cel bands (two to four) or a softer ramp? Outlines on or off by default?

## 5 · Platforms and controls

- Runs in a web browser; later an Android APK (a Trusted Web Activity or Capacitor:
  [babylon.md](engine/babylon.md) §8). WebGPU where the browser has it, WebGL2 where not.
- Touch: a stick on the left, look on the right, context buttons. Keyboard and mouse. Gamepads.
- Graphics settings scale render resolution, draw distance, shadow quality, the far ring's detail, post-processing
  and crowd sizes. ([babylon.md](engine/babylon.md) §7)

## 6 · Building it

Each release is a playable step, named from Sol outward (`docs/releases.md`):

| Release | Adds |
|---|---|
| Sol | The seed's land in chunks, a walker's camera |
| Mercury | The ring curves: the floor rising ahead and behind into the arch, both rim walls, a floating origin |
| next | A body to walk with (Havok character controller), stamina, the art pass's first materials |
| then | Trees, rocks and grass as 3D in the painted style; streaming in a worker |
| then | A shrine and a village; day and night; sound |
| then | The first fox-bots and androids |

**Open:** what Ruby wants to play first after the curve.
