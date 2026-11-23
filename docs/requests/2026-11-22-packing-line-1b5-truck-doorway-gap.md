# Work order: Packing Line 1b.5, close the gap beside the truck (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22, from Nathan's bug report.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

Fix a visual bug in the parked truck.  Placement and clipping only.  Still hidden behind `?ship=1`.

## Nathan's report (2026-11-22, his words)

"We have a visual bug.  The back of the truck is cut off too much.  notice the gap between the truck and the wall."  His crop (phone, draft.74 or .75) shows the truck's rear cut off by a straight vertical line well inside the doorway, with a strip of bare concrete between that cut and the left side of the door frame.

## Likely cause (Claudia, from the config)

- The doorway clip outline's left edge was "nudged slightly inward" in 1b (see its Result), so the clip sits inside the frame's inner edge and the concrete between them shows.
- In the tall room the truck's left edge stops at `xTo: 74.0` while the doorway's left edge is about 79, so the clip slices off the truck's rear left side.
- The wide room may have the same strip; check it too.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- The Results of `2026-11-22-packing-line-1b-truck-and-driver.md` (how the doorway outline was fitted) and `2026-11-22-packing-line-1b1-placement-fixes.md`.
- `js/shipping.js` and `CONFIG.shipping.layouts.<layout>.doorway` and `.truck`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The clip outline.**  In both layouts, move the doorway outline's left edge out to the inner edge of the door frame, so no bare concrete shows between the frame and the truck.  The frame must still stay in front of the truck (the outline must not reach past the frame's inner edge).
3. **The truck.**  In both layouts, place the truck so its rear (the red doors and their gold trim) shows whole, with its rear left corner tucked just behind the frame's inner edge, and no gap.  Keep the sizes from 1b.1 and 1b.2, and the wheels on the floor line.  If the whole rear can't show at that size, keep as much as possible and say what is hidden.
4. **Check the driver** still stands as built in 1b.4 (desktop in front of the truck, phone in front of the bench) and the depth rule still holds.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1`, truck parked: wide Day, tall Day, tall Night, plus close crops of the doorway's left edge in both layouts, like Nathan's crop.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the truck's size, the trip's timing, the door, the chain, or the driver's spot.
- Build anything from 1c-2 on, or install anything.

## Done when

- No bare concrete shows between the door frame and the truck in either layout, and the frame stays in front of the truck.
- The truck's rear shows whole (or as much as possible, explained).
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

