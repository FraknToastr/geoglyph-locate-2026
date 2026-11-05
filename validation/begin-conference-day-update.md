# Begin script: Conference day opening and revised introduction

Validated locally on 2026-11-06. No commit or push performed for this update.

## Presentation changes

On Begin, a centred, responsive title in bundled Gill Sans appears over the map without replacing its artwork or survey content. Following the five-dot revision, it displays one dot immediately, then two, three, four and five dots at two-second intervals. The fifth dot remains for another two seconds. The title is removed and the existing descent starts after ten active seconds, once sleeping Geo is ready. Sleeping-artwork preparation runs alongside the countdown, so it does not delay the title's dot changes.

The title is approximately one-third larger on desktop: its font size is now `clamp(40px, 8vw, 128px)`, previously `clamp(32px, 6vw, 96px)`. The final two-second hold makes the former special animation-frame paint wait unnecessary; that wait was removed.

The post-descent emoji sequence is now 🥱 → 😶 → 😏 → mirrored 😏 → 😎. The first emoji still appears immediately after descent. The five-second hold before 😶 and the three-second holds before each 😏 and 😎 remain.

After `Call me Geo`, the text is now:

1. `Everything you about to see`
2. `was made by ChatGPT`
3. `including me!`

These are separate messages with the established five-second pauses. The first line preserves the supplied wording exactly. The script then resumes at `Today I will be presenting` and finishes with the existing Medium 3D Turn presentation of `Where are you Josh?`.

Emoji cues use Segoe UI Emoji with native colour enabled. Text cues use Gill Sans with native colour disabled. Only the second 😏 is mirrored. The DOM title uses white text and a subtle shadow; it does not modify the map's native-colour setting or generate ground geometry.

Implementation is in `src/scripts/conference-presentation.js` and `src/styles/map-controls.css`. No public API, service schema, dependencies or font-loading policies changed.

## Lifecycle and focused tests

The title uses the existing pause-aware introduction clock. Stop/Resume and tab visibility preserve remaining time, including the fifth dot's final hold. Reset and manual artwork changes remove it immediately. Leaving Map or an opening failure cancels its timers. Cleanup is tied to the owning title, so an older Begin cannot remove a newer Begin's overlay.

- **18 focused unit cases passed** using `rtk proxy node tests/unit/conference-introduction.test.cjs` (30.2 ms reported total). Coverage includes all five exact dot boundaries, the complete final two-second hold and descent at ten active seconds, slow sleeping-artwork preparation, opening failure, pause/resume, hidden time, Reset during the first and fifth dot holds, manual cancellation and newer-title ownership, Map exit, exact transcript/timings, native-colour flags, mirroring, queued cues and final Medium 3D Turn.
- **One short Chromium file-mode regression passed in 6.9 seconds** (7.8 seconds runner total), with accelerated timing and mocked map/service responses. It checked all five title texts, the bundled font, enlarged desktop size, centring, viewport fit, pointer pass-through and removal; the full revised transcript and final Turn state; then colour-only Response 169, location-only Response 184, repeated location and Reset.
- The title screenshot was visually reviewed at 1440 × 1000: `/tmp/geoglyph-begin-title.png`. Map imagery in this test was mocked. No real survey writes, network-failure exercise, soak or full browser battery was performed. Hosted and portable execution were not separately repeated; their source parity was checked below.
- Source syntax and `git diff --check` passed.

## Rebuilt local releases

The normal build regenerated both portable releases. `dist/GeoGlyph.html` and `GeoGlyph_Locate_2026.html` are byte-identical at **21,483,260 bytes**. SHA-256:

`9a389c9d777d6fd304e1dba10dd8dd913fef28b324eca025fb1a90e57dc7eb32`

All **43 script/style assets** match current source and are referenced by the modular entry point. No unresolved asset markers remain. The added work is bounded to one temporary title element, four dot text updates and existing timer scheduling. No frame-rate or resource-utilisation benchmark is claimed.

The previously published `eb43f5e` commit remains unchanged; this update is local pending user review and a new instruction to track, push and commit.

## Full-suite verification before the five-dot revision

Before the five-dot/banner-size follow-up, the user requested the full bounded battery: **224/225 unit cases passed; 166 browser cases passed, 11 failed and two optional profiling cases were skipped**. Those results describe the preceding three-dot build. The focused Begin case passed, but the application does not have a clean full-suite sign-off. See [the full results and failure assessment](full-battery-2026-11-06.md). The full suite was not repeated for this follow-up; its previously recorded failures remain outstanding. No soak or extended stability run was performed.
