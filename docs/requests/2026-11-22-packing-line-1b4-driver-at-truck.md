# Work order: Packing Line 1b.4, the grumpy driver waits at his truck (v0.2)

**Status:** Approved
**Written by:** Claudia, 2026-11-22.  v0.2 after the first run stopped at step 3 (see the Result below).  **Approved by:** Nathan, 2026-11-22 ("1b.4 approved").
**Model:** Opus 5.5

## Goal

Finish what 1b.3 started: the driver waits in the grumpy pose, at full size, standing in the doorway in front of his truck (Nathan, 2026-11-22: "that's where the floor space is").  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/DESIGNS.md`, "The driver's moods."
- `docs/requests/2026-11-22-packing-line-1b3-grumpy-driver.md`: its Result (the measurements and `ship-1b3-*-full-size-nearest.png`) and the review.
- `js/shipping.js` and `CONFIG.shipping`.

## The depth rule

Overlap is fine when depth is right.  Whatever the driver stands in front of, his feet must sit **lower on screen** than that thing's own floor contact (the truck's wheels, the doorway sill line), so he reads as standing in front of it, never inside it.  The 1b.2 problem was his feet sitting higher than the bench's front legs.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The waiting pose is grumpy.**  Load `assets/packing/driver_gnomerica_grumpy.webp` (made in 1b.3) as the waiting pose.  Remove `driverSpot`, the lean spots, and the unused leaning copy `assets/packing/driver_gnomerica_waiting.webp` (its master stays in `art-masters/`); update `docs/ASSETS.md`.
3. **Where he stands (v0.2, from the first run's measurements).**
    - **Wide room:** full size, feet at `[86.5, 80]`: centered on the doorway, just in front of the sill, clear of the bench, the chain, and the conveyor, in front of the truck.  (Found by the first run.)
    - **Tall room:** full size, feet at `[87.5, 84]`: in front of the bench's right end, his feet 3.3% lower than the bench's front legs, so by the depth rule he stands in front of it.  Overlapping the bench is allowed here (Nathan, 2026-11-22, option 1).  He must stay fully on screen and clear of the chain.
    - The original v0.1 text follows for the record:    In both layouts, at the 1b.2 size (2.01 times the bench height), standing in the doorway in front of his truck, his feet on the sill or the room floor just in front of it, following the depth rule.  He is drawn in front of the truck and the doorway frame.  He must not overlap the bench or the chain, and he stays fully on screen.
4. **His walk.**  He still walks in from the doorway after the truck settles, now only a short way, and walks back out before the truck leaves.  Keep the timings.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.74`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1`, truck and driver in place: wide Day, wide Night, tall Day, tall Night, plus close crops of his feet in each layout (Day).  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.  If he can't meet step 3 at full size, stop and report, as in 1b.3.

## Do not

- Build the happy reaction (1f), or anything from 1c on.
- Change the truck, the chain, or the door.
- Install anything.

## Done when

- The grumpy driver waits at full size in the doorway in front of his truck in both layouts, following the depth rule, clear of the bench and the chain.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Run 2026-11-22 by Claude Code (Opus 5.5) on Beast.  **Stopped at step 3, as the order says:** the wide room has a full-size spot that meets every rule, but the tall (phone) room does not.  I did not shrink him or change any game code, so the version stays **v0.2.0-draft.73**, nothing was stamped, and the smoke test was not run.  Steps 2 and 4 are not built either, since the game would otherwise load the grumpy pose at a spot that breaks the rules on phones.

**How I checked.**  I traced the bench, the doorway sill (the frame's floor contact, both jambs), and the conveyor from the open room art in both layouts, placed the chain from its config and real picture, then slid the grumpy driver's real silhouette (the alpha of `driver_gnomerica_grumpy.webp`, 238x400) over every feet position in steps of 0.25% at each size from 100% down.  A spot passes when he overlaps no bench, chain, or conveyor pixel, stays fully on screen, and every boot column sits lower on screen than the sill at that column (the depth rule).  His boots span almost his full width (95%), which is what blocks the tall room.

| Layout | Full size | Result |
| --- | --- | --- |
| Wide | 32% of room height, 10.7% of room width | **Fits.**  Feet `[86.5, 80]`, centered on the doorway, on the room floor just in front of the sill (the sill is at 73 to 76% under his boots).  He spans x 81.1 to 91.9% and y 48 to 80%: clear of the bench (ends at 71.4%), the chain (x 76%, ends at y 47%), and the conveyor (top 83.8%), and in front of the truck and the right jamb. |
| Tall | 23% of room height, 24.3% of room width | **Does not fit.**  The bench's right end reaches x 85.9% at y 69 to 71% (its leg runs to 84% down to y 80.7%), and the sill runs from y 63% at the left jamb to 68% at the right jamb.  To stand on screen his center can be at most x 87.85%, which puts his left boot near x 76%, inside the bench at every height from the sill down to the bench's front legs.  Closest doorway spot, feet `[87.85, 71.5]`: his left boot and legs cover the bench's right corner. |

**What would work in the tall room, for Nathan's call** (measured, not built):
- **Stand in front of the bench's right end, full size,** feet `[87.5, 84]`.  His feet sit 3.3% lower than the bench's front legs (80.7%), so by the depth rule he reads as standing in front of it, clear of the conveyor (86.8%) and the chain.  He overlaps the bench, which step 3 forbids, so it needs a yes.  This is near the 1b.2 spot (`[87, 81.5]`) moved 2.5% lower, where Nathan saw his foot in the bench.
- **Shrink him on phones only.**  Largest size with any clear spot: **70%** (16.1% of room height), feet `[91.5, 85.75]`, on the open floor right of the bench, well in front of the doorway.  Largest size with his feet within 3% of the sill (in the doorway): **55%** (12.65%), feet `[92.5, 70.5]`.  Either way phone and desktop would no longer share the driver-to-bench ratio of 2.01.
- **Let him run off the right edge.**  Clearing the bench at the doorway needs his center near x 98%, which hides about half of him.  I don't recommend it.

The wide spot can be built as is whichever tall option is picked.  His walk (step 4) would come in from `from` `[86.5, 74]` at 0.8 scale in both layouts, a short walk in the wide room (6% down) and a little longer for the tall options in front of the bench.

**Mockups** (in `tools/out/` on Beast, `?ship=1`, truck and driver in place; config changed only in the page for the picture, `tools/out/` is not committed):
- `ship-1b4-wide-day-full-size.png` and `ship-1b4-wide-day-full-size-feet.png`: wide, Day, the passing spot, with a crop of his feet.
- `ship-1b4-wide-night-full-size.png`: wide, Night, the same spot.
- `ship-1b4-tall-day-full-size-doorway.png` and `-feet.png`: tall, full size, the closest doorway spot (standing on the bench corner).
- `ship-1b4-tall-day-full-size-front-of-bench.png` and `-feet.png`: tall, full size, in front of the bench's right end.
- `ship-1b4-tall-day-70pct.png` and `-feet.png`: tall, 70%, clear of everything.
- `ship-1b4-tall-day-55pct-doorway.png` and `-feet.png`: tall, 55%, in the doorway.

**Not done (waiting on the call above):** steps 2 and 4 in the game, removing `driverSpot`, the lean spots, and the leaning copy, the `docs/ASSETS.md` update, the version bump, stamp, changelog, smoke test, and the step 6 screenshots.  The truck, chain, door, and timings are untouched.
