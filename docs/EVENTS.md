# Events and mini-games

Everything that interrupts the normal tap-and-idle loop.  Built events are first, then planned ones.  Planned designs with their agreed decisions live in [DESIGNS.md](DESIGNS.md).

## Rules every event follows

- **Real hands only.**  Anything that pays out checks `event.isTrusted`, so scripted clicks never count.
- **Pause freezes it.**  `main.js` calls each event's `shift(ms)` while paused, pushing every timer forward.
- **Reduced motion.**  Devices that ask for less motion get still, glowing versions (no spinning, bobbing, or pulsing).
- **No gambling.**  Events pay out for doing something, never for betting.
- **Rewards scale with income.**  Payouts are "N seconds of your production," so they matter at 100 cogs or 100 billion.
- **Off-screen fairness.**  An event never takes something from a player who couldn't see it.
- **Debug buttons.**  `?debug=1` adds buttons to fire each event on demand.

## Built

### Shinies (since v0.1)

| | |
| --- | --- |
| What | A glowing button appears on the side of the machine every 45 to 120 seconds and stays 20 seconds.  Tap it for a Super Rare, a Legendary, or a Lucky Sprocket (60 seconds of production). |
| Hot shinies | Gold if you tapped the gear in the last 30 seconds.  Only gold ones can be Legendary. |
| Pity | Super Rare or better by the 6th claim; a Legendary on a hot shiny by the 25th. |
| Code | `main.js` (`spawnPopup`, `claim`, `updatePopups`), `economy.js` (`claimPopup`) |
| Config | `popup` |

### Wild Magic (draft.38, timer fixed in draft.40)

| | |
| --- | --- |
| Unlock | The **Wild Magic** upgrade (10 Wizards, 100M cogs). |
| What | The Wizards lose control.  6 junk items spin around the machine inside purple swirls.  Tap each one to break it (8 seconds of production each).  One target is a golden cog swirl worth 3x.  Catch all 6 for a 30-second bonus.  The spell fizzles on its own after 9 seconds. |
| How often | Every 2 to 5 minutes, sooner with more Wizards (40 Wizards halves it), never more than once every 45 seconds. |
| Styles | `wild.style` in config: `spin` (bare emoji), `whoosh` (swirls), `storm` (swirls plus the golden bonus; the live one).  `?wild=spin` previews another. |
| Code | `js/wild.js`, hooked from `main.js` (`GW.wild.tick`, `GW.wild.shift`) |
| Art | `assets/crew/fx_swirl`, `fx_swirl_cogs` (bonus), `fx_swirl_debris` (catch burst) |
| Stats | `wildEvents`, `wildCleared` |

### Clone Attack (draft.40, tuned through draft.50)

| | |
| --- | --- |
| Unlock | Owning at least one Gnome Cloner. |
| What | **4 escaped clones** (different mutants each time, from 10 kinds) mill around the Shop Floor ground level, each snatches a junk item off the belt (10% of your stack of it) with Alex's "heh heh," then they run the stairs Donkey Kong style for 2 laps and escape. |
| Saving your junk | Press and hold a clone (he switches to the pinched-by-a-hand pose; the cursor hides so the hand is your cursor), drag him over the vat behind the Cloner, and let go on the glowing **Drop here!** arrow.  SPLOOSH: the junk comes back plus 10 seconds of production.  Drop him anywhere else and he falls to the level below and keeps running. |
| Instructions | A big sign across the top of the floor for the whole attack; it turns green while you hold a clone.  Can be hidden in Info > Look > "Show event instructions" (the arrow stays). |
| Machine view | A "Clones are loose in the shop!" sign pops up; tap it to jump to the floor.  Ignore it for 20 seconds and the clones give up and take nothing.  While you're on the Machine view the clones freeze. |
| How often | Every 2.5 to 6 minutes, sooner with more Cloners (40 halves it), never more than once a minute. |
| Code | `js/clones.js`; the vat is a second part of the Cloner station in `floor.stations` |
| Config | `clones` (count, steal share, lap count, speeds, run paths for both floor layouts, timing) |
| Art | `assets/clones/clone_<kind>_run/_grab/_held`, `vat_full`, `vat_sploosh`, `clone_warning` |
| Sound | `assets/sfx/hehe.mp3` (recorded by Alex), `assets/sfx/sploosh.mp3` (Pixabay), with code-made fallbacks |
| Stats | `clonesSplooshed`, `clonesEscaped` |
| Playtest notes | Jarrett (2026-11-02): didn't know to drop them in the vat and felt overwhelmed for a second (good).  Fixed with the big sign and arrow.  2 clones felt too easy; now 4. |

### The Megagnome and the hunt (draft.54)

| | |
| --- | --- |
| Get him | Shop row "The Megagnome," always listed: needs a Gnome Cloner, the Wild Magic upgrade, and 100B cogs.  One per player. |
| What he does | Events only.  Spends food automatically: eats a loose clone every 2.5 seconds after a 4-second "first crack" for the player; eats clones before they escape if you're on the Machine view; catches regular Wild Magic items (never the golden one).  Shinies stay hands-only. |
| Food | Max 5.  Shown on his shop icon, crew badge, and Stats. |
| The hunt | Tap his row (every 10 minutes).  Drag down to pull back, sideways to aim (slingshot style), release to fire.  5 bolts, 5 seconds of production per shot, you can miss.  Prey runs back and forth and speeds up after each kill.  Kill = 1 food.  The hunt ends when bolts run out or he's full. |
| Boss | Banana Monster, 15% of spawns: 3 hits, 3 food, bananas everywhere.  Drops the Banana Monster Trophy (Legendary, `huntOnly`) 25% of the time, guaranteed by the 4th boss kill. |
| Code | `js/mega.js` (shop row, food, poses, helping), `js/hunt.js` (the mini-game); hooks in `clones.js` (`megaHelp`) and `wild.js` (`megaAt`) |
| Config | `mega` |
| Art | `assets/mega/` (poses, crossbow, bolt, 8 prey, banana boss, Day and Night backdrops), `icons/icon_mega`, `treasures/banana_trophy` |
| Sound | `assets/sfx/yum.mp3`, `burp.mp3` (Nathan); Alex's `ugh_high1/2/3`, `ugh_short`, `ugh_splat` (random kills), `ugh_low` (boss hit), `ugh_choke` (boss death), `ugh_disgust` (spare); the twang is code-made |
| Save | `s.mega { owned, food, nextHunt, hunts, kills, bossKills, trophyPity, eaten }`; `stats.megaHelps`, `stats.huntShots` |

## Planned (not built)

| Event | Status | Where |
| --- | --- | --- |
| Packing Line (drag shelf items into boxes) | Ideas gathered, math pass first | [DESIGNS.md](DESIGNS.md#packing-line) |
| Gear Jam, Pest Patrol, Alchemy Cauldron, Bard Jam, Expeditions | Proposal ideas only | Jarrett's proposal doc |
