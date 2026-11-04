# Gnomeworks Art-Style Bible

**House style:** **Gnomeworks Brasswood Cartoon**  
**Flavor name:** **Brasswood Toybox Steampunk**  
**Style bible revision:** 1.0, November 4, 2026  
**Approval:** Nathan approved these names and the supplied example set as the visual foundation.  This document preserves those decisions.  Individual asset designs and future production specifications remain subject to review.

> **One-line visual identity:** Polished, stylized 3D-cartoon fantasy game illustration with chunky, expressive silhouettes; warm carved oak, golden brass, copper machinery, leather and selective magical light; rich saturated color; readable detail; cheerful workshop steampunk character.

**Start here on a fresh reset:** Read this document, then open the [visual reference gallery](art-style/REFERENCE-GALLERY.md).  Compare any proposed image to the actual examples before generating a new one.  For mechanical dimensions and file processing, read [ASSETS.md](ASSETS.md); for work not approved for implementation, read [DESIGNS.md](DESIGNS.md).  **The references take precedence over style adjectives.**

## 1. House-style pillars

1. **Three-dimensional cartoon illustration.**  Assets look like tactile, softly sculpted objects painted for a polished strategy/mobile game.  A 3D *appearance* is required; actual 3D models are not.
2. **Bold, toy-readable geometry.**  Large rounded masses, heavy beveled metal, stocky silhouettes, big facial features and broad movements.  Curves are confident; metalwork has reassuring physical thickness.
3. **Brasswood materials.**  Polished gold/brass, copper pipework, warm wood, brown leather, brass rivets, glass gauges and occasional glowing crystals.  The world feels assembled by enthusiastic craftspeople.
4. **Warm, joyful exaggeration.**  Gnomes are expressive, humorous and friendly.  Collectible creatures are inviting and instantly distinguishable.  An aggressive encounter beast may look dangerous without changing to a different rendering style.
5. **Readable at game size.**  Strong silhouettes and separation of neighboring forms come before micro-detail.  The image should work in a small icon as well as a larger inspection view.
6. **Controlled highlights and depth.**  Warm upper-left key light is the standard for standalone assets unless the scene demands otherwise.  Saturated accents and a clean highlight hierarchy maintain richness without noisy reflections.

## 2. House palette and materials

| Family | Appearance | Use and restraint |
| --- | --- | --- |
| **Brass** | Warm, bright yellow-gold, rounded beveled edges, amber reflections, raised rivets, slight brushed/engraved wear. | Primary trim, gear frames, clasps, machine housings, title lettering; never uniform flat yellow. |
| **Oak** | Warm honey-amber to reddish wood in day scenes; visible carved grain and chunky plank construction. | Factory architecture, signs, benches, frames; daylight wood remains clearly separate from brass. |
| **Night timber** | Charcoal to blue-black stained wood with subtle visible grain. | Environment night counterparts; preserve geometry, increase perceived warmth of metal and lamps by contrast. |
| **Copper and steel** | Rich copper-orange curved piping; dark iron/steel underparts where needed. | Mechanical connections and secondary materials.  Copper should not compete with the gold headline forms. |
| **Leather and fabric** | Tobacco-brown straps, pouches, boots, belts; thick cream sleeves, red-brown or burgundy clothing. | Character costumes and equipment.  Prefer leather thickness and clean readable folds. |
| **Magic** | Saturated cyan, electric blue, violet/magenta, emerald, or ember glow, localized to a source. | The crystal or spell is the colored focal point.  Do not flood the whole illustration with unrelated neon. |
| **Living color** | Bright orange-red hair and beards; green leaves; natural animal coats and saturated accents. | Creatures are **not required** to wear brass armor or be mechanical.  Metal can be optional, with the same rendering language. |

This is a **relative color system**, not a set of locked hexadecimal swatches.  Match the reference materials, especially brass against oak, before assigning final technical palette values.

## 3. Style families

### A. Oak-and-Brass Workshop: environments and machinery

**Anchors:** [machine-day](./art-style/references/machine-day.webp) and [machine-night](./art-style/references/machine-night.webp).

- Hefty square timber beams, deep recesses, broad brass plates, visible screws and rivets, beautifully engineered mechanisms, copper runs, gauges and glowing chambers.
- Simple planes interrupted by clusters of mechanical interest.  Strong dark/light separation makes gameplay elements legible in front of the wall.
- The day and night machines must retain **identical geometry, alignment and attachment positions** whenever used as paired assets.  Lighting and wood finish may change; mechanical locations do not.
- Day reads warm and inviting.  Night reads dark, cozy and luminous, not monochrome or horror-themed.
- Backgrounds have negative space for overlays and responsive UI; do not fill every surface with decoration.

### B. Gearfolk: gnome characters and working sprites

**Anchors:** [worker-rest](./art-style/references/worker-rest.webp), [worker-action](./art-style/references/worker-action.webp), [megagnome](./art-style/references/megagnome.webp), [wizard-badge](./art-style/references/wizard-badge.webp).

- Short, stocky proportions, big noses and ears, expressive face, bold red/orange hair or beard, leather-and-brass gear and rounded sturdy hands.
- The worker pair is a **back/three-quarter view**, turns a small crank, and keeps feet, scale, machinery and silhouettes aligned across poses.
- For pairs: create static/action frames **together** in the same generation/composition, facing the same direction with feet aligned.  Keep stations and character scale consistent.  Weapons and hats should remain separate when possible.
- Megagnome demonstrates allowable scale exaggeration: a much larger, delighted character, soft round belly, still clearly the same world and materials.
- Named NPCs and other humanoid species should share the surface treatment and silhouette readability, not be forced into identical gnome anatomy or judged by species.

### C. Tiny Monster Collectibles: cute fauna

**Anchors:** [monster-rabbit](./art-style/references/monster-rabbit.webp), [monster-turtle](./art-style/references/monster-turtle.webp), [monster-fox](./art-style/references/monster-fox.webp), [monster-lizard](./art-style/references/monster-lizard.webp), [monster-mouse](./art-style/references/monster-mouse.webp), [monster-slime](./art-style/references/monster-slime.webp).

- Compact, toy-like, charming and boldly readable, with big expressive eyes, simplified limbs, strong color blocking and a single distinctive concept.
- A monster may be magical, organic, fungal, mechanical or a blend.  A rabbit's brass shell, a fox's electric elements, a turtle's mushrooms and a slime's form should not feel like the same template.
- Keep forms separated for collection sheets.  Glows and tails should not collide with neighboring cells.  Avoid intricate fur, scratches and background effects that disappear at icon size.
- The existing collectible families have named variants, but unique designs may be explored later.  Do not silently redesign deployed monsters.

### D. Adventure Encounter Beasts: dangerous wildlife

**Anchors:** [encounter-cockatrice](./art-style/references/encounter-cockatrice.webp), [encounter-boar](./art-style/references/encounter-boar.webp), [encounter-octopanther](./art-style/references/encounter-octopanther.webp), [encounter-fishfrog](./art-style/references/encounter-fishfrog.webp).

- Sharper teeth, larger claws, aggressive motion, more detailed feathers/scales/fur and fierce expressions are permitted.  They should look like worthy encounters.
- Retain saturated colors, clear contours, dimensional highlights and playful fantasy exaggeration.  Avoid horror realism, gore and muddy desaturation.
- This family is an **intensity band** of the same style, not permission to switch to unrelated gritty concept art.
- Hunt prey and Tiny Monsters fill different gameplay roles.  Do not use the collectible silhouettes as violent prey by default.

### E. Brass Relics: magical tools, rewards and props

**Anchors:** [treasure-pickaxe](./art-style/references/treasure-pickaxe.webp) and [treasure-sword](./art-style/references/treasure-sword.webp).

- Thick readable handles, carefully beveled gold fittings, bright faceted gemstones and a coherent magical accent.
- Object must read instantly as the correct tool or reward when reduced in size.  Use one clear focal point, not a cloud of VFX.
- Different categories can be less mechanical; brass is a signature material, not a mandatory coating on every object.

### F. Emblems, branding and UI

**Anchors:** [title-day](./art-style/references/title-day.webp), [title-night](./art-style/references/title-night.webp), [wizard-badge](./art-style/references/wizard-badge.webp), [ui-clipboard-day](./art-style/references/ui-clipboard-day.webp).

- The GNOMEWORKS sign establishes raised gold lettering, a carved wood board, heavy brass edging, gear ornaments and a cheerful mascot peeking from the edge.
- A **gear-framed character badge** is a deliberate alternate framing style: close-up expressive pose, circular gold gear surround, highly legible highlights and saturated interior accents.
- Use a consistent hierarchy: brass frames, dark/recessed inner areas, and clear characters or text.  Avoid miniature unreadable text; real interface words are safer as editable UI text.
- Day/night signs retain the same outline and typography; backgrounds and light mood change.

## 4. Day and night

| Aspect | Day mode | Night mode |
| --- | --- | --- |
| Timber | Honey / copper-orange oak grain | Dark charcoal, blue-black undertones, grain still visible |
| Metal | Reflective warm brass and copper | Bright amber/brass against dark surfaces; glow feels more pronounced |
| Ambient light | Warm studio/daylight from above left | Low ambient light with warm mechanical/emissive highlights |
| Geometry | Original silhouette and object positions | **Same** silhouette, positions, crop, size and overlays |
| Readability | Strong foreground/background contrast | Equal legibility; don't hide details in blackness |

Do not generate a night counterpart by casually rearranging gears, tubes, windows, logos or frame edges.  If a paired asset cannot line up exactly, its design is incomplete.

## 5. Asset construction rules

1. **Choose the asset type first.**  Use the [asset brief](art-style/ASSET-BRIEF-TEMPLATE.md) to specify purpose, art family, framing, perspective, interaction, animation poses, layers and day/night requirements before artwork.
2. **One coherent subject per image** unless a sprite sheet, paired pose, or reference montage is expressly requested.  No accidental collages, inset close-ups, duplicate faces or alternate floating heads.
3. **True alpha for cutouts.**  A transparent asset must contain actual transparent pixels, not painted checkerboard or black/white matte.  Check against dark and bright backdrops.
4. **Paired frames stay registered.**  Shared foot line, stance size, perspective, station coordinates and equipment position.  Animation sheets use clear gaps so slicing can isolate each frame.
5. **Lighting consistency.**  Default warm upper-left key and smooth soft shadows.  Night environment substitutes a darker ambient setup, not unrelated shadow directions on every component.
6. **Composition for the game.**  Avoid clipped weapons, hands, ears, wings, magic effects or gears.  Preserve negative space for labels, UI, and motion.  Props should not contain baked-in fake buttons or dynamic data unless specified.
7. **Legibility and accessibility.**  Critical categories should be recognizable by icon shape, text, position or symbolism as well as color.  Test at actual phone and icon sizes.
8. **Asset size is not style.**  Concept artwork may be 1024 px or larger, but delivered sizes vary by UI, sprites and backgrounds.  Confirm dimensions in [ASSETS.md](ASSETS.md); use no blanket 1024 requirement.
9. **No surprise lettering.**  If text is required in an image, proofread exact spelling and compare against approved logo.  Prefer live HTML text for instructions.
10. **Review before integration.**  Nathan and Mara iterate visually; no artwork is handed to Claudia as implementation-ready until the design and asset set have been approved.  Code and map/lore files remain Claudia's workstream.

## 6. What does NOT fit

- Photorealistic machinery or skin, gritty military/industrial realism, black-and-white horror, corroded grime as the default atmosphere.
- Flat generic vector/clipart, airbrushed plastic without edge structure, unfinished linework, overly sketchy texture, or incongruent anime/comic rendering.
- Thin spidery anatomy, tiny texture details that swamp the silhouette, uncontrolled glow or metallic glare.
- Game-critical text embedded in tiny props, unreadable labels, accidental gibberish, pasted-on watermark, busy scene with no clear subject.
- A fake transparent checkerboard, mismatched pose pairs, rotated light/shadows between sprite frames, or resized night frames that no longer register.
- Forced brass additions to every plant/creature just to "make it steampunk."  Organic fantasy materials are welcome.

## 7. Copy-ready style prompts

**Base prompt, adapt after the asset-specific instructions:**

> Gnomeworks Brasswood Cartoon.  Polished stylized 3D-cartoon fantasy game illustration, tactile sculpted forms, chunky rounded silhouettes and expressive proportions, rich saturated colors, warm golden brass with beveled edges and readable rivets, carved oak and copper where appropriate, brown leather and soft cream fabric, selective bright magical accents, smooth hand-painted dimensional finish, controlled warm upper-left lighting, gentle depth and clean readable separation, playful craftsmanship, consistent with Gnomeworks reference images.  No photorealism, grime overload, unrelated visual style or accidental text.

**For Tiny Monsters:** Append “small collectible creature, delightful big eyes, compact silhouette, one memorable theme, icon-scale readability, isolated with generous margins and true alpha, mechanical accents only when justified by the creature.”

**For working gnomes:** Append “short powerful toy-like anatomy, orange-red hair and beard, thick leather-and-brass work gear, back/three-quarter view facing left, same ground line and scale in both poses, clearly separated static/action frames.”

**For threatening beasts:** Append “dramatic fantasy anatomy, fierce expression and defined claws/teeth, richer natural texture, energetic silhouette; retain saturated color, polished illustration and non-gory cartoon fantasy appeal.”

**For day/night pairs:** Append “identical perspective, pixel placement, objects and geometry as the approved day reference; night is charcoal/blue-black timber with warm amber reflections and local glowing mechanisms.”

**For loot:** Append “one isolated hero object, bold functional geometry, brass fitments where natural, jewel-like facets and a localized crystal glow; unmistakable outline at item-tile size.”

**These are guidance, not magic seed words.**  Supply the actual category reference image(s), accurate pose constraints and a concrete asset brief in every new session.

## 8. Review rubric

Before approval, score each category **pass / revise**:

- **Family match:** Which gallery anchor does this resemble, and which details match?
- **Palette/materials:** Do brass, wood, leather, organic material and magic look consistent?
- **Shape:** Readable silhouette and deliberate cartoon exaggeration?
- **Lighting:** Correct warm key / night treatment and consistent shadows?
- **Function:** Correct size, orientation, margins, alpha, paired alignment and UI legibility?
- **Continuity:** Does it match existing named characters, props and worldbuilding without silently redesigning them?
- **Technical check:** No watermarks or fake transparency, misspellings, artifacts, clipped subjects or merged sprites?

An image can be aesthetically approved but **not yet game-ready**.  Keep design approval and implementation approval separate.

## 9. Preservation and workflow

- The [reference gallery](art-style/REFERENCE-GALLERY.md) uses **22 frozen snapshot references** taken from existing Gnomeworks in-game WebP art.  Their Git blob contents were copied into the art-style folder without modifying live assets.  These are stable comparisons even if the live sprites are later replaced.
- Nathan retains higher-resolution source PNGs and may revise them in GIMP.  The included snapshots represent the style, not necessarily maximum source quality or final output resolution.
- **Work division:** Nathan and Claudia own evolving map/lore data and implementation; Nathan and Mara develop and review art assets.  Do not send, install, or push new *game art* merely because the style document exists.
- The map-drafting SVG is not the illustrated game map.  Future map art can share the Brasswood palette but may require its own cartographic substyle, approved from examples before shipping.
- When visual direction changes, update this bible and replace/add **deliberate** examples with a note of which rule changed.  Do not drift from the approved style just because a single generated image looks attractive.

**Canonical identifier to reuse:** `GNOMEWORKS_BRASSWOOD_CARTOON`.  Human-facing name: **Gnomeworks Brasswood Cartoon**.
