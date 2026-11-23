# Shipping log lines (v0.2, Claudia's draft, 2026-11-23)

**Status:** v0.1 approved by Nathan, 2026-11-23.  **v0.2 adds "An approved fake" (below), approved by Nathan 2026-11-23.**  Written in plain, short sentences so Elana can read them (Jarrett's ask for the lore).  Gnomerica only for layer 1; each new region adds its own road lines.

Every shipped box gets its own log: about 8 entries with a clock time, picked at random from these lines.  Flavor only, it changes nothing in the game (DESIGNS, "Shipping log," 2026-11-04).  Gnomerica facts come from the gazetteer (v0.27): the Brass Road, the Central Rail, the old public clock, the Great Lunch Whistle, Cogbottom, Gnomish Farms, lamia engineers, goblin bookkeepers, brassleaf oaks, Smog Ants, Barking Mimics, and the Hootgear, Cogsnake, and Pebblem.

`{town}` is the order's town, `{item}` its item, `{count}` its count.

## How a log is built

1. **Start** (always first, 08:00).
2. **Road:** 4 or 5 lines, from Gnomerica's lines and the general lines, no repeats.
3. **Packing:** 1 or 2 lines picked from the ones that match the box (only lines whose condition is true).
4. **End** (always last): the delivery line that matches the box's result.
5. Times start at 08:00 and step 10 to 50 minutes per line.  The order is shuffled except the start and the end.

## Start

- Loaded onto the truck at the Gnomeworks dock.

## Road: Gnomerica

- Rolled down the Brass Road.  The brass roofs were extra shiny today.
- Stopped for the old public clock.  It said lunch time.  It always says lunch time.
- Crossed the Central Rail.  A train waved.  The driver waved back.
- A Smog Ant marched across the road.  Everyone waited politely.
- A Barking Mimic pretended to be a mailbox.  Nobody fell for it this time.
- A Hootgear rode on the truck roof for three miles.
- A Cogsnake curled up in the spare tire.  It got a free ride.
- Picked a Pebblem out of a wheel.  It looked a little sad about it.
- The Great Lunch Whistle blew.  The driver ate a sandwich.
- Drove past Gnomish Farms.  It smelled like breakfast.
- Got stuck in Cogbottom behind a parade of gears.
- A lamia engineer waved from the top of a steam pipe.
- A goblin bookkeeper counted the boxes twice.  Same number both times!
- The road went downhill.  Then it went downhill again.  The workers say it always does.
- Brassleaf oaks lined the road.  Their leaves jingled in the wind.

## Road: anywhere

- Flat tire!  Fixed in four minutes.  A new record.
- Took a shortcut.  It was longer.  Shortcuts usually are.
- Rain.  The driver turned on the wipers and hummed.
- Stopped for gas.  And a snack.  Mostly the snack.
- A goat stood in the road.  The goat won.
- The radio played the same song four times.  The driver sang along all four times.

## Packing (only when true)

| When | Line |
| --- | --- |
| Peanuts in the box | Hit a big bump.  The packing peanuts kept everything snug. |
| No peanuts | Hit a big bump.  Something inside went CLUNK. |
| Bubble wrap in the box | The driver heard a tiny pop.  Just the bubble wrap.  Phew. |
| FRAGILE sticker on | The driver saw the FRAGILE sticker and drove extra slow. |
| HEAVY sticker on | Two gnomes lifted the HEAVY box together.  Teamwork! |
| Heavy item, no HEAVY sticker | Someone tried to lift the box with one hand.  Ouch. |
| Soft item | The box was very squishy.  The driver used it as a pillow at a red light. |
| Count of 100 or more | {count} of them?  {town} must really need {item}. |

## End (one, by the box's result)

| Result | Line |
| --- | --- |
| ✔ Right | Delivered to {town}.  They said thank you! |
| ✔ Right (alternate) | Delivered to {town}.  A kid there did a happy dance. |
| ❌ Wrong item | Delivered to {town}.  They opened it and looked very confused. |
| ❌ No stamp | {town}'s post office sent it back to check the stamp.  It got there late. |
| ❌ Other misses | Delivered to {town}.  A little bumped, but it got there. |

## Shipped to TNP (an elf's box)

The road lines are swapped for these, and the end is always the last line.

- The truck turned north.  Gnomerica is not north.
- The driver's beard fell off at a stop sign.  He put it back on.
- Jingle bells were heard from the truck.
- Someone in the truck kept humming a holiday song.  Very suspicious.
- Last seen heading somewhere with a lot of snow.
- **End:** Delivered to... the North Pole?  Uh oh.

## An approved fake (v0.2, from the 1o review, approved)

A glitter order the player approved and packed ships on GRIP's own truck, so it gets the normal road lines, plus one of these in the middle and this end.

- The address had glitter on it.  Hmm.
- The driver checked the map twice.  The road to {town} looked a little too sparkly.
- **End:** Delivered to {town}.  But nobody there ordered it!  A gnome in a jingly hat took it.
