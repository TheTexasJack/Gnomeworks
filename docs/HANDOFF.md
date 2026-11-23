# Handoff

For a fresh session picking up Gnomeworks.  Rewritten 2026-11-22; game version **v0.2.0-draft.81**.  Read this, then [TASKS.md](TASKS.md), then whatever doc the work needs.

## Where things stand

- **Live:** https://thetexasjack.github.io/Gnomeworks/ (repo `TheTexasJack/Gnomeworks`, branch `main`).  Everything is pushed; no open branches.
- **The game:** 6 gnome types (Tiny, Necromancer, Warrior, Cloner, Matryoshka, Wizard) plus the Megagnome, 148 collectibles, Day and Night themes, desktop, phone, and landscape phone layouts.
- **Events built:** shinies, Wild Magic, Clone Attack, the Megagnome and his crossbow hunt (with the Banana Monster boss).  How each works: [EVENTS.md](EVENTS.md).
- **Real play data:** Nathan reached 20B cogs and 8.75M clicks a second in about two days of light play, with every gnome count between 50 and 92.  The 15% price climb keeps counts low on its own.  Playtesters reach the Megagnome in about 5 to 7 hours (2026-11-08, a measurement, not a target).

## Now: the Packing Line, ready to build

Nathan's shipping mini-game.  The design is in [DESIGNS.md](DESIGNS.md#packing-line); the art status is in [art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md](art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md).

- **Art: all 45 packages closed (2026-11-22),** approved, covered by existing art, or dropped by Nathan.  Masters are in `art-masters/packing-line/` and `art-masters/postcards/`.  **Approved art is cleared for integration through work orders (Nathan, 2026-11-22).**  Never use a `not-for-game/` folder.
- **Logos and paperwork drawn by Claudia as vector (SVG):** the GRIP mark (23), the TNP logo (27), and the APPROVED and DENIED stamps (32).  The work order (06), supply list (05d), shipping log (36), and The Daily Cog (35) are Nathan's blank parchment with code-drawn text on top.
- **Covered by the painted rooms:** the order board (the lower parchment frame), the STONKS ticker screen (code draws inside it), the conveyor (a button that opens the item menu; not animated), and the Report Card and Log clipboards.
- **Layer 1 rules are approved (2026-11-22):** correct supplies (every box gets peanuts, Soft has no rule, one tag per item, the tag table), Gnomerica orders ask for 1 item because it is the first tier, one drag ships the whole pile down to the display copy, score by region difficulty, tap a slip to read it full size, recoverable ticker.
- **Work orders and drivers are separate calls (Nathan, 2026-11-22):** each work order is stamped APPROVED or DENIED; any driver is sent away by closing the door with the chain.  Details and the two open points are in DESIGNS.md under "Work orders and drivers."  Fakes start after the first few shifts, so none of this blocks layer 1.
- **The wall map** is the approved small icon, and the full map is the generated v0.29 map.  Mara's Brasswood re-style (v18) is parked as optional polish ([art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md](art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md)).

## Wednesday demo target (Nathan, 2026-11-23)

Jarrett will see the Packing Line at the Dagorhir Thanksgiving on Wednesday 2026-11-25, so the basic loop must be playable on the live site with `?ship=1` by then.  The demo cut (Claudia's draft, approved by Nathan 2026-11-23):

1. **1b (done):** the room, the door and chain, the truck backed into the room, the grumpy driver.
2. **1c-2 (done, draft.79):** three work orders on the board, tap to read.
3. **1c-3 (done, draft.80):** the factory rests while the player is in the Shipping view.  No shinies, events, or pop-ups in the room.
4. **1d (done, draft.81):** tap the conveyor for the item menu, drag the ordered item into a cardboard box, close it, stamp it.  The phone screen holds still in the room.
5. **1e:** close the door to hand off, the driver reacts, the truck leaves, the report card, and the GRIP line on the STONKS screen.

**Truck and driver placement is approved on desktop and phone (Nathan, 2026-11-22, tested again 2026-11-23).**  Each new region's truck and driver gets its own placement pass when it is built: later drivers are slightly taller and each truck has small differences.  **The box has the stage:** packing pieces may cover the driver.

After Thanksgiving: the supplies rules (peanuts, bubble wrap, FRAGILE and HEAVY), the other three box types, APPROVED and DENIED, and the garage-door roll.

## How the work flows now

- **Claudia (cloud Claude, in chat)** designs and reviews with Nathan and writes work orders in [requests/](requests/README.md).
- **Claude Code on Nathan's machine ("Beast")** builds from approved work orders and fills in each order's Result.  Setup and rules: [ENVIRONMENT.md](ENVIRONMENT.md#claude-code-on-nathans-machine-beast) and `CLAUDE.md` at the root.
- **Mara** (Nathan's ChatGPT) made most of the art.  Her quality dropped around 2026-11-19, so new art leans on Nathan's GIMP work and Claudia's vector drawing.  ChatGPT chats die without warning when image-heavy.

**Next, in order:**

1. ~~Finish Claude Code's setup on Beast.~~  Done 2026-11-22: Claude Code runs as its own `gwcode` user behind Linux walls Nathan tested himself, with root-owned permission rules.  See [ENVIRONMENT.md](ENVIRONMENT.md#claude-code-on-nathans-machine-beast).
2. ~~Run the first-run work order.~~  Done 2026-11-22 ([requests/2026-11-16-first-run-check.md](requests/2026-11-16-first-run-check.md)).
3. Packing Line layer 1, one work order per step (1a to 1g, listed in [requests/2026-11-22-packing-line-1a-room-and-door.md](requests/2026-11-22-packing-line-1a-room-and-door.md)).  **1a and 1b are built (draft.70, draft.71):** the Shipping view, the room, the door chain, and Gnomerica's truck and driver arriving and leaving (the driver waits grumpy since draft.74), hidden from players behind `?ship=1` (`CONFIG.shipping.enabled` is false).  **1c-1 is built (draft.75):** `js/destinations.js`, the places that buy from the factory, generated by `node tools/destinations.js`.  **1b.5 (draft.76)** closed the gap between the door frame and the parked truck; **1b.6 (draft.77)** backs the truck into the room on desktop and moves the chain beside the roller, and puts the phone back to draft.75; **1b.7 (draft.78)** does the same for the phone, from Nathan's phone mock.  **1c-2 (draft.79)** pins up to three Gnomerica work orders on the order board when the driver arrives; a tap opens one full size.  **1c-3 (draft.80)** rests the factory in the Shipping view and pays the time on leaving through the offline catch-up.  **1d (draft.81)** packs and stamps each order and keeps the record for the hand-off.  Next: 1e, the hand-off and report card.
4. Later and optional: fold Mara's approved map stamps into `tools/map/build_map.py`.

Our parcel company is **GRIP** (Gnuma Gnuma Regional Independent Parcels).  The rival is **TNP Corp** (The North Pole Corp).  Lore, the map (v0.29, gazetteer v0.27), trade, and region stamps are done; see lore/regions.md.

Expect side requests from Jarrett and his 6-year-old daughter too (she asked for the Banana Monster).  Handle them as small steps between Packing Line steps.

## Waiting on others

- **Nathan:** the hat lip fix in GIMP, **before December 1** (keep canvas sizes).
- **Jarrett:** repo home and address (moving resets every save, so before launch), music, accounts and leaderboard, logo, license.

## How Nathan likes to work

- **Small steps, approval at each.**  Build, show screenshots or a short video, wait for "push."  Commit straight to `main` (no branches or pull requests).  He's said he doesn't need downloadable test builds: a mockup screenshot is enough.
- **Every change:** bump `GW.VERSION` in `js/config.js`, `node tools/stamp.js`, a `CHANGELOG.md` entry, `node tools/smoke-test.js` (add `NODE_PATH=$(npm root -g)` only in the cloud session), commit, push.  Keep the docs current as you go.
- **Ideas are drafts** until he approves them.  He wants honest pushback and his words followed exactly.  Don't ask him follow-up questions at the end of replies.
- **Repo writing:** two spaces after periods, no em dashes, no "not X, it's Y" phrasing.
- **Mara** is his ChatGPT and made most of the art.  He often fixes art himself in GIMP, and Claudia draws logos and simple shapes as vector art.  **Alex Gore** (his daughter) records voices.
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
