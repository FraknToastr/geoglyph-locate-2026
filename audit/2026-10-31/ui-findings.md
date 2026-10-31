# Supporting UI, lifecycle and build audit

Audit target: conference `index.html` (GitHub online demonstration), with comparison against the base edition. Source references below are relative to `Locate 2026 version/` and refer to the audited source on 2026-10-31. No application source was modified. The associated `ui-probes.cjs` runs selected actual source functions in controlled Node VM contexts; these are deterministic functional reproductions, **not browser performance measurements**. `ui-probe-results.json` records their output.

## UI-01 — Optional persistence can stop application initialization

- **Severity:** High for denied-storage environments; likelihood low on an ordinary working browser profile. Highest-value supporting-code reliability fix.
- **Source:** `src/scripts/core.js:49`, `:414–416`, `:444–452`; `src/scripts/geoglyph-v1512-ux-ui.js:203–210`, `:264–265`; `core.js:2007` publishes the API after the failing initializer.
- **Problem and evidence:** The core state initializer reads the theme with an unguarded `localStorage.getItem`. Browsers can reject storage access; the favourites reader already anticipates this with a catch. Theme/favourite writes and the UX extension's owner-map writes are also unguarded. Its startup calls the write functions before constructing undo/history and subsequent UI. The deterministic probe executes the core with a throwing storage getter: `SecurityError` escapes and `window.GeoGlyphStudio` is absent. A separate extracted owner-map function throws `QuotaExceededError` when a write fails. These are simulated failure conditions, not observations of a production browser encountering them.
- **Impact:** Core startup can fail entirely, or later initialization/input handling can exit part-way. This is disproportionate to an optional preference failing to persist. Conference initialization depends on the core API (covered by the network/conference audit).
- **Recommendation:** Catch unavailable/failed storage reads and writes in the named paths, preserving default/in-memory theme and favourites. Use a tiny shared helper only if it avoids duplicate error handling without broad refactoring. Keep storage keys and existing data format unchanged. Do not surface intrusive alerts.
- **Regression risk:** Low; successful persistence behavior remains identical. Failures must leave the in-memory operation complete.
- **Independent:** Yes, although it complements the conference startup readiness fix.
- **Verification:** Inject a getter `SecurityError`, then separately a setter `QuotaExceededError`; verify core API/map startup, theme, selection, favourites, undo and settings remain usable. Verify normal reload persistence with existing namespaced storage.

## UI-02 — QR style changes repeatedly re-encode and read back the same matrix

- **Severity:** Medium in QART authoring; low relevance while showing only ground text.
- **Source:** `src/scripts/core.js:19`, `:1136–1148`, `:1182–1188`, `:1222–1286`.
- **Problem and evidence:** Every QR preview builds a QRious canvas at `QR_MATRIX_SOURCE_SIZE = 708`, reads its pixels and scans the image to recover a matrix. Palette, glyph/shape, quiet-zone and other design changes can leave encoded content and error-correction level unchanged. Nevertheless `drawQrToCanvas` calls `createQrMatrix` each time. A 708×708 RGBA readback represents 2,005,056 pixel bytes before QR decoding/matrix scanning. Each preview also creates a temporary canvas and resizes/copies the visible canvas. `renderToken` discards obsolete completions but does not prevent their earlier work. This is source-derived redundant work; no milliseconds/FPS claim has been measured. The fixed Magic Eye matrix **is** already cached, so that path is not part of this finding.
- **Impact:** Extra synchronous CPU work, canvas allocation and readback during interactive authoring can create input/frame spikes. Actual impact depends on hardware and update rate.
- **Recommendation:** Cache a bounded immutable QR matrix by exact input text and error-correction level. Start with one most-recent entry; preserve existing extraction and validity checks. Consider same-frame preview coalescing only after measuring duplicate events and validating all callers. Canvas reuse is a separate, higher-risk change because concurrent previews currently overlap.
- **Regression risk:** Low for a correctly keyed immutable matrix cache; medium for shared canvas/coalescing changes.
- **Independent:** Yes.
- **Verification:** Count QRious construction/readbacks for unchanged content while changing every style; assert one matrix build, identical pixels/exports and successful QR decoding. Content/level changes must invalidate. Compare p95/p99 authoring frame times in a real browser.

## UI-03 — QReverse imports, decoding and batch export have poor large-batch bounds

- **Severity:** Medium; optional workflow, not the ordinary conference ground-text path.
- **Source:** `src/scripts/core.js:1734–1765`, `:1793–1804`, `:1816–1837`, `:1903–1942`, `:1947–1967`; `src/scripts/geoglyph-v154-base-ui.js:140–173`; `src/scripts/geoglyph-v15-ui.js:274–296`, `:465–473`.
- **Problem and evidence:** Live image/CSV/paste imports append rows without a bound (the settings restore limit does not bound live imports). The jsQR fallback copies and decodes the full-resolution bitmap synchronously, up to 25 passes; its `async` declaration introduces no yield within the decode loop. Before/after each queued image, `renderQReverse` rebuilds all table rows; scanning N images consequently performs O(N²) row work, before observer work. Batch export builds an array of all PNG blobs before writing even when saving individual files to a directory; ZIP generation then retains the whole archive. There is no scan/export cancellation control. These are verified execution paths, with no measured browser timings or claim that ordinary small batches fail.
- **Impact:** Large photos or large imported batches can monopolize the main thread, inflate heap/backing-store memory and make controls appear frozen. Unbounded imports permit memory growth controlled by the amount of user data, not by idle operation. PNG DEFLATE work may produce little additional compression, but that benefit is a profiling hypothesis.
- **Recommendation:** Keep the demo workload bounded operationally. After the demonstration, introduce cancellable decoding in a worker/fallback scheduling path, update affected table rows instead of replacing the whole table, and stream per-file directory exports as each canvas is encoded. Any import limit needs an explicit user-facing policy and should not silently drop data. Downscaling may lose small QR codes and is not a fidelity-preserving default optimization.
- **Regression risk:** Medium; decoder compatibility, detection count/order, file ordering, progress, error recovery and cancellation require tests. Do not bundle these changes into a pre-demo rewrite.
- **Independent:** Each subchange can be isolated, but worker decoding and virtualized tables are not low-risk quick fixes.
- **Verification:** Representative large images and 10/100/1000-row batches; verify every code/file and row order, cancellation, progress, peak heap and long tasks. Bitmap cleanup already uses `close()` in `finally` (`:1826`), which should be retained.

## UI-04 — Overlapping QReverse output previews can overwrite authored QR content

- **Severity:** Medium; demonstrable data/preview correctness defect in an optional workflow.
- **Source:** `src/scripts/geoglyph-v15-ui.js:409–441`, `:465–470`; `src/scripts/core.js:1136–1148`.
- **Problem and evidence:** Output preview saves the shared `qrInput.value`, temporarily substitutes the selected row, awaits `api.renderPreview()`, then restores its saved value. If a second preview starts during the first await, it saves the first row's temporary value. Out-of-order/overlapping completions can restore that value instead of the author's original input. The observer can request further previews as table state changes. A probe extracts and executes the actual function twice with controlled asynchronous completions: `ORIGINAL-AUTHORED-VALUE` becomes `FIRST-SYNTHETIC-ROW`. The render token protects visible canvas completion, not this shared input mutation.
- **Impact:** Returning from QReverse can show the wrong QR content, and output may depend on asynchronous timing. A slow font load makes overlap easier.
- **Recommendation:** Render an explicitly supplied content snapshot rather than mutating the shared input. If a narrow serialization fix is chosen, preserve the original authored value across the entire queued operation and never restore over a newer real user edit. Avoid merely adding a stale-result check after the restoration.
- **Regression risk:** Low to medium; test shared preview/export callers and latest-selection semantics.
- **Independent:** Yes; can precede QR caching.
- **Verification:** Delay font readiness, rapidly alternate selected rows/output/source tabs, and edit authored content while a preview is pending. Assert latest output and unchanged/newly edited authored content.

## UI-05 — Saved settings admit invalid character codes and unbounded design scalars

- **Severity:** Low for routine valid settings; Medium impact if an invalid file is loaded.
- **Source:** `src/scripts/core.js:1981–1983`, `:1989`; comparator with stricter map validation: `src/scripts/studio-ui.js:295`.
- **Problem and evidence:** `applySettings` accepts any finite numeric `selectedCode`, unlike its favourites list and map-settings validation. Values above `0x10FFFF`, negative values and non-integral values can reach `String.fromCodePoint`. The actual settings function, isolated from unrelated DOM work, stores `0x110000`; subsequent conversion throws `RangeError`. The outer load catch reports failure but does not roll back state already changed. Several visual scalar settings (e.g. logo/symbol/background sizes) also accept arbitrary finite values rather than the associated control bounds. The latter is a hardening opportunity, not a demonstrated memory failure.
- **Impact:** A malformed or manually edited settings file can leave selected glyph/preview state unusable until corrected; validation after mutation is insufficient.
- **Recommendation:** Validate selected code as an integer in the same accepted range as the existing valid paths before committing it; retain prior value or reject invalid settings. Normalize design scalars to documented existing control ranges, using a parsed candidate object before application where practical.
- **Regression risk:** Low for invalid-code rejection; medium if legacy out-of-range design files were intentionally supported. Preserve valid file compatibility and version behavior.
- **Independent:** Yes.
- **Verification:** Normal round-trip plus negative, fractional, surrogate-policy-compatible, maximum and above-maximum codes, non-numeric values and extreme scalars; assert failed loads do not leave partially invalid state.

## UI-06 — CSS consolidation maintenance command deletes its own output

- **Severity:** Low for deployed runtime; High impact if this optional maintenance command is used before a build.
- **Source:** `scripts/consolidate-css.cjs:7–9`, `:34–43`; `src/assets.json` currently includes both `src/styles/app.css` and `src/styles/map-controls.css`.
- **Problem and evidence:** With two non-vendor styles, the command proceeds, writes combined output to `src/styles/app.css`, updates the manifest/template, then deletes every old style asset including the newly written output. Executing the unchanged script in an isolated copy exits 0, leaves `app.css` absent, and leaves a manifest referencing it. The command was **not** run against application sources. It is not part of the normal build/test/dev scripts, so this does not mean the deployed page is currently unstyled.
- **Impact:** An apparently successful maintenance run can break the next build or styling. Existing source/compiled parity checks do not make the maintenance command safe.
- **Recommendation:** Exclude the output path from deletion, validate the proposed output/manifest first, and make repeated execution idempotent. Defer unrelated cascade simplification; removing historical rules is not automatically safe.
- **Regression risk:** Low for preserving output; CSS consolidation's existing cascade rewrite has wider visual regression risk and should not be run casually before the demo.
- **Independent:** Yes; maintenance-only fix.
- **Verification:** Run twice in a disposable checkout; output exists, each component appears once, manifests resolve, build succeeds and browser appearance matches.

## UI-07 — Development server read-stream failures lack an error handler

- **Severity:** Low; not relevant to the selected GitHub-hosted entry point.
- **Source:** `scripts/dev-server.cjs:15`.
- **Problem/evidence:** After checking/statting a path, the server pipes `fs.createReadStream` without a stream error handler. A file disappearing or becoming unreadable between checks and streaming can produce an unhandled error. This is source inspection, not a reproduced runtime crash.
- **Recommendation/verification:** Handle the stream error once, respond or destroy the response safely, and keep the server alive. Exercise an isolated disappearing/unreadable file case. Low regression risk and independently implementable; lower priority than demo-path fixes.

## Positive findings and findings intentionally not raised

- Normal font clicks are intercepted at window capture by `geoglyph-v1512-ux-ui.js:182–187`, which stops propagation. Therefore the older `geoglyph-v156-ui.js:89–91` immediate/timer/rAF font-selection sequence is **not evidence of triple live font rendering** in the current assembled application. Historical handlers are maintenance complexity, not grounds for an urgent rewrite.
- Undo history (`geoglyph-v1512-ux-ui.js:268–282`) is bounded to 60 entries; snapshots exclude camera and do not retain glyph geometry. Repeated `geoglyph:ground-rendered` events still synchronously serialize/deduplicate state; include that overhead in the parent render-invalidation finding, not as an unbounded-history leak.
- Recent colours are bounded to 12; main font/glyph lists use virtualization and scheduled updates. The favourite gallery itself can grow with user-chosen favourites, so very large galleries need profiling but do not grow spontaneously.
- Most event handlers/MutationObservers are registered once for page lifetime. Reopening a panel generally toggles existing DOM rather than installing a new loop. Control binding guards prevent duplicate registrations. No credible recurring open/close listener leak was established in these supporting modules.
- Fullscreen Magic Eye reuses its overlay and redraws on explicit preview events; it is not a second permanent animation loop. Colour picker pointer updates are rAF-coalesced. No perpetual CSS animation was found in application styles. Expensive modal blur is only relevant while a modal is displayed; the map editor already disables its backdrop blur.
- QReverse closes decoded ImageBitmaps in `finally`, and revokes selected source object URLs on replacement/reset. One selected file URL may remain while leaving the workflow; that is bounded retention, not an accumulating URL leak.
- Tooltip positioning can read layout and write position during pointer moves while visible. This is an unmeasured minor opportunity; it does not justify reducing current visual quality or prioritizing it over demonstrated render work.

## Verification limits and recommended ordering

These findings distinguish source inspection, simulated functional execution and profiling hypotheses. No browser FPS, long-task, heap-growth or GPU figures were collected by this sub-audit because available installed Chromium could not launch under the session's sandbox. No continuous 60–120 minute browser run was completed. Existing test-suite success and parent isolated-build parity are reported separately by the parent audit, not as execution of these missing scenarios.

For the GitHub ground-text demonstration, **UI-01 is the first supporting-code fix**. UI-04 and UI-02 are valuable if QART/QReverse will also be shown. UI-05 and UI-06 are small independent hardening tasks; UI-03's broader scaling work belongs after the demonstration unless large batches are a required demo scenario. Parent map/network/render findings take precedence over optional authoring improvements. All recommendations remain proposals; explicit approval is required before application edits.
