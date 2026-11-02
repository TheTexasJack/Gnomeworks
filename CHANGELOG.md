# Changelog

Every change gets a new version number.  Newest at the top.

## v0.2.0-draft.3 (2026-11-01)

* 79 junk items from Nathan's curated emoji list, in 8 groups: Laundry and Clothing, Bathroom Disasters, Office Nonsense, Workshop Junk, Kitchen Experiments, Toys and Curiosities, Questionable Inventions, and Absolutely Random.  Two per group are Uncommon.
* Junk uses bundled Twemoji art (CC-BY 4.0, credited in the Info tab), so every device sees the same pictures.  If a picture fails to load, the device emoji shows instead.
* The shelf is grouped now.  Each group folds open or shut and shows found/total, completed groups glow, and new finds get a NEW badge until you look at them.
* Removed the old placeholder items (chips, shirt, trading card).  Testers who already found them keep the count in their save, but they no longer show on the shelf.

## v0.2.0-draft.2 (2026-11-01)

* Mara's Gnomeworks sign is now the title in the header.
* The pause screen uses her blank sign with PAUSED lettered on it.
* Shop name moved into `branding` in `js/config.js`, with a slot for the shop logo once the rebrand is final.

## v0.2.0-draft.1 (2026-11-01)

First art pass, for review.

* Mara's brass gears replace the code-drawn ones.  The gear train is now drive (8 teeth) to a compound gear (12 teeth with a 7 tooth pinion in front) to the big gear (15 teeth), so speeds follow the real tooth counts.
* Mara's tavern wall is the machine backdrop, and her plank texture is the page background.
* The machine is now square to fit the wall art.
* Art is stored as compressed WebP in `assets/gears` and `assets/bg`.

## v0.1.2 (2026-11-01)

* Pause button in the header (or press P).  Freezes gnomes, popups, the play clock, and tapping.
* A paused game stays paused through reloads, and offline progress does not build up while paused.

## v0.1.1 (2026-11-01)

* Game is live on GitHub Pages at https://thetexasjack.github.io/Gnomeworks/
* README updated with the live link.

## v0.1.0 (2026-11-01)

First playable build.  Layer 1: core game with placeholder art.

* The machine: a wall of meshing gears drawn in code.  Tapping anywhere on the machine turns the little gear, and one full turn of the big gear drops an item out of the hatch.
* 12 starter items across Common, Uncommon, Rare, and Super Rare.
* Collection shelf with hidden "???" slots for items not found yet.
* Shop: Tiny Gnomes, Tinier Gnomes, Warrior Gnomes, Brass Knuckles, Faster Gears, Better Gear Ratio, Auto Poker, tiny gnome inventions, Rally Cry, and the warrior weapon ladder up to Gnome on a Stick.
* Rare popups on the side of the machine.  Only a real tap can claim one.  Lucky Sprockets pay cogs, and super rares go on the shelf, with a pity counter so nobody goes forever without one.
* Stats tab showing every click by who clicked it.
* Hat of the month for the gnomes (November: Harvest Hat).
* Saves in the browser every 10 seconds, plus offline progress for up to 8 hours.
* Season number in the config to wipe player saves for a new season.
* Phone and desktop layouts.
* `?debug=1` testing buttons and `?hat=` hat preview.
