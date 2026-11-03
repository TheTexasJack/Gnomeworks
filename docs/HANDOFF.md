# Handoff

For a fresh session picking up Gnomeworks.  Written 2026-11-03 at **v0.2.0-draft.59**.  Read this, then [TASKS.md](TASKS.md), then whatever doc the work needs.

## Where things stand

- **Live:** https://thetexasjack.github.io/Gnomeworks/ (repo `TheTexasJack/Gnomeworks`, branch `main`).  Everything is pushed; no open branches.
- **The game:** 6 gnome types (Tiny, Necromancer, Warrior, Cloner, Matryoshka, Wizard) plus the Megagnome, 148 collectibles, Day and Night themes, desktop and phone layouts.
- **Events built:** shinies, Wild Magic, Clone Attack, the Megagnome and his crossbow hunt (with the Banana Monster boss).  How each works: [EVENTS.md](EVENTS.md).
- **Real play data:** Nathan reached 20B cogs and 8.75M clicks a second in about two days of light play, with every gnome count between 50 and 92.  The 15% price climb keeps counts low on its own.

## Next session: the Packing Line

Nathan's sorting mini-game.  Everything agreed so far is in [DESIGNS.md](DESIGNS.md#packing-line).  The short version:

- The player drags one item tile from the shelf into a box; one drag ships a big batch.
- Reshaped 2026-11-03: shipping **drains** the shelf (that's the point; an empty shelf sends players back to the clicker).  Every item stops at 1.  Open and Close buttons on a shipping door.
- Shipping pays its **own currency** called **Stonks**, never cogs.  Stamps are a separate shipping mechanic (right stamp for the right region).  Box upgrades are speed upgrades.
- Later layers, all drafts: Stonks shop and a Packing Gnome, orders, the TNP Corp (The North Pole Corp) rival with Papers Please style fake trucks and elf spies, a stock ticker scoreboard of our company vs TNP, and The Daily Cog newspaper.  Full list in DESIGNS.md.
- **Next math step:** Stonks prices and Stonks-shop costs.  Agree the numbers with Nathan, then build the core (layer 1).
- Waiting on Nathan and Mara for the company name, lore, and region maps (they feed shipping labels).

Expect side requests from Jarrett and his 6-year-old daughter too (she asked for the Banana Monster).  Handle them as small steps between Packing Line steps.

## Waiting on others

- **Nathan:** the hat lip fix in GIMP, **before December 1** (keep canvas sizes).
- **Jarrett:** repo home and address (moving resets every save, so before launch), music, accounts and leaderboard, logo, license.

## How Nathan likes to work

- **Small steps, approval at each.**  Build, show screenshots or a short video, wait for "push."  Use a branch for anything he should see first; small straight fixes can go straight to `main`.  He's said he doesn't need downloadable test builds: a mockup screenshot is enough.
- **Every change:** bump `GW.VERSION` in `js/config.js`, `node tools/stamp.js`, a `CHANGELOG.md` entry, `node tools/smoke-test.js` (with `NODE_PATH=$(npm root -g)` in the cloud session), commit, push.  Keep the docs current as you go.
- **Ideas are drafts** until he approves them.  He wants honest pushback and his words followed exactly.  Don't ask him follow-up questions at the end of replies.
- **Repo writing:** two spaces after periods, no em dashes, no "not X, it's Y" phrasing.
- **Mara** is his ChatGPT and makes the art.  He often fixes art himself in GIMP.  **Alex Gore** (his daughter) records voices.
- **Standing game rules:** no gambling mechanics unless Jarrett (the owner) directly asks for one, real taps only for anything rare, kid-friendly (cartoon splats are fine for this D&D crowd), phone first, every number in `js/config.js`.
- He plays on Linux Mint; Jarrett plays on desktop; testers use phones (one Android has reduced motion on).

## Things that bit us (so they don't again)

- Late-game lag came from rolling item drops once per gnome type per frame.  Roll once per tick.  Re-run the speed check after adding producers.
- An event that needs N hits must not spawn when fewer than N bolts or chances remain.
- Overlays inside the machine box can sit behind the Shop Floor; full-screen pop-ups go on `document.body`.
- New script files plus cached old ones can crash the page; that's what version stamps prevent.  Never skip `tools/stamp.js`.
- Numbers are capped at 1e300 (`maxNumber`).  Don't raise it.

## Map of the docs

| Doc | For |
| --- | --- |
| [README.md](README.md) | Index and people |
| [ENVIRONMENT.md](ENVIRONMENT.md) | Commands, tools, cloud-session quirks |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Files, game loop, save data, math |
| [EVENTS.md](EVENTS.md) | Every built event |
| [DESIGNS.md](DESIGNS.md) | Agreed but unbuilt features |
| [ASSETS.md](ASSETS.md) | Art and sound files and the pipeline |
| [RECIPES.md](RECIPES.md) | Step-by-step how-tos |
| [INVENTORY.md](INVENTORY.md) | Every collectible (generated) |
| [TASKS.md](TASKS.md) | Status, backlog, known issues |
| [DECISIONS.md](DECISIONS.md) | Why things are the way they are |
