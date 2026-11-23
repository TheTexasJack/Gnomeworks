# Work order: Packing Line 1n, hand the box to the driver (v0.1)

**Status:** Done
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

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.94**.  Smoke test: all clear, desktop and phone.

**Build time:** about 24 minutes, from `git pull` at 15:37 to the push at 16:01 (CST).

**What was built**

- **The stamp stops sending.**  `stampBox()` sets the box's stamp (`boxStamp`), brings the mark down with its thump, and nothing else; the `stamped` box state is gone.  Stickers and the stamp go on in any order.  The stamp shows only while the box is closed, like the stickers, so reopening hides both and closing brings them back.  A different region's stamp replaces the first (only Gnomerica's exists for now).  The 1j note is updated in DESIGNS and ARCHITECTURE.
- **Dragging the box.**  The bench box has its own pointer handling with the menus' feel (`pack.holdMs` 220 and `pack.slopPx` 8): a mouse lifts it after the slop, a finger after a short hold or a move past the slop, and a press that never lifts is a tap that closes or reopens it.  While lifted, the box itself follows the pointer.  Checked on the phone with real touch events: a drag hands it over and a plain touch tap still closes it.
- **The driver is the drop target.**  His picture's outline grown by `pack.hand.padX` 25% of his width and `padY` 8% of his height on each side (draft numbers), the same for GRIP's driver and the elf.  He glows brighter while a closed box is over him.  Dropped on him, the box is recorded for the hand-off, slides from where it was dropped to the stack at his feet (the same spots and look as before), with a thump, and the next APPROVED order's box comes out.  Dropped anywhere else, or open, it springs back to the bench over `hand.backMs` 320 (a snap with reduced motion).  Pulling the chain with a closed box on the bench ships it as is, now with its stamp if it has one.
- **The tip.**  While a closed box sits on the bench, a brass tag above the driver reads **"Hand it to the driver!"** (`tips.hand`, Claudia's draft wording; `layouts.<layout>.handTag`), and the driver gets a soft gold outline glow that breathes like the other tips (steady with reduced motion).  Both turn off with "Show instructions."  The computer's glow now asks only for a closed box with no stamp.
- **The sent-packing card wraps.**  "TNP driver sent packing!" breaks onto two lines at the town line's full size instead of shrinking.
- **Config:** `pack.hand`, `tips.hand`, `layouts.wide.handTag` [85.5, 41.5, 14], `layouts.tall.handTag` [79, 58.5, 34].  `pack.setAsideDelayMs` is gone (nothing waits after a stamp now).
- **Docs:** CHANGELOG, ARCHITECTURE, DESIGNS (Nathan's words, the rules, and what was built), TASKS, HANDOFF.
- **Smoke test:** the Breakable box gets its stamp first, then FRAGILE, and the stamp leaves the box on the bench; shift 1 still scores every row right.  It checks the driver tip shows beside a closed box, hides with instructions off and beside an open box; a tap reopens a stamped box (stamp hidden and kept); an open box dropped on the driver springs back to the same spot and isn't taken; a closed box dropped short of the driver springs back; every box is handed over by a mouse drag to the driver.  The Toilet shift now leaves its closed, stamped box on the bench and pulls the chain: it ships and reads only "No HEAVY".

**Calls to check**

1. **Tag wording** "Hand it to the driver!" is Claudia's draft, as the order says.
2. **A thump when the box lands on the stack.**  The order didn't name a sound; I reused the stamp's thump so the hand-over has a feel.  One line to remove.
3. **A different region's stamp replaces the first.**  The order didn't say; it lets a player fix a wrong stamp once there are more regions.  Today only Gnomerica's stamp exists.
4. **The stamp hides while the box is open**, like the stickers (the open box's art has no front face to hold it).
5. **The tag sits above the driver's head.**  On the phone it overlaps the truck's back a little, and on desktop it sits just left of the chain.
6. **The open box can be dragged too** (so it can spring back, as the order describes), but only a closed box makes the driver glow brighter or gets taken.

**Proof** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844; the phone runs used real touch events.

- A stamped box still on the bench with FRAGILE added after: `1n-<wide|tall>-day-stamped-then-fragile.png`.
- The box mid-drag over the driver with the tip and his glow: `1n-<wide|tall>-day-drag-over-driver.png`.
- The box landing on the stack, mid-slide: `1n-<wide|tall>-day-landing.png`; settled, with the next box out: `-on-stack.png`.
- An open box over the driver (no tip): `1n-<wide|tall>-day-open-over-driver.png`; springing back: `-open-springing-back.png`.
- The two-line sent-packing card: `1n-<wide|tall>-day-card-sent-packing.png`.

Nothing was installed.  Scoring, supplies, stickers, the stamp's spot, the menus, and the truck and driver placement are unchanged.
