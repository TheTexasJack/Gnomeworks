# Work order: Packing Line 1b, Gnomerica's truck and driver arrive (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

When the door opens, Gnomerica's truck slides in from the right and backs up to the doorway, framed by it, and its driver walks into the room and waits.  When the door closes, they leave.  Still hidden behind `?ship=1`.  Nothing ships yet.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, and `docs/ARCHITECTURE.md`.
- `docs/requests/2026-11-22-packing-line-1a-room-and-door.md` (what 1a built, its Result and review) and `js/shipping.js`.
- `docs/DESIGNS.md`, Packing Line, "A shift on the Packing Line" steps 1 and 2.
- `docs/art-style/PACKING-LINE-ASSETS-v0.3.md` row 24 (trucks): three-quarter view, rear doors facing the room, slides in from the right, framed by the angled doorway.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  With `tools/art.py`, make WebP game copies in `assets/packing/` of `art-masters/packing-line/24-trucks/truck-gnomerica.png` and `art-masters/packing-line/25-drivers/driver-gnomerica-waiting.png`.  Keep the driver's canvas as is (all three of his poses share one baseline, and the happy and grumpy poses come later).  Size them for the wide room; the tall room scales them.  Add both to `docs/ASSETS.md`.
3. **The doorway.**  The truck shows only inside the doorway, behind the door frame.  The doorway is exactly where the closed and open room twins differ (1a's Result says so), so derive a clip outline for each layout from that difference and store it in `CONFIG.shipping.layouts.<layout>.doorway` as a polygon in % of the room.  Clip the truck to it.
4. **Arrival.**  When the door finishes opening (1a's swap is instant; the garage-door roll is a later upgrade), the truck slides in from the right edge of the doorway and stops backed up to it, rear doors facing the room, with a small settle bounce.  Then the driver walks in from the doorway to a standing spot inside the room beside the door and stops.  A light step bob while he walks is enough; no new art.  Positions, sizes, and timings for each layout live in `CONFIG.shipping`.
5. **Leaving.**  Closing the door with the chain sends the driver back out through the doorway, then the truck slides away to the right, then the door shows closed.  Opening again brings them back in (layer 1 has only Gnomerica's truck and driver).
6. **Taps.**  The truck and driver don't respond to taps yet.  A tap during arrival or leaving is ignored, so the chain cannot start a second trip halfway through one.
7. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.71`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
8. **Screenshots** into `tools/out/` with `?ship=1`: wide Day with the truck and driver in place, wide Night the same, tall Day the same, and one wide frame mid-arrival.  List them in the Result.
9. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build anything from 1c on (no work orders, drawer, items, stamps, report card, or Stonks).
- Use the happy or grumpy poses, other regions' trucks and drivers, fake trucks, or elf imposters.
- Change how 1a's door swap works.
- Use files from any `not-for-game/` folder, or install anything.

## Done when

- With `?ship=1`, opening the door brings the truck in, framed by the doorway, then the driver walks in and waits; closing sends both away.  This works in all four layout and theme combinations.
- The truck never shows outside the doorway, and the door frame stays in front of it.
- Without `?ship=1`, the game is unchanged.
- The smoke test passes, and the screenshots exist.

## Result (filled in by Claude Code)

