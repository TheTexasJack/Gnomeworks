# Work order: Packing Line 1b.4, the grumpy driver waits at his truck (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1b.4 approved").
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
3. **Where he stands.**  In both layouts, at the 1b.2 size (2.01 times the bench height), standing in the doorway in front of his truck, his feet on the sill or the room floor just in front of it, following the depth rule.  He is drawn in front of the truck and the doorway frame.  He must not overlap the bench or the chain, and he stays fully on screen.
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

