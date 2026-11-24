# Work order: Packing Line 1r, the wall map, the map viewer, and the unlock card (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("1r approved.").
**Model:** Opus 5.5

## Goal

Put Nathan's map on the room's wall, let a tap open the full map (only unlocked regions in color), and build the card that shows when a region unlocks.  Real players cannot unlock anything yet: a test button fires the unlock, and the Gnohio build turns the real one on.  Still hidden behind `?ship=1`.

## Nathan's words and decisions (2026-11-23)

- The unlock: "A 'Drivers can now deliver to a new region!' message appears and shows the highlighted map."
- "On the first time opening the map, it should only have the Gnomerica unlocked and the rest grayed out.  As areas unlock as you say, they highlight."  Then: "I think it should be a dark gray instead of a light gray."
- A full-size map "lags hard on a phone.  So we will want a smaller map."
- The wall map: "I think we need a hybrid ... b looks better, but needs clean up.  here is a clean one we can fit onto it."
- Postcards: "One option is a stack of all three.  In fact, every location has 3 postcards."
- Build the card and map first, with the live unlock off (approved).  5 good shifts will open Gnohio (approved).
- Full design: `docs/DESIGNS.md`, "The map in the room and region unlocks."

## Read first

- `CLAUDE.md`, the 1q and 1q.1 orders and their Results (the tutorial page, "Got it!" and its 400 ms wait).
- The wall map art: `art-masters/packing-line/05-wall-map/map_clean.png` (transparent); Claudia's mocks `docs/art-style/references/wall-map-mock-wide-v0.2.png` and `-tall-v0.2.png`.
- The map pictures, made by Claudia in the cloud with `tools/map/region_states.py` (do not re-run it; it needs `rsvg-convert`): `assets/map/map-state-01.webp` to `map-state-10.webp` (2048 x 1419, one per number of unlocked regions, in the unlock order) and `assets/map/closeup-<region>.webp` (1024 x 768, each region lit, rendered in the state where it unlocks).
- The postcards: `art-masters/postcards/postcard_<region>_*.png`, three per region.
- The unlock order (DESIGNS.md): Gnomerica, Gnohio, Gnafrica, Slanic, Gno Dao Cradle, Gni, Slaanilok, Shen Shin, Gnufoundland, Gnonmoon.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The save:** `regions` (how many are unlocked, in the unlock order), 1 for every save, old and new.
3. **The wall map:** a small WebP of `map_clean.png` (trim the clear edges, about 2x its largest size on screen, with `tools/art.py`) inside the room's empty upper parchment frame, on both layouts, fitted inside it with a little parchment showing all around, as in the mocks.  Claudia measured the frame's inner parchment, in % of the room: desktop **x 31.25, y 17.2, w 19.06, h 17.43**; phone **x 31.11, y 12.2, w 39.11, h 10.44**.  Record the final numbers in the Result.  Night dims it with the same brightness as the slips.  It sits on the wall: above the room art, below the slips, boxes, driver, menus, and pop-ups.
4. **Tap the wall map to open the map viewer:** a pop-up on `document.body` showing `map-state-<regions>.webp`, which loads only when the viewer opens.  It fits the screen at first; on phones it pinches to zoom and drags to pan, and on desktop the wheel zooms and a drag pans.  Zoom stops where the picture is at full size (no blur), and the map can't be dragged off screen.  A close button (and Escape) closes it.  The room locks page zoom on phones (1d), so the viewer handles its own pinch.  While it is open, taps in the room do nothing.
5. **The unlock card** (shows when a region unlocks), on `document.body`, built like a tutorial page (the work order parchment, `--font`, the same "Got it!" with its 400 ms wait), fitting a 390 x 844 phone with no scrolling:
    - The heading **"Drivers can now deliver to a new region!"** (Nathan's words) and the region's name under it.
    - The region's close-up, `closeup-<region>.webp`.
    - Its three postcards in a small stack, slightly fanned; a tap on the stack brings the next one to the top (Claudia's draft, approved with this order).  Game copies of the postcards are small WebP files made with `tools/art.py`, in `assets/postcards/`.
    - After "Got it!", the wall map's picture in the viewer is the new state.
6. **No real unlock yet:** `CONFIG.shipping.regions.liveUnlock` is false, and while it is false nothing in play unlocks a region.  The count that will open Gnohio, 5 good shifts, goes in config now (`regions.goodShiftsFor` or similar), unused until the Gnohio build.
7. **The test button:** with `?debug=1`, the debug bar gets "Unlock next region," which adds one to `regions` (up to 10) and shows that region's card, and "Reset regions," which puts it back to 1.
8. **What does not change:** orders, drivers, stamps, the label, and the tutorial still use Gnomerica only, whatever `regions` says.  The Gnohio build connects them.
9. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and `docs/ASSETS.md`, and update `tools/smoke-test.js`: the wall map shows on both layouts, Day and Night; a tap opens the viewer with the state for `regions`, and the picture loads only then; the viewer zooms and pans and stops at full size; a fresh save and an old save both start at 1; the test button shows each card in order, with its close-up and three postcards, and the stack turns over on a tap; "Got it!" needs a real tap; with `liveUnlock` false, five good shifts unlock nothing; orders stay Gnomerica only.  Run it.
10. **Screenshots** into `tools/out/`, both layouts, Day and Night: the room with the wall map, the viewer at state 1 (fitted and zoomed in), the Gnohio card (and the stack after one tap), and the viewer at state 2.  List them in the Result.
11. In the Result, record how long the build took.
12. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Re-render or change the map pictures or the close-ups; report any problem with them.
- Turn on the real unlock, or change orders, drivers, stamps, the label, or scoring.
- Write the Gnohio tutorial page or its rules.
- Install anything.

## Done when

- The wall map sits in the upper frame on both layouts, and a tap opens a smooth, zoomable map showing only unlocked regions in color.
- The test button shows each region's card with its close-up and postcard stack, and the viewer follows it.
- Nothing in real play unlocks a region.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)
