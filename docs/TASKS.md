# Tasks and status

Last updated 2026-11-23, at v0.2.0-draft.84.

## Where we are

| Layer | Version | Status |
| --- | --- | --- |
| Core game: gears, items, shop, saves | v0.1 | Done |
| Art and juice: Mara's art, Shop Floor, animation, sound, hats, collections, Night theme, first events | v0.2 | Mostly done (draft.62), polish items below |
| Accounts and leaderboard | v0.3 | Waiting on Jarrett's yes or no |
| Admin tools and stats | v0.4 | Planned |
| Security pass and Jarrett's guide | v0.5 | Planned |
| Live on the Wix site | v1.0 | Planned |

Game content right now: 6 gnome types (Tiny, Necromancer with skeleton crew, Warrior, Cloner, Matryoshka, Wizard), 6 empty stations, 148 collectibles (96 junk items in 8 groups of 12, 44 Tiny Monsters, 4 Number Twos, 4 Legendary Treasures), 6 hats, 2 events (Wild Magic, Clone Attack) plus shinies, the Megagnome and the hunt that feeds him, Day and Night themes.  Details: [EVENTS.md](EVENTS.md).  Unbuilt designs: [DESIGNS.md](DESIGNS.md).

## Waiting on Jarrett

Nathan sent him the proposal ("Gnomeworks: Producers and Mini-Games Proposal v0.2") on 2026-11-02.

- [ ] Repo home: a branded GitHub Organization or account, and possibly a custom domain.  **Do this before launch**, since moving resets every save.
- [ ] Background music: off, shuffle, by view, by season, or by event, and which Steammetal Studios tracks.
- [ ] Accounts and leaderboard: yes or no, and Discord or email sign-in.
- [ ] Which mini-games and new gnome types to build.
- [ ] Shop logo, after his rebrand.
- [ ] License: an explicit "all rights reserved" LICENSE file, and who owns the art.

## Nathan

- [ ] After 1d.1: review the item menu's new frame (05a) on the phone and check it for seams where the stretched sides meet the corners (Nathan, 2026-11-23).

- [ ] Remove the inside-of-brim lip from the six hats in GIMP (keep the canvas size), then send them over.  **Before December 1** (the Santa hat shows the lip most).
- [ ] Optional: on the Android phone, Settings, Accessibility, "Remove animations" is likely on.  Turning it off brings back the full bounce.

## Claudia (ready to build when asked)

- [ ] Drop in the fixed hats and re-check every hat spot.
- [x] Gear-framed shop badge for the Gnome Wizard (draft.62).
- [ ] Packing Line: lore, layer 1 mechanics, and art are done (2026-11-22).  The build runs through work orders on Claude Code.  See "Packing Line next steps" below.
- [ ] Mid-to-late pacing pass.  Nathan's report (draft.68, 12.35 hours open): the Wizard makes 97% of production, items paid 28% of all cogs, shelf holds 7 to 12 billion of each junk item.
- [ ] **Future step, before launch:** clean old item IDs out of saves.  Nathan's save still holds `shirt`, `chips`, `tcg_card`, `tiny_monster`, and `poop` from early versions.  They don't show or count anywhere, so it's harmless until then.  Do it as a save-schema bump in `js/state.js` (drop any item ID not in `CONFIG.items` on load), and run it before or with the repo move, since that resets saves anyway.
- [ ] Themed buttons, when button art exists.
- [ ] Once Jarrett picks: repo move, music system, then the chosen proposal items.

## Packing Line next steps (updated 2026-11-22)

1. ~~**Lore pass**~~ done 2026-11-15 (company is GRIP, trade merged, stamps decided).
2. **Mechanics:**
    - [x] How much of a pile one package ships: the whole pile, down to the display copy (approved 2026-11-22).
    - [x] What a failed shipment does: only the ticker lines move (Stonks is score only, 2026-11-15).
    - [x] What Stonks buy: nothing.  Stonks is the marker against TNP Corp, and stamps, boxes, and supplies are free (Nathan, 2026-11-15).
    - [x] Trade draft merged into gazetteer v0.25: every junk item has a buyer, and every trading place buys Bathroom items (2026-11-15).
    - [x] How a purchase order is read and filled: the order board, the randomizer, Gnomerica's 1-item orders, the correct supplies rule and item tags (approved 2026-11-22).  See DESIGNS.md.
    - [x] The "new thing to watch for" each region adds: the complications table in DESIGNS.md.
    - [x] Work orders and drivers: APPROVED or DENIED stamps on orders; the door chain sends any driver away (Nathan, 2026-11-22).
    - [x] Stamp scoring and what follows a sent-away driver: reopen the door for a random driver, no more than 2 TNP drivers in a row (Nathan, 2026-11-22).
    - [ ] **Future upgrade (Nathan, 2026-11-22):** the shipping door opens and closes smoothly, rolling up like a garage door, in place of the instant swap built in 1a.
    - [x] ~~Replace the leaning poses with new standing art.~~  Settled without new art (Nathan, 2026-11-22): drivers always arrive grumpy, so the grumpy pose (arms crossed, standing) is the waiting pose.  See DESIGNS.md, "The driver's moods."
    - [ ] Before the Shipping view goes live: the view buttons wrap on a 390px phone, and the chain needs Space and Enter (1a review).
    - [ ] Shipping log event logic, and throw-ins.
    - [ ] Region to producer pairings (only Moonsmith from Gnonmoon is set).
    - [ ] Rune tracing that works with a finger on phones.
3. ~~**Assets**~~ done 2026-11-22: all 45 packages closed in [art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md](art-style/PACKING-LINE-PRODUCTION-CHECKLIST.md), cleared for integration.
4. **Build:** layer 1 core, one work order per step (1a to 1g).
    - [x] 1a: the Shipping view, the room art, and the door chain (draft.70, hidden behind `?ship=1`).
    - [x] 1b: Gnomerica's truck backs into the doorway, the driver walks in and waits; closing sends them away (draft.71, hidden).
    - [x] 1b.1: truck rests on the doorway floor line, both twice as big on phones, the driver leans on the truck or the bench (`shipping.driverSpot`, Nathan to pick) (draft.72).
    - [x] 1b.2: the driver waits beside the bench with his elbow on it (Nathan's pick), and phone sizes match the wide room's proportions (draft.73).
    - [x] 1b.3 stopped at placement (no room at full size); 1b.4: the driver waits grumpy at full size, in the doorway in front of his truck on desktop and in front of the bench's right end on phones, by the depth rule (draft.74).
    - [ ] Later option (Nathan, 2026-11-22): replace the leaning poses with standing poses, which ends the leaning problem.
    - [x] 1b.5: no gap beside the truck: the doorway outline's left edge sits on the frame's inner edge, and the truck's rear left corner tucks just behind it (draft.76).
    - [x] 1b.6: on desktop the truck backs into the room (Nathan's mock 1), with only the header and right jamb in front; the chain hangs right of the door from behind the roller's gear cap.  Phone back to draft.75 (draft.77).
    - [x] 1b.7: the phone matches Nathan's phone mock: the truck backs into the room, the chain hangs right of the door from behind the roller's gear cap, and the driver stands in front of the bench's right end (draft.78).
    - [x] 1c-1: the destinations data, `js/destinations.js` generated from the map's locations file by `tools/destinations.js` (draft.75, nothing on screen).
    - [ ] Lore gap: no Gnonmoon place has Factory Imports, so Gnonmoon has no destinations yet (found by 1c-1).
    - [x] 1c-2: three Gnomerica work orders on the order board, tap to read full size; on phones the board ends left of the parked truck (draft.79).
    - [x] 1d.1 (draft.82): the box label shows only the item's picture, a closed box shows none, the stamp lands bold and on top, and the item menu sits on the supply drawer frame (05a) (Nathan's test of draft.81).
    - [x] 1d.2 (draft.83): the region stamp sits small and straight in the box's upper right corner, the same gap from the top and the right (box face v0.3).
    - [ ] **Future, with the supplies rules (Nathan, 2026-11-23):** replace the stamp tray with one supplies menu (stamps, idols, sprays, stickers, and the rest) on the supply drawer frame (05a), which the item menu has used since 1d.1.  See DESIGNS.md, "One supplies menu for every tool."
    - [ ] Later layer: the shipping label on every box, in the middle (Nathan, 2026-11-23; DESIGNS.md, "The box face").
    - [ ] **Future enhancement (Nathan, 2026-11-23):** a box contents screen (tap a box to see everything in it), for when later regions ask for 2 or 3 items per order.  Layer 1 boxes hold one item.  With it, boxes take whatever the player adds: extras still complete the order with a small deduction, and a missing ordered item is still wrong (Nathan, 2026-11-23; DESIGNS.md, "What goes in a box").
    - [ ] **Future enhancement (Nathan, 2026-11-23):** leaving the Shipping view mid-trip (tapping "The Machine" or "Shop Floor") shows a warning first: leaving ends the day and sends off the current truck as is.  Today leaving just resets the room.  Confirming counts as a hand-off, so 1e's scoring applies (unfinished orders score "Not packed") (agreed, Nathan, 2026-11-23).
    - [ ] **Future enhancement (Nathan, 2026-11-23):** hold the trip's state (the truck, driver, orders, and packed boxes) until the player ends the day, for experience and consistency.  **Order (Nathan, 2026-11-23):** the warning comes first and states what leaving does today; holding the state is the later change, and the warning retires with it.
    - [ ] **Future enhancement (Nathan, 2026-11-23):** on the phone, fill the empty right end of the order board (right of the three slips, from about 62%) with a small filler pinned to the board, made knowing the parked truck covers part of it.  The slips stay their current size.
    - [ ] **Open (Claudia's 1c-2 review, 2026-11-23):** about 77% of the items Gnomerica places can ask for are Bathroom items, since every place buys all 12 of them on top of its few Factory Imports, and the randomizer picks evenly from the combined list.  So most orders ask for Bathroom junk.  Nathan to decide after the demo whether to weight orders toward Factory Imports.
    - [x] 1c-3 (draft.80; approved v0.2, option A): the factory rests while the player is in the Shipping view, credited on leaving through the existing catch-up.  Future producers stay out of the room too (Nathan, 2026-11-23).
    - [x] Phone screen lock in the Shipping view: no scroll, bounce, zoom, or view swipe (Nathan, 2026-11-23).  Built in 1d (draft.81), step 5a.
    - [x] 1d (draft.81; approved v0.3): pack and stamp.
    - [x] 1e (draft.84; approved v0.2): hand-off, report card, GRIP line, and the chain's "Pull to ship!" cue.  The last piece of the Wednesday demo cut (HANDOFF.md).  Draft calls for Nathan and Claudia to check are in the work order's Result (score amounts, the unstamped-box rule, the tag's spot over the driver).
    - [ ] Each new region's truck and driver gets its own placement pass on desktop and phone (Nathan, 2026-11-23).
    - [ ] After the demo: 1f and 1g (drawer and supplies, the other boxes, Stonks polish).

## Done draft.20 to draft.51

Interface: oak-and-brass buttons, pause and sound moved beside the tabs, plank then clipboard panels (shop and, on desktop, the shelf), Mara's and Nathan's banners (desktop and phone), wider desktop layout with side rails for the next-item gauge and crew, seamless page boards, TAP label fades after a minute, brighter shelf labels, monster names shrink to fit.  Content: Gnome Wizard and five Wizard upgrades, 16 more junk items (12 per group), Control Knobs, basic slime (Jellybub), pixel Lucky Purple Underpants, painted Diamond Pickaxe and Magical Sword, new Warrior description.  Events: Wild Magic, Clone Attack.  Themes: Night.  Tools: `docs/INVENTORY.md` generator.  Full list in `CHANGELOG.md`.

## Done draft.52 to draft.57

Late-game lag fix (one item roll per tick) and the next-item ticker, a 1e300 safety ceiling, the Megagnome (shop checklist, events-only helper, food), the crossbow hunt with splats and Alex's voices, the Banana Monster boss and its trophy, version stamps on CSS and JS, hunt instructions, crossbow tilt fix, boss-needs-3-bolts fix.  (Megagnome hats tried and removed.)

## Done draft.58 to draft.62

Megagnome hatless, then his belly jiggle.  **The Megagnome is complete** (Nathan, 2026-11-04); the floor-tap and keyboard hunt ideas are closed.  Also: hunt prey split fix (Shroomturtle, elk, Crystal Lizard), per-prey size, the Gnome Wizard's badge.

## Proposal backlog (all drafts, nothing approved yet)

Producers for the 6 empty stations (the Wizard took the Golem Pilot's 1.6M slot): Golem Pilot, Boiler Stoker (20M), Gnome Bard (260M), Shroom Farmer (3.6B), Airship Captain (51B), Clockwork Chrononaut (750B), Moonsmith (11T).

Future producers unlock with regions (see the Packing Line in DESIGNS.md).  Moonsmith comes from Gnonmoon, the last region.  Other pairings are open, not every region brings a producer, prices are balanced separately from the unlock order, and this producer list may change to fit the structure, make a better mini-game, or meet a request from Jarrett or Elana.

Mini-games: Packing Line (Nathan's sorting game, first in line), Gear Jam, Pest Patrol, Alchemy Cauldron, Bard Jam, Expeditions.

Nathan's own future add (2026-11-08): **Bortho, the Clockwork Gnome**, a producer with a cog match repair mini-game.  Queued after the Packing Line.  See [DESIGNS.md](DESIGNS.md#bortho-the-clockwork-gnome-future).

Jarrett's request (2026-11-08): **Gnome Engineer**, replacing the Boiler Stoker, with a valve-turning mini-game (turn valves until the heat dissipates).  Comes after Bortho, since a missed boiler sets off Bortho's breakdown.  See [DESIGNS.md](DESIGNS.md#gnome-engineer-future-jarretts-request).

Parked (2026-11-04): a later pass on the Tiny Monsters to make each one unique instead of four forms of the same family.  Unique designs could become plushies Jarrett sells at the shop.  Do it together with the Tiny Monster info card pass (quick Pokedex-style card that links into the full Gnomopedia entry), so the cleanup, the unique designs, and the cards land at once.  After lore cleanup and the Packing Line core.  Monsters get assigned to regions during the lore cleanup so they can appear on that region's stamp.

Nathan's notes on the backlog (2026-11-03), all still Jarrett's call:

- Many proposal items will likely be dropped or changed.
- The Alchemy Cauldron overlaps the Clone game that already exists, so it is likely dropped or folded in.  (2026-11-15: Nathan's Number Twos chemistry game with the Cloner would cover it.  See DESIGNS.md, What ships.)
- Nathan will push for the Golem Pilot and Expeditions later (send-a-crew-out missions, as in FF14 ventures and STO duty officers).
- Current focus: the lore, the region maps, and the Packing Line outline, since shipping closes the game loop.

The Packing Line, the Tiny Monster info card, and the Rogue are written up in [DESIGNS.md](DESIGNS.md).

Answered 2026-11-03: shipped items leave the shelf, down to 1.

## Known issues and accepted quirks

| Issue | Status |
| --- | --- |
| Hats show the inside of the brim | Fix in progress (GIMP), due before December 1.  Hat spots won't need retuning if the canvas size stays the same. |
| Shop Floor gnomes stood still on devices set to reduce motion (Nathan's Android) | Fixed in draft.20: gentle pose swaps |
| Tall phone floor has an empty bottom level with no plates | Accepted; Mara could add a 4th plate row for 16 stations |
| Matryoshka sets (10 and 25 owned) only wiggle, no open/close | Accepted, Nathan likes it |
| Highlights painted on gears rotate with them | Accepted |
| Skeletons and matryoshka wear no hats | Accepted for now |
| Goopamice and Hexamice are drawn in a sketchier style | Accepted |
| "Glimmander" is 10 letters (target 9) | Accepted |
| The `v0.1.0` git tag never made it to GitHub | Accepted; history lives in commit messages and the changelog |
| Gnome Wizard clicks were missing from Stats | Fixed in draft.51 |
| Two of Nathan's three day board images are unused spares | Accepted, kept for later |
| Numbers past 1e300 | Capped (draft.53).  If players ever reach it, the answer is a big-number library or a prestige reset, not raising the cap. |
| Phones held sideways had a tiny machine and a nearly empty clipboard | Fixed in draft.69: landscape phone layout |
| Sounds are fairly quiet on desktop speakers | Watch it; raise `fxBus` gain in `sfx.js` if testers agree |
