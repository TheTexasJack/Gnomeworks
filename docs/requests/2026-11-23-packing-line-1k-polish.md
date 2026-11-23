# Work order: Packing Line 1k, polish: rules toggle, rolling door, and two small fixes (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23.
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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.91**.  Smoke test: all clear, desktop and phone.

**Build time:** about 17 minutes, from `git pull` at 13:20 to the Result at 13:37 (CST).

**What was built**

- **The Packing rules toggle.**  The chart's heading is now one button across its full width (40 px tall, `chart.barMinPx`): the title on the left, a thin chevron on the right drawn as inline SVG (a 2 px stroke, round ends, the same shape as Claude.ai's expand chevrons).  It points down while minimized and turns up while open over 200 ms (`chart.turnMs`; no turn with reduced motion).  A tap toggles it, a finger that scrolls from the bar still scrolls, and Enter or Space work on it.  The first time the chart shows (with instructions on) it is open and `gnomeworks.rules` is set to `min`, so every later showing starts minimized; a tap stores `open` or `min`, and that choice wins from then on, reloads included.  Instructions off still hides the whole chart.
- **The rolling door.**  A copy of the closed room, clipped to the doorway grown by 2% on every side, sits over the open twin while the door moves.  I diffed the closed and open twins in both themes and layouts: with 2% padding nothing outside the clip differs, so the swap at either end shows no seam.  The clip's bottom edge climbs to its top edge along the doorway's slanted sides (`doorUpMs`, `doorDownMs`, 700 each).  The trip waits for it: the truck becomes visible only once the door is up, and on leaving the door rolls down after `closeDelayMs`, then the report card shows.  Reduced motion: a 250 ms crossfade (`doorCalmMs`).  The roller twins still draw in front of the chain.
- **The rattle.**  The sound system could make one, so `GW.sfx.rattle()` plays a run of short bandpassed noise ticks over a low rumble for as long as the door moves; its numbers are in `CONFIG.shipping.trip.rattle`.
- **The view button answers.**  `holdLeave(go, heard)` calls `heard` whenever a leave is set to wait for the report card (after the chain, or after Send it off).  `main.js` then gives the tapped button `.is-waiting`: the pressed look (down 2 px, inset shadow) plus a brighter face, a light brass border, and a soft glow.  It clears when the view switches, or when Shipping is tapped again to stay.
- **Transparent pictures on the open box.**  The cream card, border, and box shadow behind the item and tag are gone.  The item, tag, and supply pictures all carry the same shadow (a soft dark drop shadow plus a faint dark rim).
- **Docs:** CHANGELOG, ARCHITECTURE, DESIGNS, TASKS (the garage-door upgrade, the transparent pictures, and the view-button polish marked built), HANDOFF.
- **Smoke test:** a new `polishCheck` (desktop): after a reload the door is rolling with the truck still hidden right after the pull, the trip arrives, and the door layer is gone; the chart is minimized, its bar is the title plus the SVG chevron, a tap opens it (`aria-expanded` true); sending the driver off ends with the door closed and the card up; after another reload the chart starts open, because the player chose open.  `packCheck` now checks that the chart is open on its first showing in a fresh browser.

**Calls to check**

1. **Minimized, the five supply tiles still don't all fit without scrolling.**  I measured the supplies menu with the chart minimized.  On a 1400x900 desktop the list is 310 px tall and needs 353 (Stamps is cut off by 43 px).  On a 390x844 phone it is 208 px tall and needs 341.  Even with the chart hidden entirely (instructions off), the three sections need 301 px, which just fits on that desktop and is 93 px too tall on the phone.  A slim bar can't close that gap, so I left the menu's layout alone.  Ways to make the tiles fit: put the sections side by side (Packing and Stickers on one row), make the supply tiles shorter, or give the supplies menu a taller frame.  Each one changes the menu, so it needs a work order.
2. **The door is a wipe, not moving slats.**  As the order says, the clip shrinks upward; the slats themselves don't slide up into the roller.  At 700 ms it reads as a roll in the frames and the video.  If Nathan wants the slats to travel, the door needs its own art layer.
3. **The rattle is code-made.**  It is a placeholder like the stamp's thump.  A recorded rattle could replace it later.

**Proof** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844.

- Supplies menu with the chart open (first showing) and minimized: `1k-<wide|tall>-day-supplies-chart-open.png`, `-supplies-chart-min.png`; after a reload: `-supplies-after-reload.png`.
- Chevron close-ups: `1k-<wide|tall>-day-chevron-open.png` (up) and `-chevron-min.png` (down); the whole bar open: `-chart-bar-open.png`.
- The door mid-roll, three frames each way: `1k-<wide|tall>-day-door-up-<25|50|75>.png` and `-door-down-<25|50|75>.png` (the animation paused at 25, 50, and 75%).
- The pressed view button (The Machine): while the truck leaves, `1k-<wide|tall>-day-button-waiting-trip.png`; with the report card up, `-button-waiting-card.png`.
- The open box with a Teapot, peanuts, and bubble wrap on bare cardboard: `1k-<wide|tall>-<day|night>-open-box.png` (close-up) and `-open-box-room.png`.
- Video: Playwright's video works on Beast.  `1k-<wide|tall>-day-door-roll.webm` records that layout's whole proof run, which includes the door rolling up twice and down twice (the still frames pause it for a moment each).

Nothing was installed.  The rules, scoring, counts, stickers, stamp, menus' places, the truck, and the driver are unchanged.
