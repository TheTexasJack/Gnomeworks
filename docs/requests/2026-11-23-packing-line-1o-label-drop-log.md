# Work order: Packing Line 1o, the shipping label, a smooth drop, and the shipping log (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 (the order and the log lines).
**Model:** Opus 5.5

## Goal

Three pieces.  Every closed box wears a shipping label in the middle of its face (box face v0.3).  A box handed to the driver lands on the stack smoothly.  The Log clipboard under STONKS opens a short, funny shipping log for each box of the last shift, and the Report Card clipboard opens the last report card again.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "Shipping label is also needed on every box (i.e. where it's going) ... about in the middle."
- "The only thing that is weird is the placement of the box from the driver.  It's a weird wiggle instead of a smooth drop."
- "Ready for the next drop.  Shipping label is a simple one, with a smoother drop from the driver.  The shipping log could also go in."

## Read first

- `CLAUDE.md`, the 1d.2, 1e, 1j, 1m, and 1n orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Shipping log" (2026-11-04), "The box face (approved v0.3)."  The approved mock and its numbers: `docs/art-style/references/box-face-mock-v0.3.png`, `tools/mocks/box_face_mock.py`.
- **The log's lines:** `docs/lore/shipping-log-v0.1.md` (how a log is built, and every line).  Use the lines exactly as written there.
- Art: `art-masters/packing-line/07-address-label/address_label.png` (checklist 07, approved).  The two clipboards under STONKS are painted into the room (checklist 05e: left is the Report Card, right is the Log).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The shipping label.**
    - A game copy of the address label, added to `docs/ASSETS.md`.
    - It goes on automatically when a box closes (the printer prints it; no drag), and shows whenever the box is closed: on the bench, in the player's hand, and on the stack.  It hides while the box is open, like the other marks.
    - Placement per the mock: centered on the face at 50% of the box's width.  On `box_plain_closed.webp` (400 x 400, box drawn at x 55 to 345, y 53 to 346) that is about center `[50, 54.3]`, width `36.25`, in % of the canvas (Claudia's math).  Check against the mock and record the final numbers.
    - Its text sits on the label's three ruled lines, live in `--font`: the town, the region, and "via GRIP."  A long town ("Grit Spit and Fellers") shrinks to fit its line.
    - Draw order: the label above the box, below the stickers and the stamp.
3. **A smooth drop.**  A box dropped on the driver moves to its stack spot in one smooth eased arc (a short rise, then down), lands with one small settle, and stops.  No wiggle.  Reduced motion: a straight slide, no settle.  Numbers in config.
4. **The Report Card clipboard.**  The painted clipboard on the left under STONKS is a button: it opens the last shift's report card again (nothing new is scored).  Before the first shift, it does nothing.
5. **The Log clipboard and the shipping log.**  The clipboard on the right opens the **Shipping Log** for the last shift: a parchment page in the report card's style listing each shipped box (town, count and item, its result mark).  A tap on a box opens its log: about 8 lines, each with a clock time, built exactly as `shipping-log-v0.1.md` says.  A tap or Escape steps back, then closes.  Boxes kept from TNP or never shipped have no log.
6. **Saving.**  Save the last shift's report card rows and logs (only the last shift, so the save stays small), with `migrate()` filling nothing for old saves.  The logs are made once, at hand-off, so reopening shows the same lines.
7. **The lines live in config,** copied from the lore doc (with a comment pointing back to it).  Every other number and word in `js/config.js` too.
8. Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` (save data) and DESIGNS (built), and update `tools/smoke-test.js`: every closed box shows a label with its town; the drop ends on the stack spot with no extra motion; after a shift, both clipboards open; a box's log starts with the start line and ends with the end line that matches its result; a reload shows the same log.  Run it.
9. **Screenshots** into `tools/out/`, both layouts, Day: a closed box with its label, stickers, and stamp; a close-up beside the mock's mid-game box; three frames of the drop; the reopened report card; the Shipping Log list; one box's log; a TNP box's log.  A short video of one drop.  List them in the Result.
10. In the Result, record how long the build took.
11. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Write new log lines beyond the lore doc, or change its wording.
- Add the Daily Cog, other regions, or throw-ins.
- Change scoring, supplies, stickers, the stamp's spot, or the truck and driver.
- Install anything.

## Done when

- Every closed box wears its label with the town, region, and "via GRIP," matching the mock.
- The drop is one smooth arc with a single settle.
- Both clipboards work after a shift, and the logs read as the lore doc describes, the same after a reload.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.95**.  Smoke test: all clear, desktop and phone.

**Build time:** about 27 minutes, from `git pull` at 16:21 to the Result at 16:48 (CST).

**What was built**

- **The shipping label.**  `assets/packing/address_label.webp` (400x215, 19 KB), cropped tight like the mock (alpha over 40) and made with `art.py resize --width 400`; in `docs/ASSETS.md` and the checklist (07, and 36 for the log page).  It goes on as the box closes and shows whenever the box is closed (bench, hand, stack), hidden while open, drawn above the box and below the stickers and the stamp.  **Final numbers** (`CONFIG.shipping.pack.addr`): center [50, 54.3], width 36.25, in % of the box canvas, matching Claudia's math; checked against the mock by drawing the bench box big beside the mock's mid-game box (`1o-<wide|tall>-day-label-vs-mock.png`).  The text sits on the label's ruled lines, measured on the game copy at 40.0, 54.9, and 70.7% of its height, running from 31% to 91.5% of its width, in `--font`: the town (bold, 8.6 cqw of the label), the region (5.4), and "via GRIP" (4.6), the mock's proportions.  A town too long for its line shrinks to fit (down to 3.6).
- **A smooth drop.**  `dropBox()` draws one arc as 32 points on a single linear animation (eased in and out in code, rising 22% of the box's height at the middle), changing size and turning to the stack tilt on the way, over 560 ms.  Then the thump and one squash of the box's picture (3.5%, 200 ms), and it stops.  Reduced motion: a straight 300 ms slide, the thump, no settle.  All in `pack.hand.drop`; `pack.slideMs` is gone.  The old wiggle came from animating `left`, `top`, `height`, and a pixel `translate` together under one CSS easing while the box's `translate(-50%, -100%)` anchor shifted with its size, and the tilt jumped at the start.
- **The Report Card clipboard** (`layouts.<layout>.clips.card`, measured from the room art) reopens the last shift's card from the save.  Nothing is scored.  Before the first shift it does nothing.
- **The Log clipboard and the Shipping Log** (`clips.log`): the work order's parchment (approved as the log page, checklist 36) with the slip's stripes, titled "Shipping Log," listing each shipped box (✔ or ✘, town, count and item, and a ›).  A tap opens that box's log: its town, mark and count line, and 7 to 9 entries with clock times, built as the lore doc says.  A tap or Escape steps back to the list, then closes.  Kept-from-TNP and unshipped orders have no log and are not listed.
- **Saving.**  The save's new `lastShift` (only the last shift): the card's rows as plain words and ids, and each shipped box's log, made once in `applyShift()`.  `migrate()` gives older saves `null`.
- **The lines** are in `CONFIG.shipping.log`, copied from `docs/lore/shipping-log-v0.1.md` with a comment pointing back to it.  All 41 lines were checked against the doc both ways by script: identical.
- **Docs:** CHANGELOG, ARCHITECTURE (save data and the room), DESIGNS (built, under the box face and the shipping log), ASSETS, the production checklist, TASKS, HANDOFF.
- **Smoke test:** before the first shift both clipboards do nothing.  Every closed box shows its label with its town, region, and "via GRIP"; an open box hides it; the stacked boxes keep their towns.  Shift 1's towns are all renamed "Grit Spit and Fellers" in memory, and the town must shrink and fit.  The first drop is sampled every frame: it never turns back sideways, turns at most once vertically (up, then down), ends exactly on its stack spot, and nothing moves after.  After shift 1 the card clipboard shows the same towns without scoring again, the log lists each box, a box's page shows its saved lines, and Escape and a tap step back then close.  Every log starts with the start line at 08:00, ends with the end line for its result, has 7 to 9 lines with climbing times, and uses only config lines.  The elf's shift: only his box has a log, built from TNP's lines and ending at the North Pole.  After a reload, `lastShift` and the opened log read the same.  A pre-1o save loads with `lastShift` null.

**Calls to check**

1. **The label's text is too small to read at play size.**  The box on the bench is about 90 px across on desktop and the stack boxes about 60 px, so the town draws 2 to 3 px tall, the same as the mock's "about phone size" row.  It reads as a label; the town is readable in the Shipping Log.  A larger label or a tap-to-read would be a separate order.
2. **A packed fake** (Approved a fake) ships on GRIP's truck, so it gets a GRIP log ending "A little bumped, but it got there."  The lore doc names TNP lines only for an elf's box.
3. **The list shows only shipped boxes.**  An elf sent packing leaves an empty list with "No boxes shipped last shift." (`log.empty`, my draft wording).
4. **Times step in 5-minute rounds** (`log.stepRound`), so they read 08:35, 09:10.  Set it to 1 for any minute.
5. **{item} and {count} come from the order**, as the lore doc says, even if the box held something else.  The packing conditions (Heavy, Soft, stickers, peanuts) follow what is in the box.
6. **End line order:** Wrong item wins over No stamp when both apply, then any other miss.
7. **The clipboards work during a trip too** (not while the truck is leaving, or while a slip, card, warning, or drag is up).  On the phone the parked truck covers the right clipboard's right edge; a tap on the part that shows opens it.
8. **The thump now plays when the box lands** instead of at the drop.
9. **Reduced motion** for the drop (straight slide, no settle) is in the code but not exercised by the smoke test.

**Proof** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844.

- A closed box with its label, sticker, and stamp: `1o-<wide|tall>-day-closed-box-label.png`; the bench box drawn big: `-label-closeup-game.png`; beside the mock's mid-game box: `-label-vs-mock.png`.
- Three frames of the drop (15%, 50%, 85%): `1o-<wide|tall>-day-drop-1.png`, `-drop-2.png`, `-drop-3.png`; the full stack: `-on-stack.png`.
- The reopened report card: `1o-<wide|tall>-day-card-reopened.png`.
- The Shipping Log list: `1o-<wide|tall>-day-log-list.png`; one box's log: `-log-box.png`; a TNP box's log: `-log-tnp.png`.
- A short video of one drop (desktop, 3.4 s, drag to landing): `1o-wide-day-drop.mp4`.

Nothing was installed.  No Daily Cog, other regions, or throw-ins; scoring, supplies, stickers, the stamp's spot, and the truck and driver are unchanged.
