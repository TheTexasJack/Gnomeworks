# Work order: Packing Line 1j, FRAGILE and HEAVY stickers (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

## Goal

The second half of Gnomerica's correct supplies rule: the outside of the box.  A box holding a Breakable item needs a FRAGILE sticker, and a box holding a Heavy item needs a HEAVY sticker.  The player drags them from the supplies menu onto the closed box, where they land in the upper left corner per the approved box face (v0.3).  A missing sticker scores a ❌.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, the 1d.2, 1g, and 1i orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Correct supplies," "The box face (approved v0.3)."
- `docs/art-style/references/box-face-mock-v0.3.png` (the mid-game box shows FRAGILE and HEAVY in the upper left) and `tools/mocks/box_face_mock.py`.
- Art: `art-masters/packing-line/15-16-hazard-stamps/hazard-01-fragile.png` and `hazard-02-heavy.png` (checklist 15a; 1i already made game copies of these as tag icons, so reuse or make sticker-size copies).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **A Stickers section** in the supplies menu, between Packing and Stamps, holding FRAGILE and HEAVY.  Both are outside marks: they go on a **closed** box only; on an open box, the box shakes.  Unlimited and free.  Adding the same sticker twice changes nothing.
3. **Where they land (box face v0.3, upper left).**  Same gap from the top and the left as the region stamp has from the top and the right, at 8.5% of the box's width, side by side with a 2% gap, FRAGILE first.  On `assets/packing/box_plain_closed.webp` (400 x 400, box drawn at x 55 to 345, y 53 to 346) that works out to, in % of the canvas: first slot center `[22.3, 36.2]`, second slot `[29.9, 36.2]`, width `6.16`, no tilt (Claudia's math from the mock's numbers).  A box with only one sticker uses the first slot.  The tops line up with the region stamp's top.  Check against the mock and say the final numbers in the Result.
4. **Solid and on top,** like the region stamp, with a softer pat than the stamp's thump (sound and numbers in config).
5. **Scoring.**  New reasons: "No FRAGILE" (a Breakable item without it) and "No HEAVY" (a Heavy item without it).  They follow the item actually in the box, as 1i's bubble wrap rule does.  Extras do nothing (a HEAVY sticker on a sock is fine).  Main-reason order: Not packed, Wrong item, No peanuts, No bubble wrap, No FRAGILE, No HEAVY, No stamp, Wrong stamp.
6. **The chart follows the instructions setting (Claudia's draft from 1i's call 1, approved by Nathan).**  The "Packing rules" chart at the top of the supplies menu shows while "Show instructions" is on and hides when it is off, so players who know the rules get straight to the tiles.  The rules stay the same either way.
7. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and DESIGNS (built), and update `tools/smoke-test.js`: a perfect shift adds FRAGILE to Breakables and HEAVY to Heavies; a Heavy box without its sticker scores "No HEAVY."  Run it.
8. **Screenshots** into `tools/out/`, both layouts, Day: the supplies menu with Stickers, a closed Breakable box with FRAGILE and the region stamp, a Heavy box with HEAVY, a close-up beside the mock's mid-game box, the supplies menu with instructions off, and a report card with "No HEAVY."  List them in the Result.
9. In the Result, record how long the build took.
10. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build safety stickers, the shipping label, other boxes, or any region past Gnomerica.
- Change the box label inside the open box (the transparent icon background is a separate future enhancement).
- Change the counts, the stamp's spot, the truck, the driver, or the chain.
- Install anything.

## Done when

- FRAGILE and HEAVY go on a closed box from the Stickers section, land in the upper left per the mock, and shake off an open box.
- A missing sticker scores its ❌ with the right main-reason order.
- With instructions off, the chart is hidden.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.90**.  Smoke test: all clear, desktop and phone.

**Build time:** about 14 minutes, from `git pull` at 12:49 to the Result at 13:03 (CST).

**What was built**

- **Art.**  `assets/packing/sticker_fragile.webp` (92x128) and `sticker_heavy.webp` (90x128) with `art.py sheet --keep-shape --size 128 --pad 0`, cropped tight the way `box_face_mock.py` crops them.  The 1i tag icons have a few transparent pixels on their edges, which would have shifted the stickers off the rule, so I made sticker copies.  ASSETS and checklist 15a updated.
- **The Stickers section** (FRAGILE, HEAVY) between Packing and Stamps.  Closed box only; an open box shakes.  A second drop changes nothing.  Since a stamped box moves to the stack, stickers go on before the stamp.
- **Final numbers** (`CONFIG.shipping.pack.stickers`): `slots: [[22.3, 31.9], [29.9, 31.9]]`, `width: 6.16`, `tilt: 0`.  The slots are **[x center, y top]**, so the tops line up with the stamp even though HEAVY is slightly taller than FRAGILE (35.0 vs 34.2 px of the 400 px canvas).  Claudia's y 36.2 is FRAGILE's center (31.9% top plus half its height comes to 36.1%); HEAVY's center comes to 36.5%.  Measured in the browser on a 400 px box: FRAGILE x 76.9 to 101.5, HEAVY x 107.3 to 131.9, both tops at 127.6; the stamp's top is 127.7.  The left gap from the face (63.7 px) is 13.2 px, against the stamp's 13.0 from the right.  A box with one sticker uses the first slot.  The close-up beside the mock lines up.
- **Solid and on top:** the sticker presses on (`pressMs` 180), the box jolts 1% (the stamp's is 2.5%), and `GW.sfx.pat()` plays a soft pat.  Its numbers are in `stickers.pat`.  A stickered closed box draws above the stack and driver like a stamped one.
- **Scoring:** "No FRAGILE" and "No HEAVY", following the item in the box, extras doing nothing, in the order the work order gives (`score.order`).  The record adds `outside`.
- **The chart** hides under `.no-hints` (CSS), so it follows the setting live; the rules stay the same.
- **Docs:** CHANGELOG, ARCHITECTURE, DESIGNS (built), ASSETS, TASKS, HANDOFF, the checklist.
- **Smoke test:** shift 1 now draws from one Breakable, one Heavy, and one Soft item that Gnomerica buys, so the stickers are tried every run (with random orders the first run drew no tagged item).  It adds FRAGILE to Breakables and HEAVY to Heavies, adds each twice, and checks each lands in the first slot.  It also checks that a HEAVY sticker on an open box shakes it and changes nothing, the sections "Packing, Stickers, Stamps", and the chart hidden with instructions off.  Shift 2 (no supplies) expects "No peanuts +3" for a Breakable and "+2" for a Heavy.  A final Toilet shift (peanuts, stamp, no HEAVY) must read "No HEAVY".  The tile-tag check now skips "???" tiles, which show no tag by design.

**Calls to check**

1. **Stickers show only on the closed box.**  On the open box the upper left is the folded rim, so I hid them there.  Reopening a stickered box keeps them, and they come back when it closes.
2. **The stickers are tiny on the bench at real size:** about 4 CSS px wide on desktop and 5 on the phone, as with the stamp (1d.2's call 1).  They read as a red and a gold speck beside the stamp.  The width is one number (`stickers.width`); the slots must move with it.
3. **The smoke test's first shift is no longer an ordinary shelf.**  Shift 2 still runs from the ordinary shelf of 40, with shift 1's piles as shipped.

**Screenshots** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844.  Orders were a Teapot (Breakable) and a Toilet (Heavy).

- Supplies menu with Stickers: `1j-<wide|tall>-day-supplies-menu.png`, and `-supplies-menu-stickers.png` scrolled to Stickers.
- Supplies menu with instructions off (no chart): `1j-<wide|tall>-day-supplies-menu-no-instructions.png`.
- Closed Breakable box with FRAGILE: `1j-<wide|tall>-day-closed-breakable-fragile.png`; with the region stamp just landed: `-breakable-fragile-stamped.png`.
- Heavy box with HEAVY: `1j-<wide|tall>-day-closed-heavy-heavy.png` and `-heavy-heavy-stamped.png`.
- Close-up beside the mock's mid-game box: `1j-wide-day-closeup-vs-mock.png` (a copy of a packed box with both stickers and the stamp, drawn at 400 CSS px inside the room, cropped to the box art), and `1j-wide-day-closeup-raw.png`.
- Report card with "No HEAVY": `1j-<wide|tall>-day-card-no-heavy.png`.

Nothing was installed.  No safety stickers, shipping label, other boxes, or regions past Gnomerica.  The open box's label, the counts, the stamp's spot, the truck, the driver, and the chain are unchanged.
