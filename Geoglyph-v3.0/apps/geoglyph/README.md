# GeoGlyph — Locate 2026

This is the independent Locate 2026 conference edition, copied from the advanced GeoGlyph workspace. It retains ground-font map rendering, symbol and QR design, QR scanning, and Magic Eye workflows. The parent project is unchanged.

## Font morphing on the map

Choose **Message** mode. In **Font morph**, choose **From font** and a different **To font**, then **Play** or drag **Progress**. Both dropdowns offer the bundled outline fonts. Choosing From also updates the map's main Font menu. Emoji fonts such as Segoe UI Emoji cannot be morphed. **Prepare** rebuilds a pair after editing the message. Duration defaults to two seconds. **Clear** restores the source font. The built-in choices load when you enter the morph controls.

Morphing supports flat 2D and solid extruded 3D, including colour, outlines, mirroring, tracking and multiline text. Letters reshape and change their natural widths around a fixed geographic anchor. An existing 3D orbit keeps its clock and camera motion; morph playback does not rebuild meshes or upload geometry each frame. Switching between 2D and 3D retains progress and pauses playback without automatically fitting the camera.

The font pack includes Gill Sans, Forte, Chiller, Magneto, Showcard Gothic and the additional outline faces used in the rehearsal. Uploaded fonts, colour/emoji fonts, contextual shaping/ligature substitutions, and transparent 3D are rejected with an explanation. PNG/JPG and GeoJSON exports are available at the two endpoints; intermediate morph export is disabled. GPU texture memory and message length are bounded, and an unsuccessful preparation preserves the current display.

The implementation prepares per-glyph signed-distance fields in an isolated, cancellable font worker. A shared WebGL2 renderer interpolates their shapes and spacing. Flat text uses unioned coverage so overlapping strokes receive opacity once; 3D uses ray-traced extrusion with actual surface depth. Performance depends on message coverage and the GPU; the desktop target is 60 FPS, rather than a guarantee for every message or software renderer.

Targeted verification: `rtk node --test tests/unit/font-morph-fields.test.cjs tests/unit/font-morph-service.test.cjs tests/unit/render-pose.test.cjs` and `rtk node node_modules/@playwright/test/cli.js test tests/browser/font-morph.spec.cjs tests/browser/font-morph-renderer.spec.cjs --workers=1`.

## Survey123 conference display

Open through the [launcher](../../index.html), directly, or through the standalone file. Ordinary entry selects **Message** mode with a full sidebar and Message expanded. `special_commands = Launch Geoglyph` opens the app from the launcher in **Geoglyph** mode with the mini control panel. **Polling is stopped by default.** Choose **Start** for one-second live polling, or **Fetch** for one request. Submit `special_commands = Begin Geoglyph` to open the app if needed and play the Locate 2026 rehearsal. In the open app, this command preserves the current panel visibility and full/mini choice. `Reset` interrupts it and restores the opening view, emoji and defaults while polling continues. See [CONFERENCE_PRESENTATION.md](CONFERENCE_PRESENTATION.md) for details. Add `?studio=1` to use the usual authoring workflow without the conference opening.

## Editable scripts

The first main-header button, **Geoglyph**, opens the map workspace and remembers the last sidebar mode. **Canvas** always opens the canvas and keeps its label. Clicking Geoglyph while already viewing it preserves playback and the camera.

**Geoglyph** mode contains **Geo's Script** and **Survey123**. **Message** mode contains Message, Font, 3D, Font Morph, Style and Basemap & Export; **ArcGIS** contains Survey123 sign-in and administration. The shortcut bar appears between the header controls and mode buttons and remains available in the mini-CP. Light theme uses white sidebar and header backgrounds; buttons retain their themed styling.

Message is the first section in Message mode. It starts expanded and remembers your expanded/collapsed choice across mode changes and reloads. Opening Geoglyph highlights its own navigation button; Symbol remains inactive while the map is visible.

Fresh maps show Australia including Tasmania. The map's **Australia home view** button returns to that north-up overview without changing the message, font or stamp location. Home stops current script/camera motion and orbit. Explicit saved camera views take priority on restoration; **Fit** still frames the current artwork.

The **Geo's Script** section contains the editable conference introduction. Choose **New** for a blank script. Each row reserves four action slots followed by a multiline message field. Click **+** to choose and configure an action; another plus appears until all four slots are used. Click an action to edit or remove it. Empty messages retain the current text; unmentioned settings carry forward. The lower row provides hold duration, selection, insertion, movement, duplicate and delete controls. Narrow windows scroll the row area horizontally to preserve alignment, while vertical wheel input scrolls the sidebar.

Script rows silently update the shared Message renderer and its controls while Geoglyph stays selected. Emoji use bundled colour fallback fonts, including a small Noto flag subset; joined sequences remain intact. Mixed messages retain the selected font and fill for ordinary text and original colours for emoji, even with a Colour action. The font colour flag is recalculated on every row. Colour emoji remain 2D; unsupported extrusion or morph rows report an error and preserve the last successful artwork.

Font, colour, rendering mode, animation, size, depth, tilt, bearing, mirroring, Fit, font morph, title overlays, waits and camera actions are supported. Pickers are modal and edit only the draft. Font badges distinguish verified 2D/3D support from unverified 3D capability. 2D with Orbit/Turn/Face is rejected; 3D and morph eligibility use the existing rendering rules.

In **Camera action**, choose **Custom camera flight** and **Pick Start** or **Pick End**. The modal moves out of the way while you pan, zoom or tilt the map and click a location. Each point records the clicked centre and the current zoom, pitch and bearing, without moving the stamp or changing text extrusion. The map toolbar lets you replace either point or **Return to Camera Action**, even before both are picked. Cancel discards uncommitted points and restores the view from before editing.

Choose a flight duration from 0.25 to 300 seconds (default 5), then Preview or Apply. Preview uses the map with Stop Preview and Return controls. Script playback flies from Start to End, then holds that view; the row's hold duration starts after arrival. Orbit remains stopped until another animation action starts. Stop, Next, Home and leaving Geoglyph cancel the flight. Reduced motion jumps to End. Endpoints and duration are saved in version 1 script JSON; existing camera actions remain supported.

**Play** starts at the selected row. **Pause** stops row advancement while animations continue. **Next** advances one row, including while paused. Hold duration starts after the row is ready and defaults to five seconds. **Stop** cancels pending work and freezes script-owned animations. Manual script playback stops polling; manually starting polling stops script playback. Loading a script never starts it.

**Save JSON** and **Load JSON** exchange version 1 script documents. Invalid files leave the draft intact. Drafts also survive reload in local storage, without automatic playback. Fonts are referenced by identity and must be available on the receiving machine. **Reset intro** restores `src/scripts/introduction.json`. Survey123 Begin Geoglyph runs `src/scripts/locate-2026-rehearsal.json` through the same player, independent of the saved draft. Rebuild to include rehearsal JSON edits in Survey123 playback.

The configured public results view is:

`https://services.arcgis.com/BzylpWnjWP0tW4nL/arcgis/rest/services/survey123_03f5011529544723b64ad3f781a7e186_results/FeatureServer`

The app discovers the matching layer or table rather than assuming its ID. The first manual poll uses the newest submission only as a baseline, without replaying old content or commands. It then queues newer Object IDs in order, including controls-only responses and repeated text. Each cue completes drawing, requested Fit and animation framing before the next begins; Reset takes priority and cancels older work. Stop pauses playback after an accepted cue finishes; Start resumes. Live queries use read-only POST `/query` to avoid shared public GET response caching. Checks never overlap. The polling interval is adjustable from 1 to 3600 seconds while running.

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

Map controls occupy an independent left sidebar below the header, reserving 425px on desktop and at most 62.5% of the window on narrow screens. Click the **UOS logo** to hide or restore the controls. The internal **− / +** button switches between the full sidebar and the existing floating mini panel. Visibility and full/mini choices survive Map/Canvas switches for the current session and reset on reload; the logo is disabled outside Map. Font Explorer temporarily replaces the controls with its 50/50 split. Closing Explorer restores the previous choice; clicking UOS while Explorer is open closes Explorer and shows the remembered full or mini controls. These layout changes resize the map while morphing and orbiting continue.

The three map modes are **Message**, **Geoglyph**, and **ArcGIS**. Older Character-mode settings open as a one-character Message. Message mode places its Message section first, followed by Font and its font-loading controls, 3D, Font Morph, Style, and Basemap & Export. Each section can collapse independently. The Fit icon beside the full sidebar's collapse button frames the current geometry.

**OBJ** exports the displayed 3D outline object, including either font-morph endpoint. Intermediate morph shapes cannot be exported; move Progress to 0% or 100%. Files contain triangles and normals in metres, with X east, Y north, and Z up, relative to the map anchor at ground level. Size, depth, mirroring, and the current bearing/tilt are included; map tiles, colours, and screen-space outlines are excluded. Export preparation leaves the displayed model, morph position, and orbit animation running.

Authoring opens at the Australia overview and keeps that view as artwork loads. Conference survey messages each fit after drawing. Loading a saved camera restores its view. **Fit geometry** remains available at any time.

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
