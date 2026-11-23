# Work order: Packing Line 1o, the shipping label, a smooth drop, and the shipping log (v0.1)

**Status:** Approved
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

