# Work order: Packing Line 1c-1, the destinations data (v0.1)

**Status:** Done (built in v0.2.0-draft.75)
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 ("1c-1 approved").
**Model:** Opus 5.5

## Goal

Give the game the list of places that order from the factory, and what each one buys, generated from the lore so lore and game never drift apart (DESIGNS.md: "The game reads a destinations file generated from the gazetteer").  Data only: nothing on screen changes.  The work orders on the board (1c-2) are built on this.

## Read first

- `CLAUDE.md`, `docs/ENVIRONMENT.md`.
- `docs/DESIGNS.md`, Packing Line: "Destinations come from the Gnomadica map and gazetteer," "Purchase orders and the order board," and "Regions unlock as you go."
- `docs/lore/location-gazetteer-v0.27.md`, the opening rules (especially "Everybody needs a bathroom").
- `docs/lore/map/gnomadica-locations-v0.29.json`: each location has `name`, `type`, `region`, and a `gazetteer` block with **Factory Imports** (a `; `-separated list of item names, or `None`).
- `docs/lore/regions.md` (the ten regions, their colors and stamp symbols).
- `js/config.js`, `CONFIG.items` (ids, names, groups).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **A generator, `tools/destinations.js` (Node).**  It loads `js/config.js` (so item names come from the game itself), reads `docs/lore/map/gnomadica-locations-v0.29.json`, and writes `js/destinations.js`.
3. **What goes in `js/destinations.js`:** a header saying it is generated (do not edit; rerun the tool), the source file and its version, and `GW.DESTINATIONS`:
    - **regions:** the ten regions in the unlock order from DESIGNS.md (Gnomerica, Gnohio, Gnafrica, Slanic, Gno Dao Cradle, Gni, Slaanilok, Shen Shin, Gnufoundland, Gnonmoon), each with its stamp color and symbol from `docs/lore/regions.md`.
    - **places:** every location whose Factory Imports names at least one item, with `id`, `name`, `type`, `region`, and `buys` (game item ids).
4. **Matching names to items.**  Match each Factory Imports name to a `CONFIG.items` entry by name, ignoring case, spacing, and punctuation.  Apply the bathroom rule: every place with a `buys` list also buys every item in the Bathroom group.  Any name that matches no item is **skipped and reported**, never guessed or invented.
5. **A report.**  The tool prints, and the Result records: places per region, items per place (smallest and largest), and every unmatched name with the place it came from.
6. **Load it.**  Add `js/destinations.js` to `index.html` right after `js/config.js`.  Nothing reads it yet.  Add both new files to `docs/ARCHITECTURE.md` (the script table) and `docs/ENVIRONMENT.md` (commands: how to regenerate it).
7. Bump `GW.VERSION` to `0.2.0-draft.75`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, run `node tools/smoke-test.js`.
8. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change the lore files or the map JSON.  If the lore has a problem (for example an item name the game doesn't have), report it; Nathan and Claudia fix the lore.
- Build the order board, the slips, or the randomizer (1c-2).
- Change anything players see.
- Install anything.

## Done when

- `node tools/destinations.js` writes `js/destinations.js`, and running it twice gives the same file.
- Every Gnomerica place with Factory Imports is in it with its `buys` list, bathroom items included.
- Every unmatched name is listed in the Result.
- The smoke test passes.

## Result (filled in by Claude Code)

Run 2026-11-22 by Claude Code (Opus 5.5) on Beast.  **Built in v0.2.0-draft.75.**  Data only: nothing on screen changed.

- **Step 1:** pulled (f40845c).
- **Step 2, the generator:** `tools/destinations.js` loads `js/config.js` for the item names, reads `docs/lore/map/gnomadica-locations-v0.29.json`, and writes `js/destinations.js`.  It reads both lists in the file, `locations` (100) and `added_places` (28, the places added while mapping), since both carry the same gazetteer block; 4 of the 53 places come from `added_places` (Slaanilok 2, Shen Shin 1, Gnufoundland 1).
- **Step 3, the file:** a generated-file header (do not edit, rerun the tool), the source file and map version 0.29, and `GW.DESTINATIONS` with `regions` (the ten in unlock order, each with `id`, `name`, stamp `color`, and `symbol` from `docs/lore/regions.md`) and `places` (`id`, `name`, `type`, `region` as a region id, `buys` as item ids).  Places are sorted by unlock order, then by their order in the source file.  `buys` lists the place's own imports in the gazetteer's order, then the Bathroom items it doesn't already name, in `CONFIG.items` order.
- **Step 4, matching:** names match `CONFIG.items` names ignoring case, spaces, and punctuation.  No two items share a matching key.  The Bathroom group (`bathroom`, 12 items, the same 12 the gazetteer lists) is added to every place.
- **Step 5, the report** (`node tools/destinations.js`):
    - **Places per region (53 in all):** Gnomerica 15, Gnohio 11, Gnafrica 4, Slanic 9, Gno Dao Cradle 6, Gni 1, Slaanilok 2, Shen Shin 1, Gnufoundland 4, **Gnonmoon 0**.
    - **Items per place (bathroom included):** smallest 13 (Farms of Verdon't, Springwater, Sleeping Dogs Hollar, Gloopenstein, Bottoms Up, Brassin, Slimes Akummin, Werewolf London, Gassy Dog), largest 18 (Tables Edge).  Gnomerica's 15 places buy 14 to 16 items each.
    - **Unmatched names: none.**  Every Factory Imports name in the file matches a game item.
    - Extra checks: every bought item is junk (no Legendary Treasures, Tiny Monsters, or Number Twos), and all 96 junk items are bought by at least one place.
- **Lore gap for Nathan and Claudia (not changed, per Do not):** none of Gnonmoon's five places (Zohee Bay, Gnonmoon, Three Idols, Demon's Gutt, Gnonmoon 1) has Factory Imports, so Gnonmoon has no destinations.  It is the last region to unlock, so this blocks nothing in layer 1.  Added to `docs/TASKS.md`.
- **Same file twice:** ran the tool twice and compared the outputs byte for byte: identical.  The file has no dates or timestamps.
- **Step 6:** `js/destinations.js` loads right after `js/config.js` in `index.html`; nothing reads it yet.  Added to `docs/ARCHITECTURE.md` (script table, row 1a) and `docs/ENVIRONMENT.md` (the regenerate command and the tools list).  Also updated `docs/TASKS.md` and `docs/HANDOFF.md`.
- **Step 7:** `GW.VERSION` is `0.2.0-draft.75`, stamped (16 links), `CHANGELOG.md` entry added.  Smoke test: **All clear** (desktop and phone ok, no errors or missing files).
