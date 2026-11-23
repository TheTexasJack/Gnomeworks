# Work order: Packing Line 1p, faces for the two clipboards (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23.  **Approved by:** (waiting on Nathan)
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
6. **An approved fake's log** (lore doc v0.2, draft lines awaiting Nathan's approval with this order): the normal GRIP road lines, plus one of the two "approved fake" lines in the middle, and its own end line.
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

