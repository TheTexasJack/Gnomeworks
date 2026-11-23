# Work order: Packing Line 1i, tags shown, peanuts and bubble wrap (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 (tag display: "Agreed" to the tile, the chart, and the open box; the slip stays clean).
**Model:** Opus 5.5

## Goal

The first half of Gnomerica's correct supplies rule: the inside of the box.  Players can see each item's packing tag, learn the rules from a chart, and put packing peanuts and bubble wrap in the open box.  Missing supplies score a ❌.  The outside stickers (FRAGILE, HEAVY) are the next order, 1j.  Still hidden behind `?ship=1`.

## The rules (DESIGNS.md, "Correct supplies: Gnomerica's rule," approved 2026-11-22)

- **Every box gets packing peanuts.**
- **A Breakable item needs bubble wrap** (and, in 1j, a FRAGILE sticker).
- **Heavy** needs nothing inside (in 1j, a HEAVY sticker).
- **Soft** has no rule; the chart tells players they never need to worry about it.
- **Extras do nothing** (bubble wrap around a sock is fine).
- One item type per box in Gnomerica, so "heavy goes in first" and "breakables on top" cannot come up yet; they wait for orders with 2 or 3 items.

## Where the player sees an item's tag (Nathan, 2026-11-23)

1. On the item's tile in the junk menu.
2. In a "Packing rules" chart at the top of the supplies menu.
3. On the open box, beside the item's picture.
- **Not on the work order slip:** reading the order stays the challenge.
- The tag icons are the approved 15b art, and they are the same pictures as the FRAGILE and HEAVY stickers: Breakable `hazard-01-fragile.png` (broken glass), Heavy `hazard-02-heavy.png` (weight), Soft `hazard-09-handle-with-care.png` (hands holding a box).

## Read first

- `CLAUDE.md`, the 1g and 1h orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Correct supplies," "One supplies menu for every tool," the box face (approved v0.3).
- `docs/art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md` rows 15 and 15b.  Art: `art-masters/packing-line/15-supplies/packing_peanuts.png` and `bubble_wrap_roll.png`; the three tag icons in `15-16-hazard-stamps/`.
- `js/shipping.js` (both menus, the open box's label, the record, scoring, the report card) and `CONFIG.shipping`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Game copies of peanuts, bubble wrap, and the three tag icons with `tools/art.py resize`, added to `docs/ASSETS.md`.
3. **Tag icons on the junk tiles.**  A small tag icon in a corner of each tagged item's tile, readable on a 390 px phone.  Untagged items show none.
4. **The "Packing rules" chart.**  The supplies menu opens with a short chart above its sections, live text in `--font`, one line per rule with its icon (draft wording, Claudia; record it in the Result):
    - (peanuts) "Every box: packing peanuts."
    - (broken glass) "Breakable: bubble wrap and a FRAGILE sticker."
    - (weight) "Heavy: a HEAVY sticker."
    - (hands) "Soft: nothing to worry about!"
5. **A Packing section** in the supplies menu, holding peanuts and bubble wrap, dragged like everything else.  Both are inside supplies: they go in an **open** box only; dropped on a closed box, the box shakes (1g's rule).  Unlimited and free (DESIGNS).  Adding one twice changes nothing.
6. **The open box shows what's inside:** the item's picture with its tag icon beside it (Nathan's spot 3), and small peanut and bubble wrap pictures once added.  A closed box shows none of this, as now.
7. **Small polish from the 1g review:** junk dropped on a closed box shakes too.
8. **The record and scoring.**  Each order's record adds which supplies went in.  New reasons in `CONFIG.shipping.score.reasons`: "No peanuts" and "No bubble wrap" (only for a Breakable item).  Each is a ❌ like the others.
9. **The report card shows the main reason and a count.**  A row with several misses shows the first, in this order: Not packed, Wrong item, No peanuts, No bubble wrap, No stamp, Wrong stamp, then "+N" for the rest (draft, Claudia; for example "No peanuts +1").  Re-check the 360 px longest-name card with a 3-digit count and "+N".
10. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and DESIGNS (built), and update `tools/smoke-test.js`: a perfect shift adds peanuts to every box and bubble wrap to Breakables; a shift with peanuts left out scores "No peanuts."  Run it.
11. **Screenshots** into `tools/out/`, both layouts, Day: the junk menu with tag icons, the supplies menu with the chart, an open Breakable box with its tag, peanuts, and bubble wrap, the shake on a closed box, and a report card with "No peanuts +1."  List them in the Result.
12. In the Result, record how long the build took.
13. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build FRAGILE or HEAVY stickers (1j), safety stickers, other boxes, or any region past Gnomerica.
- Put tags on the work order slip.
- Change the counts, the stamp, the box face, the truck, the driver, or the chain.
- Install anything.

## Done when

- Every tagged junk tile shows its icon, the supplies menu shows the chart, and an open box shows the item's tag.
- Peanuts and bubble wrap go into an open box and show there; a closed box shakes them off, and junk too.
- A missing supply scores its ❌, and a row with several misses shows the main one and "+N."
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

