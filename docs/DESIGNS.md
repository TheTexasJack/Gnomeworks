# Designs not built yet

Features that have been talked through but have no code.  Each one lists what Nathan **decided**, what is still **open**, and what art it needs.  Anything marked "draft" was Claudia's suggestion and is not approved.

## Megagnome and the hunt

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

The full working guide (build layers, difficulty ramp, asset list for Mara, lore inputs, mechanics to borrow) is the Claude doc "Gnomeworks Packing Line: Design and Asset Guide": https://claude.ai/artifact/Krkzpd61ihTKBBCCgLMdWT

The idea: the clicker is the farm, the shelf is the warehouse, the Packing Line is where the stock goes out.  Emptying the shelf is the point.  An empty shelf sends the player back to the gear to click more.  A shipping game grows out of the clicker.

**Decided**

- The player drags **one item tile** from the shelf into a box.  One drag ships a big batch.
- **Shipping removes items from the shelf.**  Players can sell off everything they have.
- **Every item stops at 1.**  The last one is the display copy, so collections and shelf tiles never go dark.
- **Open and Close buttons.**  Open raises the shipping door and makes the shelf draggable.  Close shuts it, and the player goes back to the clicker.
- **Destinations come from the Gnomadica map and gazetteer** (decided 2026-11-04).  Each region gets its own stamp; towns are the address line.  Early shifts check only the region stamp, later shifts check the town too.
- **Every island is its own region:** Gnufoundland, Shen Shin, Slaanilok, Gni, and Gnonmoon, alongside the five main-island regions.  Ten regions, ten stamps.
- **Regions unlock as you go:** after a set number of successful missions, the next region opens.  Gnomerica (the factory's home) is first.  Its unlock also opens that region's Lore tab entries.
- **The gazetteer's imports and exports are base values.**  The game reads a destinations file generated from the gazetteer, so lore and game never drift apart.
- **Variable needs and a market for imports and exports are held for a separate future game,** kept out of the Packing Line.
- **Region unlock by expedition (Nathan's idea, 2026-11-04, details open):** after enough successful missions, an Expedition button appears.  The player drags a few crew from the factory into a small adventure squad (mostly cosmetic) and sends them off.  About 10 minutes later the squad returns with a short story: why the region opens up, who matters there, and what they want.  The region is then unlocked.
    - **Theater, not a mini-game** (Nathan): the squad is about five adventurers from the factory.  They are not counted or spent, and sending them never touches production.
    - **Guardrails (agreed):** the timer runs while the player is away; the expedition always succeeds, and any mishaps are only funny.
    - The return story doubles as the region's first Lore tab entry, and "what they want" can become that region's first order on the order board.
    - **Unlock order (decided):** a counterclockwise spiral around the map.  Gnomerica is home.  The main island goes Gnohio, Gnafrica, Slanic, Gno Dao Cradle.  The outer islands go Gni, Slaanilok, Shen Shin, Gnufoundland, Gnonmoon.  The pattern itself is the reason.
    - **Each unlock adds a new thing to watch for and a new step in sending a package.**  Details to be worked out later.
    - **Future producers come from regions** (Nathan, 2026-11-04): a region unlock can unlock the producer that region supplies.  Gnonmoon is last, so the **Moonsmith is last** too.  The other pairings are open.
    - **Not every region brings a producer.**  A region can bring some other thing or an event, or nothing at all.
    - **Lore decides the pairing, and producer prices are balanced on their own.**  The shipping game only unlocks a producer; it does not set its price.  Balancing the two together would force placements that break the lore (like moving Mycelia's mushrooms to the wrong region).
    - **The producer list can change** to fit this structure, to make a better mini-game, or because Jarrett (or Elana) asks.
    - **Heroes are a separate, long-term idea:** named hero characters who sit in the background for lore and moments like this.  They need their own design, apart from the expedition squad, and are not needed now.
- **Shipping does not pay cogs.**  It pays its own currency: **Stonks** (Nathan's pick, ties to the stock ticker; placeholder icon 📈).
- Clone Attack on an emptied shelf stealing 1 sock is fine (and funny).
- **Math before code** still holds: stamp prices and upgrade costs get a pass before building.

**Math pass notes (2026-11-03, model at early, mid, and Nathan's day-2 numbers)**

- Paying per item at the item drop bonus is worthless: under 2 seconds of production even for a 90% drag late game.  Any per-item price has to scale with the game (for example, priced in gear turns).
- A percentage drag takes about that percentage of ~35 minutes to grow back, at every stage, because growth compounds.  Shoebox holes refill in minutes, Container holes in about half an hour.
- Shipping limits itself: nothing ships faster than the machine makes it.  The first open of a full shelf is a big one-time payout, and after that each sell-off pays for whatever built up since.
- ~~Box upgrades (Shoebox 10%, Crate 25%, Pallet 50%, Shipping Container 90%) as speed upgrades.~~  Dropped 2026-11-04 (Nathan): boxes cost nothing, and the challenge is the packing match.

**Order of work (Nathan, 2026-11-04):** finish the lore pass, then nail down the full gameplay mechanics, then make assets, then build.  No Packing Line assets get made until the mechanics are settled.  First mechanics to settle: how much of a pile one package ships, what the Stonks shop sells (if anything), and what a failed shipment does to spendable Stonks versus the ticker line.

**Shipping log (Nathan, 2026-11-04, decided; build after the core)**

- After a package ships, the player can open its **shipping log**: about **10 short entries** on how the journey went, auto-filled at random from a pool of events.  Flavor only: it changes nothing in the game.
- The pool can mix general road events with region lines (crossing Gnod Dam, a stop in Gassy Dog, a Lantern Chain ferry) and lines about the packing (a tracker pinging from the mountains, an 800 lb "light" box).  Event logic is still to be written.

**Packing complications by region (Nathan, 2026-11-04, decided; details open)**

Each region unlock adds one complication, and they stack.  Some apply to every package from then on, and some only to packages bound for that region.

| Unlocks with | New requirement | Applies to |
| --- | --- | --- |
| Gnomerica | The correct supplies in the box | Every package |
| Gnohio | Safety stickers, 5 to 10 per box | Every package |
| Gnafrica | Temperature-controlled box | Gnafrica packages |
| Slanic | Water-resistant box | Slanic packages |
| Gno Dao Cradle | A wireless tracker in the box (boxes kept getting lost in the mountains) | Every package |
| Gni | A Shrubbery or Red Herring sticker | Gni packages only |
| Slaanilok | Water-resistant box, sprayed with bug repellent | Slaanilok packages |
| Shen Shin | Wooden box; every package is weighed and gets a weight sticker (Light, Medium, or Heavy, with a made-up number: gnomes use magic, so an 800 lb box is fine) | Wooden box: Shen Shin packages only (they are insulted by anything less).  Weighing: every package |
| Gnufoundland | Water-resistant box, bug spray, and a complimentary dog toy or treat | Gnufoundland packages |
| Gnonmoon | Temperature-controlled box, a complimentary Idol gift, and an anti-demon rune traced onto the box (a simple shape-tracing game, easy with a mouse, like a Korean letter) | Gnonmoon packages |

- **The Purchase Order (Nathan, 2026-11-04):** every package comes with a purchase order that tells the player what to load.  It is the thing the player reads and matches.
- **The packing is the game (Nathan, 2026-11-04):** a match game inspired by Simon Says (the inspiration only, not its rules).  Read what the package needs, put the right things on it, ship.  **Completing the order is what counts.  Extra items do nothing, except on Gnonmoon.**
- **Gnonmoon is the final challenge: its packages must be EXACT** (Nathan, 2026-11-04).  Everything the order needs, and nothing else.
- **Boxes and packing supplies are free (Nathan, 2026-11-04).**  The factory makes them, so stock is unlimited, as in most shipping games: the point is the packing.  Every box and supply sits on the packing bench from the start and does nothing until a region needs it.
- **Hidden alternates (Nathan, 2026-11-04):** some requirements have a secret second answer that also counts, and the player is never told.  Gni accepts a Red Herring sticker or an actual red herring fish.  Gni also accepts a Shrubbery sticker or the real shrub from the corner of the room, which the player can click to add to the box (taking it changes nothing in the room).
- **Throw-ins (Nathan's idea, 2026-11-04, settle with the mechanics):** a few grabbable things around the packing room that do nothing and change nothing.  They are just fun to toss in, and the shipping log can react ("Ugh, not this guy!  He gets 10 rocks with his order!").  Extras never count against a package (decided).  The only exception is Gnonmoon, where packages must be exact.
- **By Shen Shin**, every package needs the correct supplies, a safety sticker, a tracker, a weight sticker, and the correct box for its destination.
- **The Gnonmoon gift slot (Nathan, 2026-11-04):** the dog toy and the Idol gift share one slot.  A normal Gnonmoon package (Idol gift plus the anti-demon rune) ships fine for everyone.  One recipient, the dog guy, has a special mark on his purchase order.  Spotting it and swapping the Idol for a dog toy earns a big Stonks boost, like a critical hit for noticing.  A dog toy sent to anyone else gets creative insults in the shipping log and a big Stonks hit.  The mark keeps this a skill to spot rather than a gamble.
- **The dog guy's look (Nathan, 2026-11-04):** a kissy, lovable goof who blows kisses and floats hearts, especially over anything dog.  His purchase order mark can be a paw print inside a heart.
- **The shipment score is the core mechanic (Nathan, 2026-11-04):** a successful shipment sends our Stonks up.  A failed one sends our Stonks down and TNP Corp's Stonks up.

**Packing Line asset list (draft from the complications; finalize after the mechanics pass, make nothing yet)**

- The packing room backdrop, the bench, and the shipping door.
- Boxes: plain cardboard, temperature-controlled, water-resistant, wooden (Shen Shin).
- Region stamps, one per region (ten), with each region's Tiny Monster once those are assigned.
- Supplies and stickers: safety stickers, the wireless tracker, weight stickers (Light, Medium, Heavy), the Red Herring sticker, the Shrubbery sticker, the anti-demon rune (drawn by the player).
- Gni's secret alternates: a red herring fish and a shrub in the corner of the room.
- Bug repellent spray can and its spray cloud.
- Complimentary gifts: dog toy or treat, Idol gift.
- Throw-ins: a few silly grabbables (rocks and the like).

Notes to settle when this is built (Claudia):
- Packages to regions without a special box use a plain cardboard box.
- The shipping log itself stays flavor only.  Stonks carry the score.
- Open: Stonks is both the shipping currency and our line on the ticker.  The box-size speed upgrades are dropped, so Stonks has almost nothing to buy, which makes it mostly a score.
- Open: how much of a pile one successful package ships, now that box sizes no longer set it (for example a fixed share of the stack, or all of it down to the display copy).  When a failure sends Stonks down, decide whether the player loses spendable Stonks, only the ticker line drops, or both.  The ticker notes call for recoverable mistakes and no losses that stack forever.
- The rune tracing game needs to work with a finger on phones as well as a mouse.

**Ideas on the table (drafts, build in this order)**

1. **Core:** Open and Close, drag to box, Stonks, stop at 1.
   - **Stamps are a shipping cost and a mechanic, separate from the currency.**  Once regions exist, each region needs its own stamp, and a wrong stamp sends the box back.  TNP fakes carry Christmas-looking stamps (snowflakes, holly).  Stonks can buy stamp sheets for newly unlocked regions.
2. **Stonks shop (revisit):** box upgrades are dropped.  Still on the list: a Packing Gnome that packs on his own while the door is open, faster belt, wider door.  An auto-packer may clash with the packing being the game, so this list needs a fresh look.
3. **Orders:** customers ask for specific items ("The Wizard Academy needs 2M Magic Wands", "The Banana Monster wants every banana you have").  Rewards found only here: order-only collectibles, stamp bonuses, maybe hats.  Gives the 96 junk items a purpose beyond counting.
4. **TNP Corp (The North Pole Corp):** the rival, a corporate North Pole that runs itself while the big guy sleeps.  Santa is never named.  Papers Please style checks:
   - A height chart painted on the dock wall.  Gnomes are short.  A "gnome" past the line is a TNP elf in a borrowed hat.
   - Fake trucks with picture tells: candy-cane mudflaps, a jingle on arrival, hoofprints, a plate reading N0RTH.  One tell early, two or three later.
   - Bad paperwork: items not in the catalog, snowflake stamps, shipping labels whose region doesn't match the order.
   - Picture tells first, so a 6-year-old can play without reading.
5. **The stock ticker:** a screen with two lines, our company vs TNP Corp.  The second game's goal is keeping our line above theirs.  Getting fooled or missing orders pushes TNP up, clean shipments push ours up.
   - A scoreboard only: players never buy, sell, or bet on shares (the default no-gambling rule; Jarrett can override it, since the game is his).
   - TNP moves only while the player works shifts, so nobody comes back to a lost lead after being away.
   - Mistakes should be recoverable (a meter that clean shifts push back down), avoiding losses that stack forever.
6. **The Daily Cog:** a newspaper between shifts carrying the war story (TNP buys the bolt supply, a defector reindeer, the Megagnome guarding the dock).

**Waiting on Nathan and Mara:** the name of our company, the lore, and the region maps.  Regions feed the shipping labels (where stock goes) and the Tiny Monster info cards (where monsters live), so the shelf, the maps, and the dock share one world.

**Earlier idea, replaced:** a truck every few minutes with a fixed number of boxes, paid per box in seconds of production.  Dropped once draining the shelf became the point.

## Tiny Monster info card

**Decided:** tap a Tiny Monster on the shelf to open an info screen with the art big, its name, and lore.  No owned count (the tile shows it).

**Ties to the Packing Line:** the region maps Nathan and Mara are making can say where each monster lives, and the same regions feed shipping labels.

**Needs first:** a Gnomeworks lore bible (the machine, the factory, where Tiny Monsters come from, what makes a form glowing, goopy, or evil), written with Nathan before any per-monster entries.  Could extend to junk and Number Twos later.

## Lore tab

**Discussion stage (2026-11-03).**  A Lore tab in the style of the Mass Effect codex: players who want to know more can tap and read, and players who just want to click never have to.  Sections: Tiny Monsters (the shelf info card), hunt creatures (Alex's), regions, junk groups, the factory, and TNP Corp.  Writing lives in [lore/](lore/README.md).

## Rogue Gnome (Jarrett's idea)

**Talked through, not approved.**

- A pickpocket, very different from the Warrior.  A new dummy that looks like a person: a posh burlap "mark" in a top hat with a fat coin purse.
- He boosts the odds of higher-tier machine drops all the time, and the odds on shinies **only when you tap them**, so idlers can't farm Legendaries.
- Art: Rogue sneaking and reaching poses, the mark standing and the mark with the purse lifted (coins popping, monocle flying).

## The math pass

Before the Packing Line and the Megagnome get code, one pass over the numbers: the two new systems plus mid-to-late pacing (two days of light play reached 20B and every Wizard upgrade at once).  More producers (#7 to #12) will soak up some of that.

## Smaller ideas

| Idea | Status |
| --- | --- |
| Evil skin (red skies, corrupted gears) as an unlockable or an October event, separate from Night | Idea |
| Holiday banners (Santa in the night sky, a dragon on the mountain), switched by month like the hats | Idea; Mara keeps the logo and counter areas clear |
| "Voices by Alex" credit in Info | When Alex records more sounds |
| Turn events off entirely (a "no Clone Attacks" switch) | Offered, not asked for; would cost those players the rewards |

## Far future

Ideas with merit that are parked until the game is further along.  Not planned, not scheduled.

| Idea | What it needs | Notes |
| --- | --- | --- |
| Lore narration: a small play button at the end of each Lore tab entry that reads it aloud | An ElevenLabs build and subscription (or recorded voices), audio files per entry | Added 2026-11-03.  Entries stay plain English for Elana to read; narration would be an extra. |
