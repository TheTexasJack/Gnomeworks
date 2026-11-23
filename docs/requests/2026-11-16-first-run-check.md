# Work order: first run check on Beast (v0.2)

**Status:** Reviewed (step 4 still to rerun)
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

Run 2026-11-22 by Claude Code (Opus 5.5) on Beast.

**Step 1.**  `git pull` brought in 5 changed files (CLAUDE.md, ENVIRONMENT.md, HANDOFF.md, this order).  `whoami`: `gwcode`.

**Step 2, tool versions:**

- Node: v24.22.3
- Python 3: 3.12.3
- numpy: 1.26.4
- Pillow: 10.2.0
- scipy: 1.11.4
- OpenCV (`cv2`): 4.6.0
- Playwright: 1.65.1, installed globally (`NODE_PATH=/usr/lib/node_modules`), with Chromium at `~/.cache/ms-playwright/chromium-1255/` (present and runs).
- **Missing: scikit-image (`skimage`).**  `tools/map/build_map.py` needs it (line 179, `from skimage.measure import find_contours`), and ENVIRONMENT.md does not list it.  On Mint the system package is likely `python3-skimage`.  Not installed, per this order.

**Step 3, smoke test: passes, with an intermittent failure.**  The first run failed with this, word for word:

```
desktop: ok  taps=27  items=4694  Gnomeworks v0.2.0-draft.69 · made for The Stoned Gnome
phone: ok  taps=30  items=4473  Gnomeworks v0.2.0-draft.69 · made for The Stoned Gnome

PROBLEMS:
phone missing file: file:///srv/GW/Gnomeworks/assets/monsters/golem_glowing.webp
```

The file exists and is a valid WebP.  The next two runs printed "All clear."  A scratch copy of the test that also logs Playwright's failure reason failed 1 run in 5, on a different file: `desktop missing file: .../assets/monsters/owl_goopy.webp [net::ERR_ABORTED]`.  `ERR_ABORTED` means the browser cancelled the load, most likely because an item image was removed from the page before it finished loading.  So the test's `requestfailed` check also catches cancelled loads, which makes it flaky (about 1 run in 4 here).  It may not show in the cloud session if loads finish faster there.  A possible fix for a later order: skip `net::ERR_ABORTED` in that check, or report it separately.  Nothing in the repo was changed.

**Step 4, map rebuild: skipped: missing scikit-image.**  `python3 tools/map/build_map.py` stopped at `ModuleNotFoundError: No module named 'skimage'` before writing anything.  `git status --short` came back clean, so nothing needed putting back.  Once `skimage` is installed, this step can be run again to do the numpy 1.26 vs 2.x byte-for-byte comparison.

**Step 5.**  Only this file changed, committed and pushed.  No version bump.

**Left open:** install scikit-image (and add it to ENVIRONMENT.md's tools table), rerun step 4, and decide whether to fix the flaky smoke test check.

## Review (Claudia, 2026-11-22)

Clean first lap: the order was followed exactly.  It reported, installed nothing, fixed nothing on its own, and changed only this file.

- Tools match what Nathan installed.  The missing scikit-image was Claudia's gap in ENVIRONMENT.md, now added (`python3-skimage` on Beast).
- The smoke test flake diagnosis is sound: `tools/smoke-test.js` line 29 treats every failed request as a missing file, including loads the page cancels (`net::ERR_ABORTED`).  That is a test bug, not a game bug.  It becomes a small work order of its own.
- **Still to do:** after Nathan installs `python3-skimage`, rerun step 4 only (the map rebuild and `git status`) and add the result below.

