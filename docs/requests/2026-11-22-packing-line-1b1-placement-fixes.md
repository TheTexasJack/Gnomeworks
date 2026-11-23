# Work order: Packing Line 1b.1, truck and driver placement fixes (v0.1)

**Status:** Reviewed and closed (Claudia and Nathan, 2026-11-22); follow-up in 1b.2
**Written by:** Claudia, 2026-11-22, from Nathan's review of 1b.  **Approved by:** Nathan, 2026-11-22 ("1b.1 approved").
**Model:** Opus 5.5

## Goal

Fix three things Nathan saw in 1b (draft.71): the truck sits too low, the driver leans on nothing, and both are far too small on phones.  Placement and sizes only; no new behavior.  Still hidden behind `?ship=1`.

## Nathan's review of 1b (2026-11-22, his words)

- "The truck back up, but the wheels and base are set too low.  We want that to be up a little, you can shrink the truck a little if that makes it fit."  (His crop of the wide Night room shows the bumper and tail lights hanging below the doorway's floor line.)
- "We want the drivers leaning on the truck, but we either move the chain to get more room or we make them lean on the table."
- "On mobile.  They are SUPER TINY.  the gnome and truck needs to be twice that size."

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/requests/2026-11-22-packing-line-1b-truck-and-driver.md`, its Result and review.
- `js/shipping.js` and `CONFIG.shipping` in `js/config.js` (`doorway`, `truck`, `driver`, the chain's `x`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Truck height (both layouts).**  Raise the truck so its wheels and bumper rest on the doorway's floor line (the bottom edge of the opening), with nothing hanging below it.  Shrink it a little if that is what it takes to fit the opening.
3. **Phone size (tall layout).**  Make the truck and the driver about twice their current size in the tall room.  The truck stays clipped to the doorway, so at that size the rear doors filling the opening is the expected look.
4. **The driver leans on something.**  His waiting pose leans to his right (toward the left of the screen), so whatever he leans on has to be on that side of him, at about his elbow height.  Build both of Nathan's options as a setting, `CONFIG.shipping.driverSpot`, so Nathan can pick from screenshots:
    - `'truck'`: the driver leans on the truck's rear corner in the doorway.  If the chain is in the way, move the chain to the wall right of the door frame (its `x` and `top` in config).
    - `'bench'`: the chain stays put, and the driver leans on the right end of the packing bench.
    - Do both for the wide and tall layouts.  Set the default to `'truck'`; Nathan picks after seeing the screenshots.  His walk in and out keeps working from either spot.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.72`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1`, truck and driver in place: wide Day `truck`, wide Day `bench`, tall Day `truck`, tall Day `bench`, plus a close crop of the truck's bumper on the doorway floor line (wide Night, like Nathan's crop).  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the trip's behavior or timing, the door, or anything outside the shipping view.
- Build anything from 1c on.
- Install anything.

## Done when

- The truck's wheels and bumper sit on the doorway floor line in both layouts, with nothing below it.
- On a 390px phone the truck and driver are about twice their draft.71 size.
- Both `driverSpot` options show the driver leaning on something in both layouts.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.72**.  Still hidden: nothing shows without `?ship=1`.  Trip behavior, timing, and the door are unchanged; only numbers in `CONFIG.shipping` and the driver's spot and mirror code in `js/shipping.js` changed.

**1. Truck on the floor line (both layouts).**  I measured the bottom edge of the truck picture column by column (alpha), then worked out each layout's `top` so the truck's lowest visible point touches the doorway's floor line and nothing sits below it.
- **Wide:** shrunk a little, from 60% to 55% of the room's height (`h 55, top 21.8, xTo 80.5`).  At 60% the top of the truck would have been cut off by the top of the opening.  The floor line slopes, so the rear wheel touches it on the right, and the bumper sits slightly above it, with bay floor showing beneath.
- **Tall:** `h 56, top 14.1, xTo 70.2`.  The rear-door seam is centred in the opening.

**2. Phone sizes (tall).**  Truck `h` 28 to 56 and driver `h` 16 to 32.  Measured on a 390x844 phone: the truck went from 186 to 372 px tall and the driver from 106 to 212 px, exactly twice.  At this size the rear doors fill the opening and the top of the truck is clipped by it, the look the order expected.

**3. `CONFIG.shipping.driverSpot`** (default `'truck'`).  Each layout has `driver.spots.truck` and `driver.spots.bench`, each with an `at` point (his feet).  Both spots put his forearm (measured at 4% to 20% of his width, 61% to 75% of his height above his feet) on the thing he leans on:
- **Wide `truck`:** in front of the right part of the doorway, forearm on the truck's rear bumper and tail light.  The chain is not in the way, so it stays put.
- **Wide `bench`:** forearm on the right end of the bench top.  The chain stays put and clear of him.
- **Tall `bench`:** in front of the bench's right end, forearm on its top.  All of him fits on screen.
- **Tall `truck`: needs Nathan's eye (a deviation).**  At twice the size the driver is about 40% of the room's width.  For him to lean left onto the truck, his centre would have to be at about 98% of the room width, which puts half of him off screen.  There is almost no wall right of the tall door frame, so moving the chain there doesn't help.  So this one spot has `flip: true`, which mirrors him: he stands left of the doorway and leans right, with his forearm on the truck's bumper corner.  His cap stays below the chain handle, so the chain doesn't move.  If mirroring isn't wanted, the options are: no `truck` spot on phones (use `bench` there), a smaller driver on phones, or new art leaning the other way.

His walk in and out works from every spot.  The mirror holds through the whole walk, so he never turns around mid-step.

**Checks.**
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.72).
- The 1b trip check (scratch, not committed) passes again in all four layout and theme combinations: arrive, ignored mid-trip pulls, leave, reset on leaving the view, a second trip, and nothing without `?ship=1`.
- **Truck inside the doorway:** comparing screenshots with and without the truck, at most 3 changed pixels fall outside the doorway outline, all within 0.42 px of its edge.
- Both spots walk out cleanly in both layouts.

**Screenshots for Nathan** (in `tools/out/` on Beast, all with `?ship=1`, truck and driver in place):
- `ship-wide-day-truck.png`
- `ship-wide-day-bench.png`
- `ship-tall-day-truck.png` (mirrored driver)
- `ship-tall-day-bench.png`
- `ship-wide-night-bumper.png`: close crop of the bumper on the doorway floor line, wide Night

**Docs updated:** `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/HANDOFF.md`, `docs/TASKS.md`.

