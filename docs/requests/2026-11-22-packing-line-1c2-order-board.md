# Work order: Packing Line 1c-2, three work orders on the board (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1b.5 approved and 1c-2 too").
**Model:** Opus 5.5

## Addendum (Claudia, 2026-11-23; approved by Nathan, 2026-11-23)

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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.79** (the addendum's next draft number).  Smoke test: all clear, desktop and phone.

**What was built**

- `js/shipping.js`: the order board, the slips, the randomizer, and the full-size view.  Orders are made when the trip turns `here` (the driver has finished walking in), cleared the moment the chain is pulled to close, and cleared on leaving and re-entering the view.  A layout change mid-arrival skips to `here` and makes the orders then.
- `js/config.js`: `layouts.wide.board` = [32.3, 41.1, 17.9, 12.7] and `layouts.tall.board` = [32.4, 39.2, 29.6, 8.5] ([x, y, w, h] in % of the room), plus `shipping.orders` (region, count 3, perOrder 1, keep 1, repeatItems false, the note's text) and `shipping.slip` (art paths, aspect, gap 3%, stamp 27% of the slip's width on the board and 20% open as in the mock, open size 92%, Night brightness 0.88).
- `css/style.css`: the board, the slip layout (measured from `work_order_mock_v0.1.png`, in container query units so the same markup works small and open), the brass pin and the red stripes drawn in CSS, and the open view.
- Each slip shows the parchment, red stripe bands top and bottom, the brass pin, the GRIP mark, WORK ORDER, SHIP TO with the town and the region under it, ITEM with the item's name and its picture (the game's own item icon, so Twemoji or painted art), and the region stamp lower right.  All text is live, in `--font`.

**Measurements**

- Wide board: the lower left frame's parchment runs x 31.6 to 50.9, y 40.4 to 54.5 (Night 31.9 to 50.6, 40.5 to 54.5).
- Tall board: the frame under STONKS runs x 31.8 to 69.7, y 38.6 to 48.3.  Per the addendum the board ends at 62.0.  With the truck parked (Day and Night, 390x844 phone), the rightmost slip ends at 239.4 px and the truck's left edge is at 245.7 px, so every slip and stamp corner sits clear of it.  The wide room's slips end at 669.7 px against the truck at 839.8 px.

**Art**

- Slip paper: `assets/packing/work_order_paper.webp` (566x800).  The master `blank_parchment_alpha.png` turned out to be fully opaque (its torn edges sit on solid black, `art.py check`: alpha 255 to 255), so I ran `art.py cutout --color black` into a scratch file first, then `art.py resize --height 800`.  Neither crops.
- GRIP mark: `assets/packing/grip-mark-v1.0.svg`, copied as is.
- Region stamps: `art.py sheet --keep-shape --size 256` on `14-stamps/stamps_regional.png`, 10 pictures found, edges clean (the sheet's stray specks were dropped).  Named by matching color and symbol to `docs/lore/regions.md`:

| Region | regions.md color | Sampled stamp color | Symbol | File |
| --- | --- | --- | --- | --- |
| Gnomerica | Brass gold `#d9a441` | `#e09e26` | Gear | `assets/packing/stamp_gnomerica.webp` |
| Gnohio | Field green `#7fa65a` | `#8bab4d` | Wheat | `assets/packing/stamp_gnohio.webp` |
| Gnafrica | Terracotta `#cf7346` | `#dd6e33` | Cactus | `assets/packing/stamp_gnafrica.webp` |
| Slanic | Marsh teal `#4f9a8f` | `#4b9890` | Mushroom | `assets/packing/stamp_slanic.webp` |
| Gno Dao Cradle | Mountain purple `#8a77b0` | `#937aaa` | Mountains | `assets/packing/stamp_gno_dao_cradle.webp` |
| Gni | Plum `#b0609a` | `#b25486` | Knight's helm | `assets/packing/stamp_gni.webp` |
| Slaanilok | Coral `#e0887a` | `#e37968` | Step pyramid | `assets/packing/stamp_slaanilok.webp` |
| Shen Shin | Wood brown `#9a6b3f` | `#9b6437` | Table | `assets/packing/stamp_shen_shin.webp` |
| Gnufoundland | Ice blue `#8fb3d6` | `#7ca5c5` | Mitten | `assets/packing/stamp_gnufoundland.webp` |
| Gnonmoon | Night blue `#4f5f86` | `#4b5d82` | Crescent moon | `assets/packing/stamp_gnonmoon.webp` |

- All new files are in `docs/ASSETS.md`.

**Wording:** the empty note reads "Nothing to ship yet.  Make more junk!" (Claudia's draft wording, as written), in `CONFIG.shipping.orders.emptyText`.

**Calls I made that Claudia should check**

1. **No repeated items.**  "Three different items when possible" plus "show what can be made" could also mean repeats are allowed when fewer than three items qualify.  Since 1d ships a whole pile with one drag, a repeated item could never be packed twice, so the board shows fewer slips instead.  `orders.repeatItems: true` allows repeats if that reading is wanted.
2. **The note opens full size too.**  On a 390 px phone each small slip is about 37 px wide, so the note can't be read on the board.  A tap opens it like a slip.
3. **Label "ITEM"** as the order's step 4 says (the mock says ITEMS), with the item's singular name ("Poop Knife"), since Gnomerica orders ask for 1.
4. **Night:** slips dim to 88% brightness to match the Night room's own parchment.  No night art.
5. **Keyboard:** slips open with a tap or click only, like the chain (Space and Enter for the room are already on the TASKS list).

**Screenshots** in `tools/out/` (taken with `?ship=1&debug=1`, every item set to 5,000 on the shelf for the junk saves; the debug bar covers the bottom of the phone room):

- `1c2-wide-day-board.png`: wide Day, three slips.
- `1c2-wide-day-open.png`: wide Day, one slip open.
- `1c2-tall-day-board.png`: tall Day, three slips.
- `1c2-tall-day-open.png`: tall Day, one slip open.
- `1c2-wide-night-board.png`: wide Night, three slips.
- `1c2-tall-night-board.png`: tall Night, three slips (extra, for the truck check at Night).
- `1c2-wide-day-nothing.png`: fresh save, the "nothing to ship" note on the board.
- `1c2-tall-day-nothing-open.png`: fresh save on a phone, the note opened (extra).
- `1c2-tall-day-board-zoom.png`: the phone board at 3x, to check the stamp corner at small size (extra).

**Checks run in the browser** (each screenshot run): orders come only from Gnomerica places and from items with more than 1 on the shelf; while a slip is open, a tap on the chain closes the slip and leaves the trip at `here`; reopening and pressing Escape closes it; pulling the chain to close leaves 0 orders and 0 slips; no console errors or missing files.

Nothing was installed.  Shelf counts, the truck, the driver, and the door are unchanged.

