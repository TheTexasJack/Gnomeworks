# Work order: Packing Line 1j, FRAGILE and HEAVY stickers (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23.  **Approved by:** (waiting on Nathan)
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
6. **The chart follows the instructions setting (Claudia's draft, from 1i's call 1).**  The "Packing rules" chart at the top of the supplies menu shows while "Show instructions" is on and hides when it is off, so players who know the rules get straight to the tiles.  The rules stay the same either way.
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

