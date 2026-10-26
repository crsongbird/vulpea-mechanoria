# Prior art: Risk of Rain 2's art direction

Tags: [src](URL) means the source was opened and read for this note. [est] means our own judgment, from looking at the game or from engineering experience, not from a source.

## What the sources say, and how much they say

Hopoo Games never published an art bible or a GDC art talk for Risk of Rain 2. The only primary material is their own dev blog, a few interviews, and what modders have learned from the shipped files. So this note separates three things: what Hopoo said, what can be inferred from the game's rendering setup, and our own reading of the look.

## Origins: 3D was chosen for scale and atmosphere

- The sequel began as a 2D prototype in which you played as the first game's monsters. It went to 2.5D and then to full 3D, partly so that collected items could be shown on the character's body [src](https://en.wikipedia.org/wiki/Risk_of_Rain_2) [src](https://pcgamer.com/we-finally-get-our-first-look-at-risk-of-rain-2).
- Hopoo's first dev blog states the reason directly: "We think that 3D allows for much deeper design spaces and more possibilities for cool gameplay." It adds: "Feelings of scale and atmosphere are also much stronger" [src](https://www.tumblr.com/hopoo/160452455554/devblog-1-our-next-project-weve-been-working). For Vulpéa, that is the core of the brief: the 3D look was justified by scale and atmosphere from the start.
- Paul Morse said 3D lets the environment be "so much grander." He also said the team's first priority was to show players "this is still Risk of Rain," so the first four monsters were carried over from the original [src](https://pcgamer.com/we-finally-get-our-first-look-at-risk-of-rain-2).
- They found 3D level work unforgiving: "in 3D, it feels like you have one shot once you get into designing the level," and "prototyping in 3D is much more difficult" (Morse). A Hopoo tweet in the same article mentions using additive animation layers to save time [src](https://kotaku.com/risk-of-rain-2-developers-discuss-the-games-shift-to-3d-1821553824).
- It was the studio's first 3D game, made in Unity, which they had to learn as they went [src](https://en.wikipedia.org/wiki/Risk_of_Rain_2) [src](https://www.tumblr.com/hopoo/179932895084/devblog-11-moving-forward-with-a-very-heavy).

## The rendering model: a stylized deferred pipeline

Hopoo's DevBlog #7 is the most technical primary source available [src](https://www.tumblr.com/hopoo/166010258719/devblog-7-deferred-rendering-hi-this-last):

- They moved from forward to deferred rendering so lights would be "*much* cheaper." That let them "attach lights to stuff like projectiles, monsters, and item displays." Much of the game's glow comes from many small, cheap lights.
- They wanted "custom control over the information sent to our gbuffers (so we could have a more stylized rendering model)." They also noted it is "very difficult to get Unity to work with non-PBR … lighting models in deferred rendering."
- Their G-buffer layout:
  - RT0: diffuse RGB, plus occlusion in alpha.
  - RT1: Phong strength, a **ramp** value, Phong exponent, and smoothness.
  - RT2: normal, plus **outline strength** in alpha.
- Deferred rendering also made decals and **Sobel outlines** cheap as post-processes.

What this means: the look is not PBR. Each surface gets simple Phong highlights and a per-material **lighting ramp** (toon-like banding chosen per material), and a screen-space edge filter draws outlines whose strength each object controls. Steam players describe the result as "cel shaded" [src](https://steamcommunity.com/app/632360/discussions/0/1640912849406576841/). A 2026 forum reply summarizes the devblog the same way (depth Sobel, blended with base colour, per-object strength in the G-buffer) [src](https://forums.unrealengine.com/t/risk-of-rain-2-coloured-outline/151762).

## Stage identity comes from fog and grading

- Modders reshape each stage's look mainly by changing "post-processing (mostly Ramp Fog and Color Grading)," plus global lighting and material sets. The StageAesthetic mod ships 84 variants this way [src](https://thunderstore.io/package/prodzpod/StageAesthetic/). Another mod replaces the vanilla post-process profiles for stages 1–6, re-tints sun and ambient light to match, and swaps between nine material themes [src](https://thunderstore.io/package/nicof1/CoolerStages_Continued/). So in the shipped game, a stage's mood is mostly data: a coloured, ramped distance fog, a grade, and a sun colour, applied over shared geometry and materials.
- Each stage is a single strong biome idea:
  - Distant Roost: "earthen spires in fog."
  - Titanic Plains: "giant stone arches."
  - Abandoned Aqueduct: "massive skeletons" and a towering tar aqueduct.
  - Sky Meadow: a violet meadow under a visible moon.
  - Several DLC stages are night versions of day stages.
  [src](https://riskofrain2.wiki.gg/wiki/Stages)
- Environment work on the newer DLC biomes covered "landscape sculpting, modular architecture, props, materials, foliage, and in-engine assembly," starting from a lead concept artist's direction [src](https://shaneschultz.artstation.com/projects/Jrda2z).

## Readability was something they patched

Hopoo's public post-launch notes treat readability as a gameplay bug:

- "Hearing loud & clear about Teleporter being hard to see." "Players are not really noticing the passive particles."
- "No one seems to notice Ice affix explosion on death."
- "Gilded Coast is unclear and unrewarding to most players."
[src](https://www.tumblr.com/hopoo)

The objective and the threats have to stand out from a heavily fogged world, and they did not at first.

## How it conveys weight and size [est]

These are our observations of the shipped game, not Hopoo statements:

1. **Huge, simple landmark forms.** Arches, spires, ribcages, and the aqueduct are many times the player's height and built from few, broad facets. They read as silhouettes through the fog. The gap between a small survivor and those forms is most of the "bigness."
2. **Aerial perspective does the depth work.** Distance fog shifts quickly toward the sky colour, so the world separates into three or four value planes. Far geometry can be crude because it is flattened into a tinted shape.
3. **Low-frequency surfaces.** Textures are mostly flat colour or soft gradients, with detail at a few scales (big rock strata, chunky moss caps, grass clumps), not noisy photo texture. Silhouette and lighting carry the information.
4. **Saturated accents against a muted world.** Emissive objectives, items, and elite affixes are the only fully saturated, high-value things on screen, and cheap deferred point lights make them glow on nearby terrain.
5. **Weight through animation.** Golems and Titans move slowly with long anticipation and big impacts. Their attacks telegraph through bright, thick geometry such as laser lines and ground decals.
6. **Outlines that separate characters from the world.** Per-object outline strength lets characters and pickups pop while terrain stays soft.

## What we take

1. **Non-PBR, ramp-lit materials.** In Babylon.js, use one custom `ShaderMaterial` or Node Material: Lambert with a per-material 1D ramp texture (two to four bands, warm-to-cool shift), an optional Phong highlight, and flat or vertex-gradient albedo. No normal maps on terrain. A ramp atlas row index is a material parameter, which mirrors Hopoo's "ramp information" channel. [est]
2. **Screen-space edge pass.** Add a post-process that runs Sobel on depth and normals, blended toward a darkened base colour, not black. An outline-strength value per object comes from a stencil bit or a second render target: strong on creatures and pickups, near zero on terrain. Phones get a cheaper depth-only edge pass, or none. [est]
3. **"Biome profile" data objects.** Each one defines: fog colours at three distances (start/mid/end, sampled from a gradient), fog density curve, sky gradient, sun and ambient colours, a colour-grade LUT, and a material theme. A region's look is one JSON profile. Night and weather are profile blends, the same trick as RoR2's night stages. [src](https://thunderstore.io/package/prodzpod/StageAesthetic/) [est]
4. **Scale rule.** Every region gets one or two hero forms at 30–200x player height (ringworld struts, fallen shadow-square fragments, giant fox-shrine statues), with few faces and readable through fog at 1–3 km. Mid-ground props are 3–10x player height. Small props are sparse and clustered, never evenly spread. [est]
5. **Saturation budget.** Terrain and buildings stay within a narrow saturation band. Full saturation and emission are reserved for: kitsunebi, shrine lights, android eyes and neon, pickups, and threat telegraphs. Attach cheap point lights only to these (Babylon clustered lights, or a fake emissive "glow-on-ground" decal on mobile). [est]
6. **Readability QA as a gate.** Following Hopoo's teleporter lesson, each objective type (shrine, camp, waystone) must be findable in a grayscale screenshot at 300 m. If it fails, add a vertical light pillar or a smoke column. [src](https://www.tumblr.com/hopoo) [est]
7. **Weighty creature animation.** Big machines get long anticipation frames, slow turns, ground decals marking impact zones, and camera shake that scales with distance. Use additive animation layers (breathing, scanning, limping) over a small set of base clips to save animation work, as Hopoo did. [src](https://kotaku.com/risk-of-rain-2-developers-discuss-the-games-shift-to-3d-1821553824)

Sources not reachable this session: Game Developer, "How moving from 2D to 3D shaped the design of Risk of Rain 2" (https://www.gamedeveloper.com/design/how-moving-from-2d-to-3d-shaped-the-design-of-i-risk-of-rain-2-i-), and the RoR2Shaders GitHub repo (https://github.com/Lawlzee/RoR2Shaders).
