# Locate 2026 implementation and verification

This independent edition is in `Locate 2026 version`. The parent application remains the source for the non-conference version; this copy has its own source tree, dependencies, tests, documentation, development port and browser storage keys.

## Conference presentation behavior

The QART rename/presets and crosshair Off option passed **11 focused browser
checks** in the modular and portable editions, including editable values,
section resets, settings restoration, session persistence, exports and header
layout. See [QART/crosshair Off review](validation/qart-crosshair-off-review.json).

Font Explorer arrow navigation and the pale grey default crosshair were verified
separately with **11 focused browser checks**. The full suite was not rerun for
these UI changes. See [keyboard/crosshair review](validation/explorer-keyboard-crosshair-review.json).

The subsequent 30-second Begin timing adjustment was verified with a build and
one real-duration flight check only; the full suite was not rerun for that
change. See [duration review](validation/intro-duration-review.json).

Latest verification (30 October 2026): **147 browser checks and 71 unit cases
passed**, including 34 conference presentation checks. Both portable builds are
identical; all 96 inventoried parent-project files remain unchanged. See
[intro colour review](validation/intro-colour-review.json),
[font startup review](validation/font-startup-review.json),
[Begin/Reset review](validation/begin-reset-review.json),
[browser results](validation/browser-results.json) and
[build checks](validation/build-check.json). Earlier sections below retain the
historical evidence for previous changes.

The Begin texture regression was reproduced: only 0.32% of its opaque pixels
retained colour before the fix. Overview/introduction raster preparation now
uses the shared destination Fit target for outline scale and texture resolution.
The test measures 93.63% coloured pixels before, during and after the flight,
checks yellow pixels in the rendered map while moving, and verifies unchanged
1355×1055 texture dimensions at arrival. Native colours and outlines stay enabled.

Direct-file modular startup now loads generated font bytes from a classic script
because Chromium blocks `fetch(file://...)`. The reported error was reproduced
with zero font reads/faces before the fix. The added checks cover successful
`index.html` startup from disk, missing-pack guidance and named HTTP font errors.
HTTP development retains individual font requests; portable HTML stays
self-contained. Font rendering and Survey123 polling policies are unchanged.

The app now opens Map → ArcGIS with collapsed controls, bundled Segoe UI Emoji,
native colours, 2D and one-second polling. It shows Australia and prepares
sleeping Geo at Adelaide. The latest stored submission is a cursor baseline,
not replayed content. `special_commands = Begin` draws sleeping Geo then flies
to its close-fit framing over 30 seconds. Reset interrupts active work, discards
older queued cues and restores the Australia opening while polling continues.
Both commands override all other fields in their submission. Ordinary cues wait
during the introductory flight; repeated Begin commands do not restart it.
The app processes every new Object ID in order, including controls-only
responses and repeated message text. Emoji takes precedence over text and forces
its rendering policy before drawing. Text restores the last text font, supports
the five approved font choices, bright fill, exact size/depth presets, 2D/3D,
animation and Fit. Survey points place the anchor once per submission; repeated
polls preserve manual placement.

After Begin, every submission with new message content fits after drawing, including repeated
text in separate submissions. Controls-only Random cues also fit after drawing;
other controls-only cues fit when explicitly requested.
Each cue waits for its final 2D/3D drawing and its own source's map frame before
Fit, then waits for camera framing before the next cue. Automatic Fit keeps an
orbit active through framing. Explicit Fit stops it unless an animation is also
selected. Automatic and explicit requests combine into one flight.
The Map Random button stays busy until the new artwork has reached a map frame
and its Fit has completed. Both Random paths share the post-draw fitting policy,
including animation continuity and the existing closer framing distances.
Superseded selections and failed candidates cannot trigger an automatic Fit of
the old artwork.
Stop lets the accepted cue finish and pauses the remaining queue; Start resumes.
Rendering failures keep the previous display and do not block subsequent cues.
Random 3D selection skips incompatible outlines under the unchanged rendering
policy. A failed initial Fit remains available for the next valid cue.

Conference readiness uses MapLibre's `style.load` boundary, independently of
remote basemap tiles. A regression test holds tile requests open while startup,
polling, drawing and the first Fit complete. The original authoring startup
boundary remains unchanged. See [MapLibre events](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapEventType/).

All six approved font files are bundled, including in the portable HTML. No
font scan or Local Font Access permission is required. Chromium rejected Gill
Sans's invalid Unicode cmap language ID; FontTools normalized only that metadata
and rewrote checksums, preserving glyph outline bytes and cmap mappings. The
preparation script and font notice document this correction.

Full rules and operation: [CONFERENCE_PRESENTATION.md](CONFERENCE_PRESENTATION.md).

## Original connection behavior in authoring mode (`?studio=1`)

- Anonymous access to the public Survey123 results view; no login, authorization header, cookie or access token.
- Discovers layers and tables containing `whats_on_your_mind`; a selector appears only if more than one layer matches.
- Latest non-empty message is ordered by creation timestamp descending, then Object ID descending. A clearly identified Object ID fallback is available if the timestamp field is missing.
- Blank results preserve the current display; live polling waits for the first response. Default polling interval: five seconds, adjustable from 1 to 3600 seconds while running.
- Stop, leaving Map/ArcGIS and changing layers cancel the pending request and invalidate late responses.
- Access or schema errors stop polling. Temporary network failures keep the existing model and retry at the polling interval.
- Message changes use the established model pipeline, preserving anchor, paint, font, extrusion settings and active camera animation.

## Live endpoint evidence

Anonymous service discovery and an ordered query succeeded in Chromium **from the portable `file://` build** on 2026-10-21. The view has `Query,Extract` capabilities, layer `0` (`survey`), message field `whats_on_your_mind`, creation field `CreationDate` and Object ID field `objectid`. At the initial check, the table was empty. A later check after the polling fix retrieved the latest populated response. No survey data was created or modified by these diagnostics.

See [live-public-results.json](validation/live-public-results.json) for the initial layer description and anonymous requests, and [polling-fix-live.json](validation/polling-fix-live.json) for the current live-query evidence. Controlled browser responses verify submission-to-display behavior, including updates during an active 3D orbit.

The completed presentation build was checked against the live view again on
2026-10-22 UTC. Startup confirmed collapsed Map, Emoji/native colours and 2D
before accepting a cue. The current newest response, Object ID 21, contained text
and correctly switched to the default text font with native colours disabled.
Drawing and Fit completed in 4.880 seconds from navigation in that run; this is
an observed end-to-end timing, not a latency guarantee. Repeated polling did not
replay it. There were no page errors and no survey writes. Request methods,
approved field names, geometry settings and cue phases are recorded without
survey text in [conference-live.json](validation/conference-live.json).

## Polling delay correction

Two problems were identified and corrected:

- The original `setInterval` captured the interval at Start, so changing the number did not change an active polling session. A single pending timeout now uses the current setting and time since the last request began. Reducing or increasing the interval reschedules it immediately. An outstanding request is preserved; the next check starts when due without overlapping requests or adding a full interval after a slow response.
- The public endpoint advertises `Cache-Control: public, max-age=30, s-maxage=30`. Repeated GET requests returned `x-cache: TCP_HIT`, including a request with `Cache-Control: no-cache`. Live queries now use the supported, read-only POST `/query` operation while metadata continues using GET. The Chromium live query returned `x-cache: CONFIG_NOCACHE`, retrieved Object ID 5 and took **829 ms**. This measures that individual network query, not total submission-to-render time.

See [GET cache probes](validation/polling-get-cache-probes.json), [Chromium POST evidence](validation/polling-fix-live.json), [Esri cache behavior](https://doc.arcgis.com/en/arcgis-online/manage-data/control-cache.htm) and [the query API](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer/). Response text is omitted from the diagnostic evidence.

The interval accepts one-second checks. Conference startup uses one second;
authoring mode retains its five-second starting value. Changes take effect
without pressing Stop/Start. Reload the rebuilt app to load the correction.

## Closer camera framing

All Fit paths share an 80% viewport target (10% insets per side). 2D fits no longer
subtract an extra zoom level. Static 3D uses projected mesh bounds, including
depth and tilt. Orbit, Turn and Face solve projected bounds at 5-degree headings,
with 2% distance clearance, rather than fitting an enclosing sphere. Perspective
can leave an asymmetric fixed model below 80% overall occupancy while one edge
reaches the intended margin. The model centre remains the camera target.

The orbit result is cached by bounds, pose, location, orientation, viewport and
zoom limits. Model changes and viewport resize smoothly update the distance;
the orbit distance remains stable through a full rotation. Tests verify that
repeated updates reuse the cached calculation and dispose resize listeners.

Large-message testing exposed native transform constraints moving a trial camera
away from Adelaide at a low candidate zoom. Every projection trial now restores
the intended centre and elevation. Mathematical clones permit longitude wrapping
so low-zoom trials remain useful; the real map keeps its existing world-copy
setting. Full-rotation checks independently verify the real camera still targets
the model centre, including Huge messages on widescreen displays.

The new framing checks cover short/wide/multiline messages, native-colour emoji,
static depth/tilt, all four size presets plus deep extrusion, all three animation
modes and widescreen/portrait viewports. They test 5-degree headings and their
2.5-degree midpoints, actual map camera targets and smooth live resizing. Dynamic
manual/Random-font checks compare the projected destination with a fresh fit,
replacing the old sphere-ratio expectation while retaining animation/cache checks.

The [controlled aerial preview](validation/closer-framing-preview.png) and
[camera measurements](validation/closer-framing-preview.json) use the user's
sample phrase in Magneto, 30,000 m high and 3,000 m deep, in Turn mode. The new
zoom was 8.0943 versus 7.1305 calculated from the former sphere formula: about
**1.95 times the linear screen size**. This check made no Survey123 queries or
record changes and reported no page errors. In isolated Chromium tests, cold
orbit fits had medians of 15–17 ms and a worst observed 45.4 ms; cached updates
had a median of 0.4 ms. These are observations, not performance guarantees.

## Automated verification

- The complete browser suite passed: **134 checks** in 3.0 minutes with three Chromium workers, including the existing 13 conference connection checks, 21 presentation checks, 7 closer-framing checks and 10 new Random Fit checks.
- All **70 unit cases across 8 files** passed, including **15 Survey123 client cases**, **13 cue-rule cases** and **11 camera lifecycle cases**. The [unit console log](validation/random-fit-unit-tests.log) and [unit-tests.xml](validation/unit-tests.xml) record the unit results.
- Browser cases verify modular and portable connections, requests without credentials, first-response waiting, duplicate-message handling, polling/Stop, network recovery, late-response rejection, layer selection, isolated settings and a message change during an active 3D orbit. Added timing cases exercise both interval directions and an interval change during a slow response; a cache regression case distinguishes fresh POST results from cached GET results.
- The existing font-outline policy (including Sitka), font-loading, map placement, 3D animation, Symbol, QR, Magic Eye and Scan QR tests all remain passing.
- Presentation checks cover defaults, all six bundled faces without a font scan, emoji/text precedence, random eligibility, duplicate text, controls-only cues, paginated FIFO bursts, deferred drawing/Fit, animation continuity, every size/depth in 2D and 3D, settings round trips, manual placement, Stop/Resume, failed-cue recovery, initial-Fit recovery and withheld basemap tiles.
- Automatic-Fit checks cover all three content fields, repeated text in different submissions, one Fit when explicit and automatic requests coincide, no fitting on unchanged polls or ordinary controls-only cues, delayed 2D drawing and 3D mesh transitions, and an orbit remaining active throughout automatic framing. Explicit Fit still stops animation unless one is selected in the same cue. Failed draws retain the previous display and allow later cues to continue.
- Closer-framing checks cover projected edge clearance throughout full rotations at every size, depth/tilt, both viewport orientations, native-colour emoji, stable orbit distances, camera-centre and anchor preservation, smooth live resizing, cache invalidation and recovery from trial-camera constraint drift.
- Random Fit checks verify draw → own-source frame → Fit ordering, larger and smaller fonts in 2D/static 3D/all three animation modes, warm caches, real camera completion and busy feedback, rapid requests, leaving Map, failed candidates, controls-only Survey Random and combined Random/content/explicit Fit cues.
- The two portable deliverables are byte-identical at **21,135,944 bytes**, including all six fonts. See [build-check.json](validation/build-check.json) for their SHA-256 checksum and [gill-font-metadata.json](validation/gill-font-metadata.json) for the private font correction evidence.

The build, individual unit files and complete browser suite passed using the project-local runners and the existing Chromium runtime under `/usr/share/playwright`. The sandbox prevented the npm wrapper from binding its test server; the permitted direct Playwright CLI ran all 134 browser checks successfully. The latest combined console log is saved in [random-fit-test-run.log](validation/random-fit-test-run.log), with a machine-readable summary in [test-summary.json](validation/test-summary.json); the Chromium HTML report is generated in `playwright-report/`.

One older Random search test permanently replaced `Math.random`, causing MapLibre worker message IDs to collide and leave a GeoJSON request unresolved. Its override now covers only the synchronous font shuffle and restores normal randomness before drawing. The test still checks that search reaches a compatible font beyond eight incompatible entries. Source evidence and review notes are saved in [random-fit-review.json](validation/random-fit-review.json); production rendering policies needed no exception.

## Unanswered survey location correction

A live read-only check found Object ID 22 had geometry
`{x:0,y:0}` despite no point being selected. Treating that as a chosen point moved
the glyph and camera over the ocean, where Esri returned "Map data not yet
available" tiles. The basemap renderer had not stopped. Survey123 documents this
default in [tracking surveys](https://doc.arcgis.com/en/survey123/analyze/trackingsurveys.htm).

The conference cue policy now treats exact `(0,0)` as unanswered and retains the
anchor. Missing/invalid points already retained it. Other equator or Greenwich
coordinates remain valid. All other cue controls still apply. This convention
cannot distinguish a deliberate `(0,0)` choice from the survey default; it is
scoped to this conference feed, leaving the transport and map renderer unchanged.

All **12 cue-rule unit cases** and **19 presentation/basemap browser checks**
passed after the correction, including startup with `(0,0)`, manual placement
retention on another `(0,0)` cue and subsequent placement by a real point. Both
portable files were rebuilt. A later live response (ID 25) supplied an Adelaide
point and loaded aerial tiles successfully; [live state](validation/no-location-live.json)
and [screenshot](validation/no-location-live.png) record that check. No survey
records were changed. All 96 inventoried original files remain unchanged.

## Original-project preservation

The source, documentation, assets, fixtures and generated entrypoints were inventoried before copying. **All 96 original files remain unchanged**, with no missing or unexpected files. See [original-file-inventory.json](validation/original-file-inventory.json) for their SHA-256 checksums. Dependencies, test reports and private workspace metadata were excluded from the copy and original-file inventory.

Recheck the parent project with:

```sh
rtk node scripts/verify-original.cjs
```

This writes [original-files-check.json](validation/original-files-check.json) and fails if an original file changed, disappeared or an unexpected file appeared outside the conference directory.

## Launch

```sh
cd "$HOME/headroom-projects/geoglyph/Locate 2026 version"
rtk npm run dev
```

Open `http://localhost:4174`, or open `GeoGlyph_Locate_2026.html` directly.
Conference presentation starts automatically. Stage 😴 as the newest survey
response before launching; startup displays the newest response rather than
replaying history. Add `?studio=1` for manual authoring without auto-start.
The original app retains its existing port and settings.
