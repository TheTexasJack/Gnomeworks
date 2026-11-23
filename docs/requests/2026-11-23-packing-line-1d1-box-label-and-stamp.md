# Work order: Packing Line 1d.1, the box label, a bold stamp, and the menu frame (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-23, from Nathan's test of draft.81.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

**v0.2 (2026-11-23):** step 4a, the item menu sits on the approved supply drawer frame (05a) (Nathan: "yes on the junk menu").

## Goal

Two fixes from Nathan's test of 1d.  The box no longer shows a count, and a packed box looks like a plain shipped box with no contents showing.  The stamp lands bold and on top.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "We don't need the amount on the box.  I like the label as to what's in it."
- "This also means the box being shipped looks like a box being shipped and not with a weird side showing its contents."
- On the item menu using the supply drawer frame: "yes on the junk menu."
- "The stamp is too transparent.  It should be bold and in front.  It's fine if it covers everything."

## Read first

- `CLAUDE.md`, the 1d order and its Result.
- `art-masters/packing-line/05a-supply-drawer/supply_drawer.png` (approved 2026-11-15: a plain frame, brass corners, wood sides, blank parchment inside; 1024 x 1536) and checklist row 05a.
- `js/shipping.js` (the box, its label, the mark), `css/style.css` (`.box-label`, `.box-mark`), `CONFIG.shipping` (`label`, `mark`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The label shows only the item's picture.**  No count, no name.  It shows while the box is open and filled, so the player can see what went in.
3. **A closed box shows no label.**  Closing the box hides the label; opening it again shows it.  Boxes on the stack show no label.  The record for 1e keeps the item and exact count as now.
4. **The stamp is bold and in front.**  Drop `mix-blend-mode: multiply` from `.box-mark` and draw the stamp at full opacity, above everything on the box and above the stack, the tray, and the driver.  It may cover anything.  Keep its tilt.  If it reads small, raise its width in `CONFIG.shipping` (`mark`), and say the number in the Result.
4a. **The item menu sits on the supply drawer frame (05a).**  Make a game copy with `tools/art.py resize` and add it to `docs/ASSETS.md`.  The menu is a wide strip on the phone and a tall panel on desktop, and the frame is portrait, so draw it as a nine-slice (CSS `border-image`): the brass corners keep their shape, the wood sides stretch, and the parchment fills the middle.  The tiles sit on the parchment.  Keep the menu's place, size, scrolling, and drag exactly as now.  Day and Night use the same frame (Night may dim it as the slips do).  Name the slice numbers in `CONFIG.shipping` and the Result.  Nathan will check the phone menu for seams where the stretched wood sides meet the corners, so add a close-up screenshot of the phone menu's corners.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1&debug=1`, both layouts, Day and Night: an open filled box (picture only), a closed unstamped box (no label), a stamped box, the stack with two packed boxes, and the item menu open on its new frame.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change how packing works: one item per box, and a new drop replaces the old one (layer 1 orders ask for one item).
- Build a contents screen (a future enhancement, in TASKS).
- Change the menu's place, size, scrolling, or drag, the board, the truck, the driver, the chain, or the door.
- Install anything.

## Done when

- An open filled box shows only the item's picture; a closed or stacked box shows none.
- The item menu shows on the 05a frame in both layouts with its corners undistorted.
- The stamp is solid, on top, and easy to see in both layouts and both themes.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.82**.  Smoke test: all clear, desktop and phone (packing check included).

**What was built**

- **Step 2.**  The label is the item's picture alone, on the same small parchment card, with the picture larger (22% of the box's canvas, was 14%) since the count no longer shares the card.  Its screen reader name is the item's name.
- **Step 3.**  The label shows only while the box is open and filled.  Closing hides it, opening shows it again, and stamped and stacked boxes show none.  The record (`GW.ship.packed()`) still keeps the item and the exact count.
- **Step 4.**  `mix-blend-mode: multiply` is gone; the mark draws at full opacity with a small drop shadow, tilt kept (-14).  A stamped box gets `.is-stamped` (z-index 3), so it draws above the next box, the stack, the tray, and the driver.  `#ship` is now `isolation: isolate`, so that z-index stays inside the room; the item menu (4) and an open slip (5) stay above it.  **The stamp read small at 30, so `CONFIG.shipping.pack.mark` is now `[60, 52, 44, -14]`:** width 44 (was 30), and centered a little lower and left (was 64, 47) so the larger stamp stays on the box's front face.
- **Step 4a.**  `assets/packing/menu_frame.webp` (512x768, 29 KB), made with `tools/art.py resize --width 512` from the 05a master, added to `docs/ASSETS.md`.  It draws behind the tiles as a nine-slice on its own layer (`.ship-menu-frame`), so Night dims the frame only, as the slips are dimmed (88%).  **Slice numbers, in `CONFIG.shipping.pack.menuFrame`:** `slice: 62` (px of the game copy, all four sides; 124 in the 1024x1536 master, which takes in the brass corner piece and the parchment's round corner), `border: { wide: 34, tall: 24 }` (px the frame draws on screen).  The menu's place, size, scrolling, and drag are unchanged; the tiles sit inside the parchment, and the group headings are now dark text on a parchment band so they read on it.
- **Step 5.**  `GW.VERSION` 0.2.0-draft.82, stamped, CHANGELOG entry, smoke test all clear.  Docs: HANDOFF, TASKS, ARCHITECTURE, ASSETS, and the 05a row of the production checklist.

**Calls I made that Claudia should check**

1. **The stamp moved** (64, 47 to 60, 52) as well as growing, so the bigger stamp sits on the front face and does not hang off the box's right edge.
2. **Stretching:** on the phone strip, the top and bottom wood rails stretch about 2x sideways (wood grain only; no rivets on them).  The side rails, rivets included, scale almost evenly (about 0.39 across and 0.33 down on the phone, 0.55 and 0.47 on desktop), so the rivets stay round.  I saw no seams at the corners at 2x zoom; Nathan's own check on his phone is still the test.
3. **The menu's frame shadow** is a CSS drop shadow on the whole menu in place of the old box shadow.

**Screenshots** in `tools/out/` (`?ship=1&debug=1`, both layouts at 2x, Day and Night; a shelf with 1,000 to 3.5M of each item; not committed, `tools/out/` is ignored; the debug bar covers the bottom of the phone room):

- `1d1-<wide|tall>-<day|night>-menu.png`: the item menu open on its new frame.
- `1d1-<wide|tall>-<day|night>-open-filled.png`: an open filled box, picture only.
- `1d1-<wide|tall>-<day|night>-closed.png`: a closed unstamped box, no label, the stamp tray out.
- `1d1-<wide|tall>-<day|night>-stamped.png`: the stamp landed, solid and on top.
- `1d1-<wide|tall>-<day|night>-two-packed.png`: two packed boxes on the stack (no labels), the third box open.
- `1d1-tall-<day|night>-menu-corners-top.png` and `-menu-corners-bottom.png`: close-ups of the phone menu's four corners, for the seam check.

The screenshot run also checked, both layouts and themes: the open box's label holds only the picture, the closed box and the stacked boxes show no label, the record keeps the exact count, and no console errors or missing files.

Nothing was installed.  Packing rules, the board, the truck, the driver, the chain, and the door are unchanged.
