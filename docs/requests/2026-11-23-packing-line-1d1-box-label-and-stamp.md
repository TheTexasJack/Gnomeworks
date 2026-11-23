# Work order: Packing Line 1d.1, the box label, a bold stamp, and the menu frame (v0.2)

**Status:** Draft
**Written by:** Claudia, 2026-11-23, from Nathan's test of draft.81.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

**v0.2 (2026-11-23):** step 4a, the item menu sits on the approved supply drawer frame (05a) (Nathan: "yes on the junk menu").

## Goal

Two fixes from Nathan's test of 1d.  The box no longer shows a count, and a packed box looks like a plain shipped box with no contents showing.  The stamp lands bold and on top.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "We don't need the amount on the box.  I like the label as to what's in it."
- "This also means the box being shipped looks like a box being shipped and not with a weird side showing its contents."
- On the item menu using the supply drawer frame: "yes on the junk menu."
- "The stamp is too transparent.  It should be bold and in front.  It's fine if it covers everything."

## Read first

- `CLAUDE.md`, the 1d order and its Result.
- `art-masters/packing-line/05a-supply-drawer/supply_drawer.png` (approved 2026-11-15: a plain frame, brass corners, wood sides, blank parchment inside; 1024 x 1536) and checklist row 05a.
- `js/shipping.js` (the box, its label, the mark), `css/style.css` (`.box-label`, `.box-mark`), `CONFIG.shipping` (`label`, `mark`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The label shows only the item's picture.**  No count, no name.  It shows while the box is open and filled, so the player can see what went in.
3. **A closed box shows no label.**  Closing the box hides the label; opening it again shows it.  Boxes on the stack show no label.  The record for 1e keeps the item and exact count as now.
4. **The stamp is bold and in front.**  Drop `mix-blend-mode: multiply` from `.box-mark` and draw the stamp at full opacity, above everything on the box and above the stack, the tray, and the driver.  It may cover anything.  Keep its tilt.  If it reads small, raise its width in `CONFIG.shipping` (`mark`), and say the number in the Result.
4a. **The item menu sits on the supply drawer frame (05a).**  Make a game copy with `tools/art.py resize` and add it to `docs/ASSETS.md`.  The menu is a wide strip on the phone and a tall panel on desktop, and the frame is portrait, so draw it as a nine-slice (CSS `border-image`): the brass corners keep their shape, the wood sides stretch, and the parchment fills the middle.  The tiles sit on the parchment.  Keep the menu's place, size, scrolling, and drag exactly as now.  Day and Night use the same frame (Night may dim it as the slips do).  Name the slice numbers in `CONFIG.shipping` and the Result.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1&debug=1`, both layouts, Day and Night: an open filled box (picture only), a closed unstamped box (no label), a stamped box, the stack with two packed boxes, and the item menu open on its new frame.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change how packing works: one item per box, and a new drop replaces the old one (layer 1 orders ask for one item).
- Build a contents screen (a future enhancement, in TASKS).
- Change the menu's place, size, scrolling, or drag, the board, the truck, the driver, the chain, or the door.
- Install anything.

## Done when

- An open filled box shows only the item's picture; a closed or stacked box shows none.
- The item menu shows on the 05a frame in both layouts with its corners undistorted.
- The stamp is solid, on top, and easy to see in both layouts and both themes.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

