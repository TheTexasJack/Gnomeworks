# Work order: Packing Line 1c-3, the factory rests while shipping (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-23, from Nathan's direction the same day.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

## Goal

While the player is in the Shipping view, the factory is out of sight and out of mind: no item pops, no shinies, no Wild Magic, no Clone Attack, no hunt, no producer or special pop-ups of any kind.  The room holds only the Packing Line.  Nathan: "all factory work should stop when in the shipping lane, just as if a person is away.  The screen will fill up too much for what they are focused on."  Still hidden behind `?ship=1`.

## Away, option A (Nathan, 2026-11-23)

Time in the room counts as time away: the room is silent, and when the player leaves it the gnomes are credited through the **existing** offline catch-up (`E.offline()`), with its usual cap and efficiency.  Nathan: "that was the intent, no additional coding than what we have right now."  So reuse what the game already has, and add no new switch, note, or system.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md` (the game loop, offline catch-up, the shipping room).
- `docs/EVENTS.md`, "Rules every event follows" (pause freezes it; off-screen fairness).
- `js/main.js` (`frame()`, the paused branch, the `dt > 5` catch-up branch, the shiny pop-up timers), `js/wild.js`, `js/clones.js`, `js/hunt.js`, `js/mega.js`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Resting.**  The factory rests while `s.view` is `'shipping'`.  While resting, each frame:
    - Skip the economy tick and every event tick (Wild Magic, Clone Attack, the hunt, the Megagnome's helping).
    - Push every event timer forward, the same way the pause branch does (`shift(ms)`, the shiny's `expires` and `nextPopupAt`), so nothing spawns, expires, or comes due in the room, and nothing fires in a rush on the way out.
    - No hunt can start.
3. **Anything already running** when the player enters the room (a shiny on screen, a Clone Attack, Wild Magic, a hunt) freezes and hides, and carries on where it left off when they return to the Machine or the Shop Floor.  The player loses nothing for walking into the room (EVENTS.md, off-screen fairness).
4. **Credit on leaving.**  Count the seconds spent resting.  When the player leaves the room, pass them once to the existing `E.offline()` and mark the shelf dirty, as the `dt > 5` catch-up branch already does.  No new toast (the shelf flash shows it).
    - Time in the room must be credited exactly once, including when the page closes or reloads in the room.  The autosave keeps running in the room, so make sure the save's away-time math neither loses those seconds nor counts them twice.  Say how in the Result.
    - If the pause button is on, nothing is owed, as now.
5. **Future producers too.**  The rest covers every producer and event, present and future: anything new that ticks, pops up, or alerts checks the same rest rule.  Put it in one place (a single `resting` check in `main.js`) so a new producer cannot miss it, and add the rule to `docs/EVENTS.md` and `docs/ARCHITECTURE.md`.
6. **Factory sounds.**  Gnome chatter and machine sounds stay quiet in the room.  Shipping sounds are untouched.  (Claudia's draft; say in the Result what was playing before.)
7. Remove the now-unneeded line that drops hatch pops in the shipping room, if resting makes it dead.
8. Every number in `js/config.js`.
9. Add a check to `tools/smoke-test.js`: in the Shipping view, cogs and items do not change over a few seconds and no event starts; on leaving, the credit lands once.
10. Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` (the game loop and the shipping room) and `docs/EVENTS.md` (a new rule: the factory rests in the Shipping view), run `node tools/smoke-test.js`.
11. **Proof** into `tools/out/` with `?ship=1&debug=1`: a screenshot of the room after firing each debug event button from the Machine and then switching to Shipping (nothing shows), and the shelf after leaving.  List them in the Result.
12. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change what happens on the Machine or Shop Floor views, or what the pause button does.
- Change the truck, driver, chain, door, or the order board.
- Install anything.

## Done when

- In the Shipping view nothing from the factory appears, counts hold still, and no event starts or expires.
- An event that was running resumes untouched after the player leaves the room.
- Time in the room is paid once on leaving, through the existing catch-up.
- The smoke test passes and the proof exists.

## Result (filled in by Claude Code)

Built by Claude Code on Beast, 2026-11-23, as **v0.2.0-draft.80**.  Smoke test passes.

**What changed**

- `js/main.js`: one `resting()` rule (true while `s.view` is `'shipping'`), also exposed as `GW.game.resting()`.  While resting, `frame()` takes the pause branch: the shiny's `expires` and `nextPopupAt`, `GW.wild.shift()`, and `GW.clones.shift()` are pushed forward, and the economy tick, Wild Magic, Clone Attack, the hunt, and the Megagnome's helping (which only runs inside those ticks) are skipped.  Shinies cannot spawn, and queued item pops are dropped (the items are already on the shelf).  Time played still counts in the room, since packing is playing.
- `GW.wild.start`, `GW.clones.trigger`, and `GW.hunt.open` also refuse while resting, so neither a debug button nor the Megagnome's shop row can start anything in the room.
- `css/style.css`: the `resting` class on `body` hides `#rareSlot` (shinies and Wild Magic), `#edgeFlash`, the Clone Attack warning, the strike and break signs, and an open hunt, with `visibility: hidden` and paused animations.  An event running on entry is untouched and shows again on return; its timers resume where they stopped.  Entering the room also clears a toast already showing.
- **Credit (step 4).**  `restCheck()` runs on every view change and pause toggle.  Entering the room unpaused starts a wall-clock count (`restSince = Date.now()`); leaving it pays the seconds once through `E.offline()` and marks the shelf dirty, then saves.  No toast.
- **Exactly once, with the autosave and reloads.**  `GW.state.save()` writes `savedAt = Date.now() - unpaid rest seconds` (from `GW.game.restOwed()`).  So every save made in the room, by the autosave, tab hide, or page close, leaves the unpaid seconds inside the away time.  A reload in the room pays them through the existing welcome-back catch-up, and the count restarts from the load.  After leaving, nothing is owed, so the next save writes plain `Date.now()` and nothing is paid twice.  If the page crashes after leaving and before a save, the stored save is from before the payment and still holds the seconds as away time, so they are paid once on the next load.  The count runs on the wall clock, so time with the tab asleep in the room is counted too (and the `dt > 5` catch-up never runs in the room).
- **Pause.**  Pausing in the room pays what is owed so far, then nothing is owed while paused; unpausing in the room starts a new count.  Reason: the load path skips the catch-up while paused, so seconds held over a paused reload would be lost.  This means cogs move once, at the moment the pause button is pressed in the room.
- Line 7: the line that dropped hatch pops in the shipping room is gone; the resting branch drops the queue instead.
- No new numbers, so nothing new in `js/config.js`.
- `tools/smoke-test.js` (desktop): fires Wild Magic on the Machine, enters Shipping, fires the debug shiny and Clones there, waits 10.5 seconds (longer than Wild Magic lasts), and checks that gnome clicks, cogs, and items did not change, no shiny or Clone Attack appeared, and Wild Magic is hidden.  On leaving it checks the payment is within 20% of rate times seconds, that Wild Magic is still running, that nothing is owed, and that no second payment follows.  Then it reloads in the room after 6 seconds and checks the welcome-back pays once and leaving pays nothing more.  Last run: 20,556 clicks/s, 10.5 s in the room paid 218,551 clicks; a 6.5 s reload paid 124,035 (the page load itself is about 0.4 s).
- Docs: ARCHITECTURE.md (the game loop, a new "factory rests" paragraph, the shipping room), EVENTS.md (the rule now names the code), HANDOFF.md, TASKS.md, CHANGELOG.md.

**Sounds (step 6).**  Before, in the room: the item drop sound played for every hatch pop (the economy kept ticking and `drainPops` played `SFX.drop` even though the pop was hidden), plus the shiny chime, the Wild Magic sound, the clone "hehe," and the Megagnome's yum and burp when those fired.  Gnome chatter already played only on the Shop Floor.  There is no machine hum.  Now all of them stay quiet in the room, because nothing that plays them runs.  Shipping sounds (the chain click) are unchanged.

**Things to know (honest pushback)**

- `E.offline()` pays nothing under 5 seconds (its existing minimum), so a quick hop into the room and back, under 5 seconds, earns nothing for those seconds.  That follows "no additional coding," but it is a small loss for players who flick through the views.  A one-line fix later would be to let a short rest roll into the next one or to pay it with a normal tick.
- The Megagnome's hunt cooldown runs on the wall clock (`s.mega.nextHunt`), the same as when the player is truly away or paused, so it keeps counting down in the room.  The hunt cannot open in the room; it is ready on return if the time is up.  The other event timers are pushed forward as asked.
- The break sign's countdown (Taking a Break) also runs on the wall clock while hidden.
- A toast already showing on entry is cleared, which includes a welcome-back toast when the page loads straight into the room.

**Proof** (`tools/out/`, desktop 1400 x 900, `?debug=1&ship=1`, not committed since `tools/out/` is ignored).  For each debug event, three shots: on the Machine after firing it, in Shipping (nothing shows), and back on the Machine (it carries on):

- `1c3-popup-1-machine.png`, `1c3-popup-2-room.png`, `1c3-popup-3-back.png`
- `1c3-wild-spin-1-machine.png`, `-2-room.png`, `-3-back.png`
- `1c3-wild-whoosh-1-machine.png`, `-2-room.png`, `-3-back.png`
- `1c3-wild-storm-1-machine.png`, `-2-room.png`, `-3-back.png`
- `1c3-clones-1-machine.png`, `-2-room.png`, `-3-back.png`
- `1c3-mega-hunt-1-machine.png`, `-2-room.png`, `-3-back.png` (the Mega button, then a tap on the Megagnome's shop row to open the hunt)
- `1c3-shelf-after-leaving.png`: back on the Machine after 8 seconds in the room; "Made" jumped from 64.7K to 117K as the time was paid.
