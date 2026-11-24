# Work order: Packing Line 1q, the tutorial's first five pages (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 (the five pages' wording, and the good shift line: "I like the good shift.  These all look good to me.").
**Model:** Opus 5.5

## Goal

Teach a new player the Packing Line in short pages that show up the moment each thing first appears, so nobody is buried in rules up front.  Pages 1 to 5 now; region pages come with the unlock card later.  Also fix the 1p glow call.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "First, we need to explain to the player what a shift is.  In the future enhancements we had an option for instructions.  As we push even more stuff, I think we should accelerate that.  Otherwise we risk presenting too much and people not knowing what to do or what things mean."
- Earlier note on the tutorial: short, "with small shots of what to do and how to spot fakes," seen once, findable later.

## Read first

- `CLAUDE.md`, and the 1p order and its Result (call 2).
- `docs/DESIGNS.md`: "The tutorial, moved up" and "Good shift."
- `js/shipping.js` (the room, the slips, the box, the hand-off, the report card, the clipboards), `js/state.js` (the save: `shifts`, `lastShift`), `CONFIG.shipping.fakes.startShift`, and the "Show instructions" setting.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The 1p glow fix (1p call 2, Claudia's pick):** the report card that pops up on its own at the end of a shift counts as opening the Report Card clipboard, so after a shift only the Log clipboard glows.  Saves keep working (`lastShift.unread`).
3. **A tutorial page** is a pop-up on `document.body`, over the room: a title, one to three short lines, and one small picture, on the work order parchment (checklist 06, as the Shipping Log page uses it), in `--font`.  One button, **"Got it!"**, closes it, and only a real tap or Enter counts, so a stray tap during play can't skip it.  It fits a 390 x 844 phone with no scrolling.  If two pages come due at once, they show one after the other.  Nothing in the room is timed, so nothing needs pausing.
4. **The five pages and when each shows** (Claudia's wording, approved by Nathan 2026-11-23; it lives in `js/config.js`):
    1. **Welcome to the Packing Line!**  Shows the first time the player enters the Shipping view.
       "A truck comes to the door with orders.  Pack every order, then pull the chain to send the truck on its way.  That is one shift.  Get every order right for a good shift!"
    2. **Read and stamp.**  Shows the first time work orders appear on the board.
       "Tap an order to read it.  Stamp it APPROVED if it is real, or DENIED if it is not.  You only pack the orders you approve."
    3. **Pack the box.**  Shows the first time a box comes out onto the bench.
       "Tap the belt and drag the item into the box.  Tap the computer for packing peanuts, bubble wrap, stickers, and stamps.  The Packing Rules say what each item needs.  Then close the box and stamp it."
    4. **Hand it over.**  Shows the first time a box is closed.
       "Drag the closed box to the driver.  When every box is done, pull the chain to close the door.  Then read your report card to see how you did!"
    5. **Watch out for fakes!**  Shows at the start of the first shift where fakes can appear (`fakes.startShift`).
       "TNP wants to trick you.  An order that sparkles is fake, so stamp it DENIED.  If an elf drives up in a fake truck, pull the chain to send him away."
5. **The pictures:** each page gets a small shot of the real room showing what its words say (page 1: the truck at the door; 2: an open slip with its stamp buttons; 3: the belt, the computer, and an open box; 4: a closed box over the driver; 5: a glitter slip and the elf in his fake truck).  Make them with a script, `tools/tutorial-shots.js`, which plays the room in Playwright the way the smoke test does, crops each shot, and saves it small as WebP (about 480 px wide) in `assets/tutorial/`, so they can be remade whenever the room changes.  No new packages; if WebP saving needs something missing, report it and use PNG.
6. **Seen once, kept in the save:** each page shows once per save (`tutorial.seen`).  **Older saves:** a save with `shifts` of 1 or more counts pages 1 to 4 as seen; one at `fakes.startShift` or more counts page 5 as seen too.  For testing, `?tutorial=reset` clears the seen pages.
7. **The How to Ship book:** a small button in the room reopens the tutorial as a book of the pages seen so far, one at a time, with back and next and "Got it!" to close.  Pages not seen yet stay out of the book (no spoiling the fakes).  **Placement is Nathan's pick:** build two spots behind a setting in `js/config.js` (Claudia's suggestions: a small book or "?" tag on the room's wall near the computer, or the top edge of the room by the view buttons; offer a better spot if one fits) and screenshot both.
8. **Show instructions** stays the in-room hint layer (glows and tags) and does not hide the tutorial.  The tutorial is the explaining layer (Nathan, 2026-11-23).
9. **Good shift:** a GRIP shift where every real order scores ✔ is a good shift.  The report card's bottom adds **"Good shift! ⭐"** (approved by Nathan), and the save counts `goodShifts`.  TNP trips count neither way.  Nothing unlocks from it yet (Gnohio's count is still open).
10. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` (save data, the tutorial), and update `tools/smoke-test.js`: each page shows at its moment and only once; "Got it!" needs a real tap; pages due together queue; an older save skips the right pages; `?tutorial=reset` brings them back; the book holds only seen pages; a good shift shows its line and counts, a TNP trip doesn't; after a shift only the Log clipboard glows.  Run it.
11. **Screenshots** into `tools/out/`, both layouts, Day and Night: each of the five pages, the book (with back and next), both How to Ship placements, and a report card with "Good shift! ⭐".  List them in the Result.
12. In the Result, record how long the build took.
13. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build the region pages, the unlock card, the in-room map, or Gnohio.
- Change scoring, the Packing Rules, the room art, or the opening flow.
- Write tutorial words beyond the five pages above.
- Install anything.

## Done when

- A fresh save meets each page once, at its moment, on both layouts, with its picture.
- An older save skips the pages it has already lived through.
- The How to Ship book reopens the pages seen so far, from both placements.
- A good shift shows its line and counts in the save.
- After a shift, only the Log clipboard glows.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)
