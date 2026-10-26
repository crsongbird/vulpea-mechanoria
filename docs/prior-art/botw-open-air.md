# Prior art: Breath of the Wild's open-air design

Tags: [src](URL) means the source was opened and read for this note. [est] means our own judgment.

## The goal: real freedom, then climbing

Director Hidemaro Fujibayashi told GDC 2017: "What I wanted to accomplish with this new Zelda was to create a game where the user can truly experience freedom" [src](https://www.thumbsticks.com/gdc-17-breaking-conventions-breath-of-the-wild).

The first concrete step was removing impassable walls: "Our first approach was to remove those impassable walls, by transforming them and allowing the user to climb them." Gliding was added so that anything you climb, you can leave. Fujibayashi called that "the crucial ingredient" [src](https://www.thumbsticks.com/gdc-17-breaking-conventions-breath-of-the-wild).

The team tested "multiplicative gameplay" in a top-down remake of the original NES Zelda. Its one rule was "there's a simple goal, can you reach it?" One solution players found was felling a tree to bridge a river [src](https://www.thumbsticks.com/gdc-17-breaking-conventions-breath-of-the-wild).

Stamina limits running, climbing, swimming, and gliding. Food restores it, and shrine rewards can be traded to expand it [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild). Stamina is the price of going anywhere: you can climb any wall, but can you climb this one before running out [est]?

## The chemistry engine: simple rules that combine

Technical director Takuhiro Dohta calls it a rule-based *state* calculator, where a physics engine is a rule-based *movement* calculator [src](https://www.thumbsticks.com/gdc-17-breath-of-the-wild-science-lies). It has two kinds of thing and three rules:

- **Elements** (fire, water, ice, electricity, wind) and **materials** (trees, rocks, the player).
- (1) Elements change materials' states.
- (2) Elements change each other's states.
- (3) Materials don't change each other's states.

Dohta: "The model is an extremely simple one but allows for the expression of all sorts of events." He also said that puzzles based on how the real world works "can help players solve them instinctively." Of physics, he said they wanted "false physics or liars physics," not textbook physics [src](https://www.thumbsticks.com/gdc-17-breath-of-the-wild-science-lies).

## Weather and temperature as survival

- Cooking turns hunted and foraged food into meals and elixirs that restore health and stamina or grant temporary heat or cold resistance [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).
- In thunderstorms, metal gear attracts lightning. You can throw metal at enemies to call strikes onto them [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).
- Reviewers praised the indirect cues, such as Link visibly shivering in the cold [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).
- Rain making rock too slippery to climb is a well-known BotW behaviour, but we did not find a source for it this session [est].

The pattern: weather is not a damage-over-time meter. It changes the rules of traversal and combat for a while, and you prepare for it by eating or gearing up [est].

## Field design: triangles, rectangles, and points of attraction

Nintendo presented its level-design method at CEDEC 2017. Slide photos were later pulled, and English coverage comes mostly from Matt Walker's live-tweets, so treat the details as second-hand [src](https://gmtk.substack.com/p/how-nintendo-solved-zeldas-open-world) [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).

- **Triangles.** Hills, mountains, and rock formations are mostly triangular. They give a choice "whether to go straight over the triangle, or around." They hide what is behind them and reveal it gradually: "Note how the structure in the distance is slowly revealed." Their tips draw the eye, so shrines and Korok seeds sit at peaks [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).
- **Three triangle scales.** Large triangles are landmarks. Medium ones hide landmarks and routes. Small ones set the pace of moment-to-moment travel [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).
- **Rectangles** (trees, walls) "are good for completely hiding something from sight," such as mushrooms and bee nests [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).
- **Tower approach.** Each tower is revealed through a choreographed sequence: "hill -> bridge structure -> tower" [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).
- **The failed first design.** Towers ("points") were linked by event "lines." Heat maps showed about 80% of testers following the tower lines and about 20% wandering aimlessly, with players feeling an "invisible, but obvious guide rope." The fix was to scatter many points of attraction with different visibility and value:
  - about 15 neon-lit towers;
  - glowing shrines;
  - enemy camps inside skull-shaped rocks;
  - stables marked by a giant horse-head statue;
  - campfires sending up tall smoke columns.
  Later heat maps showed free wandering that still reached the key places. What attracts a player changes with their goal and with time of day [src](https://gmtk.substack.com/p/how-nintendo-solved-zeldas-open-world).
- **Scale from a real city.** Fujibayashi "took a map of Kyoto and overlaid it on the game world," matching in-game travel times (such as tower to tower) to trips he had walked, ridden, or driven at home. Art director Satoru Takizawa noted that Kyoto's many temples and shrines made it easy to picture travel times between "famous spot A" and "famous spot B" [src](https://www.nintendo-insider.com/the-legend-of-zelda-breath-of-the-wild-map-was-inspired-by-kyoto/).
- The map was split into 120 dynamically loaded areas, and its 2,344 map-screen tiles were procedurally generated [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret).
- The game starts on a plateau so players can see the expanse ahead [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).

## Shrines: discovery that pays out

There are about 120 shrines; the count comes from common knowledge and was not confirmed in the sources read [est]. Each holds a puzzle or a robot fight and pays a Spirit Orb. Four orbs buy a heart container or a stamina upgrade [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild). They glow so they stand out at range [src](https://gmtk.substack.com/p/how-nintendo-solved-zeldas-open-world). Because every shrine is also a fast-travel point, discovering one permanently shrinks the world's travel cost [est].

## Ancient machines: Guardians and Sheikah tech

- Takizawa cited the Jōmon period as the inspiration for Sheikah technology and architecture [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).
- From the art book *Creating a Champion* (artist Takafumi Kiuchi): Guardians got many legs that "bend freely like an accordion" to cross rough ground. Their body is based on Jōmon flame-style pottery (*kaen doki*). The design was kept neutral because the team had not yet decided whether Guardians would be friends or foes. A Guardian fortress with many lasers was cut [src](https://gonintendo.com/archives/299795-nintendo-reveals-details-on-the-creation-of-guardians-for-the-legend-of-zelda).
- A 2024 paper argues that the shrines and Guardians read as "upside down *kaen doki*," that the oven Cherry echoes Jōmon *dogū* figurines, and that the Slate's eye echoes Okamoto Tarō's 1956 "PAIRA" [src](https://jgeekstudies.org/2024/10/27/on-the-influence-of-japanese-archaeological-heritage-on-the-legend-of-zelda-breath-of-the-wild/).

The lesson: their machines feel old because they are drawn from Japan's oldest material culture, not from sci-fi [est].

## Painterly rendering

- The art had to make it "easy to lie." The look had to suggest real physics and chemistry while staying playable [src](https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/).
- Starting point: *Wind Waker HD*, chosen in "less than a minute." The team pushed it toward "an information-dense, mature art style" under the slogan "refreshing and full-flavoured," applied to shaders, lighting, terrain, effects, UI, and weather [src](https://zeldauniverse.net/2017/03/14/takizawa-explains-how-the-wind-waker-hd-inspired-the-visual-style-for-breath-of-the-wild/).
- Influences were gouache and *en plein air* painting, used "to convey the vastness of the world" [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild).
- Abstraction is deliberate where it explains mechanics. Broken logs become firewood bundles, and food bounces in the pot "for the fun of it" [src](https://www.thumbsticks.com/gdc17-designing-zelda-breath-of-the-wild/).

## Why it feels big [est]

- Long sightlines from high ground.
- Layered triangles that keep hiding and revealing things.
- Many visible "next things," each a different kind of reward.
- Travel times based on real journeys.
- Weather that changes how you move.

Size is felt through *choices per minute*, not square kilometres.

## What we take

1. **Climb anything, glide down, pay in stamina.** Vulpéa's ringworld terrain and strut-ruins are all climbable. The fox-companion "tail-glide" (or a kite or paper-charm glider) is the guaranteed way down. Stamina is one wheel near the character, not a HUD bar, which suits phones. Wet surfaces drain climb stamina faster. [est]
2. **A tiny chemistry engine.** Elements: kitsunebi (fox-fire), water, frost, charge (electric), wind. Materials: wood, grass, metal, cloth, android, fox-bot. Apply Dohta's three rules. Implement it as a per-cell state grid plus tags on meshes, evaluated at a few Hz. Metal-plus-storm draws lightning, which matters because the machines are metal. [src](https://www.thumbsticks.com/gdc-17-breath-of-the-wild-science-lies) [est]
3. **Triangle-first terrain authoring.** The heightfield generator places big, medium, and small cone-like forms, with points of interest snapped to peaks and on the far side of ridges. Rectangle blockers (tree stands, walls) hide forage. Every route to a waystone follows a reveal sequence: rise, structure, landmark. [src](https://gigazine.net/gsc_news/en/20171004-breath-of-the-wild-design-secret)
4. **Attraction palette with distinct silhouettes:**
   - torii-and-lantern shrines that glow;
   - robot-besieged human villages with smoke columns;
   - neon android cities that glow magenta at night;
   - fox dens marked by a fox-shaped rock;
   - waystones (the "towers") that reveal the map.
   About 15 waystones per region-ring segment. [src](https://gmtk.substack.com/p/how-nintendo-solved-zeldas-open-world) [est]
5. **Calibrate scale with real walks.** Tune walking speed and point-of-interest spacing so that shrine to shrine is a 2–4 minute walk, which suits a phone session. Use real routes such as the 4 km, roughly 2-hour Fushimi Inari mountain loop as a reference for a "pilgrimage" path. [src](https://www.nintendo-insider.com/the-legend-of-zelda-breath-of-the-wild-map-was-inspired-by-kyoto/) [src](https://en.wikipedia.org/wiki/Fushimi_Inari-taisha) [est]
6. **Shrines pay out and shorten travel.** Each shrine gives a fox-spirit token (four make a tail: +stamina or +warmth) and becomes a fast-travel torii. [est]
7. **Ancient machines from ancient forms.** Old fox-machines take their shapes from Jōmon flame pots, *dogū*, and haniwa (clay, spirals, cord-marks) in bronze and verdigris. Hostile modern androids use slick neon. Two machine eras, two visual languages. [src](https://jgeekstudies.org/2024/10/27/on-the-influence-of-japanese-archaeological-heritage-on-the-legend-of-zelda-breath-of-the-wild/) [est]
8. **Temperature told through the body.** Show cold as shivering, breath fog, and frost on the screen edge before any number appears. Eating warming food is the fix. [src](https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_Breath_of_the_Wild)
