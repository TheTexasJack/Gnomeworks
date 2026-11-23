# Work order: Packing Line 1e.1, the report card fits the longest names (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23, from Nathan's phone test of draft.84.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

## Goal

On the report card, a long town name wraps to two lines and pushes the red reason ("Wrong item", "Not packed") into the row's bottom rule, where it is cut off.  Nathan saw it with "Pulley Junction" on his phone.  Every row must fit the longest names in the game, on a 360 px phone and on desktop.  Still hidden behind `?ship=1`.

## The longest names (Claudia, from `GW.DESTINATIONS` and `CONFIG.items`, 2026-11-23)

- Towns, all regions: **Grit Spit and Fellers** (21 characters, Gnafrica), The Crafter's Mines, Pretty Good Chances.  Gnomerica's longest: Dice and Doodles, Pulley Junction.
- Junk items (the only things that ship): **Fire Extinguisher** (17).
- Reasons: "Wrong stamp" is the longest.
- Claudia's stress render of draft.84: `docs/art-style/references/report-card-long-names-draft84.png` (360 and 390 px phones).  The work order slip already fits these names on one line; only the report card needs the fix.

## Read first

- `CLAUDE.md`, the 1e order and its Result.
- `js/shipping.js` (the report card rows) and `css/style.css`.
- How the game already shrinks Tiny Monster names to fit their tiles (draft.20 to 51 in TASKS: "monster names shrink to fit"); reuse that approach if it fits.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **One line each.**  In every row, the town, the item, and the reason each stay on one line.  A town or item that doesn't fit shrinks its own text to fit (down to a floor in `CONFIG.shipping`), and only past that floor ends with "...".  Nothing wraps, and nothing touches the row's rules.
3. **Rows hold three lines** with room to spare, at every card size, so the reason line is never cut.
4. **Test with the longest names** by pointing a test hook or the screenshot script at them (do not rename anything in the game data): "Grit Spit and Fellers", "Fire Extinguisher", "Wrong stamp", on 360 x 780, 390 x 844, and 1400 x 900, Day and Night.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** of those cards into `tools/out/`, listed in the Result, plus one normal Gnomerica card for comparison.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the scoring, the card's art or lettering, the slips, or anything else in the room.
- Install anything.

## Done when

- With the longest names, every row shows the town, item, and reason on one line each, nothing cut or touching a rule, at all three sizes.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

