# Changelog

Every change gets a new version number.  Newest at the top.

## v0.2.0-draft.64 (2026-11-08)

- Auto clicker check hardened: it now judges timing by the middle gap instead of the average, so one browser stutter can't make a clicker look human and lift the strike early.  A clicker that stutters every 25 clicks is caught after 30 taps and stays caught.

## v0.2.0-draft.63 (2026-11-08)

- Auto clicker fix (a playtester ran one).  The tap cap drops from 20 to 12 a second; fast humans, four-finger drummers included, barely touch it.
- The gnomes now spot auto clickers by their metronome timing: over 30 fast taps with nearly identical gaps, the gear stops counting taps, sputters, and an ON STRIKE sign drops onto the machine with a random line ("Gnome Union Rule #1: no robots on the gear").  Uneven timing or a 3-second rest lifts the strike.  Caught taps never make shinies hot.  Numbers live in `tap.robot`; Stats keeps a hidden `robotsCaught` count.

## v0.2.0-draft.62 (2026-11-04)

- The Gnome Wizard has his real gear-framed badge (Nathan's art), replacing the temporary square picture.

## v0.2.0-draft.61 (2026-11-03)

- Hunt prey can have their own size (`size` in `mega.prey`, 1 = normal).  The Shroomturtle runs at 75% and the elk at 85%, so they're harder to hit.

## v0.2.0-draft.60 (2026-11-03)

- Hunt prey fix: the Shroomturtle picture held two creatures (the turtle and the elk), the elk picture was really the Crystal Lizard, and the Crystal Lizard had no picture at all.  Split and renamed so each creature has its own picture, and the elk now faces the right way.  The turtle and elk were cut from the shared sheet, so they're a little softer than the rest; a fresh cut from Mara's original would sharpen them.

## v0.2.0-draft.59 (2026-11-03)

- The Megagnome gives a soft belly jiggle every couple of seconds on the Shop Floor, so he no longer stands frozen while the crew works.  He holds still while chomping and burping, and on devices set to reduce motion.  Timing lives in `floor.anim` (`megaEvery`, `megaJiggle`).

## v0.2.0-draft.58 (2026-11-03)

- The Megagnome goes hatless again; the hats didn't suit him.

## v0.2.0-draft.57 (2026-11-03)

- The Megagnome wears the month's hat (Santa in December), and it stays on his head when he chomps and burps.  The Matryoshka and Wizard stay hatless.

## v0.2.0-draft.56 (2026-11-03)

- Hunt fix: the Banana Monster only appears while you still have at least 3 bolts, so he can always be beaten.  (Nathan met him with one bolt left.)

## v0.2.0-draft.55 (2026-11-03)

- Hunt: the crossbow sits lower and swings from a pivot below the box with a smaller tilt, and the painted arms fade out at the cut edges, so aiming hard left or right no longer shows where the arms end.

## v0.2.0-draft.54 (2026-11-03)

- Version stamps: every CSS and JS link carries the version (`main.js?v=0.2.0-draft.54`), so after a release browsers pull a matching set instead of mixing new and cached files.  `tools/stamp.js` writes them; the smoke test fails if they're stale.
- The hunt opens with a big "Feed the Megagnome!" sign explaining the pull-back and food, and his shop row says "Tap here to go hunting."  Both follow the Info > Look > "Show event instructions" setting.
- **The Megagnome.**  Listed in the shop from the start with his checklist (a Gnome Cloner, the Wild Magic upgrade) and a 100B price, plus a "ready in about..." countdown once the checklist is done.  One per player, events only: he stands on the Shop Floor and spends his food by himself.  During a Clone Attack he waits 4 seconds, then eats a loose clone every 2.5 seconds (the junk comes back).  If you're on the Machine view when clones break loose, he eats them before anyone gets out.  During Wild Magic he snaps up regular spinning items (never the golden one).  Chomp and burp sounds by Nathan; his food shows on his shop icon, crew badge, and the Stats tab.
- **The hunt.**  Tap his shop row to go hunting (every 10 minutes).  A box pops up over the machine: prey runs back and forth, you drag down to pull the crossbow back, sideways to aim, and let go to fire.  5 bolts, each shot costs 5 seconds of production, you can miss.  One hit kills (8 kinds of beast, each with its own color of Mara's goo splat).  Each kill is 1 food, up to 5.  Day and Night forest backdrops.
- **The Banana Monster** (requested by Jarrett's daughter): a rare boss that takes 3 hits, sheds bananas, and bursts into a shower of them for 3 food.  Beating him can drop the new 4th Legendary Treasure, the **Banana Monster Trophy** (25% a time, guaranteed by the 4th boss), which never comes from shinies.
- Hunt voices by Alex: five "UGH!" takes picked at random for kills (never the same twice in a row), a low grunt when the Banana boss is hit, and a choke when he goes down.  "Voices by Alex Gore" is credited in Info.

## v0.2.0-draft.53 (2026-11-02)

- Safety ceiling: cogs, items, clicks, and every other running total stop at 1e300 (`maxNumber` in config), just below where JavaScript numbers break into Infinity.  Nobody is near it (late saves are around 1e10), but a months-long save can never break.

## v0.2.0-draft.52 (2026-11-02)

- Smoother late game.  The gnome math used to roll item drops once per gnome type every frame; now it rolls once for all of them, and the drop tables are built once instead of every roll.  On a save like Nathan's (17M clicks a second) the game math dropped from about 400 ms to about 40 ms per 5 seconds, and the worst frame hitch from about 150 ms to about 40 ms.
- Next-item bar: once items come faster than 2 a second (when the fill was just a blur), it becomes a steady brass ticker that marches at a constant pace.  Slow games keep the real fill.  Tunable as `machine.tickerItemsPerSec`.

## v0.2.0-draft.51 (2026-11-02)

- Stats: the Gnome Wizards' clicks now show (and count toward the total), and a new Events section counts Wild Magic spells, spells fully broken, clones splooshed, and clones that got away.
- Docs pass: new docs/EVENTS.md (every built event) and docs/DESIGNS.md (Megagnome and the hunt, Packing Line, monster info card, Rogue, with what's decided and what's open).  TASKS, ARCHITECTURE, DECISIONS, RECIPES, and both READMEs brought up to date.

## v0.2.0-draft.50 (2026-11-02)

- New setting in Info > Look: "Show event instructions."  On by default.  Turn it off to hide the big Clone Attack signs and the "Drop here!" label (the glowing arrow stays, so you can still find the vat).

## v0.2.0-draft.49 (2026-11-02)

- Clone Attack is easier to understand: a big sign across the top of the Shop Floor stays up for the whole attack ("Clones are stealing your junk!  Grab a clone and drop him in the vat").  While you're holding a clone it turns green and says "Now drop him in the vat!  Let go on the green arrow."  The arrow's "Drop here!" label is bigger and stays on screen on phones.  The pop-up toast at the start is gone, since the sign replaces it.  (Jarrett's playtest: he didn't know where to drop them.)

## v0.2.0-draft.48 (2026-11-02)

- Legendary Treasures: the Diamond Pickaxe and Magical Sword get Mara's painted art in place of their emoji.

## v0.2.0-draft.47 (2026-11-02)

- Night theme.  Info > Look > Theme: Auto (follows your device's dark mode, the default), Day, or Night.  Night swaps in Mara's moonlit art: the banner, the title sign, the machine wall, both Shop Floor layouts, Help Wanted signs, the pause sign, black wood boards, and chalkboard clipboards with dark measuring tools.  Text on the chalkboards is chalk white.  Phones get their own moonlit banner too.
- New page boards: the background wood is a fresh plank set, mirror-tiled so there are no seams at the edges.  The side rails and gnome strip use it too.
- Legendary Treasure: the Purple Underpants are now the Lucky Purple Underpants, in pixel art (kept crisp, never blurred).

## v0.2.0-draft.46 (2026-11-02)

- Clone Attack: 4 clones per attack (was 2), each a different mutant.

## v0.2.0-draft.45 (2026-11-02)

- Clone Attack: the clones' "heh heh" is now a real recorded giggle (recorded for the game by Nathan's daughter), trimmed and leveled.  The code-made giggle stays as a fallback.

## v0.2.0-draft.44 (2026-11-02)

- Clone Attack: a glowing green arrow with "Drop here!" bobs over the vat for the whole attack, marking exactly where to let go.  The drop spot sits higher, so the dangling clone clears the rim and falls in.  The arrow bobs faster while you're carrying a clone.

## v0.2.0-draft.43 (2026-11-02)

- Opening the game straight from disk (index.html on your computer) no longer logs an error trying to load the splash sound; it quietly uses the code-made sploop instead.

## v0.2.0-draft.42 (2026-11-02)

- Clone Attack: the SPLOOSH is now a real recorded splash ("Splash 2" by freesound_community on Pixabay, trimmed to 1.4 seconds, 12 KB).  The code-made sploop stays as a fallback if the file can't load.  Credited in Info.

## v0.2.0-draft.41 (2026-11-02)

- Clone Attack: the drop spot moved up.  Since you hold a clone by the pinching hand, you now drop him with him dangling over the mouth of the vat, not on top of it.  The vat glows green while he's in the right spot.

## v0.2.0-draft.40 (2026-11-02)

- Clone Attack event (prototype).  Needs a Cloner; comes around every few minutes, sooner with more Cloners.  Two escaped clones (from 10 mutant kinds) mill around the Shop Floor, snatch an item off the belt (10% of your stack of it) with a gremlin "heh heh", then run the stairs Donkey Kong style for two laps and escape with it.  Press and hold a clone, drag him into the vat behind the Cloner, and SPLOOSH: the junk comes back plus 10 seconds of production.  Drop him anywhere else and he falls to the floor below and keeps running.  On the Machine view Mara's "Clones are loose in the shop!" sign pops up instead; tap it to jump to the floor.  Ignore it for 20 seconds and the clones give up, taking nothing.  Real pointers only; freezes with Pause or when you leave the floor.
- The Cloner station now has Mara's goop vat behind him.
- New Tiny Monster: the basic slime (normal form), finishing the slime family (draft name: Jellybub).  147 collectibles.
- Fix: the Wild Magic event never started on its own (only from the debug bar).  It now runs on its timer once the upgrade is bought.

## v0.2.0-draft.39 (2026-11-02)

- Desktop: the Collection Shelf is on a clipboard too, matching the shop.  Still 4 items per row.  Its set square and T-square sit flipped from the shop's, so the two boards don't look copy-pasted.  Phones are unchanged (everything already shares one clipboard there).
- Shelf item names shrink to fit their tile on narrow screens, so long monster names like Glimmander show in full instead of being cut off.

## v0.2.0-draft.38 (2026-11-02)

- Wild Magic event (prototype).  Buy the Wild Magic upgrade (10 Wizards, 100M) and every few minutes the Wizards lose control: 6 pieces of junk spin around the machine inside purple swirls.  Tap each one (real taps only) for 8 seconds of production, catch all 6 for a 30-second bonus, and one golden cog swirl pays triple.  The spell fizzles on its own after 9 seconds.  More Wizards make it come around more often.  Freezes with Pause; reduced motion gets glowing, still targets.  Debug bar (?debug=1) has buttons to fire each style.

## v0.2.0-draft.37 (2026-11-02)

- New Warrior Gnome description: "The might of adventure powers the machine."

## v0.2.0-draft.36 (2026-11-02)

- Every junk group grows from 10 to 12 items, so the shelf fills clean 4-by-3 rows on phones and desktop alike.  The desktop shelf now shows 4 per row to match.  New items: Jeans, Coat, Razor, Hair Pick, Clipboard, Printer, Clamp, Hook, Frying Pan, Jar, Teddy Bear, Boomerang, Microscope, Satellite Dish, Pet Rock, and Shopping Cart.  The collection totals 146 (147 with the basic slime in draft.40).
- New doc: docs/INVENTORY.md, the master list of every collectible.

## v0.2.0-draft.35 (2026-11-02)

- New gnome: the Gnome Wizard (Jarrett's idea).  "It is not the cog that turns, but you."  Unlocks at 1M cogs seen, costs 1.6M, clicks 1,400 a second.  On the Shop Floor he flips to his upside-down pose (with its own painted magic) and spins in place, faster the more you own.
- Wizard upgrades: Dizzy Robes, Counter-Clockwise Casting, Tornado Beard, and Perpetual Pirouette (Wizards x2 each, at 5, 15, 30, and 50 Wizards).  Not the Cog, But You (at 25 Wizards): every Wizard makes all other gnomes 1% faster, up to +50%.
- Wizard art and three swirl effects by Mara.  The swirls are saved for spinning items in the Wild Magic event.

## v0.2.0-draft.34 (2026-11-02)

- Shelf labels are easier to read: item names are bright white and bold, counts are pale gold, both with a dark outline.  Group counts are brighter too.

## v0.2.0-draft.33 (2026-11-02)

- The right panel (Shop, Stats, Info) is now a clipboard: Mara's brass clip, wood board, and grid paper, built so the paper repeats seamlessly however long the list gets.  Text on it is dark ink.  A T-square and a set square peek out from behind the top corners.
- Info: the sound note now points to the speaker button next to the tabs.

## v0.2.0-draft.32 (2026-11-02)

- New junk item: Control Knobs, in Questionable Inventions.  Every junk group now has 10 items, and the collection totals 130.

## v0.2.0-draft.31 (2026-11-02)

- Wide screens: when there is room beside the machine, the next-item gauge stands on its left as a tall brass tube that fills from the bottom, and the gnome crew stacks down its right side as badges with counts.  Both used to sit below the machine, out of view on most monitors.  Narrower screens and the Shop Floor view keep the old layout.  Tunable as `layout.railMinWidth`.

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
