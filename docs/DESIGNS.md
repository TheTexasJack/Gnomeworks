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

The idea: the clicker is the farm, the shelf is the warehouse, the Packing Line is where the stock goes out.  Emptying the shelf is the point.  An empty shelf sends the player back to the gear to click more.  A shipping game grows out of the clicker.

**Decided**

- The player drags **one item tile** from the shelf into a box.  One drag ships a big batch.
- **Shipping removes items from the shelf.**  Players can sell off everything they have.
- **Every item stops at 1.**  The last one is the display copy, so collections and shelf tiles never go dark.
- **Open and Close buttons.**  Open raises the shipping door and makes the shelf draggable.  Close shuts it, and the player goes back to the clicker.
- **Shipping does not pay cogs.**  It pays its own currency (draft name: postage stamps).
- Clone Attack on an emptied shelf stealing 1 sock is fine (and funny).
- **Math before code** still holds: stamp prices and upgrade costs get a pass before building.

**Math pass notes (2026-11-03, model at early, mid, and Nathan's day-2 numbers)**

- Paying per item at the item drop bonus is worthless: under 2 seconds of production even for a 90% drag late game.  Any per-item price has to scale with the game (for example, priced in gear turns).
- A percentage drag takes about that percentage of ~35 minutes to grow back, at every stage, because growth compounds.  Shoebox holes refill in minutes, Container holes in about half an hour.
- Shipping limits itself: nothing ships faster than the machine makes it.  The first open of a full shelf is a big one-time payout, and after that each sell-off pays for whatever built up since.
- Box upgrades (draft: Shoebox 10%, Crate 25%, Pallet 50%, Shipping Container 90%) are **speed** upgrades: fewer drags to empty a pile.

**Ideas on the table (drafts, build in this order)**

1. **Core:** Open and Close, drag to box, stamps, stop at 1.
2. **Stamp shop:** box upgrades, then a Packing Gnome that packs on his own while the door is open (the factory-automation step), faster belt, wider door.
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
