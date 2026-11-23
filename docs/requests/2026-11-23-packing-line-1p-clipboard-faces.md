# Work order: Packing Line 1p, faces for the two clipboards (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 (with the lore v0.2 lines).
**Model:** Opus 5.5

## Goal

The two clipboards under STONKS work, but their paper is blank, so nobody knows to tap them.  Draw a face on each, in code, so each says what it is at a glance.  Also give an approved fake's box its own log ending.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "The clipboard buttons are blank.  You can click them and they open up as expected, but these boards need something on them to designate what they are so people will know to click it."

## Read first

- `CLAUDE.md`, the 1o order and its Result.
- `docs/lore/shipping-log-v0.1.md` (now v0.2, with "An approved fake").
- `js/shipping.js` (the clipboards, the report card, the log), `CONFIG.shipping.layouts.<layout>` (the clipboards' rectangles).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The Report Card clipboard (left)** shows a tiny report card drawn on its paper: the title **REPORT CARD** on two lines at the top, then three short rows, each with a tiny ✔ or ✘ that **matches the last shift** (green and red, as on the real card).  Before the first shift, the rows are empty boxes.
3. **The Shipping Log clipboard (right)** shows the title **SHIPPING LOG** on two lines, a small truck drawn in code (in the style of the address label's red truck), and three ruled lines under it.
4. **Readable at play size:** bold, high-contrast titles in `--font`, as large as the paper allows, on both layouts.  Night dims them with the room, as the slips do.  (Draft wording and design, Claudia; record the final sizes in the Result.)
5. **A small cue for news:** after a shift, both clipboards give one soft glow until the player opens them, so they know a new card and log are waiting.  The glow follows "Show instructions."  Reduced motion: no pulse.
6. **An approved fake's log** (lore doc v0.2, approved by Nathan 2026-11-23): the normal GRIP road lines, plus one of the two "approved fake" lines in the middle, and its own end line.
7. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md`, and update `tools/smoke-test.js`: both faces draw; the report card face shows the last shift's marks; the glow shows after a shift and stops once opened; an approved fake's log ends with its own end line.  Run it.
8. **Screenshots** into `tools/out/`, both layouts, Day and Night: the clipboards before the first shift, after a mixed shift (glowing), and after opening; plus a close-up at phone size.  List them in the Result.
9. In the Result, record how long the build took.
10. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the report card, the log list, scoring, or the room art.
- Write log lines beyond the lore doc.
- Install anything.

## Done when

- At a glance, the left clipboard reads as the report card (with the last shift's marks) and the right as the shipping log, on both layouts.
- Both glow after a shift until opened, and the glow turns off with instructions.
- An approved fake's log ends with its own line.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.96**.  Smoke test: all clear, desktop and phone.

**Build time:** about 20 minutes, from `git pull` at 17:25 to the Result at 17:45 (CST).

**What was built**

- **The faces**, drawn in code on each clipboard's painted paper, measured from the room art into `layouts.<layout>.paper` (wide: [54.87, 41.62, 7.32, 12.65] and [65.38, 41.62, 7.32, 12.65]; tall: [35.78, 52.16, 13.55, 7.5] and [55.22, 52.16, 13.78, 7.5], in % of the room).  Each face sits under the tap areas and takes no taps.
- **Report Card (left):** REPORT / CARD in bold `--font`, then three rows, each a little box with ✔ (green, #2e8b3a) or ✘ (red, #b8262a), the real card's colors, following the last shift's first three rows, and a short line.  Before the first shift, or past the shift's rows, the boxes are empty.
- **Shipping Log (right):** SHIPPING / LOG, a small red truck in inline SVG (speed lines, box, cab and window, two wheels, the label's red), and three ruled lines in the label's dark red.
- **Final sizes** (`CONFIG.shipping.clipFace`, in % of the paper): titles 16.5 cqw at line height 0.98, boxes 14 cqw with marks 13 cqw, rows 17 cqh, truck 46 cqw wide, rules 8.5 cqh apart, padding 5 cqh top and 7 cqw sides.  **On screen** the paper is about 50 x 50 px on both layouts (desktop 1400 x 900, phone 390 x 844), so the titles draw at **8.3 px**, the boxes 7 px, and the truck 23 px wide.  "SHIPPING" fills the paper's width at that size, so it is as large as the paper allows.
- **Night** dims the faces with `--slip-night`, as the slips.
- **The news glow:** after a shift each clipboard glows softly (the room art cut to its outline, a gold glow breathing over 2 s, `clipFace.glow.pulseMs`) until it is opened once.  Steady with reduced motion.  It is a tip, so "Show instructions" off hides it.  The save's `lastShift.unread` remembers which still glow, so a reload keeps them.
- **An approved fake's log:** a glitter order APPROVED and packed gets GRIP's road and packing lines, one of the two "approved fake" lines at the middle, and always its own end.  The three lines are in `CONFIG.shipping.log.fake`, checked against the lore doc by script: identical.  Saved rows now carry `fake`.
- **Docs:** CHANGELOG, ARCHITECTURE (save data and the room), DESIGNS, TASKS, HANDOFF.
- **Smoke test:** both faces draw with their titles, truck, and lines, in both layouts; the card face's marks match the last shift (empty boxes before the first shift, ✔ and ✘ after each shift on desktop, one ✔ and two empty after the elf is sent packing on both layouts); both glow after a shift, neither with instructions off, the card's stops when the card is opened and the log's when the log is opened, and the save remembers both; an approved fake is packed, handed to the driver, shipped, and its log has exactly one of its own lines (not first or last) and ends with its own line.

**Calls to check**

1. **8.3 px titles.**  The painted paper is only about 50 px across at play size, so the titles are small, though bold and dark on light paper.  They read in the screenshots at real phone pixels (`-close` files).  Bigger would need bigger clipboards in the room art.
2. **The card clipboard glows right after the report card was shown.**  The order says both glow after a shift until opened, so the left one glows even though the card popped up on its own when the door closed.  Closing that first card does not count as opening the clipboard.  Easy to change if Nathan wants only the log to glow.
3. **Each glow stops on its own** when its clipboard is opened, not both together.
4. **A save from 1o** (a lastShift with no `unread`) shows no glow until the next shift.
5. **An approved fake's log** has 8 to 10 lines (one more than a normal log).
6. **The card face shows the first three rows.**  A TNP shift with boxes shipped shows ✘ for those and ✔ for the kept orders; the sent-packing shift shows one ✔ and two empty boxes.
7. **Reduced motion** (a steady glow) is in the css but not exercised by the smoke test.

**Proof** in `tools/out/` (`?ship=1`, not committed).  `wide` is 1400 x 900 at 2x; `tall` is 390 x 844 at 3x (phone pixels).  The mixed shift is a glitter fake DENIED (✔) with the two real orders left unstamped (✘); the glow is captured at the top of its breath.

- Before the first shift: `1p-<wide|tall>-<day|night>-before.png`
- After the mixed shift, glowing: `1p-<wide|tall>-<day|night>-after-shift.png`
- After opening both: `1p-<wide|tall>-<day|night>-opened.png`
- Close-ups of both clipboards for each of the above: the same names ending `-close.png`.  The phone close-ups (`1p-tall-*-close.png`) are at phone size, 3x.

Nothing was installed.  The report card, the log list, scoring, and the room art are unchanged.
