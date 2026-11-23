# Work order: Packing Line 1m, elf imposters and fake trucks (v0.2)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23 ("Elves should always show up with their fake trucks...  everything else approved.").  **Build after 1l is reviewed.**
**Model:** Opus 5.5

**v0.2 (2026-11-23):** step 7a, "Not approved" on the report card (Nathan's test of draft.92).

## Goal

The second half of TNP Corp.  From shift 4, some trips are TNP trips: an elf imposter in his fake truck.  The right move is to send him away by pulling the chain without filling anything.  Still hidden behind `?ship=1`.

## Decisions (Nathan, 2026-11-22 and 2026-11-23)

- **Elves always arrive in their fake trucks.**  A trip is all GRIP (real truck, real driver) or all TNP (fake truck, elf).  No mixed trips.
- **Any driver is sent away with the door chain.**
- **An elf sent away:** a small hit to TNP (their line down).  **Filling an elf's orders is bad:** ours down, TNP up.
- **After sending a driver away,** the player can open the door again for a new random driver.  **No more than 2 TNP drivers in a row** (config).
- **The elf's own slips have no glitter;** the elf and truck are the tell.  They still get stamped like any slip (1l).
- Elves follow the driver moods: grumpy while waiting, happy on success (for an elf, success is getting packages).

## Read first

- `CLAUDE.md`, the 1b to 1b.7, 1e, 1f, and 1l orders and their Results.
- `docs/DESIGNS.md`, Packing Line: "Work orders and drivers," "The driver's moods," "TNP Corp."
- Art: `art-masters/packing-line/28-fake-trucks/fake-truck-gnomerica.png` and `29-elf-imposters/elf-gnomerica-grumpy.png` and `-happy.png`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  Game copies of the Gnomerica fake truck and the elf's grumpy and happy poses, sized like the real ones.  Add them to `docs/ASSETS.md`.
3. **Placement pass (Nathan, 2026-11-23: every new driver and truck gets its own pass).**  Place the fake truck and the elf with the same rules as the real pair (the truck backed into the room, the depth rule), desktop and phone, and screenshot them next to the real pair.  If the art's shape needs different numbers, give them their own config entries and say so.
4. **TNP trips.**  From shift `CONFIG.shipping.fakes.startShift` (4), each trip has `elfChance` (draft 25%) of being a TNP trip, never more than `maxTnpInRow` (2) in a row.  A TNP trip has no glitter slips.
5. **Sending him away.**  Pulling the chain on a TNP trip with nothing handed over: TNP −5 (draft), a short report card ("TNP driver sent packing!", draft wording), and a new trip can start with the next chain pull, as now.  The elf stays grumpy and leaves.
6. **Filling his orders.**  Any packed box handed to an elf: ours −3 and TNP +10 per box (drafts), the elf goes happy, and the report card says why (❌ "Shipped to TNP").  Shelf counts drop as for any shipment (the goods are gone).
7. **The leave warning** (1f) covers TNP trips too, with the same scoring as pulling the chain.
7a. **"Not approved" (Nathan, test of draft.92).**  Now that every slip is stamped, the report card tells an unstamped real order apart from an approved one left unpacked:
    - A real order never stamped: ❌ **"Not approved"**, a small hit (draft −1 to ours, in config).
    - A real order APPROVED but not packed: ❌ "Not packed," the bigger hit, as now (−3).
    - So a GRIP driver sent away with nothing stamped costs only a little (−3 for a full board).  Nathan: "having a driver show up and simply sent away is a small hit since no packages were approved."
    - "Denied a real order" and "Missed a fake" (an unstamped fake) stay as 1l built them.
    - Main-reason order: Approved a fake, Missed a fake, Denied a real order, Not approved, Not packed, then the rest as 1j.
8. Every number and word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md` and DESIGNS (built), and update `tools/smoke-test.js`: a forced TNP trip sent away moves TNP down; one filled moves ours down and TNP up; no more than 2 TNP trips in a row over many trips; a GRIP board sent away unstamped scores "Not approved" on every row.  Run it.
9. **Screenshots** into `tools/out/`, both layouts, Day: the elf and fake truck waiting, beside the real pair; the "sent packing" card; the happy elf after a filled trip; and the STONKS screen after one of each.  List them in the Result.
10. In the Result, record how long the build took.
11. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Mix real and fake trucks and drivers.
- Build other regions' trucks, drivers, or elves.
- Install anything.

## Done when

- From shift 4, TNP trips arrive with the elf in his fake truck, never more than 2 in a row.
- Sending one away and filling one each score as listed, in both layouts.
- The placement matches the real pair's rules, checked by screenshot.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-23 by Claude Code (Opus 5.5) on Beast as **v0.2.0-draft.93**.  Smoke test: all clear, desktop and phone.

**Build time:** about 30 minutes, from `git pull` at 15:03 to the Result at 15:33 (CST).

**What was built**

- **Art.**  `truck_fake_gnomerica.webp` (986x568), `elf_gnomerica_grumpy.webp` (163x400), and `elf_gnomerica_happy.webp` (191x400) in `assets/packing/`, made with `art.py resize` (whole canvas), and listed in `docs/ASSETS.md`.  The elf copies are 400 px tall like the driver's.  Checklist items 28 and 29 note that Gnomerica's pair is in the game.
- **Placement pass.**  The pair uses the real pair's numbers (`layouts.<layout>.truck` and `.driver`): the truck backs in under the same clip and parks at the same stop, and the elf stands on the driver's spot, his feet on the same line, in front of the truck (the depth rule holds).  **Two new config entries, because the art's canvases differ:** the fake truck master is 1652x952 against the real one's 1063x613, with the same truck drawn on it a little smaller.  I matched their outlines by search: at 1.015 times the real truck's height, moved 0.36% of that height left and 0.54% down, 98.8% of the outlines overlap.  That is `CONFIG.shipping.tnp.truck.fit` (`scale`, `dx`, `dy`), applied to every truck position and slide.  The game copy is 568 px tall (560 times 1.015), so both trucks draw at the same detail.  The elf's happy canvas is wider than his grumpy one and his feet sit 4 px further left, so `tnp.driver.happy.shiftX` is 2.09 (the driver's is −3.33).  `tnp.driver.scale` is 1: the elf's hat tip reaches the driver's cap, so the two read the same height; he is slimmer, so he looks a little smaller.  Easy to raise if Nathan wants the "excessive height" tell from checklist 29.
- **TNP trips.**  The kind is rolled as the door opens (`rollTnp()`): from shift 4 (`fakes.startShift`), `fakes.elfChance` 25%, never more than `fakes.maxTnpInRow` 2 in a row.  The run is saved as `tnpRow` (new in the save; older saves get 0), so a reload can't reset it.  A TNP trip is all TNP: fake truck and elf, and his board never gets glitter, even at a 100% glitter chance.  His slips are stamped and packed like any slip.
- **Sending him away.**  Pulling the chain with no box handed over: TNP −5 (`score.elf.sentAway`), and a short card with one green row, "TNP driver sent packing!" (`score.sentPacking`), with the elf in the picture frame.  He stays grumpy and leaves.  The next chain pull starts a new trip as before.
- **Filling his orders.**  Each packed box handed over (and a closed box with an item still on the bench, which ships as on a GRIP trip): ours −3 and TNP +10 (`score.elf.shipped`), the row reads ❌ "Shipped to TNP", the shelf drops for it, and the elf goes happy before he leaves.  The sent-away −5 does not also apply, and `perfectTnp` is for GRIP trips only.
- **The leave warning** runs the same `pull()`, so TNP trips score the same when sent off from it.
- **7a, Not approved.**  A real order never stamped reads ❌ "Not approved", −1 (`score.notApproved`, with a `tnp` of 0).  Approved but not packed stays "Not packed", −3.  A GRIP driver sent away with nothing stamped costs −3 for a full board.  Main-reason order: Approved a fake, Missed a fake, Denied a real order, Not approved, Not packed, then the 1j order.
- **Docs:** CHANGELOG, ARCHITECTURE (save data and the room), DESIGNS (built), ASSETS, TASKS, HANDOFF, the production checklist.
- **Smoke test:** a new `elfCheck` runs in both layouts.  With every trip forced TNP from shift 4: the first trip has the fake truck, the elf, and no glitter, and sent away it moves TNP −5 and shows the one "sent packing" row.  The second is TNP again: one box handed over gives ours −3, TNP +10, "Shipped to TNP" with "Kept from TNP" on the rest, the happy elf, and the shelf down by the box's count.  The third must be GRIP's, and sent away unstamped every row reads "Not approved" (−1 each).  Then 260 rolls (60 at 100%, 200 at 50%) never give 3 TNP trips in a row, and none come before shift 4.  The other checks now turn elves off; the 1l check and the packing check expect "Not approved" (−1) for their unstamped real orders.

**Calls to check**

1. **"Kept from TNP"** is my draft wording (in config) for an elf's order that was not handed over, a ✔ row.  The order named only the ❌ line.
2. **No rows on the sent-away card.**  The card shows the one green line and the elf, then the bottom line "Stonks this shift: 0   TNP: −5".  It doesn't list his orders.
3. **A partly filled elf trip** gets only the per-box scoring, not the sent-away −5 as well.  The order reads that way ("with nothing handed over"); it's one line to change.
4. **The elf's height** matches the driver's (see the placement pass).
5. **The sent-packing line shrinks to fit** the row's text space beside the picture frame, so it is smaller than a town name, mostly on the phone.  It could span two lines if Nathan wants it bigger.

**Proof** in `tools/out/` (`?ship=1`, Day, 2x, not committed).  `wide` is 1400 x 900 and `tall` is 390 x 844.

- The real pair waiting: `1m-<wide|tall>-day-grip-waiting.png`; the elf and fake truck waiting, the same shift setup: `1m-<wide|tall>-day-elf-waiting.png`.  Side by side, they show the same parking spot and the same floor line.
- The "sent packing" card: `1m-<wide|tall>-day-card-sent-packing.png`.
- The happy elf after a filled trip: `1m-<wide|tall>-day-elf-happy.png`; its card: `-card-shipped-to-tnp.png`.
- The STONKS screen after one of each (from 20 and 20: a GRIP board sent away unstamped, 17 and 20; the elf sent packing, 17 and 15; the elf filled, 14 and 25): `1m-<wide|tall>-day-stonks.png` and close-up `-stonks-zoom.png`.
- The next trip, GRIP's (the third in a row can't be TNP), sent away unstamped: `1m-<wide|tall>-day-card-not-approved.png`.

Nothing was installed.  No mixed trips, and no other regions' trucks, drivers, or elves.
