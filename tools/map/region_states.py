#!/usr/bin/env python3
"""Region map states for the Packing Line (v0.4, Claudia, 2026-11-23: dark gray, from the stylized v18 map; close-ups all one shape).

Renders the master map with only the unlocked regions in color.  Locked
regions turn gray and lose their place names, so nothing is spoiled.  Also
crops a close-up of one region for the unlock card.

The game never loads the SVG (it lags on phones).  This script makes small
WebP pictures from it instead.

Usage:
    python3 tools/map/region_states.py --unlocked 2 --focus Gnohio --out DIR

Needs: Python 3, Pillow, numpy, and rsvg-convert on the PATH.
"""
import argparse
import json
import os
import re
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
# The stylized Brasswood v18 map (approved sign, stamp terrain, no KEY footnotes).
# Its sign is a PNG beside it, so renders run from that folder.
SVG = os.path.join(ROOT, 'docs/art-style/proofs/gnomadica-v029-approved-sign-v18.svg')
LOCS = os.path.join(ROOT, 'docs/lore/map/gnomadica-locations-v0.29.json')
W, H = 1660, 1150

# The unlock order: a counterclockwise spiral (DESIGNS.md).
ORDER = ['Gnomerica', 'Gnohio', 'Gnafrica', 'Slanic', 'Gno Dao Cradle',
         'Gni', 'Slaanilok', 'Shen Shin', 'Gnufoundland', 'Gnonmoon']

# Region washes, copied from tools/map/build_map.py (x, y, radius).
BLOBS = {
    'Gnomerica': [(740, 600, 120), (720, 420, 100), (1060, 690, 80), (1220, 650, 60), (960, 640, 70)],
    'Gnohio': [(430, 560, 140), (520, 410, 80), (520, 760, 70), (330, 700, 60)],
    'Gnafrica': [(450, 990, 120), (340, 1040, 60)],
    'Slanic': [(800, 990, 120), (640, 920, 70), (990, 990, 55)],
    'Gno Dao Cradle': [(1040, 420, 90), (1170, 300, 95), (1260, 150, 60), (1170, 510, 55)],
    'Gnufoundland': [(300, 160, 170), (470, 80, 80)],
    'Slaanilok': [(1465, 600, 120)],
    'Gni': [(1445, 930, 105)],
    'Shen Shin': [(1505, 205, 115)],
    'Gnonmoon': [(175, 950, 105), (168, 840, 50)],
}
# Bare region-name labels in the SVG that carry no data-id.
BARE_LABELS = {'Gnomerica': 'GNOMERICA', 'Gnohio': 'GNOHIO', 'Gnafrica': 'GNAFRICA',
               'Slanic': 'SLANIC', 'Gno Dao Cradle': 'the Cradle', 'Gnufoundland': 'GNUFOUNDLAND',
               'Slaanilok': 'SLAANILOK', 'Gnonmoon': 'GNONMOON', 'Shen Shin': 'SHEN SHIN',
               'Gni': 'ISLAND OF GNI'}
SHADE = np.array([58, 56, 54], dtype=np.float32)  # dark gray for locked land (Nathan, v0.2)


def rsvg(svg_text, width, path):
    with tempfile.NamedTemporaryFile('w', suffix='.svg', delete=False, dir=os.path.dirname(SVG)) as f:
        f.write(svg_text)
    subprocess.run(['rsvg-convert', '-w', str(width), '-o', path, f.name], check=True)
    os.unlink(f.name)


def strip_locked_names(svg, locked):
    """Drop every pin and label that belongs to a locked region."""
    data = json.load(open(LOCS))
    region_of = {l['id']: l['region'] for l in data['locations'] + data['added_places']}
    pin = re.compile(r'<g class="pin[^"]*" data-id="([^"]+)">.*?</g>\n?', re.S)
    svg = pin.sub(lambda m: '' if region_of.get(m.group(1)) in locked else m.group(0), svg)
    if 'Slanic' in locked:  # the dam's label sits outside the pins
        svg = re.sub(r'<text[^>]*>Gnod Dam</text>\n?', '', svg)
    for reg in locked:
        if reg in BARE_LABELS:
            svg = re.sub(r'<text[^>]*>' + re.escape(BARE_LABELS[reg]) + r'</text>\n?', '', svg)
    return svg


def land_mask(svg, width):
    """White land on black, from the master's own coastline paths."""
    defs = re.search(r'<path id="land0".*?</defs>', svg, re.S)
    paths = re.findall(r'<path id="land\d+"[^>]*/>', svg) or [defs.group(0).split('</defs>')[0]]
    ids = re.findall(r'<path id="(land\d+)"', svg)
    body = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {W} {H}" width="{W}" height="{H}"><defs>{"".join(paths)}</defs>'
            f'<rect width="{W}" height="{H}" fill="black"/>'
            + ''.join(f'<use href="#{i}" fill="white"/>' for i in ids) + '</svg>')
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'land.png')
        rsvg(body, width, p)
        return np.asarray(Image.open(p).convert('L'), dtype=np.float32) / 255


def region_cells(width, height):
    """Which region each pixel belongs to: nearest wash blob, scaled by its size."""
    s = width / W
    ys, xs = np.mgrid[0:height, 0:width].astype(np.float32) / s
    best = np.full((height, width), np.inf, dtype=np.float32)
    cell = np.zeros((height, width), dtype=np.int16)
    for i, reg in enumerate(ORDER):
        for x, y, r in BLOBS[reg]:
            d = np.hypot(xs - x, ys - y) / r
            closer = d < best
            best[closer] = d[closer]
            cell[closer] = i
    return cell


def soft(mask, radius):
    img = Image.fromarray((mask * 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32) / 255


def gray(rgb, amount):
    lum = (rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32))[..., None]
    g = lum * 0.42 + SHADE * 0.58
    return rgb * (1 - amount[..., None]) + g * amount[..., None]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--unlocked', type=int, default=2, help='how many regions are open, 1 to 10')
    ap.add_argument('--focus', default='Gnohio', help='region for the close-up')
    ap.add_argument('--width', type=int, default=2048)
    ap.add_argument('--close', type=int, default=1024)
    ap.add_argument('--out', required=True)
    ap.add_argument('--svg', help='map source (default: the stylized v18 map)')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    unlocked = ORDER[:a.unlocked]
    locked = ORDER[a.unlocked:]
    global SVG
    if a.svg:
        SVG = os.path.abspath(a.svg)
    svg = open(SVG).read()
    svg_named = strip_locked_names(svg, set(locked))

    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'map.png')
        rsvg(svg_named, a.width, p)
        rgb = np.asarray(Image.open(p).convert('RGB'), dtype=np.float32)
    h, w = rgb.shape[:2]
    land = land_mask(svg, w)[:h, :w]
    cell = region_cells(w, h)
    blur = 6 * w / W

    lock = np.isin(cell, [ORDER.index(r) for r in locked]).astype(np.float32)
    lock = soft(lock, blur) * land
    state = gray(rgb, lock * 0.85)
    tag = f'state-{a.unlocked:02d}'
    Image.fromarray(state.clip(0, 255).astype(np.uint8)).save(
        os.path.join(a.out, f'map-{tag}.webp'), quality=82, method=6)

    # Close-up: the focus region lit, its open neighbors dimmed a little.
    others = (cell != ORDER.index(a.focus)).astype(np.float32)
    dim = soft(others, blur) * land
    close = gray(rgb, np.maximum(lock * 0.85, dim * 0.4))
    s = w / W
    xs = [x for x, y, r in BLOBS[a.focus] for x in (x - r, x + r)]
    ys = [y for x, y, r in BLOBS[a.focus] for y in (y - r, y + r)]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    half_w = max((max(xs) - min(xs)) / 2, (max(ys) - min(ys)) / 2 * 4 / 3) * 1.15
    half_h = half_w * 3 / 4
    box = [int(v * s) for v in (cx - half_w, cy - half_h, cx + half_w, cy + half_h)]
    # Slide the box back inside the map (keeps every close-up the same shape).
    dx = -box[0] if box[0] < 0 else min(0, w - box[2])
    dy = -box[1] if box[1] < 0 else min(0, h - box[3])
    box = [box[0] + dx, box[1] + dy, box[2] + dx, box[3] + dy]
    crop = Image.fromarray(close.clip(0, 255).astype(np.uint8)).crop(box)
    crop = crop.resize((a.close, a.close * 3 // 4), Image.LANCZOS)
    crop.save(os.path.join(a.out, f'closeup-{a.focus.lower().replace(" ", "-")}.webp'), quality=85, method=6)
    print('open:', ', '.join(unlocked))
    print('wrote', a.out)


if __name__ == '__main__':
    main()
