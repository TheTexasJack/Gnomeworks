# Work order: Packing Line 1e.1, the report card fits the longest names (v0.1)

**Status:** Done
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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.85**.  Smoke test: all clear, desktop and phone.

**What was built**

- **One line each.**  The town, item, and reason are each one `.card-line` (`white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`).  When the card shows, `fitCard()` in `js/shipping.js` measures each line and, if it is wider than its row, shrinks that line's own font size (in cqw, so the fit holds at every card size) from `CONFIG.shipping.card.font` toward `card.fontMin`.  Past the floor the line ends with "...".  It runs again once fonts finish loading.  I measured each line rather than reusing the shelf's CSS `clamp()`: the shelf scales by tile width, which is the same for every name here, so it could not tell a long town from a short one.
- **New numbers in `CONFIG.shipping.card`:** `font` (town 5.2, item 4.2, reason 4.2 cqw, the draft.84 sizes, moved out of the CSS), `fontMin` (town 3.4, item and reason 3.2), and `fitSlack` (0.97).
- **Rows hold three lines with room to spare:** once nothing wraps, the three lines fill 70% to 84% of a row at every size, inside the row's rules.
- **Test hook:** `GW.ship.testCard(r)` shows a report card for made-up rows, without scoring or saving.  No game data was renamed.

**Measured with the longest names** (row 1: Grit Spit and Fellers, Fire Extinguisher, Wrong stamp; row 2: the same with "Wrong item, Wrong stamp"; row 3: Pulley Junction, a right row).  At 360 x 780, 390 x 844, and 1400 x 900, Day and Night: every line on one line, nothing cut, nothing touching a rule.  "Grit Spit and Fellers" shrinks to about 4.3 cqw (from 5.2), "Fire Extinguisher" and "Wrong stamp" fit at full size, and "Wrong item, Wrong stamp" shrinks to about 3.3 cqw, just above its 3.2 floor.  Normal Gnomerica names keep the draft.84 sizes.

**Calls to check**

1. **Two reasons on one row** are the tightest fit.  "Wrong item, Wrong stamp" is the longest pair and sits near the floor; "Wrong stamp" cannot happen yet in Gnomerica.  If a third reason is ever added, that line would end with "...".
2. **The tick column keeps its size:** only the words shrink.

**Screenshots** in `tools/out/` (`?ship=1`, 2x, not committed since `tools/out/` is ignored).  Each has a `-zoom.png` twin cropped to the card.

- `1e1-360-day-long-card.png`, `1e1-360-night-long-card.png`
- `1e1-390-day-long-card.png`, `1e1-390-night-long-card.png`
- `1e1-1400-day-long-card.png`, `1e1-1400-night-long-card.png`
- Normal Gnomerica card for comparison: `1e1-360-day-normal-card.png`, `1e1-390-day-normal-card.png`, `1e1-1400-day-normal-card.png`

Nothing was installed.  The scoring, the card's art and lettering, the slips, and the rest of the room are unchanged.
