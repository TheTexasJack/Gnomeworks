# Packing Line art production checklist

**Working tracker, started 2026-11-15.**  Source of truth for scope and order: [Packing Line asset list v0.3](PACKING-LINE-ASSETS-v0.3.md).  The source list remains a design draft; this tracker records visual production and Nathan's individual approvals.  Use [the Art-Style Bible](../ART-STYLE-BIBLE.md), [frozen reference gallery](REFERENCE-GALLERY.md), [asset brief template](ASSET-BRIEF-TEMPLATE.md), [art pipeline](../ASSETS.md), [Packing Line design](../DESIGNS.md#packing-line), and [region stamp palette](../lore/regions.md#region-stamps-nathan-2026-11-15).

**Progress:** **8 of 45 work packages approved** (01 to 38, plus 05a to 05e, 15a and 15b).  **Approved:** 01 (four room layouts/themes), 02 (eight open/closed door states), 03 (draw chain), 05a (neutral blank supply menu master approved after Nathan's GIMP/rotation simplification), and 10–13 (four closed/open box pairs).  Box masters and completed GIMP assets are in Nathan's custody/conversation; visual approval does not authorize game integration.  **Still pending:** 04 order board, 05 wall map, and other unmarked entries.  Nathan used GIMP to reconcile door geometry and to add a behind-the-rim lid on the wooden crate.  The shrub was separated from room art for future interactive reuse.  (Claudia, 2026-11-15: 05a to 05e and the 01 and 19 updates come from Nathan's room sketch in asset list v0.3; layout reference [references/packing-room-sketch-v2.jpg](references/packing-room-sketch-v2.jpg).)

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

- [x] **01. Packing room backdrop, wide and tall.  All four variants visually approved by Nathan 2026-11-15.**  Left-side computer and red-herring lunch (supply menu is a separate overlay), back wall with blank frames for work orders/map, brass-framed dark STONKS screen and report/log hooks, central clear bench, bottom conveyor, corrected recessed/flush roll-up dock door at right, and shrub by door.  Day/night wide masters include Nathan's matching existing banner scenery through the round window.  The portrait pair preserves the same roles in a tall composition.
  - [x] Wide daytime room (desktop, tablet, landscape phone).  **Approved by Nathan 2026-11-15:** `Gnomeworks_Shipping_Floor_Day.png`.
  - [x] Wide nighttime twin, identical geometry and placement.  **Approved by Nathan 2026-11-15:** `Gnomeworks_Shipping_Floor_Night(1).png`.
  - [x] Tall daytime room (portrait phone, same fixture roles).  **Approved by Nathan 2026-11-15:** `steampunk_packing_room_interface.png`.
  - [x] Tall nighttime twin, matching portrait-day framing and fixture roles.  **Approved by Nathan 2026-11-15:** `nighttime_gnomeworks_packing_room.png`.
  - [x] Shrub placed by the door in all four approved backdrops.  Creating/validating the matching draggable copy remains a separate task under 19.
- [x] **02. Shipping door, closed and open.**  **Approved by Nathan 2026-11-15.**  All eight room states finished by Nathan in GIMP: landscape and portrait × day and night × closed/open.  The raised shutter reveals the same simple concrete loading-bay wall and floor; it is intentionally free of skyline or scenery.  Door hardware and room artwork match across state pairs.  Future truck rear will be a separate overlay.
  - [x] Closed, day, landscape and portrait.
  - [x] Open, day, landscape and portrait.
  - [x] Closed, night, landscape and portrait.
  - [x] Open, night, landscape and portrait.
  - [x] Door frame registration reconciled in GIMP in both layouts; truck remains a separate future asset.
- [x] **03. Pull chain.  Approved by Nathan 2026-11-15.**  Separate long brass-link draw chain with reddish wooden end handle; the ceiling connector was removed and the chain length approximately doubled in the approved revision.  Intended for swinging/pulling door control.  Final artwork: `long_brass_chain_with_wooden_pull_handle.png` (conversation asset; do not assume it has been integrated).
- [ ] **04. Order board.**  Brass-trimmed board with room for three work orders.
  - [ ] Day.
  - [ ] Night, same frame geometry.
- [ ] **05. Wall map: two presentations from one source. IN REVIEW (Nathan, 2026-11-15).** The geography, place names, colors and coordinates derive from Claudia's [v0.29 master SVG](../lore/map/gnomadica-map-v0.29.svg), [location JSON](../lore/map/gnomadica-locations-v0.29.json), and [seeded builder](../../tools/map/build_map.py). Build a separate *stylistic derivative* in **Gnomeworks Brasswood Cartoon**, preserving all authoritative spellings and geographic positions; never AI-regenerate the labels, coastline, roads, rivers, or pins. v0.29 remains a draft until Nathan approves canon. The cartouche on the decorative wall map uses only **GNOMADICA** and **Gnuma Gnuma and the nearby isles**. Do not put draft/version/attribution copy on the wall cartouche. Earlier generated concept maps remain unapproved.
  - [x] **05-W. Wall thumbnail/icon. APPROVED by Nathan 2026-11-15**: decorative small inset with chunky oak/brass frame, top `MAP` plaque, stylized recognizable main island and surrounding islands, bold terrain and no location lettering. Nathan explicitly said "that works." The approved generated icon is a stylized depiction, **not** a pixel-faithful cartographic source; exact geography and spelling are requirements of 05-F instead. Use same approved master across day/night unless a separately approved lighting tint is needed.
  - [ ] **05-F. Full-screen reference map**: create a wholly independent Gnomeworks art master by **forking/re-styling the v0.29 SVG**, with no changes to the Lore source files. Repaint finishes and accents in the approved Brasswood style while preserving text, exact labels, shoreline and all source coordinates. On click, display the complete map with legible place and region names, roads, rivers and markers. Desktop supports zoom; portrait phones pan horizontally and vertically. Claudia implements UI navigation.
  - [ ] **05-F visual proof (review only; not approved)**: [central-continent Brasswood SVG color/depth study](proofs/gnomadica-v029-brasswood-style-study.svg) is an independent cropped copy of the v0.29 master with preserved land geometry and labels. It tests saturated sea/land, warm paper, and raised coast treatment. This is a palette and finish experiment, not the final fully illustrated map; no work was done in Lore or the runtime. Await Nathan's visual evaluation before completing the large-map material/style pass.
  - [ ] **05-F terrain proof (review only; not approved)**: [second SVG study](proofs/gnomadica-v029-brasswood-terrain-study.svg) replaces reusable tree, pine, orchard, palm, reed, dune and crystal symbols with sculpted Gnomeworks-style symbols and adds shaded mountain/hill and volcano finishes; all source landmark coordinates and label contents remain as original. The crop includes Woods of the Elder, highlands, crystals, marsh, and Hot Fire Volcano. Assess visual quality and possible dense-forest overlap; the more complex symbols are not mobile-performance optimized.
  - [ ] **05-F readability v2 REJECTED by Nathan 2026-11-15**: [plate-based version](proofs/gnomadica-v029-brasswood-terrain-legibility-v2.svg) is **excessively intrusive**. No UI-like plates, rectangles, opaque backgrounds, or boxed labels on the map. Do not reuse this approach.
  - [ ] **05-F readability v3 IN REVIEW**: [quiet letterpress map text](proofs/gnomadica-v029-brasswood-terrain-quiet-labels-v3.svg) restores unboxed, traditionally styled map lettering. Four problem labels are slightly enlarged, darkened and given subtle parchment-colored halos only; source location and label coordinates remain unchanged. Await Nathan's visual verdict.
  - [ ] **05-F terrain variation v4 IN REVIEW**: [SVG forest and hill variation study](proofs/gnomadica-v029-brasswood-hill-tree-variation-v4.svg) uses the **v3 corrected-label SVG**, not image generation; retains all 140 SVG text elements byte-for-byte. Adds 10 tree/shrub silhouette variants to the reusable SVG symbol set (broadleaf, pines, palms, orchard) and reshapes 186 individually positioned hill glyphs into varied rounded, overlapped and occasionally rocky hillocks. Terrain and map-label coordinates are unchanged. The diffusion-rendered landscape produced after v3 is **rejected for map production** because geography and lettering drifted and names were misspelled; it is only a mood/reference image. Nathan's prior feedback: avoid identical-looking stamped trees and hills; visual review of v4 required.
  - [ ] **05-F mountain vector proof v5 (review only)**: Actual [SVG mountain-stamp insertion at Mountain of Exclusion](proofs/gnomadica-v029-mountain-symbols-on-map-test.svg) is a cropped viewport of the existing v0.29 vector map, with three source-image-traced silhouette variants replacing five original mountain glyphs at their existing peak positions. The entire source SVG text inventory (140 elements), map geometry, routes, and landmarks are unchanged; the Lore master is untouched. Separate seven-stamp detailed SVG trace sheet was created from Nathan-approved mountain art as a conversation file. V5 is a technical proof, *not yet* the final shaded high-fidelity trace integration; inspect icon scale, layering, text clearance, and actual map appearance before further production.
  - [x] **05-F Mountain of Exclusion range v6: visual direction approved by Nathan (2026-11-15)**. [30-peak SVG range proof](proofs/gnomadica-v029-mountain-of-exclusion-complete-v6.svg) uses seven mountain silhouettes with tapered outer peaks and varied overlapping sizes, replacing the original triangular peaks in the test area. Nathan viewed the rendered crop and said "Very good. These came out well." This confirms the **mountain terrain treatment and placement method**, not final approval of 05-F or production integration. Preserve original source labels/coordinates; apply consistent treatment to remaining mountain ridges after testing. All 140 source SVG text elements unchanged; Lore map untouched.
  - [ ] **05-F all-mountain-ranges v7 (IN REVIEW, 2026-11-15)**: [Full Gnomadica map SVG with stamp mountain ranges](proofs/gnomadica-v029-all-mountain-ranges-v7.svg), derived from Nathan-approved v6 Exclusion. The 30 accepted Exclusion stamps were preserved unchanged; 86 additional old triangular peaks were replaced with seven reusable mountain silhouettes (116 total). Regions covered: Gnomish Heights (25), Gnufoundland (26), Dry Ridge (13), Shen Shin (8), Slaanilok (8), Gnonmoon (6), plus approved Mountain of Exclusion (30). Snowcaps follow source where applicable; bare and warm-colored dry variants are separate SVG symbol definitions. Taper/filler/lead scales are deterministic and peaks remain bottom-anchored at original terrain coordinates. All source geographic labels remain unchanged, except the decorative cartouche was reduced to only `GNOMADICA` and `Gnuma Gnuma and the nearby isles` per Nathan's prior instructions. Legacy triangles were cleared from the mountain ranges; Giantation's special plateau shape remains separate as its own landform. Source Lore files not touched. Structural SVG QA passed (all 1403 `<use>` refs resolve, all 21 mountain symbol variants present); visual layout and actual mobile performance still require review. **Do not count Asset 05-F as approved yet.**
  - [x] **05-F crystal-field integration v8 (APPROVED by Nathan, 2026-11-15)**: [focused Crystals on the Flats preview](proofs/gnomadica-v029-crystal-field-v8-review.svg) and [complete SVG derivative](proofs/gnomadica-v029-crystal-stamps-v8.svg). Nathan approved the [eight traced crystal stamp variants](cartography/stamps/gnomadica-crystal-stamps-v1.svg) to move into the map. All **34 original crystal anchors** in the sole crystal field have been replaced using the eight source-approved true-vector SVG symbols, with staggered lead/secondary/edge sizes. Text-safe upper bound keeps crystals below the accepted unboxed **Crystals on the Flats** label. All **138 source text nodes** were preserved byte-for-byte; all 116 mountain stamps, source routes, regions and coastlines remained unchanged. QA: 34 unique crystal anchors, 8 variants used, 1403 SVG `<use>` references resolved, no active SVG scripting. Nathan visually approved the v8 crystal placement and approved proceeding to hills. No Lore master modifications.
  - [ ] **05-F mountain placement guide v0.1 (provisional)**: [Role/size/overlap and label-clearance standards](cartography/MOUNTAIN-PLACEMENT-v0.1.md) now in GitHub as a separate art-production instruction for lead (100–115%), secondary (85–100%), edge (65–85%) and filler (55–70%) peaks. Proposed values await visual test and Nathan's confirmation; preserve lore coordinates and unboxed labels. Reuse the workflow for other terrain types only after their own tests.
  - [ ] **Mobile performance validation**: no requirement to render the entire 4K x 4K map raster or a giant SVG DOM at once on phones. Optimize SVG if sufficient; otherwise prerender image tiles by zoom level and pan over them in a single coordinate system (not manually drawn region maps). Check actual phone navigation smoothness and label legibility.
  - [x] **05-F hills v10: APPROVED by Nathan (2026-11-15).** [Original distribution v9](proofs/gnomadica-v029-hill-stamps-v9.svg) replaces **all 186** old hill-arc glyphs with 7 vector silhouette variants adapted from Nathan-approved hill stamp traces. [Infill v10](proofs/gnomadica-v029-hill-fillers-v10.svg) retains all 186 base anchors and inserts **113 additional smaller hill stamps** between them, within the 12 original hill areas. Both are separate real SVG derivatives, not diffusion images. Existing mountains (116), crystal stamps, source routes, region positions, text (138 SVG nodes) and Lore files stay unchanged. Nathan reviewed the **299-hill v10 layout** and explicitly said it looks good and we can move forward. Both the seven hill shapes and the **v10 map density** are approved; v9 remains comparison history. QA: all hill references resolve, no active SVG scripting, no old simple hill arcs remaining. No further hill infill required unless later full-map QA reveals a specific collision.
  - [ ] **Artwork/registration QA**: full map preserves authoritative source geography, stamps, and correct spellings; the thumbnail is an approved simplified interpretation whose exact small features need not match pixel-for-pixel. Validate the full map's labels from source data, not generated visual lettering, and test at actual wide and portrait sizes. Nathan's approval needed before checking package 05.

- [x] **05a. Supply drawer/menu frame.**  **Approved by Nathan 2026-11-15.**  The final is a simple flat blank outer frame; Nathan simplified and rotated the generated frame in GIMP.  No painted sections, boxes, stamps, labels, or supply icons.  Claudia will render all sections, content, and text in code.  The same neutral frame can be reused for day/night and placed responsively without new background art.
  - [x] One reusable simplified blank frame master for day and night (rather than separate baked theme variants).
  - [x] Section layout, labels, slots and unlock state delegated to Claudia/code; art need not supply them.
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

- [x] **10. Plain cardboard box.  APPROVED 2026-11-15.**  Square front-facing closed/taped master and open variant with flaps folded flat against the walls; minor side-flap compression accepted for consistency.
  - [x] Open (square silhouette; no outstretched flaps).
  - [x] Closed and taped, matching general silhouette.
- [x] **11. Temperature-controlled box.  APPROVED 2026-11-15.**  Used for Gnafrica and Gnonmoon.  Closed cream-and-blue cooler with brass temperature unit; open has the lid/unit entirely removed and blue insulated cavity visible; Nathan confirmed strong alignment.
  - [x] Open (removable lid/unit absent).
  - [x] Closed, matching front and base.
- [x] **12. Water-resistant box.  APPROVED 2026-11-15.**  Used for Slanic, Slaanilok and Gnufoundland.  Olive-green case with orange gasket, brass clasps and dark reinforced corners; closed version remains master.  Final open lidless attempt accepted by Nathan as approximately 95% match, good enough for gameplay.
  - [x] Open (lid removed; Nathan accepted minor differences).
  - [x] Closed, matching overall front and base.
- [x] **13. Wooden crate.  APPROVED 2026-11-15.**  Required by Shen Shin.  Original crate retained; Nathan used GIMP to add only a small peek of a lid behind the top rim, preserving the front face.
  - [x] Open (GIMP modification, small angled lid visible at top).
  - [x] Closed (original square wooden crate).

### Stamps, stickers, supplies

- [ ] **14. Region stamps, ten.  IN REVIEW (started 2026-11-15).**  Repaint the [placeholder stamp sheet](../lore/stamps/region-stamps-v0.1.png) in Gnomeworks Brasswood Cartoon: tactile embossed/stamped-paper look, chunky readable single silhouette, restrained upper-left highlights, warm ivory perforated postage edge, matching each approved region color and symbol.  One isolated, true-alpha stamp per region, no printed names, labels, Tiny Monsters, or TNP/Christmas motifs.  Approve individually before checking their sub-items; keep the parent unchecked until all ten are approved.
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
| 01 | **Approved: all 4 layouts/themes** | Original room concepts approved.  Nathan then cleaned out the shrub and fixed open/closed door states in GIMP.  **Use Nathan's final GIMP masters at implementation**, not earlier draft backdrop names recorded here.  Earlier note: wide day 1672 × 941 and wide night 1671 × 941 before final GIMP corrections; check final dimensions directly from Nathan's files.  Shrub remains a separate interactive asset under 19. | Finalized GIMP day/night × wide/portrait masters held by Nathan; actual final filenames to be recorded at handoff.  Earlier conceptual masters: `Gnomeworks_Shipping_Floor_Day.png`, `Gnomeworks_Shipping_Floor_Night(1).png`, `steampunk_packing_room_interface.png`, `nighttime_gnomeworks_packing_room.png`.  Art approval only, not integration authorization. | **2026-11-15** |
| 02 | **Approved: all 8 states** | Nathan completed door opening and closing in GIMP for both layouts and themes.  Open state reveals concrete wall and floor, matching the closed-door frame without unintended room changes.  Truck rear is a separate future overlay, and no extra skyline needs to be painted. | Nathan's final GIMP source files: landscape/portrait × day/night × open/closed; filenames to be recorded upon handoff, not yet pushed into runtime. | **2026-11-15** |
| 03 | **Approved** | Nathan approved the revised long brass-link draw chain with wooden handle, no ceiling connector, at roughly twice the initial length.  Isolated object; functional animation/integration remains Claudia's responsibility. | Conversation master: `long_brass_chain_with_wooden_pull_handle.png` (not pushed to runtime). | **2026-11-15** |
| 05 | **In review; wall thumbnail approved, full map pending** | **05-W approved 2026-11-15**: Nathan accepted the stylized `MAP` plaque with oak/brass frame and simplified geography as a tiny clickable thumbnail. **05-F pending**: create Gnomeworks full-detail stylistic derivative of the v0.29 source SVG, preserving exact place-name text and geography; never edit the Lore master. For phones use optimized SVG or raster tiles if necessary. Full map's cartouche: `GNOMADICA` plus `Gnuma Gnuma and the nearby isles` only. | Approved wall artwork: conversation-generated `a_high_quality_colorful_cartoon_3d_illustration_g.png` (not integrated). Full source: `docs/lore/map/gnomadica-map-v0.29.svg`, `tools/map/build_map.py`. | Full package pending |
| 05a | **Approved** | Nathan simplified the proposed blank supply drawer frame in GIMP by rotating and removing unwanted ornamental layout.  Approved simple outline only; all labels, rows and item positions are Claudia's responsibility in code.  One shared frame, no separate baked day/night art, and no edits to the approved room backgrounds. | Nathan's finalized simplified/rotated supply-frame PNG; original generation `Gnomeworks_Supply_Drawer_Blank_Frame_Day.png` is a draft, not the authoritative master. | **2026-11-15** |
| 10 | **Approved** | Square front-facing cardboard open/closed; flaps folded down to maintain almost-square shape.  Nathan explicitly accepted compressed side-flap proportions. | Conversation source: `box_plain(1).png`; approved open generated after red-line flap adjustment. | **2026-11-15** |
| 11 | **Approved** | Lid/cooling hardware removed entirely from open cooler; front and blue corner trim match the closed master and were approved as well aligned. | Conversation source: `box_temp(2).png` with approved open lidless counterpart. | **2026-11-15** |
| 12 | **Approved (~95% visual match)** | Final lidless open waterproof case accepted as good enough for gameplay; previous attempts with mismatched geometry and latches are rejected drafts.  No further generation required. | Conversation source: `box_water(3).png` and accepted final lidless rendering. | **2026-11-15** |
| 13 | **Approved** | Nathan's GIMP open state keeps original front crate pixel work and adds a small angled lid peeking behind the rim. | Uploaded `box_wood_open.png` plus closed `box_wood.png`; GIMP open master is authoritative. | **2026-11-15** |
| 14 | **In review** | Using Nathan's 10-icon sample sheet only as the color/symbol reference; re-render each stamp with ivory perforated edge and polished dimensional Gnomeworks finish.  Work starts with Gnomerica (gold gear).  All ten remain unchecked pending Nathan's approval. | User supplied `Stamps_Sample.png`; canonical colors and glyphs: `docs/lore/regions.md` | Pending |

**Preflight questions to resolve when reached:** The source list puts the dog toy in Gnonmoon's gift slot, while DESIGNS.md also calls for a dog toy/treat with Gnufoundland shipments.  Confirm reuse or separate treatment at package 21.  The master world map is still under review, so package 05's final geography must be checked against the accepted map.  The exact fixed lettering approach for stickers/brands/controls and the choice of package 32's control are brief-level decisions.  No silent changes to the supplied scope.

**Out of scope for Mara's art checklist:** Sound for the dock door, chain, tape, stamp, horn, and TNP jingle.  Nathan and Alex handle those.
