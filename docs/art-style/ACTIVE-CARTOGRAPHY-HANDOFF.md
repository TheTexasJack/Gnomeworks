# ACTIVE HANDOFF: Gnomadica full map illustration

**Updated:** 2026-11-15
**Status (2026-11-22): PARKED as optional polish.**  Nathan closed the wall map package as covered: the approved small map icon on the wall, and the generated v0.29 map as the full map.  This Brasswood re-style (v18) no longer blocks anything.  Everything below is the record from 2026-11-15, kept in case the polish is picked up later.

**Earlier status (2026-11-15):** COMMITTED / REVIEW PENDING: v18 complete map and exact sign PNG exist on GitHub; visual placement approval and mobile QA pending
**Goal:** Review the actual *full v18 map*, which integrates the approved carved oak/brass sign and removes the two explanatory KEY notes while preserving earlier approved terrain/labels. Obtain Nathan's actual map placement verdict.

## Source of truth

- Last approved terrain integration: `docs/art-style/proofs/gnomadica-v029-sloping-dunes-v16.svg` (44 approved Gnafrica dunes and all earlier terrain).
- Canonical source, DO NOT MODIFY: `docs/lore/map/gnomadica-map-v0.29.svg`, `tools/map/build_map.py` and the source location JSON.
- Rejected sign/map proof: `docs/art-style/proofs/gnomadica-v029-brasswood-cartouche-v17.svg`; its sign tracing flattened the design. Do not reuse the v17 cartouche.
- Approved sign source: **the exact original rendered PNG** `a_high_detail_colorful_fantasy_steampunk_carved.png` (approx 2172×724, transparent), or its identical `gnomadica_approved_sign_exact_v2.svg` self-contained raster-in-SVG wrapper, provided within chat. Nathan explicitly approved this appearance and hybrid SVG and does **not** want more standalone sign previews.
- **Approved sign source now backed up to GitHub:** `docs/art-style/proofs/gnomadica-approved-sign-original-v18.png` (900×300 lossless RGBA, 402,239 bytes, Git blob `001801c9d45c4269582912ae8f2275005d1b5484`), derived from Nathan-approved exact sign source. This smaller lossless PNG preserves the approved appearance at the intended 368×123 map size.
- Approved sign intended map coordinates: approximately x=576, y=26, width=368, height=122.7 SVG units (map viewBox 1660×1150). Inspect actual result, not merely a crop.
- User explicitly asked to delete only the two small KEY footnotes: `Region colors are soft washes. No borders are drawn yet.` and `No scale bar yet: the main island is hundreds of miles across.` Keep `KEY` and the essential 12 legend entries.
- 05-F full-screen map package is still **open**; prior approvals are not package approval.

## Completed v18 integration and immediate next action

1. **DONE:** Read complete v16 directly from GitHub blob `770f5abcc61a6eb96f9daee2e13c609ee8ce00bb`.
2. **DONE:** Commit lossless approved-sign PNG to `docs/art-style/proofs/gnomadica-approved-sign-original-v18.png`. PNG commit `3824e1d27d2f682976c83160adf372caf6f7c36f`.
3. **DONE:** Commit complete v18 SVG at `docs/art-style/proofs/gnomadica-v029-approved-sign-v18.svg`, which references the checked-in PNG in the **same directory** via both SVG `href` and `xlink:href`; map proof commit `36217b0dd1fbad320fd24d86f8f6805e46cde7b3`. Both GitHub paths verified in main tree, PNG 402,239 bytes and map SVG 1,573,266 bytes.
4. **DONE (structural QA):** All 1,903 `<use>` elements, 44 dune anchors, 645 original source anchors, and 201 v15 forest-infill anchors preserved. Original 138 `<text>` elements become 134 through deliberate removal of old 2-line cartouche text and 2 tiny KEY footnotes. All 12 meaningful KEY labels remain; no SVG scripts or event handlers introduced. v16 and rejected v17 proofs remain untouched.
5. **NEXT:** Show Nathan the **entire v18 map** for visual sign placement review, not the sign on its own. This version references a separate checked-in PNG so download or deploy *both* neighboring files together. Do not claim that the integrated map has already been visually approved.
6. **AFTER APPROVAL:** Complete wide/portrait visual QA, performance/mobile testing, consider self-contained packaging for offline use, and only then mark full 05-F package approved. Never modify Lore master.


## Preferred review deliverable, standalone v18

- **Preferred single-file proof:** `docs/art-style/proofs/gnomadica-v029-approved-sign-v18-standalone.svg`, committed and optimized in GitHub commit `594b8bda0d32586d2d6f7df6b9a32c46dc932fc7` (2,109,514 bytes, blob `d25c3a3a0b5823af88b20d368d37b7c635ed5f8b`).
- This version includes the exact approved PNG **embedded once** as a data URI, so it renders without separate adjacent files and is easier to review/download.
- Post-commit structural verification PASSED: 1,903 `<use>`, 134 `<text>`, 44 dune anchors, 645 source anchors, 201 forest-infill anchors, one inline PNG and all 12 useful KEY entries; two unwanted KEY footnotes removed, no external image `href`, SVG scripts, JavaScript URLs, or event handlers.
- The separate PNG dependency and linked compact SVG also remain committed for optimization, source recovery and possible future runtime use. **No visual verdict from Nathan on the full v18 map yet.** Next: present standalone map for review before package/mobile QA.

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
| 2026-11-15 | COMMITTED / REVIEW PENDING | v18 complete map and lossless approved sign PNG committed separately; validated Git tree presence and terrain/key counts. Await full-map visual review. |
| 2026-11-15 | COMMITTED / REVIEW PENDING | Optimized self-contained v18 SVG also committed and verified; preferred review artifact. |
