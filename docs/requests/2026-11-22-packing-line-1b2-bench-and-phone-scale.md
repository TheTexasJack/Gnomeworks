# Work order: Packing Line 1b.2, driver at the bench and phone scale (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-22, from Nathan's review of 1b.1.  **Approved by:** Nathan, 2026-11-22 ("1b.2 approved").
**Model:** Opus 5.5

## Goal

Settle where the driver waits (at the bench, in both layouts) and fix the phone scale so the tall room matches the wide room's proportions.  Placement and sizes only.  Still hidden behind `?ship=1`.

## Nathan's review of 1b.1 (2026-11-22, his words)

- "On desktop, the truck is now the right size.  That looks good."
- "I like him next to the table.  If we move him over to the right a little it will put his elbow on the table and will look like he's leaning on it.  right now he's infront of it and not beside it."
- "On phone, the truck does need to be smaller.  I'm not sure the exact size, but we want to duplicate the same ration on desktop.  75%?  I'm guessing on this.  If we do the same to the driver, he can then also lean onto the table."
- Future option, not this order: "we remove all leaning images and replace with a standing pose, solving the leaning issue all together."

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/requests/2026-11-22-packing-line-1b1-placement-fixes.md` and its Result.
- `js/shipping.js` and `CONFIG.shipping` in `js/config.js`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Bench in both layouts.**  Set `CONFIG.shipping.driverSpot` to `'bench'`.  Remove the mirrored phone `'truck'` spot and the mirroring code from 1b.1 (Nathan chose the bench, so nothing mirrors).  Keep the wide `'truck'` spot in config only if it costs nothing; say which in the Result.
3. **Wide room.**  Leave the truck as it is (Nathan: the right size).  Move the driver right until he stands **beside** the bench's right end with his elbow resting on its top, so he reads as leaning on it.  He should no longer stand in front of the bench.
4. **Tall room: match the wide room's proportions.**  Nathan guessed about 75% of the draft.72 phone size; use that as a guide and set the real number by matching the wide room:
    - **Truck:** in the wide room, measure the truck's height as a share of the doorway's height.  Size the tall room's truck to the same share of its doorway, still resting on the floor line.  Report both shares and the resulting size compared with draft.72.
    - **Driver:** in the wide room, measure the driver's height as a share of the bench's height (or the room's floor-to-ceiling, whichever is clearer).  Size the tall room's driver to the same share, then place him beside the bench's right end with his elbow on it, the same as the wide room.  Report the numbers.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.73`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1`, truck and driver in place: wide Day, wide Night, tall Day, tall Night, plus a close crop of the driver's elbow on the bench (wide Day).  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the wide truck's size or position, the trip's timing, or the door.
- Mirror the driver.
- Build anything from 1c on.
- Install anything.

## Done when

- In both layouts the driver stands beside the bench's right end with his elbow on it.
- The tall room's truck and driver match the wide room's proportions, with the measured numbers in the Result.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

