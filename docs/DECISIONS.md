# Decisions

Why the game is the way it is.  Newest first within each day.

## 2026-11-02

| Decision | Why |
| --- | --- |
| Megagnome is one per player, spends event charges on his own, and charges come from a crossbow hunt that costs cogs per shot | Idle pull for events, a cog sink, and real effort up front so auto-help is earned.  Feeding him gnomes was dropped: it broke price math, and real play showed counts stay under 100. |
| Hunt prey is wild game, not Tiny Monsters | The monsters are the collection; shooting them feels wrong |
| Event instructions can be turned off (Info > Look) | Experienced players may not want the big signs |
| Clone Attack sends 4 clones, with a big sign and a "Drop here!" arrow | Jarrett's playtest: 2 was too easy, and the vat drop wasn't obvious |
| Clones never steal from someone who isn't on the Shop Floor | Losing junk you couldn't see is unfair; they give up after 20 seconds |
| Night theme, Auto by default, Evil saved as a future unlockable skin | Night is what people expect from dark mode; Evil is louder, better as a reward |
| Recorded sounds allowed for a few moments (splash, clone giggle) | A real splash and Alex's giggle beat the synth; code-made fallbacks stay |
| Wider desktop layout (1800px) with side rails | Wide screens had dead gutters, and the next-item gauge and crew were below the fold |
| Junk groups are 12 items (4 per shelf row) | Full rows on phones and desktop |
| Clipboard panels (Mara's art, sliced in code) | Worksite feel while keeping the wood |
| Wizard spins in place with only his own painted magic | The extra swirl was too much; saved for Wild Magic |
| Every Packing Line and Megagnome number goes through a math pass before code | Both touch the whole economy |
| Move the repo off Nathan's personal GitHub before sharing (Jarrett picks the name) | The account name shows in the game's address.  Saves are tied to the address, so the final home must be set before launch. |
| Badges redrawn with red beards | Match the red-haired Shop Floor gnomes |
| Hats go on the floor gnomes per month; skeletons and dolls stay hatless | Mara's hats fit the gnome heads; the others have no single head to place them on |
| Sound effects synthesized in code, music left to Jarrett | No files, no licenses, tiny download.  Music is a brand choice. |
| Sounds mix with the player's own music on iPhones | Many players will run Spotify or similar; a game tap sound must not pause their music |
| Players can bring their own music by muting game sound; no embedded Spotify or YouTube | Embeds bring logins, 30 second previews, ads, and nested iframes inside Wix |

## 2026-11-01

| Decision | Why |
| --- | --- |
| Shop Floor view with one station per gnome type, HELP WANTED on empty stations | Shows the whole crew at once without cluttering the machine, and empty stations hint at what is next |
| Two-frame squish-and-boing animation | Swapping frames mid-squash hides the small differences between two AI-drawn frames |
| Warrior weapons and hats pinned on in code | One warrior drawing serves six weapons; one hat serves every gnome |
| Tinier Gnome became the Gnome Necromancer with a skeleton crew | Funnier, and it gives that tier its own look.  Same cost and speed, saves unaffected. |
| Added Cloner and Matryoshka gnome types | Five producers is the minimum for a clicker curve; more come from the proposal |
| Shinies appear whether or not you tap; only gold (hot) shinies can be Legendary | Idle players still get Super Rares; active tapping is rewarded without requiring endless clicking |
| Rarer drops 50% more common | Tester feedback that rares felt absent |
| Tiny Monsters as 4-form families (normal, glowing, goopy, evil) | A collection structure players can read at a glance, with visible gaps to hunt |
| Short punny monster names, 9 letters or less | Fit on shelf tiles and feel playful |
| Junk items are emoji (Twemoji), special items are Mara's art | Hundreds of items for free; the art style itself signals rarity |
| No reset button on the server side; seasons wipe player saves by config | A hidden admin button is a security hole; a written procedure is safer |
| Guest play saves in the browser only | Everyone can play with no account; progress survives reloads |
| Plain HTML, CSS, and JavaScript, hosted on GitHub Pages, embedded in Wix with "Embed a site" | Free, no build step, and Wix needs only one element |
| Every number lives in `js/config.js` | Nathan and Jarrett can tune without reading code |
| Visible version number, bumped on every change | Avoid ever shipping or discussing the wrong version |

## Standing rules

- **No gambling mechanics.**  No wheels, slots, shell games, loot boxes, or real-money purchases.  Random drops stay free and earned by play.
- Real fingers only for anything rare: scripted clicks are ignored everywhere.
- Kid-friendly content.  Cartoon spooky is fine (the shop's owner decides edge cases).
- Phone first: every interaction must work with one thumb.
