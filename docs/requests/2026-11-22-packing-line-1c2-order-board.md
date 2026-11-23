# Work order: Packing Line 1c-2, three work orders on the board (v0.2)

**Status:** Approved
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1b.5 approved and 1c-2 too").
**Model:** Opus 5.5

## Addendum (Claudia, 2026-11-23; waiting on Nathan's OK)

This order was written at draft.75.  Two things changed under it:

1. **Version.**  In step 7, bump `GW.VERSION` to the next draft number (the game is at draft.78), in place of `0.2.0-draft.76`.
2. **The phone board.**  Since 1b.7 the parked truck covers the lower right corner of the tall room's order board: the truck's left edge is at 63.7% of the room's width and the painted frame runs to about 72%.  The truck's placement is approved and does not move.  So the tall `board` rectangle ends left of the truck (about 62%), and all three slips, their stamp corners included, sit fully clear of it.  Check with the truck parked, Day and Night.  The wide room is not affected.

## Goal

When Gnomerica's driver arrives, three work orders appear pinned on the order board, each from a real Gnomerica town asking for one junk item the player has.  Tapping a slip opens it full size to read.  Nothing is packed or stamped yet.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md`.
- `docs/DESIGNS.md`, Packing Line: "A shift on the Packing Line" (steps 2 and 4), "Purchase orders and the order board," and "Reading a slip."
- The checklist rows 04 (order board: the lower parchment frame painted in the room), 06 (work order), 14 (region stamps), and 23 (GRIP mark), in `docs/art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md`.
- `art-masters/packing-line/06-work-order/`: `blank_parchment_alpha.png` is the slip paper; `work_order_mock_v0.1.png` and `board_zoom_v0.1.png` are the approved layout (Nathan, 2026-11-22).
- `js/destinations.js` (1c-1) and `js/shipping.js`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**
    - The slip paper: a game copy of `06-work-order/blank_parchment_alpha.png` with `tools/art.py resize` (no crop).
    - The GRIP mark: copy `23-grip-logo/grip-mark-v1.0.svg` into `assets/packing/` as is (it is already a small vector).
    - The region stamps: cut `14-stamps/stamps_regional.png` into one file per region with `tools/art.py sheet`.  **Name each by matching its color and symbol to `docs/lore/regions.md`,** not by position, and list the match in the Result (region, color, symbol, file) so Claudia can check it.  Layer 1 uses only Gnomerica's, but cut all ten.
    - Add every new file to `docs/ASSETS.md`.
3. **The board.**  The lower parchment frame painted on the back wall is the order board: in the wide room the lower left frame, in the tall room the frame under the STONKS screen.  Its rectangle for each layout lives in `CONFIG.shipping.layouts.<layout>.board`.  Three slips sit in it side by side, each pinned with a small brass pin drawn in code.
4. **A slip** follows the approved mock: the parchment, red stripe bands top and bottom, the GRIP mark, "WORK ORDER", "SHIP TO" with the town name and the region name under it, "ITEM" with the item's name and its emoji, and the region stamp in the lower right corner.  All text is live, in the game's font (`--font`), drawn over the paper (HTML and CSS, no text baked into images).
5. **Small and full size.**  On the board the slips are small; the stamp corner must still be easy to see.  A trusted tap on a slip opens it full size over the room; a tap anywhere, or Escape, closes it.  While a slip is open, the chain and other taps in the room do nothing.
6. **The randomizer** (all numbers in `CONFIG.shipping.orders`):
    - When the driver finishes walking in, make three orders.  Each picks a random Gnomerica place from `GW.DESTINATIONS`, then one item from that place's `buys` that the player has more than 1 of on the shelf (the last one is the display copy and never ships).
    - Gnomerica orders ask for exactly 1 item (Nathan: first tier).
    - Three different items when possible.  The same town may appear twice.
    - If a place has no eligible item, try another place.  If fewer than three orders can be made, show what can be made; if none, show one slip-sized note on the board, "Nothing to ship yet.  Make more junk!"  (Draft wording, Claudia; record it in the Result.)
    - Orders last for this trip only.  They are not saved, and closing the door clears them.  Opening again makes new ones.
7. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.76`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
8. **Screenshots** into `tools/out/` with `?ship=1&debug=1` and a save with plenty of junk: wide Day with three slips on the board, one slip open full size (wide Day), tall Day with three slips, tall Day with one open, wide Night with three slips, and a fresh save showing the "nothing to ship" note.  List them in the Result.
9. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build stamping, packing, the drawer, boxes, the item menu, APPROVED or DENIED, the report card, or Stonks.
- Change the shelf counts (nothing ships yet), the truck, the driver, or the door.
- Use files from any `not-for-game/` folder, or install anything.

## Done when

- With `?ship=1`, every trip shows up to three Gnomerica work orders on the board in both layouts, each a real Gnomerica town asking for one item the player has more than 1 of.
- Tapping a slip opens it full size; tapping again or Escape closes it.
- Closing the door clears the orders.
- The stamp match is listed in the Result.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

