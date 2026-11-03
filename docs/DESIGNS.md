# Designs not built yet

Features that have been talked through but have no code.  Each one lists what Nathan **decided**, what is still **open**, and what art it needs.  Anything marked "draft" was Claudia's suggestion and is not approved.

## Megagnome and the hunt

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

Nathan's sorting game, first mini-game in line.  Discussed 2026-11-02.

**Decided**

- The player drags **one item tile** from the shelf into a box.  One drag ships a big batch.
- **Play with the math first** before building any mechanics: batch sizes, refill rates, and payouts across early, mid, and late game.

**Ideas on the table**

- Percentage per drag, raised by box upgrades (draft: Shoebox 10%, Crate 25%, Pallet 50%, Shipping Container 90%).  Pay per box, not per item, so shrinking batches don't shrink the reward.
- Junk can ship down to zero (it refills in seconds).  Rares either stay off the line or always keep one.  Leaning junk-only.
- Open from the proposal: do packed items leave the shelf counts, or is shipping free?

## Tiny Monster info card

**Decided:** tap a Tiny Monster on the shelf to open an info screen with the art big, its name, and lore.  No owned count (the tile shows it).

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
