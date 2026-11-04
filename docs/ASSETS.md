# Art and assets

All art except the junk emoji comes from Mara (Nathan's ChatGPT image generation).  Raw PNGs stay on Nathan's side; the repo holds compressed WebP made by `tools/art.py`.

**Visual house style:** [Gnomeworks Brasswood Cartoon Art-Style Bible](ART-STYLE-BIBLE.md) and [frozen reference gallery](art-style/REFERENCE-GALLERY.md).  Those references are the style authority for new art.  This file remains the implementation pipeline and final-size reference.

## Folder map

| Folder | Contents | Size in game files | Made with |
| --- | --- | --- | --- |
| `assets/bg/` | `machine_wall` (1000x1000), `floor` (1600x900), `floor_tall` (900x1599), `boards_day` (page background, mirror-tiled 2x2 so it has no seams; `_h` turned sideways for the gnome strip), `planks` (old page background, unused), `planks_h` (planks turned sideways, gnome strip), `banner_scenic` (1920x220, desktop header: factory, sky, blimp; the base for holiday versions), `banner_wide` (1920x220, spare: gnomes and conveyor), `banner_phone` (1200x400, phone header), `wall` (old plain wall, unused) | as listed | resize only |
| `assets/gears/` | `gear_brass_01` to `08`, 512x512 | 512 | resize only |
| `assets/crew/` | Station art: `<type>_static` / `<type>_action` pairs, `matry_closed/open/set3/set5`, `dummy_static/action`, `slash`, `weapon_*`, `help_wanted`, `wizard_static/action`, `fx_swirl`, `fx_swirl_cogs`, `fx_swirl_debris` (swirls for the Wizard and Wild Magic) | max 560 | `art.py pair`, `art.py sheet --keep-shape` |
| `assets/icons/` | Gear-framed badges: `icon_tiny`, `icon_necro`, `icon_warrior`, `icon_cloner`, `icon_matryoshka`, `icon_wizard` | 192 | `art.py cutout` then `art.py sheet` |
| `assets/hats/` | `hat_classic`, `hat_valentine`, `hat_clover`, `hat_easter`, `hat_witch`, `hat_santa` | max 256 | `art.py fit` style crop |
| `assets/monsters/` | 43 Tiny Monsters: `<family>_<variant>` (normal, glowing, goopy, evil) | 256 | `art.py sheet` |
| `assets/clones/` | Clone Attack: `clone_<kind>_run`, `_grab`, `_held` for 10 kinds (normal, cyclops, goblin, twohead, slime, mushroom, crystal, cyborg, ghost, wolf), `vat_full`, `vat_sploosh`, `clone_warning` (Machine-view sign) | ~320 tall | cut with one shared scale per sheet so poses match |
| `assets/sfx/` | `sploosh.mp3` (Clone Attack splash; "Splash 2" by freesound_community on Pixabay, Pixabay Content License; trimmed to 1.4 s, mono 64 kbps), `hehe.mp3` (clone giggle), `ugh_*.mp3` (hunt voices; `ugh_disgust` is a spare), all recorded for the game by Alex; `yum.mp3`, `burp.mp3` (Megagnome, from Nathan) | 12 KB / 8 KB | `ffmpeg -af atrim,afade -ac 1 -b:a 64k` |
| `assets/treasures/` | `diamond_pick.webp`, `magic_sword.webp` (256), `purple_underpants.png` (pixel art, 16x15 grid at 16x; drawn with image-rendering: pixelated) | 256x240 | rebuilt from Nathan's GIMP shot by sampling each pixel cell |
| Night theme | `*_night` twins: `bg/machine_wall_night`, `bg/floor_night`, `bg/floor_tall_night`, `bg/banner_scenic_night`, `bg/boards_night` (+`_h`), `ui/title_night`, `ui/sign_blank_night`, `ui/clipboard_night` (same 844x1080 slices as the day clipboard), `ui/*_tilt*_night` tools, `crew/help_wanted_night`.  Swapped by `js/theme.js` and `.night` CSS.  Plus `bg/banner_phone_night` (1200x400). | as day twins | resize to the day twin's exact size so overlays line up |
| `assets/mega/` | Megagnome `mega_idle/eat/burp` (496x520, same canvas), `crossbow` (600x418; string drawn in code from the bow tips), `bolt`, `prey_<kind>` x8 and `prey_banana` (boss), `hunt_day`, `hunt_night`, `splat_red/blue/green/purple/yellow/white` (kill bursts; the boss gets white) | as listed | `cutout` (black backgrounds), `sheet --keep-shape` |
| `assets/plops/` | Number Twos: `plop_normal/steam/prize/golden` | 256 | `art.py sheet` |
| `assets/ui/` | `title` (lettered sign), `sign_blank` (pause screen), `clipboard` (844x1080, right panel; border-image slices 281 / 70 / 218, middle = 15 grid squares), `tsquare`, `triangle` and their `_tilt` versions (peek out behind the shop clipboard), `triangle_tilt_l` and `tsquare_tilt_r` (the shelf clipboard's pair) | 1200 wide | crop + resize |
| `assets/emoji/` | Twemoji SVGs for junk items, named by codepoint (`1f9e6.svg` = socks) | vector | copied from Twemoji |

Twemoji graphics are by jdecked/twemoji, licensed CC-BY 4.0.  The credit line is in the game's Info tab and must stay there.

## Processing Mara's images

```
python3 tools/art.py check incoming/new.png        # always first
```

| Situation | Command |
| --- | --- |
| No transparency (solid black or white background) | `art.py cutout in.png --color black --out clear.png`, then continue with `clear.png` |
| A sheet of separate pictures (badges, monsters, weapons) | `art.py sheet in.png --out assets/<folder> --names a b c ... --size 256` (pictures are taken top row first, left to right; pass `--row-height` if rows are uneven) |
| A static/action pair (left half and right half) | `art.py pair in.png --names x_static x_action --out assets/crew` |
| One picture | `art.py fit in.png --out assets/<folder>/<name>.webp --size 256` |
| A new gear | `art.py gear in.png` prints tooth count and phase for `js/gears.js` |

The `pair` command crops both frames with one shared box, so the character stays in the same spot when the game swaps frames.  If the generator drew the character in a different spot in each frame (the Necromancer), fix it with `actionDx` in the station config instead of re-cutting.

## Placement numbers (all in `js/config.js`)

| What | Config key | Meaning |
| --- | --- | --- |
| Gear axles and sizes | `TRAIN` and positions in `js/gears.js` | Measured from the mounts painted on `machine_wall` |
| Hatch opening | `HATCH` in `js/gears.js` | Measured from the painted hatch |
| Station slots | `floor.layouts.wide.slots` / `.tall.slots` | `[x %, feet line %]` per station, bottom row first |
| Station parts | `floor.stations.<gnome>.parts` | Image, height (% of floor height), upgrade swaps, count stages, overlap, `actionDx` |
| Weapons | `floor.weapons` | Grip point, fist position in each frame, angle in each frame, length per weapon |
| Hats | `hats.spots.<image name>` | `[center x %, brim y %, width %]` on that picture |

These were placed by eye from screenshots.  When art changes, re-check them with `node tools/smoke-test.js` and the screenshots in `tools/out/`.

## Lessons learned about AI art (pass these to Mara)

- **Proofread every letter** of any text in an image.  The GNOMEWORKS sign came out right; plenty do not.
- **Check transparency on a dark background.**  Some outputs fake transparency with a painted checkerboard, and some come back on solid black.
- **Give sheets real gaps.**  Pictures that touch (a fox's lightning bolt, a bat wing) merge into one blob for the slicer.  A clear grid with space between cells slices perfectly.
- **Generate animation frames together**, side by side in one image, feet on the same line, facing the same way.  Frames made separately never match.
- **Faint ghost watermarks** sometimes appear in corners.  `art.py` drops anything under alpha 30, which removes them.
- **Hats need a "worn" view.**  Hats drawn from below show the inside of the brim and look like they float.  The current hats need that lip removed in GIMP (open task).
- **Painted lighting rotates with the gear.**  Highlights baked into a gear image spin with it.  Nobody notices at speed.
- **Style drift is real.**  The two mice (Goopamice, Hexamice) came out sketchier than the rest of the monster set.  Ask for the same style prompt every time.

## Rights

- Art: generated for Nathan and The Stoned Gnome through Nathan's ChatGPT account.
- Junk item art: Twemoji, CC-BY 4.0, credited in the game.
- Music (planned): Nathan's Steammetal Studios tracks made on Suno's Pro plan, which carries commercial rights for songs made while subscribed.  Songs made on Suno's free plan are personal use only and must not ship.
- Sound effects: synthesized in code, no outside rights involved.
