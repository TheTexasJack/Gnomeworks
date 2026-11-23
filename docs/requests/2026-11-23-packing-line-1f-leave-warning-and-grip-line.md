# Work order: Packing Line 1f, the leave warning and a full GRIP line (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23, for Beta 1.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

## Goal

Two polish items on Beta 1 (the Packing Line behind `?ship=1`).  Leaving the room mid-trip warns first, and a confirmed leave hands off the truck as is, so it is scored and the player always sees the report card.  The GRIP line on the STONKS screen uses the whole screen from the first shift on.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "When clicking the 'Shop Floor' or 'The Machine' from the shipping room, a warning will pop up that this will end the day and will send off the current truck as is."  Confirming counts as a hand-off, so 1e's scoring applies (agreed).
- The warning states what leaving does today.  Holding the trip's state until the day ends is a later change, and the warning retires with it.

## Read first

- `CLAUDE.md`, the 1e and 1e.1 orders and their Results.
- `docs/DESIGNS.md`, Packing Line, "The room is only the Packing Line" (leaving ends the day, hold the trip later).
- `js/main.js` (the view buttons, `applyView`), `js/shipping.js` (trip states, the hand-off, the report card, the STONKS screen).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **When the warning shows.**  Tapping "The Machine" or "Shop Floor" while a trip is open (the truck is arriving or here, with orders on the board) shows the warning instead of switching.  With the door closed, or a trip with no orders, the player leaves as now, with no warning.
3. **The warning.**  A small parchment pop-up over the room, in the slips' style: "Leave the Packing Line?  This ends the day and sends the truck off as it is."  Two buttons: **Stay** and **Send it off**.  (Draft wording, Claudia; record it in the Result.)  Stay, a tap outside it, or Escape closes it and nothing changes.
4. **Send it off.**  Runs the same hand-off as pulling the chain: scored as is (anything unfinished scores "Not packed"), the driver reacts, the truck leaves, the shelf drops, Stonks move.  The report card shows in the room as usual, and when it closes, the view switches to the one the player tapped.
5. **Leaving during `leaving`** (the chain already pulled): no warning.  Let the trip finish, show the report card, and switch views when it closes, so a scored shift's card is never skipped (1e Result, point 4).
6. **The GRIP line uses the whole screen.**  Spread the saved shifts across the chart's full width, first to last, however many there are (up to the 10 kept).  One shift draws a single dot, or a short flat line, at its value.  Keep the scale and the tick-up as they are.
7. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and the DESIGNS line for the warning (built), run `node tools/smoke-test.js`.  Add a smoke-test check: mid-trip, a view button shows the warning; Stay keeps the trip; Send it off scores the shift, shows the card, and lands on the tapped view after the card closes.
8. **Screenshots** into `tools/out/`, both layouts, Day: the warning over the room, the report card after Send it off, and the STONKS screen after 1, 2, and 3 shifts.  List them in the Result.
9. In the Result, also record how long the build took (the time Claude Code reports at the end).
10. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Hold the trip's state between visits (a later change).
- Change scoring, the cue, the board, the menu, the box, or the truck and driver.
- Install anything.

## Done when

- Leaving mid-trip always warns, Stay changes nothing, and Send it off scores, shows the card, then switches views.
- No scored shift ever skips its report card.
- The GRIP line fills the screen at 1, 2, and 3 shifts.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

