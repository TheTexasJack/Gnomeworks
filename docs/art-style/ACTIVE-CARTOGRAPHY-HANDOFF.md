# ACTIVE HANDOFF: Gnomadica full map illustration

**Updated:** 2026-11-15
**Status:** IN PROGRESS, exact approved sign not yet integrated into complete Gnomadica SVG
**Goal:** Produce the actual *full map* with the already-approved carved oak/brass sign at the top, remove two tiny explanatory notes below the KEY, preserve every approved terrain/label element, and send the complete map proof for Nathan's visual review.

## Source of truth

- Last approved terrain integration: `docs/art-style/proofs/gnomadica-v029-sloping-dunes-v16.svg` (44 approved Gnafrica dunes and all earlier terrain).
- Canonical source, DO NOT MODIFY: `docs/lore/map/gnomadica-map-v0.29.svg`, `tools/map/build_map.py` and the source location JSON.
- Rejected sign/map proof: `docs/art-style/proofs/gnomadica-v029-brasswood-cartouche-v17.svg`; its sign tracing flattened the design. Do not reuse the v17 cartouche.
- Approved sign source: **the exact original rendered PNG** `a_high_detail_colorful_fantasy_steampunk_carved.png` (approx 2172×724, transparent), or its identical `gnomadica_approved_sign_exact_v2.svg` self-contained raster-in-SVG wrapper, provided within chat. Nathan explicitly approved this appearance and hybrid SVG and does **not** want more standalone sign previews.
- Approved sign source **NOT YET BACKED UP TO GITHUB** at time of this checkpoint. Source must be committed with the full map, or the deliverable is not crash-resistant.
- Approved sign intended map coordinates: approximately x=576, y=26, width=368, height=122.7 SVG units (map viewBox 1660×1150). Inspect actual result, not merely a crop.
- User explicitly asked to delete only the two small KEY footnotes: `Region colors are soft washes. No borders are drawn yet.` and `No scale bar yet: the main island is hundreds of miles across.` Keep `KEY` and the essential 12 legend entries.
- 05-F full-screen map package is still **open**; prior approvals are not package approval.

## Current task and next action

1. Retrieve the complete GitHub v16 file as data (GitHub blob SHA `770f5abcc61a6eb96f9daee2e13c609ee8ce00bb` verified readable through GitHub connector, despite local Python container network DNS restrictions).
2. Integrate the **exact approved sign** (embedded losslessly or link to an actual checked-in asset; do not re-typeset/redraw), replacing the old cartouche group. Remove only two explanatory KEY notes.
3. Commit versioned full proof as `docs/art-style/proofs/gnomadica-v029-approved-sign-v18.svg` and any necessary sign image dependencies to GitHub, leaving v16 and v17 intact.
4. QA: all 44 dunes, 760 trees, 299 hills, 116 mountains, 34 crystals, 53 palms, source anchors, towns, route/river shapes, and 12 KEY entries intact. Check XML and rendering, label/sign overlap, and reasonable size.
5. **Present the complete v18 map** (not just the sign fragment), with its proof link. Await Nathan's placement verdict. Later: package QA and mobile performance testing.

## Decisions / guardrails

- Eight dune vectors and v16 placement: approved. Woods of the Elder 201-tree infill: approved.
- Sign concept: approved. Exact sign PNG/hybrid SVG: approved. Simplified v17 vector interpretation: rejected.
- Full map **sign placement**: has NOT been reviewed or approved yet.
- Failure mode to avoid: answering with an isolated sign and claiming it is the full-map integration.
- Any inability to access/embed the approved raster must be documented as a blocker; do not fake the map or silently substitute inferior art.

## Production ledger

| Date | Status | Action / evidence |
| --- | --- | --- |
| 2026-11-15 | IN PROGRESS | Recorded source, approvals, constraints and exact next actions before continuing the full-map v18 integration. |
