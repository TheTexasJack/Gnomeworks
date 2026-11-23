# Work order: Packing Line 1b.1, truck and driver placement fixes (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22, from Nathan's review of 1b.  **Approved by:** (waiting on Nathan)
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

