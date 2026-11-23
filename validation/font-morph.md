# Font morph validation — 13 November 2026

The map message workflow supports true shape interpolation between the five bundled monochrome fonts in flat 2D and solid extruded 3D. Playback, pause, replay, scrubbing, natural font spacing, outlines, opacity in 2D, mirroring, and switching dimensions are covered. The existing orbit retains its phase and camera ownership during preparation and playback.

## Checks

- Build: `rtk node scripts/build.cjs` passes; modular and standalone artifacts are rebuilt.
- Unit suite: 249 of 250 pass. The inherited presentation-startup test still extracts `startArcgisPolling` without its `arcgisAdminBusy` closure variable. That failure existed before the morph work.
- Renderer: ten Chromium/WebGL2 tests pass, covering changing holes and silhouettes, all orbit directions, actual surface depth, flat coverage union/opacity, side lighting, hardware/manual texture sampling, mirrored close views with and without outlines, texture sharing, and cancellation/disposal.
- Map integration and existing regressions: 38 Chromium tests pass, including the ten new map morph scenarios and 28 retained font, orbit, camera, export, undo, and control-layout checks.
- Both modular and standalone local-file entrypoints are checked separately for visible 2D intermediates and 3D rendering.
- All ten pairs of bundled outline fonts prepare finite fields for `B8 i\né`; endpoint bounds match the ordinary outline renderer.
- Playback and scrubbing leave worker mesh-build and GPU texture-upload counters unchanged. Superseded, failed, and cancelled preparations cannot replace the committed display.

## Desktop performance sample

Measured in headless Chromium at 1440 × 1000 using ANGLE/SwiftShader (a software GPU), opaque 3D text, no outline, 256-pixel glyph fields, and an active orbit. Each steady-state window lasts about 1.2 seconds. These short diagnostics do not guarantee a frame rate on every device or message.

| Message | Orbit only, median / p95 | Morph playback, median / p95 | Scrubbing, median / p95 | Preparation |
| --- | --- | --- | --- | --- |
| `B8 i Morph` | 16.7 / 17.2 ms | 16.7 / 17.4 ms | 16.7 / 17.4 ms | 273 ms |
| `Morph B8` + newline + `Fonts i` | 16.6 / 18.4 ms | 20.8 / 22.7 ms | 21.4 / 24.1 ms | 388 ms |

Short text reaches approximately 60 FPS; the multiline sample reaches approximately 48 FPS on this software renderer. Preparation includes staged texture upload and shader preparation while the previous display remains available. Native GPU performance still needs measurement in the user's browser.

Uploaded and colour fonts, contextual shaping/ligature substitutions, transparent 3D, and intermediate-shape exports remain outside this version. The UI explains unsupported requests and retains the prior display.

## Source selection repair

The morph panel now contains explicit From font and To font dropdowns, each offering the five supported fonts. Choosing From updates the main map Font menu. An incompatible current selection, including Segoe UI Emoji, leaves From unselected and shows guidance; Prepare and Play remain disabled until the pair and message mode are valid.

Twelve focused browser checks pass after this change, including reproduction with Segoe UI Emoji and the 3D-compatible font filter enabled, recovery through the From dropdown, playback, orbit continuity, cancellation, exports, and both local-file entrypoints. The desktop performance benchmark was unchanged and was not repeated for this control-only repair.
