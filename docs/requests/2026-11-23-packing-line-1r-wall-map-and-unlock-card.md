# Work order: Packing Line 1r, the wall map, the map viewer, and the unlock card (v0.1)

**Status:** Done
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

Built 2026-11-24 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.101**.  Smoke test: all clear, desktop and phone.

**Build time:** about 44 minutes, from `git pull` at 23:49 (2026-11-23) to the Result at 00:34 (2026-11-24, CST).  About a third of it was smoke-test runs (four full runs; two failed: a click timeout from the debug bar running off the phone's screen, then a test bug where the room-tap probe left a finger down during the pinch).

**What was built**

- **The save:** `regions` (1 to 10), 1 in a fresh save and in any older save without it; `migrate()` puts a broken count back to 1.
- **The wall map:** `assets/packing/wall_map.webp` (400 x 231, 50 KB), made with `tools/art.py resize --trim --width 400` from `map_clean.png` (clear edges trimmed at alpha over 30, box (29, 146, 1417, 948)).  On screen it is about 102 x 59 CSS px on a 1400 x 900 desktop and 105 x 61 on a 390 x 844 phone, so 400 px is about 2x its largest desktop size and 3x on a phone.  `art.py resize` gained `--trim` and `--max` for this.  It is fitted inside Claudia's frame numbers with 6% of the frame's height of parchment all around (`CONFIG.shipping.regions.wall`), centered.  **Final numbers** (x, y, w, h in % of the room): desktop **33.30, 18.25, 14.96, 15.34**; phone **36.53, 12.83, 28.26, 9.19**.  It is the room's first piece after the art (before the bookshelf), so the slips, boxes, driver, menus, and pop-ups all draw over it.  Night dims it to the slips' 0.88.
- **The map viewer** (`js/regions.js`, on `document.body`): a tap on the wall map opens `assets/map/map-state-<regions>.webp`, which is requested only then (and once, while the state stays the same).  It opens fitted with 12 px around it.  One finger or the mouse drags; two fingers pinch around their midpoint; the wheel zooms around the pointer.  Zoom runs from fitted to `map.maxZoom` = 1 (one picture pixel per CSS pixel, the picture's full size), and the map is clamped so no edge can come inside the screen (centered when smaller than the screen).  A round close button (top right) and Escape close it.  While it is open, window-level capture listeners take every pointer, touch, wheel, and key event, so the room hears nothing (Tab stays on the close button).
- **The unlock card** (`js/regions.js`, on `document.body`): the tutorial's page classes (slip paper, red stripes, `--font`, the same "Got it!" with `tutorial.armMs`, 400 ms, real taps or Enter only; a script's click does nothing).  Nathan's heading, the region's name over a bar in its stamp color, the close-up, and the three postcards in a stack tilted -7°, 5°, -2° (top last).  A tap on the stack slides the top card off and tucks it under (320 ms; instant with Calm motion).  Pictures stack on phones and sit side by side on wide screens.  Measured: 624 px tall on a 390 x 844 phone, 559 px on a 1400 x 900 desktop, no scrolling.  Game copies of all 30 postcards in `assets/postcards/` (`art.py resize --max 512`, each keeping its own shape, 57 to 126 KB, 2.7 MB in all); a card loads only its region's three.
- **No real unlock:** `CONFIG.shipping.regions.liveUnlock: false` and `goodShiftsFor: 5`.  `shipping.js` calls `GW.regions.afterGoodShift()` after each good shift; it returns at once while `liveUnlock` is false and holds no rule yet, so the Gnohio build writes the rule there.
- **The test buttons** (`?debug=1`): "Unlock next region" adds one (up to 10; at 10 it does nothing) and shows that region's card; "Reset regions" puts it back to 1.  Words in `CONFIG.shipping.regions.debug`.
- **Unchanged:** orders, drivers, stamps, the label, the tutorial, and scoring still use Gnomerica only, whatever `regions` says.
- **Docs:** CHANGELOG, ARCHITECTURE (file table, save data, a Regions paragraph), ASSETS (`assets/map/`, `assets/postcards/`, the wall map), TASKS, HANDOFF.
- **Smoke test:** a new `regionCheck` on both layouts: a fresh save and an old save (no `regions`) at 1; the wall map inside its frame, loaded, on top at its middle, no filter by Day and the slips' brightness at Night; no map picture requested before the viewer opens and exactly one after; state 1 fitted; a room tap and the P key heard nothing under it; the wheel (desktop) and a two-finger pinch (phone) zoom in and stop at exactly full size; long drags in both directions stop with the map's corner on the screen's corner; zooming out stops at fitted; Escape and the close button close it; five `afterGoodShift` calls with `goodShifts` 5 unlock nothing; the test button shows cards 2 to 10 in order, each with its heading, close-up, three loaded postcards, and fitting the screen; on Gnohio a script click and an early real tap leave the card open, a tap turns the stack over (3rd to top), and a real tap after 400 ms closes it; the viewer then shows state 2; an 11th press does nothing; with 10 regions the door's orders are all Gnomerica; the reset goes back to 1.

**Calls to check**

1. **Full size** is read as one picture pixel per CSS pixel (`map.maxZoom: 1`).  On a 3x phone that is a 5.6x zoom from fitted and slightly soft (town names read clearly, see `1r-tall-day-viewer-1-zoomed.png`).  "No blur at all" on a 3x phone would mean stopping at 1/3, only a 1.9x zoom, which is too little to read the small names.  One number to change.
2. **The viewer's map dims at Night** with the slips' brightness, like every other pop-up.  The order only asked for the wall map.
3. **The card's pictures sit side by side on wide screens** (stacked on phones), so it fits a short laptop screen.
4. **The region's name** has a bar under it in the region's stamp color (`GW.DESTINATIONS.regions` color).  My addition.
5. **The stack's order** is the order of `postcards` in `CONFIG.shipping.regions.list` (alphabetical by file name).  Easy to reorder.
6. **Escape does nothing on the unlock card**, like a first-time tutorial page.
7. **The live hook holds no rule:** I read "unused until the Gnohio build" literally, so `goodShiftsFor` is not read anywhere yet.  "Five good shifts unlock nothing" is tested through `afterGoodShift` with `goodShifts` set to 5, not by playing five real shifts (the tutorial check still plays one real good shift).

**A problem with the map pictures (not changed, per the order):** in `map-state-01.webp` (and the later states) Gnomerica's lit area has straight edges in places, most clearly a vertical line on its east side through the woods and a straight bottom edge above the lake (see `1r-tall-day-viewer-1-fitted.png` and `-zoomed.png`), so the lit area reads as a soft rectangle more than a region outline.  Worth a look by Claudia in `tools/map/region_states.py`.

**Screenshots** in `tools/out/` (`?ship=1`, not committed).  `wide` is 1400 x 900 at 2x; `tall` is 390 x 844 at 3x.  For each `<wide|tall>` and `<day|night>`:

- The room with the wall map: `1r-<layout>-<theme>-room.png`, and a close crop of the wall: `-room-close.png`
- The viewer at state 1, fitted and zoomed in to full size on Gnomerica: `-viewer-1-fitted.png`, `-viewer-1-zoomed.png`
- The Gnohio card, and the stack after one tap: `-card-gnohio.png`, `-card-gnohio-stack-tapped.png`
- The viewer at state 2 after "Got it!": `-viewer-2-fitted.png`

Nothing was installed.  The map pictures and close-ups are untouched.
