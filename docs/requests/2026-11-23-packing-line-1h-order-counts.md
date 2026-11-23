# Work order: Packing Line 1h, orders ask for a count (v0.1)

**Status:** Approved
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

