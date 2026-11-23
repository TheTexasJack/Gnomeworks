# Work order: Packing Line 1e, hand-off, report card, and the GRIP line (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-23, for the Wednesday demo cut (HANDOFF.md).  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

**v0.2 (2026-11-23):** step 4a, the chain shows the player how to finish (from Nathan's phone test of draft.81: with all three boxes packed, it wasn't clear how to finish).

## Goal

Close the loop.  Pulling the chain to close the door hands the packed boxes to the driver: he reacts, the truck leaves, the shelf loses what shipped, a report card scores each order, and the GRIP line on the STONKS screen moves.  Still hidden behind `?ship=1`.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md` (save data and `migrate()`).
- `docs/HANDOFF.md`, "Wednesday demo target."
- `docs/DESIGNS.md`, Packing Line: "The driver's moods," "A shift on the Packing Line" (no clock, closing early costs, the report card), "Purchase orders and the order board" (Score, Rotation), "Decided" (Stonks is a score, never spent), and idea 5 (the stock ticker: recoverable, moves only while working shifts).
- The 1d order and its Result (the packing record).
- Art: `art-masters/packing-line/09-report-card/report_card.png` (approved with its lettering), `25-drivers/driver-gnomerica-happy.png`, and the STONKS screen painted in the room (checklist 26: code draws inside it).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Game copies of the report card and the happy driver (`tools/art.py resize`, the happy pose at the same height as the grumpy copy so the baseline holds).  Add them to `docs/ASSETS.md`.
3. **Scoring each order** (all amounts in `CONFIG.shipping.score`):
    - ✅ when the box holds the ordered item and carries the right region stamp.
    - ❌ "Wrong item" when it holds another item; ❌ "No stamp" or "Wrong stamp" when the stamp is missing or wrong (layer 1 has one stamp, so "Wrong stamp" cannot happen yet; build the check anyway); ❌ "Not packed" when the order has no finished box (DESIGNS: closing early leaves it unfilled).
    - Each ✅ adds Stonks set by region difficulty (Gnomerica's amount in config), never by pile size.  Each ❌ subtracts a smaller amount.  Stonks never goes below 0.
4. **The hand-off.**  When the player pulls the chain to close with the driver in place:
    - If every order is ✅, the driver switches to the happy pose (thumbs up) for a moment; otherwise he stays grumpy (DESIGNS: no negative reaction).
    - Then the trip leaves as now: he walks out, the truck slides away, the door shows closed.
    - **Shipping removes stock:** for each finished box, the shelf count of its item drops by the packed amount, never below 1 (the display copy stays).  Wrong-item boxes still leave the shelf (they shipped).
4a. **Show how to finish (Claudia's draft).**  The chain stays the only way to finish (DESIGNS: any driver is sent away with the door chain), with no extra button.  When every order has a stamped box, the chain glows and sways gently, and a small brass tag beside its handle reads "Pull to ship!" until it is pulled.  (Draft wording, Claudia; record it in the Result.)  Reduced motion: the glow and tag, no sway.  Numbers in `CONFIG.shipping`.
5. **The report card.**  After the door closes, the report card shows over the room: one row per order with the town, the item asked for, ✅ or ❌, and the reason for a ❌, plus the Stonks gained or lost this shift.  The card's own lettering stays; rows are live text in `--font`.  A tap or Escape closes it.
6. **The GRIP line.**  Inside the STONKS screen painted on the back wall (its rectangle per layout in config), draw in code: "GRIP" and the current Stonks number in green, and a small line chart of Stonks at the end of each recent shift (the last 10).  It updates when the report card closes, with a short tick-up.  No TNP line yet.
7. **Save.**  Add `stonks` (a number) and `stonksHistory` (the last 10 shift totals) to the save, with `migrate()` filling them for old saves.  Stonks only changes on a hand-off, so nothing moves while the player is away.
8. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` (save data), run `node tools/smoke-test.js`.
9. **Screenshots** into `tools/out/` with `?ship=1&debug=1`, both layouts, Day: the happy driver after a perfect shift, the report card for a perfect shift, the report card for a mixed shift (one ✅, one wrong item, one not packed), and the STONKS screen after three shifts.  List them in the Result.
10. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build TNP, fakes, APPROVED or DENIED, the supplies rules, or the other box types.
- Spend Stonks on anything (it is a score only).
- Install anything.

## Done when

- A full shift works in both layouts: open, three orders, pack and stamp, close, the driver reacts, the truck leaves, the shelf drops, the report card shows, and the GRIP line moves.
- Old saves load with Stonks at 0.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.84**.  Smoke test: all clear, desktop and phone.  The packing check now finishes a whole shift: the chain cue, the shelf dropping to 1, Stonks rising, the report card with three right rows, Escape closing it, the STONKS number ticking up, Stonks surviving a reload, and an old save with no Stonks loading at 0.

**What was built**

- **Step 2, art.**  `assets/packing/driver_gnomerica_happy.webp` (270x400, from `25-drivers/driver-gnomerica-happy.png`, `art.py resize --height 400`, same canvas height as the grumpy copy) and `assets/packing/report_card.webp` (822x900, from `09-report-card/report_card.png`, `--height 900`, its lettering kept).  Both in `docs/ASSETS.md`.  The happy canvas is wider (the thumb) and its feet sit 9 px right of its center, so `CONFIG.shipping.driver.happy.shiftX` (-3.33% of its width) keeps his feet where the grumpy pose's are.
- **Step 3, scoring** (`CONFIG.shipping.score`).  Right = the ordered item and the order's region stamp.  Reasons: "Wrong item", "No stamp", "Wrong stamp" (built, cannot happen yet), "Not packed".  If a box has two problems, both show, joined by a comma.  Gnomerica: **+10** per right order, **-3** per miss.  Stonks never drop below 0, and the report card shows the actual change.
- **Step 4, the hand-off.**  A perfect shift swaps in the happy pose for 1.3 s (`driver.happyMs`), then he walks out still smiling; otherwise he leaves grumpy.  The trip then leaves as before.  Every box that shipped, wrong items included, takes its packed count off the shelf, never below 1.  The save is written at once, so a reload before the card closes keeps the result.
- **Step 4a, the finish cue.**  With every order stamped, the chain glows and sways (1.6 degrees each way, 1.4 s a swing, from its top so the top end stays behind the roller), and a brass tag reading **"Pull to ship!"** (Claudia's draft wording, `CONFIG.shipping.finish.text`) sits left of the handle.  Reduced motion: the glow and the tag, no sway.  The chain stays the only way to finish.
- **Step 5, the report card.**  Over the room once the door shows closed, the same way an open slip shows.  Each row has a green check or a red cross in the card's tick box, the town, the item asked for, the reason in red for a cross, and the item's picture in the dashed frame.  "Stonks this shift: +N" sits in the band under the rows.  A tap or Escape closes it.  Night dims it like the slips.
- **Step 6, the GRIP line.**  Inside the painted STONKS glass (`layouts.<layout>.stonks`, measured from the room art): "GRIP" and the number in green, faint grid lines, and a line of the last 10 shift totals, with a dot on the newest.  Each shift takes one of 10 even steps across, so the line grows left to right.  When the report card closes, the number and the newest point count up over 0.9 s with a small pop (no animation with reduced motion).
- **Step 7, save.**  `stonks` (0) and `stonksHistory` ([]) in `state.js` `fresh()`, so `migrate()` fills them for old saves.  Stonks change only on a hand-off.
- **Step 8.**  Every number is in `js/config.js`.  `GW.VERSION` is 0.2.0-draft.84, stamped, with a CHANGELOG entry.  ARCHITECTURE (save data and the hand-off), ASSETS, HANDOFF, and TASKS are updated.

**Calls I made that Claudia and Nathan should check**

1. **Score amounts are my draft:** +10 right and -3 wrong for Gnomerica.  A perfect shift is +30, and the mixed shift (one right, one wrong item, one not packed) is +4.  Each is one number in `CONFIG.shipping.score.regions`.
2. **A closed but unstamped box still on the bench ships** with "No stamp" and leaves the shelf.  An open box, even with an item in it, is "Not packed" and does not ship.  Without this rule "No stamp" could never happen, since 1d only moves a box to the stack once it is stamped.
3. **A trip with no orders** (the "Nothing to ship yet" note) scores nothing, adds nothing to the history, and shows no report card.
4. **Leaving the view mid-trip after the pull** keeps the score (already saved) but drops the report card.  The STONKS screen shows the new total next time.  The warning in TASKS ("leaving ends the day") is still future work.
5. **The tag sits over the driver's waist** on desktop and over the truck's rear on the phone.  It is beside the handle as asked, and "the box has the stage" lets packing pieces cover him.  Its spot is `layouts.<layout>.finishTag`.
6. **The report card's picture frame** shows the item that was asked for, including on a wrong-item row.  It does not show what was actually packed.
7. **Ticks and crosses** are the text glyphs ✔ and ✘ in green and red, drawn in `--font`, so they match the slip's packed check.  I avoided color emoji because they render differently on each device.

**Screenshots** in `tools/out/` (`?ship=1&debug=1`, Day, 2x; not committed, since `tools/out/` is ignored).  The debug bar covers the bottom of the phone room.  The STONKS shots come after three shifts: perfect, mixed, perfect (30, 34, 64).

- `1e-<wide|tall>-day-perfect-ready.png`: all three packed, the chain glowing and the "Pull to ship!" tag.
- `1e-<wide|tall>-day-perfect-happy.png`: the happy driver right after the pull on a perfect shift.
- `1e-<wide|tall>-day-perfect-card.png`: the report card for a perfect shift (+30).
- `1e-<wide|tall>-day-mixed-happy.png`: the same moment on the mixed shift, for comparison (he stays grumpy).
- `1e-<wide|tall>-day-mixed-card.png`: the report card for a mixed shift: one right, one wrong item, one not packed (+4).
- `1e-<wide|tall>-day-stonks-after-three.png` and `1e-<wide|tall>-day-stonks-zoom.png`: the STONKS screen after three shifts.

Nothing was installed.  TNP, fakes, APPROVED and DENIED, the supplies rules, and the other box types are not built.
