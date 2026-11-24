# Work order: Calm motion setting, for desktop too (v0.1)

**Status:** Approved
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
