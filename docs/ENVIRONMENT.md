# Development environment

## Where things live

| Thing | Where |
| --- | --- |
| Source code | GitHub repo `TheTexasJack/Gnomeworks`, branch `main` (the only branch) |
| Live game | GitHub Pages, deployed automatically from `main` at the repo root.  Changes go live 1 to 10 minutes after a push. |
| Art sources | Nathan's machine and his Mara (ChatGPT) chats.  Only the processed WebP files are committed. |
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

# Ship a change (after bumping GW.VERSION and adding a CHANGELOG line)
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
- **Images Nathan attaches** arrive in `/mnt/user-data/uploads/`.  Process them from there into `assets/`; never commit the raw uploads.

## Repo layout

```
index.html            page structure
css/style.css         the oak and brass look, all layout and animation CSS
js/config.js          THE tuning file: every number, item, gnome, hat, and placement
js/util.js            number formatting, random helpers, DOM shortcuts
js/sfx.js             sound effects, synthesized with Web Audio
js/state.js           save data: create, load, migrate, save
js/economy.js         all game math, no DOM
js/gears.js           the machine view: wall, meshing gears, hatch (SVG)
js/ui.js              shop, shelf, stats, crew strip, Shop Floor, effects
js/main.js            input, game loop, shinies, pause, sound settings, wiring
assets/               all art (see docs/ASSETS.md)
tools/                art pipeline and smoke test
docs/                 these docs
CHANGELOG.md          every version, newest first
README.md             short public readme
.nojekyll             tells GitHub Pages to serve files as-is
```
