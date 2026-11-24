# Work order: Packing Line 1q.1, the How to Ship bookshelf (v0.1)

**Status:** Approved
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
