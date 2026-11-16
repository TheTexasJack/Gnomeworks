# Gnomeworks: interruption-resistant production workflow

**Adopted:** 2026-11-15. **Reason:** Two long ChatGPT conversations reached their maximum length mid-production; project work must remain resumable without chat history.

## Mandatory order: record → work → commit → verify → present

1. **Record the assignment in GitHub before modifying assets.** Update `docs/art-style/ACTIVE-CARTOGRAPHY-HANDOFF.md` (or another task-specific active handoff) with the objective, source file paths, exactly what Nathan has approved or rejected, protected elements, intended outputs, QA checks and the next action. Mark `IN PROGRESS`. Preserve unfinished decisions accurately.
2. **Work non-destructively.** Treat canonical Lore masters as read-only. Create versioned proofs, not replacements for prior proofs. Do not undo approved work when fixing a new component.
3. **Commit the actual deliverables to GitHub.** This means full edited SVGs or raster assets, not merely links to temporary sandbox files or chat attachments. Include source/approved raster where relevant. If an asset cannot be committed, explicitly mark it `LOCAL ONLY / NOT BACKED UP`; do not imply the task survived a conversation boundary.
4. **Verify the commit before presenting it.** Reopen the GitHub path, confirm dimensions, references, element counts and any safety/performance checks; compare against approved baseline and capture a useful visual proof. Record SHA and results in the handoff.
5. **Only then show Nathan the deliverables** for visual approval. Distinguish between concept approval, symbol/vector approval, map placement approval, full-package approval and runtime integration. Keep their statuses separate.
6. **On approval or rejection, update GitHub immediately** (checklist + handoff), recording the user's actual verdict, version and next step. Never silently assume approval.
7. **If interrupted:** Read the active handoff, approved checklist and latest committed files first. Resume the recorded next action. Never request prior assets until confirming GitHub and conversation-backed sources. Do not call a partial/isolated sign or crop a completed full-map proof.

## Completion / crash recovery statuses

- `NOT STARTED`: documented, no work performed
- `IN PROGRESS`: documented, intermediate work may not be backed up
- `COMMITTED / REVIEW PENDING`: deliverables and QA exist on GitHub, awaiting Nathan
- `APPROVED`: explicit user approval, GitHub checklist updated
- `REJECTED`: retain old proof for traceability; retry on a new version
- `BLOCKED`: precise missing source/tool/access documented; never claim it was completed

## Artifact integrity

- Commit text, SVG, PNG and other dependencies needed to reproduce the result. Avoid external links to ephemeral chat media as the only asset source.
- Keep large binary source files stored as ordinary repository assets whenever feasible; a hybrid SVG is not safely archived if it references an uncommitted raster.
- Put exact relevant paths and version numbers in handoff notes, not just "the latest map."
- Run XML well-formedness, SVG link/script inspection, key legend and text checks, and map-feature counts on full-map versions. Visual confirmation is required in addition to mechanical checks.
- Performance/mobile testing and eventual runtime deployment are independent approval gates.
