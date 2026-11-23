# Work order: Packing Line 1d.2, the region stamp in the postage corner (v0.1)

**Status:** Approved
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

