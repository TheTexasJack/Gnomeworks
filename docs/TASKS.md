# Tasks and status

Last updated 2026-11-02, at v0.2.0-draft.20.

## Where we are

| Layer | Version | Status |
| --- | --- | --- |
| Core game: gears, items, shop, saves | v0.1 | Done |
| Art and juice: Mara's art, Shop Floor, animation, sound, hats, collections | v0.2 | Mostly done (draft.19), polish items below |
| Accounts and leaderboard | v0.3 | Waiting on Jarrett's yes or no |
| Admin tools and stats | v0.4 | Planned |
| Security pass and Jarrett's guide | v0.5 | Planned |
| Live on the Wix site | v1.0 | Planned |

Game content right now: 5 gnome types (Tiny, Necromancer with skeleton crew, Warrior, Cloner, Matryoshka), 7 empty stations, 129 collectibles (79 junk items in 8 groups, 43 Tiny Monsters, 4 Number Twos, 3 Legendary Treasures), 6 hats.

## Waiting on Jarrett

Nathan sent him the proposal ("Gnomeworks: Producers and Mini-Games Proposal v0.2") on 2026-11-02.

- [ ] Repo home: a branded GitHub Organization or account, and possibly a custom domain.  **Do this before launch**, since moving resets every save.
- [ ] Background music: off, shuffle, by view, by season, or by event, and which Steammetal Studios tracks.
- [ ] Accounts and leaderboard: yes or no, and Discord or email sign-in.
- [ ] Which mini-games and new gnome types to build.
- [ ] Shop logo, after his rebrand.
- [ ] License: an explicit "all rights reserved" LICENSE file, and who owns the art.

## Nathan

- [ ] Remove the inside-of-brim lip from the six hats in GIMP (keep the canvas size), then send them over.
- [ ] Optional: on the Android phone, Settings, Accessibility, "Remove animations" is likely on.  Turning it off brings back the full bounce.

## Claudia (ready to build when asked)

- [ ] Drop in the fixed hats and re-check every hat spot.
- [ ] Phone header polish: the cog count wraps under the title sign.
- [ ] Themed buttons, when Mara's button art exists.
- [ ] Once Jarrett picks: repo move, music system, then the chosen proposal items.

## Proposal backlog (all drafts, nothing approved yet)

Producers for the 7 empty stations: Golem Pilot (1.6M), Boiler Stoker (20M), Gnome Bard (260M), Shroom Farmer (3.6B), Airship Captain (51B), Clockwork Chrononaut (750B), Moonsmith (11T).

Mini-games: Packing Line (Nathan's sorting game, first in line), Gear Jam, Pest Patrol, Alchemy Cauldron, Bard Jam, Expeditions.

Packing Line notes (Nathan, 2026-11-02, still open):
- The player drags one item tile from the shelf into a box.  That one drag ships a big batch, since shipping one sock out of 13.7M means nothing.
- Open question: a fixed batch per box (something like a million), or a "drop how many?" choice.  Leaning toward a fixed big number, since a gnome factory runs on nonsense, not logic.  To be tuned in play.

Open question in the proposal: should packed items come out of the shelf counts, or should shipping be free?

## Known issues and accepted quirks

| Issue | Status |
| --- | --- |
| Hats show the inside of the brim | Fix in progress (GIMP) |
| Shop Floor gnomes stood still on devices set to reduce motion (Nathan's Android) | Fixed in draft.20: gentle pose swaps |
| Tall phone floor has an empty bottom level with no plates | Accepted; Mara could add a 4th plate row for 16 stations |
| Matryoshka sets (10 and 25 owned) only wiggle, no open/close | Accepted, Nathan likes it |
| Highlights painted on gears rotate with them | Accepted |
| Skeletons and matryoshka wear no hats | Accepted for now |
| Goopamice and Hexamice are drawn in a sketchier style | Accepted |
| "Glimmander" is 10 letters (target 9) | Accepted |
| The `v0.1.0` git tag never made it to GitHub | Accepted; history lives in commit messages and the changelog |
| Sounds are fairly quiet on desktop speakers | Watch it; raise `fxBus` gain in `sfx.js` if testers agree |
