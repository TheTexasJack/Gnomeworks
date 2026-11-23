# Work order: Packing Line 1b.6, the truck backs into the room (v0.2)

**Status:** Draft
**Written by:** Claudia, 2026-11-22, from Nathan's GIMP mock.  **Approved by:** (waiting on Nathan)
**Model:** Opus 5.5

## Goal

On desktop, the truck backs up **into the room**: its rear comes through the doorway and sits in front of the wall, with only the right side of the door frame in front of it.  On phones, go back to the draft.75 placement.  Still hidden behind `?ship=1`.

## Nathan's direction (2026-11-22, his words)

- On 1b.5: "the phone position earlier was correct.  This one isn't."
- On the mocks of the truck sliding further left: "Neither.  none of these.  There is still a gap, and now all of them are just more of the truck.  The problem is the cut out is JUST the door and not crossing over into the room, so the truck is not being backed up into the room."
- "look at this sample I did in GIMP.  you can see the truck clearly.  Does it cover the chain?  just the bottom, its still clickable.  and even then, it can be moved to the other side and set to the wheel, see the second image here as an example of the chain in front."

## The target (Nathan's GIMP mocks, desktop)

- `docs/art-style/references/truck-backed-in-mock-nathan-1.png`: the truck's rear doors and bumper are inside the room, in front of the left door frame and the back wall, beside the bench.  The right side of the door frame stays in front of the truck's side and wheel.  The chain stays left of the door, and the truck covers only its bottom.
- `docs/art-style/references/truck-backed-in-mock-nathan-2.png`: the same truck, with the chain moved to the right side of the doorway, hanging in front of the wheel.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- Both mocks above, and the Results of 1b, 1b.1, 1b.4, and 1b.5.
- `js/shipping.js` and `CONFIG.shipping`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Phone (tall room): back to draft.75.**  Restore the tall layout's `doorway` and `truck` values from before 1b.5: `doorway: [[79.3, 28.9], [94.1, 24.8], [93.8, 67.1], [78.6, 62.6]]`, `truck: { h: 42.6, top: 26.2, xFrom: 95, xTo: 74.0 }`.  Nothing else on the phone changes.
3. **Desktop (wide room): match Nathan's mock 1.**
    - The truck is no longer clipped to the doorway.  It is clipped only where the **right side of the door frame** (the right jamb, and the header above the opening if the truck reaches it) is in front of it.  Everywhere else the truck draws in front of the room: over the left jamb, the back wall, and the floor.
    - Size and stopping place: measure the truck in mock 1 (its height and its rear-left corner, as % of the room) and match them.  The wheels rest on the floor.
    - The slide-in still comes from the right, through the doorway.
4. **The chain (desktop), Nathan's pick (2026-11-22): "Move it to the right, but the cut off is the rotating garage so when you pull it, it doesn't move up and down at that spot."**
    - Move the chain to the right side of the doorway, hanging in front of the truck's wheel, as in mock 2.
    - Its top comes out from behind the garage door's roller (the rotating drum at the top of the doorway).  Draw the roller in front of the chain there, so the chain's top end is always hidden behind it.  When the chain is pulled, the pull and bounce show only below the roller; the place where the chain meets the roller never moves up and down.
    - The chain draws in front of the truck and stays tappable.
    - Remove the chain's old desktop spot.  The phone keeps its chain as is.
5. **The driver (desktop).**  The truck now fills the spot where he stood.  Place him so he follows the depth rule (feet lower on screen than the truck's bumper and wheels), fully on screen, clear of the bench and the chain, and say where in the Result.  If there is no such spot at full size, stop and report with options, as in 1b.3.
6. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
7. **Screenshots** into `tools/out/` with `?ship=1`, truck parked: wide Day, wide Night, tall Day, tall Night, a close crop of the chain's top at the roller (wide Day, at rest and mid-pull), plus a wide Day image laid side by side with Nathan's mock 1 at the same size, for comparison.  List them in the Result.
8. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the phone beyond restoring the draft.75 values.
- Change the trip's timing or the door.
- Build anything from 1c-2 on, or install anything.

## Done when

- On desktop the truck's rear sits in the room in front of the wall, as in mock 1, with only the right door frame in front of it and no gap.
- The chain hangs on the right in front of the wheel, comes out from behind the roller with its top always hidden, and stays tappable.
- The phone matches draft.75.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)
