# Work order: Packing Line 1b.6, the truck backs into the room (v0.2)

**Status:** Reviewed and closed (desktop accepted; the phone restore was a misread, fixed in 1b.7)
**Written by:** Claudia, 2026-11-22, from Nathan's GIMP mock.  **Approved by:** Nathan, 2026-11-22 ("1b.6 approved", v0.2).
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

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.77**.  Still hidden: nothing shows without `?ship=1`.

**Step 2, phone back to draft.75.**  The tall layout block in `js/config.js` is identical to draft.75 (checked with a diff against da666af): `doorway [[79.3, 28.9], [94.1, 24.8], [93.8, 67.1], [78.6, 62.6]]`, `truck { h: 42.6, top: 26.2, xFrom: 95, xTo: 74.0 }`.  The phone chain, driver, and clip are as before; the new roller layer is hidden on phones.

**Step 3, desktop truck (mock 1).**
- **Measured from the mock:** both mocks show the room at 1114x627 (inside a grey border).  I matched the truck art's rear (alpha-masked) against them at every scale from 0.40 to 0.80.  The best match was at 0.605 in both mocks, at the same room position to the pixel (about 8 levels of error per colour channel, so it is the same picture).  In room terms: `h 54.04` (was 55), `top 22.14`, `xTo 74.24`.  `xFrom` stays 93, so it still slides in from the right, through the doorway.
- **The new clip,** `layouts.wide.truckClip`, replaces the doorway clip on desktop: `[[-10, -10], [80.3, -10], [80.3, 26.2], [93.2, 19.8], [93.0, 110], [-10, 110]]`.  The truck draws over the left jamb, the back wall, and the floor.  Only two things stay in front of it: the right jamb, cut at its inner edge (measured row by row on the Day and Night art: 93.06 to 93.25%), and the header, cut at the opening's top line.  The truck doesn't reach the header today; the cut is there in case a later truck does.  `doorway` stays in config (the phone still uses its own).
- **Wheels on the floor:** as in the mock, the rear wheel stands on the bay floor just behind the sill, and the bumper sits over the room floor.  Its lowest point is y 76.0%, beside the right jamb.
- **Code:** `js/shipping.js` uses `truckClip` when a layout has one, else `doorway`.  No change to the trip.

**Step 4, the chain (mock 2, Nathan's pick).**
- `layouts.wide.chain` is now `{ x: 93.45, top: 12.2, h: 57.8, hitW: 4 }`: centered on the hub of the roller's gear cap, hanging in front of the truck's wheel, handle bottom at y 70% as in mock 2.  The old desktop spot (`x 76, top -12, h 59`) is gone.
- **The roller in front:** a new layer, `.ship-roller`, repeats the room art (closed and open twins, so it follows the door and the theme) cut to `layouts.wide.roller`, an outline of the gear cap I traced on the art (Day and Night match).  It is drawn above the chain, so the chain comes out from under the cap.
- **The top never shows:** the chain's top end rests at y 12.2%.  The pull moves it down by 7% of its height (4.0% of the room), to 16.3%, still above the cap's bottom edge at the chain (16.9%).  The bounce moves it up by 30% of that, to 11.0%, still below the cap's top (about 9%).  Checked on screenshots at rest, at the deepest pull, and at the highest bounce: inside the cap not one pixel changes, while the chain below it moves (about 1,100 pixels change).
- **Tappable:** the chain draws in front of the truck and the driver, the roller layer ignores taps, and the trip check below drives every trip by tapping the chain.

**Step 5, the driver (desktop).**  He keeps his 1b.4 spot, `at [86.5, 80]`, because it still meets every rule with the truck parked:
- **Depth rule:** the truck's lowest point under him is y 76.0% (its wheel beside the right jamb).  His feet are at 80%, 4% lower, so he stands in front of it.
- **Clear of the chain:** checked against the real silhouettes, no overlap, with a 1.7% gap (about 12 px on a 1400px screen) at the closest row.
- **Clear of the bench and conveyor, and on screen:** he spans x 81.4 to 91.6%, right of the bench (which ends at 71.4%).  His feet are above the conveyor's top (83.8%).
- **What he covers:** the lower right of the truck's rear (the right door's lower half and the right tail light) and part of the wheel.  At full size, no spot between the bench and the chain leaves the rear doors uncovered, since the doors span x 75 to 84% and he is 10.7% wide.  Moving him right toward the chain only gains about 0.5% before he touches it.  `from` is unchanged, so he still fades in and walks a short way down.

**Checks.**
- `node tools/smoke-test.js`: "All clear." (v0.2.0-draft.77).  Stamped 16 links.
- **Trip check** (scratch, not committed), wide and tall, Day and Night: a tap starts the arrival, a second tap mid-arrival is ignored, the trip reaches `here`, a tap sends it away to `closed`, and a second trip works.  No page errors.  The roller layer shows on desktop only.

**Screenshots** (in `tools/out/` on Beast, `?ship=1`, truck parked, 2x pixel density):
- `ship-1b6-wide-day.png`, `ship-1b6-wide-night.png`
- `ship-1b6-tall-day.png`, `ship-1b6-tall-night.png`
- `ship-1b6-wide-day-roller-rest.png` and `ship-1b6-wide-day-roller-midpull.png`: close crops of the chain's top at the roller, at rest and at the deepest pull.
- `ship-1b6-wide-day-vs-mock1.png`: Nathan's mock 1 (left) and the game (right) at the same size, side by side.

**Docs updated:** `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/HANDOFF.md`, `docs/TASKS.md`, and the comments in `CONFIG.shipping`.  The 1b.5 sentence in ARCHITECTURE.md is removed, since 1b.5's numbers are gone (desktop uses `truckClip`, and the phone is back to draft.75).

**Not done (per the order):** no change to the trip's timing or the door, nothing from 1c-2 on, nothing installed.

## Review (Claudia, 2026-11-22)

Pulled 3177cb7 and rendered it.  Desktop matches Nathan's mock 1: the truck's rear sits in the room in front of the wall, only the right frame is in front, and there is no gap.  The chain hangs on the right in front of the wheel and comes out from behind the roller's gear.  The phone is back to draft.75.  Open for Nathan: the driver, at his 1b.4 spot, covers the lower half of the truck's right door and right tail light.

