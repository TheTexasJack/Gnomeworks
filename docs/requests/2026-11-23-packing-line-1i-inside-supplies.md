# Work order: Packing Line 1i, tags shown, peanuts and bubble wrap (v0.1)

**Status:** Done
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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.89**.  Smoke test: all clear, desktop and phone (run twice; the second run's no-supplies shift drew a Bowl and read "No peanuts +1").

**Build time:** about 14 minutes, from `git pull` at 12:31 to the Result at 12:45 (CST).

**What was built**

- **Art.**  `assets/packing/supply_peanuts.webp` (256x256) and `supply_bubble_wrap.webp` (384x256) with `art.py resize --width`, whole canvas; `tag_breakable.webp` (70x96), `tag_heavy.webp` and `tag_soft.webp` (64x96) with `art.py resize --height 96`.  Added to `docs/ASSETS.md`, and the checklist's rows 15 and 15b note they are in the game.
- **Tag icons on the junk tiles.**  A 24 px tag in each tagged tile's top right corner, clear of the item's picture on a 390 px phone; untagged and unknown ("???") tiles show none.
- **The "Packing rules" chart** at the top of the supplies menu, live text in `--font` on a light parchment panel, one line per rule with its icon.  Wording exactly Claudia's draft: "Every box: packing peanuts." / "Breakable: bubble wrap and a FRAGILE sticker." / "Heavy: a HEAVY sticker." / "Soft: nothing to worry about!"  Title "Packing rules".  All in `CONFIG.shipping.pack.chart`.
- **The Packing section** (Packing Peanuts, Bubble Wrap) sits above Stamps, in the order a box is packed.  Dragged like everything else; open box only; a second drop changes nothing; a new item dropped in keeps the supplies already there.
- **The open box** shows the item's picture with its tag beside it on the label, and the peanuts and bubble wrap as small pictures sitting in the box's opening.  A closed box shows none of it.
- **Junk dropped on a closed box shakes it** (the 1g polish), as do peanuts and bubble wrap.
- **Record and scoring.**  Each record adds `inside` (`['peanuts', 'bubble']`, in menu order).  New reasons "No peanuts" and "No bubble wrap"; each a ❌ like the others.
- **Report card:** the main reason, in the order Not packed, Wrong item, No peanuts, No bubble wrap, No stamp, Wrong stamp (`score.order`), then " +N" (`score.more`).  The row's screen-reader label still lists every reason.
- **Docs:** CHANGELOG, ARCHITECTURE, DESIGNS (built), ASSETS, TASKS, HANDOFF, the production checklist.
- **Smoke test:** shift 1 is perfect (peanuts in every box, bubble wrap around Breakables, peanuts added twice, junk and bubble wrap dropped on a closed box leave it unchanged and the junk shakes it); shift 2 packs no supplies and every row must read "No peanuts", plus " +1" for a Breakable, with the Stonks moving accordingly.  It also checks that every tagged tile has its icon and no untagged one does, the chart's 4 lines, the sections "Packing, Stamps", and that a closed box shows nothing inside.

**Calls to check**

1. **"No bubble wrap" follows the item in the box,** not the ordered one.  It only differs when the item is wrong too, and then "Wrong item" is the main reason anyway.
2. **On the phone the chart fills most of the open supplies menu,** so the Packing and Stamps tiles are a short scroll below it (`1i-tall-day-supplies-menu.png`).  On desktop the Packing tiles show under the chart and Stamps needs a scroll.  If that's too much scrolling for every stamp, the chart could collapse to one line after the first trip, or the menu could open scrolled to the tiles; neither was built.
3. **Supplies stay in a box when a different item replaces the first,** since the box itself was not emptied.
4. **The longest card line at 360 px** with a 3-digit count and "+N": "Grit Spit and Fellers" / "150 × Fire Extinguisher" / "No bubble wrap +1" (and "Wrong item +3", "No peanuts +2").  Every line on one line, nothing cut; the reasons fit at full size.

**Screenshots** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900, `tall` is 390 x 844.  The shelf held only Breakables while the orders were made, so the first order is a Breakable.  The debug bar is hidden.

- Junk menu with tag icons: `1i-<wide|tall>-day-junk-menu.png`, and `-junk-menu-breakable.png` scrolled to a Breakable.
- Supplies menu with the chart: `1i-<wide|tall>-day-supplies-menu.png`.
- Open Breakable box with its tag, peanuts, and bubble wrap: `1i-<wide|tall>-day-open-breakable-box.png`, with `-zoom` crops.
- The shake, peanuts dropped on a closed box, caught mid-shake: `1i-<wide|tall>-day-shake-closed-box.png`.
- Report card with "No peanuts +1": `1i-<wide|tall>-day-card.png`.
- 360 px long-name card: `1i-360-day-long-card.png`.

Nothing was installed.  No FRAGILE or HEAVY stickers, no tags on the slip, and the counts, stamp, box face, truck, driver, and chain are unchanged.
