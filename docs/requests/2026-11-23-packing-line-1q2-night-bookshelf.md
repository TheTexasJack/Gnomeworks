# Work order: Packing Line 1q.2, the night bookshelf (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("ok doke!").

Nathan's words: "ooop we need a nighttime bookshelf.  I forgot.  I'll get that made."  Then, with the art: "Here we go.  Fixed."
**Model:** Opus 5.5

## Goal

At Night the How to Ship bookshelf uses Nathan's painted night version in place of the day shelf dimmed by code, so it matches the room's painted night lighting.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, the 1q.1 order and its Result.
- The art: `art-masters/packing-line/39-how-to-ship-shelf/how_to_ship_shelf_night.png` (1672 x 941, transparent; checklist item 39).  Its canvas differs from the day master (1774 x 887), but once trimmed the shelf has the same shape (about 1.61 vs 1.62 wide to tall).
- `CONFIG.shipping.tutorial.book`, the shelf in `js/shipping.js`, and `css/style.css` (`.night #ship .ship-book`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The game copy:** make the night WebP with `tools/art.py` the same way as the day one (trim the clear edges, same size), in `assets/packing/`.
3. **Night swaps the picture:** at Night the shelf shows the night art, and the code dim on it (`.night #ship .ship-book`, the brightness filter) goes away.  Day is unchanged.  Its spot, size, tap, and glow stay as built in 1q.1.  If the trimmed night shelf comes out a touch taller or shorter than the day one, fit it in the same spot by its width and report the difference.
4. **The tutorial pictures** stay Day shots; no remake needed.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ASSETS.md`, and update `tools/smoke-test.js`: Day shows the day shelf and Night the night shelf, with no brightness filter at Night.  Run it.
6. **Screenshots** into `tools/out/`, both layouts: Day and Night side by side, the shelf glowing and not, plus a close-up of the night shelf at phone size.  List them in the Result.
7. In the Result, record how long the build took.
8. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the shelf's art, its spot, the glow, or the tutorial.
- Install anything.

## Done when

- Night shows the painted night shelf with no dim, Day the day shelf, on both layouts.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.99**.  Smoke test: all clear, desktop and phone.

**Build time:** about 15 minutes of work, from `git pull` at 21:54 to the Result at 22:10 (CST).  The smoke test took about 10 of those.

**What was built**

- **The game copy:** `assets/packing/how_to_ship_shelf_night.webp`, 240x149, 16 KB, transparent.  Made like the day one: clear edges trimmed with Pillow (alpha over 8: box (248, 55, 1424, 786) of the master, 1176x731), then `tools/art.py resize --width 240`.
- **Night swaps the picture:** the night shelf joins the other night twins in `js/theme.js` (`GW.theme.img`), and the room's `redraw` sets the shelf's picture from it, so it changes with the theme like the room art does.  The code dim (`.night #ship .ship-book`, the brightness filter) is gone.  Day, the spot, the width, the tap, and the glow are unchanged.
- **Height:** fitted by width in the same spot.  The trimmed night shelf is about 0.6% taller than the day one (1.609 vs 1.618 wide to tall): on screen 58.1x36.1 vs 58.1x35.8 px on the 1400x900 desktop, and 67.7x42.0 vs 67.7x41.8 px on a 390 px phone.  So 0.2 to 0.3 px, nothing to correct.
- **Numbers:** no new ones; `CONFIG.shipping.tutorial.book` keeps its spot and width, with a comment on the night twin.
- **Tutorial pictures:** unchanged (Day shots).
- **Docs:** CHANGELOG, ASSETS, ARCHITECTURE, TASKS, HANDOFF, and checklist item 39 (night integrated).
- **Smoke test** (`tutorialCheck`, both layouts): switches the theme to Day, then Night, and checks the shelf shows `how_to_ship_shelf.webp` at Day and `how_to_ship_shelf_night.webp` at Night, both loaded, and no filter on the shelf or its art at Night (`none / none`).

**Calls to check**

None.

**Screenshots** in `tools/out/` (`?ship=1`, not committed).  `wide` = 1400x900 at 2x, `tall` = 390x844 at 3x (phone pixels).  Day on the left, Night on the right:

- The room, shelf glowing and not: `1q2-<wide|tall>-day-vs-night-glow.png`, `1q2-<wide|tall>-day-vs-night.png`
- Shelf close-ups side by side: `1q2-<wide|tall>-shelf-close-day-vs-night-glow.png`, `-shelf-close-day-vs-night.png`
- The night shelf alone (`tall` is the phone-size close-up): `1q2-<wide|tall>-night-shelf-close-glow.png`, `1q2-<wide|tall>-night-shelf-close.png`

Nothing was installed.  The shelf's art, its spot, the glow, and the tutorial are unchanged.
