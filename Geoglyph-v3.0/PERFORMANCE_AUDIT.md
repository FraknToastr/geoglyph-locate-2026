# Geoglyph v3.0 performance and dependency audit

**24 November 2026 · Baseline commit `5797ddc` · WSL workstation**

This audit covers the v3.0 launcher and its four apps. Browser measurements use a clean, isolated copy of the committed v3.0 tree. The disk inventory also identifies local datasets and the supplied ShadowTime package in the working copy. Source paths below are relative to `Geoglyph-v3.0/`.

## Priorities

| Rank | Area | First change to evaluate | Effort |
| --- | --- | --- | --- |
| 1 | Launcher startup | Defer the remote-control QR image until it opens and serve appropriately sized logo artwork. | Small |
| 2 | Umbramatic raster rendering | Budget the image cache in bytes and move mask recolouring off the frame path. | Medium |
| 3 | Transitron playback | Update visible report tables independently of map and recorder updates. | Medium |
| 4 | Geoglyph startup | Keep the opening font ready and preload the rest of the rehearsal pack before Begin. | Medium |
| 5 | Panoptigon selection and imports | Separate view selection from geometry changes. Budget parsed geometry and textures. | Medium |
| 6 | Release packaging | Generate the large single-file and direct-file releases from one build pipeline. | Medium |
| 7 | CSS | Consolidate local panel, button, and theme roles in stages. | Small to medium |
| 8 | GPU follow-up | Isolate export readback and scale high-DPR work where the hardware trace shows a cost. | Medium |

## Measurement setup

- **Primary renderer.** Headless Chromium 149.0.7827.55 on WSL2, AMD Ryzen 9 7950X3D, Mesa 25.2.8, and ANGLE OpenGL backed by D3D12 on the NVIDIA RTX 4090. Chromium's device report showed WebGL enabled. The primary viewport was 1440 × 900 CSS pixels at device pixel ratio 1.
- **Software rendering.** The default headless session reported SwiftShader. Additional WSL OpenGL and Vulkan probes initially reported llvmpipe. The hardware run used the process-local settings below. Use the browser's reported renderer to confirm each repeat.
- **Isolation.** The app pages came from a Git archive of this commit, served on loopback. Font files and app bundles were the committed ones. The probes supplied fixed 256 × 256 tiles, a synthetic Survey123 results layer, and fixture GTFS responses. Transitron and Umbramatic used their exact pinned MapLibre downloads. Live service checks are reported separately.
- **Metrics.** Startup is navigation to each app's ready condition. Cold is first navigation in a clean browser context. Repeat is a second navigation in the same context with the server's cache policy. Frame intervals from `requestAnimationFrame` approximate frame pacing. CDP TaskDuration measures renderer main-thread activity. Post-GC JavaScript heap excludes native image, worker, driver, and GPU allocations. Texture estimates use dimensions and bytes per texel for a single copy.
- **Inputs.** The Geoglyph run played the shipped 31-cue rehearsal and finale. Panoptigon used two 4096 × 2048 JPEGs, two WGS84 points, and twelve EPSG:7854 OBJ grids at 3,200 triangles each. Transitron used a synthetic 600-vehicle feed and a 240-frame recording with 30-second captures and a 10-minute gap. Umbramatic used the tracked sample and a separate six-frame, 16-tile-per-frame WebP export with 640 × 640 tiles.

```sh
rtk proxy env GALLIUM_DRIVER=d3d12 MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA \
  LD_LIBRARY_PATH=/usr/lib/wsl/lib AUDIT_HARDWARE=1 node /tmp/geoglyph-v3-performance.rM7jE1/audit.cjs
```

The command above uses this workstation's temporary probe and fixture directory. The Playwright launch arguments for this renderer were `--use-gl=angle --use-angle=gl --enable-unsafe-swiftshader`. A headed rehearsal with live imagery and the Windows browser remains a release check because all timings here come from the isolated WSL session.

## Hardware baseline

### Startup

| App | First ready | Repeat ready | First → repeat transfer |
| --- | ---: | ---: | ---: |
| Launcher | 788 ms | 296 ms | 19.15 → 19.15 MiB |
| Geoglyph | 815 ms | 617 ms | 20.37 → 20.37 MiB |
| Panoptigon | 619 ms | 217 ms | 3.23 → 3.23 MiB |
| Transitron | 1,098 ms | 280 ms | 2.03 → 0.95 MiB |
| Umbramatic | 323 ms | 163 ms | 1.18 → 0.14 MiB |

Each pair is one first-and-repeat observation. Transfer includes app resources and the pinned CDN packages served from local fixtures. The loopback server sends `no-cache` on app resources. The CDN fixture allowed a cache hit. Repeated timings can also benefit from a warm process and OS disk cache. Transitron readiness was map initialization behind the intro screen.

### Interaction and memory

| Hardware scenario | Main-thread tasks | Frame interval p50 / p95 / p99 | Long tasks ≥ 50 ms |
| --- | ---: | ---: | ---: |
| Launcher moving, 6 s | 1,223 ms | 16.7 / 16.8 / 16.8 ms | 0 |
| Geoglyph rehearsal, 148 s | 14,695 ms | 16.7 / 16.7 / 16.8 ms | 3, max 150 ms |
| Geoglyph finale morph and orbit, 14 s | 2,043 ms | 16.7 / 16.7 / 16.8 ms | 0 |
| Panoptigon import, 0.50 s | 427 ms | 16.7 / 16.8 / 100 ms | 1, 109 ms |
| Panoptigon eight photo selections, 1.58 s | 461 ms | 16.7 / 16.8 / 66.6 ms | 2, max 67 ms |
| Transitron compressed load, 0.42 s | 380 ms | 16.7 / 133.3 / 133.3 ms | 1, 147 ms |
| Transitron 60× playback, 16 s | 2,034 ms | 16.7 / 16.8 / 16.8 ms | 0 |
| Umbramatic 16 tiles per frame at 2×, 9 s, original | 1,536 ms | 16.7 / 16.7 / 16.8 ms | 0 |
| Umbramatic 16 tiles per frame at 2×, 9 s, tinted | 4,322 ms | 16.7 / 16.8 / 50.0 ms | 0 |

- **Geoglyph.** All 31 cues reached the waiting phase, including the camera approach, 2D language morphs, and 3D part of the sequence. The full rehearsal recorded 5,951 map renders, 29 frame intervals above 25 ms, and seven above 50 ms. The finale recorded 840 map renders in 14 seconds with no intervals over 25 ms. Post-GC heap went from 12.37 MiB before the rehearsal to 16.74 MiB after it, then fell to 15.87 MiB after stopping and clearing. Caches and retained scene state are possible contributors. A single lifecycle is insufficient to establish heap growth.
- **Panoptigon.** Eight view selections produced 92 GeoJSON source writes. Of those, 24 targeted the stable point, cone, and label sources. Four basemap switches produced 28 more writes while recreating the style. The static viewer produced zero map renders over six seconds. Post-GC JS heap was 10.72 MiB before import and 14.24 MiB after clearing the live viewer and models. Source packs remain registered for the workspace, and JS heap misses decoded textures and geometry buffers.
- **Transitron.** Four live refreshes submitted 2,400 vehicle features across four full source writes. The 60× playback sample submitted 20,400 features across 34 vehicle source writes and performed 68 empty selection-source writes in the unselected case. The DOM grew from 3,562 to 8,684 nodes after the 600-vehicle refresh workload. Post-GC heap fell from 14.99 MiB during playback to 11.93 MiB after seeking and stopping.
- **Umbramatic.** At 2×, original-colour playback recorded 384 `updateImage` calls over nine seconds and zero PNG encodes. The tint run produced 288 updates and 279 PNG encodes in the same window. With 16 tiles per frame that corresponds to 24 versus 18 submitted frame updates. During rapid seeking, 64 encodes led to 32 image updates. Replacing the export dropped the active tile count from 16 to one and the decoded cache from 32 to one. Three further large-to-small dataset cycles returned the active tiles and cache to one each. The steady post-GC heap on the small sample was 5.52–5.82 MiB across those three cycles. Decoded images and textures are outside that heap tally.
- **Workers.** Each MapLibre app created blob workers. These measurements identify main-thread and render activity. Worker CPU time, driver allocations, and GPU completion time need separate tracing for attribution.

## Findings

### 1. Launcher artwork is the largest avoidable first-load cost

The launcher transferred 19.15 MiB locally, including 18.33 MiB of images. The 2048 × 2048 remote-control QR PNG alone was 2.84 MiB and was requested while its dialog was closed. Each 1536 × 1024 RGBA sticker can occupy about 6 MiB decoded; the QR can occupy 16 MiB when decoded at full resolution. These are individual surface estimates. The actual browser may decode or retain fewer surfaces. [Launcher markup](index.html#L36)

Open a clean launcher in DevTools with Network recording, keep the QR closed, and sort image requests by transfer size. Assign the QR URL on first open. Try responsive or lossless compressed derivatives for the four launch logos and car. Measure transfer and first usable paint, then scan the QR and check image-edge hit targets, keyboard focus, and `file://` launch. The QR deferral alone removes 2.84 MiB from initial requests. Derivative savings require measuring visual quality and preserving the transparent artwork.

The moving launcher used 1,223 ms of main-thread task time over six seconds on hardware. Reduced motion used 47 ms in the equivalent window. Both held a 16.8 ms p99 frame interval in that sample. On SwiftShader, the moving view reached a 183 ms p95 while reduced motion was 16.7 ms. The backdrop recomputes a pixel buffer and blurs/composites it while the globe and craft animate. Separate the backdrop update budget from the globe and craft, and compare frame pacing and CPU time with the original appearance. [Launcher animation](launcher/app.js#L52) · [Backdrop](launcher/background.js#L78)

### 2. Umbramatic sizes its cache by tile count and encodes a PNG on tint misses

`decodedImage` retains an image and an object URL per tile. The cache limit uses the first frame’s tile count with a cap of 1,024 entries. Each 640 × 640 RGBA tile is 1.56 MiB decoded. For the 16-tile fixture, a 32-entry decoded cache represents up to about 50 MiB, and one active frame adds about 25 MiB for a single GPU texture copy. On colour changes and cache misses, `tintedImage` draws the image into a canvas and encodes a PNG. MapLibre then loads that URL. Native decode reuse depends on the browser. [Decoded tiles and recolouring](apps/umbramatic/ShadowPlayer/app.js#L218) · [Cache sizing](apps/umbramatic/ShadowPlayer/app.js#L660) · [MapLibre 5.13.0 ImageSource](https://github.com/maplibre/maplibre-gl-js/blob/v5.13.0/src/source/image_source.ts#L174)

Load the 16-tile fixture, play at 2× with original colours, apply a tint, and repeat before and after a dataset replacement. Compare frame throughput, `updateImage` calls, PNG encodes, and estimated decoded bytes. Start with a byte-budgeted cache, latest-request cancellation, and one-frame lookahead. Evaluate a GPU colour path on transparent PNG/WebP masks with pixel checks. JPEG needs its existing threshold converted into a mask. An off-main-thread tint path is a smaller intermediate change. Preserve geographic corners, alpha, basemap opacity, and fast seek behavior.

### 3. Transitron rebuilds hidden report DOM during playback

The recorder delivers the selected frame to `renderFrame`, which calls `render()` for overview, vehicles, trip updates, alerts, and map updates. `renderTable` replaces the table and builds up to 400 rows including their listeners per invocation. Playback updates the whole vehicles GeoJSON source and the selection source. The recording storage already pages its browser and server frames. The next target is display-side work. [Table renderer](apps/transitron/js/app.js#L413) · [Frame update](apps/transitron/js/app.js#L883) · [Paged recording](apps/transitron/js/recording.js#L102)

Play the 600-vehicle capture at 60× on Recorder and inspect allocations, DOM work, and source updates. Select Vehicles halfway through, and check its rows, counts, sort order, and keyboard selection against the current frame. For the first pass, defer hidden table construction and update the visible panel on entry. Then measure a stable-ID `updateData` path for deltas against full `setData` for broad replacements. Test selection, feed failures, the playback clock, gap skipping, and browser and background recordings. [MapLibre 5.24.0 GeoJSON source](https://github.com/maplibre/maplibre-gl-js/blob/v5.24.0/src/source/geojson_source.ts#L260)

### 4. Geoglyph preloads substantial font data and keeps several export representations

The modular HTTP entry transferred 20.37 MiB to reach the ready window. Segoe UI Emoji accounted for 12.34 MiB. The same rehearsal font collection is generated into a 23.63 MiB JS pack for direct-file use and embedded in each of two standalone HTML files. The startup loader retains fetched or base64-decoded buffers by key; these buffers support font registration and exact outlines used by morphing. [Startup font acquisition](apps/geoglyph/src/scripts/conference-presentation.js#L403) · [Offline font pack and standalone build](apps/geoglyph/scripts/build.cjs#L30)

Compare requests and parse/registration time for a fresh manual open, a Survey launch, and a cold Begin. Preserve the emoji opening and the complete preflight before the rehearsal starts. Prototype preparing manual-use fonts as needed and prewarming the existing rehearsal set when the user is about to present. Measure font readiness and the first cue separately. Verify exact outline and emoji rendering, fallback, all scripted languages, and file and HTTP launch before considering font subsetting or buffer retention changes.

### 5. Panoptigon rebuilds point, cone, and label sources on photo selection

`selectView` rebuilds the tree and calls `updateMapSources` even when the selected photo changes and the points and cones stay the same. Model import also parses and constructs all models in the pack before normal viewing. The 500 MiB import cap tracks OBJ input size, which does not account for geometry attributes, data copies, and resident GPU buffers. A 4096 × 2048 panorama takes 32 MiB for one RGBA texture level; a full mip chain, if generated, adds about one third. The viewer caps dimensions and disposes its previous texture and image on a switch. [Selection and source updates](apps/panoptigon/js/app.js#L126) · [Panorama texture lifecycle](apps/panoptigon/js/panorama.js#L102) · [OBJ loading](apps/panoptigon/js/obj-map.js#L228)

Import the two panorama views and twelve models, then alternate views eight times. Count source writes and repeat after clearing the active panorama and disposing model resources. Separate changes to geometry, visibility, and selection. Keep photo frustum and alignment updates tied to selection and heading. For larger model packs, measure parsed attribute bytes and stage visible work. Preserve EPSG:7854 alignment, local workspace reopen, and camera heading.

### 6. Generated outputs dominate disk size

The two v3 Geoglyph standalone outputs are byte-identical. They represent 55.05 MiB of checked-out files together. The offline font pack and standalone files provide separate entry points, and the archive also includes the original fonts. Git can store identical blobs once. A normal checkout still writes each path. The suite contains MapLibre 5.3.0 in Geoglyph and 4.7.1 in Panoptigon, while Transitron and Umbramatic load 5.24.0 and 5.13.0 respectively. Navigation loads each app in its own document. Adding the four library sizes together describes packaging or download patterns, rather than concurrent runtime memory. [Standalone writes](apps/geoglyph/scripts/build.cjs#L66) · [Panoptigon dependency pins](apps/panoptigon/package.json)

Hash the two standalone files and compare cold Network traces with their on-disk size. Choose a canonical standalone release artifact and retain existing entry URLs wherever used. Publish file-compatible assets from the current build pipeline. Keep the modular HTTP paths available. Check both standalone entry points and Survey123 return before retiring any duplicate path. Splitting `core.js` (2,096 lines) and the map engine (2,801 lines) is useful where it permits deferring work such as export, administration, or scanner setup. Moving code to another file alone does little for memory or startup.

### 7. CSS has more cascade layering than exact duplication

A PostCSS pass counted 2,480 authored rule blocks. Four exact repeated selector/declaration groups appeared in the same lexical conditions. These include two identical `.frame` blocks in Transitron and a `#map` rule shared across Umbramatic's base and controls sheets. Source order and Umbramatic's import layer still affect whether a rule can be removed safely. Geoglyph and Transitron have more repeated selectors with different declarations. The clearest targets are the repeated Geoglyph toolbar rules, Transitron's base frame and reveal overrides, and repeated panel and control roles in Umbramatic. [Geoglyph CSS](apps/geoglyph/src/styles/app.css#L913) · [Transitron frame CSS](apps/transitron/css/frame.css#L49) · [Umbramatic controls CSS](apps/umbramatic/ShadowPlayer/controls.css#L94)

| App | Authored CSS | Same-condition repeated selector groups | Exact repeats | Example stylesheet coverage in this run |
| --- | ---: | ---: | ---: | --- |
| Launcher | 11.9 KiB | 1 | 0 | Styles 74% |
| Geoglyph | 151.2 KiB | 66 | 0 | App 45%, map controls 53% |
| Panoptigon | 20.1 KiB | 4 | 0 | Styles 61% |
| Transitron | 58.0 KiB | 47 | 3 | Frame 34%, recorder 85% |
| Umbramatic | 26.3 KiB | 13 | 1 | Controls 66%, solar 11% |

Coverage is the share of CSS source ranges matched during the sampled workflows. Coverage reflects the startup and measured interaction states. The Umbramatic dome stayed closed in the playback trace. The unmatched ranges are candidates for targeted state coverage.

Parse the authored sheets and group by selector, enclosing conditions, and normalized declarations. Compare computed styles before and after consolidating component rules within each app. Use semantic tokens for surface, border, text, focus, and active state, then reapply them to the already-shared control styles. Exercise Day, Night, Sci-Fi, Fun, light and dark Geoglyph modes, disabled and pressed states, and responsive layouts before removing selectors. Repeated literal colour values can serve different roles, such as route data colours and control highlights.

### 8. Keep GPU changes targeted at measured costs

Geoglyph passes a top-level `preserveDrawingBuffer: true`. The live WebGL context reported `false` at both tested pixel ratios. The export path uses synchronous `gl.readPixels`, a vertical flip, and image encoding. One 1440 × 900 RGBA8 surface is 4.94 MiB. At DPR 2 the same canvas can require 19.78 MiB per surface. The 2D morph coverage target is already capped at 4,194,304 pixels, approximately 16 MiB of RGBA8. The 3D renderer reuses the MapLibre context, and a static Geoglyph view recorded zero map renders in five seconds. [Map creation and export](apps/geoglyph/src/scripts/geoglyph-map-engine-inline.js#L1249) · [Morph target allocation](apps/geoglyph/src/scripts/font-morph-renderer.js#L321)

The same paused 2D cue produced non-blank PNG and JPEG downloads at both pixel ratios. The actual map canvas grew from 1015 × 852 to 2030 × 1704 as the pixel ratio doubled. The single PNG readback sample increased from 8.6 to 50.3 ms, and click-to-download from 99 to 149 ms. JPEG readback increased from 3.7 to 13 ms. These are individual exports. The difference between formats in these samples can include the timing of GPU work when readback began.

Compare 1× and 2× DPR with the same camera and cue. Count map renders, resource uploads, and main-thread stalls during a screenshot. Measure capture in the render callback before changing context options. Compare PNG alpha, JPG quality, active camera pose, all visible layers, and fullscreen. Preserve the current 2D and 3D custom render paths until timing isolates a specific regression.

## Files and dependency boundary

| Area | Tracked checkout | Notes |
| --- | ---: | --- |
| Whole v3.0 | 136.90 MiB | 451 files in the archived commit, measured uncompressed |
| Geoglyph app | 103.83 MiB | Two standalone HTML files, modular assets, fonts, fixtures and source |
| Shared launcher assets | 26.11 MiB | Artwork and packaged content. Startup fetched 18.33 MiB of images |
| Panoptigon app | 3.96 MiB | Includes vendored libraries and a separate file-compatible bundle |
| Transitron app | 1.71 MiB | The local GTFS data is additional |
| Umbramatic app | 0.26 MiB | Active player, exporter source, and sample rasters |

The working v3.0 directory used about 399 MiB on disk. The largest local additions were `apps/transitron/GTFS data/` at about 208 MiB and Geoglyph's installed npm packages at about 53 MiB. The GTFS directory includes a 65.75 MiB stop-times text file, a 54.37 MiB routes GeoJSON, a 37.84 MiB shapes text file, and a 21.78 MiB route index. The routes and index are loaded on demand for overlays and snapping. Keep full GTFS inputs out of startup and consider a compact, spatially indexed distribution for the client data. The supplied November ShadowTime archive and extracted reference folder remain local. Their adapted dome code is tracked in the active player. [Transitron data policy](apps/transitron/.gitignore) · [Network assets](apps/transitron/js/network.js#L243)

In a standalone Node 22 parse on the workstation, the route index took 204 ms and retained about 67.5 MiB of V8 heap after GC. The routes GeoJSON took 242 ms and retained about 94.3 MiB. These are single parses of the local datasets, before MapLibre worker tiling, derived route geometry, or browser overhead. Compare geographic extent, route/stop selection, and snapping accuracy before replacing those files with tiled, simplified, or worker-indexed data.

| Dependency beyond this folder | Classification and impact |
| --- | --- |
| Port 8090 | Runtime for Transitron and loopback return to the suite. Server sources are inside v3.0. Python provides the live relay and browser-recording path. Node with SQLite adds background recording. `METRO_RECORDINGS_DIR` can point at storage elsewhere. Browser recordings and settings follow the browser profile and origin. |
| Internet services | The pinned MapLibre scripts and CSS on unpkg for Transitron and Umbramatic, Esri tiles/styles, Survey123 results, and Adelaide Metro feeds. Geoglyph requests Google Fonts for some UI text. MetroMap needs an API key. Transitron has optional configured and fallback proxies, including localhost:8080. |
| User projects | Panoptigon needs the original photos, models, and GIS files alongside saved workspace JSON. Those files and the `Park_10.zip` test sample are outside the committed tree. Umbramatic needs exported datasets for user projects. Its included sample opens without ArcGIS Pro. |
| System and authoring tools | A compatible browser and WebGL for the renderers. Installed and Esri fonts are optional beyond the bundled rehearsal fonts. Generating shadow exports uses ArcGIS Pro's ArcPy environment, NumPy, and Pillow. |
| Development and preservation | Build manifests install local npm dependencies. Transitron's browser test scripts refer to a specific home-directory Playwright and browser cache. Several Geoglyph tests use Windows fonts under `/mnt/c/Windows/Fonts`. The preservation verifier reads the parent Geoglyph v2 checkout and the separate Explorer Suite v2 tree. These references are for development, tests, and source preservation. |

### Portability checks

- The isolated archive opened the launcher, Geoglyph, Panoptigon, and Umbramatic directly from disk. The launcher opened Transitron and returned through `/suite/index.html`. Umbramatic imported the tracked sample. Both local server implementations served the suite alias. The Node server exposed the background recorder API with a fresh SQLite store.
- All application code loaded in those runs came from inside v3.0. The checkout omits user datasets, captures, and browser profile state. Umbramatic and Transitron obtained their pinned MapLibre files through the local CDN fixtures.
- Separate one-request live checks returned HTTP 200 for Survey123 layer metadata, an Esri aerial tile, and the Adelaide Metro vehicle feed. TTFB was approximately 727, 60, and 47 ms respectively from this WSL machine. Those observations describe one connectivity check per service.

### Repeat the checks

Use a fresh copy of the baseline commit for comparisons. Run `node apps/transitron/server.cjs` with `METRO_PORT=8090` and point `METRO_RECORDINGS_DIR` at a disposable directory. Open `/suite/` and use DevTools Network, Performance, and Coverage. Record first loads in new browser contexts and repeated loads in the same contexts. For animation comparisons, keep viewport, DPR, map position, asset set, and GPU renderer fixed. The existing launcher and app browser specs supply the Survey123 fixtures, rehearsal checkpoints, compressed recording inputs, and gap scenarios. [Launcher and rehearsal tests](tests/browser/launcher.spec.cjs) · [Transitron browser tests](apps/transitron/tests/dashboard.spec.js)

Keep the first optimisation round to launcher loading, Umbramatic tint work, and Transitron table updates. Re-run the same profiles after each change. Then repeat a headed live rehearsal and test the target screen at its real scale before combining broader packaging, CSS, or GPU changes.
