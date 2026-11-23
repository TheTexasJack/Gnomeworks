# Work order: Packing Line 1b.7, the phone room matches Nathan's mock (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-23, from Nathan's phone mock.  **Approved by:** (waiting on Nathan)
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

