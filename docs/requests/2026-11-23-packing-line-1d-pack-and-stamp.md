# Work order: Packing Line 1d, pack and stamp (v0.3)

**Status:** Done
**Written by:** Claudia, 2026-11-23, for the Wednesday demo cut (HANDOFF.md).  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

**v0.2 (2026-11-23):** the box and the stack have the stage and may cover the driver (Nathan); the count note in step 6 follows 1c-3.
**v0.3 (2026-11-23):** step 5a, the phone screen holds still in the room (Nathan).

## Goal

The player packs each work order: tap the conveyor to open the item menu, drag the ordered item into a cardboard box on the bench, close the box, and stamp it with the region stamp.  A packed box moves aside and the next order's box appears.  Nothing ships yet and the shelf does not change (hand-off is 1e).  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md`.
- `docs/HANDOFF.md`, "Wednesday demo target."
- The 1c-3 order (the factory rests in the room, so shelf counts hold still while the player packs).
- `docs/DESIGNS.md`, Packing Line: "Purchase orders and the order board" (Packing, Rotation), "The room (Nathan's sketch)" (the conveyor opens the item menu), and "Decided" (stamps are color plus symbol).
- The 1c-2 order and its Result (the slips, the order data, the stamp files).
- Art: `art-masters/packing-line/10-13-boxes/box_plain_open.png` and `box_plain_closed.png` (approved pair, same canvas).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Game copies of the plain box, open and closed, with `tools/art.py resize` (same size, so they swap without a jump).  Add them to `docs/ASSETS.md`.
3. **The active order.**  Orders are packed one at a time, left to right.  The slip being packed gets a small highlight on the board; packed slips get a check mark.  The box on the bench belongs to the active order.
4. **The box.**  An open cardboard box sits on the packing bench (its place and size per layout in `CONFIG.shipping.layouts.<layout>.box`).  **The box has the stage (Nathan, 2026-11-23):** the driver is flavor behind the game's flow, so the box, its label, the stamp tray, and the stack of packed boxes draw in front of him and may cover him.  Place them for the player's hands first.  Do not move the truck or the driver to make room.
5. **The item menu.**  A trusted tap on the painted conveyor opens a menu of junk items, styled like the game's shelf tiles (emoji, name, count).  Items with more than 1 on the shelf can be dragged; items at 1 or 0 show greyed out.  It closes with a tap outside it or Escape.  Make it scroll and readable on a 390px phone.
5a. **The phone screen holds still (Nathan, 2026-11-23).**  In the tall layout the Shipping view is all dragging and tapping, so the page must not scroll, bounce, zoom, or swipe away under the player's hands:
    - No page scroll or pull-to-refresh bounce while the room is showing (`touch-action` and `overscroll-behavior` on the room, or locking the page's scroll while the view is open).  The item menu still scrolls inside itself.
    - **The view swipe is off inside the room** (`main.js` swipes between views on touch, so a sideways drag while packing would flip to the Machine).  The view buttons still leave the room.
    - No double-tap zoom on the room.
    - Desktop is fine as it is (Nathan); do not change it.
6. **Packing.**  Drag a tile from the menu onto the open box: the box takes that item (the whole pile, down to the display copy, per DESIGNS.md) and shows a small label with the item's emoji and the count it will ship.  One item per box (Gnomerica orders ask for one).  Dropping a different item replaces the first.  The menu stays open so the player can change their mind; dragging works with a mouse and a finger.
7. **Close and stamp.**  A tap on a filled open box closes it (swap to the closed picture).  Then a small stamp tray beside the box shows the region stamps the player has (layer 1: Gnomerica's only).  Tap the stamp to stamp the closed box: the stamp lands on the box with a short thump.  A tap on a closed, unstamped box opens it again.
8. **Done with a box.**  A stamped box slides to a stack by the truck's rear (its place per layout in `CONFIG.shipping.layouts.<layout>.stack`; on the phone that is the floor at the bench's right end, in front of the driver), and the next order's empty box appears.  When all orders are packed, no new box appears.
9. **Record, don't ship.**  Keep, for each order: the item packed, its count at packing time, and the stamp used.  Nothing is saved, the shelf does not change, and closing the door clears it all (1e will use this record).
10. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
11. **Screenshots** into `tools/out/` with `?ship=1&debug=1` and plenty of junk, both layouts, Day: the menu open, an item in the box, the box closed and stamped, and two boxes packed with the third in progress.  List them in the Result.
12. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Ship anything or change shelf counts, save data, or Stonks.
- Build the supplies rules, the other box types, APPROVED or DENIED, the report card, or the hand-off (1e).
- Change the truck, driver, chain, or door.
- Install anything.

## Done when

- In both layouts, each of the three orders can be packed: item in, box closed, stamped, set aside, next box out.
- The item menu works with mouse and finger, and greys out items at 1 or 0.
- On a phone, dragging and tapping in the room never scrolls the page, bounces it, or swipes to another view.
- The record of what was packed exists for 1e.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.81**.  Smoke test: all clear, desktop and phone, with a new packing check.

**What was built**

- `js/shipping.js`: the active order, the conveyor tap area, the item menu, dragging, the box (open, filled, closed, stamped), the stamp tray, the stack, and the record.  New read-outs for tests and 1e: `GW.ship.packed()`, `activeOrder()`, `boxState()`, `menuOpen()`.
- `js/config.js`: per layout `conveyor`, `box`, `tray`, `stack`, and `menu`; and `shipping.pack` (the junk groups, the stamps the player has, the box art, the label and stamp places on the box, the touch hold and slop, the drop margin, and every timing).
- `css/style.css`: the slip highlight and check, the box and its label and stamp, the tray, the menu (shelf tiles), the drag ghost, and the phone lock.
- `js/sfx.js`: `thump()`, a short code-made thump for the stamp.  Filling a box plays the quiet item drop sound; closing and opening play the click.
- `js/main.js`: the view swipe is skipped in the Shipping view.
- `tools/smoke-test.js`: on desktop, packs all three orders by mouse and checks the record, that no fourth box appears, that the shelf is unchanged, and that closing the door clears it all.

**How each step came out**

- **Step 3.**  The active slip lifts a little and glows gold; packed slips get a green check.  Packing goes left to right.
- **Step 4.**  Wide: the box stands on the bench right of the order board, clear of the slips, with the tray beside it.  Tall: the box stands on the bench left of center, the tray right of it.  The truck and the driver did not move.
- **Step 5.**  The menu lists the 96 junk items (Laundry through Absolutely Random, shelf order, with group headings), as shelf tiles with the picture, name, and count.  Undiscovered items show as "???" like the shelf.  Items at 1 or 0 are grey and can't be picked up.  Tap outside or Escape closes it.
- **Step 5a.**  `#ship` is `touch-action: none` (no pan, pinch, or double-tap zoom starts in the room), `overscroll-behavior: none` on the page while the view is open at 720px and under, and no view swipe in the room.  Checked with real touch events (Chrome DevTools touch input): a sideways and an upward drag on the room left the view on Shipping and the page where it was, and a finger swipe scrolled the menu 159 px with the page still.
- **Step 6.**  The label shows the item's picture and the count in the game's short form ("707K"), so it fits the small box.  The record keeps the exact count.
- **Step 7 and 8.**  As written.  The stamp comes down with the thump and the box jolts; the stamped box slides to the stack (two on the floor, one on top), and the next box pops in.
- **Step 9.**  `GW.ship.packed()` returns, per order, `{ item, count, stamp }`, or null until stamped.  Nothing is saved.

**Calls I made that Claudia should check**

1. **The phone room scrolls into view.**  On a 390x844 phone the room's bottom, the conveyor, sat about 30 px below the fold (more with a browser's address bar), and with drags on the room no longer scrolling the page, the conveyor could only be reached by dragging the banner.  So on entering the Shipping view in the tall layout, the page scrolls just enough to show the whole room (31 px on 390x844; the view buttons stay on screen).  Desktop is untouched.
2. **Dragging with a finger.**  The menu scrolls in code (it has to be `touch-action: none` so a tile can be dragged).  A finger that moves first scrolls the menu; a finger that holds still 220 ms on a tile picks it up; and a finger that scrolls out of the menu carries the tile it pressed, so a quick swipe from a tile down to the box works too.  The menu scroll has no momentum.  A mouse picks a tile up as soon as it moves 8 px, and the wheel scrolls.
3. **Where the menu sits.**  Tall: over the top of the room, so the board and the box stay in view.  Wide: the room is short (about 390 px tall on a 1400 px screen), so a top strip showed only one row of tiles; the menu covers the left half instead (the desk and the board), leaving the box, tray, and stack in view.  The board is hidden while the desktop menu is open.
4. **A tap outside the menu only closes it.**  In the room that tap does nothing else, so a tap on the box or the chain while the menu is open needs a second tap.  This stops a dismissing tap from closing a box by surprise.
5. **The conveyor opens the menu any time,** door closed included (it can be browsed; with no box, a drop does nothing).
6. **Any item can be packed.**  Nothing checks that the box matches its order yet (scoring is 1e).
7. **`touch-action: none` on the room applies in every layout.**  It has no effect with a mouse, so desktop play is unchanged, and it keeps landscape phones (the wide layout) still too.  The page overscroll lock is phones only (720 px and under).
8. **Night:** the box dims to 88% like the slips.  No night art, and the screenshots are Day as asked.
9. **Not tried on a real phone.**  Touch was checked in headless Chromium with real touch events; iOS Safari in particular should get a try on Nathan's or a tester's phone before Wednesday.

**Screenshots** in `tools/out/` (`?ship=1&debug=1`, Day, a shelf with 1,000 to 3.5M of most items and some at 1 or 0; not committed, `tools/out/` is ignored; the debug bar covers the bottom of the phone room):

- `1d-wide-day-menu.png`, `1d-tall-day-menu.png`: the menu open (greyed tiles show the piles at 1).
- `1d-wide-day-item-in-box.png`, `1d-tall-day-item-in-box.png`: an item in the box, the label showing, the menu still open.
- `1d-wide-day-stamped.png`, `1d-tall-day-stamped.png`: the box closed and stamped, the first slip checked.
- `1d-wide-day-two-packed.png`, `1d-tall-day-two-packed.png`: two boxes packed in the stack, the third closed with the stamp tray out.
- `1d-wide-day-all-packed.png`, `1d-tall-day-all-packed.png` (extra): all three packed, no new box.

**Checks run in the browser**, both layouts (mouse on desktop, touch on the phone): three orders packed in each; a greyed item dropped on the box does nothing; a wrong item then the right one replaces it; the menu stays open after a drop; a tap outside and Escape close it; a closed box reopens on a tap and closes again; the record matches the orders with the Gnomerica stamp; no box after the third; the shelf is unchanged; closing the door clears the record and every box; no console errors or missing files.

Nothing was installed.  The truck, driver, chain, door, shelf counts, save data, and Stonks are unchanged.
