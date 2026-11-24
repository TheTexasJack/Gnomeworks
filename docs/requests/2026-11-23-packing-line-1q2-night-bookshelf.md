# Work order: Packing Line 1q.2, the night bookshelf (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23.  **Approved by:** (waiting on Nathan)

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
