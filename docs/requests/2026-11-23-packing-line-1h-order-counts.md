# Work order: Packing Line 1h, orders ask for a count (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("I agree with your assessment...  Deduct it").
**Model:** Opus 5.5

## Goal

Each work order asks for a believable count of its item, set by the item's packing tag: Cogbottom orders 500 Toilet Paper, a town orders 2 Toilets.  The player fills it the same way as now: one drag puts exactly the ordered count in the box.  Shipping takes only that count off the shelf.  Today one drag ships the whole pile down to the display copy, which empties the shelf in one shift and leaves the next shift nothing to ship (Nathan's test of draft.87).  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "No location would logically order 1.4 billion razors, but 125 would be fine.  Heavy items are 1 or 2, soft are up to 500."
- "The numbers simply tell the story.  Cogbottom ordering 500 toilet paper tells a story more than just 'toilet paper.'"
- "The same process fills the work order."  No number picker.
- "Deduct it, and that will lead into the supply and demand much later."

## Read first

- `CLAUDE.md`, the 1c-2, 1d, and 1e orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Correct supplies: Gnomerica's rule" (the item tag table, approved 2026-11-22) and "Purchase orders and the order board."
- `js/shipping.js` (the randomizer, packing, the record, the hand-off) and `CONFIG.shipping.orders`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Item tags.**  Add each junk item's packing tag to `CONFIG.items` (`pack: 'heavy' | 'breakable' | 'soft'`, untagged items get none) exactly as the approved table in DESIGNS.md lists them.  Nothing shows the tags yet; the supplies rules come later.
3. **The count.**  When an order is made, pick its count from the friendly numbers for the item's tag (`CONFIG.shipping.orders.counts`), so orders read like real orders:
    - Heavy: 1, 2
    - Breakable: 2, 3, 4, 6, 10, 12, 24
    - No tag: 5, 10, 12, 20, 24, 25, 50, 75, 100, 125, 150
    - Soft: 25, 50, 100, 144, 200, 250, 300, 500
4. **Never more than the shelf can spare.**  Only numbers up to the shelf count minus the display copy can be picked.  If none of the tag's numbers fit, the count is everything the shelf can spare (always at least 1, since an item needs more than 1 on the shelf to be ordered at all).
5. **Show the count** on the slip (small and full size: "500 × Toilet Paper" under ITEM, or the clearest fit in the approved layout) and on the report card row.  Re-check the longest-name case from 1e.1 with a 3-digit count on a 360 px phone.
6. **Packing.**  The same drag fills the order: the box takes the ordered count of whatever item is dropped in (a wrong item is taken at the same count, or everything the shelf can spare if it has fewer).  The record keeps the item and that count.  The menu tiles still show the shelf counts.
7. **Shipping deducts the count only.**  On hand-off, each shipped box takes its recorded count off the shelf, never below the display copy.  Remove the whole-pile shipping.  Update the DESIGNS line "How much of a pile one package ships" to the new rule.
8. Every number in `js/config.js` (`perOrder` becomes the counts table).  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md`, and update `tools/smoke-test.js`: a shift ships exactly the ordered counts, and a second shift right after can still be filled.  Run it.
9. **Screenshots** into `tools/out/`, both layouts, Day: the board with counts, a full-size slip, the report card with counts, the shelf before and after a shift, and the 360 px longest-name card with a 3-digit count.  List them in the Result.
10. In the Result, record how long the build took.
11. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Show item tags, or build peanuts, bubble wrap, FRAGILE, HEAVY, or any supplies rule.
- Add a number picker, or score by count (a right item at the ordered count is right).
- Change the menus, the stamp, the box face, the truck, the driver, or the chain.
- Install anything.

## Done when

- Every order shows a count that fits its item's tag and the shelf.
- One drag packs exactly that count, and shipping removes exactly that count.
- Two shifts in a row can both be filled from an ordinary shelf.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)


Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.88**.  Smoke test: all clear, desktop and phone.

**Build time:** about 17 minutes, from `git pull` at 12:05 to the Result at 12:22 (CST).  About 5 of those went to the slip layout (below).

**What was built**

- **Item tags.**  The 38 tagged junk items carry `pack: 'heavy' | 'breakable' | 'soft'` in `CONFIG.items`, exactly as the DESIGNS.md table lists them (13 Heavy, 12 Breakable, 13 Soft); the other junk items and the Tiny Monsters, Number Twos, and Treasures have none.  Nothing shows them.
- **The count.**  `CONFIG.shipping.orders.perOrder` is now `orders.counts`, the four lists from this order (`''` is the no-tag list).  When an order is made, `pickCount()` picks at random from the tag's numbers no larger than the shelf count less the display copy; if none fit, the count is everything the shelf can spare.  The count is `order.qty`.
- **Shown** on the slip's ITEM line and on the report card's item line as "500 × Toilet Paper" (`orders.countSign`), and in both screen-reader labels.  The menu tiles still show shelf counts.
- **Packing.**  The same drag: the box takes the active order's count of the dropped item, right or wrong, or what the shelf can spare if it has fewer.  What earlier stamped boxes on the same trip already hold of that item is not counted as spare, so packing the same wrong item twice never records more than the shelf has.  The record keeps the item and that count.
- **Shipping.**  Each shipped box takes its recorded count off the shelf, never below the display copy.  `applyShift()` already deducted the recorded count; the whole-pile part lived in packing (`fillBox`), which is what changed.
- **Docs:** DESIGNS.md ("How much of a pile one package ships" is settled to the new rule, plus "How many", "Packing", and "Rotation" in "Purchase orders and the order board"), ARCHITECTURE.md, TASKS.md, HANDOFF.md, CHANGELOG.md.
- **Smoke test:** two shifts in a row from a shelf of 40 of every junk item.  Each checks that every count fits its tag and the shelf, the slips and card rows show the counts, the record holds exactly the ordered counts, the menu tiles show shelf counts, and shipping takes exactly those counts off (and nothing else).  Then a shelf of only 3 Toilet Paper gets one order for 2.

**A call to check: the slip's ITEM line.**  "500 × Toilet Paper" plus the picture does not fit on one line on any slip, so it wraps.  With plain wrapping the picture ended up alone on the second line, and keeping the picture with the last word split the name ("500 × Toilet / Paper").  So the item's name and picture stay together, and when they need the room the count sits on the line above ("500 ×" / "Toilet Paper 🧻"); short ones stay on one line ("2 × Toilet 🚽").  The worst case, "Fire Extinguisher" with its picture on a 360 px phone, was wider than the line and ran under the stamp, so the line now shrinks to fit (`CONFIG.shipping.slip.itemFont`, 6.4 down to a 4.6 cqw floor, measured the same way as the report card).  It needed about 5.6.  Before 1h, a long name could already wrap with its picture alone on the next line; that cannot happen now.

**Measured.**  Report card at 360 px with the 1e.1 longest-name rows and 3-digit counts ("Grit Spit and Fellers", "150 × Fire Extinguisher", "Wrong item, Wrong stamp"): every line on one line, nothing cut.  "150 × Fire Extinguisher" shrinks a little to fit.  The slip at 360 px with "150 × Fire Extinguisher" at Pulley Junction (the item renamed in the test page only, since no Gnomerica place buys that item and a Heavy item never gets a 3-digit count): clear of the stamp.

**Screenshots** in `tools/out/` (`?ship=1`, Day, 2x, not committed since `tools/out/` is ignored).  Shelf for these: 600 Toilet Paper, 600 Control Knobs, 600 Cardboard Boxes, 10 Toilets, the rest 0, with the random pick held high, so the board reads 500 Toilet Paper and 2 Toilets to Cogbottom, and 150 Control Knobs to Pulley Junction.  The debug button bar is hidden in the screenshots; on the phone it sits over the belt.

- Board: `1h-desktop-day-board.png`, `1h-phone-day-board.png`, with `-board-zoom.png` crops
- Full-size slip: `1h-desktop-day-slip-open.png`, `1h-phone-day-slip-open.png`
- Report card: `1h-desktop-day-card.png`, `1h-phone-day-card.png`, with `-card-zoom.png` crops
- Shelf before and after the shift (the Bathroom group): `1h-desktop-day-shelf-before.png` and `-shelf-after.png`, the same for `1h-phone-day-`.  Toilet Paper 600 to 100, Toilet 10 to 8.
- 360 px: `1h-360-day-long-card.png` (and `-zoom`), `1h-360-day-slip-open-long.png`, `1h-360-day-slip-open.png`, `1h-360-day-board.png`

Nothing was installed.  The menus, the stamp, the box face, the truck, the driver, the chain, and scoring are unchanged (a right item at any count is right).
