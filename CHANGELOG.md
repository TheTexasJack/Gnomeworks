# Changelog

Every change gets a new version number.  Newest at the top.

## v0.2.0-draft.30 (2026-11-02)

- Wide screens use more of the screen.  The page grows to 1800 px wide, the Collection Shelf column grows to about 420 px (5 items per row), and the Shop column to about 440 px.  Screens 1400 px and narrower look the same as before.
- The desktop banner tops out at 165 px tall on wide screens, trimming a little sky and rooftop so the machine stays in view.

## v0.2.0-draft.29 (2026-11-02)

- The word TAP under the little gear fades out about a minute after the page opens.  The pulsing ring stays as the hint.  Tunable as `tap.labelFadeSeconds` in config.

## v0.2.0-draft.28 (2026-11-02)

- The desktop banner is now the factory-and-sky scene: brighter, calmer, and roomy enough for holiday versions later (Santa in the sky, a dragon on the mountain).  The gnome-and-conveyor strip is kept as a spare.

## v0.2.0-draft.27 (2026-11-02)

- Nathan's reworked banners.  Desktop shows the full gnome-and-conveyor strip, and the header keeps the strip's shape so no heads get cut off.  Phones get a new wide scene with the gnomes peeking out around the logo and the counter.  A factory-and-sky strip is saved as a spare.

## v0.2.0-draft.26 (2026-11-02)

- On phones the logo and the cog counter are centered again, like before.  The phone banner is placeholder art until a version with the gnome off to one side arrives.

## v0.2.0-draft.25 (2026-11-02)

- New header banners by Mara: a gnome industry scene on desktop (gnomes boxing junk off the conveyor) and a gnome with a hand truck on phones.  The header is a bit taller to show them.  Soft shading at the edges keeps the logo and the cog counter readable.
- On phones the logo and the cog counter sit on the right so the gnome stays in view.

## v0.2.0-draft.24 (2026-11-02)

- The cog counter sits at the right end of the banner on desktop, leaving room for a banner picture.  On phones it is a compact centered plate instead of a full-width bar.

## v0.2.0-draft.23 (2026-11-02)

- The pause and sound buttons are now small icon buttons in the right-hand panel, just under the Shop, Stats, and Info tabs, on the same line as the "Gnomes" heading.  They stay put on every tab.  The banner now holds only the title and the cog counter.  On phones the buttons move down with the panel.
- The pause button shows its label as a tooltip ("Pause (P)") and to screen readers.

## v0.2.0-draft.22 (2026-11-02)

* The side panels, the header banner, and the gnome strip use Mara's painted wood planks (darkened for readable text) with brass corner rivets, in place of the old flat gradients.

## v0.2.0-draft.21 (2026-11-02)

Interface cleanup, step 1.

* One button style everywhere: oak buttons with brass trim and rivets that press down when tapped, lit brass when active.  Covers the view toggle, the tabs, pause, sound, resume, and reset.
* Pause and sound use drawn icons, since some systems showed a blank box for the old pause symbol.
* Header: the cog count sits in its own brass-framed plaque.  On phones it gets a full row under the title instead of wrapping awkwardly.
* Shop rows stay readable when you cannot afford them.  A thin brass meter shows how close you are, and rows you can buy glow.
* The gnome strip under the machine is a row of badge chips.
* The "next item" bar looks like a lit brass gauge.
* Fixed an empty message box peeking up from the bottom of the screen.

## v0.2.0-draft.20 (2026-11-02)

* Devices set to reduce motion now see the Shop Floor gnomes switch between their static and action poses (slower, with no squash, stretch, or shake).  Before, they stood completely still.
* The Info tab says when a device is set to reduce motion, which makes "the gnomes don't move" easy to diagnose.

## v0.2.0-draft.19 (2026-11-02)

Documentation and tools.  No gameplay changes.

* New `docs/` folder: environment and commands, architecture, art pipeline, recipes, current tasks, and the decision log, so the project can be picked up cold.
* New `tools/art.py`: the art pipeline used so far (check, cutout, sheet, pair, fit, gear) as one script.
* New `tools/smoke-test.js`: headless desktop and phone test with screenshots.
* `assets/README.md` updated to the current art spec.

## v0.2.0-draft.18 (2026-11-02)

* Gnome badges redrawn with red beards to match the Shop Floor gnomes.

## v0.2.0-draft.17 (2026-11-02)

* Hats are back, with Mara's art.  The gnomes on the Shop Floor wear the hat of the month, and it rides along through the squish and boing.
* Calendar: Valentine (February), Shamrock (March), Bunny (April), Witch (October), Santa (December), and the Classic red hat every other month.
* The Info tab says which hat is in season.  Preview any hat with ?hat=witch (or santa, easter, clover, valentine, classic) on the address.

## v0.2.0-draft.16 (2026-11-02)

* Mara's gear-framed badges for all five gnome types, shown on their shop rows and in the crew strip under the machine.

## v0.2.0-draft.15 (2026-11-02)

Sound effects, all synthesized in code (no sound files, no licenses).

* Tap: a wooden ratchet tick with a brass ping that climbs in pitch while you tap fast.
* Items: hatch clunk and pop, with a sparkle for Uncommon and a chime for Rare.  Quieter on the Shop Floor.
* Shop: a ka-ching when you buy, a dull thunk when you cannot afford it.
* Shinies: a twinkle when one appears (brighter when gold), coins for a Lucky Sprocket, a magic chime for Super Rare, and a fanfare for Legendary.
* Gnome chatter on the Shop Floor: crank squeaks, skeleton clatter, warrior thuds, cloner bloops, and matryoshka pops, capped at about 2 a second.
* Speaker button in the header mutes all game sound.  Effects volume and a gnome chatter switch are in the Info tab.  Settings are saved.
* Sound starts after the first tap, as browsers require.  On iPhones the sounds are marked as ambient so they mix with the player's own music.

## v0.2.0-draft.14 (2026-11-02)

* The training dummy now stands behind the warrior, so his weapon hits in front of it instead of disappearing behind it.

## v0.2.0-draft.13 (2026-11-01)

Layer 2, step 2: squish and boing.

* Every gnome on the Shop Floor squishes down, swaps to Mara's action frame, and boings back up.  Faster gnome types bounce faster (between every 2.2 and every 0.45 seconds).
* The Necromancer's action frame is shifted so he stays put while the summoning cloud rises beside him.
* Warriors carry their current weapon (dagger, sword, hammer, wand, staff, or gnome on a stick), raised in the wind-up and swung forward on the strike.  The training dummy wobbles and a slash flashes on every hit.
* Matryoshka pops open on each bounce (the 3 and 5 doll sets just bounce).
* Animations stop while paused, when the floor is not showing, and for players who turn on reduced motion.

## v0.2.0-draft.12 (2026-11-01)

* New machine wall from Mara with the gearbox, gauges, pipes, and chute painted in.  The gears now sit on its mounts, and the hatch flap opens over its built-in opening.
* Phones get Mara's tall Shop Floor, with bigger gnomes and a vertical layout.  It switches automatically under 720px wide.

## v0.2.0-draft.11 (2026-11-01)

* Bathroom Disasters: Suspicious Pile is out (the Number Twos have that covered), and the Poop Knife is in.  Still Uncommon.

## v0.2.0-draft.10 (2026-11-01)

Layer 2, step 1: the Shop Floor.

* New view toggle above the machine: The Machine or the Shop Floor.  The choice is remembered.
* The Shop Floor uses Mara's three-level workshop.  Each gnome type gets its own station with its count on the brass plate, and empty stations show a HELP WANTED sign.
* Tapping anywhere on the Shop Floor cranks the machine, shinies still appear, and items ride the conveyor belt instead of popping out of the hatch.
* Tiny Gnome station swaps to the two-handed gnome after Double-Handed Cranking.  The Matryoshka station grows into a set of 3 at 10 owned and a set of 5 at 25.
* Tinier Gnomes are now the Gnome Necromancer, raising a skeleton crew.  Same cost, same speed, same save data.
* Two new gnome types: Gnome Cloner (12K cogs, 40 clicks/sec) and Matryoshka Gnome (140K cogs, 260 clicks/sec).  Draft numbers.
* The strip under the machine shows Mara's gnome art instead of the placeholder gnomes.
* Hats are parked for now.  They need to be redrawn to fit the new gnome art.
* Weapons, the training dummy action frame, the slash effect, and all action frames are sliced and in the repo, ready for step 2 (animation).

## v0.2.0-draft.9 (2026-11-01)

* Rarer items are 50% more common, from tester feedback.  Rare machine drops went from 8 to 12 weight (about 7.8% to 11.3% of drops).  Shinies: Super Rare 30% to 45%, Legendary 6% to 9% (gold shinies only).  Lucky Sprockets drop from 64% to 46% of shinies.

## v0.2.0-draft.8 (2026-11-01)

* Filled the monster gaps: Glowbat (Super Rare), Goopamice (Super Rare), and Hexamice (Legendary).  Every family except the slimes now has all four forms, 43 monsters in total.

## v0.2.0-draft.7 (2026-11-01)

* New shelf group, Number Twos: Ploppy (Rare, from the machine), Cogplop and Prizeplop (Super Rare, from shinies), and Goldplop (Legendary, gold shinies only).

## v0.2.0-draft.6 (2026-11-01)

* Shinies now appear every 45 to 120 seconds whether or not you are tapping, and stay for 20 seconds.
* A shiny turns gold ("hot") while you have tapped the gear in the last 30 seconds.  Only hot shinies can be Legendary, and the Legendary guarantee waits for a hot one.
* Shinies pop in with a bounce, and the machine edges flash gold when one appears.

## v0.2.0-draft.5 (2026-11-01)

* Shorter, punnier monster names (9 letters or less).  Families: Tickhop, Hootgear, Magmander, Shroomtle, Zapfox, Potamice, Fluffbat, Pebblem, Bloomlet, Cogsnake, and the slimes.  Every glowing, goopy, and evil form has its own name, like Scowl, Gooconda, and Vampuff.

## v0.2.0-draft.4 (2026-11-01)

* 40 Tiny Monsters from Mara's critter art, in 11 families (Windup Hare, Goggle Owl, Magma Salamander, Shroomshell Tortoise, Volt Fox, Potion Mouse, Fluffbat, Pebble Golem, Bloom Sprout, Cogsnake, and the Slime family).
* Each family is one row on the shelf: normal, glowing, goopy, evil.  Missing forms leave an empty slot.
* New Legendary tier (gold).  Normal monsters are Rare and come out of the machine.  Glowing and Goopy are Super Rare, and Evil monsters plus the three treasures are Legendary.  Super Rare and Legendary only come from popups, claimed by a real tap.
* Popups: 6% Legendary, 30% Super Rare, otherwise a Lucky Sprocket.  A Super Rare or better is guaranteed by the 6th popup, and a Legendary by the 25th.  Popups favor monsters you do not have yet.
* Removed the placeholder Tiny Monster emoji item.

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
