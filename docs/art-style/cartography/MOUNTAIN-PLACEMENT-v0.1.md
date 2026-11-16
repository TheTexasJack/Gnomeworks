# Gnomeworks cartography: mountain stamp placement v0.1

**Status:** Provisional design rules for Nathan's visual review, 2026-11-15. Not yet approved as a final art standard. Applies to the independent Gnomeworks **full-size game map**, not Claudia's Lore master.

## Authorities and source

- Geography: [Gnomadica v0.29 master SVG](../../lore/map/gnomadica-map-v0.29.svg) and [location coordinates](../../lore/map/gnomadica-locations-v0.29.json).
- Source builder: [tools/map/build_map.py](../../../tools/map/build_map.py). The original builder places mountains along seven ridges and draws five additional Mountain of Exclusion peaks at fixed positions.
- Gnomeworks visual references: [Art-Style Bible](../../ART-STYLE-BIBLE.md); seven mountain designs approved as a direction by Nathan; [v5 insertion proof](../proofs/gnomadica-v029-mountain-symbols-on-map-test.svg) replaces five peaks with three traced silhouette variants.
- The map's town/landmark labels are source-controlled SVG text, **never AI-generated image text**. Preserve exact names and their anchors.
- **Do not modify files under `docs/lore/map/` or `tools/map/` for this art study.** Derivatives and output live separately in Gnomeworks art/runtime locations, subject to later approval.

## Stamp library

Seven reusable mountain designs are the starting collection, not seven different mountain coordinates. Keep natural silhouettes: rounded, jagged, tall, twin, broad chain, snowy and broken-rock forms. Avoid a single repeated triangular shape.

Maintain a common **bottom-center registration point** for every variant. Each stamp's SVG `viewBox` should use a consistent local baseline and declared aspect ratio. Allow uniform scaling only (no squashing). Every `<use>` references the shared symbol; do not duplicate the full path for each peak.

Each variant needs consistent warm upper-left light, brown/gray rock shading, a restrained cream snowcap when appropriate, and the same line-weight family. Avoid horizontal mirroring unless the light/shadow treatment is also corrected.

## Placement roles (initial, unapproved scale tests)

| Role | Relative size | Guidance |
| --- | ---: | --- |
| Lead peak | 100–115% | Visually dominant peak; normally one per short cluster, not every placement |
| Secondary | 85–100% | Main run of the ridge; mix silhouettes, do not repeat neighbors |
| End / edge peak | 65–85% | Taper toward each end and near coastlines |
| Filler / distant peak | 55–70% | Small, irregular supporting shapes; skip if the range becomes crowded |

**Reference size:** Relative to a representative correctly sized middle-range stamp, not relative to the original raster stamp sheet. In the v5 proof, full-size replacements were roughly **26–34 map units wide**. Recalibrate after visual review at actual desktop and phone zoom.

- **Taper shape:** Prefer a gentle increase from each end toward one or two taller central peaks, without a perfectly symmetrical mountain-wave pattern. Leave room for distinctive local peaks.
- **Overlap:** Start with about **15–30% of neighboring stamp width** in mountain-heavy clusters. Keep significant silhouette contours visible. Avoid uniform gaps, heavy collisions, or stacking every base in one horizontal row.
- **Depth:** Draw farther peaks first and nearer peaks last. Use map-space baseline `y` to sort where practical (higher `y` nearer the viewer); don't reverse the source's named landmark and route layers.
- **Variation:** Cycle through all seven stamp forms using a deterministic per-ridge selection. Avoid consecutive identical silhouettes. Small rotation variation approximately **±5°**, but never enough to make a mountain appear to lean or float.
- **Registration:** Use the existing mountain placement as the baseline anchor. Scaling should expand upward from that point. For unnamed ornamental peaks, minimal local adjustment is possible if it stays within its original ridge envelope; **never relocate canonical pins, coastlines, named landmarks, roads, or rivers**.
- **End caps:** Reduce the last one or two peaks at each end, and favor irregular shorter silhouettes over clipped full-size mountains. Near coasts, shrink or remove decorative filler rather than letting stamp art spill into water.
- **Landmark uniqueness:** Landmark-specific mountains (especially **Mountain of Exclusion**) retain clear distinctive silhouettes; they may warrant an irregular taller center instead of blindly following the same pattern as every other ridge.

## Typography and collision rules

The v2 ivory-brass plaques were explicitly rejected as **excessively intrusive**. Keep the accepted v3 *quiet* cartographic text: source spelling, subtle parchment halo, and no boxes or opaque nameplate backgrounds.

1. Place artistic mountain stamps **below** existing text and markers. Preserve all source text content and original named-place coordinates.
2. Reserve a visible gap around the label's painted glyph outline (initial goal about **4–6 map units** in the base map; adjust for font size, zoom and nearby art). Test the actual rendered text footprint rather than treating this as an absolute formula.
3. If a peak collides with a label, first reduce its scale, then change to a narrower silhouette, then remove unimportant filler. Do not add boxes behind the text.
4. Preserve visibility of roads, ferries, railways and named settlements. Artwork must not imply a relocated mountain or conceal a landmark marker.
5. Check the entire mountain chain at final view sizes. A single successful close-up does not guarantee legibility at full-screen mobile zoom.

## Technical SVG sketch

Use consistent basepoint registration. For a symbol designed around a 100 × 70 local area whose base is at local y=70, map placement at `(X,Y)` for desired rendered dimensions `(W,H)` is:

```xml
<symbol id="mountain_A" viewBox="0 0 100 70">
  <!-- Native paths, shading, snowcap, all fully inside viewBox -->
</symbol>

<!-- Bottom center aligned to canonical baseline (X,Y); example only -->
<use href="#mountain_A" x="X - W/2" y="Y - H" width="W" height="H" />
```

The example `x` and `y` expressions are explanatory placeholders; calculate numeric coordinates in the exporter. A shared placement helper should accept `symbolId, anchorX, anchorY, scale, role`, derive numeric `x,y,width,height`, and preserve aspect ratio. Deterministically select variants so rebuilds are stable.

**Asset policy:** Master source stamps may be imported into a separate derivative SVG. Prefer actual vector paths for zoom clarity. If using raster embedded art instead, explicitly measure mobile memory/performance and distinguish that from pure vector assets.

## First validation pass

- [ ] Replace the remaining old triangular mountains within the **Mountain of Exclusion** test crop, using the complete seven-stamp family where it fits; avoid artificial one-of-each distribution.
- [ ] Create a lead/secondary/end/filler scale comparison at actual map scale, not just on a blank sheet.
- [ ] Check overlap, left-to-right illumination, edge taper, cliff/coast clearance, and preserved labels in the cropped proof.
- [ ] Compare source and derivative: same location text, source coastline, roads, rivers, and named pins.
- [ ] Check desktop readability and mobile pan/zoom performance before extending to all ridge zones.
- [ ] Get Nathan's explicit approval before treating these provisional numeric ranges as the production default.

**Extensibility:** The same anchor, deterministic variant, and edge-taper pattern can be adapted for forests, rolling hills, marsh, crystals, and volcanoes, but their individual size/overlap standards should be defined and tested separately.
