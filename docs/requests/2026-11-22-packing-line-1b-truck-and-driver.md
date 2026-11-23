# Work order: Packing Line 1b, Gnomerica's truck and driver arrive (v0.2)

**Status:** Reviewed (Claudia, 2026-11-22); waiting on Nathan's look
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1b approved").
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
3. **The doorway.**  The truck shows only inside the doorway, behind the door frame.  The doorway is exactly where the closed and open room twins differ (1a's Result says so), so use that difference as a guide, then trace a clean outline of the opening just inside the frame (the raw difference also catches some frame edge, as Claude Code found before starting), and store it in `CONFIG.shipping.layouts.<layout>.doorway` as a polygon in % of the room.  Clip the truck to it.
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

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.71**.  Still hidden: nothing shows without `?ship=1`.

**Art (`assets/packing/`).**

| File | Size | Weight | Made with |
| --- | --- | --- | --- |
| `truck_gnomerica.webp` | 971x560 | 160 KB | `art.py resize --height 560` |
| `driver_gnomerica_waiting.webp` | 278x400 | 37 KB | `art.py resize --height 400` |

`art.py` had no command that keeps a canvas as drawn (`sheet` and `fit` both crop to the content), so I added `art.py resize`: it scales the whole picture with the same WebP settings and crops nothing.  The driver's three Gnomerica canvases are 723 to 724 px tall with the feet on one baseline.  When the happy and grumpy poses are resized to the same height (400), they'll line up with this one.  Both files are in `docs/ASSETS.md`, and `resize` is in its command table.

**The doorway (step 3).**  The raw closed/open difference was patchy, because the door and the concrete have similar colours in places.  So I took its filled outer shape and fitted exactly four corners to it.  Day and night came out within 1% of each other in both layouts.  I then nudged each corner slightly inward so the frame always stays in front.  Stored as `CONFIG.shipping.layouts.<layout>.doorway`:
- Wide: `[80.1, 26.3], [92.2, 20.3], [92.4, 76.9], [80.0, 67.8]`
- Tall: `[79.3, 28.9], [94.1, 24.8], [93.8, 67.1], [78.6, 62.6]`

**Code.**
- `js/shipping.js` now runs a trip with four states (`closed`, `arriving`, `here`, `leaving`, readable through `GW.ship.tripState()`).
- The truck sits in `.ship-bay`, a full-room layer clipped to the doorway outline with `clip-path`.  The driver and the chain sit above it.  1a's door swap is unchanged: the open twin shows the moment the chain is pulled, and the closed twin returns after the truck has gone.
- Motion uses the Web Animations API.  If the view is left mid-trip, it resets to closed.  If the layout switches mid-trip, it skips to where the trip was heading.
- Reduced motion keeps the truck slide and the driver's walk, but drops the settle bounce and the step bob.
- New in `CONFIG.shipping`: `doorway`, `truck` (`h`, `top`, `xFrom`, `xTo`), and `driver` (`h`, `from`, `to`, `fromScale`) for each layout, plus the image paths and a `trip` block with every timing and bounce size.
- Arrival takes about 3.6 seconds from the pull to the driver standing still (truck 1.6 s, settle 0.45 s, a 0.15 s pause, walk 1.4 s).  Leaving takes about 2.9 seconds.

**Placement calls (all numbers in config, easy to change):**
- **Truck size:** in the wide room the truck's rear doors fill the opening.  The tall opening is narrow, so the truck there is sized to fit its rear doors across the opening, which leaves some concrete showing above it.
- **Driver's standing spot:** he waits in front of the lower left of the doorway, clear of the chain so it stays easy to tap.  In the tall room he stands beside the end of the bench.  He fades in over the first fifth of his walk while growing from 0.8 to full size, so he seems to come out of the bay.  He walks out the same way.

**Checks.**
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.71).
- A scratch Playwright check (not committed) passed every item in all four layout and theme combinations with `?ship=1`:
    - The room starts closed, and a chain pull starts the arrival.
    - A second pull mid-arrival is ignored, and the trip still reaches `here`.
    - Tapping the driver changes nothing and doesn't crank the machine.
    - A pull sends them away; a pull mid-leaving is ignored; the trip ends closed with the truck and driver hidden.
    - Leaving the view mid-trip resets it, and a second trip works.
- The same check without `?ship=1` passed: the button stays hidden and the room is never built.
- **Truck never outside the doorway:** I compared screenshots of the room with and without the truck (driver and chain hidden).  Outside the doorway outline, the only changed pixels are along its edges, at most 0.7 px from the line (edge smoothing).  The truck covers 12,000 pixels inside the doorway in the wide room and 7,000 in the tall room.

**Screenshots for Nathan** (in `tools/out/` on Beast, all with `?ship=1`; wide = 1400x900, tall = 390x844):
- `ship-wide-day-here.png`: truck and driver in place
- `ship-wide-night-here.png`: the same at night
- `ship-tall-day-here.png`: the same on a phone
- `ship-wide-day-arriving.png`: mid-arrival, the truck sliding in behind the frame
- Bonus: `ship-tall-night-here.png`

**Not built (per the order):** work orders, drawer, items, stamps, report card, Stonks, the happy and grumpy poses, other regions, fakes.

**Still open from 1a's review:** the three view buttons wrap on a 390px phone, and the chain ignores Space and Enter.


## Review (Claudia, 2026-11-22)

Pulled 3dd07f1 and rendered it in the cloud session: wide Day mid-arrival and in place, wide Night, tall Day and Night.  The truck sits inside the doorway behind the frame in every state, and the driver walks in and waits.  The new `art.py resize` command is the right fix (every older command trims to content, which would break shared baselines).

One art note for Nathan: the waiting pose leans to his right on something, but he stands in open floor in front of the door frame, so he leans on air.  Placement is a config number if Nathan wants him nearer the truck or frame.
