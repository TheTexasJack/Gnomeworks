# Work order: first run check on Beast (v0.2)

**Status:** Approved
**Written by:** Claudia, 2026-11-16; updated 2026-11-22 for the gwcode setup.  **Approved by:** Nathan, 2026-11-22.

## Goal

Prove Claude Code on Beast can run the repo's tools and that they give the same results as the cloud session.  Nothing in the game changes.  This is the test lap of the work-order loop.

## Read first

- `CLAUDE.md` at the repo root.
- `docs/ENVIRONMENT.md` (Tools used to build it, Commands).
- `docs/requests/README.md`.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.  Report `whoami` (it should be `gwcode`).
2. Report the versions of: Node, Python 3, numpy, Pillow, scipy, OpenCV (`cv2`), and whether Playwright with Chromium is installed.  One line each.  Nathan installed all of these on 2026-11-22 (Node 24, Playwright, numpy 1.26.4, OpenCV 4.6.0), so expect them present.  If something is missing anyway, list it and **stop before installing anything**: Nathan installs it system-wide.
3. If Node and Playwright are present: run `node tools/smoke-test.js` and report pass or fail, with any errors word for word.
4. If Python, numpy, and cv2 are present: run `python3 tools/map/build_map.py`, then `git status --short`.  The map builder is seeded, so on the cloud session it rebuilds `docs/lore/map/gnomadica-map-v0.29.svg` and its JSON byte for byte (checked 2026-11-16 with numpy 2.5.3).  Beast has numpy 1.26.4, so a mismatch here is possible and is a finding to report, not a failure to fix.  Report whether `git status` comes back clean.  If files changed, report `git diff --stat` and run `git checkout -- docs/lore/map/` to put them back.  Do not commit any rebuilt map.
5. Fill in the Result section below, set Status to Done, commit only this file, and push.

## Do not

- Install, upgrade, or remove any package.
- Use sudo.
- Change any file other than this work order.
- Bump `GW.VERSION` (no game code changes, so no version bump or changelog line).

## Done when

- Every tool version is listed.
- The smoke test result and the map rebuild result are recorded (or marked "skipped: missing X").
- This file is pushed with Status: Done.

## Result (filled in by Claude Code)

