# Work order: Packing Line 1b.3, the driver waits grumpy (v0.1)

**Status:** Reviewed and closed (stopped at step 4 as the order required; superseded by 1b.4)
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1b.3 approved").
**Model:** Opus 5.5

## Goal

Drivers always show up grumpy (Nathan, 2026-11-22).  Swap the driver's waiting pose from the leaning one to the grumpy one (arms crossed, standing), and place him in open floor where he fits, touching nothing.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/DESIGNS.md`, "The driver's moods."
- `docs/requests/2026-11-22-packing-line-1b2-bench-and-phone-scale.md`, its Result, review, and Nathan's note (his foot sat in the bench).
- `js/shipping.js` and `CONFIG.shipping`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Make a game copy of `art-masters/packing-line/25-drivers/driver-gnomerica-grumpy.png` with `tools/art.py resize`, at the same height as the waiting copy, so it keeps the shared baseline.  Add it to `docs/ASSETS.md`.  Leave the waiting copy in `assets/packing/` for now (unused), and say so in the Result.
3. **The waiting pose is grumpy.**  The driver walks in and waits in the grumpy pose.  No lean: remove `driverSpot` and the lean spots, and give each layout one standing spot.
4. **Where he stands.**  In open floor between the bench and the doorway, in both layouts, with his feet on the floor and **no part of him overlapping the bench, the doorway frame, or the chain**.  Keep the sizes from 1b.2 (driver 2.01 times the bench height).  If he can't fit at that size without touching something, say so and stop before shrinking him.
5. Leave the truck, the chain, and the trip timing as they are.
6. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.74`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
7. **Screenshots** into `tools/out/` with `?ship=1`, truck and driver in place: wide Day, wide Night, tall Day, tall Night, plus close crops of his feet in each layout (Day), so the floor contact can be checked.  List them in the Result.
8. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build the happy reaction (that comes with the report card, 1f).
- Change the truck, the chain, or the door.
- Build anything from 1c on, or install anything.

## Done when

- The driver waits in the grumpy pose in both layouts, standing in open floor, touching nothing.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Run 2026-11-22 by Claude Code (Opus 5.5) on Beast.  **Stopped at step 4, as the order says:** at the 1b.2 size (driver 2.01 times the bench height) the grumpy driver can't stand between the bench and the doorway in either layout without overlapping something.  I did not shrink him.  No game code changed, so the version stays **v0.2.0-draft.73** and nothing was stamped.

**Done.**
- **Step 1:** pulled (376ff25).
- **Step 2, art:** `assets/packing/driver_gnomerica_grumpy.webp` (238x400, 35 KB) made with `tools/art.py resize --height 400` from `art-masters/packing-line/25-drivers/driver-gnomerica-grumpy.png`, the same height as the waiting copy (the masters are 723 and 724 px tall, so they share a baseline).  Added to `docs/ASSETS.md`.  The waiting copy stays in `assets/packing/` and is still what the game loads, since steps 3 and 4 are not built.

**Why he doesn't fit (how I checked).**  I traced the bench, the doorway frame (both jambs and the sill), the chain, the conveyor, the right wall trim, and the doorway opening (the truck) from the room art as polygons, then slid his real silhouette (the alpha of the grumpy copy, not a box) over every feet position in steps of 0.25% and counted overlapping pixels.  The grumpy pose is narrower than the waiting one (238 vs 278 px wide) but he still needs more room than there is.

| Layout | His size | Room he needs | Room there is | Closest full-size spot |
| --- | --- | --- | --- | --- |
| Wide | 32% of room height, 10.7% of room width | 10.7% wide | The bench ends at x 71.4% and the doorway's left jamb starts at 77.4%: a 6% gap.  Below the jamb (y 68%) the floor runs into the conveyor at 83.4%, too short for him. | Feet `[88, 70]`, standing **inside the doorway in front of the truck**, still touching the sill.  Nothing between the bench and the doorway comes close. |
| Tall | 23% of room height, 24.3% of room width | 24.3% wide | The bench ends at x 75.7%; the room's right edge is 100%.  He fits sideways, but at 23% tall his head reaches the doorway's sill and left jamb foot, and his feet can't go lower without stepping onto the conveyor (top at 87.2%). | Feet `[83.5, 87.25]`: touches the doorway frame (the jamb foot and sill near his cap) and the bench's right corner (his ear). |

**What would fit, for Nathan's call** (not built, measured only):
- **Shrink him** to the largest size with a spot touching nothing, the truck included: wide **24%** of room height (75% of the 1b.2 size, 1.51 times the bench) with feet at `[75, 83.5]`; tall **19.5%** (85%, 1.70 times the bench) with feet at `[84, 86.75]`.  Phone and desktop would then no longer match each other's driver-to-bench ratio, unless both drop to the wide room's 75%.
- **Let him overlap one thing.**  Standing in front of the bench's right end (as in 1b and 1b.1, which Nathan called "in front of it, not beside it"), or in the doorway in front of the truck.
- **Stand somewhere else,** for example left of the bench or right of the doorway.  I did not search there, since the order names the floor between the bench and the doorway.

**Mockups** (in `tools/out/` on Beast, `?ship=1`, truck and driver in place, Day; config changed only in the page for the picture):
- `ship-1b3-wide-full-size-nearest.png`: wide, full size, the closest spot (inside the doorway).
- `ship-1b3-wide-shrunk-75pct.png`: wide, shrunk to 24%, touching nothing.
- `ship-1b3-tall-full-size-nearest.png`: tall, full size, the closest spot (cap at the jamb foot, ear at the bench corner).
- `ship-1b3-tall-shrunk-85pct.png`: tall, shrunk to 19.5%, touching nothing.

**Not done (waiting on the call above):** steps 3 and 4 (the grumpy pose in the game, removing `driverSpot` and the lean spots), the version bump, stamp, changelog, smoke test, and the step 7 screenshots.  The truck, chain, door, and trip timing are untouched.

## Review (Claudia, 2026-11-22)

Correct stop.  The order's box was too tight (full size, touching nothing, between the bench and the door), and Claude Code measured that it cannot be met, made no game change, and laid out the options.  The lesson: overlap is fine in a 2D scene when depth is right (his feet lower on screen than what he stands in front of); the 1b.2 problem was his feet sitting higher than the bench's front legs.  Nathan picked option 1 (stand in the doorway in front of his truck, "that's where the floor space is").  Continued in 1b.4.

