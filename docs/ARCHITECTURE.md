# Architecture

## Big picture

One HTML page, eleven plain scripts, no framework, no build.  Every script adds one module to a single global object, `window.GW`, and the load order in `index.html` matters:

| Order | File | Module | Job |
| --- | --- | --- | --- |
| 1 | `js/config.js` | `GW.CONFIG`, `GW.VERSION` | All tuning data.  Items, gnomes, upgrades, odds, hats, placements, branding. |
| 1b | `js/theme.js` | `GW.theme` | Day / Night.  `img(path)` returns a picture's `_night` twin when Night is on.  An inline script in `index.html` sets the `night` class before anything draws. |
| 2 | `js/util.js` | `GW.util` | `fmt()` big-number formatting (K, M, B ... then exponent), random helpers, DOM shortcuts |
| 3 | `js/sfx.js` | `GW.sfx` | Sound effects synthesized with Web Audio, plus a few recorded samples (`assets/sfx/`) with code-made fallbacks |
| 4 | `js/state.js` | `GW.state` | Save data: `fresh()`, `load()`, `migrate()`, `save()`, `wipe()` |
| 5 | `js/economy.js` | `GW.econ` | All game math.  It reads and changes only the state object. |
| 6 | `js/gears.js` | `GW.gears` | The Machine view: SVG wall image, Mara's gear images, the hatch flap |
| 7 | `js/ui.js` | `GW.ui` | Shop, shelf, stats, crew strip, Shop Floor, floating text, toasts, squish animations |
| 7b | `js/wild.js` | `GW.wild` | Wild Magic event |
| 7c | `js/clones.js` | `GW.clones` | Clone Attack event |
| 8 | `js/main.js` | (runs once) | Loads the save, wires input, runs the game loop, shinies, pause, sound settings, autosave |

The rule that keeps this sane: **economy reports, UI draws.**  `GW.econ` changes numbers and returns an `events` object (items made, items to animate, new discoveries).  `main.js` hands those events to `GW.ui` and `GW.sfx`.

## The game loop (`main.js`)

`requestAnimationFrame` drives everything.  Each frame:

1. Work out `dt` (seconds since last frame).  If paused, push timers forward and skip the economy.  If `dt` is over 5 seconds (the tab was asleep), run the offline catch-up instead of a normal tick so thousands of items do not try to animate.
2. `econ.tick(s, dt, events)` adds gnome clicks for the elapsed time.
3. The big gear's display angle chases the logical angle, capped at 540 degrees a second so it never blurs.
4. Queued item pops drain at up to 3 a second; any extra become a "+N items" note.
5. Shinies spawn, glow gold when "hot," and expire.  Events tick: `GW.wild.tick`, `GW.clones.tick` (see [EVENTS.md](EVENTS.md)).
6. Shop Floor animations fire (`ui.animateFloor`).
7. The header updates every frame; shop, crew, stats, and shelf update every 0.25 seconds.
8. Autosave every 10 seconds, plus on tab hide and page close.

## Input and anti-cheese

- Taps come from `pointerdown` on the machine box (both views).  Events with `isTrusted === false` (scripted) are ignored.
- A token bucket caps taps at 20 a second.
- Space or Enter on the focused machine also taps, and held-key repeats are ignored.
- Shinies are claimed only by a trusted tap on the shiny itself.  No gnome or upgrade can claim one.
- A shiny is "hot" (gold) when the gear was tapped in the last 30 seconds.  Only hot shinies can be Legendary.

## Save data (`state.js`)

Stored in `localStorage` under `gnomeworks.save`, so a save belongs to one browser on one exact web address.  Moving the game to a new address starts everyone over.

```
schema, season, createdAt, savedAt
paused, view ('machine' | 'floor'), audio { fx, chatter, muted }
cogs, cogsSeen (lifetime, drives unlocks), bigAngle (0-360), itemsMade
producers { id: count }, leveled { id: level }, oneTime { id: true }
revealed { "kind:id": true }   shop rows stay visible once unlocked
items { id: count }, seen { id: true }   shelf and NEW badges
clicks { tap, tiny, tinier, warrior, stick, cloner, matryoshka, wizard }   Stats tab
bonusCogs { items, sprockets }
stats { taps, playSeconds, popupsSeen, popupsClaimed, pity, legPity, bestCps, sprockets,
        wildEvents, wildCleared, clonesSplooshed, clonesEscaped }
```

- Kept outside the save, per browser: `gnomeworks.theme` (auto, day, night) and `gnomeworks.hints` (on, off).
- `migrate()` fills any field a newer version added, so old saves never crash.
- If `season` in the save differs from `CONFIG.season`, the save is discarded and a "new season" toast shows.
- A corrupt or blocked save starts fresh with a toast.

## Economy math (`economy.js`)

| Quantity | Formula |
| --- | --- |
| Gnome cost | `baseCost * growth ^ owned` (growth 1.15) |
| Leveled upgrade cost | `baseCost * growth ^ level` |
| Clicks per item (one big-gear turn) | `max(3, 20 * 0.85 ^ ratioLevel)` |
| Global multiplier | `(1 + 0.25 * fasterGearsLevel) * (1 + 0.10 * autoPokerLevel)` |
| Tiny gnome rate | `0.5 * 2^(inventions owned of: two_hands, inv_mitts, inv_elbows, inv_steam)` each |
| Other gnome rates | `count * rate * upgradeMult * global * wizardAura` (Necromancer 4, Cloner 40, Matryoshka 260, Wizard 1,400).  `upgradeMult` comes from one-time upgrades with `mult: { producer, x }` (the Wizard's x2s). |
| Wizard aura | With "Not the Cog, But You": every other gnome type gets `+1%` per Wizard, capped at `+50%` (`wizardAura`).  The Wizard doesn't boost himself. |
| Warrior | `count * 2 swipes/sec * weapon value * global` (dagger 3 up to gnome-on-a-stick 8) |
| Gnome on a Stick bonus | `+1 click per swipe`, tracked separately as `stick` |
| Tap value | `(1 + brassKnucklesLevel) * fasterGears`, plus 5% of gnome clicks/sec with Rally Cry |
| Cogs | 1 per click, plus an item bonus of `tier.bonus * clicksPerItem` per item |
| Machine drops | Weighted by tier: Common 70, Uncommon 22, Rare 12.  Super Rare and Legendary have weight 0 (shinies only). |
| Big batches | Over 200 items at once are split by expected value instead of rolled one by one |
| Offline catch-up | `min(seconds away, 8 hours) * efficiency`, skipped entirely while paused |

**Shinies:** every 45 to 120 seconds, staying 20 seconds.  A claim rolls Legendary at 9% (hot only), Super Rare at 45%, otherwise a Lucky Sprocket worth 60 seconds of production (minimum 50 taps).  Pity: a Super Rare or better by the 6th claim, a Legendary on a hot shiny by the 25th.  Picks favor items the player does not own yet (weight 3 versus 1).

## The two views

**The Machine (`gears.js`).**  An SVG with a 1000 x 1000 viewBox.  The wall is Mara's painted machine (`assets/bg/machine_wall.webp`) with gear mounts painted in.  Four of Mara's gear images sit on those mounts: drive (8 teeth) to a compound gear (12 teeth with a 7 tooth pinion on its face) to the big gear (15 teeth).  Gear angles come from a meshing formula, so each gear's speed follows real tooth ratios, and each image has a measured `phase` so its teeth line up.  The hatch flap is the only drawn part; it swings open on each drop.

**The Shop Floor (`ui.js`, `#floor` inside the machine box).**  A CSS container with Mara's three-level workshop as the background: `floor.webp` (16:9) on wide screens and `floor_tall.webp` on screens 720px wide or less.  `CONFIG.floor.layouts` holds each layout's 12 station slots (x %, feet line %), plate placement, belt rectangle, and a sprite scale.  Sizes use container query units (`cqh`, `cqw`) so everything scales with the box.  Each owned gnome type gets its station; empty ones show HELP WANTED.  Items ride the conveyor instead of popping from the hatch.

**Squish and boing.**  Each station part is a wrapper holding the static image, the action image stacked on top (hidden), and optional extras (hat, weapon, slash).  On each beat the wrapper squashes, swaps to the action frame mid-squash (`.act` class), stretches, and settles.  Beat speed follows that gnome type's real click rate, between 2.2 and 0.45 seconds.  The warrior's weapon and the hat move between static and action positions through CSS variables.  Animations stop when paused or off the floor view.  Devices that ask for reduced motion get slower pose swaps with no squash, stretch, or shake.

## Shelf (`ui.js`)

Built once per container (the desktop side column and the phone Shelf tab), then updated in place so open groups stay open.  Groups fold open with a found/total count and a NEW pill.  Groups with `layout: 'families'` (Tiny Monsters, Number Twos) draw one row per family with a fixed column per variant, leaving gaps for missing variants.

## Sound (`sfx.js`)

Almost every sound is built from oscillators and filtered noise at play time.  Recorded samples (the clone giggle and the splash) load from `assets/sfx/` when served over http and fall back to code-made versions if they can't load or the page is opened from disk.  A compressor on the master output keeps peaks safe.  Sound unlocks on the first trusted tap (browser rule).  `navigator.audioSession.type = 'ambient'` lets game sounds mix with a player's own music on iPhones.  Rate limits: taps 12 a second, drops 4 a second, gnome chatter about 2 a second shared.  Settings (effects volume, chatter on/off, mute) live in the save.

## Responsive layout (`style.css`)

- Over 1100px: three columns (shelf, machine, shop panel), up to 1800px wide.  Both side panels are clipboards (`border-image` slices 281 / 70 / 218 on an 844 x 1080 picture; `--cb` scales them, set in `main.js`).  When the space beside the machine is at least `layout.railMinWidth` (100px), the next-item gauge and the crew move into side rails next to it.
- 721 to 1100px: two columns; the shelf moves into a Shelf tab.
- 720px and under: one column; the tall Shop Floor layout.  Everything sits on the one clipboard.
- Night theme: CSS under `.night`, plus picture swaps through `GW.theme.img()`.
- The machine box is square in Machine view and takes the floor background's aspect in Shop Floor view.
