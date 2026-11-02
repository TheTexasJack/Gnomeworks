# Gnomeworks

A gnome-powered clicker game made for The Stoned Gnome.  Tap the little gear, the little gear turns the big gear, and every full turn of the big gear pops something out of the hatch in the wall.

Current version: **v0.2.0-draft.10** (Layer 2 in progress: real art)

## Play it

* **Online:** once GitHub Pages is on, the game lives at https://thetexasjack.github.io/Gnomeworks/ (capital G matters)
* **On your own computer:** download the repo and open `index.html` in a browser.  No install or build step needed.
* **Testing helpers:** add `?debug=1` to the address for buttons that add cogs, spawn a rare popup, or skip ahead an hour.  Add `?hat=witch` (or any hat id from the config) to preview a month's hat.

## How it is built

Plain HTML, CSS, and JavaScript.  No frameworks and no build tools, so it can be dropped into a Wix page with an iframe.

| File | What it does |
| --- | --- |
| `index.html` | Page layout |
| `css/style.css` | The oak and brass tavern look |
| `js/config.js` | **The tuning file.**  Items, upgrades, costs, drop rates, hats, season |
| `js/util.js` | Number formatting and small helpers |
| `js/state.js` | Saving and loading (this browser only) |
| `js/economy.js` | All the math: rates, taps, item drops, shop, popups, offline progress |
| `js/gears.js` | Draws the wall, the meshing gears, and the hatch |
| `js/ui.js` | Shop, shelf, stats, gnome crew, effects |
| `js/main.js` | Input, the game loop, popups, autosave |

## Tuning the game

Open `js/config.js`, change a number, reload.  Everything the game uses is in there: item list and rarity tiers, gnome costs and click rates, upgrade costs, the warrior weapon ladder (dagger 3, sword 4, hammer 5, wand 6, staff 7, gnome on a stick 8 +1), popup timing, and the hat calendar.

**Bump `GW.VERSION` in `js/config.js` on every change** and add a line to `CHANGELOG.md`.

## Seasons

`season` in `js/config.js` is the reset switch for player saves.  Raising it by one wipes every player's local progress the next time they visit and shows a "new season" message.  (Server data such as the leaderboard gets its own reset steps once that layer exists.)

## Anti-cheese rules

* Only a real tap or key press counts.  Scripted clicks are ignored.
* Taps are capped at 20 per second.
* Shiny popups appear every 45 to 120 seconds whether or not you are tapping, and only a real tap can claim them.  No gnome or upgrade can ever grab one.
* Legendaries only come from "hot" (gold) shinies, which means you tapped the gear in the last 30 seconds.

## Art

Placeholder emoji and simple drawn gnomes are used until the real art lands.  See `assets/README.md` for the art spec and file names.

## Roadmap

* v0.1: core game, placeholder art  (this version)
* v0.2: real art and extra juice
* v0.3: accounts (Discord or email sign-in) and leaderboard
* v0.4: admin tools and visit stats
* v0.5: security pass and a setup guide for the shop
* v1.0: live on the shop's Wix site
