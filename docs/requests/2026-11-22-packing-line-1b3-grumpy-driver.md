# Work order: Packing Line 1b.3, the driver waits grumpy (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22.  **Approved by:** (waiting on Nathan)
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

