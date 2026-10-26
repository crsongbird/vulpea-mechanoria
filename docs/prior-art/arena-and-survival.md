# Prior art: The Elder Scrolls: Arena, and survival and walking games

Tags: [src](URL) means the source was opened and read for this note. [est] means our own judgment.

## The Elder Scrolls: Arena (1994)

### History

- **It began as a gladiator game.** Lead designer Vijay Lakshman and programmer Julian Jensen first designed it around "a team of gladiators that travelled around the empire and fought for cash and fame." The side quests turned out to be more fun than the arena fights, so the gladiator focus was dropped. Late in development management insisted the game ship, and Lakshman wrote the main story in about a month: "we could bolt on a story, but the questing would be fairly linear" [src](https://content1.uesp.net/wiki/General:The_Making_of_The_Elder_Scrolls_Arena).
- **Small team, little testing.** Lakshman described the team as "about eight to 10 awesome and overworked people that maybe grew to 12 at some point." Of testing he said: "most of the testing was done by me and a small team of high school interns" [src](https://content1.uesp.net/wiki/General:The_Making_of_The_Elder_Scrolls_Arena).
- **Release.** It was due Christmas 1993 and shipped in March 1994, on an engine derived from *The Terminator: Rampage*. About 3,000 copies went out at first, and it sold about 120,000 by 1996. Computer Gaming World named it RPG of the Year for 1994. Bethesda released it as freeware in 2004 [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena).

### How it was built: procedural wilderness

- **What was hand-made and what was generated.** Main towns and dungeons were designed by hand. The wilderness was procedural, which gave a continent-sized Tamriel estimated at roughly six million square kilometres [src](https://content1.uesp.net/wiki/General:The_Making_of_The_Elder_Scrolls_Arena).
- **Mixed procedural towns.** Wilderness, towns, and dungeons are all generated. Town buildings are designed pieces, but their order and names are randomised. The wilderness holds inns, farms, hamlets, and dungeons. In practice it is effectively endless, so players fast-travel between towns despite the manual's claim that you can walk between villages [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena).
- **Content scale.** There are several hundred generated dungeons, plus 17 hand-designed ones for the main quest [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena).
- **Day/night cycle.** It was one of the first games with a realistic one. At sunset shops close and people clear the streets, and monsters roam until morning [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena).

### What made it memorable

Bethesda staff recalling their favourite moments, about Arena specifically [src](https://content2.uesp.net/wiki/General:Elderscrolls.com_Archive/Most_Memorable_Elder_Scrolls_Moments):

- Todd Howard followed a river, took a boat to an island, and found a crypt with a great item: "I can go anywhere? Do anything? This. Rules."
- Emil Pagliarulo remembered first reaching the surface into a living city: "A gentle snow was falling, people were milling about."
- Ken Rolston loved "the creaking doors, squeaking rats, and long swims in flooded tunnels."

Every one of these memories is about atmosphere or freedom, none about a quest. Weather, a living town at night, sound, and the sense that the horizon is real carried the game more than the content did [est]. The cost of its scale was emptiness: generated wilderness with no authored reasons to walk it, which is the gap BotW's attraction points later filled [est].

## Survival and walking games

### The Long Dark (Hinterland, 2014 early access / 2017)

- Creative director Raphael van Lierop calls it "more like an exploration game with survival elements added." The threat is nature, not monsters, and ammunition is scarce and mainly for hunting. The design favours interesting choices over full simulation, in a stylized, painterly winter Canada [src](https://pcgamer.com/creating-a-killer-wilderness-in-the-long-dark).
- Players track calories, hunger, fatigue, and body temperature. Nights are much colder. Injuries such as frostbite and broken ribs have to be treated. Permadeath is standard in Survival mode [src](https://en.wikipedia.org/wiki/The_Long_Dark).

### Valheim (Iron Gate)

- **Food raises maximums; there is no starvation.** You digest up to three foods at once. Each raises your maximum health and stamina, and the bonus fades as the timer runs down, with the icon flashing as a warning [src](https://eip.gg/valheim/guides/how-food-health-and-stamina-work-valheim/).
- **Food is a loadout.** The Hearth & Home update sorted foods into red (health), yellow (stamina), and white (balanced). The developers' framing: building wants stamina food, fighting depends on your style, and health protects you from deadly falls [src](https://gamespot.com/articles/heres-a-sneak-peek-at-valheims-new-food-system-with-hearth-home-update/1100-6494951/).
- In short, hunger is a buff to manage, not a punishment [est].

### Subnautica (Unknown Worlds)

- Survival mode tracks health, hunger, thirst, and oxygen. Freedom mode turns off hunger and thirst. Creative mode removes all meters [src](https://en.wikipedia.org/wiki/Subnautica).
- Hunger and thirst were added after early-access feedback, and the team found they helped orient new players [src](https://en.wikipedia.org/wiki/Subnautica).
- The developers aimed for a game without lethal guns, a decision tied to the Sandy Hook shooting. There is no traditional quest structure; the design relies on intrinsic reward [src](https://en.wikipedia.org/wiki/Subnautica).
- Charlie Cleveland's GDC 2019 talk covered design pillars, "embracing player phobias," mysterious tooltips, and radio signals that add structure to a sandbox [src](https://gdconf.com/news/dive-deep-design-subnautica-gdc-2019).

### Death Stranding (Kojima Productions)

- **Walking is the puzzle.** Movement "is treated like a puzzle." Players pick routes across jagged ground while managing cargo weight [src](https://www.npr.org/transcripts/774781133).
- **How the mechanics work** [src](https://gamespot.com/articles/death-stranding-guide-tips-on-how-to-walk-in-the-w/1100-6471246/):
  - A terrain scan colours ground blue (safe), yellow (careful), or red (avoid).
  - Stamina drains faster when sprinting, on rough ground, and on slopes of roughly 45° or more.
  - A badly packed load throws Sam off balance, and you hold the shoulder buttons to steady him.
  - The early weight limit is 125 kg. A heavy load removes jumping and slows sprinting.
- **The "strand" layer.** Structures and rope placed by other players show up in your world without you ever meeting them, and "likes" carry no gameplay value. Kojima: "you can see the tracks and traces, so you can feel or think about the other people" [src](https://www.gamedeveloper.com/game-platforms/kojima-details-the-subtly-social-gameplay-of-i-death-stranding-i-).
- **Timefall** rain ages cargo and wears down player-built structures [src](https://en.wikipedia.org/wiki/Death_Stranding).

## What fits a phone-playable game [est]

- **Session length.** Phone sessions are 5–20 minutes. Meters must not punish a player who closes the app, so the simulation pauses when the app is closed and no meter can kill you in under about 3 minutes of real time.
- **Few meters.** One or two visible ones at most; touch HUDs are small. Valheim's "food raises maximums" and BotW's stamina wheel suit phones better than The Long Dark's five meters.
- **Simple input.** Traversal-as-gameplay has to work with one thumb, so balance and footing are contextual (hold to steady), not a twin-stick skill test.
- **Quiet exploration is cheap to run.** No combat AI, low draw calls. Walking-sim stretches are where the frame budget goes to vistas.

## What we take

1. **Arena-style generation with authored anchors.** The ring is generated as a deterministic seeded heightfield, in segments, with infinite variety along the spin axis. Hand-authored "named places" (main shrines, the first besieged village, the first neon city) are stamped into fixed segments. Town *pieces* are authored and their *arrangement and names* are generated, as in Arena. [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena)
2. **A day/night cycle with social rules.** Human villages bar their gates at dusk. Androids patrol neon streets at night. Wild foxes and kitsunebi appear only after dark. At night the far side of the ring is lit overhead, like a sky arch. [src](https://en.wikipedia.org/wiki/The_Elder_Scrolls:_Arena) [est]
3. **Three survival meters, Valheim-style:**
   - **Warmth.** Falls in shade, wind, rain, and altitude. Fires, shrines, and fox companions restore it.
   - **Stamina wheel.** As in BotW.
   - **Nourishment.** Up to three food slots that raise max stamina and warmth and decay gently. No starvation damage; an empty belly only lowers your maximums.
   No thirst. [src](https://eip.gg/valheim/guides/how-food-health-and-stamina-work-valheim/) [est]
4. **Modes, as in Subnautica:**
   - *Wanderer*: no meters.
   - *Pilgrim*: the default.
   - *Exile*: permadeath, no warnings.
   Ship Wanderer, because a walking sim has to be finishable by someone who only wants to walk. [src](https://en.wikipedia.org/wiki/Subnautica)
5. **Load and footing, Death Stranding-lite.** The carried weight of salvage changes your gait, removes jumping above a threshold, and increases slip on slopes over 35°. Terrain under the cursor or ahead of the player gets a subtle blue/yellow/red tint, shown only while the "fox-sense" button is held. [src](https://gamespot.com/articles/death-stranding-guide-tips-on-how-to-walk-in-the-w/1100-6471246/) [est]
6. **Asynchronous traces (optional, later).** Ropes, cairns, and offering stones left by other players appear in your world through a tiny backend, with a "bow" gesture instead of likes. [src](https://www.gamedeveloper.com/game-platforms/kojima-details-the-subtly-social-gameplay-of-i-death-stranding-i-)
7. **Radio-signal structure.** Fox-bot chirps and shrine bells act as Subnautica's radio signals: diegetic pings that point at the next authored place without quest markers. [src](https://gdconf.com/news/dive-deep-design-subnautica-gdc-2019)
8. **Atmosphere over content.** Budget sound (creaks, wind on rim walls, distant android hum), snowfall over towns, and a first-surface "reveal" moment before quest content. That is what Bethesda's veterans remembered. [src](https://content2.uesp.net/wiki/General:Elderscrolls.com_Archive/Most_Memorable_Elder_Scrolls_Moments)

Sources not reachable this session: en.uesp.net's primary copy of "The Making of Arena" (the content1 mirror was read instead), PC Gamer's "The evolution of The Elder Scrolls", and TheGamer's Arena map article.
