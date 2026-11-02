#!/usr/bin/env python3
"""Gnomeworks art pipeline.

Turns the PNG sheets Nathan gets from Mara (ChatGPT image generation) into the
compressed WebP files the game loads.  Every command writes WebP only, and never
touches the source file.

Needs: Python 3, Pillow, numpy, scipy  (pip install pillow numpy scipy)

Commands
  sheet   Cut a sheet of separate pictures into one file each, in reading order.
  pair    Cut a static/action pair (left half / right half) with one shared crop,
          so the two frames line up for the squish-and-boing swap.
  fit     Crop one picture to its content, pad it square, resize, save.
  cutout  Remove a solid black or white background (when an image comes back
          without transparency), then save as PNG for the other commands.
  gear    Count a gear's teeth and find its tooth phase (for js/gears.js).
  check   Report size, mode, and transparency of any image.

Examples
  python3 tools/art.py check incoming/sheet.png
  python3 tools/art.py sheet incoming/badges.png --names icon_tiny icon_necro --out assets/icons --size 192
  python3 tools/art.py pair incoming/tiny.png --names tiny_static tiny_action --out assets/crew
  python3 tools/art.py cutout incoming/badges.png --color black --out incoming/badges_clear.png
  python3 tools/art.py gear incoming/gear_brass_05.png
"""
import argparse
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ALPHA_FLOOR = 30   # alpha below this is treated as empty (scrubs faint ghosts and watermarks)


def load(path):
    im = Image.open(path).convert('RGBA')
    a = np.array(im)
    a[a[:, :, 3] < ALPHA_FLOOR] = 0
    return a


def save_webp(img, path, quality=88):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    img.save(path, 'WEBP', quality=quality, method=6)
    print('wrote', path, img.size)


def shrink(img, maxdim):
    s = min(1.0, maxdim / max(img.size))
    if s >= 1:
        return img
    return img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)


def square_pad(img, pad_frac=0.06):
    bb = img.getchannel('A').point(lambda v: 255 if v > ALPHA_FLOOR else 0).getbbox()
    img = img.crop(bb)
    s = max(img.size)
    pad = int(s * pad_frac)
    canvas = Image.new('RGBA', (s + 2 * pad, s + 2 * pad), (0, 0, 0, 0))
    canvas.paste(img, ((canvas.width - img.width) // 2, (canvas.height - img.height) // 2))
    return canvas


def components(a, dilate=4, min_px=2000):
    """Connected blobs of non-empty pixels, largest first trimmed by min_px."""
    solid = a[:, :, 3] > 0
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=dilate))
    lab = lab * solid
    sizes = ndimage.sum(solid, lab, range(1, n + 1))
    objs = ndimage.find_objects(lab)
    keep = [(i + 1, objs[i], sizes[i]) for i in range(n) if objs[i] is not None and sizes[i] >= min_px]
    return lab, keep


def cmd_check(args):
    for p in args.files:
        im = Image.open(p)
        a = np.array(im.convert('RGBA'))[:, :, 3]
        print(f'{p}: {im.size[0]}x{im.size[1]} {im.mode}  alpha {a.min()}-{a.max()}  '
              f'transparent {round((a < 10).mean() * 100, 1)}%  corner {im.convert("RGBA").getpixel((3, 3))}')
        if a.min() == 255:
            print('  no transparency: run "cutout" first')


def cmd_sheet(args):
    a = load(args.file)
    lab, keep = components(a, args.dilate, args.min_px)
    row_h = args.row_height or a.shape[0] // 3
    keep.sort(key=lambda t: (t[1][0].start // row_h, t[1][1].start))  # rows top to bottom, then left to right
    print(f'found {len(keep)} pictures')
    names = args.names or [f'{args.prefix}{i + 1:02d}' for i in range(len(keep))]
    if len(names) != len(keep):
        print(f'warning: {len(names)} names for {len(keep)} pictures; extra pictures are skipped')
    for (idx, sl, _), name in zip(keep, names):
        out = a.copy()
        out[lab != idx, 3] = 0
        img = Image.fromarray(out).crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))
        img = square_pad(img, args.pad) if not args.keep_shape else img
        img = img.resize((args.size, args.size), Image.LANCZOS) if not args.keep_shape else shrink(img, args.size)
        save_webp(img, os.path.join(args.out, name + '.webp'))


def cmd_pair(args):
    a = load(args.file)
    H, W = a.shape[:2]
    solid = a[:, :, 3] > 0
    lab, n = ndimage.label(ndimage.binary_dilation(solid, iterations=2))
    lab = lab * solid
    cms = ndimage.center_of_mass(solid, lab, range(1, n + 1))
    halves = []
    for side in (0, 1):
        keep = np.zeros_like(solid)
        for i, (cy, cx) in enumerate(cms):
            if (cx >= W / 2) == bool(side):
                keep |= (lab == i + 1)
        out = a.copy()
        out[~keep, 3] = 0
        halves.append(out)

    def bbox(x):
        ys, xs = np.nonzero(x[:, :, 3])
        return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

    off = W // 2
    b0, b1 = bbox(halves[0]), bbox(halves[1])
    u = (min(b0[0], b1[0] - off), min(b0[1], b1[1]), max(b0[2], b1[2] - off), max(b0[3], b1[3]))
    for side, (h, name) in enumerate(zip(halves, args.names)):
        o = side * off
        x0, y0, x1, y1 = u[0] + o, u[1], u[2] + o, u[3]
        img = Image.fromarray(h)
        canvas = Image.new('RGBA', (x1 - x0, y1 - y0), (0, 0, 0, 0))
        canvas.paste(img.crop((max(0, x0), y0, min(W, x1), y1)), (max(0, x0) - x0, 0))
        save_webp(shrink(canvas, args.size), os.path.join(args.out, name + '.webp'), 86)
    print('shared crop (left-cell coordinates):', u)


def cmd_fit(args):
    img = Image.fromarray(load(args.file))
    img = square_pad(img, args.pad)
    save_webp(img.resize((args.size, args.size), Image.LANCZOS), args.out)


def cmd_cutout(args):
    im = Image.open(args.file).convert('RGBA')
    a = np.array(im)
    rgb = a[:, :, :3].astype(int)
    if args.color == 'black':
        val = rgb.max(axis=2)
        bgish = val < args.tolerance
    else:
        val = rgb.min(axis=2)
        bgish = val > 255 - args.tolerance
    lab, n = ndimage.label(bgish)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))   # only background touching the edge, so dark details inside survive
    alpha = np.where(bg, 0, 255).astype(float)
    edge = ndimage.binary_dilation(bg, iterations=2) & ~bg
    if args.color == 'black':
        alpha[edge] = np.clip((val[edge] - 10) / 50, 0, 1) * 255
    else:
        alpha[edge] = np.clip((245 - val[edge]) / 50, 0, 1) * 255
    a[:, :, 3] = alpha.astype('uint8')
    Image.fromarray(a).save(args.out)
    print('wrote', args.out)


def cmd_gear(args):
    a = load(args.file)[:, :, 3] > 40
    ys, xs = np.nonzero(a)
    cy, cx = (ys.min() + ys.max()) / 2, (xs.min() + xs.max()) / 2
    R = max(xs.max() - xs.min(), ys.max() - ys.min()) / 2
    th = np.linspace(0, 2 * math.pi, 2880, endpoint=False)
    best = None
    for fr in np.arange(0.86, 0.97, 0.02):
        r = R * fr
        s = np.array([a[int(cy + r * math.sin(t)), int(cx + r * math.cos(t))] for t in th]).astype(int)
        teeth = int((np.diff(np.concatenate([s, s[:1]])) == 1).sum())
        print(f'  radius {fr:.2f}R: {teeth} teeth')
        best = best or teeth
    n = args.teeth or best
    r = R * 0.9
    s = np.array([a[int(cy + r * math.sin(t)), int(cx + r * math.cos(t))] for t in th]).astype(float)
    c, si = (s * np.cos(n * th)).sum(), (s * np.sin(n * th)).sum()
    phase = math.degrees(math.atan2(si, c) / n) % (360 / n)
    print(f'center ({cx:.1f}, {cy:.1f})  outer radius {R:.0f}px  teeth {n}  phase {phase:.2f} deg')
    print('pitch radius is about 0.355 of the image width for Mara\'s gear style (see PITCH in js/gears.js)')


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest='cmd', required=True)

    c = sub.add_parser('check'); c.add_argument('files', nargs='+'); c.set_defaults(fn=cmd_check)

    s = sub.add_parser('sheet')
    s.add_argument('file'); s.add_argument('--out', required=True); s.add_argument('--names', nargs='*')
    s.add_argument('--prefix', default='item_'); s.add_argument('--size', type=int, default=256)
    s.add_argument('--pad', type=float, default=0.06); s.add_argument('--dilate', type=int, default=4)
    s.add_argument('--min-px', type=int, default=2000); s.add_argument('--row-height', type=int)
    s.add_argument('--keep-shape', action='store_true', help='keep the aspect ratio instead of padding square')
    s.set_defaults(fn=cmd_sheet)

    pr = sub.add_parser('pair')
    pr.add_argument('file'); pr.add_argument('--out', required=True)
    pr.add_argument('--names', nargs=2, required=True); pr.add_argument('--size', type=int, default=560)
    pr.set_defaults(fn=cmd_pair)

    f = sub.add_parser('fit')
    f.add_argument('file'); f.add_argument('--out', required=True)
    f.add_argument('--size', type=int, default=256); f.add_argument('--pad', type=float, default=0.06)
    f.set_defaults(fn=cmd_fit)

    k = sub.add_parser('cutout')
    k.add_argument('file'); k.add_argument('--out', required=True)
    k.add_argument('--color', choices=['black', 'white'], default='black'); k.add_argument('--tolerance', type=int, default=22)
    k.set_defaults(fn=cmd_cutout)

    g = sub.add_parser('gear'); g.add_argument('file'); g.add_argument('--teeth', type=int); g.set_defaults(fn=cmd_gear)

    args = p.parse_args()
    args.fn(args)


if __name__ == '__main__':
    sys.exit(main())
