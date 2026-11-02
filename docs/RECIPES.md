# Recipes

Every recipe ends the same way: bump `GW.VERSION` in `js/config.js`, add a line to `CHANGELOG.md`, run `node tools/smoke-test.js`, commit, push.

## Add a junk item

1. Pick an emoji and find its Twemoji file: lowercase hex codepoints joined by `-`, with `fe0f` dropped (for example 🧦 is `1f9e6.svg`).
2. Copy the SVG from a Twemoji checkout (`assets/svg/`) into `assets/emoji/`.
3. Add a line to `items` in `js/config.js`:
   `{ id: "rubber_duck", name: "Rubber Duck", group: "toys", tier: "common", emoji: "🦆" },`
4. The shelf, drops, and counts pick it up automatically.

Skip flags, people, hand gestures, skin tones, religious or political symbols, and anything like weapons-for-real or drugs.  It is a public store game.

## Add a Tiny Monster form or a new family

1. Slice the art: `python3 tools/art.py sheet sheet.png --out assets/monsters --names newt_normal newt_glowing ...`
2. Add an item per form, with `group: 'monsters'`, `family`, `variant` (normal, glowing, goopy, evil), the tier (normal = rare, glowing and goopy = superrare, evil = legendary), and `img`.
3. Names are 9 letters or less, punny, and checked for weird word combos.

## Add a gnome type (producer)

1. Art from Mara: a static/action pair (with its little machine), plus a gear-framed badge.
2. `python3 tools/art.py pair pair.png --names golem_static golem_action --out assets/crew`
3. Badge: `art.py sheet` (or `fit`) into `assets/icons/icon_golem.webp` at 192.
4. In `js/config.js`:
   - `producers`: `{ id: 'golem', icon: 'icon_golem', name: 'Golem Pilot', desc: '...', baseCost: 1600000, growth: 1.15, rate: 1400, unlock: { cogsSeen: 1000000 } }`
   - `floor.stations`: `golem: { label: 'Golem', slot: 5, parts: [{ img: 'golem_static', h: 17 }] }` (slots 0 to 11, bottom row first; 0 to 4 are taken)
   - `hats.spots`: add `golem_static` and `golem_action` positions if he should wear the hat.
5. In `js/state.js`, add the id to `SOURCES` so its clicks show in Stats.  Add a Stats row in `ui.js` `updateStats`.
6. Optional: a chatter sound in `js/sfx.js` `chatter()` under the new id.
7. Check the floor screenshot from the smoke test at both sizes and adjust `h`, overlap, and hat spots.

## Add a hat

1. Art: one hat, worn view (no inside of the brim showing).  `art.py fit` into `assets/hats/hat_<id>.webp`.
2. `hats.byMonth` in `js/config.js`: `1: { id: 'party', name: 'Party Hat' },`
3. Preview with `?hat=party`.  If it sits wrong on everyone, the hat's own canvas has extra space: re-crop it before touching `hats.spots`.

## Tune the game

Everything is in `js/config.js`: costs, rates, odds, shiny timing, offline cap, pity counts, tier weights.  Change numbers, reload, play.  Use `?debug=1` for cogs and instant shinies.

## Start a new season (wipe all player progress)

1. Raise `season` in `js/config.js` by one.
2. Ship it.  Every player's save resets on their next visit with a "new season" message.
3. Once accounts and a leaderboard exist (v0.3), the server data needs its own reset steps, documented then.

## Ship a release

```
# 1. bump GW.VERSION in js/config.js (and the version line in README.md)
# 2. add the top entry to CHANGELOG.md
node tools/smoke-test.js
git add -A
git commit -m "v0.2.0-draft.N: short description"
git push origin main
# 3. wait 1 to 10 minutes, then Ctrl+Shift+R on the live site and check the footer version
```

## Move the repo to a new home

1. Create the GitHub Organization (or account) Jarrett picks.
2. Repo Settings, Transfer ownership, to the new owner.
3. In the new location: Settings, Pages, Deploy from a branch, `main`, root.
4. Optional custom domain: add it under Settings, Pages, and add a CNAME DNS record pointing at `<owner>.github.io`.
5. Update the game link in `README.md`, `docs/README.md`, and the Wix embed.
6. Everyone's save resets at the new address (saves belong to the address).  Do this once, before launch.
