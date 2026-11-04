# Lore and map handoff, v0.1

Written by Claudia on 2026-11-04 for the next "Gnomeworks map and lore" thread.  Read this first, then the files it points to.

## Where things stand

| Thing | Current file or link | State |
| --- | --- | --- |
| Gazetteer | `docs/lore/location-gazetteer-v0.20.md` | 100 original places plus 13 added while mapping.  Production notes removed.  v0.20 cleanup pass done (2026-11-04). |
| Master map | `docs/lore/map/gnomadica-map-v0.21.*` (SVG, viewer HTML, JSON) | Ten regions, all pins checked on land. |
| Public map link | https://thetexasjack.github.io/Gnomeworks/map/ (`#full` hides the side panel) | Always the latest build. |
| Map builder | `tools/map/build_map.py`, pins in `tools/map/places.py`, viewer in `tools/map/viewer_template.html` | Run `python3 tools/map/build_map.py` after any gazetteer change, then push. |
| Map notes and change log | `docs/lore/map/README.md` | Lists every map version and open map items. |
| Trade draft | `docs/lore/trade-draft-v0.1.md` | Proposed imports so all 96 junk items have a destination, plus Factory Exports.  Awaiting Nathan's approval. |
| Hunt creatures | `docs/lore/hunt-creatures.md` | Alex's names and Dr. Quartz entries, verbatim.  Tie-ins already added to the gazetteer. |
| Dr. Quartz | `assets/lore/dr_quartz.webp`, `_explain`, `_point` | Gnomopedia only.  Mostly Professor Oak, a little Volo. |
| Packing Line guide | Claude doc "Gnomeworks Packing Line: Design and Asset Guide v0.2" | Updated 2026-11-04.  Repo copy of decisions: Packing Line section of `docs/DESIGNS.md`. |
| Art bible | Mara's Brasswood Cartoon style bible (in the repo since 2026-11-04) | Mara owns it. |

## Next up: Nathan's lore pass

1. ~~Clean up the gazetteer.~~  Done in v0.20: doubled About and Major Facts lines merged.
2. Approve, change, or drop the trade draft, then copy approved lines into the gazetteer.
3. Decide whether Tiny Monsters, Number Twos, and Legendary Treasures ever ship.  The Crafter's Mines already imports the Diamond Pickaxe (a treasure).
4. Assign Tiny Monsters to regions, so each region's monster can go on its stamp.
5. Write the dogs-and-cats lore: Gnonmoon's people are furry dog folk and cats; Werewolf London's are werepeople.  Two different peoples.
6. After any gazetteer edit: rebuild the map and push.

After the lore pass: settle the Packing Line mechanics (batch size per package, what a failed package costs, what Stonks buy), then assets, then build.

## Decisions made in this thread

**Map and world**

- North is the top of the page.  Ten regions, one stamp each: Gnomerica, Gnohio, Gnafrica, Slanic, Gno Dao Cradle, Gni, Slaanilok, Shen Shin, Gnufoundland, Gnonmoon.  Every island is its own region.
- Innie Lake is a reservoir behind Gnod Dam, a drowned river valley modeled on Lake Texoma.
- Islands: Gnufoundland (A), Shen Shin (B), Slaanilok (C), Gnonmoon (D), Island of Gni (E).
- Places added while mapping: Gnod Dam, Innie Lake, Shen Shin, Tables Edge, Legipt, Monit-45, Island of Gni, Gnaagh, Gnonmoon, Zohee Bay, Three Idols, Demon's Gutt, Gassy Dog.
- Monit-45 is a lizard-tech nod to Lancer's Monist-1.  Legipt is big and ancient, with a step pyramid.  Gni is knights, shrubberies, and coconuts.
- 14 unnamed towns are kept on purpose for later upgrades.
- Slanic and Slaanilok sound alike on purpose (a packing challenge), and so do the many Cog towns.
- Trade rule: imports and exports only on places that buy or make goods (cities, villages, shops, producing mines and strongholds).  Natural landmarks and POIs never trade.  Humanoid monsters are people.
- The gnomes hunt to feed the Megagnome; he never hunts himself.
- The lore tab is called the **Gnomopedia**, in the style of the Mass Effect codex.  A Tiny Monster info card can be the quick Pokedex-style layer that links into it.

**Shipping (full detail in DESIGNS.md and the Packing Line guide)**

- Regions unlock in a counterclockwise spiral by expedition theater (about five adventurers, about 10 minutes, always succeeds, never costs production).
- Each unlock adds one stacking packing complication.  Gnonmoon is last and must be exact.  Its gift slot holds the Idol or a dog toy; the kissy dog guy's paw-in-a-heart mark makes the dog toy a crit.
- Future producers can come from regions; the Moonsmith is last, from Gnonmoon.  Not every region brings one.  Lore decides pairings; prices are balanced separately.
- Boxes and supplies are free; box-size upgrades are dropped.  Stonks are the score.  Extras do nothing except on Gnonmoon.

## How Nathan works (keep doing this)

- Check every new idea against the notes and say where it fits.  "Nathan, that's cool, but this is next" is welcome.  He may override for Jarrett, Elana, or a real reason.
- Put a visible version number on every deliverable and bump it on every change.  The lore folder keeps only the latest version of each file.
- Push to GitHub at the end of every completed update.  Rebuild the map whenever the gazetteer changes.
- In lore files: two spaces after periods, no em dashes, no contrastive negation, plain kid-friendly English.  Keep production notes (who named what, real-world models) out of the lore and in the map notes.
- Follow his words exactly; when something is ambiguous, say what reading you took.
