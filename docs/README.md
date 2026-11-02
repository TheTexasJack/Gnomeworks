# Gnomeworks project docs

Start here if you are picking this project up cold, whether you are a person or an AI assistant in a fresh session.  These docs describe the game as of **v0.2.0-draft.19** (2026-11-02).

| Doc | What it covers |
| --- | --- |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Where the code lives, the tools, the exact commands, and the quirks of the build environment |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the game is put together: files, the game loop, save data, the economy math, the views, sound |
| [ASSETS.md](ASSETS.md) | The art pipeline from Mara's images to the game, folder map, naming, and the placement numbers |
| [RECIPES.md](RECIPES.md) | Step-by-step: add an item, a monster, a gnome type, a hat, a sound; start a new season; ship a release |
| [TASKS.md](TASKS.md) | Current status, what is waiting on whom, known issues, and the backlog |
| [DECISIONS.md](DECISIONS.md) | Why things are the way they are, with dates |

## The project in one paragraph

Gnomeworks is a browser clicker game for The Stoned Gnome game store, meant to be embedded on the store's Wix site.  You tap a little gear, it turns a big gear, and every full turn drops an item out of a hatch.  Gnomes you buy keep the machine running, items fill a collection shelf, and rare "shinies" give Super Rare and Legendary collectibles.  It is plain HTML, CSS, and JavaScript with no build step, hosted free on GitHub Pages.

## People

| Who | Role |
| --- | --- |
| Nathan | Creator and developer.  Makes the calls on design and approves every layer before the next one starts. |
| Jarrett | Owner of The Stoned Gnome.  Final say on branding, music, accounts, the repo home, and which features ship. |
| Mara | Nathan's ChatGPT.  Makes the art through ChatGPT image generation (called CI2.5 in this project). |
| Claudia | Nathan's Claude.  Writes and tests the code, processes the art, and keeps these docs. |
| Testers | Nathan's sisters, playing the live build on phones. |

## How we work

- Small steps.  Each layer (or each step inside a layer) is built, tested, shown with screenshots, and approved before the next starts.
- Every change bumps the visible version number in `js/config.js` and gets a line in `CHANGELOG.md`.  No exceptions.
- Ideas from Claudia are drafts until Nathan approves them.
- Formatting for anything written into the repo: two spaces after every period, no em dashes.

## Live links

- Game: https://thetexasjack.github.io/Gnomeworks/ (temporary home; see the repo move in TASKS.md)
- Repo: https://github.com/TheTexasJack/Gnomeworks
