# Work order: smoke test ignores cancelled image loads (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 (he started the run).
**Model:** Opus 5.5

## Goal

Stop the smoke test failing about 1 run in 4 on images that exist.  Found by the first-run check: `tools/smoke-test.js` counts every failed request as a missing file, including image loads the page itself cancels (`net::ERR_ABORTED`).

## Read first

- `CLAUDE.md` and `docs/ENVIRONMENT.md` (Claude Code on Beast).
- `docs/requests/2026-11-16-first-run-check.md`, Step 3 of the Result.
- `tools/smoke-test.js`, around line 29 (`page.on('requestfailed', ...)`).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. In the `requestfailed` handler, skip a request when its failure text is `net::ERR_ABORTED`.  Keep reporting every other failure as a missing file, and include the failure text in the message (for example `phone missing file: <url> [net::ERR_FILE_NOT_FOUND]`), so a real problem says why.
3. Prove both sides:
    - Run `node tools/smoke-test.js` 10 times.  All 10 should end "All clear."
    - Temporarily rename one image the game loads (for example `assets/monsters/owl_goopy.webp`), run the test once, and confirm it now fails and names that file.  Rename it back and confirm `git status` shows only `tools/smoke-test.js` changed.
4. This changes a tool and no game code, so no `GW.VERSION` bump and no `tools/stamp.js`.  Add one `CHANGELOG.md` line under the current version: "Smoke test: cancelled image loads no longer count as missing files."
5. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change any game file (`index.html`, `js/`, `css/`, `assets/`).
- Make the test less strict about real missing files.
- Install anything.

## Done when

- 10 runs in a row pass.
- The renamed-image check fails and names the file, and the image is back in place.
- Only `tools/smoke-test.js`, `CHANGELOG.md`, and this order changed.

## Result (filled in by Claude Code)

Run 2026-11-22 by Claude Code (Opus 5.5) on Beast.

**The change.**  In `tools/smoke-test.js`, the `requestfailed` handler now reads the failure text, skips `net::ERR_ABORTED`, and reports everything else as before, with the reason added.  For example: `desktop missing file: file:///srv/GW/Gnomeworks/assets/monsters/owl_normal.webp [net::ERR_FILE_NOT_FOUND]`.  If Playwright gives no failure text, the message says `[unknown]` and still counts as a failure.

**10 runs:** all 10 ended "All clear." (exit 0).

**Renamed-image check:**

- With `assets/monsters/owl_goopy.webp` renamed (the example in the order), the test still passed.  A scratch copy that logged every failed request showed no failed requests at all, so the run never asked for that file.  The skip did not hide it.  The test only loads rare variants like `owl_goopy` when they happen to drop, so it can never see if one of them goes missing.  That gap was already there and has nothing to do with this change.
- A scratch log of what the test loads showed `assets/monsters/owl_normal.webp` loads on both desktop and phone, so I renamed that file instead.  The test failed (exit 1) and named it on both layouts, word for word:

```
desktop missing file: file:///srv/GW/Gnomeworks/assets/monsters/owl_normal.webp [net::ERR_FILE_NOT_FOUND]
desktop console: Failed to load resource: net::ERR_FILE_NOT_FOUND
phone missing file: file:///srv/GW/Gnomeworks/assets/monsters/owl_normal.webp [net::ERR_FILE_NOT_FOUND]
phone console: Failed to load resource: net::ERR_FILE_NOT_FOUND
phone missing file: file:///srv/GW/Gnomeworks/assets/monsters/owl_normal.webp [net::ERR_FILE_NOT_FOUND]
phone console: Failed to load resource: net::ERR_FILE_NOT_FOUND
```

- Both images were renamed back (same sizes as before).  `git status --short` then showed only `tools/smoke-test.js`.

**Changelog:** one line added under v0.2.0-draft.69.  No version bump and no `tools/stamp.js`, as the order says.

**Changed files:** `tools/smoke-test.js`, `CHANGELOG.md`, and this order.

**Left open (an idea, not done):** the test only notices a missing image if that image happens to load during the run.  To catch any missing image, a later order could add a quick check that every `img:` path in `js/config.js` exists on disk.

