# Freeze the model when animation is interrupted

## Behaviour and cause

Turn and Face previously stopped their animation loop without leaving the camera-relative orientation mode. Subsequent camera movement could therefore continue rotating the stationary model. User interruptions now commit the last successfully rendered bearing and tilt and select Fixed orientation.

The renderer retains two angle values and a validity flag after a successful draw. Freezing uses that snapshot rather than a camera calculation that may be ahead of the visible frame. It preserves the geographic anchor, height and extrusion depth. Bearings are normalised within the existing stored-settings range. There is no additional per-frame pose calculation or geometry allocation.

Original user navigation events, stopping the active animation button, explicit camera exit, user Fit and relevant manual artwork controls request a freeze. Internal animation startup, automatic framing, visibility pause/resume, settings restoration and resource cleanup retain their existing stop behaviour. Before the first rendered snapshot, the current calculated pose is used if the model is visible. Control synchronisation is deferred so the user's requested angle or depth edit is applied after the frozen pose is committed.

Relevant source files: `src/scripts/ground-camera.js`, `src/scripts/ground-3d.js`, `src/scripts/geoglyph-map-engine-inline.js` and `src/scripts/studio-ui.js`. The separately pending location-only survey correction is preserved.

## Focused validation

- All **15 orbit lifecycle cases** and **6 render/pose cases** passed. They cover last-rendered pose selection, navigation event guards, restart, internal stop behaviour, pause/resume, first-frame fallback, successful-draw-only snapshots, angle normalisation and explicit input preservation. The final addition of `movestart` was checked by the lifecycle cases.
- The new short file-mode browser regression passed in **7.5 seconds**. Actual 3D text retained its world transform after Turn interruption and subsequent camera movement. Face button Stop, restart, explicit angle edits and camera exit also passed. Stops caused no additional mesh builds or GPU uploads, and the test reported no unhandled page errors.
- The existing Begin → colour-only update → location-only update → repeated location → Reset browser case passed in **6.1 seconds** alongside this work.
- The initial freeze browser attempt could not click a quick control hidden by the expanded editor. The test setup was corrected to collapse the editor before clicking the control; the corrected test passed. This was a test-fixture correction.

Browser checks used the local modular `file://` entry point, mocked tiles and service responses. User navigation was delivered through map events carrying `originalEvent`; physical keyboard and pointer navigation were not separately exercised. The final `movestart` addition was unit-tested without repeating the browser run. These checks do not establish real-service resilience or long-session performance. No soak or full test battery was run.

## Local release verification

The build regenerated the bundled 3D module and both portable releases. `dist/GeoGlyph.html` and `GeoGlyph_Locate_2026.html` are byte-identical at **21,481,330 bytes**, with SHA-256:

`50a51b5f24bef0453c5619a2648bf8fca1825d2d4c1bc391e9e6df634bccdd5e`

All **43 script/style assets** match their source and are referenced by the modular entry point. No unresolved asset markers were found. `git diff --check` passed. Portable/hosted browser execution was not repeated for this change.

Changes remain local and uncommitted. No push was performed; the previously published `e167ab1` release does not include these changes or the pending location-only survey correction.
