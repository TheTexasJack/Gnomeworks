# Work order: Packing Line 1q.1, the How to Ship bookshelf (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23, with the glow and the good shift rule ("you got my ok!").
**Model:** Opus 5.5

## Goal

Swap 1q's code-drawn "How to Ship" tag for Nathan's painted bookshelf on the room's wall, placed as in his mocks, so the book feels like part of the room.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "On the how to ship...The icon is ... out of place.  Let me grab a boo[k] icon we can place on the shipping table."
- "Here is a bookshelf.  I did some mockups.  yes, it's small.  It will be fine."

## Read first

- `CLAUDE.md`, the 1q order and its Result.
- The art: `art-masters/packing-line/39-how-to-ship-shelf/how_to_ship_shelf.png` (1774 x 887, transparent; checklist item 39).
- Nathan's mocks: `docs/art-style/references/how-to-ship-shelf-mock-wide.png` (desktop) and `-tall.png` (phone).  The dashed box in each marks the spot.
- `js/shipping.js` (the book button), `CONFIG.shipping.tutorial.book`, `tools/tutorial-shots.js`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The game copy:** make a small WebP of the shelf with `tools/art.py` (trim the clear edges, about 2x its largest size on screen), in `assets/packing/`.
3. **The shelf is the button:** it replaces the tag on both layouts.  A tap anywhere on it opens the How to Ship book, as the tag did.  No visible words on it; the button keeps its screen reader label ("How to Ship").
4. **Placement from Nathan's mocks.**  Claudia measured the dashed boxes, in % of the room: desktop about **x 19.6, y 36.2, w 12.3, h 10.9** (right of the porthole, above the computer, left of the lower parchment frame); phone about **x 6.1, y 31.3, w 26.1, h 7.3** (under the porthole, left of the STONKS screen).  Fit the shelf inside its box, keeping its shape, and match the mocks by eye; it must not overlap the porthole, the screen frame, or the parchment frames.  Record the final numbers in the Result.
5. **One spot:** the shelf replaces both 1q spots, so drop the `wall` and `top` switch (`book.place`) and its `top` spot.
6. **Night** dims the shelf with the room.  It sits on the wall: above the room art, below the slips, boxes, driver, menus, and pop-ups.
7. **A cue (Claudia's draft, approved by Nathan):** the shelf glows softly, like the clipboards, from the moment the book has its first page until the player opens it once, then never again (remembered in the save).  It is a tip, so it follows "Show instructions."  Steady with reduced motion.
8. **Good shift: every row ✔ (Claudia's ruling on 1q call 2, approved by Nathan 2026-11-23):** a GRIP shift is good only when every row on its report card is ✔, so approving a glitter fake (its row ✘) makes it not a good shift.  Page 1 says "Get every order right."  TNP trips still count neither way.
9. **Remake the tutorial pictures** with `tools/tutorial-shots.js`, so any picture that shows that wall shows the shelf.
10. Every number in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and `docs/ASSETS.md`, and update `tools/smoke-test.js`: the shelf shows on both layouts and opens the book; no tag remains; it glows until first opened and not after; a shift with an approved glitter fake and every real order ✔ is not a good shift.  Run it.
11. **Screenshots** into `tools/out/`, both layouts, Day and Night: the room with the shelf (glowing and not), a close-up of the shelf at phone size, and the book opened from it.  Put each beside Nathan's mock in the Result's list.
12. In the Result, record how long the build took.
13. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the shelf's art, the tutorial's words, scoring other than the good shift rule, or the room art.
- Install anything.

## Done when

- The shelf sits where Nathan's mocks put it on both layouts, and a tap opens the book.
- The tag and the `top` spot are gone.
- The glow shows until the shelf is first opened.
- A shift with an approved fake is not a good shift.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.98**.  Smoke test: all clear, desktop and phone.

**Build time:** about 35 minutes, from `git pull` at 21:12 to the Result at 21:47 (CST).

**What was built**

- **The game copy:** `assets/packing/how_to_ship_shelf.webp`, 240x148, 16 KB, transparent.  Clear edges trimmed with Pillow (alpha over 8: box (269, 62, 1505, 826) of the master), then `tools/art.py resize --width 240`.  The shelf draws at most about 85 to 120 px wide (the room tops out near 1000 px), and 68 px on a 390 px phone (204 device px at 3x), so 240 is about 2x.  I first made it 360 wide and cut it down after measuring.
- **The shelf is the button** on both layouts: the painted art in a `role="button"` with `aria-label="How to Ship"` and no words.  A tap anywhere on it opens the book, as the tag did.  It is first in the room after the room art (and the door), so the board, clipboards, truck, driver, boxes, menus, and pop-ups all draw over it.  At Night it dims with `--slip-night`, like the slips and clipboard faces.
- **Placement.**  Nathan's mocks have the room art's exact shape (1011x569 and 314x559), so I measured the painted shelf inside each dashed box and used those numbers:

  | Layout | x | y | w | h (from the art's shape) |
  | --- | --- | --- | --- | --- |
  | desktop (`wide`) | 21.5 | 37.1 | 8.5 | 9.4 |
  | phone (`tall`) | 10.1 | 31.9 | 18.3 | 6.3 |

  It sits in Claudia's boxes (desktop 19.6/36.2/12.3/10.9, phone 6.1/31.3/26.1/7.3), clear of the porthole, the STONKS frame, and the parchment frames.  On desktop its bottom edge touches the top of the computer's tap area (46.4%) without overlapping it.  In `CONFIG.shipping.tutorial.book.spot`.
- **One spot:** `book.place`, `book.spots`, the `top` spot, the old brass tag's CSS, and the `testBookPlace` test hook are gone.  `book.label` is now plain "How to Ship" (the screen reader name), and `book.img` names the art.
- **The glow:** while the book is new, the art gets the clipboards' gold drop-shadow glow, breathing over `clipFace.glow.pulseMs` (steady with reduced motion; the glow pulses, the shelf itself never fades).  New = at least one page seen and `tutorial.bookOpened` not set.  Opening the book sets `bookOpened` in the save, so it never glows again.  `?tutorial=reset` clears it with the seen pages.  `GW.tutorial.onChange` tells the room to redraw the glow when a page is first seen or the book opens.  With "Show instructions" off, no glow.
- **Good shift:** `good = every row ✔` (and at least one row).  An approved glitter fake's ✘ row spoils it.  TNP trips still never count.  Page 1's words are unchanged.
- **Tutorial pictures** remade with `tools/tutorial-shots.js`.  It no longer hides the shelf, and marks the book opened so the shelf shows without its glow.  `pack.webp` is the one that shows that wall.
- **Docs:** CHANGELOG, ARCHITECTURE (save data, the tutorial), ASSETS, DESIGNS, TASKS, HANDOFF, and checklist item 39 marked integrated.
- **Smoke test** (`tutorialCheck`, both layouts): the shelf is the art, has no words or spans, is named "How to Ship", sits inside the room, and nothing covers its middle.  A tap opens the book (only the seen pages, back and next).  The glow is off before any page, on after the welcome page, off with instructions off, still on until opened, off once opened (and saved), not back when the fakes page is seen later, off after reloading a save with `bookOpened`, on for older saves with shifts, and back after `?tutorial=reset`.  A shift with an approved fake (two Soft orders, Socks and Sponge, one made a fake) and every real order packed right scores rows `✘,✔` with `good` false and no "Good shift!" line.

**Calls to check**

1. **All-fakes boards:** read literally, "every row ✔" makes a board whose every order is a fake, all DENIED, a good shift.  1q's call 4 had it never good.  Fakes come one per board (`perBoard: 1`) with 3 orders, so it can't happen now.
2. **Glow for players who already have pages:** any save with a seen page and no `bookOpened` glows, including saves from before 1q.1 where the player already opened the old tag's book.  The save never recorded that, so I can't tell them apart.
3. **The shelf is small**, as Nathan said: 58x36 px on the 1400x900 desktop and 68x42 px on a 390 px phone.  On the phone it is just under the usual 44 px tap height; the whole shelf is the tap area.

**Screenshots** in `tools/out/` (`?ship=1`, not committed).  `wide` = 1400x900 at 2x, `tall` = 390x844 at 3x.  Each beside Nathan's mock:

| Screenshot (for `<day|night>`) | Nathan's mock |
| --- | --- |
| `1q1-wide-<theme>-vs-mock-glow.png`, `1q1-wide-<theme>-vs-mock.png` (the mock on the left, the room on the right, glowing and not) | `how-to-ship-shelf-mock-wide.png` |
| `1q1-tall-<theme>-vs-mock-glow.png`, `1q1-tall-<theme>-vs-mock.png` | `how-to-ship-shelf-mock-tall.png` |
| The room alone: `1q1-<layout>-<theme>-room-glow.png`, `-room.png` | the mock for its layout |
| Close-ups (phone size on `tall`): `1q1-<layout>-<theme>-shelf-close-glow.png`, `-shelf-close.png` | the mock's dashed box |
| The book opened from the shelf: `1q1-<layout>-<theme>-book-open.png` | none (no mock) |

Nothing was installed.  The shelf's art, the tutorial's words, the room art, and scoring other than the good shift rule are unchanged.
