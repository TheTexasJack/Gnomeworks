# Work order: Packing Line 1n, hand the box to the driver (v0.1)

**Status:** Approved
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23.
**Model:** Opus 5.5

## Goal

Today the region stamp also sends the box: the moment it lands, the box slides to the stack.  So stickers must go on before the stamp, and a player who stamps first can't add FRAGILE.  From now on the stamp is just another mark, and the player sends a finished box on purpose by dragging it to the driver, who sets it on the ground.  Still hidden behind `?ship=1`.

## Nathan's words (2026-11-23)

- "Once a user places the location stamp, it's shipped.  We need a way for the user to apply all stamps and item and then send it."
- "Let's drag the box to the driver.  He can put it on the ground."

## Rules (Claudia's drafts, approved by Nathan 2026-11-23)

- **Any order:** close the box, add stickers and the stamp in any order, reopen to fix something, then hand it over.
- **Only a closed box can be handed over.**  An open box dropped on the driver springs back to the bench.
- **Handing over without a stamp or stickers is allowed.**  It scores those ❌s, as today.
- **Pulling the chain with a closed box still on the bench** ships it as is (1e's rule).  An open box there is "Not packed."
- **A tap on a closed box still reopens it.**

## Read first

- `CLAUDE.md`, the 1d, 1g, 1j, 1l, and 1m orders and their Results.
- `js/shipping.js` (the box, the stamp's set-aside, the stack, the drag, the driver and elf), `CONFIG.shipping.layouts.<layout>` (the stack, the driver).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **The stamp stops sending.**  Stamping lands the mark with its thump and nothing else; the box stays on the bench.  Stickers may go on before or after the stamp.  Update the 1j note ("before its stamp") in DESIGNS and ARCHITECTURE.
3. **Dragging the box.**  A closed box on the bench can be dragged with a finger or a mouse, using the menus' drag feel (a short hold or a move past the slop picks it up; a plain tap still reopens it).
4. **The driver is the drop target** (the GRIP driver or the elf alike): his outline, padded in config so a finger finds him even where the box or stack covers part of him.  Dropped on him, the box goes to the stack at his feet, the same spot and look as now ("he puts it on the ground"), and the next approved order's box comes out (1l's rule).  Dropped anywhere else, it slides back to the bench.
5. **The tip.**  While a closed box sits on the bench, a small brass tag near the driver reads "Hand it to the driver!" (draft wording, Claudia; record it in the Result), and the driver gets a soft outline glow.  Both follow "Show instructions."  Reduced motion: no pulse.
6. **The sent-packing card wraps (1m call 5).**  "TNP driver sent packing!" may take two lines instead of shrinking, since it's the card's only row.
7. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and DESIGNS, and update `tools/smoke-test.js`: stamp first then add FRAGILE, then hand it over, and it scores right; an open box dropped on the driver springs back; a closed box left on the bench at the chain ships.  Run it.
8. **Screenshots** into `tools/out/`, both layouts, Day: a stamped box still on the bench with its FRAGILE added after, the box mid-drag over the driver with the tip showing, the box landing on the stack, an open box springing back, and the two-line sent-packing card.  List them in the Result.
9. In the Result, record how long the build took.
10. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change scoring, supplies, stickers, the stamp's spot, the menus, or the truck and driver placement.
- Install anything.

## Done when

- The stamp no longer sends the box; marks go on in any order.
- A closed box dragged onto the driver lands on the stack; anything else springs back.
- The tip shows near the driver and turns off with instructions.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

