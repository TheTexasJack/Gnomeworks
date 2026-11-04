# Gnomadica master map v0.1: pin coordinates for all 100 gazetteer entries.
# Coordinates are SVG units on a 1660 x 1150 page.  Page top is PROPOSED north.
# Every pin is a draft placement built from the clue text in map-geography-audit-v0.1.md.
#
# Format: name: (x, y, tier, label)
#   tier 1 = master-map anchor (big label), 2 = regional, 3 = local (shops, shrines, interiors)
#   label = (dx, dy, anchor) offset for the text, or None for the default (right side)

PLACES = {
    # ---- Regions (label anchors only, no pin) ----
    "Gnomadica": (830, 40, 0, None),
    "Gnomerica": (790, 470, 0, None),
    "Gnohio": (420, 405, 0, None),
    "Gnafrica": (470, 880, 0, None),
    "Gnufoundland": (290, 235, 0, None),
    "Slaanilok": (1460, 560, 0, None),
    "Slanic": (770, 935, 0, None),
    "Gno Dao Cradle": (1120, 300, 0, None),

    # ---- Gnomerica: factory core ----
    "Cogbottom": (742, 608, 1, (0, -16, "middle")),
    "Smallerville": (612, 612, 2, (0, -9, "middle")),
    "Gnomish Farms": (676, 628, 2, (-4, 15, "end")),
    "Cog'n'Barrel": (722, 626, 3, (5, 11, "start")),
    "Cogington": (648, 540, 1, (-10, 4, "end")),
    "Dice and Doodles": (660, 552, 3, (6, 9, "start")),
    "Mines of the Unknown Office": (676, 514, 2, (8, -3, "start")),
    "Cogsworth": (858, 598, 1, (10, 4, "start")),
    "Pulley Junction": (746, 672, 1, (9, 4, "start")),
    "Gnome'n'Pinion": (806, 640, 3, (7, 9, "start")),
    "Brasstop": (874, 540, 1, (10, 0, "start")),
    "Crossroads": (650, 738, 2, (-9, 3, "end")),
    "Broken Wheel": (700, 706, 3, (-7, -2, "end")),
    "Dungeon of Soup": (640, 786, 2, (8, 4, "start")),
    "Place of Many Names": (606, 682, 3, (-7, 3, "end")),
    "Sproing": (734, 446, 1, (10, 5, "start")),
    "Hills of Ratios": (760, 515, 2, None),
    "Woods of the Elder": (735, 372, 1, None),
    "Cave of the Gnut": (598, 414, 2, (0, 15, "middle")),
    "Unspoken Dungeon": (790, 334, 2, (9, -3, "start")),
    "Creepy Gnut": (628, 445, 2, (-8, 12, "end")),
    "Bob's Hut": (812, 432, 3, (8, 4, "start")),
    "Gnew York": (1088, 690, 1, (0, 22, "middle")),
    "Port Gnasher": (1300, 640, 1, (-6, -14, "end")),

    # ---- Gnohio ----
    "River's Belt": (440, 655, 1, None),
    "Port Gnaru": (296, 642, 1, (10, -10, "start")),
    "Runningnomata": (484, 562, 1, (0, -11, "middle")),
    "Farms of Verdon't": (430, 612, 2, None),
    "Snakes N Sliders": (318, 612, 3, (6, -5, "start")),
    "Springwater": (502, 476, 2, (8, -6, "start")),
    "Flies and Springwater": (532, 520, 2, (8, 4, "start")),
    "Mouse Reserve": (452, 458, 2, None),
    "Hunter's Folly": (418, 494, 2, (-7, 9, "end")),
    "Ancient Pet Rock": (448, 532, 3, (-7, 5, "end")),
    "Backwater Cog": (372, 684, 2, (0, 18, "middle")),
    "Brokit Fixit": (408, 724, 3, (7, 6, "start")),
    "Rocks Throw": (566, 566, 2, (8, 4, "start")),
    "I Crant Spellit": (506, 708, 2, (0, 15, "middle")),
    "North Ham'n'Gnome": (516, 392, 1, (10, 5, "start")),
    "Sleeping Dogs Hollar": (548, 788, 2, (-8, 4, "end")),

    # ---- Gnafrica ----
    "Sockarillo": (462, 1000, 1, (0, -11, "middle")),
    "Grit Spit and Fellers": (398, 1012, 2, (-2, 17, "middle")),
    "Pretty Good Chances": (528, 1004, 3, (8, 4, "start")),
    "Desert of Desire": (470, 1058, 2, None),
    "Satiated Desert": (566, 1014, 2, None),
    "Flybar": (312, 1046, 1, (-8, 4, "end")),
    "the Windy Sands": (345, 960, 2, None),
    "Dungeon of Anger": (398, 930, 2, (-6, -9, "end")),
    "Hot Fire Volcano": (455, 918, 1, (0, 14, "middle")),
    "Minor Heat Volcano": (538, 935, 2, (0, 18, "middle")),

    # ---- Gnufoundland (Island A, proposed) ----
    "Gnyannis": (430, 93, 1, (-4, 22, "middle")),
    "Werewolf London": (238, 68, 1, (0, 18, "middle")),
    "Depths of the Undercover": (458, 101, 2, (8, 10, "start")),
    "Frozen Fields": (270, 180, 2, None),
    "Ogre's Hold": (160, 150, 2, (-8, 4, "end")),
    "Giantation": (196, 196, 2, (-8, 10, "end")),

    # ---- Slaanilok (Islands C and E, proposed) ----
    "Eversummer": (1445, 955, 1, (10, 4, "start")),
    "Dungeon of the Deep": (1338, 694, 2, (8, 12, "start")),

    # ---- Slanic ----
    "Gloopenstein": (686, 890, 1, (-10, 4, "end")),
    "Bottoms Up": (696, 902, 3, (6, 10, "start")),
    "Fairy Fen": (770, 965, 2, None),
    "Gnix Goop": (742, 916, 2, (8, -4, "start")),
    "Bog of Eternal Regret": (760, 1030, 2, None),
    "Brassin": (1000, 990, 1, (10, 2, "start")),
    "Don't Grind Angry": (992, 1002, 3, (0, 14, "middle")),
    "Mycelia": (872, 1002, 1, (10, -6, "start")),
    "Slimes Akummin": (912, 1044, 2, (8, 6, "start")),
    "Pixie Puddles": (836, 972, 2, (8, -4, "start")),
    "Rubber Ribbiter": (818, 994, 3, (-6, 10, "end")),
    "Lost Boot": (642, 948, 2, (8, 4, "start")),
    "Swamp of Low Visits": (598, 960, 2, None),
    "Anterpiller's Mound": (612, 852, 2, (-8, -4, "end")),
    "Dungeon of the Squirrel's Nut": (618, 866, 3, (-6, 10, "end")),

    # ---- Gno Dao Cradle ----
    "Cogbend Hold": (1052, 472, 1, (10, 4, "start")),
    "The Crafter's Mines": (1104, 448, 2, (8, -3, "start")),
    "Twinshift": (984, 500, 1, (-8, 14, "middle")),
    "Gnomish Heights": (1150, 255, 1, None),
    "Mountain of Exclusion": (1090, 392, 2, None),
    "Fortress of Easy Defeat": (1078, 528, 2, (0, 14, "middle")),
    "Fortress of Moderation": (1128, 334, 2, (8, 4, "start")),
    "Fortress of Impossibility": (1212, 196, 2, (-8, -6, "end")),
    "Sky Dream": (1052, 320, 1, (-8, -4, "end")),
    "Stellar Review": (1066, 300, 3, (-6, -6, "end")),
    "Jinlo fields": (1000, 380, 2, None),
    "Steam Stream": (915, 560, 2, None),
    "Glowrock Retreat": (942, 410, 2, (-8, -4, "end")),
    "Lost Valley": (990, 328, 2, None),
    "Crystals on the Flats": (1160, 505, 2, None),
    "Big ole' Hole": (1198, 548, 2, (8, 6, "start")),
    "6th Age Ruins": (1172, 238, 2, (8, -4, "start")),
    "The Ancient Device": (1250, 160, 2, (-6, -8, "end")),
    "Mortuary Mines": (1012, 452, 2, (-8, 3, "end")),
}

# Natural features drawn as italic area labels instead of pins (label sits on the terrain).
AREA_LABELS = {
    "Woods of the Elder": (735, 372, 0, 15),
    "Hills of Ratios": (790, 494, 0, 10),
    "Mouse Reserve": (452, 456, 0, 9),
    "Farms of Verdon't": (428, 608, 0, 9),
    "River's Belt": (430, 662, -14, 11),
    "Desert of Desire": (470, 1062, 0, 10),
    "Satiated Desert": (568, 1024, -14, 9),
    "the Windy Sands": (348, 965, -64, 10),
    "Frozen Fields": (262, 182, 0, 11),
    "Fairy Fen": (772, 968, 0, 10),
    "Bog of Eternal Regret": (775, 1034, 0, 9),
    "Swamp of Low Visits": (596, 948, -20, 8.5),
    "Gnomish Heights": (1145, 258, -40, 14),
    "Mountain of Exclusion": (1090, 414, 0, 8.5),
    "Jinlo fields": (1002, 403, 0, 8.5),
    "Steam Stream": (916, 657, -80, 9),
    "Lost Valley": (962, 370, 0, 8.5),
    "Crystals on the Flats": (1160, 463, 0, 9),
}

# Places added while mapping, outside the 100-name pool.  They render as pins and go to the JSON's added_places list.
ADDED_PLACES = {
    "Legipt": dict(x=1452, y=708, tier=1, label=(10, 9, "start"), type='city', region='Slaanilok',
                   clue='Big, ancient lizard city at the south end of Island C, where the trade route leaves south for Eversummer.'),
    "Gnaagh": dict(x=1446, y=1022, tier=1, label=(12, 2, "start"), type='expedition', region='Gni',
                   clue='The castle of the Knights of Gni, on the south end of the Island of Gni below Eversummer.'),
    "Three Idols": dict(x=206, y=1006, tier=2, label=(0, 13, "middle"), type='poi', region='Gnonmoon',
                        clue='Three standing stones on the southern hills of Gnonmoon.'),
    "Demon's Gutt": dict(x=118, y=1010, tier=2, label=(0, -8, "middle"), type='expedition', region='Gnonmoon',
                         clue='A dungeon in the western hills of Gnonmoon.'),
    "Gassy Dog": dict(x=318, y=112, tier=2, label=(7, 4, "start"), type='settlement', region='Gnufoundland',
                      clue='Small hamlet southeast of Werewolf London, on the trail to the Frozen Fields.'),
    "Tables Edge": dict(x=1470, y=238, tier=1, label=(0, -11, "middle"), type='city', region='Shen Shin',
                        clue='Town deep in the pine forest of Shen Shin.  They make and export tables.  Watch your shins.'),
    "Monit-45": dict(x=1508, y=672, tier=2, label=(0, -9, "middle"), type='city', region='Slaanilok',
                     clue='Lizard town down in the trees of Island C.'),
}

# Towns placed by Nathan whose names are still open: id -> (x, y, island or region)
UNNAMED_TOWNS = {
    "shen-shin-town-1": (1532, 82, 'Shen Shin'),
    "shen-shin-town-3": (1484, 322, 'Shen Shin'),
    "slaanilok-town-1": (1398, 612, 'Slaanilok'),   # on the bay edge, where the Port Gnasher ferry lands
    "slaanilok-town-2": (1478, 494, 'Slaanilok'),   # north shore, toward the Shen Shin ferry
    "gnonmoon-town-1": (192, 936, 'Gnonmoon'),     # on the shore of Zohee Bay
    "gnomerica-town-1": (1028, 786, 'Gnomerica'),   # in the forest east of Innie Lake
    "gnomerica-town-2": (1090, 630, 'Gnomerica'),   # north of Gnew York
    # seven spares placed by Claudia for future use (2026-11-03)
    "gnohio-town-1": (320, 468, 'Gnohio'),          # northwest coast of Gnohio
    "gnohio-town-2": (424, 782, 'Gnohio'),          # south Gnohio, between Brokit Fixit and the hollow
    "gnomerica-town-3": (900, 352, 'Gnomerica'),    # north coast, east of the Woods of the Elder
    "gnomerica-town-4": (1200, 628, 'Gnomerica'),   # Port Gnasher's hill country
    "slanic-town-1": (1040, 880, 'Slanic'),         # the southeast downs, up the coast from Brassin
    "gnafrica-town-1": (395, 1062, 'Gnafrica'),     # south of Grit Spit, on the edge of the dunes
    "gni-town-1": (1462, 862, 'Gni'),               # north end of the Island of Gni, in the palms
}
