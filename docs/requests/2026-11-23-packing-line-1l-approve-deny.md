# Work order: Packing Line 1l, APPROVED or DENIED, glitter fakes, and TNP's line (v0.2)

**Status:** Approved
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("Approve or deny every slip.  Stamp it and pack it.  Everything else approved.").
**Model:** Opus 5.5

**v0.2 (2026-11-23):** step 2a, the Packing Rules bar always shows (Nathan's test of draft.91).

## Goal

The first half of TNP Corp.  Every work order gets stamped APPROVED or DENIED before it is packed.  From the fourth shift on, a GRIP truck's board can carry a fake (glitter) work order, which the player should deny.  TNP gets its own line on the STONKS screen.  Elf drivers and fake trucks are the next order, 1m.  Still hidden behind `?ship=1`.

## Decisions (Nathan, 2026-11-22 and 2026-11-23)

- **Every slip is approved or denied.  Stamp it, then pack it.**  An order can't be packed until it is APPROVED.
- **Fake work orders** are the normal slip with a glitter effect drawn by code (decided 2026-11-22).  They show up only on real GRIP trucks.  An elf's own slips have no glitter (1m: the elf is the tell).
- **Fakes start from shift 4,** so players learn packing first (number in config).
- **Stamp scoring** (approved 2026-11-22): APPROVED on a real order and DENIED on a fake are the right calls.  Denying a real order counts as unfilled (❌).  Approving a fake is a TNP win.
- **The ticker** (approved 2026-11-22): two lines, GRIP and TNP.  TNP moves only during shifts.  Mistakes are recoverable: clean shifts push TNP back down, so losses never stack forever.  A scoreboard only, never bought, sold, or bet on.

## Read first

- `CLAUDE.md`, the 1c-2, 1e, 1f, and 1k orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Work orders and drivers," "TNP Corp," "The stock ticker."
- Art: `art-masters/packing-line/32-approve-deny-stamps/` (`stamp-approved-v1.0.svg`, `stamp-denied-v1.0.svg`, and `stamps-on-work-order-v1.0.png`, the approved look on a slip); `27-tnp-logo/tnp-logo-v1.0.svg` (TNP's colors: red `#b3202a`, green `#1f6b3a`, gold `#d9a72e`).
- `js/shipping.js` (the slips, the active order, the record, scoring, the report card, the STONKS screen), `js/state.js` (save and `migrate()`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Copy the two stamp SVGs into `assets/packing/` as is (they are vectors), and add them to `docs/ASSETS.md`.
2a. **The Packing Rules bar always shows (Nathan, test of draft.91: "It should be at the top and say 'Packing Rules' with the downward chevron").**  The chart no longer hides with "Show instructions" off (this replaces 1j's step 6): the bar is always the first thing in the supplies menu, titled **Packing Rules**, minimized after the first time as 1k built it.  Remove the `.no-hints #ship .ship-rules` rule and update DESIGNS and ARCHITECTURE to match.
3. **Stamping a slip.**  The full-size slip gets two stamp buttons along its bottom: APPROVED and DENIED, drawn from the art.  A tap slams the chosen stamp onto the slip: it starts big and lands with a BAM (sound and numbers in config), placed as in `stamps-on-work-order-v1.0.png`.  The small slip on the board shows it too.  The player can change a stamp until that order's box is packed (Claudia's draft, for kids who mis-tap).
4. **Stamp it, then pack it.**  The box on the bench belongs to the leftmost order that is APPROVED and not yet packed.  With none, the bench has no box.  A DENIED order gets no box.  Unstamped slips glow softly on the board (a tip: off with "Show instructions," like the others).
5. **Glitter fakes.**  From shift `CONFIG.shipping.fakes.startShift` (4), a GRIP truck's board has a `fakeChance` (draft 30%) of carrying one glitter slip among its orders, never more than one per board (draft).  The glitter is a code effect over the normal slip, readable on the small slip and plain on the full-size one.  Reduced motion: still sparkles, no twinkle.  A fake slip asks for a normal-looking order from a real town.
6. **Count shifts.**  Add `shifts` (completed hand-offs) to the save, with `migrate()` filling it from `stonksHistory` for old saves.
7. **Scoring** (amounts in `CONFIG.shipping.score`, draft numbers, record them in the Result):
    - Real, APPROVED, packed right: ✅ as now.
    - Real, DENIED: ❌ "Denied a real order" (scored as unfilled).
    - Fake, DENIED: ✅ "Caught a fake!"  Ours +5, TNP −5.
    - Fake, APPROVED (packed or not): ❌ "Approved a fake."  TNP +10.
    - Unstamped at hand-off: a real order is "Not packed"; a fake one is ❌ "Missed a fake," TNP +5.
    - A perfect shift also pulls TNP down by 5 (the recoverable meter).  Neither line goes below 0.
    - Main-reason order: Approved a fake, Missed a fake, Denied a real order, then the 1j order.
8. **TNP's line.**  Add `tnp` and `tnpHistory` to the save (`migrate()` fills 0 and []).  The STONKS screen draws two lines across the full width, as 1f does: GRIP in green with its number, and TNP in TNP red with its number, each labeled.  Both tick to their new values when the report card closes.  The report card's bottom line shows both: "Stonks this shift: +N   TNP: +N" (draft wording).
9. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` (save data) and DESIGNS (built), and update `tools/smoke-test.js`: orders must be approved before packing; a forced fake board scores "Caught a fake!" when denied and "Approved a fake" when approved; old saves load with `tnp` 0 and `shifts` from their history.  Run it.
10. **Screenshots** into `tools/out/`, both layouts, Day: a full-size slip with its two buttons, a slip mid-BAM, the board with one approved, one denied, and one glitter slip, the bench with no box while nothing is approved, a report card with "Caught a fake!" and "Approved a fake," and the STONKS screen with both lines after three shifts.  List them in the Result.
11. In the Result, record how long the build took.
12. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build elf drivers, fake trucks, sending drivers away, or the reopen rule (1m).
- Put region stamps or Christmas stamps on fakes (glitter only, decided 2026-11-22).
- Let anything spend or trade Stonks.
- Change counts, supplies, stickers, the region stamp, the truck, or the driver.
- Install anything.

## Done when

- Every slip can be stamped APPROVED or DENIED with a BAM, and only approved orders get a box.
- From shift 4, glitter slips show up on some boards, and each stamp call scores as listed.
- The STONKS screen shows GRIP and TNP lines, both saved, and old saves load cleanly.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

