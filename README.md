# GeoGlyph — Locate 2026

This is the independent Locate 2026 conference edition, copied from the advanced GeoGlyph workspace. It retains ground-font map rendering, symbol and QR design, QR scanning, and Magic Eye workflows. The parent project is unchanged.

## Survey123 conference display

Open the app to start the conference presentation automatically: **Map → ArcGIS**, collapsed controls, an Australia overview, sleeping Geo prepared in Segoe UI Emoji/native colours/2D, and one-second polling. Submit `special_commands = Begin` to fly down to sleeping Geo over 30 seconds. `Reset` interrupts the presentation and restores the opening view, emoji and defaults while polling continues. After Begin, every new survey message fits after its final model is drawn; automatic fits preserve running animations. See [CONFERENCE_PRESENTATION.md](CONFERENCE_PRESENTATION.md) for survey fields, precedence, sizes, animation, queue and rehearsal instructions. Add `?studio=1` to use the usual authoring workflow without auto-start. No ArcGIS sign-in or token is used.

The configured public results view is:

`https://services.arcgis.com/BzylpWnjWP0tW4nL/arcgis/rest/services/survey123_03f5011529544723b64ad3f781a7e186_results/FeatureServer`

The app discovers the matching layer or table rather than assuming its ID. Conference startup uses the newest submission only as a baseline, without replaying old content or commands. It then queues newer Object IDs in order, including controls-only responses and repeated text. Each cue completes drawing, requested Fit and animation framing before the next begins; Reset takes priority and cancels older work. Stop pauses playback after an accepted cue finishes; Start resumes. Live queries use read-only POST `/query` to avoid shared public GET response caching. Checks never overlap. The polling interval is adjustable from 1 to 3600 seconds while running.

The source results layer can remain private. Share the results **view** with Everyone, keep editing disabled, and permit anonymous queries including anonymous submissions. Only expose fields and records intended for public access. This edition requests the approved cue fields, Object ID, creation date and WGS84 point, without credentials. See [Survey123 results sharing](https://doc.arcgis.com/en/survey123/analyze/sharesurveyresults.htm) and [hosted feature views](https://doc.arcgis.com/en/arcgis-online/manage-data/create-hosted-views.htm).

If several layers expose the field, select the intended results layer and press Fetch or Start. If a creation timestamp is unavailable, status explicitly identifies the Object ID ordering fallback. Access or schema errors stop polling with guidance; temporary network errors preserve the model and retry on the next polling interval. Settings restoration never restarts live updates automatically.

Conference configuration is in `src/scripts/survey-results.js`; verification evidence is in [LOCATE_2026_VALIDATION.md](LOCATE_2026_VALIDATION.md).

## Run and build

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open **http://localhost:4174**. JavaScript and CSS are served directly from `src/`; reload after editing. Re-run `npm run build` after changing the template, worker, 3D renderer, asset order or vendor files. The 3D renderer and mesh worker are bundled with esbuild.

```sh
npm run build
```

The build writes:

- `index.html`: development entrypoint referencing separate source assets.
- `dist/GeoGlyph.html`: portable application HTML.
- `GeoGlyph_Locate_2026.html`: the same portable application with the conference filename.

The portable HTML opens directly from disk. Font processing and QR operations are bundled; survey results, map tiles and optional interface web fonts need connectivity. Fonts selected by the user are not embedded in exported HTML or settings. The conference server uses port 4174 and browser settings use a `geoglyph-locate2026.` prefix, so this copy can run alongside the parent app.

## Source layout

The build also generates `src/fonts/conference-font-data.js` so the modular
`index.html` can open directly from disk. Keep the complete `src/` folder beside
that index. HTTP development continues loading individual font files; the
portable HTML embeds its font bytes and needs no companion files.

- `src/template.html` and `src/assets.json` define markup and execution order.
- `src/scripts/core.js` contains the original design workflows; `geoglyph-map-engine-inline.js` owns the map editor.
- `font-service.js`, `ground-geometry.js` and `src/workers/font-geometry-worker.js` implement shared lazy font preparation and geometry processing.
- `src/styles/app.css` contains consolidated component styles and shared theme tokens. MapLibre vendor CSS remains separate.
- `src/scripts/studio-ui.js` supplies shared colour editing, contextual palette targets and map settings integration.
- `src/version.json` is the version source; generated entrypoints and title callbacks use it.
- `src/vendor/` contains pinned runtime libraries and licence notices.

Edit source files, then build. The root standalone HTML and `dist/` are generated. The untouched starting application and checksum remain in `tests/fixtures/`. The extraction script refuses to overwrite an existing modular source tree.

## Font behaviour

The QR design workflow is named **QART**. Entering it from another workflow (or
using Send to QART) sets Logo size to 28%, Quiet zone to 1 and Backdrop to 95%.
These values use the current slider limits and remain editable. Section resets
use the QART defaults for their own controls; loading saved settings restores
their explicit values. The internal `qr` workflow identifier remains compatible
with existing settings.

In Font Explorer, Up/Down selects the previous/next font in the filtered list;
Left/Right moves one visible page through the character grid without changing
the selected character. These shortcuts leave editable fields and other panels
alone. Home/End and Page Up/Page Down retain character selection navigation.
The Symbol preview includes a pale grey crosshair option (`#D3D3D3`), selected by
default in a new session. Off hides the Symbol preview crosshair; choosing a
colour shows it again. Both colour and Off choices are retained for the session.

Scanning catalogues metadata without reading or parsing every font. Selected faces load on demand; rescans reuse identities. Import progress includes Stop loading and failed-face retry. Font lists and large glyph grids render visible windows, retaining search, Find selected, keyboard navigation and favourites.

Acquisition is limited to two simultaneous jobs. One embedded Blob worker handles parsing, character indexing and geometry. Source bytes, browser faces, glyph shapes and layouts use bounded caches; active faces remain pinned.

Ground fonts default to **fill and outline**, including Segoe UI Emoji Regular. Raster rendering recolours glyph alpha, so valid letters and colour emoji honour the chosen style. **Native font colours** preserves original colours while keeping the outline available; fill editing is disabled in that mode. Canvas, Map and QR paint values remain independent.

Outline geometry uses nonzero winding for counters and nested islands. A contour is enclosed only when its vertices are inside and its boundary does not intersect its parent; overlapping filled components, including crossbars in Sitka, are united before 2D rendering, GeoJSON export and 3D extrusion. This preserves counters and removes internal component seams without font-specific exceptions.

Unsupported font collections or complex contours use a styled decal when the browser can load the exact face. Status explains the fallback. GeoJSON export for decals is their footprint, not character outlines. Raster resolution is bounded; the editor reports when zoom exceeds texture resolution.

Settings include validated map design values, font identity and camera state. Credentials, font objects and caches are excluded. Missing fonts require reimport. Loading settings never resumes ArcGIS polling automatically.

QR controls appear in **QR → Palette & Gradient → Font Symbol** order, with independent collapsible sections and natural scrolling. The QR section places Correction above Content on the right, followed by the centred used/limit count, a spaced divider and Buffer edge colour/thickness controls. QR Pixel Mode and other controls stay on the left. Buffer edge editing enables when a cropped image logo is active. See [CSS_AUDIT.md](CSS_AUDIT.md) for shared classes/tokens, cleanup evidence and deferred stylesheet findings.

Magic Eye uses equal columns: QR Pixel Mode and blur on the left and the complete palette/gradient editor on the right. Scan reliability guidance occupies a compact, full-width single-line strip below the QR/Magic Eye preview, with full guidance available on hover or keyboard focus when space is limited. Symbol, QR, Magic Eye, Scan QR and expanded Map have Controls headers with **Expand all / Collapse all** actions. Individual section headings remain accessible when collapsed, and choices are remembered locally for each workflow. Font Explorer is excluded; Map's mini-panel layout is unchanged.

Scan QR has collapsible Scan actions and Results sections. **Clear Results** requeues imported images and removes their decoded values/errors while retaining image inputs, CSV/pasted values and current options. **Reset Module** clears all Scan QR inputs/results and restores its defaults without changing the QR designer. Both actions are disabled while importing, scanning or exporting; collapsing sections never stops these operations.

Symbol Preview groups the live font name and Unicode metadata beside its title. Six crosshair colour swatches and an Off option retain the choice for the browser session and affect only the preview overlay, never exported artwork. Export Symbol uses a compact panel with File name and Logo source side by side on wider screens and a top-right close button; Escape also closes the panel and restores focus to Export.

## Map placement and 3D

In authoring mode, the first successful character render after opening Map fits automatically once per page session. Conference survey messages each fit after drawing. Deliberate camera navigation or loading a saved view cancels a pending first fit. **Fit geometry** remains available at any time.

The geographic anchor remains fixed through zoom, pan, camera pitch, fitting, font changes, rendering detail and size edits. Click the map to place the character elsewhere, or load settings to restore a saved position. Automatic placement no longer follows the viewport centre.

Enable **3D extrusion** for validated outline fonts. Depth is measured in metres and initially uses 10% of the current character height. Tilt ranges from 0° flat to 90° upright; text bearing remains independent. **View in 3D** fits the complete mesh at a 55° camera pitch without moving its anchor. Depth, tilt, size and paint edits reuse the mesh. PNG/JPG map exports include 3D.

New 3D designs start with **Solid model** enabled: faces and sides are opaque and occlude rear surfaces. Disable it to use the existing opacity value. Leaving 3D restores that 2D opacity; the solid option never overwrites it.

**Start orbit** smoothly frames the model, then circles its actual elevated centre until stopped. The default is 30 seconds per circle, adjustable from 10 to 120. **Fixed** uses your original bearing and tilt; **Turn toward camera** preserves tilt while following the camera's heading; **Face camera square-on** automatically adjusts both angles. Automatic orientation also follows manual camera changes. These transforms never overwrite your original angles or anchor.

Manual camera navigation, placement, text and size edits, settings restoration, disabling 3D or leaving Map stop orbiting. Hidden tabs pause without jumping on return. Image exports pause the animation for capture and then resume it. Camera movement is excluded from design undo history.

Colour fonts and content requiring browser shaping retain their styled 2D image, with an explanation when extrusion is unavailable. Settings version 3 and undo include 3D, solid and orientation preferences; saved settings also include orbit speed and camera elevation, but never automatically restart animation. Older saved 3D designs retain their transparency, and older 2D designs restore in 2D. Three.js is bundled locally, including in the portable HTML. Meshes use a bounded 32 MiB worker cache, with a maximum of 1.2 million generated vertices per mesh; oversized content can be previewed in 2D.

Collapse the Map panel to reveal five shortcuts: **2D/3D**, **Orbit**, **Turn**, **Face** and **Random**. Orbit shortcuts enable 3D when needed; press the active mode again to stop, or another mode to change orientation while continuing the same orbit. Manual navigation and design edits also cancel an orbit that is still waiting for a font to finish loading.

Font changes prepare in the background while the displayed model and animation continue. Geometry and its font identity change together in one frame, retaining the anchor, speed and heading. During animation, the camera smoothly moves back for larger models and closer for smaller ones. Three prepared models, capped at 32 MiB, are retained for quick reuse. Unsupported fonts leave the current 3D model visible and identify both the selected and displayed fonts; switch to 2D to preview the selected font. Saved Map settings use the displayed model while a request is pending or unsupported.

**Random** uses the current catalogue's accessible font files, preserves the text or character, skips missing characters and unsupported outlines, and avoids immediate repeats. It resolves catalogue fonts from already-authorised local font metadata, searches asynchronously in batches of eight until it finds a compatible font or exhausts the eligible catalogue, and can prepare one next candidate during idle time. It never requests additional font permissions. The shortcut SVG icons are bundled locally from Lucide 0.475.0. The compact panel keeps two fixed rows with equal 10px outer padding; font and error feedback appears outside its layout. The header contains no loaded-font metadata. Map model presets use vivid colours independently of the control-panel and Canvas palettes.

Every manually requested Map **Fit** restores a readable view: top-down and aligned with the text in 2D, or a 55° pitch and three-quarter heading in 3D. Framing targets 80% of the Map canvas with 10% margins; the previous extra 2D zoom-out is removed. Animation framing uses the projected model across all headings, keeping wide messages closer than the former enclosing-sphere fit. Cached distances update smoothly for model and viewport changes. A Fit requested during a model switch waits for the latest model to finish. It stops orbiting and preserves the model’s anchor, bearing and tilt. Conference messages automatically fit after drawing while preserving a running animation; an explicit survey Fit stops it unless an animation is also selected.

Map Random and Survey123 Random both apply the closer Fit rule after the new
font artwork reaches a map frame, including when no new text is supplied. The
Map shortcut stays busy until framing completes. Automatic Random Fit preserves
the animation and anchor; an explicit Fit retains its stop behavior. Concurrent
Random, message and explicit Fit requests in one survey cue use one flight.
Cancelled or failed font changes do not automatically fit the previous artwork.

## Tests

```sh
npm test
npm run test:unit
npm run test:browser
```

`npm test` builds, runs Node tests and then Playwright Chromium tests. It starts a test server automatically. The browser report is written to `playwright-report/`.

This WSL environment reuses Chromium under `/usr/share/playwright` with project-local **Playwright 1.61.1**. The global CLI can be a different version; use the package scripts. If needed in another shell:

```sh
export PLAYWRIGHT_BROWSERS_PATH=/usr/share/playwright
```

On another machine without compatible binaries, run `npx playwright install chromium`. Core tests generate a small redistributable font. Optional real-font regressions also use installed DejaVu Sans and Windows Segoe UI Emoji. The conference presentation tests use the six approved private font files bundled in this edition; Esri fonts are not bundled. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Delivery stages

The inherited stages covered rendering correctness, loading responsiveness, modular sources, UI/CSS, stable placement and 3D animation. This conference edition replaces its ArcGIS message connection with anonymous public-view queries. Broader authentication changes for the parent application's protected services remain deferred.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for bundled-library information.

Map basemap coverage uses a guarded adapter for the bundled MapLibre 5.3 Mercator transform: automatic far clipping gains 10% headroom, and flat raster tile bounds stay at ground level when the camera targets an elevated model. Terrain bounds and manual clipping overrides retain native behavior. The adapter also handles the transform replacement during style initialization. Collapsed header actions share orange fills, black borders and 4px black gaps; the panel dimensions and model shortcut colours stay unchanged.
