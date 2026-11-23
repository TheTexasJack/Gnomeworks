# Work order: Packing Line 1d.2, the region stamp in the postage corner (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 (box face mock v0.3: "These are correct.  approved.").
**Model:** Opus 5.5

## Goal

The region stamp lands small and straight in the box's upper right corner, the way a post office places postage, following the approved box face layout (mock v0.3).  The stamp stays solid and on top, as 1d.1 made it.  Only the stamp moves; the shipping label and the other stickers come later.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, the 1d.1 order and its Result.
- `docs/DESIGNS.md`, Packing Line, "The box face (approved v0.3)."
- `docs/art-style/references/box-face-mock-v0.3.png`, the approved mock.  `tools/mocks/box_face_mock.py` draws it and holds the same numbers.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The rule.**  The stamp's top edge and right edge sit the same gap in from the top and right edges of the box's front face.  For the plain cardboard box, measured on the art itself (the box drawing without its empty canvas): the front face runs from 3% to 97% across and from 21% (just under the lid's edge) to 97% down; the gap is 4.5% of the box's width; the stamp is 10% of the box's width; no tilt.
3. **In the game copy's numbers.**  `assets/packing/box_plain_closed.webp` is 400 x 400 with the box drawn inside it at x 55 to 345 and y 53 to 346, so the numbers above become, in % of the canvas: `mark: [77.2, 36.4, 7.25, 0]` (center x, center y, width, tilt).  Check it with a screenshot against the mock, and adjust to match the rule if the stamp's own art makes it sit off (its size includes the perforated edge).  Say the final numbers in the Result.
4. Keep everything from 1d.1: solid, on top of everything, the thump when it lands.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1&debug=1`, both layouts, Day: a stamped box on the bench, the stack with two packed boxes, and a close-up of one stamped box beside `box-face-mock-v0.3.png`'s layer 1 box.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Add the shipping label, FRAGILE or HEAVY, safety stickers, or the rune (later layers, per DESIGNS).
- Change the menu, the label inside an open box, the board, the truck, the driver, the chain, or the door.
- Install anything.

## Done when

- A stamped box shows a small, straight region stamp in its upper right corner, the same gap from the top and the right, matching the mock in both layouts.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.83**.  Smoke test: all clear, desktop and phone (packing check included).

**What was built**

- **Steps 2 and 3.**  `CONFIG.shipping.pack.mark` is now **`[77.2, 36.4, 7.25, 0]`** (was `[60, 52, 44, -14]`), the order's numbers unchanged.  I checked the stamp art first: every region stamp's game copy is cropped tight (206 to 208 x 256, no empty edge), so its size already includes the perforated edge and no adjustment was needed.  In the browser the stamp's layout box lands at x 293.9 to 323.3 and y 127.5 to 163.3 of the 400 x 400 canvas; the rule gives 294.3 to 323.3 and 127.6 to 163.5, so the gap from the top and from the right both come out at 13 px of the canvas (4.5% of the 290 px box).  The comment above `mark` in `js/config.js` records the rule and the measurements.
- **Step 4.**  Unchanged from 1d.1: solid, `.is-stamped` on top, the drop, and the thump.  The landing animation now turns 0 degrees, since it reads the tilt from `mark`.
- **Step 5.**  `GW.VERSION` 0.2.0-draft.83, stamped, CHANGELOG entry, smoke test all clear.  Docs: HANDOFF, TASKS, ARCHITECTURE.

**Calls I made that Claudia should check**

1. **The stamp is very small on screen at the game's real box size.**  The bench box is about 64 CSS px wide on a 1400 x 900 desktop and about 80 on a 390 px phone, so the stamp is about 5 to 6 CSS px wide there (10 to 12 device px on a 2x screen): a small gold square in the corner, the gear inside it not readable.  That matches the rule and Nathan's "Tiny stickers are fine," and it is smaller than the mock's "about phone size" thumbnail (110 px box).  If Nathan wants it to read, the stamp's width is one number (`mark[2]`); the center must move with it to keep the gap.
2. **The close-up screenshots** are a copy of the stamped box drawn at 260 CSS px inside the room (so the real CSS places the stamp), cropped to the box art and set beside the mock's layer 1 box.

**Screenshots** in `tools/out/` (`?ship=1&debug=1`, Day, 2x; not committed, `tools/out/` is ignored; the debug bar covers the bottom of the phone room):

- `1d2-<wide|tall>-day-stamped.png`: the stamp just landed on the box on the bench.
- `1d2-<wide|tall>-day-two-packed.png`: two packed boxes on the stack, the third box open on the bench.
- `1d2-<wide|tall>-day-closeup-vs-mock.png`: one stamped box beside `box-face-mock-v0.3.png`'s layer 1 box.
- `1d2-<wide|tall>-day-closeup-raw.png`: the close-up box as drawn in the room, before cropping.

Nothing was installed.  The label, the menu, the board, the truck, the driver, the chain, and the door are unchanged.
