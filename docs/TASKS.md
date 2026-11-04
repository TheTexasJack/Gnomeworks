# Tasks and status

Last updated 2026-11-03, at v0.2.0-draft.57.

## Where we are

| Layer | Version | Status |
| --- | --- | --- |
| Core game: gears, items, shop, saves | v0.1 | Done |
| Art and juice: Mara's art, Shop Floor, animation, sound, hats, collections, Night theme, first events | v0.2 | Mostly done (draft.57), polish items below |
| Accounts and leaderboard | v0.3 | Waiting on Jarrett's yes or no |
| Admin tools and stats | v0.4 | Planned |
| Security pass and Jarrett's guide | v0.5 | Planned |
| Live on the Wix site | v1.0 | Planned |

Game content right now: 6 gnome types (Tiny, Necromancer with skeleton crew, Warrior, Cloner, Matryoshka, Wizard), 6 empty stations, 148 collectibles (96 junk items in 8 groups of 12, 44 Tiny Monsters, 4 Number Twos, 4 Legendary Treasures), 6 hats, 2 events (Wild Magic, Clone Attack) plus shinies, the Megagnome and his hunt, Day and Night themes.  Details: [EVENTS.md](EVENTS.md).  Unbuilt designs: [DESIGNS.md](DESIGNS.md).

## Waiting on Jarrett

Nathan sent him the proposal ("Gnomeworks: Producers and Mini-Games Proposal v0.2") on 2026-11-02.

- [ ] Repo home: a branded GitHub Organization or account, and possibly a custom domain.  **Do this before launch**, since moving resets every save.
- [ ] Background music: off, shuffle, by view, by season, or by event, and which Steammetal Studios tracks.
- [ ] Accounts and leaderboard: yes or no, and Discord or email sign-in.
- [ ] Which mini-games and new gnome types to build.
- [ ] Shop logo, after his rebrand.
- [ ] License: an explicit "all rights reserved" LICENSE file, and who owns the art.

## Nathan

- [ ] Remove the inside-of-brim lip from the six hats in GIMP (keep the canvas size), then send them over.  **Before December 1** (the Santa hat shows the lip most).
- [ ] Optional: on the Android phone, Settings, Accessibility, "Remove animations" is likely on.  Turning it off brings back the full bounce.

## Claudia (ready to build when asked)

- [ ] Drop in the fixed hats and re-check every hat spot.
- [ ] Gear-framed shop badge for the Gnome Wizard (his icon is a placeholder).
- [ ] Math pass: the Packing Line and mid-to-late pacing.  (Megagnome built in draft.54; tune his numbers after play.)
- [ ] Packing Line, after the math pass.  **Next session.**
- [ ] Tap the Megagnome on the Shop Floor to start a hunt (today only his shop row does).
- [ ] Keyboard play for the hunt (arrows plus Space).
- [ ] Themed buttons, when Mara's button art exists.
- [ ] Once Jarrett picks: repo move, music system, then the chosen proposal items.

## Done draft.20 to draft.51

Interface: oak-and-brass buttons, pause and sound moved beside the tabs, plank then clipboard panels (shop and, on desktop, the shelf), Mara's and Nathan's banners (desktop and phone), wider desktop layout with side rails for the next-item gauge and crew, seamless page boards, TAP label fades after a minute, brighter shelf labels, monster names shrink to fit.  Content: Gnome Wizard and five Wizard upgrades, 16 more junk items (12 per group), Control Knobs, basic slime (Jellybub), pixel Lucky Purple Underpants, painted Diamond Pickaxe and Magical Sword, new Warrior description.  Events: Wild Magic, Clone Attack.  Themes: Night.  Tools: `docs/INVENTORY.md` generator.  Full list in `CHANGELOG.md`.

## Done draft.52 to draft.57

Late-game lag fix (one item roll per tick) and the next-item ticker, a 1e300 safety ceiling, the Megagnome (shop checklist, events-only helper, food), the crossbow hunt with splats and Alex's voices, the Banana Monster boss and its trophy, version stamps on CSS and JS, hunt instructions, crossbow tilt fix, boss-needs-3-bolts fix.  (Megagnome hats tried and removed.)

## Proposal backlog (all drafts, nothing approved yet)

Producers for the 6 empty stations (the Wizard took the Golem Pilot's 1.6M slot): Golem Pilot, Boiler Stoker (20M), Gnome Bard (260M), Shroom Farmer (3.6B), Airship Captain (51B), Clockwork Chrononaut (750B), Moonsmith (11T).

Future producers unlock with regions (see the Packing Line in DESIGNS.md).  Moonsmith comes from Gnonmoon, the last region.  Other pairings are open, not every region brings a producer, prices are balanced separately from the unlock order, and this producer list may change to fit the structure, make a better mini-game, or meet a request from Jarrett or Elana.

Mini-games: Packing Line (Nathan's sorting game, first in line), Gear Jam, Pest Patrol, Alchemy Cauldron, Bard Jam, Expeditions.

Nathan's notes on the backlog (2026-11-03), all still Jarrett's call:

- Many proposal items will likely be dropped or changed.
- The Alchemy Cauldron overlaps the Clone game that already exists, so it is likely dropped or folded in.
- Nathan will push for the Golem Pilot and Expeditions later (send-a-crew-out missions, as in FF14 ventures and STO duty officers).
- Current focus: the lore, the region maps, and the Packing Line outline, since shipping closes the game loop.

The Packing Line, the Megagnome and his hunt, the Tiny Monster info card, and the Rogue are written up in [DESIGNS.md](DESIGNS.md).

Open question in the proposal: should packed items come out of the shelf counts, or should shipping be free?

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
| Sounds are fairly quiet on desktop speakers | Watch it; raise `fxBus` gain in `sfx.js` if testers agree |
