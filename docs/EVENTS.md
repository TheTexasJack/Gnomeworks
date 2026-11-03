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

## Planned (not built)

| Event | Status | Where |
| --- | --- | --- |
| Megagnome hunt (crossbow mini-game feeding the Megagnome) | Design agreed, numbers not set | [DESIGNS.md](DESIGNS.md#megagnome-and-the-hunt) |
| Packing Line (drag shelf items into boxes) | Ideas gathered, math pass first | [DESIGNS.md](DESIGNS.md#packing-line) |
| Gear Jam, Pest Patrol, Alchemy Cauldron, Bard Jam, Expeditions | Proposal ideas only | Jarrett's proposal doc |
