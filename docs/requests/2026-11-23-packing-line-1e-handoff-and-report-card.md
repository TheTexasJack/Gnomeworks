# Work order: Packing Line 1e, hand-off, report card, and the GRIP line (v0.2)

**Status:** Draft
**Written by:** Claudia, 2026-11-23, for the Wednesday demo cut (HANDOFF.md).  **Approved by:** (waiting on Nathan)
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

