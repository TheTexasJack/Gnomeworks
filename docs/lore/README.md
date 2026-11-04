# Gnomeworks lore

The home for everything about why the gnome factory does what it does.  Nathan, Alex, and Mara write it; Claudia files it here.  Started 2026-11-03.

Lore has only small effects on gameplay.  Its job is the feel of the world: players who want to know more can read, and players who just want to click never have to.

## The Lore tab (planned, discussion stage)

A Lore tab in the game, in the spirit of the Mass Effect codex.  Nothing is built yet.

- **Decided:** entries fill in as players discover things.  A Tiny Monster's entry opens when it's caught, a hunt creature's when it's first shot, a region's when the dock first ships there.  Undiscovered entries stay locked, like the ??? tiles on the shelf.
- **Far future:** a narration button on each entry.  Tracked in [DESIGNS.md](../DESIGNS.md#far-future).

- **Tiny Monsters:** tap a monster on the shelf to open its entry, like a Pokedex (already planned as the Tiny Monster info card in [DESIGNS.md](../DESIGNS.md)).
- **Hunt creatures:** Alex's idea.  Entries for the creatures the Megagnome hunts, and why (for example, why there are so many Banana Monsters).
- **Regions:** each region's name and why it's called that, notes on its style, a picture, and its lore.  The Packing Line needs these for stamps, labels, and orders.
- **Junk groups:** why the factory makes so much of each group.  The entry for Laundry & Clothing explains why gnomes make socks, without explaining what a sock is.
- **The factory and the rivals:** our company, the machine, and TNP Corp.

## Files

| File | Covers | Status |
| --- | --- | --- |
| [factory.md](factory.md) | Our gnome company, the machine, the Megagnome, Stonks, The Daily Cog | Seeds from 2026-11-03 |
| [tnp-corp.md](tnp-corp.md) | The North Pole Corp, the rival | Seeds from 2026-11-03 |
| [regions.md](regions.md) | The regions the dock ships to | Waiting on maps |
| [place-names.md](place-names.md) | Nathan's unsorted pool of map names (100 unique names) | Saved, waiting on classification |
| [location-gazetteer-v0.9.md](location-gazetteer-v0.9.md) | 100 places plus Gnod Dam, Shen Shin, Legipt, and Monit-45; trades at 49 cities, villages, shops, and producing mines, with full lore, flora and fauna | **v0.9 review draft, awaiting Nathan and Alex** |
| [map-geography-audit-v0.1.md](map-geography-audit-v0.1.md) | 50 named terrain-bearing sites, 20 geographic systems, 11 relationship chains, and placement clues for all 100 locations | **First-pass map planning, not canon** |
| [world-map-v0.2.md](world-map-v0.2.md) | Master map Sections 1–2: coastline and geographic outline, proposed regional hierarchy for all 100 named entries, city/POI clusters and orphan landmarks | **Two sections drafted for review** |
| [map/](map/README.md) | Gnomadica master map v0.4 (Gnod Dam, Shen Shin, Slaanilok lizard towns): SVG, zoomable viewer, and pin data for all 100 locations, built by `tools/map/build_map.py` | **v0.4 draft map, awaiting canon review** |
| [tiny-monsters.md](tiny-monsters.md) | The 11 Tiny Monster families and their 4 forms | Waiting on lore |
| [hunt-creatures.md](hunt-creatures.md) | The 8 prey and the Banana Monster boss | Waiting on Alex |
| [junk-groups.md](junk-groups.md) | The 8 junk groups, plus Number Twos and Legendary Treasures | Waiting on lore |

## Rules for lore files

- Gazetteer revisions use version numbers in filenames, such as `location-gazetteer-v0.9.md`.  Keep **only the latest version** in the working repository; delete all prior gazetteer files when publishing an updated one.  Older versions remain recoverable through Git history.

- Claudia may update the gazetteer as the map and lore develop (Nathan, 2026-11-03), publishing each change as a new version.
- **Trade rule:** imports and exports belong only to places that buy or make goods: cities and ports, villages, shops, and working mines or strongholds that produce.  Natural landmarks and POIs never trade.  Think about who would buy our junk.
- Only what Nathan, Alex, or Mara have said or approved.  Open questions are marked as open questions.
- **Lore publishing workflow:** Mara may commit clearly labeled working drafts directly to GitHub and then send the link to Nathan for review.  Publication is not canon approval.  Nathan decides what becomes canon, and Alex develops or approves the stories in her sections.  Proposed classifications, geography, character histories, and trade goods must remain labeled as drafts until approved.
- Kid-friendly and in plain English.  Elana (Jarrett's daughter, 6) reads, and the entries should encourage her to read: short sentences, everyday words, keep it fun.
- The big guy at the North Pole is never named.
- **About** is an inviting, readable place description.  **Major Facts** holds richer local histories, characters, oddities, and connections for the full lore view.  The game can show a shorter preview and reveal the rest on demand.
- Same writing rules as the rest of the repo: two spaces after periods, no em dashes, no "not X, it's Y" phrasing.
