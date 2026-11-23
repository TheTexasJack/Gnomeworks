# Work order: Packing Line 1m, elf imposters and fake trucks (v0.2)

**Status:** Approved
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

