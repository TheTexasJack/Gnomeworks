# Work order: Packing Line 1b.2, driver at the bench and phone scale (v0.1)

**Status:** Reviewed and closed (2026-11-22)
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

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.73**.  Still hidden: nothing shows without `?ship=1`.

**1. Bench in both layouts.**
- `CONFIG.shipping.driverSpot` is `'bench'`.  The mirrored phone `'truck'` spot and all the mirroring code from 1b.1 are removed; nothing mirrors.
- **The wide `'truck'` spot is kept**, as one config line (`spots.truck.at`).  The only code it needs is a fallback: when a layout has no spot by the chosen name, the driver goes to the bench.  So switching to `'truck'` works on desktop, and phones show the bench.

**2. Wide room.**  The truck is unchanged (`h 55, top 21.8, xTo 80.5`).  Measured from the art, the bench's top ends at x 71.4%, runs from y 58% (back) to 63.5% (front), and its legs end at y 79.4%.  The driver moved from `[68, 82]` (in front of the bench) to `[73, 79.5]`.  He now stands beside the right end, feet level with the front leg's foot, and his forearm rests on the front corner of the top.  See the elbow crop.

**The chain moved up in the wide room (my call).**  At his new spot his head sits right where the chain hung, so the handle was in front of his chest.  I raised the chain (`top` 5 to -12, same size and same `x`).  It now hangs from above the top edge of the room, as if from the ceiling, with the handle just above his cap.  The chain looks as it did, stays beside the door, and the handle is easy to reach.  If Nathan prefers, the other options are moving it to the wall right of the door frame (x about 97) or moving the driver back in front of the bench.  The tall room's chain is unchanged; the driver there is below and to the right of it.

**3. Tall room matched to the wide room.**

| Measure | Wide (reference) | Tall, matched | draft.72 tall | Change |
| --- | --- | --- | --- | --- |
| Truck height / average doorway height | 55 / 49.05 = **1.121** | 1.121 x 38.0 = **42.6%** of room height | 56% | **76%** |
| Driver height / bench height | 32 / 15.9 = **2.01** | 2.01 x 11.45 = **23.0%** of room height | 32% | **72%** |

- **How I measured:**
  - **Doorway height:** the average of the opening's left and right edge heights, from `CONFIG.shipping.layouts.<layout>.doorway`.  Wide: 41.5% and 56.6% of the room.  Tall: 33.7% and 42.3%.
  - **Bench height:** the front edge of the top to the foot of the legs, measured on the art.  Wide: 63.5% to 79.4%.  Tall: 69.3% to 80.75%.
- Nathan's 75% guess was close: the matched sizes are 76% (truck) and 72% (driver).
- **Truck (tall):** `h 42.6, top 26.2, xTo 74.0`.  Its lowest point rests on the floor line (solver: top 26.25; nothing below), and the rear-door seam is centred in the opening.
- **Driver (tall):** `h 23`, at `[87, 81.5]`.  He stands beside the bench's right end with his forearm on its top near the corner, all of him on screen.  On a 390x844 phone the driver is 153 px tall (212 in draft.72) and the truck 283 px (372).

**Checks.**
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.73).
- The 1b trip check (scratch, not committed) passes in all four layout and theme combinations.
- **Truck inside the doorway:** at most 3 pixels fall outside the outline, all within 0.42 px of its edge.
- The driver walks in and out from the bench spot in both layouts.

**Screenshots for Nathan** (in `tools/out/` on Beast, all with `?ship=1`, truck and driver in place):
- `ship-wide-day.png`
- `ship-wide-night.png`
- `ship-tall-day.png`
- `ship-tall-night.png`
- `ship-wide-day-elbow.png`: close crop of his elbow on the bench, wide Day

**Not done (per the order):** standing poses (Nathan's future option, logged in TASKS.md), anything from 1c on.


## Review (Claudia, 2026-11-22)

Pulled 50a2218 and rendered it.  In both layouts the driver now stands beside the bench's right end with his forearm on its corner, so he reads as leaning on it.  The measured phone scale (truck 76%, driver 72% of draft.72) came out right next to Nathan's 75% guess.  Raising the chain so its handle clears the driver's cap was a sound call; the chain now runs off the top of the room as if from the ceiling.

Nathan, 2026-11-22: his foot sits in the table on desktop and on the phone; the phone truck looks fine.  Nathan is leaning toward replacing all leaning poses with a standing pose (logged in TASKS.md), so no further placement order for now.
