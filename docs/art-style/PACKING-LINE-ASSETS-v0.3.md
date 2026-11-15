# Packing Line asset list, v0.3

**Status: handed to Mara (Nathan, 2026-11-15).**  v0.2 added Nathan's answers on the truck view, imposters, layouts, and supplies.  v0.3 follows Nathan's room sketch: a supply drawer, a conveyor for the junk, and new props.  Mara is building a checklist to step through each asset; individual designs still go through Nathan's visual approval.  Every asset follows the [Art-Style Bible](../ART-STYLE-BIBLE.md) and gets its own brief from the [template](ASSET-BRIEF-TEMPLATE.md).  Final pixel sizes are set at build time; this list fixes **what** gets made and **in which order**.

**Production tracker:** [Packing Line art production checklist](PACKING-LINE-PRODUCTION-CHECKLIST.md).  Every item stays unchecked until Nathan approves the finished result, including any GIMP cleanup.  Visual approval does not authorize game integration.

The game design behind this list lives in [DESIGNS.md](../DESIGNS.md#packing-line).  Region stamps and colors are in [lore/regions.md](../lore/regions.md).

## How the list is organized

- **Tier 1** is everything the core shift needs: real trucks, three work orders, packing, stamps, stickers, the report card, and the GRIP line on the ticker.
- **Tier 2** is TNP Corp: fake trucks, fake drivers, fake paperwork.  Fakes start after the first few shifts, so Tier 2 can be painted while Tier 1 is being built.
- **Tier 3** is flavor and later layers.

**Text is never painted into the art.**  Town names, order lines, item names, and numbers are drawn by the game on top of blank paper, so one painting serves every order.

**Layouts (Nathan, 2026-11-15):** desktop, tablet, and phones held sideways share one wide packing room.  Phones held upright get their own tall room.  Both carry the same fixtures in the same roles.

**Night twins:** large backgrounds and fixtures (the room, the door, the board) need a night version with identical geometry, as with every other scene.  Small props and stickers work in both themes.

## Room layout (Nathan's sketch, 2026-11-15)

Mara's layout reference: [references/packing-room-sketch-v2.jpg](references/packing-room-sketch-v2.jpg).  Wide layout, left to right:

- **Left: the supply drawer.**  A panel that pulls out from the left with its menu bar on its right edge.  Inside, in rows: the 4 boxes, bubble wrap and peanuts, **10 sticker slots**, **10 stamp slots**, and "other stuff" (bug spray, dog toy, Idol).  Supplies are icons in slots, so nothing is baked into painted shelves, and slots fill in as regions unlock.  The open drawer must leave the bench clear.
- **Behind the panel:** a gnome's **computer** and their **lunch, with a red herring in it** (Gni's secret alternate; nobody tells the player).
- **Back wall:** the **work orders** board (top left), the **map** (below it, large enough to read), **STONKS** with the GRIP and TNP lines (top right), and the **Report Card** and **Log** hanging under STONKS.
- **Center: the packing bench.**
- **Front, below the bench: the supply list,** a pull-down reference to click.  It holds the region rules and the Breakable, Soft, and Heavy chart.
- **The conveyor:** click the conveyor belt and a menu of the junk items pops up to drag from (Nathan).  This keeps the room free of an item strip.  It is the same belt that carries items out of the factory.
- **Right: the roll-up door,** where the truck and driver show up.  **The shrub** sits by the door.



### The room

| # | Asset | Notes | Night twin |
| --- | --- | --- | --- |
| 1 | **Packing room backdrop, wide and tall** | Follows the room layout above: the cabinet the drawer slides from on the left, the back wall with blank frames, the bench, the conveyor, the roll-up door on the right, and the shrub by the door.  Leave clear space where packing happens. | Yes |
| 2 | **Shipping door, closed and open** | A roll-up dock door that pulls up, same frame in both states.  When open, the frame shows only the back of the truck. | Yes |
| 3 | **Pull chain** | Separate from the door, so it can swing when pulled.  This is the Open and Close control. | No |
| 4 | **Order board** | Brass-trimmed board that holds three work orders. | Yes |
| 5a | **Supply drawer** | The pull-out panel with its menu bar and empty slot rows.  Slots are filled by the game with the supply icons. | Yes |
| 5b | **Conveyor belt** | Where the junk arrives.  Tapping it opens the item menu. | Yes |
| 5c | **Computer and lunch** | Behind the drawer panel.  The lunch holds a red herring the player can drag out (it doubles as #19's fish). | No |
| 5d | **Supply list** | The pull-down reference below the bench, rolled and unrolled. | No |
| 5e | **Report Card and Log hooks** | Clipboards or hooks under STONKS where the report card and shipping log hang. | No |
| 5 | **Wall map** | A compact, textless Gnomadica map in Mara's style for the packing room wall.  Region washes in the stamp colors with each region's stamp symbol on it.  The game draws town labels on top, so it stays readable and matches the master map.  This is the player's reference for which town is in which region. | Yes |

### Paperwork

| # | Asset | Notes |
| --- | --- | --- |
| 6 | **Work order** | A blank purchase order slip (paper, brass clip or pin).  The game writes the town and the items. |
| 7 | **Address label** | A blank shipping label.  The game writes the town. |
| 8 | **Paw-in-a-heart mark** | The dog guy's mark on a Gnonmoon work order.  Small, clear at phone size. |
| 9 | **Report card** | A blank sheet with three rows.  The ✅ and ❌ marks and the "why" pictures reuse the stamp, sticker, and box art, so nothing new is needed for reasons. |

### Boxes

| # | Asset | Notes |
| --- | --- | --- |
| 10 | **Plain cardboard box** | Open and closed (taped). |
| 11 | **Temperature-controlled box** | Open and closed.  Gnafrica and Gnonmoon. |
| 12 | **Water-resistant box** | Open and closed.  Slanic, Slaanilok, Gnufoundland. |
| 13 | **Wooden crate** | Open and closed.  Shen Shin, who are insulted by anything less. |

### Stamps, stickers, and supplies

| # | Asset | Notes |
| --- | --- | --- |
| 14 | **Region stamps x10** | Mara's repaint of [region-stamps-v0.1](../lore/stamps/region-stamps-v0.1.png): one color and one symbol each, no names, no Christmas shapes. |
| 15 | **Packing supplies** | Bubble wrap, and packing peanuts (the cornstarch kind).  See "Correct supplies" in DESIGNS.md. |
| 15a | **FRAGILE and HEAVY stickers** | Go on the outside of a box that holds a breakable or a heavy item. |
| 15b | **Breakable, Soft, and Heavy icons** | Three small icons for the item tiles and the chart in the menu that explains them. |
| 16 | **Safety sticker** | Gnohio onward, 5 to 10 per box.  Two or three designs so a box doesn't look stamped by a robot. |
| 17 | **Wireless tracker** | Gno Dao Cradle onward. |
| 18 | **Red Herring sticker** and **Shrubbery sticker** | Gni. |
| 19 | **A red herring fish** and the **shrub by the door** | Gni's secret alternates.  The fish lives in the lunch behind the drawer panel.  The shrub is part of #1 but also needs a separate copy the player drags into the box. |
| 20 | **Bug repellent can** and **spray cloud** | Slaanilok and Gnufoundland. |
| 21 | **Dog toy** and **Idol gift** | Gnonmoon's gift slot. |
| 22 | **Anti-demon rune** | Gnonmoon.  A few simple rune shapes as tracing guides, plus a glowing "done" version.  The tracing itself is code. |

### Trucks, drivers, and GRIP

| # | Asset | Notes |
| --- | --- | --- |
| 23 | **GRIP logo** | A little gnome hand gripping a parcel or a gear crank.  Goes on trucks, uniforms, the ticker, and The Daily Cog. |
| 24 | **Trucks x10** | **Rear view, backed up to the door,** framed only by the open doorway (Nathan, 2026-11-15).  Each in its region's color with the GRIP logo.  Gnomerica's truck comes first; the rest follow the unlock order. |
| 25 | **Drivers x10** | One per region, from that region's people (for example a Gnomerica gnome, a Gni knight, a Slaanilok lizard folk driver, a Gnonmoon dog folk driver).  The driver slides in and stands beside the truck, leaning on it or standing next to it.  Poses: waiting, and happy or grumpy for the report card. |
| 26 | **Stock ticker frame** | A brass ticker screen.  The game draws the GRIP and TNP lines inside it. |

## Tier 2: TNP Corp

| # | Asset | Notes |
| --- | --- | --- |
| 27 | **TNP Corp logo** | Corporate North Pole.  The big guy is never shown or named. |
| 28 | **Fake truck tells** | Overlays painted to fit the real trucks' rear view: candy-cane mudflaps, hoofprints, jingle bells, a N0RTH plate, holly trim.  A fake truck is a real truck plus one to three tells, so no extra trucks are needed. |
| 29 | **Elf imposters x10** | One for each region's driver, each fully painted (Nathan, 2026-11-15).  Keep the elf tells consistent across all ten (pointed ears, curled shoes, too tall for the height chart) so kids learn them once. |
| 30 | **Height chart** | Painted on the dock wall, or a separate overlay on #1.  Gnomes are short; anyone past the line is an elf in a borrowed hat. |
| 31 | **Fake paperwork** | Snowflake and holly stamps, and a candy-cane border for fake work orders. |
| 32 | **Send-away control** | The way to dismiss a fake: a big brass lever or a REJECTED stamp. |

## Tier 3: flavor and later

| # | Asset | Notes |
| --- | --- | --- |
| 33 | **Throw-ins** | Three to five silly grabbables (a rock, and so on).  They do nothing; the shipping log can react. |
| 34 | **Box variations** | Cosmetic versions of the four boxes. |
| 35 | **The Daily Cog masthead** | The newspaper between days. |
| 36 | **Shipping log page** | Paper for the ten-line journey log.  (Its hook on the wall is #5e, Tier 1.) |
| 37 | **The dog guy** | The kissy, lovable dog folk recipient, for his orders and the log. |
| 38 | **Region pictures** | One per region for the Gnomopedia and the expedition return story. |

## Not Mara's (for the record)

Sounds for the door, the chain, tape, the stamp thunk, the truck horn, and TNP's jingle come from Nathan and Alex.

## Answered (2026-11-15)

1. Trucks: rear view, backed up and framed by the open door; the driver slides in beside it.  The room is angled with the door on the right, and the door pulls up.
2. Elf imposters: ten, one per region.
3. Layouts: one wide room for desktop, tablet, and sideways phones; a tall room for upright phones.
4. Supplies: bubble wrap and cornstarch peanuts, Breakable, Soft, and Heavy item tags, FRAGILE and HEAVY outside stickers, and a chart in the menu.  Rules drafted in DESIGNS.md.
