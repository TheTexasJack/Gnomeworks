# Work order: Calm motion setting, for desktop too (v0.1)

**Status:** Done
**Written by:** Claudia, 2026-11-23.  **Approved by:** Nathan, 2026-11-23, with the draft wording ("all ok!").
**Model:** Opus 5.5

## Goal

Alex's request: let any player pick the game's calm mode, the gentle motion phones get when the device asks for less motion, from a switch in the Info tab.  Today only the device setting turns it on, so desktop players can't get it.

## Nathan's words (2026-11-23)

- "I've received a request from Alex.  She likes the minimal animations that are on the phone when the accessibility "no animations" is set.  She wants something similar on desktop.  lets add that in the Info tab."

## Read first

- `CLAUDE.md`.
- Every place the game checks for reduced motion: `prefers-reduced-motion` in `css/style.css` (about 15 rules) and `matchMedia('(prefers-reduced-motion: reduce)')` in `js/ui.js`, `js/wild.js`, `js/clones.js`, `js/main.js`, `js/shipping.js`, and `js/hunt.js`.
- The Info tab in `index.html` (`#motionNote`, the setting checkboxes such as `#hintsOn` and `#chatterOn`) and where those settings are saved.

## Do

1. `git pull` in `/srv/GW/Gnomeworks`.
2. **One switch in the Info tab,** with the other settings: **"Calm motion (gentle animations, like a device set to reduce motion)"** (Claudia's wording, approved by Nathan).  Off by default.  Saved like the other settings.
3. **One question, asked everywhere:** add a single helper (for example `GW.calm()`) that is true when the device asks for less motion **or** the switch is on, and use it in every JavaScript check that reads `prefers-reduced-motion` today.  When either one changes, everything that listens for the device setting (the Shop Floor gnomes' poses and the rest) updates at once, with no reload.
4. **CSS:** a class on the page (for example `calm` on `<html>`) while the switch is on, and every `@media (prefers-reduced-motion: reduce)` rule also applies under that class, so the switch gives exactly what the device setting gives.  No rule may be missed; list the count in the Result.
5. **The device still wins:** if the device asks for less motion, the game stays calm whatever the switch says; the switch shows as on and can't be turned off, with a short note saying why.  Update `#motionNote` to match both cases (Claudia's wording, approved by Nathan): device on, "Your device is set to reduce motion, so the game uses gentle animations."; switch on, nothing extra.
6. Every word in `js/config.js`.  Bump `GW.VERSION` to the next draft number, run `node tools/stamp.js`, add a `CHANGELOG.md` entry, update `docs/ARCHITECTURE.md`, and update `tools/smoke-test.js`: with the switch on (and the device not asking), the helper is true, the page has the class, a sample of the calm rules apply (the Shop Floor gnomes swap poses, the chain's glow is steady, a slip's glitter doesn't move), and it survives a reload; with it off, normal motion returns; with the device emulating reduced motion, the switch is locked on.  Run it.
7. **Screenshots** into `tools/out/`, desktop: the Info tab with the switch off, on, and locked on by the device; and a short note in the Result on what visibly changes on desktop with it on.
8. In the Result, record how long the build took.
9. Fill in the Result, set Status to Done, commit, and push.

## Do not

- Change what calm mode does; this only lets players choose it.
- Install anything.

## Done when

- A desktop player can turn on Calm motion in the Info tab and gets the same gentle motion as a phone set to reduce motion, without a reload, and it is remembered.
- The device setting still forces calm mode.
- The smoke test passes and the screenshots exist.

## Result (filled in by Claude Code)

**Built:** v0.2.0-draft.100, 2026-11-23, by Claude Code (Opus 5.5).

- **The switch:** in the Info tab's Look section, under Theme: "Calm motion (gentle animations, like a device set to reduce motion)".  Off by default, saved in `localStorage` as `gnomeworks.calm` (beside `gnomeworks.hints` and `gnomeworks.theme`).  The note under it (`#motionNote`, moved from the How to play section so it sits by the switch) reads "Your device is set to reduce motion, so the game uses gentle animations." only while the device asks; with just the switch on it is empty.  Words in `CONFIG.motion`.
- **One question:** new `js/motion.js` (`GW.motion`, `GW.calm()`).  Every JavaScript check that read `prefers-reduced-motion` now asks `GW.calm()`: `ui.js` (Shop Floor poses, the Megagnome's jiggle), `wild.js`, `clones.js`, `hunt.js`, and the 13 checks in `shipping.js`.  `main.js` had no motion check, only the game report, which now records `reducedMotion` (the device), `calmMotion` (the switch), and `calm`.  `GW.motion.onChange()` fires when either the device setting or the switch changes; the switch and the note listen to it.  Every other check is read at the moment it animates, so a change applies at once with no reload.
- **CSS:** while calm, `<html>` has the `calm` class (an inline script in `index.html` sets it before anything draws, like the Night class).  **15 `@media (prefers-reduced-motion: reduce)` blocks holding 17 rules,** each followed by a twin under `:where(html.calm)`; 15 blocks and 17 twins, none missed.  `:where()` adds no specificity, so each twin wins and loses exactly where its media rule does (the instructions-off rules still beat the calm slip glow, for example).  The chain's calm pull keyframes moved out of their media block so both can use them.
- **The device wins:** with the device asking for less motion, `GW.calm()` is true whatever the switch says, and the switch shows checked and greyed out (disabled), with the note above.  When the device lets go, the switch goes back to the player's own setting.
- **Smoke test:** new `calmCheck` (desktop, own context): off by default with normal motion (the chain sways, glitter twinkles, the Shop Floor parts squash and boing); switch on gives `GW.calm()`, the `calm` class, a steady chain, still glitter, and Shop Floor gnomes that only swap poses (no squash or boing animations, `act` pose swaps seen); it survives a reload; off brings normal motion back; Playwright's reduced-motion emulation locks the switch on with the note, through a reload too, and lets go when emulation ends.  Full run: all clear.
- **Screenshots** (desktop, 1400x900, in `tools/out/`, not committed): `calm-info-off.png`, `calm-info-on.png`, `calm-info-locked.png`.
- **What changes on desktop with it on:** the Shop Floor gnomes swap to their action pose and back, slower, instead of squashing and bouncing; the Megagnome's belly jiggle stops; the TAP ring, the crew strip, shinies, and the robot jam stop pulsing; the next-item ticker bar holds still; Wild Magic targets hold still with a steady glow; Clone Attack clones, the arrow, and the alert hold still; the hunt's boss tag holds still and its bursts are instant, and the prey stop bobbing as they run.  In the Packing Line: the chain glows without swaying, glows (belt, computer, driver, clipboards, bookshelf, unstamped slips) are steady, glitter holds still, the door crossfades instead of rolling, and boxes slide and shake gently.
- **Left open:** the existing settings in the Info tab still run inline after each other (Theme and the switch did too; the switch now sits on its own line).  The `gnomeworks.calm` key is written in the inline script in `index.html` as well as `CONFIG.motion.key`, as the theme key already is, since that script runs before `config.js` loads.
- **Build time:** about 16 minutes (23:08 to 23:24 CST, from the pull to the second all-clear smoke run; each full smoke run takes about 6 minutes).

