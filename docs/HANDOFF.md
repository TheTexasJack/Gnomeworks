# Handoff

For a fresh session picking up Gnomeworks.  Written 2026-11-03, version updated 2026-11-15 to **v0.2.0-draft.69**.  Read this, then [TASKS.md](TASKS.md), then whatever doc the work needs.

## Where things stand

- **Live:** https://thetexasjack.github.io/Gnomeworks/ (repo `TheTexasJack/Gnomeworks`, branch `main`).  Everything is pushed; no open branches.
- **The game:** 6 gnome types (Tiny, Necromancer, Warrior, Cloner, Matryoshka, Wizard) plus the Megagnome, 148 collectibles, Day and Night themes, desktop, phone, and landscape phone layouts.
- **Events built:** shinies, Wild Magic, Clone Attack, the Megagnome and his crossbow hunt (with the Banana Monster boss).  How each works: [EVENTS.md](EVENTS.md).
- **Real play data:** Nathan reached 20B cogs and 8.75M clicks a second in about two days of light play, with every gnome count between 50 and 92.  The 15% price climb keeps counts low on its own.  Playtesters reach the Megagnome in about 5 to 7 hours (2026-11-08, a measurement, not a target).

## Next session: the Packing Line

Nathan's sorting mini-game.  Everything agreed so far is in [DESIGNS.md](DESIGNS.md#packing-line).  The short version:

- The player drags one item tile from the shelf into a box; one drag ships a big batch.
- Reshaped 2026-11-03: shipping **drains** the shelf (that's the point; an empty shelf sends players back to the clicker).  Every item stops at 1.  Open and Close buttons on a shipping door.
- Shipping earns **Stonks**, never cogs.  Stonks is a score only, the marker against TNP Corp; nothing in shipping costs anything (Nathan, 2026-11-15).  Stamps are a free shipping mechanic (right stamp for the right region).  Boxes and supplies are free, box-size upgrades are dropped, and the packing itself is the game: a match game inspired by Simon Says.  Complete the order to succeed; extra items do nothing, except on Gnonmoon.
- Later layers, all drafts: orders, the TNP Corp (The North Pole Corp) rival with Papers Please style fake trucks and elf spies, a stock ticker scoreboard of GRIP vs TNP, and The Daily Cog newspaper.  Full list in DESIGNS.md.
- **Shift flow decided (2026-11-15):** chain or button, door opens, a region's truck and driver arrive with 3 work orders, fakes can be dismissed, fill all three, report card.  See DESIGNS.md.
- **Mara's asset list:** [art-style/PACKING-LINE-ASSETS-v0.3.md](art-style/PACKING-LINE-ASSETS-v0.3.md), three tiers, handed to Mara 2026-11-15 (her checklist will land on GitHub).
- **Next (as of 2026-11-15 night):** Nathan's verdict on Mara's v18 map sign ([art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md](art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md)); fold Mara's approved map stamps into `tools/map/build_map.py` so the generated map carries her art; the rest of the Packing Line assets; then the build of layer 1.  Only junk ships (decided); every junk item has a buyer.  Approved Packing Line masters are in `art-masters/`.
- **Heavy coding can move to Claude Code on Nathan's machine.**  Repo rules for it are in `CLAUDE.md` at the root.
- Our parcel company is **GRIP** (Gnuma Gnuma Regional Independent Parcels).  Lore, the map, trade, and region stamps are done (2026-11-15); see lore/regions.md.

Expect side requests from Jarrett and his 6-year-old daughter too (she asked for the Banana Monster).  Handle them as small steps between Packing Line steps.

## Session of 2026-11-15 (for the next session)

- **Lore:** Alex's region write-ups merged; every region has a kid Preview, an explorer's Guide, and Notable Flora and Fauna.  The main island is **Gnuma Gnuma**.  Gazetteer v0.27, map v0.29 (the generated one).
- **Packing Line design:** shift flow, order board, label/stamp reading challenge, no clock, closing early leaves ❌, correct-supplies rule (Breakable, Soft, Heavy), four box types, only junk ships, stamps (color + symbol), company **GRIP**.  All in DESIGNS.md.
- **Art:** Mara's checklist ([art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md](art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md)) had 8 of 45 packages approved.  Nathan's approved masters are in `art-masters/packing-line/` (rooms with doors, chain, map icon, supply drawer, desk props, boxes, stamps, shrub, red herring).  The room layout follows Nathan's sketch (`art-style/references/packing-room-sketch-v2.jpg`); supplies sit in a drawer that ducks away while dragging; the conveyor opens the item menu.
- **Map art:** Mara's v18 map proof is committed and waiting on Nathan's sign verdict.  Read [art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md](art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md).  Her proofs are hand-edited copies of the generated map, so they drift whenever the gazetteer changes.  Plan: fold her approved stamps (mountains, crystals, hills, trees, dunes, sign) into `tools/map/build_map.py`.
- **Code:** draft.69 added the landscape phone layout.
- **New workflow (set up 2026-11-16):** heavy coding moves to Claude Code on Nathan's machine.  Chat designs and reviews; Claude Code builds from work orders in [requests/](requests/README.md).  Rules for it are in `CLAUDE.md` at the root.
- **ChatGPT chats die without warning** when image-heavy.  Mara works one package per chat, and Nathan saves every approved image to `art-masters/` right away.

**Tomorrow, in order:**

1. Set up Claude Code: clone, check `CLAUDE.md`, try a first small work order.
2. Nathan's verdict on the v18 map sign.
3. Work order: fold Mara's map stamps into the map builder.
4. The rest of the Packing Line assets with Mara (Tier 1 first).
5. Work order: Packing Line layer 1 (one Gnomerica truck, three orders, packing, stamps, report card, GRIP line on the ticker).

## Waiting on others

- **Nathan:** the hat lip fix in GIMP, **before December 1** (keep canvas sizes).
- **Jarrett:** repo home and address (moving resets every save, so before launch), music, accounts and leaderboard, logo, license.

## How Nathan likes to work

- **Small steps, approval at each.**  Build, show screenshots or a short video, wait for "push."  Commit straight to `main` (no branches).  He's said he doesn't need downloadable test builds: a mockup screenshot is enough.
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
| [lore/](lore/README.md) | The world, and the planned Gnomopedia |
