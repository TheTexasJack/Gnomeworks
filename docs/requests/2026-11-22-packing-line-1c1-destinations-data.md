# Work order: Packing Line 1c-1, the destinations data (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22.  **Approved by:** (waiting on Nathan)
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

