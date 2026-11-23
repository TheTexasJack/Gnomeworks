# Work order: Packing Line 1b.5, close the gap beside the truck (v0.1)

**Status:** Reviewed and closed; not accepted by Nathan (2026-11-22), replaced by 1b.6
**Written by:** Claudia, 2026-11-22, from Nathan's bug report.  **Approved by:** Nathan, 2026-11-22 ("1b.5 approved and 1c-2 too").
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

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.76**.  Still hidden: nothing shows without `?ship=1`.  Only numbers in `CONFIG.shipping.layouts.<layout>.doorway` and `.truck` changed; no code changed.

**What was wrong.**  Claudia's read was right for the tall room and half right for the wide one.
- **Tall:** the frame's gold ends at x 78.1% (Day) and 78.2% (Night), but the outline's left edge was at 79.3% (top) to 78.6% (bottom), so a strip of open-room concrete up to 1.2% wide showed between the frame and the clip.  The truck's rear corner also sat about 2% behind the clip, so the clip sliced its left trim.
- **Wide:** the outline was not the problem.  The frame's thin inner gold trim ends at 80.25 to 80.31% in both themes, and the outline sat at 80.0 to 80.1%, a hair inside the frame.  The gap came from the truck: it stopped with its rear corner at about 81.3%, leaving about 1% of concrete beside it.

**1. The clip outline.**  I measured the frame's inner edge row by row on the open twins, Day and Night.  Each left corner moved along the outline's existing top and floor edges, so the top line and the floor line are exactly where they were.
- Wide: `[80.1, 26.3]` and `[80.0, 67.8]` became `[80.3, 26.2]` and `[80.3, 68.02]` (a little inward, onto the frame's inner edge).
- Tall: `[79.3, 28.9]` and `[78.6, 62.6]` became `[78.25, 29.19]` and `[78.25, 62.5]` (outward, onto the frame's inner edge).

**2. The truck.**  Sizes unchanged (`h` 55 wide, 42.6 tall).  In the truck art the rear's left trim runs at x 16 to 19 (of 971), with hinges out to 15 and the bumper out to 1.
- Wide: `xTo` 80.5 to **79.1**.  The trim edge sits about 1 px (CSS) behind the frame, the hinges about 2.5 px.  The doorway's floor line slopes, so moving the truck left meant re-solving `top` to keep its lowest point on the line: `top` 21.8 to **20.75** (the solver gives 21.77 for the old position, matching 1b.1).
- Tall: `xTo` 74.0 to **75.4**, trim edge about 1 px behind the frame.  `top` 26.2 to **26.6** (solved the same way).

**What shows of the rear.**
- **Wide:** the whole rear shows, both red doors, both rows of hinges, and the right gold column, apart from the 1 to 2.5 px of the left corner tucked behind the frame.  Some of the truck's red side shows to its right, as before.
- **Tall:** the rear can't show whole at the 1b.2 size.  The opening is about 58 px wide on a 390px phone and the rear is about 81 px, so about three quarters of it shows.  With the left corner at the frame, as the order says, the hidden part is on the right: the right door's outer edge, its two hinges, and the right gold trim, behind the right side of the frame.  Both door seams and both handles show.  No position shows more of the rear at this size; centering it would hide a little of each side instead.

**Checks.**
- **Frame stays in front:** comparing screenshots with and without the truck (driver and chain hidden), no changed pixel falls outside the outline (allowing 2 device px for edge smoothing), in all four layout and theme combinations.
- **No gap:** row by row, just inside the outline's left edge, the truck covers every row from its roof down to its bumper in all four combinations.  The only uncovered rows are above the roof and under the bumper, which is the bay around the truck's shape, not a strip beside its rear.
- **Wheels on the floor line:** `top` re-solved as above, nothing hangs below.
- **Driver (step 4):** unchanged at `[86.5, 80]` (wide, in front of the truck) and `[87.5, 84]` (tall, in front of the bench's right end).  The floor line did not move, so the depth rule still holds: his feet at 80% and 84% sit below the doorway's floor line (at most 76.9% and 67.1%).
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.76).  Stamped 16 links.

**Screenshots** (in `tools/out/` on Beast, `?ship=1`, truck parked, 2x pixel density, no page errors):
- `ship-1b5-wide-day.png`
- `ship-1b5-tall-day.png`
- `ship-1b5-tall-night.png`
- `ship-1b5-wide-day-door-left.png` and `ship-1b5-tall-day-door-left.png`: close crops of the doorway's left edge, like Nathan's crop.
- Bonus: `ship-1b5-wide-day-door-left-before.png` and `ship-1b5-tall-day-door-left-before.png`, the same crops with the draft.75 numbers, for comparison.

**Docs updated:** `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/HANDOFF.md`, `docs/TASKS.md`, and the comments on `doorway` and `truck` in `js/config.js`.

**Not done (per the order):** truck size, the trip's timing, the door, the chain, and the driver's spot are unchanged; nothing from 1c-2 on.

## Review (Claudia, 2026-11-22)

Pulled 4034c31 and rendered close crops of both doorways.  The truck's rear-left corner now meets the frame with no concrete strip in either layout, the frame stays in front, and the wheels still sit on the floor line.  Re-deriving the height from the sloped floor and checking the method against the old values first was careful work.  On the phone about three quarters of the rear shows (the opening is narrower than the rear), with both seams and both handles visible; acceptable.

Nathan, 2026-11-22: not right.  The phone position before 1b.5 was correct, and the desktop still shows a gap.  The real problem is that the cutout is only the doorway, so the truck can't back up into the room.  Replaced by 1b.6.

