# Work order: Packing Line 1b.7, the phone room matches Nathan's mock (v0.1)

**Status:** Reviewed (Claudia, 2026-11-23); waiting on Nathan's look
**Written by:** Claudia, 2026-11-23, from Nathan's phone mock.  **Approved by:** Nathan, 2026-11-23 ("1b.7 approved").
**Model:** Opus 5.5

## Goal

Do for the phone (tall room) what 1b.6 did for desktop: the truck backs into the room, the chain moves to the right side of the doorway and comes out from behind the roller, and the driver waits in front of the bench end.  Match Nathan's phone mock.  Desktop does not change.  Still hidden behind `?ship=1`.

## Nathan's direction (2026-11-23, his words)

"ok.  phone is wrong.  Chain didn't move, the truck it's behind the door still, which is NOT what it was.  here is a mock up that the phone layout needs to match."

(1b.6 restored the phone to its draft.75 values on Claudia's reading of an earlier comment.  That reading was wrong; this mock is the target.)

## The target

`docs/art-style/references/truck-backed-in-mock-nathan-phone.png` (461x808):
- The truck's rear doors and bumper sit **in the room**, in front of the left door frame and the back wall, to the right of the clipboards.  Its side and wheel go back through the doorway, with only the right side of the frame in front of them.
- The chain hangs on the **right** side of the doorway, in front of the truck's wheel, coming out from the roller at the top right.
- The driver (grumpy) stands in front of the bench's right end, his boots lower on screen than the bench's front legs and the truck's lowest point, fully on screen, clear of the chain.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/requests/2026-11-22-packing-line-1b6-truck-backs-into-room.md` and its Result (how desktop was done: the right-frame-only clip, the roller cover for the chain's top, the measuring against the mock).
- `js/shipping.js` and `CONFIG.shipping.layouts.tall`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The truck (tall).**  Clip it only where the right side of the door frame (and the header above the opening, if reached) is in front of it, the same way as desktop.  Measure its size and stopping place from the phone mock and match them.  The wheels rest on the floor.  It still slides in from the right through the doorway.
3. **The chain (tall).**  Move it to the right side of the doorway in front of the truck's wheel, as in the mock, with its top hidden behind the roller's gear the same way as desktop, so the meeting point never moves when pulled.  It draws in front of the truck and stays tappable.  Remove the old tall chain spot.
4. **The driver (tall).**  Grumpy, at full size (the 1b.2 ratio), standing where the mock has him, following the depth rule, clear of the chain, fully on screen.  If that can't be met, stop and report with options.
5. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
6. **Screenshots** into `tools/out/` with `?ship=1`, truck parked, at 390x844: tall Day, tall Night, a close crop of the chain's top at the roller (at rest and mid-pull), and tall Day side by side with Nathan's phone mock at the same size.  Also one wide Day to show desktop is unchanged.  List them in the Result.
7. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change desktop (the wide room).
- Change the trip's timing or the door.
- Build anything from 1c-2 on, or install anything.

## Done when

- The phone matches Nathan's mock: truck backed into the room, chain on the right from behind the roller, driver in front of the bench end.
- Desktop is unchanged.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.78**.  Still hidden: nothing shows without `?ship=1`.  Only `layouts.tall` changed in `js/config.js`; `layouts.wide` and the code paths desktop uses are untouched.

**Measuring the mock.**  The room sits in Nathan's 461x808 mock at 460x816 (scale 0.511, the same both ways), offset 2 px right, with its bottom 8 px cropped.  Found by matching the open room art against the mock's untouched left side (error 0.004).  The truck art's rear matched best at scale 0.415 of the art (a clear minimum), and the grumpy driver at 205 px tall.

**Step 2, the truck (tall).**
- `truck { h: 28.48, top: 37.99, xFrom: 95, xTo: 63.7 }`, measured from the mock.  It is smaller than draft.75's 42.6, as in the mock.
- New `layouts.tall.truckClip`: `[[-10, -10], [79.3, -10], [79.3, 28.9], [95.3, 24.47], [95.0, 110], [-10, 110]]`.  The truck draws over the left jamb, the back wall, and the floor.  Only the right jamb (its inner edge, measured row by row on the Day and Night art: 95.0 to 95.33%) and the header (the opening's top line) stay in front of it.  The truck doesn't reach the header.
- **Wheels on the floor:** its lowest point is y 66.35%, on the doorway's floor line beside the right jamb (the sill there is about 66 to 67%).
- It still slides in from the right: `xFrom 95` starts it fully behind the right jamb.
- No code change was needed: `js/shipping.js` already uses `truckClip` when a layout has one.  Only its header comment changed.

**Step 3, the chain (tall).**
- `chain { x: 95.0, top: 18.5, h: 45, hitW: 9 }`, centered on the hub of the roller's gear cap, hanging in front of the truck's wheel, handle bottom at 63.5% as in the mock.  The old tall spot (`x 74, top 6.5, h 45.5`) is gone.
- New `layouts.tall.roller`: the gear cap's outline traced on the art (Day and Night match), plus the dark housing above it, drawn in front of the chain.
- **The top never shows:** the pull moves the top end to 18.5 + 3.15 = 21.65%, above the cap's bottom edge at the chain (22.2%).  The bounce moves it up to 17.55%, inside the roller outline (top 16.5%).  Checked on screenshots at rest, deepest pull, and highest bounce: inside the cap 0 pixels change, while about 1,600 change on the chain below it.
- **Tappable:** the chain draws in front of the truck and the driver, the roller ignores taps, and the trip check below drives every trip by tapping the chain.

**Step 4, the driver (tall).**  Grumpy, full size (`h 23`, the 1b.2 ratio; the mock has him a little larger, about 25%), `at [83.7, 85.1]`, where the mock has him: center x and boot line matched to the mock.
- **Depth rule:** his boots are at y 84.7%, lower than the bench's front legs (80.75%) and the truck's lowest point (66.35%).  Above the conveyor's top (86.8%).
- **Clear of the chain:** checked with the real silhouettes, no overlap at rest, at the deepest pull, or at the bounce.  Closest gap 2.6% of the room's width at the deepest pull (about 10 px on a 390 px phone).
- **On screen:** he spans x 72.1 to 95.2%, y 62.4 to 84.7%.
- `from` is unchanged (`[86, 65]`, scale 0.8), so he still fades in and walks down from the doorway.

**Checks.**
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.78).  Stamped 16 links.
- **Trip check** (scratch, not committed), tall and wide, Day and Night: a tap starts the arrival, a second tap mid-arrival is ignored, the trip reaches `here`, a tap sends it away to `closed`, and a second trip works.  No page errors.

**Screenshots** (in `tools/out/` on Beast, `?ship=1`, truck parked, 390x844 at 2x pixel density):
- `ship-1b7-tall-day.png`, `ship-1b7-tall-night.png`
- `ship-1b7-tall-day-roller-rest.png`, `ship-1b7-tall-day-roller-midpull.png` (deepest pull), and `ship-1b7-tall-day-roller-bounce.png`: close crops of the chain's top at the roller.
- `ship-1b7-tall-day-vs-mock.png`: Nathan's phone mock (left) and the game (right) at the same size, side by side.
- `ship-1b7-wide-day.png`: desktop (1400x900), unchanged.

**Docs updated:** `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/HANDOFF.md`, `docs/TASKS.md`, and the comments in `CONFIG.shipping`.

**Not done (per the order):** no change to desktop, the trip's timing, or the door; nothing from 1c-2 on; nothing installed.

## Review (Claudia, 2026-11-23)

Pulled aa8ef30 and rendered the phone beside Nathan's mock at the same size.  The truck, chain, and driver match the mock's placement; the driver is slightly smaller than the mock (23% against about 25% of the room height) because he keeps the 1b.2 ratio.

