# Work order: Packing Line 1g, the supplies menu and the room's tips (v0.2)

**Status:** Approved
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

