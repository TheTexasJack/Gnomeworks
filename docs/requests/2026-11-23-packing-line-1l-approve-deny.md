# Work order: Packing Line 1l, APPROVED or DENIED, glitter fakes, and TNP's line (v0.2)

**Status:** Done
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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.92**.  Smoke test: all clear, desktop and phone.

**Build time:** about 25 minutes, from `git pull` at 13:55 to the Result at 14:20 (CST).

**What was built**

- **Art.**  `stamp-approved-v1.0.svg` and `stamp-denied-v1.0.svg` copied as is into `assets/packing/` and listed in `docs/ASSETS.md`.
- **2a, the Packing Rules bar always shows.**  Titled "Packing Rules", first in the supplies menu, open the first time and minimized after (as 1k built it), with or without "Show instructions".  The `.no-hints #ship .ship-rules` rule is gone; DESIGNS and ARCHITECTURE updated.
- **Stamping a slip.**  The open slip shares its space with a row of two buttons under it (`approval.buttons`: the row is 14% of the slip's height), each showing its stamp's art on a parchment-colored button.  A tap slams the stamp onto the slip: 2.6 times its size down to its place over 240 ms, then the BAM (`GW.sfx.bam`, a heavier code-made thump) and a 2.5% jolt of the slip.  Places measured from `stamps-on-work-order-v1.0.png`: APPROVED centered at 50%, 57.9% and 81.6% of the slip's width; DENIED at 50%, 60.6% and 81.4%.  The chosen button stays lit.  The board's slip shows the stamp.  Once the order's box is packed (or while its region stamp is landing) both buttons lock.  The slip stays open after a stamp; any tap off the buttons or Escape closes it, as before.
- **Stamp it, then pack it.**  No box until an order is APPROVED.  The box belongs to the leftmost APPROVED order not yet packed (`GW.ship.activeOrder()`).  Changing an order to DENIED removes its box (nothing in it ever left the shelf).  Unstamped slips pulse with a soft cream glow (off with instructions).  The chain glows once every order is DENIED or APPROVED and packed.
- **Glitter fakes.**  From shift 4, one roll per board at 30% picks one random order to be the fake.  It gets a pastel rainbow sheen with fine glitter dots and 14 four-point sparkles (11 to 19% of the slip's width, six colors), all drawn over the paper and under the text, so the text stays readable.  They twinkle unless reduced motion is on.  Sparkle positions are made once per order, so they hold still when the board redraws.
- **Shifts, TNP, and scoring.**  The save gains `shifts`, `tnp`, and `tnpHistory`; `migrate()` fills `shifts` from `stonksHistory.length` (which keeps only 10, so it is a floor) and the other two with 0 and [].  Draft numbers, all in `CONFIG.shipping.score`: real DENIED = "Denied a real order", ours −3 (Gnomerica's `wrong`); fake DENIED = "Caught a fake!" (a ✔ row with the words in green), ours +5, TNP −5; fake APPROVED = "Approved a fake", TNP +10; fake unstamped = "Missed a fake", TNP +5; real unstamped = "Not packed", ours −3; perfect shift = TNP −5 more.  Neither line goes below 0.  Main-reason order starts Approved a fake, Missed a fake, Denied a real order, then the 1j order.
- **TNP's line.**  The STONKS screen shows "GRIP n" on the left in green and "TNP n" on the right in `#b3202a` with a lighter red glow so it reads on the black glass, plus both lines and dots on one shared scale.  A history shorter than the other (TNP's in an old save) starts at 0 on the left.  Both count up when the card closes.  The card's bottom line is "Stonks this shift: +N   TNP: +N" (`card.totalText`), shrinking to fit like the rows.
- **Docs:** CHANGELOG, ARCHITECTURE (save data and the room), DESIGNS (built), ASSETS, TASKS, HANDOFF.
- **Smoke test:** every shift now stamps its orders first.  It checks that no box comes out before an approval, that the unstamped slips glow, that the open slip has two buttons, that DENIED gives no box and changing to APPROVED brings one, that the board's slip shows APPROVED, and that the bar shows with instructions off and comes first in the menu.  A new `fakeCheck` checks that no fakes come before shift 4 (at a 100% chance), and that a forced board has one glitter slip (board and full size).  It then scores "Caught a fake!" (TNP −5, ours +5 less the unpacked reals, the card's "TNP: −5"), "Approved a fake" with "Denied a real order" on the rest (TNP +10), a perfect one-order caught fake (TNP −10), and "Missed a fake" (TNP +5), and checks that the STONKS screen shows both numbers and two lines.  A pre-1l save loads with TNP 0, [] and 4 shifts.

**Calls to check**

1. **A packed fake's box ships.**  The order doesn't say whether an APPROVED fake that was packed takes items off the shelf.  I let it ship (the box went on the truck to TNP).  It's one line to change if Nathan wants the shelf spared.
2. **An empty box follows the leftmost approval; a box with an item stays with its order.**  If the player approves the third slip, starts packing it, and then approves the first, the box stays with the third until it's packed, so their work isn't lost.  An empty box just moves to the first.  The box still always belongs to an APPROVED order.
3. **A smoke test fix from before this order.**  The shift 2 check expected "No peanuts +3" for a Breakable and "+2" for a Heavy.  The real counts are +2 and +1 (it failed on my baseline run before any changes whenever shift 2 drew a tagged item).  Fixed.
4. **The slip stays open after a stamp**, so the player sees it land.  Auto-closing after the BAM is an easy change if Nathan prefers it.

**Proof** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844.

- The full-size slip with its two buttons: `1l-<wide|tall>-day-slip-buttons.png`; mid-BAM (the animation paused at 55%): `-slip-bam.png`; landed: `-slip-approved.png`, `-slip-denied.png`; a glitter fake full size: `-slip-glitter.png`.
- The bench with no box while nothing is approved: `1l-<wide|tall>-day-bench-empty.png`.
- The board with one APPROVED (its box on the bench), one DENIED, and one glitter slip (unstamped, glowing): `1l-<wide|tall>-day-board.png` and close-up `-board-zoom.png`.
- Report cards: "Caught a fake!" (with "Not packed" and "Denied a real order" rows): `-card-caught.png`; "Approved a fake": `-card-approved.png`; the third shift: `-card-shift3.png`.
- The STONKS screen after three shifts (GRIP 19, 19, 18; TNP 0, 10, 5): `1l-<wide|tall>-day-stonks-3.png` and close-up `-stonks-3-zoom.png`.

Nothing was installed.  Counts, supplies, stickers, the region stamp, the truck, and the driver are unchanged.  No elves, fake trucks, or region or Christmas stamps on fakes.
