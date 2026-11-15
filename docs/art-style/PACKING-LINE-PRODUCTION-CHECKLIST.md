# Packing Line art production checklist

**Working tracker, started 2026-11-15.**  Source of truth for scope and order: [Packing Line asset list v0.3](PACKING-LINE-ASSETS-v0.3.md).  The source list remains a design draft; this tracker records visual production and Nathan's individual approvals.  Use [the Art-Style Bible](../ART-STYLE-BIBLE.md), [frozen reference gallery](REFERENCE-GALLERY.md), [asset brief template](ASSET-BRIEF-TEMPLATE.md), [art pipeline](../ASSETS.md), [Packing Line design](../DESIGNS.md#packing-line), and [region stamp palette](../lore/regions.md#region-stamps-nathan-2026-11-15).

**Progress:** 0 of 45 numbered work packages approved (01 to 38, plus 05a to 05e, 15a and 15b).  Sub-checkboxes track parts of a package and do not count toward 45.  (Claudia, 2026-11-15: 05a to 05e and the 01 and 19 updates come from Nathan's room sketch in asset list v0.3; layout reference [references/packing-room-sketch-v2.jpg](references/packing-room-sketch-v2.jpg).)  **Next:** 01, packing room backdrop, wide and tall.

## Operating procedure

1. Take exactly the next unchecked numbered work package, in source order.  Define its individual brief using [ASSET-BRIEF-TEMPLATE.md](ASSET-BRIEF-TEMPLATE.md), including layers, source references, aspect ratio, perspective, game placement, registration anchors, and all variants.
2. Create art in **Gnomeworks Brasswood Cartoon / Brasswood Toybox Steampunk**.  The frozen gallery determines visual consistency.  For cutouts, keep true alpha and adequate margins.  For environments, reserve clear room for gameplay overlays.
3. Show Nathan the candidate and verify subject, geometry, material, lighting, alignment, source completeness, and phone-sized readability.  Compare day/night twins and paired poses against one another, not just separately.
4. If revisions are needed, leave the numbered package **unchecked**.  Record the fix as **Rework / GIMP cleanup**, including whether Nathan will edit in GIMP or return the image for Mara to revise.  After the corrected result comes back, recheck it before seeking approval.
5. **Only Nathan's explicit confirmation closes a work package.**  Confirm every required child, check the main box, record approval and final source locations in the review log, update the approved count and next item, and then move on.  Do not assume that an approved concept is ready for integration.
6. Raw master PNGs may remain with Nathan.  Claudia's processed WebP art, coding, live UI text, audio, and game integration are a separate handoff.  Do not push new runtime images, alter gameplay files, or tell Claudia an asset is implementation-ready without explicit approval.

**Shared quality gates:** Familiar approved style; chunky dimensional silhouette; warm upper-left lighting where applicable; crisp, readable phone-scale composition; no clipping or unintended duplicates; true alpha on cutouts; exact matched anchor points on paired frames; day/night same geometry per layout; no watermark or fake checkerboard.  Town names, order details, item names, and numbers must stay as code-rendered text.  Any fixed lettering suggested by a logo, sticker, or control gets an explicit treatment decision in its brief; default to a blank art surface with text rendered by the game.

**Meaning of a checked box:** Nathan has seen the final artwork for this exact variant or package, including any GIMP-cleaned version, and confirmed it.  A parent with incomplete required children stays unchecked.  An item can be reopened if a later integration test reveals a defect.

## Tier 1: core shift

### The room

- [ ] **01. Packing room backdrop, wide and tall.**  Follows Nathan's sketch: the cabinet the supply drawer slides from on the left, back wall with blank frames (work orders, map, STONKS, report card and log hooks), bench in the middle, conveyor, roll-up dock door on the right, and the shrub by the door.  Clear packing workspace.
  - [ ] Wide daytime room (desktop, tablet, landscape phone).
  - [ ] Wide nighttime twin, identical geometry and placement.
  - [ ] Tall daytime room (portrait phone, same fixture roles).
  - [ ] Tall nighttime twin, identical geometry and placement to tall day.
  - [ ] Shrub by the door, compatible with the separately draggable shrub in 19.
- [ ] **02. Shipping door, closed and open.**  Roll-up door, fixed frame, view through open doorway shows only the backed-in truck rear.
  - [ ] Closed, day.
  - [ ] Open, day.
  - [ ] Closed, night.
  - [ ] Open, night.
  - [ ] Door frame registration verified in both room layouts; truck remains a separate element.
- [ ] **03. Pull chain.**  Isolated, swingable chain for the Open/Close action.
- [ ] **04. Order board.**  Brass-trimmed board with room for three work orders.
  - [ ] Day.
  - [ ] Night, same frame geometry.
- [ ] **05. Wall map.**  Compact, textless Gnomadica map, region color washes and symbols matching the stamp palette and master map.
  - [ ] Day.
  - [ ] Night, same geography/geometry.
  - [ ] Space for town names rendered by code; compare against current master map before final approval.

- [ ] **05a. Supply drawer.**  Pull-out panel from the left with its menu bar on the right edge and empty slot rows (4 boxes, bubble wrap and peanuts, 10 stickers, 10 stamps, other stuff).  The game fills the slots.
  - [ ] Day.
  - [ ] Night.
- [ ] **05b. Conveyor belt.**  Where the junk arrives; tapping it opens the item menu.
  - [ ] Day.
  - [ ] Night.
- [ ] **05c. Computer and lunch.**  Behind the drawer panel; the lunch holds the red herring (see 19).
- [ ] **05d. Supply list.**  Pull-down reference below the bench, rolled and unrolled.
- [ ] **05e. Report Card and Log hooks.**  Under STONKS, where the report card and shipping log hang.

### Paperwork

- [ ] **06. Work order.**  Blank purchase-order slip with paper and brass clip/pin; live text overlays.
- [ ] **07. Address label.**  Blank shipping label; destination text overlays.
- [ ] **08. Paw-in-a-heart mark.**  Dog guy's distinctive Gnonmoon work-order mark, legible on a phone.
- [ ] **09. Report card.**  Blank three-row sheet; success/failure marks and reasons reuse existing imagery.

### Boxes

- [ ] **10. Plain cardboard box.**
  - [ ] Open.
  - [ ] Closed and taped, matching perspective and size.
- [ ] **11. Temperature-controlled box.**  Used for Gnafrica and Gnonmoon.
  - [ ] Open.
  - [ ] Closed, matching perspective and size.
- [ ] **12. Water-resistant box.**  Used for Slanic, Slaanilok and Gnufoundland.
  - [ ] Open.
  - [ ] Closed, matching perspective and size.
- [ ] **13. Wooden crate.**  Required by Shen Shin.
  - [ ] Open.
  - [ ] Closed, matching perspective and size.

### Stamps, stickers, supplies

- [ ] **14. Region stamps, ten.**  Repaint the [placeholder stamp sheet](../lore/stamps/region-stamps-v0.1.png).  Each uses one approved color and one symbol.  No region names or TNP/Christmas motifs.
  - [ ] Gnomerica: brass gold gear.
  - [ ] Gnohio: field green wheat.
  - [ ] Gnafrica: terracotta cactus.
  - [ ] Slanic: marsh teal mushroom.
  - [ ] Gno Dao Cradle: mountain purple mountains.
  - [ ] Gni: plum knight's helm.
  - [ ] Slaanilok: coral step pyramid.
  - [ ] Shen Shin: wood brown table.
  - [ ] Gnufoundland: ice blue mitten.
  - [ ] Gnonmoon: night blue crescent moon.
- [ ] **15. Packing supplies.**
  - [ ] Bubble wrap.
  - [ ] Cornstarch packing peanuts.
- [ ] **15a. Outside stickers.**
  - [ ] FRAGILE.
  - [ ] HEAVY.
- [ ] **15b. Item-category icons.**  For item tiles and the menu's explanation chart.
  - [ ] Breakable.
  - [ ] Soft.
  - [ ] Heavy.
- [ ] **16. Safety stickers.**  Used from Gnohio onward, five to ten on a box.
  - [ ] Design A.
  - [ ] Design B.
  - [ ] Optional third design if approved in the brief.
- [ ] **17. Wireless tracker.**  Used from Gno Dao Cradle onward.
- [ ] **18. Gni stickers.**
  - [ ] Red Herring sticker.
  - [ ] Shrubbery sticker.
- [ ] **19. Gni secret alternate objects.**
  - [ ] Actual red herring fish (it lives in the lunch, 05c).
  - [ ] Separate draggable shrub asset, matching the shrub by the door in 01.
- [ ] **20. Bug spray.**  Used for Slaanilok and Gnufoundland.
  - [ ] Repellent can.
  - [ ] Separate spray cloud.
- [ ] **21. Gift-slot objects.**
  - [ ] Dog toy.
  - [ ] Idol gift.
- [ ] **22. Anti-demon rune, Gnonmoon.**
  - [ ] Simple tracing-guide shapes (quantity set in brief).
  - [ ] Glowing completed version.
  - [ ] No tracing behavior painted in; interaction belongs to code.

### Trucks, drivers, and GRIP

- [ ] **23. GRIP logo.**  Small gnome hand gripping a parcel or gear crank; reusable on trucks, uniforms, ticker and The Daily Cog.
- [ ] **24. Ten real GRIP trucks.**  Rear view only, backed up to the open dock, framed by the door.  Region color and approved GRIP logo.  Confirm each from the same scene camera.
  - [ ] Gnomerica.
  - [ ] Gnohio.
  - [ ] Gnafrica.
  - [ ] Slanic.
  - [ ] Gno Dao Cradle.
  - [ ] Gni.
  - [ ] Slaanilok.
  - [ ] Shen Shin.
  - [ ] Gnufoundland.
  - [ ] Gnonmoon.
- [ ] **25. Ten real regional drivers.**  A local person from each region.  Positioned beside the backed-in truck; waiting pose plus happy/grumpy report-card reaction as determined in each brief.  Maintain identity and registration within pose sets.
  - [ ] Gnomerica driver.
  - [ ] Gnohio driver.
  - [ ] Gnafrica driver.
  - [ ] Slanic driver.
  - [ ] Gno Dao Cradle driver.
  - [ ] Gni driver.
  - [ ] Slaanilok driver.
  - [ ] Shen Shin driver.
  - [ ] Gnufoundland driver.
  - [ ] Gnonmoon driver.
- [ ] **26. Stock ticker frame.**  Brass display, blank interior for GRIP and TNP lines drawn by code.

## Tier 2: TNP Corp

- [ ] **27. TNP Corp logo.**  Corporate North Pole identity; its unnamed big boss remains unseen.
- [ ] **28. Fake truck tells.**  Modular overlays fitting the real trucks' rear camera, one to three visible per fake.
  - [ ] Candy-cane mudflaps.
  - [ ] Hoofprints.
  - [ ] Jingle bells.
  - [ ] N0RTH plate.
  - [ ] Holly trim.
- [ ] **29. Ten fully painted elf imposters.**  One for each region's driver.  Consistent tells: pointed ears, curled shoes and excessive height.
  - [ ] Gnomerica imposter.
  - [ ] Gnohio imposter.
  - [ ] Gnafrica imposter.
  - [ ] Slanic imposter.
  - [ ] Gno Dao Cradle imposter.
  - [ ] Gni imposter.
  - [ ] Slaanilok imposter.
  - [ ] Shen Shin imposter.
  - [ ] Gnufoundland imposter.
  - [ ] Gnonmoon imposter.
- [ ] **30. Height chart.**  Dock-wall painting or registered overlay; settle the treatment in its brief and check readability against real drivers.
- [ ] **31. Fake paperwork details.**
  - [ ] Snowflake stamp.
  - [ ] Holly stamp.
  - [ ] Candy-cane work-order border.
- [ ] **32. Send-away control.**  Choose the approved form in the brief: large brass lever or REJECTED stamp.

## Tier 3: flavor and later

- [ ] **33. Three to five throw-in objects.**  Define and approve the individual grabbables in its brief.  Rock is one example; shipping-log reactions are coded separately.
- [ ] **34. Cosmetic box variations.**  Define which of the four boxes and how many versions during its brief; keep their functional shapes recognizable.
- [ ] **35. The Daily Cog masthead.**  Newspaper brand for between-day presentation.
- [ ] **36. Shipping log page.**  Blank sheet accommodating ten lines of live story text.
- [ ] **37. The dog guy.**  Lovable, kiss-blowing dog-folk recipient; compatible with the paw-in-heart mark in 08.
- [ ] **38. Ten regional pictures.**  For the Gnomopedia and expedition-return story.
  - [ ] Gnomerica.
  - [ ] Gnohio.
  - [ ] Gnafrica.
  - [ ] Slanic.
  - [ ] Gno Dao Cradle.
  - [ ] Gni.
  - [ ] Slaanilok.
  - [ ] Shen Shin.
  - [ ] Gnufoundland.
  - [ ] Gnonmoon.

## Review and cleanup log

For every package, append a line when work starts or when a decision changes.  Keep the live checklist boxes above authoritative.  Suggested statuses: **Queued**, **Brief ready**, **In review**, **Rework / GIMP**, **Approved**.  The main checkbox is the definitive approved indicator.

| Package | Status | Review / GIMP corrections | Final reference / source | Nathan approval date |
| --- | --- | --- | --- | --- |
| 01 | Queued | Wide/tall day/night, fixture placement and draggable shrub alignment to review. | Pending | Pending |

**Preflight questions to resolve when reached:** The source list puts the dog toy in Gnonmoon's gift slot, while DESIGNS.md also calls for a dog toy/treat with Gnufoundland shipments.  Confirm reuse or separate treatment at package 21.  The master world map is still under review, so package 05's final geography must be checked against the accepted map.  The exact fixed lettering approach for stickers/brands/controls and the choice of package 32's control are brief-level decisions.  No silent changes to the supplied scope.

**Out of scope for Mara's art checklist:** Sound for the dock door, chain, tape, stamp, horn, and TNP jingle.  Nathan and Alex handle those.
