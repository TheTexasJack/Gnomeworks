#!/usr/bin/env python3
"""Gnomadica master map builder.

Builds docs/lore/map/gnomadica-map-vX.svg and gnomadica-locations-vX.json from
places.py (pins) and the shapes below (coastlines, lake, rivers, terrain, roads).
Placement clues and categories are read straight from map-geography-audit-v0.1.md,
so the JSON always quotes the gazetteer wording.

Run:  python3 tools/map/build_map.py
Everything is seeded, so the same inputs always give the same map.
"""
import json, math, os, re, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
from places import PLACES, AREA_LABELS  # noqa: E402

VERSION = '0.9'
W, H = 1660, 1150
OUT_DIR = os.path.join(ROOT, 'docs', 'lore', 'map')
AUDIT = os.path.join(ROOT, 'docs', 'lore', 'map-geography-audit-v0.1.md')
FONT = "'Palatino Linotype','Book Antiqua',Palatino,'URW Palladio L',P052,'TeX Gyre Pagella',Georgia,serif"

# Palette: brass, oak and soot on old paper, with soft regional washes.
C = dict(
    sea='#9fc3c4', sea_deep='#86afb4', ring='#5f8f98', land='#efe1b8', land_edge='#d8c08a',
    coast='#4b3a28', ink='#2b2118', ink2='#4a3b2a', river='#4f86a6', lake='#8fbcc4',
    road='#8a5a2b', rail='#4a3424', ferry='#2f5d73', forest='#6f8f4e', forest_dk='#45602f',
    pine='#4f6f4a', mtn='#c9b48a', mtn_dk='#8f7650', snow='#fbfaf4', marsh='#5e8a6e',
    sand='#e3c27e', sand_dk='#b98e48', field='#c9b765', crystal='#9a7fd0', lava='#d0452b',
)
REGION_COLORS = {
    'Gnomerica': '#d9a441', 'Gnohio': '#7fa65a', 'Gnafrica': '#cf7346', 'Slanic': '#4f9a8f',
    'Gno Dao Cradle': '#8a77b0', 'Gnufoundland': '#8fb3d6', 'Slaanilok': '#e0887a',
    'Gni': '#b0609a',
}

rng = np.random.default_rng(1103)  # seed: the day this map started (11/03)

# ------------------------------------------------------------------ geometry helpers

def fractal(poly, iters=5, rough=0.16, closed=True, decay=0.55, r=None):
    """Midpoint displacement.  Original vertices never move, so anchor points stay put."""
    r = r or rng
    pts = [np.array(p, float) for p in poly]
    for _ in range(iters):
        out = []
        n = len(pts) if closed else len(pts) - 1
        for i in range(n):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            d = b - a
            L = np.hypot(*d)
            nrm = np.array([-d[1], d[0]]) / (L + 1e-9)
            m = (a + b) / 2 + nrm * r.normal(0, rough * L)
            out += [a, m]
        if not closed:
            out.append(pts[-1])
        pts = out
        rough *= decay * 1.6
    return pts


def catmull(pts, seg=8):
    """Smooth an open polyline through its points."""
    P = [np.array(p, float) for p in pts]
    P = [P[0]] + P + [P[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, seg, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(P[-2])
    return out


def d_of(pts, closed=True):
    s = 'M' + ' L'.join(f'{p[0]:.1f},{p[1]:.1f}' for p in pts)
    return s + (' Z' if closed else '')


def inside(pt, poly):
    x, y = pt
    c = False
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1 + 1e-12) + x1:
            c = not c
    return c


def poisson(poly, mind, tries=4000, r=None):
    r = r or rng
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    pts = []
    for _ in range(tries):
        p = (r.uniform(min(xs), max(xs)), r.uniform(min(ys), max(ys)))
        if inside(p, poly) and all((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 > mind * mind for q in pts):
            pts.append(p)
    return pts


def blob(cx, cy, rad, n=9, rough=0.25):
    base = [(cx + rad * math.cos(t) * rng.uniform(0.7, 1.15), cy + rad * math.sin(t) * rng.uniform(0.7, 1.15))
            for t in np.linspace(0, 2 * math.pi, n, endpoint=False)]
    return fractal(base, iters=3, rough=rough)


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace("'", '&#39;')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

# ------------------------------------------------------------------ coastlines
# Shapes follow the written description of Nathan's sketch (world-map-v0.2.md, 1.2):
# M main island with southern projections, big bights and a long narrow upper-right arm;
# A hooked upper-left island; B round-topped upper-right; C irregular middle-right;
# D tall-necked lower-left; E elongated lower-right.  Swap these for the traced sketch.

MAIN = [
    (330, 400), (400, 362), (448, 352), (470, 348), (482, 372), (492, 392), (503, 372), (512, 352),
    (560, 330), (602, 322), (640, 305), (680, 300), (720, 290), (760, 302), (800, 298), (842, 312),
    (880, 318), (910, 296), (940, 300), (975, 276), (1010, 262), (1045, 240), (1080, 222), (1115, 196),
    (1150, 180), (1185, 160), (1220, 138), (1250, 116), (1278, 98), (1300, 92), (1314, 112), (1300, 136),
    (1292, 154), (1266, 172), (1240, 196), (1214, 214), (1190, 242), (1172, 266), (1160, 292), (1166, 318),
    (1150, 342), (1158, 368), (1162, 392), (1186, 414), (1172, 432), (1196, 452), (1202, 478), (1222, 500),
    (1232, 536), (1258, 556), (1282, 588), (1304, 606), (1324, 640), (1312, 668), (1302, 690), (1272, 696),
    (1240, 712), (1210, 720), (1182, 742), (1150, 768), (1122, 800), (1110, 836), (1082, 868), (1066, 902),
    (1042, 938), (1030, 972), (1006, 1000), (976, 1016), (942, 1040), (910, 1048), (882, 1068), (852, 1078),
    (822, 1086), (790, 1082), (762, 1070), (740, 1052), (720, 1042), (690, 1036), (672, 1026), (640, 1012),
    (624, 1016), (600, 1026), (582, 1036), (560, 1050), (542, 1062), (518, 1080), (492, 1092), (462, 1104), (432, 1108),
    (400, 1112), (372, 1100), (344, 1092), (322, 1072), (304, 1048), (300, 1022), (306, 990), (318, 960),
    (334, 930), (356, 902), (372, 878), (378, 852), (368, 830), (356, 812), (338, 806), (318, 792),
    (300, 770), (290, 742), (282, 716), (276, 692), (284, 648), (278, 626), (274, 600), (266, 572),
    (270, 540), (280, 510), (290, 480), (296, 452), (310, 430), (318, 412),
]
ISLE_A = [  # proposed Gnufoundland
    (120, 120), (150, 85), (200, 60), (260, 52), (330, 48), (400, 44), (470, 40), (530, 46), (556, 64),
    (552, 102), (536, 140), (512, 166), (494, 158), (504, 128), (508, 102), (488, 88), (450, 94), (410, 100),
    (386, 116), (378, 150), (392, 186), (392, 214), (370, 250), (330, 272), (280, 280), (230, 284), (190, 302),
    (152, 330), (120, 346), (104, 330), (124, 300), (140, 266), (120, 230), (100, 190), (94, 150),
]
ISLE_B = [(1420, 90), (1460, 55), (1520, 45), (1575, 70), (1602, 120), (1592, 180), (1562, 230), (1532, 280),
          (1506, 330), (1480, 366), (1462, 340), (1450, 290), (1430, 240), (1410, 180), (1404, 130)]
ISLE_C = [(1385, 500), (1420, 470), (1470, 482), (1510, 464), (1546, 500), (1540, 550), (1562, 600),
          (1536, 650), (1546, 700), (1500, 732), (1455, 720), (1420, 742), (1394, 700), (1406, 650),
          (1380, 610), (1395, 560)]
ISLE_D = [(150, 790), (170, 780), (186, 800), (190, 850), (202, 900), (240, 930), (264, 975), (258, 1030),
          (230, 1070), (180, 1086), (130, 1076), (95, 1040), (85, 990), (105, 950), (140, 920), (152, 870),
          (146, 830)]
ISLE_E = [(1395, 840), (1440, 820), (1490, 836), (1500, 880), (1486, 930), (1470, 980), (1456, 1030),
          (1440, 1066), (1424, 1040), (1418, 990), (1405, 940), (1390, 890)]

# Innie Lake is a reservoir: the gnomes dammed a river valley at Gnod Dam and the water
# climbed every creek, the way Lake Texoma fills the Red and Washita valleys (Nathan, 2026-11-03).
# Each arm is (centerline, radius at head, radius at mouth).  The mask is grown, blurred, roughened
# and contoured, so the shoreline gets long drowned arms and many small coves.
DAM = (860, 860)
LAKE_ARMS = [
    ([(902, 700), (897, 728), (886, 758), (872, 790), (864, 820), (860, 846), (860, 858)], 6, 12),   # old river channel
    ([(842, 820), (816, 822), (796, 808), (786, 784), (776, 760), (771, 736)], 17, 4),                # Ratios arm
    ([(800, 816), (776, 834), (750, 830), (732, 808), (722, 788), (712, 780)], 12, 3),    # long west arm
    ([(876, 806), (902, 800), (924, 790), (944, 792), (958, 780), (966, 766)], 17, 4),                # east arm
    ([(840, 838), (818, 852), (800, 868), (788, 886)], 10, 3),                                       # south finger
    ([(884, 762), (860, 748), (842, 734), (830, 720)], 9, 3),                                        # north cove
]
LAKE_BODY = [(850, 822, 26), (876, 812, 21), (834, 834, 15), (868, 834, 17), (884, 786, 12)]
LAKE_HILLS = [(812, 842, 3.5), (818, 826, 3), (899, 802, 3), (757, 820, 2.5), (884, 828, 2.5)]   # drowned hilltops


def build_lake():
    from skimage.measure import find_contours
    import cv2
    x0, y0, sc = 660, 680, 4                    # 0.25 px grid over the lake area
    gw, gh = 340 * sc, 230 * sc
    m = np.zeros((gh, gw), np.float32)
    lr = np.random.default_rng(1108)

    def stamp(pts, r0, r1, val=1.0):
        line = catmull(pts, 10)
        L = len(line)
        for k, q in enumerate(line):
            r = r0 + (r1 - r0) * k / max(1, L - 1)
            cv2.circle(m, (int((q[0] - x0) * sc), int((q[1] - y0) * sc)), max(1, int(r * sc)), val, -1)
        return line

    for pts, r0, r1 in LAKE_ARMS:
        base = fractal(pts, iters=2, rough=0.07, closed=False, r=lr)
        line = stamp(base, r0, r1)
        # side coves up the little creeks
        for k in range(4, len(line) - 3, 6):
            if lr.random() < 0.55:
                a = line[k]; b = line[k + 1]
                d = (b - a) / (np.hypot(*(b - a)) + 1e-9)
                side = 1 if lr.random() < 0.5 else -1
                ang = side * lr.uniform(0.9, 1.5)
                dirv = np.array([d[0] * math.cos(ang) - d[1] * math.sin(ang), d[0] * math.sin(ang) + d[1] * math.cos(ang)])
                r_here = r0 + (r1 - r0) * k / len(line)
                ln = lr.uniform(6, 14) + r_here * 0.8
                tip = a + dirv * ln
                bend = tip + np.array([-dirv[1], dirv[0]]) * lr.uniform(-4, 4)
                stamp([a, (a + tip) / 2, bend], max(2.2, r_here * 0.35), 0.8)
    for x, y, r in LAKE_BODY:
        cv2.circle(m, (int((x - x0) * sc), int((y - y0) * sc)), int(r * sc), 1.0, -1)
    for x, y, r in LAKE_HILLS:
        cv2.circle(m, (int((x - x0) * sc), int((y - y0) * sc)), int(r * sc), 0.0, -1)
    m = cv2.GaussianBlur(m, (0, 0), 1.6 * sc)
    noise = cv2.resize(lr.random((gh // 18, gw // 18)).astype(np.float32), (gw, gh), interpolation=cv2.INTER_CUBIC)
    fine = cv2.resize(lr.random((gh // 5, gw // 5)).astype(np.float32), (gw, gh), interpolation=cv2.INTER_CUBIC)
    m = m + 0.16 * (noise - 0.5) + 0.08 * (fine - 0.5)
    cs = find_contours(m, 0.5)
    polys = [[(c[1] / sc + x0, c[0] / sc + y0) for c in cnt[::3]] for cnt in cs if len(cnt) > 12]
    def area(pl):
        return abs(sum(pl[i][0] * pl[i - 1][1] - pl[i - 1][0] * pl[i][1] for i in range(len(pl)))) / 2
    polys.sort(key=area, reverse=True)
    lake_poly = polys[0]
    isles_ = [pl for pl in polys[1:] if inside(pl[0], lake_poly) and area(pl) > 4]
    return lake_poly, isles_


ISLETS = [(86, 262, 7), (74, 300, 5), (572, 112, 6), (586, 88, 4), (1618, 150, 7), (1626, 206, 4),
          (1388, 304, 6), (1358, 520, 6), (1578, 582, 8), (1522, 764, 7), (1568, 664, 4), (1512, 902, 6),
          (1378, 1004, 5), (1472, 1094, 6), (58, 1002, 7), (68, 1060, 5), (204, 764, 5), (1330, 92, 5),
          (252, 708, 5), (700, 1086, 6), (992, 1052, 5), (1350, 676, 3), (1344, 706, 3), (1360, 694, 2.5),
          (232, 744, 3), (1196, 760, 4), (614, 1040, 4)]

from places import ADDED_PLACES, UNNAMED_TOWNS  # noqa: E402
# Gni became its own region on 2026-11-03 (Nathan), so Eversummer moves out of Slaanilok.
REGION_OVERRIDES = {'Eversummer': 'Gni'}
rough_main = 0.2
main = fractal(MAIN, iters=5, rough=rough_main)
isles = {k: fractal(v, iters=5, rough=0.19) for k, v in
         dict(A=ISLE_A, B=ISLE_B, C=ISLE_C, D=ISLE_D, E=ISLE_E).items()}
# Gnonmoon (Island D) is redrawn with Zohee Bay cut into its northeast shore.  It uses its own
# seed so the other islands keep their exact shapes.
GNONMOON = [(150, 790), (170, 780), (186, 800), (190, 850), (196, 892), (220, 898), (244, 894), (256, 908),
            (238, 920), (218, 926), (206, 940), (220, 954), (246, 958), (264, 978), (258, 1030), (230, 1070), (180, 1086),
            (130, 1076), (95, 1040), (85, 990), (105, 950), (140, 920), (152, 870), (146, 830)]
isles['D'] = fractal(GNONMOON, iters=5, rough=0.16, r=np.random.default_rng(2084))
lake, lake_isles = build_lake()
# seat Gnod Dam on the lake's southern tip, where the old channel leaves
_tip = max((p for p in lake if abs(p[0] - DAM[0]) < 14), key=lambda p: p[1])
DAM = (round(float(_tip[0]), 1), round(float(_tip[1]) - 3, 1))
islets = [blob(x, y, r) for x, y, r in ISLETS]

ALL_LAND = [main] + list(isles.values())

# ------------------------------------------------------------------ rivers

def river(pts, w0, w1, meander=0.06):
    base = fractal(pts, iters=2, rough=meander, closed=False)
    return catmull(base, seg=5), w0, w1

RIVERS = {
    "River's Belt": river([(625, 478), (590, 505), (562, 538), (530, 560), (500, 576), (470, 590), (482, 612),
                           (462, 632), (425, 640), (395, 652), (355, 660), (320, 652), (288, 646)], 1.0, 4.2),
    'backwater': river([(395, 652), (380, 676), (360, 690), (332, 700), (304, 694), (282, 686)], 1.4, 2.4),
    'backwater2': river([(372, 684), (356, 708), (330, 722), (306, 722), (286, 712)], 0.9, 1.6),
    'Springwater creek': river([(505, 482), (516, 500), (532, 512), (548, 526), (562, 538)], 0.6, 1.4, 0.1),
    'northern river': river([(700, 362), (664, 352), (628, 358), (592, 366), (556, 372), (526, 382), (496, 388)], 0.8, 3.0),
    'Steam Stream': river([(1004, 372), (984, 396), (960, 416), (940, 442), (930, 476), (922, 516), (918, 556),
                           (910, 600), (904, 650), (902, 690), (902, 704)], 0.8, 2.8),
    'Ratios creek': river([(792, 540), (782, 598), (776, 660), (771, 740)], 0.6, 1.8),
    'east creek': river([(1060, 560), (1020, 620), (994, 690), (976, 740), (966, 770)], 0.6, 1.8),
    'Slanic outflow': river([(860, 872), (855, 895), (850, 925), (856, 955), (866, 984)], 2.6, 3.6, 0.04),
    'Slanic west mouth': river([(866, 984), (854, 1024), (847, 1062), (842, 1082)], 2.4, 3.2, 0.05),
    'Slanic east mouth': river([(866, 984), (898, 1012), (932, 1028), (964, 1024)], 2.0, 3.0, 0.05),
    'fen channel': river([(852, 955), (812, 962), (782, 980), (768, 1012), (770, 1060)], 0.8, 1.6),
    'Gnufoundland river': river([(270, 140), (300, 186), (330, 222), (352, 262)], 0.7, 2.0),
    'Isle C stream': river([(1480, 540), (1462, 600), (1470, 660), (1458, 718)], 0.6, 1.6),
    'Isle D stream': river([(180, 930), (190, 990), (178, 1080)], 0.6, 1.4),
    'Isle B stream': river([(1520, 110), (1500, 190), (1490, 260)], 0.6, 1.4),
    'desert wadi': river([(500, 948), (488, 980), (470, 1010)], 0.4, 0.8, 0.1),
}

# ------------------------------------------------------------------ roads, rail, ferries
P = {k: (v[0], v[1]) for k, v in PLACES.items()}
ROADS = [
    [P['Cogbottom'], (700, 575), P['Cogington'], (600, 500), (558, 452), (532, 416), P["North Ham'n'Gnome"]],
    [P['Cogbottom'], (750, 560), (744, 500), P['Sproing']],
    [P['Pulley Junction'], P['Broken Wheel'], P['Crossroads'], (590, 730), P['I Crant Spellit'], (452, 716),
     P['Brokit Fixit'], P['Backwater Cog'], (330, 660), P['Port Gnaru']],
    [P['Port Gnaru'], (352, 628), P["Farms of Verdon't"], (462, 588), P['Runningnomata'], (498, 520), P['Springwater']],
    [P['Cogbottom'], P['Gnomish Farms'], P['Smallerville'], (582, 598), (566, 568), (522, 560), P['Runningnomata']],
    [P['Crossroads'], (660, 800), (676, 852), P['Gloopenstein'], P['Gnix Goop'], (800, 932), (846, 944),
     (920, 958), P['Brassin']],
    [P['I Crant Spellit'], (528, 752), P['Sleeping Dogs Hollar'], (590, 832), (628, 900), P['Lost Boot']],
    [P['Gloopenstein'], P['Lost Boot'], (612, 978), (584, 1002), (556, 1012), P['Pretty Good Chances'],
     P['Sockarillo'], P['Grit Spit and Fellers'], (350, 1030), P['Flybar']],
    [P['Brassin'], (1052, 918), (1080, 850), (1098, 780), P['Gnew York'], (1180, 676), (1250, 652), P['Port Gnasher']],
    [P['Gnew York'], (1000, 652), (930, 622), P['Cogsworth'], P["Gnome'n'Pinion"], P['Cogbottom']],
    [P['Cogsworth'], (930, 560), P['Twinshift'], (1020, 488), P['Cogbend Hold'], (1062, 420), (1060, 360), P['Sky Dream']],
    [P['Twinshift'], (960, 452), P['Glowrock Retreat']],
    [P['Sockarillo'], (458, 960), (430, 940), P['Dungeon of Anger']],
]
TRAILS = [
    [P['Cogbend Hold'], P['Fortress of Easy Defeat']],
    [P['Cogbend Hold'], (1100, 420), P['Fortress of Moderation'], (1166, 290), P['6th Age Ruins'],
     P['Fortress of Impossibility'], P['The Ancient Device']],
    [P['Cogbend Hold'], P["The Crafter's Mines"]],
    [P['Cogbend Hold'], (1130, 500), P["Big ole' Hole"]],
    [P['Twinshift'], P['Mortuary Mines']],
    [P['Crossroads'], P['Dungeon of Soup']],
    [P['Sproing'], P["Bob's Hut"]], [P['Sproing'], (700, 420), P['Creepy Gnut'], P['Cave of the Gnut']],
    [P['Sproing'], (760, 380), P['Unspoken Dungeon']],
    [P['Springwater'], P['Mouse Reserve'], P["Hunter's Folly"]],
    [P['Gloopenstein'], P["Anterpiller's Mound"]],
    [P['Gnix Goop'], P['Fairy Fen'], P['Bog of Eternal Regret']],
    [P['Mycelia'], P['Pixie Puddles']],
    [P['Gnyannis'], (380, 120), (320, 150), P['Frozen Fields'], P['Giantation'], P["Ogre's Hold"]],
    [P['Werewolf London'], (300, 110), P['Frozen Fields']],
]
RAIL = [
    [P['Port Gnaru'], (360, 666), (420, 678), (480, 678), (548, 692), (600, 714), P['Crossroads'], (700, 712), P['Pulley Junction']],
    [P['Pulley Junction'], P['Cogbottom'], (800, 612), P['Cogsworth'], (922, 580), (958, 540), P['Twinshift']],
    [P['Pulley Junction'], (822, 690), (900, 694), (980, 694), P['Gnew York']],
]
FERRIES = [  # the Lantern Chain (eastern ferry landings are still unnamed)
    [P['Port Gnasher'], (1346, 626), (1388, 608)],
    [(1450, 724), (1458, 780), (1438, 832)],
    [(1455, 470), (1470, 420), (1478, 368)],
]

# ------------------------------------------------------------------ terrain

HEIGHTS_RIDGE = [(968, 404), (1030, 352), (1100, 292), (1168, 232), (1238, 172), (1282, 128)]
EXCLUSION = (1090, 392)
DRY_RIDGE = [(384, 862), (430, 850), (470, 852), (510, 868), (552, 888), (596, 918)]
GNUF_MTN = [(140, 120), (175, 150), (205, 185), (235, 215)]
MTN_GROUPS = [
    dict(ridge=HEIGHTS_RIDGE, step=13, band=34, s=(10, 17), snow=0.55),
    dict(ridge=[(1044, 400), (1076, 384), (1110, 372)], step=12, band=12, s=(8, 12), snow=0.2),
    dict(ridge=DRY_RIDGE, step=14, band=10, s=(7, 11), snow=0, dry=True),
    dict(ridge=GNUF_MTN, step=9, band=30, s=(7, 13), snow=1.0),
    dict(ridge=[(1440, 120), (1500, 140), (1550, 160)], step=13, band=12, s=(7, 10), snow=0.6),
    dict(ridge=[(1430, 520), (1480, 560), (1500, 620)], step=14, band=10, s=(6, 9), snow=0),
    dict(ridge=[(120, 980), (160, 1000), (205, 1010)], step=14, band=8, s=(6, 9), snow=0),
]
HILLS = [
    dict(area=[(690, 490), (830, 480), (840, 545), (700, 555)], d=17, s=(6, 9)),     # Hills of Ratios
    dict(area=[(845, 520), (905, 515), (905, 552), (845, 552)], d=13, s=(5, 8)),     # Brasstop ridge
    dict(area=[(620, 500), (690, 495), (690, 530), (620, 528)], d=14, s=(5, 7)),     # Cogington hills
    dict(area=[(560, 380), (612, 370), (616, 404), (566, 410)], d=12, s=(5, 7)),     # forest ridge west of the Woods
    dict(area=[(570, 830), (650, 826), (652, 876), (575, 878)], d=14, s=(5, 7)),     # Slanic hills / Anterpiller
    dict(area=[(540, 585), (590, 580), (590, 615), (545, 618)], d=12, s=(5, 7)),     # Rocks Throw
    dict(area=[(940, 420), (1010, 410), (1040, 470), (960, 480)], d=15, s=(6, 8)),   # Cradle foothills
    dict(area=[(1404, 600), (1430, 600), (1440, 690), (1410, 690)], d=14, s=(5, 7)), # Isle C west
    dict(area=[(130, 1020), (240, 1010), (220, 1060), (130, 1060)], d=15, s=(5, 7)), # Isle D south
    dict(area=[(960, 860), (1040, 840), (1040, 900), (970, 910)], d=15, s=(5, 7)),   # southeast downs
    dict(area=[(1180, 600), (1250, 600), (1240, 650), (1170, 660)], d=14, s=(5, 7)), # Gnasher hinterland
    dict(area=[(960, 560), (1060, 540), (1060, 600), (970, 610)], d=16, s=(5, 7)),   # Cogsworth downs
]
FORESTS = [
    dict(area=[(608, 330), (700, 312), (800, 310), (868, 330), (872, 412), (820, 425), (700, 428), (640, 420), (612, 380)], d=11, kind='tree'),
    dict(area=[(420, 436), (488, 432), (494, 488), (440, 512), (414, 490)], d=9, kind='tree'),
    dict(area=[(505, 765), (585, 760), (590, 812), (520, 815)], d=9, kind='tree'),
    dict(area=[(560, 836), (612, 836), (606, 880), (560, 880)], d=9, kind='tree'),
    dict(area=[(600, 432), (650, 430), (650, 460), (600, 460)], d=8, kind='tree'),       # Creepy Gnut grove
    dict(area=[(590, 600), (640, 598), (640, 630), (590, 632)], d=7, kind='orchard'),   # Smallerville orchards
    dict(area=[(106, 200), (150, 214), (146, 252), (112, 262)], d=10, kind='pine'),
    dict(area=[(328, 200), (372, 196), (376, 246), (334, 248)], d=10, kind='pine'),
    dict(area=[(200, 286), (250, 284), (240, 300), (200, 300)], d=10, kind='pine'),
    dict(area=[(1440, 165), (1495, 180), (1505, 280), (1470, 305), (1450, 235)], d=10, kind='pine'),   # Shen Shin
    dict(area=[(1500, 640), (1535, 640), (1530, 700), (1480, 715), (1470, 680)], d=10, kind='palm'),
    dict(area=[(1400, 860), (1480, 850), (1470, 920), (1420, 930)], d=11, kind='palm'),
    dict(area=[(150, 940), (230, 935), (250, 990), (150, 990)], d=10, kind='tree'),
    dict(area=[(920, 330), (1000, 290), (1010, 330), (960, 360)], d=10, kind='pine'),
    dict(area=[(1110, 720), (1170, 700), (1150, 760), (1100, 790)], d=10, kind='tree'),
    dict(area=[(990, 760), (1050, 740), (1060, 800), (1000, 830)], d=10, kind='tree'),
    dict(area=[(860, 420), (900, 410), (905, 460), (865, 470)], d=9, kind='tree'),
]
MARSH = [
    [(700, 940), (760, 930), (820, 950), (800, 1000), (760, 1050), (710, 1030), (690, 980)],
    [(820, 960), (900, 980), (950, 1010), (920, 1050), (850, 1060), (820, 1020)],
    [(570, 940), (625, 935), (630, 975), (580, 985)],
    [(760, 852), (784, 860), (778, 892), (752, 878)],           # reeds at the south finger
    [(940, 980), (990, 975), (975, 1010), (945, 1012)],
]
DUNES = [
    dict(area=[(322, 905), (380, 900), (380, 1000), (340, 1050), (318, 1030)], d=14),
    dict(area=[(410, 1040), (530, 1035), (520, 1090), (430, 1095)], d=15),
]
FLATS = [[(536, 1000), (590, 994), (600, 1024), (548, 1036)]]
FIELDS = [
    dict(area=[(650, 598), (712, 596), (712, 640), (652, 642)], n=7),
    dict(area=[(400, 596), (462, 596), (458, 640), (400, 638)], n=7),
    dict(area=[(660, 650), (730, 650), (720, 690), (665, 690)], n=4),
    dict(area=[(560, 640), (620, 640), (620, 670), (560, 670)], n=4),
]

# ------------------------------------------------------------------ audit parse (types and clues)

def parse_audit():
    sec_type = {
        'I.': 'region', 'II.': 'city', 'III.': 'settlement', 'IV.': 'natural',
        'V.': 'expedition', 'VI.': 'business', 'VII.': 'poi',
    }
    info, cur = {}, None
    in_2b = False
    for line in open(AUDIT, encoding='utf-8'):
        if line.startswith('## Inventory 2B'):
            in_2b = True
        elif line.startswith('## ') and in_2b:
            break
        if not in_2b:
            continue
        m = re.match(r'### (\w+\.)', line)
        if m:
            cur = sec_type.get(m.group(1))
            continue
        if cur and line.startswith('| ') and not line.startswith('| Place | Draft') and not line.startswith('| ---'):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            name, parent, clue, mentions = cells
            parent = parent.rstrip('.')
            info[name] = dict(type=cur, parent=parent, clue=clue, mentions=mentions)
    return info

# ------------------------------------------------------------------ SVG assembly

out = []
add = out.append


def text(x, y, s, size, fill=C['ink'], anchor='start', weight='normal', style='normal', ls=0, halo=True,
         rot=0, cls='', opacity=1, extra=''):
    s = s.replace('.  ', '.\u00a0 ')  # two spaces after periods survive SVG whitespace rules
    tr = f' transform="rotate({rot} {x:.1f} {y:.1f})"' if rot else ''
    h = ' stroke="#f3e7c6" stroke-width="3" stroke-linejoin="round" paint-order="stroke"' if halo else ''
    c = f' class="{cls}"' if cls else ''
    add(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" '
        f'font-weight="{weight}" font-style="{style}" letter-spacing="{ls}" opacity="{opacity}"{h}{tr}{c}{extra}>{esc(s)}</text>')


def build():
    info = parse_audit()
    missing = [n for n in PLACES if n not in info]
    extra = [n for n in info if n not in PLACES]
    assert not missing and not extra, (missing, extra)
    assert len(PLACES) == 100

    add(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
        f'viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{FONT}">')
    add(f'<title>Gnomadica master map v{VERSION} (working draft)</title>')
    # ---------------- defs
    add('<defs>')
    add('<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>'
        '<feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.16  0 0 0 0.55 0"/></filter>')
    add('<filter id="mottle" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3"/>'
        '<feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0.5 -0.12"/></filter>')
    add('<filter id="wash" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>')
    add('<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>')
    add(f'<filter id="softwide" filterUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}"><feGaussianBlur stdDeviation="5"/></filter>')
    add('<filter id="steam" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>')
    add(f'<radialGradient id="seaGrad" cx="50%" cy="55%" r="70%"><stop offset="0" stop-color="{C["sea"]}"/>'
        f'<stop offset="1" stop-color="{C["sea_deep"]}"/></radialGradient>')
    add(f'<radialGradient id="lakeGrad" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#7fb0bb"/>'
        f'<stop offset="1" stop-color="#a6cdd0"/></radialGradient>')
    add('<pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">'
        f'<line x1="0" y1="0" x2="0" y2="4" stroke="{C["field"]}" stroke-width="1.4"/></pattern>')
    add('<pattern id="hatch2" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-50)">'
        '<line x1="0" y1="0" x2="0" y2="4" stroke="#b6a356" stroke-width="1.2"/></pattern>')
    add('<pattern id="snowdots" width="9" height="9" patternUnits="userSpaceOnUse">'
        '<circle cx="2" cy="2" r="0.9" fill="#ffffff"/><circle cx="6.5" cy="6" r="0.7" fill="#ffffff"/></pattern>')
    # symbols
    add(f'<symbol id="tree" overflow="visible"><line x1="0" y1="0" x2="0" y2="3" stroke="{C["forest_dk"]}" stroke-width="1.1"/>'
        f'<circle cx="0" cy="-2.5" r="4.2" fill="{C["forest"]}" stroke="{C["forest_dk"]}" stroke-width="0.8"/>'
        f'<path d="M-2.4,-3.6 A2.6,2.6 0 0 1 0.6,-5.6" stroke="#9fbb72" stroke-width="0.9" fill="none"/></symbol>')
    add(f'<symbol id="orchard" overflow="visible"><circle cx="0" cy="-1.5" r="2.6" fill="#86a457" stroke="{C["forest_dk"]}" stroke-width="0.6"/>'
        f'<circle cx="0.8" cy="-2.2" r="0.6" fill="#c8553d"/></symbol>')
    add(f'<symbol id="pine" overflow="visible"><path d="M0,-9 L4,-1.5 L1.2,-1.5 L1.2,2 L-1.2,2 L-1.2,-1.5 L-4,-1.5 Z" '
        f'fill="{C["pine"]}" stroke="#2f4630" stroke-width="0.7"/><path d="M0,-9 L-1.8,-5.4 L0,-5.9 L1.8,-5.4 Z" fill="#ffffff"/></symbol>')
    add('<symbol id="palm" overflow="visible"><path d="M0,3 Q1,-3 0,-7" stroke="#7a5a32" stroke-width="1.2" fill="none"/>'
        '<path d="M0,-7 Q-4,-9 -6,-5 M0,-7 Q4,-9 6,-5 M0,-7 Q-2,-11 -5,-10 M0,-7 Q2,-11 5,-10" stroke="#4f8a4a" stroke-width="1.4" fill="none" stroke-linecap="round"/></symbol>')
    add(f'<symbol id="tuft" overflow="visible"><path d="M-4,0 L4,0 M-2,0 L-3,-4 M0,0 L0,-5 M2,0 L3,-4" stroke="{C["marsh"]}" stroke-width="0.9" fill="none" stroke-linecap="round"/></symbol>')
    add(f'<symbol id="dune" overflow="visible"><path d="M-7,0 Q-1,-6 7,0" fill="none" stroke="{C["sand_dk"]}" stroke-width="1"/>'
        f'<path d="M-1,-3 Q3,-2.6 7,0" fill="none" stroke="{C["sand_dk"]}" stroke-width="2" opacity="0.45"/></symbol>')
    add(f'<symbol id="boat" overflow="visible"><path d="M-6,0 L6,0 L4,3 L-4,3 Z" fill="#7a5a32" stroke="{C["coast"]}" stroke-width="0.6"/>'
        f'<path d="M0,0 L0,-11 L6,-1.5 Z" fill="#f6eed6" stroke="{C["coast"]}" stroke-width="0.6"/><path d="M-0.5,-1 L-0.5,-8 L-4.5,-1.5 Z" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="0.5"/></symbol>')
    add(f'<symbol id="crystal" overflow="visible"><path d="M0,-6 L2.4,-1 L0,2 L-2.4,-1 Z" fill="#cdbdf2" stroke="#6e55a8" stroke-width="0.7"/>'
        f'<path d="M0,-6 L0,2" stroke="#ffffff" stroke-width="0.5"/></symbol>')
    add('</defs>')

    # ---------------- sea
    add(f'<rect width="{W}" height="{H}" fill="url(#seaGrad)"/>')
    add(f'<rect width="{W}" height="{H}" filter="url(#mottle)" opacity="0.35"/>')
    # wave marks out at sea
    for _ in range(140):
        x, y = rng.uniform(30, W - 30), rng.uniform(30, H - 30)
        if any(inside((x, y), poly) for poly in ALL_LAND) or near_land(x, y, 40):
            continue
        s = rng.uniform(4, 7)
        add(f'<path d="M{x - s:.1f},{y:.1f} q{s / 2:.1f},-{s / 2.5:.1f} {s:.1f},0 q{s / 2:.1f},-{s / 2.5:.1f} {s:.1f},0" '
            f'stroke="{C["ring"]}" stroke-width="0.8" fill="none" opacity="0.55"/>')

    # ---------------- coast rings (classic water lines)
    land_d = [d_of(p) for p in ALL_LAND] + [d_of(p) for p in islets]
    add('<defs>' + ''.join(f'<path id="land{i}" d="{d}"/>' for i, d in enumerate(land_d)) + '</defs>')
    land_paths = [f'#land{i}' for i in range(len(land_d))]
    for w, op in [(46, 0.16), (32, 0.24), (20, 0.34), (10, 0.5)]:
        for d in land_paths:
            add(f'<use href="{d}" fill="none" stroke="{C["ring"]}" stroke-width="{w + 1.4}" stroke-linejoin="round" opacity="{op}"/>')
            add(f'<use href="{d}" fill="none" stroke="#a7c9c9" stroke-width="{w}" stroke-linejoin="round" opacity="{op + 0.25}"/>')
    for d in land_paths:  # shallows
        add(f'<use href="{d}" fill="none" stroke="#bcd8d2" stroke-width="7" stroke-linejoin="round"/>')

    # ---------------- land
    add('<clipPath id="landclip">' + ''.join(f'<use href="{d}"/>' for d in land_paths) + '</clipPath>')
    for d in land_paths:
        add(f'<use href="{d}" fill="{C["land"]}"/>')
    add('<g clip-path="url(#landclip)">')
    # region washes
    blobs = {
        'Gnomerica': [(740, 600, 120), (720, 420, 100), (1060, 690, 80), (1220, 650, 60), (960, 640, 70)],
        'Gnohio': [(430, 560, 140), (520, 410, 80), (520, 760, 70), (330, 700, 60)],
        'Gnafrica': [(450, 990, 120), (340, 1040, 60)],
        'Slanic': [(800, 990, 120), (640, 920, 70), (990, 990, 55)],
        'Gno Dao Cradle': [(1040, 420, 90), (1170, 300, 95), (1260, 150, 60), (1170, 510, 55)],
        'Gnufoundland': [(300, 160, 170), (470, 80, 80)],
        'Slaanilok': [(1465, 600, 120)],
        'Gni': [(1445, 930, 105)],
    }
    add('<g id="washes">')
    for reg, bl in blobs.items():
        add(f'<g filter="url(#wash)" opacity="0.42">' + ''.join(
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="{REGION_COLORS[reg]}"/>' for x, y, r in bl) + '</g>')
    add('</g>')
    add(f'<rect width="{W}" height="{H}" filter="url(#mottle)" opacity="0.5"/>')
    # inner coast shading
    for d in land_paths:
        add(f'<use href="{d}" fill="none" stroke="{C["land_edge"]}" stroke-width="14" opacity="0.7" filter="url(#soft)"/>')
    # snow cover on Gnufoundland interior
    snow = fractal([(150, 120), (260, 100), (380, 130), (370, 230), (260, 262), (160, 250), (120, 180)], iters=3, rough=0.12)
    add(f'<path d="{d_of(snow)}" fill="#f8f6ee" opacity="0.65" filter="url(#soft)"/>')
    add(f'<path d="{d_of(snow)}" fill="url(#snowdots)" opacity="0.8"/>')
    # sandy wash on Gnafrica
    sandy = fractal([(320, 900), (420, 880), (560, 905), (620, 1000), (540, 1060), (430, 1100), (330, 1070)], iters=3, rough=0.1)
    add(f'<path d="{d_of(sandy)}" fill="{C["sand"]}" opacity="0.55" filter="url(#soft)"/>')
    # fields
    for f in FIELDS:
        for p in poisson(f['area'], 13)[:f['n']]:
            w_, h_ = rng.uniform(8, 14), rng.uniform(6, 10)
            a = rng.uniform(-30, 30)
            pat = 'hatch' if rng.random() < 0.5 else 'hatch2'
            add(f'<rect x="{p[0] - w_ / 2:.1f}" y="{p[1] - h_ / 2:.1f}" width="{w_:.1f}" height="{h_:.1f}" fill="url(#{pat})" '
                f'stroke="#a8945a" stroke-width="0.5" transform="rotate({a:.0f} {p[0]:.1f} {p[1]:.1f})" opacity="0.9"/>')
    # Jinlo terraces: stepped arcs on the slope
    for i in range(6):
        r_ = 10 + i * 4
        add(f'<path d="M{1000 - r_},{386 + i * 0.6} A{r_},{r_ * 0.55} 0 0 1 {1000 + r_},{386 + i * 0.6}" fill="none" '
            f'stroke="#9aa45a" stroke-width="1.1" opacity="0.85"/>')
    # Frozen Fields: furrows under snow
    for i in range(5):
        add(f'<path d="M{238 + i * 3},{170 + i * 6} l60,-4" stroke="#c9d3d9" stroke-width="1" opacity="0.9"/>')
    # salt-flat stipple
    for f in FLATS:
        for p in poisson(f, 4.5, tries=2500):
            add(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="0.7" fill="{C["sand_dk"]}" opacity="0.6"/>')
    # crystals on the flats
    for p in poisson([(1128, 478), (1192, 470), (1212, 528), (1150, 534)], 9):
        add(f'<use href="#crystal" x="{p[0]:.1f}" y="{p[1]:.1f}" transform="rotate({rng.uniform(-20, 20):.0f} {p[0]:.1f} {p[1]:.1f})"/>')
    add('</g>')

    # ---------------- Innie Lake (reservoir behind Gnod Dam)
    ld = d_of(lake)
    add(f'<path d="{ld}" fill="url(#lakeGrad)"/>')
    add(f'<clipPath id="lakeclip"><path d="{ld}"/></clipPath>')
    add('<g clip-path="url(#lakeclip)">')
    # the drowned river valley: deeper water down the old channel, widest at the dam
    chan = catmull(LAKE_ARMS[0][0], 8)
    for w, op in [(46, 0.16), (28, 0.22), (14, 0.25)]:
        add(f'<path d="{d_of(chan, False)}" fill="none" stroke="#5f97a7" stroke-width="{w}" stroke-linecap="round" opacity="{op}" filter="url(#softwide)"/>')
    for x, y, r in LAKE_BODY[:2]:
        add(f'<circle cx="{x}" cy="{y}" r="{r * 0.7:.0f}" fill="#5f97a7" opacity="0.22" filter="url(#softwide)"/>')
    for w, op in [(16, 0.16), (9, 0.28), (3.5, 0.55)]:
        add(f'<path d="{ld}" fill="none" stroke="{C["ring"]}" stroke-width="{w + 1.1}" opacity="{op}"/>')
        add(f'<path d="{ld}" fill="none" stroke="#b4d6d6" stroke-width="{w}" opacity="{op + 0.3}"/>')
    # the old riverbed, still traced on gnome charts
    add(f'<path d="{d_of(chan[:-6], False)}" fill="none" stroke="#2f5d73" stroke-width="0.8" stroke-dasharray="1 3" opacity="0.7"/>')
    # a drowned road running down into the water from the west
    add('<path d="M736,806 Q752,812 770,818 T806,826" fill="none" stroke="#6b4a2a" stroke-width="0.9" stroke-dasharray="3 3" opacity="0.4"/>')
    add('</g>')
    add(f'<path d="{ld}" fill="none" stroke="{C["coast"]}" stroke-width="1.1" stroke-linejoin="round"/>')
    for li in lake_isles:
        add(f'<path d="{d_of(li)}" fill="{C["land"]}" stroke="{C["coast"]}" stroke-width="0.8"/>')
    gnod_dam()

    # ---------------- rivers
    for name, (pts, w0, w1) in RIVERS.items():
        n = len(pts)
        for i in range(n - 1):
            w_ = w0 + (w1 - w0) * i / (n - 1)
            add(f'<line x1="{pts[i][0]:.1f}" y1="{pts[i][1]:.1f}" x2="{pts[i + 1][0]:.1f}" y2="{pts[i + 1][1]:.1f}" '
                f'stroke="{C["river"]}" stroke-width="{w_:.2f}" stroke-linecap="round"/>')
    # Steam Stream wisps (warm water)
    for x, y in [(944, 440), (926, 508), (914, 586), (902, 664), (952, 402), (900, 716), (893, 732)]:
        add(f'<path d="M{x},{y} q-3,-5 0,-9 q3,-4 0,-8" stroke="#ffffff" stroke-width="1.3" fill="none" opacity="0.75" filter="url(#steam)"/>')

    # ---------------- terrain glyphs (back to front)
    glyphs = []
    for f in FORESTS:
        for p in poisson(f['area'], f['d']):
            if not on_land(p, 5):
                continue
            glyphs.append((p[1], f'<use href="#{f["kind"]}" x="{p[0]:.1f}" y="{p[1]:.1f}"/>'))
    for m in MARSH:
        for p in poisson(m, 9):
            if not on_land(p, 4):
                continue
            glyphs.append((p[1], f'<use href="#tuft" x="{p[0]:.1f}" y="{p[1]:.1f}"/>'))
        for p in poisson(m, 22)[:6]:
            if not on_land(p, 5):
                continue
            glyphs.append((p[1] - 1, f'<ellipse cx="{p[0]:.1f}" cy="{p[1]:.1f}" rx="{rng.uniform(2.5, 5):.1f}" ry="1.4" fill="{C["lake"]}" stroke="{C["river"]}" stroke-width="0.4"/>'))
    for dz in DUNES:
        for p in poisson(dz['area'], dz['d']):
            if not on_land(p, 7):
                continue
            glyphs.append((p[1], f'<use href="#dune" x="{p[0]:.1f}" y="{p[1]:.1f}"/>'))
    for hl in HILLS:
        for p in poisson(hl['area'], hl['d']):
            s = rng.uniform(*hl['s'])
            g_ = hill(p[0], p[1], s)
            if on_land(p, s + 3):
                glyphs.append((p[1], g_))
    for g in MTN_GROUPS:
        for (x, y), s in along(g['ridge'], g['step'], g['band'], g['s']):
            g_ = mountain(x, y, s, snow=rng.random() < g['snow'], dry=g.get('dry', False))
            if on_land((x, y), s + 2):
                glyphs.append((y, g_))
    for k in range(5):  # Mountain of Exclusion: one great wall of peaks
        x = EXCLUSION[0] - 28 + k * 14
        y = EXCLUSION[1] + (abs(k - 2) * 4) - 6
        glyphs.append((y + 0.5, mountain(x, y, 15 - abs(k - 2) * 2, snow=True)))
    glyphs.append((PLACES['Hot Fire Volcano'][1], volcano(*P['Hot Fire Volcano'], 17)))
    glyphs.append((PLACES['Minor Heat Volcano'][1], volcano(*P['Minor Heat Volcano'], 11)))
    # Anterpiller's Mound and Giantation plateau
    mx, my = P["Anterpiller's Mound"]
    glyphs.append((my, f'<path d="M{mx - 10},{my + 2} Q{mx},{my - 12} {mx + 10},{my + 2} Z" fill="#c8a970" stroke="{C["mtn_dk"]}" stroke-width="0.9"/>'
                       f'<circle cx="{mx - 2}" cy="{my - 3}" r="1" fill="{C["mtn_dk"]}"/><circle cx="{mx + 3}" cy="{my - 1}" r="1" fill="{C["mtn_dk"]}"/>'))
    gx, gy = P['Giantation']
    glyphs.append((gy, f'<path d="M{gx - 18},{gy + 4} L{gx - 12},{gy - 8} L{gx + 12},{gy - 8} L{gx + 18},{gy + 4} Z" fill="{C["mtn"]}" stroke="{C["mtn_dk"]}" stroke-width="1"/>'
                       f'<path d="M{gx - 12},{gy - 8} L{gx + 12},{gy - 8} L{gx + 10},{gy - 5} L{gx - 10},{gy - 5} Z" fill="{C["snow"]}"/>'
                       + ''.join(f'<line x1="{gx + 4 + i * 3}" y1="{gy - 5}" x2="{gx + 8 + i * 3}" y2="{gy + 4}" stroke="{C["mtn_dk"]}" stroke-width="0.6"/>' for i in range(3))))
    # Big ole' Hole
    bx, by = P["Big ole' Hole"]
    glyphs.append((by, f'<ellipse cx="{bx}" cy="{by}" rx="8" ry="4.5" fill="#5b4632" stroke="{C["coast"]}" stroke-width="0.8"/>'
                       f'<ellipse cx="{bx}" cy="{by + 0.8}" rx="5" ry="2.6" fill="#2e2318"/>'))
    # Pixie Puddles
    px_, py_ = P['Pixie Puddles']
    for dx, dy, r in [(-4, 0, 2.6), (2, -3, 2), (4, 2, 1.6), (-1, 4, 1.4)]:
        glyphs.append((py_, f'<ellipse cx="{px_ + dx}" cy="{py_ + dy}" rx="{r + 1}" ry="{r * 0.6}" fill="#a6d4dc" stroke="{C["river"]}" stroke-width="0.5"/>'))
    glyphs.sort(key=lambda g: g[0])
    add('<g id="terrain">' + ''.join(g[1] for g in glyphs) + '</g>')

    # ---------------- coastline ink
    for d in land_paths:
        add(f'<use href="{d}" fill="none" stroke="{C["coast"]}" stroke-width="1.6" stroke-linejoin="round"/>')
    # cliffs at Flybar (southwest)
    cliff = [p for p in main if 296 < p[0] < 330 and 990 < p[1] < 1075]
    for p in cliff[::2]:
        add(f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{p[0] + 5:.1f}" y2="{p[1] + 1:.1f}" stroke="{C["coast"]}" stroke-width="1"/>')
    # Port Gnasher's outer reef
    for x, y in [(1336, 662), (1342, 676), (1350, 688), (1354, 702), (1346, 714), (1334, 722)]:
        add(f'<path d="M{x - 3},{y} l1.5,-2.5 l1.5,2.5 l1.5,-2.5 l1.5,2.5" stroke="#7a5f48" stroke-width="0.8" fill="none"/>')

    # ---------------- roads, trails, rail, ferries
    add('<g id="routes" fill="none" stroke-linecap="round" stroke-linejoin="round">')
    for r in ROADS:
        add(f'<path d="{d_of(catmull(r, 6), False)}" stroke="#f3e7c6" stroke-width="3" opacity="0.7"/>')
        add(f'<path d="{d_of(catmull(r, 6), False)}" stroke="{C["road"]}" stroke-width="1.3" stroke-dasharray="5 2.5"/>')
    for r in TRAILS:
        add(f'<path d="{d_of(catmull(r, 6), False)}" stroke="{C["road"]}" stroke-width="0.9" stroke-dasharray="1.5 2.5" opacity="0.9"/>')
    for r in RAIL:
        d = d_of(catmull(r, 6), False)
        add(f'<path d="{d}" stroke="#f3e7c6" stroke-width="4" opacity="0.7"/>')
        add(f'<path d="{d}" stroke="{C["rail"]}" stroke-width="3.6" stroke-dasharray="0.9 3.6" opacity="0.85"/>')
        add(f'<path d="{d}" stroke="{C["rail"]}" stroke-width="1" opacity="0.9"/>')
    for r in FERRIES:
        add(f'<path d="{d_of(catmull(r, 8), False)}" stroke="{C["ferry"]}" stroke-width="1.3" stroke-dasharray="0.1 4.5"/>')
    add('</g>')
    # lantern beacons along the chain
    for x, y in [(1346, 626), (1458, 780), (1470, 420)]:
        add(f'<circle cx="{x}" cy="{y}" r="5" fill="#ffd77a" opacity="0.5" filter="url(#steam)"/><circle cx="{x}" cy="{y}" r="1.8" fill="#e8a33b" stroke="{C["coast"]}" stroke-width="0.5"/>')

    # boats: ferries on the Lantern Chain, fishers on the lake, traders at sea
    for x, y, sc in [(1366, 618, 0.9), (1452, 800, 0.9), (604, 236, 1.1), (240, 820, 1), (1230, 860, 1.1),
                     (838, 826, 0.7), (918, 794, 0.6), (520, 1130, 0.9), (1050, 120, 1.1), (60, 640, 1)]:
        add(f'<use href="#boat" transform="translate({x} {y}) scale({sc})"/>')

    # ---------------- region labels
    add('<g id="region-labels" font-style="normal">')
    text(1434, 942, 'ISLAND OF GNI', 11, fill=shade(REGION_COLORS['Gni'], 0.5), anchor='middle', weight='bold', ls=3, rot=-85, opacity=0.85)
    text(1532, 214, 'SHEN SHIN', 15, fill='#3d4f5c', anchor='middle', weight='bold', ls=5, rot=-74, opacity=0.85)
    reg_lbl = {
        'Gnomerica': (780, 476, 0, 21), 'Gnohio': (400, 415, 0, 21), 'Gnafrica': (452, 1086, 0, 19),
        'Slanic': (936, 902, 0, 19), 'Gnufoundland': (262, 268, -4, 17), 'Slaanilok': (1450, 598, -80, 17),
    }
    for reg, (x, y, rot, sz) in reg_lbl.items():
        col = shade(REGION_COLORS[reg], 0.45)
        text(x, y, reg.upper(), sz, fill=col, anchor='middle', weight='bold', ls=7, rot=rot, opacity=0.8)
    # Gno Dao Cradle follows the arm
    add('<path id="cradlePath" d="M1172,372 L1322,238" fill="none"/>')
    add(f'<text font-size="15" font-weight="bold" letter-spacing="5" fill="{shade(REGION_COLORS["Gno Dao Cradle"], 0.45)}" opacity="0.8" '
        f'stroke="#f3e7c6" stroke-width="3" paint-order="stroke"><textPath href="#cradlePath" startOffset="50%" text-anchor="middle">GNO DAO CRADLE</textPath></text>')
    add('</g>')

    # ---------------- area labels (natural features)
    add('<g id="area-labels">')
    for name, (x, y, rot, sz) in AREA_LABELS.items():
        water = name in ("River's Belt", 'Steam Stream')
        text(x, y, name, sz, fill='#2f5d73' if water else '#5a4a32', anchor='middle', style='italic', ls=1, rot=rot)
    text(858, 802, 'Innie Lake', 12, fill='#1f4d63', anchor='middle', style='italic', ls=2)
    text(560, 336, 'northern river', 7.5, fill='#2f5d73', anchor='middle', style='italic', rot=-8)
    text(470, 840, 'the Dry Ridge', 8.5, fill='#5a4a32', anchor='middle', style='italic', ls=1, rot=4)
    add('</g>')
    # sea and island tags (descriptive only: no seas or islands B and D have names yet)
    add('<g id="sea-labels">')
    text(430, 322, 'the narrow sea', 12, fill='#2a5566', anchor='middle', style='italic', ls=3, halo=False, rot=-6)
    text(1360, 450, 'Lantern Chain', 9, fill='#2a5566', anchor='middle', style='italic', ls=1.5, halo=False, rot=-64)
    text(170, 846, 'GNONMOON', 11, fill='#3d4f5c', anchor='middle', weight='bold', ls=3, rot=-88, opacity=0.85)
    text(236, 943, 'Zohee Bay', 9, fill='#2a5566', anchor='start', style='italic', ls=1)
    text(1580, 1000, 'open sea', 12, fill='#2a5566', anchor='middle', style='italic', ls=4, halo=False, rot=-90)
    text(130, 520, 'open sea', 12, fill='#2a5566', anchor='middle', style='italic', ls=4, halo=False, rot=-90)
    add('</g>')

    # ---------------- pins and labels
    records = []
    add('<g id="pins">')
    for name, (x, y, tier, lab) in PLACES.items():
        meta = info[name]
        typ = meta['type']
        rec = dict(id=slug(name), name=name, type=typ, region=name if typ == 'region' else REGION_OVERRIDES.get(name, region_of(meta['parent'], name)), x=x, y=y,
                   tier=tier, clue=meta['clue'], mentions=meta['mentions'], status='proposed')
        records.append(rec)
        if typ == 'region' or name in AREA_LABELS:
            continue
        add(f'<g class="pin t{tier}" data-id="{rec["id"]}">')
        add(marker(name, typ, tier, x, y))
        dx, dy, anc = lab if lab else (8, 3.5, 'start')
        if typ == 'city' and tier == 1:
            text(x + dx, y + dy, name, 13.5 if name != 'Cogbottom' else 16, weight='bold', anchor=anc, ls=0.4)
        elif tier == 3:
            text(x + dx, y + dy, name, 7.6, fill=C['ink2'], anchor=anc, style='italic')
        elif typ == 'natural':
            text(x + dx, y + dy, name, 8.6, fill='#5a4a32', anchor=anc, style='italic')
        else:
            text(x + dx, y + dy, name, 9.4 if tier == 2 else 11.5, anchor=anc, weight='bold' if tier == 1 else 'normal')
        add('</g>')
    add('</g>')

    # unnamed towns (names still open)
    for uid, (x, y, reg) in UNNAMED_TOWNS.items():
        add(f'<g class="pin t1" data-id="{uid}">{marker("x", "city", 2, x, y)}</g>')
    # the Three Idols: three standing stones
    ix, iy = ADDED_PLACES['Three Idols']['x'], ADDED_PLACES['Three Idols']['y']
    for dx, h in [(-5, 9), (0, 12), (5, 9)]:
        add(f'<path d="M{ix + dx - 1.8:.1f},{iy:.1f} L{ix + dx - 1.4:.1f},{iy - h + 1.5:.1f} Q{ix + dx:.1f},{iy - h:.1f} {ix + dx + 1.4:.1f},{iy - h + 1.5:.1f} L{ix + dx + 1.8:.1f},{iy:.1f} Z" fill="#b9b2a2" stroke="{C["coast"]}" stroke-width="0.6"/>')
    # Legipt's ancient step pyramid
    lx, ly = ADDED_PLACES['Legipt']['x'], ADDED_PLACES['Legipt']['y'] - 13
    for k, (w_, h_) in enumerate([(13, 3), (10, 3), (7, 3), (4, 3)]):
        add(f'<rect x="{lx - w_ / 2:.1f}" y="{ly - (k + 1) * h_:.1f}" width="{w_}" height="{h_}" fill="{"#d9bf86" if k % 2 == 0 else "#c9ad72"}" stroke="{C["coast"]}" stroke-width="0.6"/>')
    add(f'<rect x="{lx - 1}" y="{ly - 3}" width="2" height="3" fill="{C["coast"]}"/>')
    for name, a in ADDED_PLACES.items():
        sym = (castle(a['x'], a['y']) if name == 'Gnaagh' else
               '<circle cx="{0}" cy="{1}" r="9" fill="none"/>'.format(a['x'], a['y'] - 5) if name == 'Three Idols' else
               marker(name, a['type'], a['tier'], a['x'], a['y']))
        add(f'<g class="pin t{a["tier"]}" data-id="{slug(name)}">{sym}')
        dx, dy, anc = a['label']
        if a['tier'] == 1:
            text(a['x'] + dx, a['y'] + dy, name, 13.5, weight='bold', anchor=anc, ls=0.4)
        elif a['type'] in ('poi', 'expedition'):
            text(a['x'] + dx, a['y'] + dy, name, 9.4, anchor=anc)
        else:
            text(a['x'] + dx, a['y'] + dy, name, 11.5, weight='bold', anchor=anc)
        add('</g>')

    # ---------------- furniture
    cartouche()
    compass(1330, 372)
    legend(1086, 948)
    border()
    add(f'<rect width="{W}" height="{H}" filter="url(#paper)" opacity="0.22" style="mix-blend-mode:multiply" pointer-events="none"/>')
    add('</svg>')
    return records

# ------------------------------------------------------------------ drawing helpers

def on_land(p, margin=0):
    if not any(inside(p, poly) for poly in ALL_LAND):
        return False
    return margin == 0 or not near_coast(p, margin)


def near_coast(p, d):
    for poly in ALL_LAND:
        for q in poly:
            if (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 < d * d:
                return True
    return False


def near_land(x, y, d):
    for poly in ALL_LAND + islets:
        for p in poly[::4]:
            if (p[0] - x) ** 2 + (p[1] - y) ** 2 < d * d:
                return True
    return False


def along(ridge, step, band, srange):
    pts = []
    for (a, b) in zip(ridge[:-1], ridge[1:]):
        a, b = np.array(a, float), np.array(b, float)
        L = np.hypot(*(b - a))
        n = max(1, int(L / step))
        nrm = np.array([-(b - a)[1], (b - a)[0]]) / L
        for i in range(n):
            t = i / n + rng.uniform(-0.2, 0.2) / n
            c = a + (b - a) * t
            for _ in range(2 if band > 15 else 1):
                off = rng.normal(0, band / 2.4)
                core = 1 - min(1, abs(off) / band)
                s = srange[0] + (srange[1] - srange[0]) * core * rng.uniform(0.75, 1)
                pts.append(((c + nrm * off).tolist(), s))
    return pts


def mountain(x, y, s, snow=False, dry=False):
    ax = x + rng.uniform(-0.2, 0.2) * s
    ay = y - s * rng.uniform(1.0, 1.25)
    fill = '#d8be86' if dry else C['mtn']
    shadef = '#a88a55' if dry else C['mtn_dk']
    g = [f'<path d="M{x - s:.1f},{y:.1f} L{ax:.1f},{ay:.1f} L{x + s:.1f},{y:.1f} Z" fill="{fill}" stroke="{C["coast"]}" stroke-width="0.9" stroke-linejoin="round"/>',
         f'<path d="M{ax:.1f},{ay:.1f} L{x + s:.1f},{y:.1f} L{x + s * 0.15:.1f},{y:.1f} Q{ax + s * 0.15:.1f},{(ay + y) / 2:.1f} {ax:.1f},{ay:.1f} Z" fill="{shadef}" opacity="0.75"/>']
    for k in range(3):
        t = 0.3 + k * 0.2
        hx, hy = ax + (x + s - ax) * t, ay + (y - ay) * t
        g.append(f'<line x1="{hx:.1f}" y1="{hy:.1f}" x2="{hx - s * 0.25:.1f}" y2="{hy + s * 0.3:.1f}" stroke="{C["coast"]}" stroke-width="0.5" opacity="0.7"/>')
    if snow:
        sx1, sy1 = ax + (x - s - ax) * 0.32, ay + (y - ay) * 0.32
        sx2, sy2 = ax + (x + s - ax) * 0.32, ay + (y - ay) * 0.32
        g.append(f'<path d="M{ax:.1f},{ay:.1f} L{sx1:.1f},{sy1:.1f} L{(sx1 + ax) / 2 + 1:.1f},{sy1 - 1.5:.1f} L{ax:.1f},{sy1 + 1:.1f} '
                 f'L{(sx2 + ax) / 2:.1f},{sy2 - 1:.1f} L{sx2:.1f},{sy2:.1f} Z" fill="{C["snow"]}" stroke="{C["coast"]}" stroke-width="0.4"/>')
    return ''.join(g)


def hill(x, y, s):
    return (f'<path d="M{x - s:.1f},{y:.1f} Q{x:.1f},{y - s * 0.95:.1f} {x + s:.1f},{y:.1f}" fill="#e2cc98" stroke="{C["coast"]}" stroke-width="0.8"/>'
            f'<path d="M{x + s * 0.1:.1f},{y - s * 0.4:.1f} Q{x + s * 0.6:.1f},{y - s * 0.3:.1f} {x + s * 0.8:.1f},{y - 0.5:.1f}" fill="none" stroke="{C["mtn_dk"]}" stroke-width="0.6"/>')


def volcano(x, y, s):
    g = [f'<path d="M{x - s:.1f},{y:.1f} L{x - s * 0.28:.1f},{y - s * 1.05:.1f} L{x + s * 0.28:.1f},{y - s * 1.05:.1f} L{x + s:.1f},{y:.1f} Z" fill="#9c7a5a" stroke="{C["coast"]}" stroke-width="1"/>',
         f'<path d="M{x + s * 0.28:.1f},{y - s * 1.05:.1f} L{x + s:.1f},{y:.1f} L{x + s * 0.2:.1f},{y:.1f} Z" fill="#6e5039" opacity="0.8"/>',
         f'<ellipse cx="{x:.1f}" cy="{y - s * 1.05:.1f}" rx="{s * 0.28:.1f}" ry="{s * 0.1:.1f}" fill="{C["lava"]}"/>',
         f'<path d="M{x - s * 0.1:.1f},{y - s * 1.05:.1f} q-{s * 0.1:.1f},{s * 0.4:.1f} -{s * 0.25:.1f},{s * 0.6:.1f}" stroke="{C["lava"]}" stroke-width="1.4" fill="none"/>']
    for i, (dx, r) in enumerate([(0, 0.22), (0.15, 0.3), (0.4, 0.36)]):
        g.append(f'<circle cx="{x + s * dx:.1f}" cy="{y - s * (1.35 + i * 0.35):.1f}" r="{s * r:.1f}" fill="#8b8178" opacity="{0.55 - i * 0.12:.2f}"/>')
    return ''.join(g)


def gnod_dam():
    x, y = DAM
    add('<g class="pin t1" data-id="gnod-dam">')
    # spillway foam below the wall
    add(f'<path d="M{x - 6},{y + 5} q6,9 12,0" fill="#e9f3f1" opacity="0.85" filter="url(#steam)"/>')
    # curved stone wall with buttress blocks
    add(f'<path d="M{x - 16},{y - 1} Q{x},{y + 6} {x + 16},{y - 1}" fill="none" stroke="{C["coast"]}" stroke-width="5.6" stroke-linecap="round"/>')
    add(f'<path d="M{x - 16},{y - 1} Q{x},{y + 6} {x + 16},{y - 1}" fill="none" stroke="#b9a37a" stroke-width="3.6" stroke-linecap="round"/>')
    add(f'<path d="M{x - 16},{y - 1} Q{x},{y + 6} {x + 16},{y - 1}" fill="none" stroke="{C["coast"]}" stroke-width="3.6" stroke-dasharray="0.7 3.3" opacity="0.7"/>')
    # the spillway gear
    add(f'<path d="{gear_path(x, y + 2.5, 5.2, 8, 0.28)}" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="0.8"/>')
    add(f'<circle cx="{x}" cy="{y + 2.5}" r="1.6" fill="{C["coast"]}"/>')
    add('</g>')
    text(x + 20, y + 6, 'Gnod Dam', 11, weight='bold', anchor='start', ls=0.4)


def castle(x, y):
    st, sw = C['coast'], 0.7
    g = []
    g.append(f'<rect x="{x - 7}" y="{y - 7}" width="14" height="8" fill="#d6c7a4" stroke="{st}" stroke-width="{sw}"/>')
    for tx in (x - 10, x + 5):
        g.append(f'<rect x="{tx}" y="{y - 13}" width="5" height="14" fill="#cbb994" stroke="{st}" stroke-width="{sw}"/>')
        for k in range(3):
            g.append(f'<rect x="{tx + k * 2 - 0.3:.1f}" y="{y - 15}" width="1.4" height="2" fill="#cbb994" stroke="{st}" stroke-width="0.4"/>')
    for k in range(4):
        g.append(f'<rect x="{x - 5 + k * 3}" y="{y - 9}" width="1.6" height="2" fill="#d6c7a4" stroke="{st}" stroke-width="0.4"/>')
    g.append(f'<path d="M{x - 2},{y + 1} L{x - 2},{y - 3} Q{x},{y - 5.5} {x + 2},{y - 3} L{x + 2},{y + 1} Z" fill="{st}"/>')
    g.append(f'<line x1="{x + 7.5}" y1="{y - 15}" x2="{x + 7.5}" y2="{y - 21}" stroke="{st}" stroke-width="0.6"/>')
    g.append(f'<path d="M{x + 7.5},{y - 21} l5,1.5 l-5,1.5 Z" fill="#9b3b2e"/>')
    return ''.join(g)


def marker(name, typ, tier, x, y):
    if name == 'Cogbottom':
        teeth = ''.join(f'<rect x="{x - 1.6:.1f}" y="{y - 10:.1f}" width="3.2" height="4" fill="#8a6a2f" stroke="{C["coast"]}" stroke-width="0.6" transform="rotate({a} {x} {y})"/>' for a in range(0, 360, 45))
        return teeth + f'<circle cx="{x}" cy="{y}" r="7" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="1.2"/><circle cx="{x}" cy="{y}" r="2.6" fill="{C["land"]}" stroke="{C["coast"]}" stroke-width="0.8"/>'
    if typ == 'city':
        r = 5 if tier == 1 else 4
        return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fbf4dc" stroke="{C["coast"]}" stroke-width="1.3"/>'
                f'<circle cx="{x}" cy="{y}" r="{r - 2.6}" fill="{C["coast"]}"/>')
    if typ == 'settlement':
        return f'<circle cx="{x}" cy="{y}" r="3" fill="{C["coast"]}" stroke="#fbf4dc" stroke-width="0.8"/>'
    if typ == 'business':
        return f'<rect x="{x - 2.6}" y="{y - 2.6}" width="5.2" height="5.2" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="0.9"/>'
    if typ == 'expedition':
        return f'<path d="M{x},{y - 4} L{x + 3.6},{y} L{x},{y + 4} L{x - 3.6},{y} Z" fill="#9b3b2e" stroke="#fbf4dc" stroke-width="0.7"/>'
    if typ == 'poi':
        return star(x, y, 4.2, '#2f5d73')
    if typ == 'natural':
        if 'Volcano' in name or name in ("Anterpiller's Mound", 'Pixie Puddles'):
            return ''
        return f'<circle cx="{x}" cy="{y}" r="2.4" fill="none" stroke="#5a4a32" stroke-width="1"/>'
    return ''


def star(x, y, r, fill):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f'{x + rr * math.cos(a):.1f},{y + rr * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="#fbf4dc" stroke-width="0.6"/>'


def shade(hexc, f):
    h = hexc.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return '#%02x%02x%02x' % (int(r * f), int(g * f), int(b * f))


def region_of(parent, name):
    for reg in REGION_COLORS:
        if parent.startswith(reg):
            return reg
    return 'Gnomadica'


def gear_path(cx, cy, r, teeth=10, depth=0.22):
    pts = []
    for i in range(teeth * 4):
        a = 2 * math.pi * i / (teeth * 4)
        rr = r if (i % 4) in (0, 1) else r * (1 - depth)
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return 'M' + ' L'.join(pts) + ' Z'


def cartouche():
    x, y, w, h = 600, 34, 320, 112
    add('<g id="cartouche">')
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#f3e6c2" stroke="{C["coast"]}" stroke-width="2"/>')
    add(f'<rect x="{x + 6}" y="{y + 6}" width="{w - 12}" height="{h - 12}" rx="4" fill="none" stroke="#a07c3c" stroke-width="1"/>')
    for gx in (x, x + w):
        add(f'<path d="{gear_path(gx, y + h / 2, 22)}" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="1.2"/>')
        add(f'<circle cx="{gx}" cy="{y + h / 2}" r="7" fill="#f3e6c2" stroke="{C["coast"]}" stroke-width="1"/>')
    text(x + w / 2, y + 44, 'GNOMADICA', 30, weight='bold', anchor='middle', ls=8, halo=False)
    text(x + w / 2, y + 64, 'Gnome Island and the Nearby Isles', 12.5, fill=C['ink2'], anchor='middle', style='italic', halo=False)
    add(f'<line x1="{x + 70}" y1="{y + 74}" x2="{x + w - 70}" y2="{y + 74}" stroke="#a07c3c" stroke-width="0.8"/>')
    text(x + w / 2, y + 89, f'Master Map v{VERSION}  ·  working draft, awaiting canon review', 9.5, fill='#7a3b2a', anchor='middle', halo=False, ls=0.5)
    text(x + w / 2, y + 101, 'Charted for The Stoned Gnome · Gnomeworks', 8, fill=C['ink2'], anchor='middle', style='italic', halo=False)
    add('</g>')


def compass(cx, cy):
    add('<g id="compass">')
    add(f'<path d="{gear_path(cx, cy, 30, 14, 0.12)}" fill="#e8d6a6" stroke="{C["coast"]}" stroke-width="1"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="22" fill="#f3e6c2" stroke="{C["coast"]}" stroke-width="0.8"/>')
    for a, L, col in [(0, 34, '#7a3b2a'), (180, 22, C['coast']), (90, 22, C['coast']), (270, 22, C['coast']),
                      (45, 13, '#8a6a2f'), (135, 13, '#8a6a2f'), (225, 13, '#8a6a2f'), (315, 13, '#8a6a2f')]:
        add(f'<path d="M{cx},{cy - L} L{cx + 4},{cy} L{cx},{cy + 3} L{cx - 4},{cy} Z" fill="{col}" transform="rotate({a} {cx} {cy})"/>')
    add(f'<circle cx="{cx}" cy="{cy}" r="2.5" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="0.7"/>')
    text(cx, cy - 40, 'N', 13, fill='#7a3b2a', anchor='middle', weight='bold')
    text(cx, cy + 46, 'north proposed', 7.5, fill=C['ink2'], anchor='middle', style='italic')
    add('</g>')


def legend(x, y):
    w, h = 268, 186
    add('<g id="legend">')
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="#f3e6c2" stroke="{C["coast"]}" stroke-width="1.4" opacity="0.96"/>')
    text(x + w / 2, y + 18, 'KEY', 11, weight='bold', anchor='middle', ls=4, halo=False)
    rows = [
        (marker('Cogbottom', 'city', 1, 0, 0), 'Cogbottom (the factory)'),
        (marker('x', 'city', 1, 0, 0), 'City or port'),
        (marker('x', 'settlement', 2, 0, 0), 'Village or settlement'),
        (marker('x', 'business', 2, 0, 0), 'Shop or attraction'),
        (marker('x', 'expedition', 2, 0, 0), 'Dungeon, mine or ruin'),
        (star(0, 0, 4.2, '#2f5d73'), 'Roadside curiosity'),
        (marker('x', 'natural', 2, 0, 0), 'Natural landmark'),
    ]
    for i, (sym, lab) in enumerate(rows):
        yy = y + 36 + i * 15
        add(f'<g transform="translate({x + 20} {yy})">{sym}</g>')
        text(x + 34, yy + 3.5, lab, 9, anchor='start', halo=False)
    cx = x + 168
    lines = [
        (f'stroke="{C["road"]}" stroke-width="1.3" stroke-dasharray="5 2.5"', 'Road'),
        (f'stroke="{C["road"]}" stroke-width="0.9" stroke-dasharray="1.5 2.5"', 'Trail'),
        (f'stroke="{C["rail"]}" stroke-width="3.6" stroke-dasharray="0.9 3.6"', 'Rail'),
        (f'stroke="{C["ferry"]}" stroke-width="1.3" stroke-dasharray="0.1 4.5" stroke-linecap="round"', 'Ferry'),
        (f'stroke="{C["river"]}" stroke-width="2.4" stroke-linecap="round"', 'River'),
    ]
    for i, (st, lab) in enumerate(lines):
        yy = y + 36 + i * 15
        add(f'<line x1="{cx}" y1="{yy}" x2="{cx + 26}" y2="{yy}" {st}/>')
        if 'Rail' == lab:
            add(f'<line x1="{cx}" y1="{yy}" x2="{cx + 26}" y2="{yy}" stroke="{C["rail"]}" stroke-width="1"/>')
        text(cx + 32, yy + 3.5, lab, 9, anchor='start', halo=False)
    text(x + 12, y + h - 22, 'Region colors are soft washes.  No borders are drawn yet.', 7.6, fill=C['ink2'], style='italic', halo=False)
    text(x + 12, y + h - 10, 'No scale bar yet: the main island is hundreds of miles across.', 7.6, fill=C['ink2'], style='italic', halo=False)
    add('</g>')


def border():
    add(f'<rect x="6" y="6" width="{W - 12}" height="{H - 12}" fill="none" stroke="{C["coast"]}" stroke-width="3"/>')
    add(f'<rect x="13" y="13" width="{W - 26}" height="{H - 26}" fill="none" stroke="#a07c3c" stroke-width="1"/>')
    for i in range(0, W, 40):
        add(f'<rect x="{i + 13}" y="6" width="20" height="7" fill="{C["coast"]}" opacity="0.85"/>')
        add(f'<rect x="{i + 13}" y="{H - 13}" width="20" height="7" fill="{C["coast"]}" opacity="0.85"/>')
    for i in range(0, H, 40):
        add(f'<rect x="6" y="{i + 13}" width="7" height="20" fill="{C["coast"]}" opacity="0.85"/>')
        add(f'<rect x="{W - 13}" y="{i + 13}" width="7" height="20" fill="{C["coast"]}" opacity="0.85"/>')
    for cx, cy in [(10, 10), (W - 10, 10), (10, H - 10), (W - 10, H - 10)]:
        add(f'<path d="{gear_path(cx, cy, 14, 8, 0.25)}" fill="#c9a24a" stroke="{C["coast"]}" stroke-width="1"/>')
        add(f'<circle cx="{cx}" cy="{cy}" r="4" fill="{C["land"]}" stroke="{C["coast"]}" stroke-width="0.8"/>')

# ------------------------------------------------------------------ checks

WATER_OK = {'Dungeon of the Deep', 'Depths of the Undercover'}


def check(records):
    problems = []
    lake_poly = lake
    for r in records:
        if r['type'] == 'region':
            continue
        pt = (r['x'], r['y'])
        landed = any(inside(pt, poly) for poly in ALL_LAND)
        if not landed and r["name"] not in WATER_OK:
            problems.append(f"in the sea: {r['name']} {pt}")
        if inside(pt, lake_poly):
            problems.append(f"in the lake: {r['name']} {pt}")
    for uid, (x, y, reg) in UNNAMED_TOWNS.items():
        if not on_land((x, y)):
            problems.append(f'unnamed town in the sea: {uid} {(x, y)}')
    for name, a in ADDED_PLACES.items():
        if not on_land((a['x'], a['y'])):
            problems.append(f"added place in the sea: {name}")
    return problems


if __name__ == '__main__':
    recs = build()
    probs = check(recs)
    os.makedirs(OUT_DIR, exist_ok=True)
    svg_path = os.path.join(OUT_DIR, f'gnomadica-map-v{VERSION}.svg')
    open(svg_path, 'w', encoding='utf-8').write('\n'.join(out))
    data = dict(
        map='Gnomadica master map', version=VERSION, status='working draft, awaiting canon review',
        page=dict(width=W, height=H, units='svg', north='page top (proposed)'),
        notes='Coordinates are draft pins on the SVG page.  Clue text is copied from map-geography-audit-v0.1.md.',
        regions={k: dict(color=v, x=(PLACES[k][0] if k in PLACES else 1445), y=(PLACES[k][1] if k in PLACES else 940)) for k, v in REGION_COLORS.items()},
        islands=dict(M='Main island (Gnome Island)', A='Gnufoundland (proposed)', B='Shen Shin (named by Nathan 2026-11-03)',
                     C='Slaanilok (proposed)', D='Gnonmoon (named by Nathan 2026-11-03)', E='Island of Gni, its own region: Eversummer and Castle Gnaagh (Nathan 2026-11-03)'),
        locations=recs,
        added_places=[dict(id='gnod-dam', name='Gnod Dam', type='landmark', region='Slanic', x=DAM[0], y=DAM[1], tier=1,
                        clue='The great gnome dam at the south tip of Innie Lake.  The gnomes dammed a river valley here, '
                             'and the water climbed every creek to make the lake.  The Slanic river leaves from its spillway.',
                        mentions='Innie Lake; Slanic', status='proposed, not one of the 100 gazetteer entries')]
                  + [dict(id='innie-lake', name='Innie Lake', type='natural', region='Slanic', x=858, y=798, tier=1,
                          clue='The big reservoir behind Gnod Dam, filling a drowned river valley with long arms and small coves.',
                          mentions='Gnod Dam; Steam Stream; Slanic', status='named by Nathan')]
                  + [dict(id='zohee-bay', name='Zohee Bay', type='natural', region='Gnonmoon', x=236, y=940, tier=2,
                          clue='A deep bay cut into the northeast shore of Gnonmoon, with a town on its western shore.',
                          mentions='Gnonmoon', status='named by Nathan')]
                  + [dict(id=slug(n), name=n, type=a['type'], region=a['region'], x=a['x'], y=a['y'], tier=a['tier'],
                          clue=a['clue'], mentions=a['region'], status='placed by Nathan') for n, a in ADDED_PLACES.items()]
                  + [dict(id=uid, name=f'{reg} {uid.rsplit("-", 1)[1]} (name open)', type='city', region=reg, x=x, y=y, tier=2,
                          clue=f'An unnamed town on {reg}, kept as an option for later.', mentions=reg,
                          status='placed by Nathan, name open') for uid, (x, y, reg) in UNNAMED_TOWNS.items()],
    )
    json.dump(data, open(os.path.join(OUT_DIR, f'gnomadica-locations-v{VERSION}.json'), 'w', encoding='utf-8'),
              indent=1, ensure_ascii=False)
    tpl = open(os.path.join(HERE, 'viewer_template.html'), encoding='utf-8').read()
    svg_inline = '\n'.join(out).replace(f'width="{W}" height="{H}" font-family', 'id="map" font-family', 1)
    html = (tpl.replace('__VERSION__', VERSION).replace('__SVG__', svg_inline)
               .replace('__DATA__', json.dumps(data, ensure_ascii=False).replace('</', '<\\/')))
    open(os.path.join(OUT_DIR, f'gnomadica-map-v{VERSION}.html'), 'w', encoding='utf-8').write(html)
    print(svg_path, f'{os.path.getsize(svg_path) / 1024:.0f} KB', len(recs), 'locations')
    print('\n'.join(probs) if probs else 'all pins on land')
