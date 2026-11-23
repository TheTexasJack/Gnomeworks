# Work order: Packing Line 1k, polish: rules toggle, rolling door, and two small fixes (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

Four polish items on Beta 1, all small, all things a player sees every shift.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "Add a minimize to the Packing rules so after that it starts minimized with a [down arrow] or similar arrow so people know to expand it for the rules."
- "The down arrow is preferred, but I'm fine with just a triangle.  No words.  Just a symbol that is universal that means expand.  It's even used all throughout Claude.ai, so whatever symbol those are, that's what we want to emulate."
- "Future upgrade: the shipping door opens and closes smoothly, rolling up like a garage door, in place of the instant swap built in 1a" (TASKS, 2026-11-22).
- "Icons on the boxes should be transparent, or at least, not white" (1i test).

## Read first

- `CLAUDE.md`, the 1a, 1b, 1f, 1i, and 1j orders and their Results.
- `js/shipping.js` (the chart, the door twins, the trip, the view switch after the chain), `js/main.js` (the view buttons), `css/style.css` (`.box-label`), `CONFIG.shipping.trip`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The Packing rules toggle.**
    - A thin **chevron** drawn in code (inline SVG, no font glyph, no words), like the expand chevrons in Claude.ai: pointing **down** when the chart is minimized, turning to point **up** when it is open, with a short rotate.  It sits at the right end of the chart's heading bar, and the whole bar is the tap target (big enough for a finger).
    - **Open the first time** the supplies menu shows the chart; **minimized from then on** unless the player opens it.  Remember the player's choice per browser (`localStorage`, like the instructions setting), and survive a reload.
    - Minimized, the chart is a single slim bar, so the Packing, Stickers, and Stamps tiles show without scrolling.
    - "Show instructions" off still hides the chart entirely, bar and all (1j).
3. **The rolling door (TASKS, 2026-11-22).**  Opening: the closed door rolls up into the roller, revealing the open twin from the bottom up (a clip on the closed twin that shrinks upward), before the truck starts backing in.  Closing: it rolls back down after the truck is gone.  Keep the roller drawn in front of the chain as now.  Timings in `CONFIG.shipping.trip` (`doorUpMs`, `doorDownMs`, draft 700 each); the trip waits for the door.  Reduced motion: a short crossfade in place of the roll.  If the game's sound system can make a short rattle, add one (config); if not, say so in the Result.
4. **The view button answers (1f review).**  After the chain is pulled, a tapped view button shows at once that it was heard: it stays lit in its pressed style until the report card closes and the view switches.
5. **Transparent pictures on the open box (Nathan, 1i).**  Drop the cream card behind the item, tag, and supply pictures on the open box.  They sit straight on the box with a soft dark shadow so they read on the cardboard, Day and Night.
6. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md`, and add smoke-test checks: the chart starts open on a fresh browser and minimized after a reload; the trip still completes with the rolling door.  Run it.
7. **Proof** into `tools/out/`, both layouts, Day: the supplies menu with the chart open and minimized (close-ups of the chevron both ways), three frames of the door mid-roll, the pressed view button while the card is up, and an open box with its pictures on the bare cardboard (Day and Night).  A short video of one door roll if Playwright's video works on Beast.  List them in the Result.
8. In the Result, record how long the build took.
9. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the rules, scoring, counts, stickers, stamp, menus' places, the truck, or the driver.
- Use a font character for the chevron (some phones draw rare arrows as an empty box).
- Install anything.

## Done when

- The chart opens the first time, starts minimized after that, and the chevron flips with it; instructions off still hides it.
- The door rolls up before the truck and down after it, both layouts, with a crossfade under reduced motion.
- A view button tapped after the chain stays lit until the switch.
- The open box's pictures sit on the cardboard with no cream card.
- The smoke test passes and the proof exists.

## Result (filled in by Claude Code)

