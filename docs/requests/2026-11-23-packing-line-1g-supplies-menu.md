# Work order: Packing Line 1g, the supplies menu and the room's tips (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("your rules are ok"; the belt cue and the tips setting are his additions).

**v0.2 (2026-11-23):** step 6a, the belt glows at the start with a note, and every cue in the room follows the instructions setting (Nathan).
**Model:** Opus 5.5

## Goal

The first step of the supplies layer.  The computer on the left desk becomes the button for a supplies menu, on the same 05a frame as the item menu.  In layer 1 it holds only the region stamp, and the small stamp tray beside the box goes away.  Later steps fill the same menu with stickers, packing supplies, sprays, and gifts.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "As this grows, there won't be any room so opening the same type of menu as the supplies, but filled with all the stamps, idols, sprays, etc, is the direction."
- "The conveyor is the button for the junk menu.  The computer can be the button for the stamps/supplies menu."
- "Make the conveyor belt glow at the very start and small note to click it to fill the box.  The pull the chain and click the belt should be tied to the instructions in the menu so they can be turned off with the others."

## Rules (Claudia's drafts, approved by Nathan 2026-11-23)

- **One gesture for both menus:** drag from a menu onto the box, as with junk items.  A tap on a menu tile does nothing but show it is picked up.
- **Inside or outside:** an open box takes junk and, later, inside supplies (peanuts, bubble wrap, trackers, gifts).  A closed box takes outside marks (the region stamp now; FRAGILE, HEAVY, safety stickers, and sprays later).  Dropping an outside mark on an open box, or an inside supply on a closed one, does nothing but give the box a small shake.
- **The cue:** while the box on the bench is closed and has no stamp, the computer's screen glows softly, the same way the chain glows when the shift is ready.  Reduced motion: the glow without any pulse.

## Read first

- `CLAUDE.md`, the 1d, 1d.1, 1d.2, and 1f orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "One supplies menu for every tool," "Two buttons in the room," "The box face (approved v0.3)."
- `js/shipping.js` (the item menu, the drag, the stamp tray, the mark), `css/style.css`, `CONFIG.shipping`.
- The room art: the computer sits on the desk at the left in both layouts (roughly x 12 to 21% and y 46 to 58% of the wide room, and x 6 to 20% and y 53 to 61% of the tall room; measure the real outline).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The button.**  An invisible tap area over the painted computer (its outline per layout in `CONFIG.shipping.layouts.<layout>.computer`), like the conveyor's.  A trusted tap opens the supplies menu.  It works whenever the room is showing, as the conveyor does.
3. **The menu.**  Built the same way as the item menu: the same place, size, 05a frame, scrolling, and finger and mouse drag.  Only one menu is open at a time; opening one closes the other.  Sections with headings like the item menu's groups; layer 1 shows one section, **Stamps**, holding the region stamps the player has (`CONFIG.shipping.pack.stamps`: Gnomerica's only).  Empty sections are not shown.
4. **Stamping.**  Dragging the stamp onto a closed, unstamped box stamps it exactly as tapping the tray did: the same spot (1d.2), solid, on top, the thump, then the box sets aside and the next box comes out.  A tap outside the menu, or Escape, closes it.
5. **The wrong side.**  A stamp dropped on an open box does nothing, and the box gives a small shake (numbers in config).
6. **The cue** on the computer screen, per the draft rules above.
6a. **The room's tips (Nathan).**
    - **The belt:** at the start of each trip, once the first empty box is on the bench, the conveyor glows and a small brass tag beside it reads "Tap the belt to fill the box!"  (Draft wording, Claudia; record it in the Result.)  Both go away the first time the player opens the item menu on that trip.
    - **One switch for every tip:** the belt's glow and tag, the computer's glow, and the chain's glow and "Pull to ship!" tag all follow the existing instructions setting (`#hintsOn`, saved as `gnomeworks.hints`, the `no-hints` class).  With it off, none of them show; the room still works the same.
    - Its label grows to cover them: "Show instructions (the big signs during events, and the Packing Line's tips)."  (Draft wording, Claudia.)
    - Reduced motion: glows without any pulse or sway, as now.
7. **Remove the stamp tray** and its config, CSS, and code.  Nothing else about the box changes.
8. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and `docs/DESIGNS.md` (the menu is built), and update `tools/smoke-test.js` so its packing run stamps by dragging from the supplies menu.  Run it.
9. **Screenshots** into `tools/out/`, both layouts, Day: the belt glowing with its tag at the start of a trip, the room with instructions turned off, the computer glowing beside a closed box, the supplies menu open, a stamp mid-drag over the box, the stamped box, and the shake on an open box.  List them in the Result.
10. In the Result, record how long the build took.
11. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Add stickers, supplies, sprays, gifts, item tags, or any new rule (later steps).
- Change the item menu's behavior, the board, scoring, the truck, the driver, the chain, or the door.
- Install anything.

## Done when

- In both layouts, a tap on the computer opens the supplies menu on the 05a frame, and dragging the stamp onto a closed box stamps it as before.
- The belt glows with its tag at the start of a trip, and turning instructions off hides every tip in the room (belt, computer, chain).
- The tray is gone, the computer glows while a closed box waits for its stamp, and an open box shakes off a stamp.
- The smoke test passes, packing with both menus, and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.87**.  Smoke test: all clear, desktop and phone.

**What was built**

- **Step 2, the button.**  `.ship-computer`, an invisible tap area over the painted monitor and keyboard, measured from the room art: wide x 12.3 to 21.4%, y 46.4 to 60% (the order's estimate was close); tall x 4.9 to 20.3%, y 48.1 to 56.2% (higher than the order's estimate of y 53 to 61, which landed on the desk top).  In `CONFIG.shipping.layouts.<layout>.computer.hit`.  A trusted tap opens the supplies menu whenever the room shows, as the conveyor does.
- **Step 3, the menu.**  The item menu's code now builds both menus (`buildMenu(kind)`): the same place, size, 05a frame, scrolling, and finger and mouse drag.  Opening one closes the other.  A tap on the other menu's button switches straight to it (the tap-outside handler lets the two buttons through); a tap on the open menu's own button closes it, as a tap on the conveyor did before.  Layer 1 shows one section, **Stamps**, with Gnomerica's stamp; empty sections are skipped (`pack.supplies.sections`).
- **Step 4, stamping.**  Dragging the stamp onto a closed box calls the same `stampBox()` the tray used, so the spot, the solid mark, the thump, the set-aside, and the next box are unchanged.  The box glows as a drop target only when the drop would work.  A tap outside the menu, or Escape, closes it.  A pressed tile lifts slightly (`is-held`) to show it is picked up; a tap with no drag does nothing else.
- **Step 5, the wrong side.**  A stamp dropped on an open box gives it a shake: 3 swings of 4% of its width over 420 ms (`pack.shake`).
- **Step 6, the computer's cue.**  The screen glass glows while the box on the bench is closed and unstamped.
- **Step 6a, the tips.**  At the start of each trip, once the first empty box is on the bench, the belt glows and a brass tag left of the box reads **"Tap the belt to fill the box!"** (Claudia's draft wording, unchanged).  Both go away the first time the item menu opens on that trip.  The belt and screen glows are the room art again, cut to the belt's and the glass's outlines, brightened, with the chain's gold glow, breathing over 1.6 s (`tips.pulseMs`).  Every tip (belt glow and tag, screen glow, chain glow and sway, "Pull to ship!") carries `.ship-tip` and is hidden by the `no-hints` class; with instructions off the room plays the same.  The label reads "Show instructions (the big signs during events, and the Packing Line's tips)" (Claudia's draft wording).  Reduced motion: the glows hold steady at 90%, and the chain stays as before (glow, no sway).
- **Step 7.**  The stamp tray, its config (`layouts.<layout>.tray`), its CSS, and its code are gone.  Nothing else about the box changed.
- **Step 8.**  Every word and number is in `js/config.js` (`pack.menuLabel`, `pack.supplies`, `pack.shake`, `tips`, and the `belt`, `beltTag`, and `computer` entries per layout).  `GW.VERSION` 0.2.0-draft.87, stamped, CHANGELOG entry, ARCHITECTURE, DESIGNS, TASKS, and HANDOFF updated.  The smoke test's packing run now checks the belt tip at the start and its hiding with instructions off, a stamp dropped on an open box leaving it open, the conveyor switching straight from the supplies menu, the belt tip going away once the item menu opens, the computer glowing beside a closed box, a tap on the stamp tile doing nothing, and every order stamped by dragging from the supplies menu.

**Calls to check**

1. **The setting's label** changes only while the Packing Line shows (`?ship=1` or `shipping.enabled`).  For everyone else it keeps the old wording, so the label does not name a feature players cannot see yet.  The label's text now sits in a `<span id="hintsLabel">` in `index.html`; the new wording is in `CONFIG.shipping.tips.setting`.
2. **Junk dropped on a closed box** still does nothing, with no shake.  The rules give the shake to an outside mark on an open box and to an inside *supply* on a closed one; junk is not a supply, and the order says not to change the item menu's behavior.  One line in `menuUp()` if Nathan wants junk to shake too.
3. **Reduced motion and the shake:** one small swing (1.5%) in place of no motion, so a tester with reduced motion on still sees the stamp was refused.
4. **In the wide room the open menu covers the conveyor's left half**, as the item menu always has.  The belt's right part (x 51 to 84%) stays tappable, so the switch works from either menu.  The menu covers the computer in the wide room too, so going from the item menu to the supplies menu there takes a tap outside first (or Escape), then the computer.  On the phone both buttons stay in view.
5. **The pressed-tile lift (`is-held`)** applies to both menus, since the rule covers both; it is the only change a player could see in the item menu.

**Screenshots** in `tools/out/` (`?ship=1`, Day, 2x; not committed).  `wide` is 1400 x 900, `tall` is 390 x 844.  The glow shots were taken with reduced motion so the glow is caught steady.

- `1g-<wide|tall>-day-belt-tip.png`: the belt glowing with its tag at the start of a trip.
- `1g-<wide|tall>-day-instructions-off.png`: the same moment with instructions off.
- `1g-<wide|tall>-day-computer-glow.png`: the computer glowing beside a closed box.
- `1g-<wide|tall>-day-supplies-menu.png`: the supplies menu open.
- `1g-<wide|tall>-day-stamp-drag.png`: the stamp mid-drag over the box (full page).
- `1g-<wide|tall>-day-stamped.png`: the stamped box.
- `1g-<wide|tall>-day-shake-open-box.png`: a stamp dropped on an open box, caught mid-shake.

**Build time:** about 10 minutes of wall clock, from reading this order (11:43 CST) to the final smoke test (11:53 CST); the commit follows.  The exact time Claude Code reports appears in Nathan's terminal at the end of the session.

Nothing was installed.  The item menu's behavior (apart from the pressed-tile lift), the board, scoring, the truck, the driver, the chain, and the door are unchanged.

