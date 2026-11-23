# Designs not built yet

Features that have been talked through but have no code.  Each one lists what Nathan **decided**, what is still **open**, and what art it needs.  Anything marked "draft" was Claudia's suggestion and is not approved.

## Megagnome and the hunt

**Built and complete (draft.54 to draft.61; Nathan closed it 2026-11-04).**  Kept here as the record of how it was designed.  No open items.

**Built in draft.54** (see [EVENTS.md](EVENTS.md)).  Kept here as the design record.

The event clicker.  Discussed 2026-11-02.

**Decided**

- **One Megagnome per player, ever.**  A big late-game purchase.
- He is the **event helper**: he spends his **event charges automatically** during events.  That is the idle pull.  Players don't tap him.
- He **gives the player first crack**: he waits a few seconds after an event starts before helping.
- **Charges come from a hunting mini-game**, not from feeding him gnomes.  (The earlier "feed him 200 Tiny Gnomes" idea was dropped; it broke the price math, and two days of real play showed counts stay under 100 anyway.)
- **The hunt:** a small box pops up.  Prey moves back and forth.  Drag down to pull the crossbow back, aim, release to fire.  **One hit kills.  You can miss.  Every shot costs cogs.**  Hits are food, food refills his charges, with a gulp and a burp.

- **Price: 100B cogs.**  Several days of play; a goal to shoot for.
- **He's listed in the shop from the start**, unlike other gnomes that appear when unlocked, with a short checklist of his requirements and his cost, and a countdown to when you can afford him (like the shop meters).
- **Events only.**  He makes no clicks.
- **Food counter next to his icon.**  Each hunt kill is 1 food.  He spends food automatically on events.  **Max 5 food**, enough to cover one missed event (a Clone Attack is 4 clones).
- **Hunt cooldown:** a delay before you can hunt again, so food builds up over time instead of all at once.
- **Crossbow art without the string**; the string is drawn in code so it stretches with the pull.  Bolt as its own image.

**Draft details (not approved)**

- Clone Attack: every few seconds he eats one clone (1 charge), the loot comes back like a sploosh.  If you're on the Machine view he handles the clones off-screen and a toast tells you ("The Megagnome ate 3 clones while you were busy.  BURP.").
- Wild Magic: he catches a regular spinning item now and then; the golden cog stays for real hands.
- Shinies stay hands-only.  He never touches them.
- With an empty belly he sits there looking sad and hungry.
- Shot price around 5 seconds of production, so a good hunter profits a little and a sloppy one breaks even.
- The prey starts slow and speeds up with each hit.
- The prey is its own wild game (boars, running turnips, fat chickens, walking mushrooms), **not Tiny Monsters**, since those are the collection.  Cartoon, no blood.
- Name ideas: Gnomezilla, Gnomelith.

**Open**

- Nothing; numbers settled 2026-11-02 (below).  Tune after play.

**Prey and hits (decided 2026-11-02)**

- No hit poses.  A kill shows a cartoon burst image instead; Nathan sends a few colors and Claudia picks what reads best on the Day and Night hunts.
- Death sound: Alex records a silly "UGH!" (a few takes get picked at random).  Then she gets the "Voices by Alex" credit.
- **Banana Monster boss**, requested by Jarrett's 6-year-old daughter: takes **3 hits**, white or yellow burst, and tiny bananas fly out when he goes down.  Draft: rarer than normal prey, and worth more food to make the 3 bolts worth it.
- **Banana Monster Trophy**: a 4th Legendary Treasure for her (fills the treasures row to 4).  Art from Nathan.  Draft: it only drops from beating the Banana Monster boss in a hunt (a chance each time, guaranteed by some number of boss kills), so it's the one Legendary you earn by hunting instead of from a gold shiny.

**Numbers (approved 2026-11-02)**

- Requirements: own a Gnome Cloner and the Wild Magic upgrade, plus 100B cogs.
- Hunt cooldown: 10 minutes.
- 5 bolts per hunt; each shot costs 5 seconds of production.

**Art needed (Mara)**

- Megagnome: idle, chomping, burping (same canvas so the swaps line up), visibly huge.  A shop badge.
- Crossbow (one image; the code rotates it), a bolt.
- 4 or 5 prey kinds, each with a normal pose and a "hit" pose (puff or X eyes).
- Optional hunt backdrop (the scenic banner can stand in).
- Optional: a burp recorded by Alex.

## Packing Line

Nathan's sorting game, first mini-game in line.  Discussed 2026-11-02, reshaped 2026-11-03.

An early Claude doc ("Gnomeworks Packing Line: Design and Asset Guide", v0.1) predates every decision below and is retired.  This file is the current design.

The idea: the clicker is the farm, the shelf is the warehouse, the Packing Line is where the stock goes out.  Emptying the shelf is the point.  An empty shelf sends the player back to the gear to click more.  A shipping game grows out of the clicker.

**Decided**

- The player drags **one item tile** from the shelf into a box.  One drag ships a big batch.
- **Shipping removes items from the shelf.**  Players can sell off everything they have.
- **Every item stops at 1.**  The last one is the display copy, so collections and shelf tiles never go dark.
- **Swipe:** when the dock is built as a view, add `'shipping'` to `views` in config so phones can swipe to it (draft.67).
- **Open and Close buttons.**  Open raises the shipping door and makes the shelf draggable.  Close shuts it, and the player goes back to the clicker.
- **Destinations come from the Gnomadica map and gazetteer** (decided 2026-11-04).  Each region gets its own stamp; towns are the address line.  Early shifts check only the region stamp, later shifts check the town too.
- **Every island is its own region:** Gnufoundland, Shen Shin, Slaanilok, Gni, and Gnonmoon, alongside the five main-island regions.  Ten regions, ten stamps.
- **Regions unlock as you go:** after a set number of successful missions, the next region opens.  Gnomerica (the factory's home) is first.  Its unlock also opens that region's Gnomopedia entries.
- **The gazetteer's imports and exports are base values.**  The game reads a destinations file generated from the gazetteer, so lore and game never drift apart.
- **Variable needs and a market for imports and exports are held for a separate future game,** kept out of the Packing Line.
- **Region unlock by expedition (Nathan's idea, 2026-11-04, details open):** after enough successful missions, an Expedition button appears.  The player drags a few crew from the factory into a small adventure squad (mostly cosmetic) and sends them off.  About 10 minutes later the squad returns with a short story: why the region opens up, who matters there, and what they want.  The region is then unlocked.
    - **Theater, not a mini-game** (Nathan): the squad is about five adventurers from the factory.  They are not counted or spent, and sending them never touches production.
    - **Guardrails (agreed):** the timer runs while the player is away; the expedition always succeeds, and any mishaps are only funny.
    - The return story doubles as the region's first Gnomopedia entry, and "what they want" can become that region's first order on the order board.
    - **Unlock order (decided):** a counterclockwise spiral around the map.  Gnomerica is home.  The main island goes Gnohio, Gnafrica, Slanic, Gno Dao Cradle.  The outer islands go Gni, Slaanilok, Shen Shin, Gnufoundland, Gnonmoon.  The pattern itself is the reason.
    - **Each unlock adds a new thing to watch for and a new step in sending a package.**  Details to be worked out later.
    - **Future producers come from regions** (Nathan, 2026-11-04): a region unlock can unlock the producer that region supplies.  Gnonmoon is last, so the **Moonsmith is last** too.  The other pairings are open.
    - **Not every region brings a producer.**  A region can bring some other thing or an event, or nothing at all.
    - **Lore decides the pairing, and producer prices are balanced on their own.**  The shipping game only unlocks a producer; it does not set its price.  Balancing the two together would force placements that break the lore (like moving Mycelia's mushrooms to the wrong region).
    - **The producer list can change** to fit this structure, to make a better mini-game, or because Jarrett (or Elana) asks.
    - **Heroes are a separate, long-term idea:** named hero characters who sit in the background for lore and moments like this.  They need their own design, apart from the expedition squad, and are not needed now.
- **Shipping does not pay cogs.**  It earns **Stonks** (Nathan's pick, ties to the stock ticker; placeholder icon 📈).
- **Stonks is a score, never spent (Nathan, 2026-11-15).**  Stonks is simply the marker that TNP Corp is measured against.  Nothing in shipping costs anything: stamps, boxes, stickers, and every other supply are free.  There is no Stonks shop.  This keeps the shipping game what it is: an organizer and a Simon Says variant.
- Clone Attack on an emptied shelf stealing 1 sock is fine (and funny).
- ~~Math before code: stamp prices and upgrade costs get a pass before building.~~  Retired 2026-11-15: nothing in shipping costs anything.

**Math pass notes (2026-11-03, model at early, mid, and Nathan's day-2 numbers)**

- Paying per item at the item drop bonus is worthless: under 2 seconds of production even for a 90% drag late game.  Any per-item price has to scale with the game (for example, priced in gear turns).
- A percentage drag takes about that percentage of ~35 minutes to grow back, at every stage, because growth compounds.  Shoebox holes refill in minutes, Container holes in about half an hour.
- Shipping limits itself: nothing ships faster than the machine makes it.  The first open of a full shelf is a big one-time payout, and after that each sell-off pays for whatever built up since.
- ~~Box upgrades (Shoebox 10%, Crate 25%, Pallet 50%, Shipping Container 90%) as speed upgrades.~~  Dropped 2026-11-04 (Nathan): boxes cost nothing, and the challenge is the packing match.

**Order of work (Nathan, 2026-11-04):** finish the lore pass, then nail down the full gameplay mechanics, then make assets, then build.  (Status 2026-11-22: lore, layer 1 mechanics, and all 45 art packages are done; the build is next.)  First mechanics to settle: how much of a pile one package ships, what the Stonks shop sells (if anything), and what a failed shipment does to spendable Stonks versus the ticker line.  (2026-11-15: Stonks is score only and nothing is bought, so a failure just drops our line and lifts TNP's.  The pile question has a draft answer in Purchase orders below.)

**Shipping log (Nathan, 2026-11-04, decided; build after the core)**

- After a package ships, the player can open its **shipping log**: about **10 short entries** on how the journey went, auto-filled at random from a pool of events.  Flavor only: it changes nothing in the game.
- The pool can mix general road events with region lines (crossing Gnod Dam, a stop in Gassy Dog, a Lantern Chain ferry) and lines about the packing (a tracker pinging from the mountains, an 800 lb "light" box).  Event logic is still to be written.

**Packing complications by region (Nathan, 2026-11-04, decided; details open)**

Each region unlock adds one complication, and they stack.  Some apply to every package from then on, and some only to packages bound for that region.

| Unlocks with | New requirement | Applies to |
| --- | --- | --- |
| Gnomerica | The correct supplies in the box (see Correct supplies below) | Every package |
| Gnohio | Safety stickers, 5 to 10 per box | Every package |
| Gnafrica | Temperature-controlled box | Gnafrica packages |
| Slanic | Water-resistant box | Slanic packages |
| Gno Dao Cradle | A wireless tracker in the box (boxes kept getting lost in the mountains) | Every package |
| Gni | A Shrubbery or Red Herring sticker | Gni packages only |
| Slaanilok | Water-resistant box, sprayed with bug repellent | Slaanilok packages |
| Shen Shin | Wooden box.  ~~Every package is weighed and gets a weight sticker~~ (held 2026-11-15: weight is not a mechanic for now; the idea was Light, Medium, or Heavy with a made-up number, since gnomes use magic and an 800 lb box is fine) | Wooden box: Shen Shin packages only (they are insulted by anything less).  Weighing: every package |
| Gnufoundland | Water-resistant box, bug spray, and a complimentary dog toy or treat | Gnufoundland packages |
| Gnonmoon | Temperature-controlled box, a complimentary Idol gift, and an anti-demon rune traced onto the box (a simple shape-tracing game, easy with a mouse, like a Korean letter) | Gnonmoon packages |

**Correct supplies: Gnomerica's rule (Nathan, 2026-11-15; Claudia's details approved by Nathan 2026-11-22)**

Every junk item gets a packing tag: **Breakable**, **Soft**, **Heavy**, or none.  A chart in the menu explains the three, and each item tile shows its icon.

- **Breakables go on top**, and a box with a breakable needs **bubble wrap**.  (Nathan)
- **Packing peanuts** (the cornstarch kind) fill the box.  (Nathan)  Every box gets peanuts (approved 2026-11-22).
- **Heavy goes in first.**  Putting a heavy item in last earns an ❌.  (Nathan)
- **Outside stickers:** a **FRAGILE** sticker on any box holding a breakable, a **HEAVY** sticker on any box holding something heavy.  (Nathan)
- **Soft** items have no rule (approved 2026-11-22).  They are safe anywhere, so the chart tells players they never need to worry about them.
- Each item carries one tag only.  A Toilet is Heavy (approved 2026-11-22).
- ~~Draft ramp over Gnomerica's first few days.~~  Not needed (Nathan, 2026-11-15): the full rule set is fine from the start, since Elana already plays more complicated games.

Item tags (approved by Nathan 2026-11-22; the final list goes in `js/config.js`):

| Group | Breakable | Heavy | Soft |
| --- | --- | --- | --- |
| Workshop | | Toolbox, Brick, Ladder | |
| Random | Potted Plant, Old Vase | Log, Chair, Pet Rock, Shopping Cart | Laundry Basket |
| Bathroom | | Toilet, Bathtub | Toilet Paper, Sponge |
| Laundry | | | Socks, Underpants, Shorts, Gloves, Scarf, Necktie, Ball Cap, Jeans, Coat |
| Kitchen | Salt Shaker, Teapot, Bowl, Jar | Frying Pan | |
| Office | | Stack of Books, Printer | |
| Inventions | Test Tube, Petri Dish, Lightbulb, Microscope | Fire Extinguisher | |
| Toys | Magic 8-Ball, Balloon | | Teddy Bear |

Everything not listed has no tag.

- **The Purchase Order (Nathan, 2026-11-04):** every package comes with a purchase order that tells the player what to load.  It is the thing the player reads and matches.
- **The packing is the game (Nathan, 2026-11-04):** a match game inspired by Simon Says (the inspiration only, not its rules).  Read what the package needs, put the right things on it, ship.  **Completing the order is what counts.  Extra items do nothing, except on Gnonmoon.**
- **Gnonmoon is the final challenge: its packages must be EXACT** (Nathan, 2026-11-04).  Everything the order needs, and nothing else.
- **Boxes and packing supplies are free (Nathan, 2026-11-04).**  The factory makes them, so stock is unlimited, as in most shipping games: the point is the packing.  Every box and supply sits on the packing bench from the start and does nothing until a region needs it.
- **Hidden alternates (Nathan, 2026-11-04):** some requirements have a secret second answer that also counts, and the player is never told.  Gni accepts a Red Herring sticker or an actual red herring fish.  Gni also accepts a Shrubbery sticker or the real shrub from the corner of the room, which the player can click to add to the box (taking it changes nothing in the room).
- **Throw-ins (Nathan's idea, 2026-11-04, settle with the mechanics):** a few grabbable things around the packing room that do nothing and change nothing.  They are just fun to toss in, and the shipping log can react ("Ugh, not this guy!  He gets 10 rocks with his order!").  Extras never count against a package (decided).  The only exception is Gnonmoon, where packages must be exact.
- **By Shen Shin**, every package needs the correct supplies, a safety sticker, a tracker, and the correct box for its destination.  (The weight sticker is held, 2026-11-15.)
- **The Gnonmoon gift slot (Nathan, 2026-11-04):** the dog toy and the Idol gift share one slot.  A normal Gnonmoon package (Idol gift plus the anti-demon rune) ships fine for everyone.  One recipient, the dog guy, has a special mark on his purchase order.  Spotting it and swapping the Idol for a dog toy earns a big Stonks boost, like a critical hit for noticing.  A dog toy sent to anyone else gets creative insults in the shipping log and a big Stonks hit.  The mark keeps this a skill to spot rather than a gamble.
- **The dog guy's look (Nathan, 2026-11-04):** a kissy, lovable goof who blows kisses and floats hearts, especially over anything dog.  Classic cartoon gush, Tom and Jerry style.  His purchase order mark can be a paw print inside a heart.  **Update (Nathan, 2026-11-22):** the kiss lives on the paw-in-a-heart mark only.  His picture is a happy peace-sign selfie with no floating hearts or blown kisses, so he stays lovable and never creepy.
- **The shipment score is the core mechanic (Nathan, 2026-11-04):** a successful shipment sends our Stonks up.  A failed one sends our Stonks down and TNP Corp's Stonks up.

**Packing Line asset list:** superseded by the tiered list in [art-style/PACKING-LINE-ASSETS-v0.3.md](art-style/PACKING-LINE-ASSETS-v0.3.md) (2026-11-15).  The older draft below is kept for history.

**Older draft asset list (2026-11-04)**

- The packing room backdrop, the bench, and the shipping door.
- Boxes: plain cardboard, temperature-controlled, water-resistant, wooden (Shen Shin).
- Region stamps, one per region (ten): one color and one symbol each, no names (decided 2026-11-15, see [lore/regions.md](lore/regions.md)).  Placeholder sheet in `docs/lore/stamps/`.
- The compact lore map for the packing room wall, the player's region reference (Tier 1).
- Supplies and stickers: safety stickers, the wireless tracker, the Red Herring sticker, the Shrubbery sticker, the anti-demon rune (drawn by the player).
- Gni's secret alternates: a red herring fish and a shrub in the corner of the room.
- Bug repellent spray can and its spray cloud.
- Complimentary gifts: dog toy or treat, Idol gift.
- Throw-ins: a few silly grabbables (rocks and the like).

Notes to settle when this is built (Claudia):
- Packages to regions without a special box use a plain cardboard box.
- The shipping log itself stays flavor only.  Stonks carry the score.
- ~~Open: Stonks is both the shipping currency and our line on the ticker.~~  Settled 2026-11-15: Stonks is only our line on the ticker.
- Open: how much of a pile one successful package ships, now that box sizes no longer set it (for example a fixed share of the stack, or all of it down to the display copy).  Settled 2026-11-15: there are no spendable Stonks, so a failure only moves the ticker lines.  The ticker notes still call for recoverable mistakes and no losses that stack forever.
- The rune tracing game needs to work with a finger on phones as well as a mouse.

**A shift on the Packing Line (Nathan, 2026-11-15, decided)**

1. The player enters the shipping lane and pulls a chain or presses a button.  The shipping door opens.
2. A truck slides in through the door with its shipping agent (the driver), and three work orders appear on the order board.
3. The truck, the driver, or both can be fake (TNP Corp), and a work order can be fake.  The game gives plenty of clues.  Work orders and drivers are handled separately (Nathan, 2026-11-22; see Work orders and drivers below).
4. The player approves or denies each work order, fills the approved ones, and hands them to the driver.
5. Once done, the game does the math: each delivery succeeds or fails based on the complications in play.

Settled the same day (Nathan picked each):

- **The room (Nathan's sketch):** supplies live in a drawer that pulls out from the left; the junk comes from the conveyor belt (tap it and an item menu pops up); a pull-down supply list holds the rules and the Breakable, Soft, and Heavy chart; the Report Card and Log hang under STONKS.  Full layout in [art-style/PACKING-LINE-ASSETS-v0.3.md](art-style/PACKING-LINE-ASSETS-v0.3.md).

- **One region per truck.**  Each region has its own truck and driver, and all three orders on a truck go to towns in that region.  The town line on each order is the reading challenge.
- **Fakes start after the first few shifts.**  Players learn the packing first.  Fakes start with one picture tell, and more tells come later.
- ~~Both fake mistakes move the ticker; dismissing a real driver is a small dip and a replacement driver comes in.~~  Replaced 2026-11-22 by the rules below.

**The room is only the Packing Line (Nathan, 2026-11-23, decided)**

- **The factory rests while the player is in the Shipping view.**  No shinies, no Wild Magic, no Clone Attack alert, no hunt, no producer or special pop-ups.  "All factory work should stop when in the shipping lane, just as if a person is away.  The screen will fill up too much for what they are focused on."
- **Counted as away (Nathan, 2026-11-23, option A):** time in the room is credited on leaving through the existing offline catch-up, so packing never costs production.
- **Future producers stay out of the room too (Nathan, 2026-11-23).**  Every producer, event, and pop-up added later follows the same rest rule.
- **The phone screen holds still in the room (Nathan, 2026-11-23):** no page scroll, bounce, zoom, or view swipe under the player's hands.  Desktop is fine.
- **Leaving the room ends the day (Nathan, 2026-11-23, future enhancement):** tapping "The Machine" or "Shop Floor" mid-trip warns that this ends the day and sends off the current truck as is, scored as a hand-off.
- **Hold the trip until the day ends (Nathan, 2026-11-23, future enhancement):** the truck, driver, orders, and packed boxes wait for the player to come back.  The warning comes first and states what leaving does today; holding the state is the later change, and the warning retires with it (Nathan, 2026-11-23).
- **The package has the stage.**  The driver is flavor behind the flow of the game, so the box and other packing pieces may cover him.
- **Placement is tested per region.**  The Gnomerica truck and driver are approved on desktop and phone.  Later drivers are slightly taller and each truck has small differences, so each new pair gets its own placement pass.

**The driver's moods (Nathan, 2026-11-22, decided)**

- **Drivers always show up grumpy.**  The grumpy pose (arms crossed, standing) is how every driver waits while the player packs.  "A grumpy driver?  there is something real about that."
- **A successful delivery turns him around:** on a good report card he gives a thumbs up (the happy pose), smiles, and drives away.
- **No negative reaction.**  A bad report card shows no new pose; he stays grumpy and leaves.
- **The leaning pose is retired,** so the driver can stand wherever he fits.  It solved the lean problems found in 1b to 1b.2 (leaning on air, a foot in the bench).
- The elf imposters follow the same rule: grumpy while waiting, happy on success (Claudia's draft, approved by Nathan 2026-11-22).

**Work orders and drivers (Nathan, 2026-11-22, decided)**

Work orders and drivers are two separate calls.

- **Work orders are approved or denied.**  Each slip on the order board gets the APPROVED or DENIED stamp (it starts big and lands with a BAM).  A fake work order is the normal slip with a glitter effect.
- **Any driver is sent away with the door chain.**  Closing the door sends the driver away.  There is no separate send-away control.
- **A real (GRIP) driver** who leaves with all their work orders done is good.  Sent away without all their work orders: a Stonks hit (our line down).
- **A fake (TNP) driver** sent away: a small hit to TNP (their line down).  Completing work orders for a fake driver is bad (our line down, theirs up).
- **Stamp scoring (Claudia's draft, approved by Nathan 2026-11-22):** stamping APPROVED on a real order and DENIED on a fake order are the correct calls; denying a real order counts as unfilled (❌), and approving a fake order counts as a TNP win.
- **After a driver is sent away (Nathan, 2026-11-22):** the player can open the door again and gets a random driver again.  **No more than 2 TNP drivers in a row** (the limit lives in `js/config.js`).
- **A report card after the truck leaves,** Papers Please style.  Each order gets a ✅ or ❌ with a picture of why, so kids learn from their mistakes.
- **The label is the reading challenge** (Cat Mail Co. style).  An order shows the town, and the player has to know which region that town is in to pick the right region stamp.  Players learn the map by shipping.
- **No clock.**  A shift ends when the player closes the door: the truck leaves, the report card shows the score, and the next day starts.
- **Closing early is allowed and costs.**  Any order not filled when the door closes is unfulfilled and gets a ❌ on the report card.  Opening and closing the door over and over just tanks our Stonks.

**Purchase orders and the order board (approved 2026-11-15; details approved by Nathan 2026-11-22)**

- **Order board:** a truck brings 3 work orders, each from a trading place in an unlocked region.  The player fills all three.
- **What an order asks for (the randomizer):** items are drawn only from that place's Factory Imports (plus any Bathroom item, since every place buys those), and only from piles with more than 1 on the shelf, so every order can be packed.  Gnomerica orders ask for 1 item, because Gnomerica is the first tier (Nathan, 2026-11-22); later regions ask for 2 or 3; Gnonmoon must be exact.
- **Packing:** dragging a shelf tile onto the box puts the whole pile in, down to the display copy.  The label happily reads "1,700,000 Poop Knives."
- **Rotation:** a pile just shipped sits at 1, so orders skip it until it grows back.
- **Score:** each correct order lifts our Stonks by an amount set by region difficulty, never by pile size.
- **Reading a slip (approved 2026-11-22):** the order board shows the three slips small; tapping one opens it full size to read.  The region stamp corner stays visible at small size.

**Ideas on the table (drafts, build in this order)**

1. **Core:** Open and Close, drag to box, Stonks, stop at 1.
   - **Stamps are a mechanic and cost nothing** (2026-11-15).  Once regions exist, each region needs its own stamp, and a wrong stamp sends the box back.  TNP fakes carry Christmas-looking stamps (snowflakes, holly).  A region's stamps arrive free when it unlocks.
2. ~~**Stonks shop:**~~  Dropped 2026-11-15 (Nathan): Stonks is never spent, so there is no shop, Packing Gnome, faster belt, or wider door.
3. **Orders:** customers ask for specific items ("The Wizard Academy needs 2M Magic Wands", "The Banana Monster wants every banana you have").  Rewards found only here: order-only collectibles, stamp bonuses, maybe hats.  Gives the 96 junk items a purpose beyond counting.
4. **TNP Corp (The North Pole Corp):** the rival, a corporate North Pole that runs itself while the big guy sleeps.  Santa is never named.  Papers Please style checks:
   - ~~A height chart on the dock wall~~ dropped 2026-11-22 (Nathan): the elf imposters are obvious without one (curly bell shoes, fake beard on a string, striped sleeves, a Santa hat peeking out).
   - Fake trucks (decided 2026-11-20): each region's truck painted green with that region's art taped on as torn posters.  Gnomerica's fake is the crude first try on purpose (the red truck with green paint splotches and candy-cane wheels).  ~~Mudflaps, hoofprints, N0RTH plate~~ replaced.
   - Fake paperwork (decided 2026-11-22): the normal work order with a glitter effect drawn by code.
   - Picture tells first, so a 6-year-old can play without reading.
5. **The stock ticker:** a screen with two lines, GRIP vs TNP Corp.  The second game's goal is keeping our line above theirs.  Getting fooled or missing orders pushes TNP up, clean shipments push ours up.
   - A scoreboard only: players never buy, sell, or bet on shares (the default no-gambling rule; Jarrett can override it, since the game is his).
   - TNP moves only while the player works shifts, so nobody comes back to a lost lead after being away.
   - Mistakes are recoverable (a meter that clean shifts push back down), avoiding losses that stack forever (approved by Nathan 2026-11-22).
   - The ticker is drawn by code inside the STONKS screen painted in the room (Nathan, 2026-11-22).
6. **The Daily Cog:** a newspaper between shifts carrying the war story (TNP buys the bolt supply, a defector reindeer, the Megagnome guarding the dock).  Masthead art approved 2026-11-22.  Claudia's draft of its jobs, in order: introduce a newly unlocked region's rule, recap the last shift as a headline, carry the GRIP vs TNP story.

**Done 2026-11-15:** our company is **GRIP** (Gnuma Gnuma Regional Independent Parcels), and the lore, map, and region stamps are in.  Formerly waiting on Nathan and Mara for these.  Regions feed the shipping labels (where stock goes) and the Tiny Monster info cards (where monsters live), so the shelf, the maps, and the dock share one world.

**Earlier idea, replaced:** a truck every few minutes with a fixed number of boxes, paid per box in seconds of production.  Dropped once draining the shelf became the point.

## What ships, and future enhancements (Nathan, 2026-11-15)

**Decided:** only the 96 junk items ship on the order board.  **Legendary Treasures never ship;** they are trophies and stay on the shelf.  (The Crafter's Mines' Diamond Pickaxe import was swapped for a Ladder in gazetteer v0.26.)  **Tiny Monsters and Number Twos** ship later, through special orders.

**Future enhancement pass (later, not part of the Packing Line core):**

- **Special orders:** rare requests for a specific Tiny Monster or Number Two.  Alex's canon (the factory's extra creatures end up in Gnomadica's forests) supports Tiny Monsters going back to their home region, perhaps through a sanctuary or Dr. Quartz.  This matters more once the Tiny Monsters get their unique pass (one design per monster).
- **Number Twos chemistry game with the Gnome Cloner (Nathan's idea):** a small chemistry game that uses Number Twos as components.  The results ship to Gnomish Farms for Stonks.  This likely absorbs the proposal's Alchemy Cauldron, which already overlapped the Cloner.
- **Tiny Monster breeding (Nathan's idea, after the unique pass):** a breeding game, with the Gnomish Farms supplying rare monster food for it.

## Tiny Monster info card

**Decided:** tap a Tiny Monster on the shelf to open an info screen with the art big, its name, and lore.  No owned count (the tile shows it).

**Ties to the Packing Line:** the region maps Nathan and Mara are making can say where each monster lives, and the same regions feed shipping labels.

**Needs first:** a Gnomeworks lore bible (the machine, the factory, where Tiny Monsters come from, what makes a form glowing, goopy, or evil), written with Nathan before any per-monster entries.  Could extend to junk and Number Twos later.

## Gnomopedia

**Discussion stage (2026-11-03).**  A Gnomopedia in the style of the Mass Effect codex: players who want to know more can tap and read, and players who just want to click never have to.  Sections: Tiny Monsters (the shelf info card), hunt creatures (Alex's), regions, junk groups, the factory, and TNP Corp.  Writing lives in [lore/](lore/README.md).

## Rogue Gnome (Jarrett's idea)

**Talked through, not approved.**

- A pickpocket, very different from the Warrior.  A new dummy that looks like a person: a posh burlap "mark" in a top hat with a fat coin purse.
- He boosts the odds of higher-tier machine drops all the time, and the odds on shinies **only when you tap them**, so idlers can't farm Legendaries.
- Art: Rogue sneaking and reaching poses, the mark standing and the mark with the purse lifted (coins popping, monocle flying).

## The math pass

One pass over the numbers: the Packing Line plus mid-to-late pacing (two days of light play reached 20B and every Wizard upgrade at once).  More producers (#7 to #12) will soak up some of that.

## Smaller ideas

| Idea | Status |
| --- | --- |
| Evil skin (red skies, corrupted gears) as an unlockable or an October event, separate from Night | Idea |
| Holiday banners (Santa in the night sky, a dragon on the mountain), switched by month like the hats | Idea; Mara keeps the logo and counter areas clear |
| "Voices by Alex" credit in Info | When Alex records more sounds |
| Turn events off entirely (a "no Clone Attacks" switch) | Offered, not asked for; would cost those players the rewards |

## Bortho, the Clockwork Gnome (future)

Nathan's request, 2026-11-08.  **Queued behind the Packing Line.**  Nothing built.

**Nathan's words, as given:**

- A clockwork gnome named **Bortho** (first written as Borth; corrected 2026-11-08), a producer.
- His mini-game is a **cog match game**.  The machine stops and breaks; you play a game to remove the broken cogs and put in the correct cog.
- A wrong cog would break for cogs.
- It plays on a different screen from the main machine, which only has 3 cogs.

**How a wrong cog works (Nathan, 2026-11-08):**

- Example: a line of 6 cogs, and one breaks.
- Put in a cog that's **too big**: it breaks, and it breaks the cogs around it too.
- Put in a cog that's **too small**: nothing happens, and you have to replace it again.
- The right size fixes it.

**More decisions (Nathan, 2026-11-08):**

- **The whole machine breaks down** until the player fixes it.
- **It only goes off while the player is present** (for example, tapped the gear recently), so nobody comes back to a dead machine.
- **Cogs are told apart by size and color.**  Size alone still works for color-blind players.
- **Art:** Mara makes an image with the outlines of the right cogs, in their colors and sizes.

**Overlaps to settle (Jarrett's proposal list):**

- Bortho looks like he could take the **Clockwork Chrononaut** slot (producer #11, 750B) or a slot of his own.
- His mini-game sounds close to **Gear Jam** from the proposal mini-games.  Bortho's cog match may be Gear Jam with a name and a face.

**Open questions:**

- What triggers a break: a random event like Clone Attack, or something Bortho's count affects?
- How many cogs break at once, and how many sizes and colors are in play?

## Gnome Engineer (future, Jarrett's request)

Requested by Jarrett, the game's owner, 2026-11-08.  **Queued behind the Packing Line, and after Bortho** (his failure sets off Bortho's breakdown).  Nothing built.

**Jarrett's words, as relayed:** a **Gnome Engineer**, with a mini-game: **turn valves until heat dissipates.**

**Decided (Nathan, 2026-11-08):**

- He **replaces the Boiler Stoker** (producer slot #8, 20M on the proposal list).
- **Heat builds from water pressure over time.**
- If the heat isn't let out, it sets off an **immediate broken cog event** (Bortho's breakdown).  So Bortho must exist first.
- Valves turn with a **circle drag**.
- It **can go off while the player is away.**  Players coming back after a while find a rush of events waiting, the steam boiler among them.
- The boiler **idles for a few minutes before it breaks something,** so a player facing several events at once has time to deal with them.

**Claudia's reading, to confirm:** the few-minute countdown starts when the player comes back (or when pressure maxes out while they're watching).  If it ran while they were away, a long absence would always end in a breakdown on arrival.

**Note (corrected 2026-11-08):** a rush on return already happens.  If the game stays open in a background tab, every event timer keeps counting, so Wild Magic, a Clone Attack, and a shiny all come due and fire together when the player looks again (Nathan sees this after about 12 hours).  The boiler joins that rush.

**Still open:**

- How many valves, and how far each must turn.
- How fast pressure builds, and whether more Engineers make it slower or faster.
- How the boiler and Bortho's breakdown feel different: Bortho is a matching puzzle, so the Engineer could be about speed and juggling valves.

## Far future

Ideas with merit that are parked until the game is further along.  Not planned, not scheduled.

| Idea | What it needs | Notes |
| --- | --- | --- |
| Robot badge on the leaderboard: players with more than 5 ON STRIKE catches get a 🤖 next to their name (Nathan, 2026-11-08) | Jarrett's accounts and leaderboard | Claudia's draft tweaks: count only catches from draft.66 on (Nathan's own save shows 4 from the touchy pre-fix check), count strikes and never Taking a Break, treat it as a joke badge since the count lives in the player's save.  **Decided:** a full season reset clears it.  **Dev tag:** Nathan, as the dev, carries every tag plus his own: his flaming book Prometheus symbol (art when the leaderboard is built). |
| Lore narration: a small play button at the end of each Gnomopedia entry that reads it aloud | An ElevenLabs build and subscription (or recorded voices), audio files per entry | Added 2026-11-03.  Entries stay plain English for Elana to read; narration would be an extra. |

### Beyond GitHub

Added 2026-11-07.  Gnomeworks is meant to become a full game for the shop one day, and GitHub Pages has limits that will matter then.  (OMNISLATE stays on Pages for good, because it will only ever be a table prop.)

| Limit | GitHub Pages today | Why it matters for Gnomeworks |
| --- | --- | --- |
| Site size | 1 GB per published site; 1 GB recommended per source repo.  Each repo gets its own 1 GB. | Art, sound, and music only grow.  The repo was about 16 MB on 2026-11-07. |
| Bandwidth | Soft limit of 100 GB per month | A game shared beyond the shop could pass this.  OMNISLATE never will. |
| Builds | Soft limit of 10 builds per hour when deploying from a branch | A heavy push day could stall deploys.  A GitHub Actions workflow removes this limit. |
| Allowed use | Not for running an online business, e-commerce, or commercial SaaS | If Gnomeworks ever sells anything or takes payments, Pages is the wrong home. |
| Deploy timeout | 10 minutes | Only matters for a very large site. |

**Options to weigh when the time comes** (Claudia's drafts, nothing decided):

- Cloudflare Pages: free tier with generous bandwidth.  25 MB cap per file.
- Large media (music, video) moved to object storage such as Cloudflare R2, with the game files staying small.
- The Cheese Block behind a Cloudflare Tunnel, if the game ever needs server-side saves or accounts.
- The Wix "Embed a site" element keeps working wherever the game moves, as long as it has a URL.

Source: [GitHub Pages limits](https://docs.github.com/pages/getting-started-with-github-pages/github-pages-limits)
