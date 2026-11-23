# Work order: Packing Line 1c-3, the factory rests while shipping (v0.2)

**Status:** Approved
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

