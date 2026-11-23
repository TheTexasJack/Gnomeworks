# Work order: Packing Line 1d, pack and stamp (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23, for the Wednesday demo cut (HANDOFF.md).  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

The player packs each work order: tap the conveyor to open the item menu, drag the ordered item into a cardboard box on the bench, close the box, and stamp it with the region stamp.  A packed box moves aside and the next order's box appears.  Nothing ships yet and the shelf does not change (hand-off is 1e).  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md`.
- `docs/HANDOFF.md`, "Wednesday demo target."
- `docs/DESIGNS.md`, Packing Line: "Purchase orders and the order board" (Packing, Rotation), "The room (Nathan's sketch)" (the conveyor opens the item menu), and "Decided" (stamps are color plus symbol).
- The 1c-2 order and its Result (the slips, the order data, the stamp files).
- Art: `art-masters/packing-line/10-13-boxes/box_plain_open.png` and `box_plain_closed.png` (approved pair, same canvas).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Game copies of the plain box, open and closed, with `tools/art.py resize` (same size, so they swap without a jump).  Add them to `docs/ASSETS.md`.
3. **The active order.**  Orders are packed one at a time, left to right.  The slip being packed gets a small highlight on the board; packed slips get a check mark.  The box on the bench belongs to the active order.
4. **The box.**  An open cardboard box sits on the packing bench (its place and size per layout in `CONFIG.shipping.layouts.<layout>.box`).
5. **The item menu.**  A trusted tap on the painted conveyor opens a menu of junk items, styled like the game's shelf tiles (emoji, name, count).  Items with more than 1 on the shelf can be dragged; items at 1 or 0 show greyed out.  It closes with a tap outside it or Escape.  Make it scroll and readable on a 390px phone.
6. **Packing.**  Drag a tile from the menu onto the open box: the box takes that item (the whole pile, down to the display copy, per DESIGNS.md) and shows a small label with the item's emoji and the count it will ship.  One item per box (Gnomerica orders ask for one).  Dropping a different item replaces the first.  The menu stays open so the player can change their mind; dragging works with a mouse and a finger.
7. **Close and stamp.**  A tap on a filled open box closes it (swap to the closed picture).  Then a small stamp tray beside the box shows the region stamps the player has (layer 1: Gnomerica's only).  Tap the stamp to stamp the closed box: the stamp lands on the box with a short thump.  A tap on a closed, unstamped box opens it again.
8. **Done with a box.**  A stamped box slides to a stack by the truck's rear, and the next order's empty box appears.  When all orders are packed, no new box appears.
9. **Record, don't ship.**  Keep, for each order: the item packed, its count at packing time, and the stamp used.  Nothing is saved, the shelf does not change, and closing the door clears it all (1e will use this record).
10. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
11. **Screenshots** into `tools/out/` with `?ship=1&debug=1` and plenty of junk, both layouts, Day: the menu open, an item in the box, the box closed and stamped, and two boxes packed with the third in progress.  List them in the Result.
12. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Ship anything or change shelf counts, save data, or Stonks.
- Build the supplies rules, the other box types, APPROVED or DENIED, the report card, or the hand-off (1e).
- Change the truck, driver, chain, or door.
- Install anything.

## Done when

- In both layouts, each of the three orders can be packed: item in, box closed, stamped, set aside, next box out.
- The item menu works with mouse and finger, and greys out items at 1 or 0.
- The record of what was packed exists for 1e.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

