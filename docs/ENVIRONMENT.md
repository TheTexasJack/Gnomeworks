# Development environment

## Where things live

| Thing | Where |
| --- | --- |
| Source code | GitHub repo `TheTexasJack/Gnomeworks`, branch `main` (the only branch) |
| Live game | GitHub Pages, deployed automatically from `main` at the repo root.  Changes go live 1 to 10 minutes after a push. |
| Art sources | Full-size approved masters in `art-masters/` (never loaded by the game).  Game copies are small WebP files in `assets/`, made with `tools/art.py`. |
| Planning docs | The proposal for Jarrett lives in a Claude doc outside the repo.  Everything needed to build lives in this `docs/` folder. |

The game is static files only.  There is no server, no database, no build step, and no package.json for the game itself.

## Running the game locally

Any of these work:

```
# Simplest: open the file directly in a browser
xdg-open index.html            # Linux
open index.html                # macOS

# Or serve the folder (closer to how GitHub Pages serves it)
python3 -m http.server 8000    # then visit http://localhost:8000/
```

Handy address flags:

| Flag | Effect |
| --- | --- |
| `?debug=1` | Testing bar: add 1K / 1M / 1B cogs, spawn a shiny, skip ahead an hour |
| `?hat=witch` | Preview a hat (classic, valentine, clover, easter, witch, santa) |

Ctrl+Shift+R forces a fresh copy after a push.  On Android Chrome, clear "Cached images and files" (the save survives).

## Tools used to build it

| Tool | Used for | Install |
| --- | --- | --- |
| Python 3 + Pillow + numpy + scipy | `tools/art.py`, the art pipeline | `pip install pillow numpy scipy` |
| Python 3 + numpy + OpenCV (`cv2`) | `tools/map/build_map.py`, the generated map | `pip install numpy opencv-python` |
| Node 18+ + Playwright (Chromium) | `tools/smoke-test.js`, headless testing and screenshots | `npm install playwright` then `npx playwright install chromium` |
| git | Everything else | |
| GIMP | Hand fixes to art (Nathan) | |

## Commands

```
# Check an image Mara sent (size, transparency)
python3 tools/art.py check incoming/picture.png

# Full art pipeline: see docs/ASSETS.md and docs/RECIPES.md
python3 tools/art.py --help

# Smoke test: desktop + phone, taps, buys, Shop Floor, shiny, save/reload
node tools/smoke-test.js
#   (in Claude's cloud session Playwright is installed globally:
#    NODE_PATH=$(npm root -g) node tools/smoke-test.js)

# Rebuild docs/INVENTORY.md after any item change
node tools/inventory.js

# Ship a change (after bumping GW.VERSION and adding a CHANGELOG line)
node tools/stamp.js          # version stamps on every CSS and JS link; the smoke test fails without it
git add -A
git commit -m "v0.2.0-draft.N: what changed"
git push origin main
```

## Claude's cloud session: quirks worth knowing

Claudia works in an isolated cloud Linux container attached to this repo through a GitHub connection Nathan approved.  Things learned the hard way:

- **Network is allowlisted.**  `git` to GitHub works (clone, fetch, push).  The npm registry and arbitrary websites were blocked from the shell in this session, and so was `thetexasjack.github.io` itself, so the container cannot load the live site.  Test against the local files instead.
- **Third-party code from GitHub works through git.**  Twemoji was fetched with a sparse clone: `git clone --depth 1 --filter=blob:none --sparse https://github.com/jdecked/twemoji` then `git sparse-checkout set assets/svg`.
- **The GitHub API through the session proxy is limited.**  Turning on Pages had to be done by Nathan in the repo settings, and pushing a git tag (`v0.1.0`) was refused.  Releases are tracked by commit messages and the changelog instead of tags.
- **Playwright and Chromium come preinstalled.**  Do not run `playwright install`.  Use `NODE_PATH=$(npm root -g)` when running scripts from the repo.
- **Headless Chromium has no ears.**  Sound code can be checked for errors and for signal level (by tapping an AnalyserNode), but loudness and feel need a human.
- **Commit attribution.**  Commits from Claude sessions end with a `Co-Authored-By: Claude` line and a session link, per the session's instructions.
- **Images Nathan attaches** arrive in `/mnt/user-data/uploads/`.  Process them from there into `assets/`; never commit the raw uploads.  Zips go to `/home/claude/incoming/<name>/` first.
- **Sounds** (mp3) get trimmed and leveled with ffmpeg: `ffmpeg -i in.mp3 -af "silenceremove=start_periods=1:start_threshold=-40dB,loudnorm=I=-16:TP=-1.5" -ac 1 -b:a 64k assets/sfx/name.mp3`, then added to `SAMPLE_FILES` in `js/sfx.js`.  Samples only load over http, so test with `python3 -m http.server`; opened from disk the game uses the code-made fallbacks.
- **The push warning** "This repository moved.  Please use the new location" is only GitHub noting the capital G in `Gnomeworks`.  Pushes succeed.
- **Commit straight to `main`** (Nathan's rule for all his repos, set November 2026).  No branches or pull requests.  For anything Nathan should see first, send screenshots or a short video (Playwright `recordVideo` plus ffmpeg) and push when he says push.
- **Don't chain `pkill` into a command list**; it can end the shell with exit 144 and skip what follows.

## Claude Code on Nathan's machine (Beast)

Added 2026-11-22.  Claude Code is the builder: it runs on Nathan's Linux Mint desktop ("Beast") and builds from approved work orders in [requests/](requests/README.md).  The cloud Claude ("Claudia") designs and reviews in chat.  The recipe for a new project's setup lives in CommandCenter: `docs/CLAUDE-CODE-SETUP.md`.

| Thing | Where |
| --- | --- |
| Fenced folder | `~/GW` (owner-only).  Claude Code is launched here and works only inside it. |
| The repo clone | `~/GW/Gnomeworks` |
| Rules it loads | `~/GW/CLAUDE.md` imports the repo's `CLAUDE.md` |
| Permissions | `~/GW/.claude/settings.json` (Blocks 5 to 7 of the setup recipe; confirmed by the first-run work order): ask-first by default, skip-all-permissions mode off, deny rules for sudo, recursive deletes, force pushes, hard resets, the GitHub login token, SSH keys, and its own settings |
| Launcher | "GW Claude Code" in the menu (`~/.local/bin/gw-claude-code`), outside the fence so Claude Code cannot edit it.  It refuses to run as root. |

Rules for Claude Code on Beast:

- **Start every job with `git pull`** in `~/GW/Gnomeworks`.  Claudia, Mara's uploads, and Nathan's web uploads push to this repo too.
- **Work only from an approved work order** (Status: Approved) in `docs/requests/`.  Fill in its Result section, set its status, commit, and push.
- **Commit straight to `main`.**  No branches or pull requests.
- **Never install, upgrade, or remove packages on your own.**  If a tool is missing, stop and report it in the work order's Result; Nathan decides how it gets installed.  No `sudo`, ever.
- **Use the local tools directly.**  `node tools/smoke-test.js` needs Playwright with Chromium installed locally (no `NODE_PATH` trick; that is only for the cloud session).  The map builder needs numpy and OpenCV.
- **Never use files in a `not-for-game/` folder.**  Those are unapproved or retired art kept for reference.
- **The push warning** about the repository having moved is only the capital G in `Gnomeworks`.  Pushes succeed.

## Repo layout

```
index.html            page structure
css/style.css         the oak and brass look, all layout and animation CSS
js/config.js          THE tuning file: every number, item, gnome, hat, and placement
js/util.js            number formatting, random helpers, DOM shortcuts
js/theme.js           Day / Night themes
js/sfx.js             sound effects: Web Audio synth plus a few recorded samples
js/state.js           save data: create, load, migrate, save
js/economy.js         all game math, no DOM
js/gears.js           the machine view: wall, meshing gears, hatch (SVG)
js/ui.js              shop, shelf, stats, crew strip, Shop Floor, effects
js/wild.js            Wild Magic event
js/clones.js          Clone Attack event
js/mega.js            the Megagnome
js/hunt.js            the crossbow hunt
js/main.js            input, game loop, shinies, pause, settings, wiring
assets/               all art (see docs/ASSETS.md)
art-masters/          full-size approved art masters, never loaded by the game (packing-line/, postcards/)
tools/                art.py (art pipeline), smoke-test.js, stamp.js, inventory.js, map/build_map.py
docs/                 these docs
CHANGELOG.md          every version, newest first
README.md             short public readme
.nojekyll             tells GitHub Pages to serve files as-is
```
