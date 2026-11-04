# Gnomadica master map, v0.2

**Status: working draft, awaiting canon review.**  Built by Claudia on 2026-11-03 (v0.1, then v0.2 the same night) from [World Map v0.2](../world-map-v0.2.md), the [geography audit](../map-geography-audit-v0.1.md), and the [gazetteer](../location-gazetteer-v0.6.md).  Nothing here is canon until Nathan approves it.

## Files

| File | What it is |
| --- | --- |
| `gnomadica-map-v0.2.svg` | The master map.  Opens in any browser or in Inkscape. |
| `gnomadica-map-v0.2.html` | The same map with zoom, search, layer switches, and a card for every pin. |
| `gnomadica-locations-v0.2.json` | All 100 entries with pin coordinates, type, region, and the gazetteer's own placement clue, plus new landmarks such as Gnod Dam. |
| `../../../tools/map/` | The builder.  `places.py` holds the pins; `build_map.py` holds the coastlines, lake, rivers, terrain, and roads. |

Rebuild with `python3 tools/map/build_map.py`.  The build is seeded, so the same inputs always draw the same map.  It refuses to run unless all 100 gazetteer names have a pin, and it reports any pin that lands in the sea or the lake.

## The coastline

The coastlines come from the written description of Nathan's sketch in World Map v0.2, section 1.2.  Nathan's pen ruined the original, and he treats it as a rough guide.  The shapes are separate from the pins, so any coastline change in `build_map.py` is safe: the pin check flags anything that ends up in the water.

## Changes in v0.2

- The Inner Lake was rebuilt as a reservoir behind Gnod Dam, modeled on Lake Texoma.
- Nathan shared his sketch on 2026-11-03.  He called it a rough guide and approved working from this map.  The sketch's lake curl, Island C's inner bay, and the long upright NE arm are features to borrow later.

## Proposed decisions on this draft

Each of these needs a yes, a no, or a change from Nathan.

1. **North is the top of the page.**  Every directional clue in the gazetteer already assumes it.
2. **The interior loop is a lake, and the gnomes made it.**  Nathan confirmed it is a lake on 2026-11-03 and pointed to Lake Texoma as the model.  The Inner Lake (name open) is a reservoir: the gnomes built **Gnod Dam** (Nathan's name) at its south tip, and the water climbed every valley behind it.  That gives it long drowned arms and small coves in place of a round shore.  Steam Stream fills the north arm with warm water, the Ratios creek fills the west arm, and an east creek fills the east arm.  The old riverbed still runs down the middle, and an old road runs down into the water from the west.  The Slanic river leaves through the dam's spillway and becomes the delta.  Gnod Dam is a new landmark, kept in the JSON's `landmarks` list apart from the 100 gazetteer entries.
3. **Two northwestern rivers.**  River's Belt runs west to Port Gnaru.  A separate, unnamed northern river runs from the Woods of the Elder to North Ham'n'Gnome's estuary.
4. **Island A is Gnufoundland.**  Its hook encloses the warm sheltered bay, with Gnyannis on the bay's north shore.
5. **Islands C and E are Slaanilok.**  Eversummer is on E, the southern end of the chain.  The Lantern Chain ferry runs from Port Gnasher to C, then on to E, with a third run toward B.
6. **Islands B and D are unclaimed**, left open for future names.
7. **Gno Dao Cradle runs along the long upper-right arm**, with the Gnomish Heights as its spine and the three fortresses climbing toward its tip.
8. **Gnafrica is the southwest peninsula**, walled off by a low range labeled "the Dry Ridge" (from the Gnafrica clue "beyond the dry ridge").  Suggested climate story: the ridge blocks rain, and a cold current off the southwest coast keeps that coast dry and windy.
9. **Dungeon of the Deep sits under Port Gnasher's reef** on the main island side of the strait.  The gazetteer still files it under Slaanilok.  Pick one.
10. **Mycelia sits between the delta's two mouths**, a raised island in the reed beds.
11. **Crossroads and Place of Many Names are separate places.**  Nothing in the lore merges them.

## Drawn for looks only

These have no names and can move or vanish freely: the woods and downs between Gnew York and Brassin, the hills behind Port Gnasher, the islets, the boats, and the region color washes.  The washes show roughly where a region sits.  They are not borders.

## Still open

- The lake's name, and names for the seas.
- Gnod Dam's story: who built it, when, and what lies at the bottom of the drowned valley.
- Islands B and D.
- A scale bar.  The main island is hundreds of miles across, so the map carries no scale yet.
- Which master-map pins should drop to regional maps later (shops, shrines, single monuments are drawn small and can be hidden in the viewer).
