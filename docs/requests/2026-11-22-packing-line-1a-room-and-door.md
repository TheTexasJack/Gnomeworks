# Work order: Packing Line 1a, the shipping room and door (v0.1)

**Status:** Reviewed (Claudia, 2026-11-22); waiting on Nathan's look
**Written by:** Claudia, 2026-11-22.  **Approved by:** Nathan, 2026-11-22 (keep it hidden behind `?ship=1`).
**Model:** Opus 5.5

## Goal

The first visible piece of the Packing Line: a third view, the shipping room, with its door opened and closed by the chain.  Nothing ships yet.  It stays **hidden from players** until Nathan says otherwise, so the live site does not show an empty room.

## The plan for layer 1 (Draft, Claudia; each step is its own work order and needs its own approval)

| Step | What it adds |
| --- | --- |
| **1a (this order)** | The shipping view, the room art (wide and tall, day and night), the chain opening and closing the door |
| 1b | Gnomerica's truck slides in from the right and backs up to the door; the driver walks in (waiting pose) |
| 1c | Three work orders pinned on the order board, filled by the randomizer; tap one to read it full size |
| 1d | The supply drawer, the four boxes, and the conveyor button that opens the item menu |
| 1e | Packing: drag a shelf pile into the box, supplies (peanuts, bubble wrap, FRAGILE and HEAVY), the region stamp, APPROVED and DENIED |
| 1f | Hand off and close the door: the truck leaves, the report card shows ✅ and ❌ with why |
| 1g | Stonks: the GRIP line on the STONKS screen moves with the report card |

## Read first

- `CLAUDE.md`, then `docs/ENVIRONMENT.md` (Claude Code on Beast) and `docs/ARCHITECTURE.md` (the two views, the layout breakpoints, the Night theme).
- `docs/DESIGNS.md`, Packing Line: "A shift on the Packing Line" and the room notes.
- `docs/art-style/PACKING-LINE-ASSETS-v0.3.md`, "Room layout", and the checklist rows 01, 02, and 03.
- `docs/ASSETS.md`, how `assets/bg/floor` and `floor_tall` were made (resize only, night twins at the day twin's exact size).

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **Art.**  From `art-masters/packing-line/01-02-room-door/` make WebP game copies in `assets/packing/`: the eight room images (wide and tall, day and night, closed and open).  Resize only, never crop, so the closed and open twins line up pixel for pixel.  Pick sizes to match the Shop Floor backgrounds (about 1600 wide for the wide room, about 900 wide for the tall room); record the sizes and file weights in the Result.  Also make the chain from `art-masters/packing-line/03-chain/chain.png` with `tools/art.py`.  Add every new file to `docs/ASSETS.md`.
3. **The view.**  Add a third view, `shipping`, inside the machine box beside The Machine and the Shop Floor.  It uses the wide room above 720px and the tall room at 720px and under, the same breakpoint as the Shop Floor.  Night swaps through `GW.theme.img()`.  Add `'shipping'` to `CONFIG.views` so phones can swipe to it, and a view button beside the other two (label: "📦 Shipping").
4. **Hidden from players.**  Add `CONFIG.shipping.enabled = false` in `js/config.js`.  While it is false, the button, the swipe, and a saved `view: 'shipping'` all fall back as if the view does not exist.  The view shows when `enabled` is true or the address has `?ship=1` (for Nathan's testing, alongside the existing `?debug=1`).
5. **The door.**  The room starts closed every time the view opens (not saved).  A real tap on the chain (trusted pointer events only, like the gear) swaps the room to its open twin, and the next tap swaps it back.  Give the chain a short pull-down bounce when tapped.  Place the chain where the art puts it beside the door; its position and size live in `CONFIG.shipping` for each layout (wide and tall), the way `CONFIG.floor.layouts` works.  A short click from `GW.sfx` is fine; no new sound files.
6. Every number in `js/config.js`.  Bump `GW.VERSION` to `0.2.0-draft.70`, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, and run `node tools/smoke-test.js`.
7. **Screenshots for Nathan** (Playwright, into `tools/out/`, which git ignores): wide day closed, wide day open, wide night open, tall day closed, tall day open, tall night open, all with `?ship=1`.  List the file names in the Result so Nathan can open them on Beast.
8. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Build anything from steps 1b to 1g (no truck, driver, orders, items, drawer, or Stonks).
- Change the Machine, the Shop Floor, the economy, or the save format beyond what step 4 needs.
- Use files from any `not-for-game/` folder.
- Install anything.

## Done when

- With `?ship=1`, the Shipping button appears; the room shows in all four layout and theme combinations; the chain opens and closes the door with matching twins (no jump between closed and open).
- Without `?ship=1`, the game looks and behaves exactly as draft.69 did.
- The smoke test passes, and the six screenshots exist.

## Result (filled in by Claude Code)

Built 2026-11-22 by Claude Code (Opus 5.5) on Beast.  Version **v0.2.0-draft.70**.

**Art (`assets/packing/`).**  Resize only, no crop.  The masters are 1671x941 (wide) and 941x1672 (tall), so the copies match the Shop Floor backgrounds:

| File | Size | Weight |
| --- | --- | --- |
| `room_wide.webp` / `room_wide_open.webp` | 1600x901 | 252 KB / 246 KB |
| `room_wide_night.webp` / `room_wide_night_open.webp` | 1600x901 | 230 KB / 222 KB |
| `room_tall.webp` / `room_tall_open.webp` | 900x1599 | 247 KB / 238 KB |
| `room_tall_night.webp` / `room_tall_night_open.webp` | 900x1599 | 234 KB / 225 KB |
| `chain.webp` (`art.py sheet --keep-shape --size 900`) | 53x900 | 28 KB |

Twin check: in the masters, each closed and open pair differs only inside the door frame.  In the WebP copies, the largest difference anywhere outside the door is 21 out of 255 (compression noise, never visible).  The room images use the same WebP settings as `art.py` (quality 88); `art.py` has no plain resize command, so a short Pillow script did the resize.  Every file is listed in `docs/ASSETS.md`.

**Code.**
- New `js/shipping.js` (`GW.ship`): builds the room the first time the view opens, stacks the closed and open twins as two images (instant swap, no jump), and places the chain.  Night swaps through `GW.theme.img()` (the four pairs are added to `NIGHT` in `js/theme.js`, and a theme change redraws the room).
- `index.html`: a hidden "📦 Shipping" button beside the other two, and an empty `#ship` box in the machine box.
- `js/config.js`: `views` now includes `'shipping'`; new `shipping` block with `enabled: false`, `testParam: 'ship'`, the 720px breakpoint, both layouts (images, aspect, chain `x`, `top`, `h`, `hitW`), and the chain's pull size and timing.
- `js/main.js`: the view button, the swipe, and a saved `view: 'shipping'` act as if the view does not exist unless `enabled` is true or the address has `?ship=1`.
- `css/style.css`: the `ship-mode` box takes the room's aspect, like the Shop Floor (including the sideways-phone size rule), plus the chain's pull-down bounce.  With reduced motion, the bounce is half as deep with no overshoot.
- The door: a trusted `pointerdown` on the chain toggles it, with `GW.sfx.click()`.  It starts closed every time the view opens and is not saved.

**Calls I made that the order did not spell out (easy to change):**
1. **Taps in the shipping room don't crank the machine.**  The Shop Floor cranks on any tap; the room will need its taps for packing later, so here only the chain responds.
2. **Item pops are skipped in the room.**  The Machine view pops items from the hatch, which isn't on screen in the room, so they would fly out of the wall.  The shelf still flashes.  The "+N items" note is skipped there too.
3. **The chain has a wider invisible tap area** (`hitW`: 4% of the room wide, 9% tall).  The chain itself is only about 11 to 14 pixels wide on screen, too thin to hit with a finger.
4. **Chain placement:** the room art has no chain painted in, so I hung it on the wood just left of the door frame, starting at the pipe, with the handle about halfway down the door.  Wide: `x 76, top 5, h 59`.  Tall: `x 74, top 6.5, h 45.5`.
5. **Pointer only, as written:** the chain does nothing from the keyboard.  The gear accepts Space and Enter, so a keyboard player can't open the door yet.  Worth deciding before the view goes live.
6. **The chain has no night twin** (checklist row 03 says "Night twin: No"), so it stays bright brass at night.  It reads fine in the night screenshots.

**Checks.**
- `node tools/smoke-test.js`: "All clear." (desktop and phone, v0.2.0-draft.70).
- A scratch Playwright check (not committed) passed every item, in all four layout and theme combinations with `?ship=1`:
    - The Shipping button shows.
    - The room loads both twins at the right sizes.
    - The door starts closed; a real tap opens it, the next tap closes it, and leaving and coming back starts it closed.
    - A scripted (untrusted) tap does nothing.
    - The chain tap doesn't count as a gear tap.
- The same check without `?ship=1` also passed: the button stays hidden, a saved `shipping` view loads as the Machine, two left swipes stop at the Shop Floor, and no room art is downloaded.  With `?ship=1`, two left swipes reach Shipping.
- A sideways phone (844x390) shows the room sized correctly beside the shop panel.

**Screenshots for Nathan** (in `tools/out/` on Beast, all with `?ship=1`; wide = 1400x900 desktop, tall = 390x844 phone):
- `ship-wide-day-closed.png`
- `ship-wide-day-open.png`
- `ship-wide-night-open.png`
- `ship-tall-day-closed.png`
- `ship-tall-day-open.png`
- `ship-tall-night-open.png`

**Worth a look before it goes live:** on a 390px phone, the three view buttons wrap their labels onto two lines ("⚙️ The / Machine").  It only shows with `?ship=1` today.  Shorter labels or icons could fix it when the view is turned on for players.

**Docs updated:** `CHANGELOG.md`, `docs/ASSETS.md`, `docs/ARCHITECTURE.md` (load order, views, save, input), `docs/ENVIRONMENT.md` (`?ship=1`, repo layout), `docs/HANDOFF.md`, `docs/TASKS.md`, and a log line for rows 01 to 03 in the production checklist.

**Not built (per the order):** truck, driver, orders, items, drawer, Stonks.


## Review (Claudia, 2026-11-22)

Pulled 1d02545 and rendered the room in the cloud session at 1400x900 and 390x844, Day and Night, closed and open.  All eight states draw, the chain hangs from the pipe beside the door in both layouts, and the open twin swaps in with no visible jump.  The code is small and follows the rules: every number in `CONFIG.shipping`, trusted taps only, both twins preloaded, the door never saved.

Good calls the order did not cover, all accepted as drafts for Nathan: no cranking or item pops in the room, the wider invisible tap area on the thin chain, and the chain's place on the wood left of the door.

Open, for before the view goes live (not blocking 1b):
- The three view buttons wrap onto two lines on a 390px phone.
- The chain ignores Space and Enter, so a keyboard player cannot open the door.
