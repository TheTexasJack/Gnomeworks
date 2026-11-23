# Work order: Packing Line 1d.1, the box label and a bold stamp (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23, from Nathan's test of draft.81.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

Two fixes from Nathan's test of 1d.  The box no longer shows a count, and a packed box looks like a plain shipped box with no contents showing.  The stamp lands bold and on top.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "We don't need the amount on the box.  I like the label as to what's in it."
- "This also means the box being shipped looks like a box being shipped and not with a weird side showing its contents."
- "The stamp is too transparent.  It should be bold and in front.  It's fine if it covers everything."

## Read first

- `CLAUDE.md`, the 1d order and its Result.
- `js/shipping.js` (the box, its label, the mark), `css/style.css` (`.box-label`, `.box-mark`), `CONFIG.shipping` (`label`, `mark`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The label shows only the item's picture.**  No count, no name.  It shows while the box is open and filled, so the player can see what went in.
3. **A closed box shows no label.**  Closing the box hides the label; opening it again shows it.  Boxes on the stack show no label.  The record for 1e keeps the item and exact count as now.
4. **The stamp is bold and in front.**  Drop `mix-blend-mode: multiply` from `.box-mark` and draw the stamp at full opacity, above everything on the box and above the stack, the tray, and the driver.  It may cover anything.  Keep its tilt.  If it reads small, raise its width in `CONFIG.shipping` (`mark`), and say the number in the Result.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1&debug=1`, both layouts, Day and Night: an open filled box (picture only), a closed unstamped box (no label), a stamped box, and the stack with two packed boxes.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change how packing works: one item per box, and a new drop replaces the old one (layer 1 orders ask for one item).
- Build a contents screen (a future enhancement, in TASKS).
- Change the menu, the board, the truck, the driver, the chain, or the door.
- Install anything.

## Done when

- An open filled box shows only the item's picture; a closed or stacked box shows none.
- The stamp is solid, on top, and easy to see in both layouts and both themes.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

