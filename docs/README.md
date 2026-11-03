# Gnomeworks project docs

Start here if you are picking this project up cold, whether you are a person or an AI assistant in a fresh session.  These docs describe the game as of **v0.2.0-draft.57** (2026-11-03).

| Doc | What it covers |
| --- | --- |
| [HANDOFF.md](HANDOFF.md) | **Read first in a new session.**  Where things stand, what's next, and how Nathan likes to work |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Where the code lives, the tools, the exact commands, and the quirks of the build environment |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the game is put together: files, the game loop, save data, the economy math, the views, sound |
| [ASSETS.md](ASSETS.md) | The art pipeline from Mara's images to the game, folder map, naming, and the placement numbers |
| [RECIPES.md](RECIPES.md) | Step-by-step: add an item, a monster, a gnome type, a hat, a sound; start a new season; ship a release |
| [EVENTS.md](EVENTS.md) | Shinies, Wild Magic, Clone Attack: how each works, config keys, art, sound, playtest notes |
| [DESIGNS.md](DESIGNS.md) | Features talked through but not built (Megagnome and the hunt, Packing Line, monster info card, Rogue), with what's decided and what's open |
| [INVENTORY.md](INVENTORY.md) | Every collectible, generated from the config by `node tools/inventory.js` |
| [TASKS.md](TASKS.md) | Current status, what is waiting on whom, known issues, and the backlog |
| [DECISIONS.md](DECISIONS.md) | Why things are the way they are, with dates |
| [lore/](lore/README.md) | The world: factory, TNP Corp, regions, Tiny Monsters, hunt creatures, junk groups |

## The project in one paragraph

Gnomeworks is a browser clicker game for The Stoned Gnome game store, meant to be embedded on the store's Wix site.  You tap a little gear, it turns a big gear, and every full turn drops an item out of a hatch.  Gnomes you buy keep the machine running, items fill a collection shelf, and rare "shinies" give Super Rare and Legendary collectibles.  It is plain HTML, CSS, and JavaScript with no build step, hosted free on GitHub Pages.

## People

| Who | Role |
| --- | --- |
| Nathan | Creator and developer.  Makes the calls on design and approves every layer before the next one starts. |
| Jarrett | Owner of The Stoned Gnome.  Final say on branding, music, accounts, the repo home, and which features ship. |
| Mara | Nathan's ChatGPT.  Makes the art through ChatGPT image generation (called CI2.5 in this project). |
| Claudia | Nathan's Claude.  Writes and tests the code, processes the art, and keeps these docs. |
| Testers | Nathan's sisters and Jarrett, playing the live build. |
| Alex Gore | Nathan's daughter.  Voices: the clone giggle and the hunt grunts (credited in Info as "Voices by Alex Gore"). |
| Jarrett's daughter | Age 6.  Asked for the Banana Monster; the Banana Monster Trophy is for her. |

## How we work

- Small steps.  Each layer (or each step inside a layer) is built, tested, shown with screenshots, and approved before the next starts.
- Every change bumps the visible version number in `js/config.js` and gets a line in `CHANGELOG.md`.  No exceptions.
- Ideas from Claudia are drafts until Nathan approves them.
- Formatting for anything written into the repo: two spaces after every period, no em dashes.

## Live links

- Game: https://thetexasjack.github.io/Gnomeworks/ (temporary home; see the repo move in TASKS.md)
- Repo: https://github.com/TheTexasJack/Gnomeworks
