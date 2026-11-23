# Work order: Packing Line 1a, the shipping room and door (v0.1)

**Status:** Draft
**Written by:** Claudia, 2026-11-22.  **Approved by:** (waiting on Nathan)
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

