# Tier 3 implementation and targeted verification

Baseline: `a7a255e0d61cc7f46ed4737e9f2b8e84c47b644b` (completed Tier 2). Scope is the conference edition, including modular and generated portable applications. No dependencies were added. The audit's experimental list is not an instruction to increase memory limits or replace rendering architecture without evidence.

## Implemented changes

| Audit item | Minimal change and relevant source | Compatibility and ownership |
|---|---|---|
| GG-11 | `src/scripts/ground-3d.js:17,30,61,78,96`: one intermediate Matrix4, per-layer output matrices, one pose for paint and projection per render | Camera/framing callers still receive independent matrices. Arithmetic, materials, resolution and both shared-context GL resets preserved. Arrays/Mercator objects still allocate; this does not eliminate all per-frame allocations. |
| GG-12 | `src/scripts/geoglyph-map-engine-inline.js:2174`: temporarily use the private output canvas for the inner outline mask, then clear/reset before final compositing | Cached masks and returned canvases are never reused as writable shared scratch. No additional retained cache. Same native colour, alpha, outlines and sampling limits. |
| GG-15 | `src/workers/font-geometry-worker.js:27`: complete-model lookup works even after parsed-font eviction | Existing two-font residency and all model/mesh limits preserved; missing model still takes established font-reprepare path. |
| GG-16 | `src/scripts/font-service.js:200`; `src/workers/font-geometry-worker.js:36`: key-only mesh request, worker mesh/model lookup, explicit missing-model fallback | Miss adds one small round trip. Caller model covers worker replacement/eviction. Deterministic errors are not retried as misses. Cached typed buffers are still cloned rather than detached. |
| GG-21 | `src/scripts/core.js:1967`: weakly owned row views and primitive dirty snapshots | Unchanged rows retain their DOM/input identity; changed/reindexed rows update, removed rows detach. Summary/order traversal remains linear per refresh; this is not list virtualization or a claim of constant-time total processing. |
| GG-21 | `src/scripts/core.js:1912,1927,1940`: directory PNGs render/encode/write serially using one canvas; abort failed writable streams | Final successful files, names, ordering, PNG dimensions and design preserved. ZIP output still retains its input blobs. Directory export is not transactional: previously completed files can remain if a later render/write fails. Previously writes could also leave a partial directory; streaming now permits this on later render failure too. |
| GG-20 prerequisite | `src/scripts/core.js:1141,1187`; `src/scripts/geoglyph-v15-ui.js:436`: optional explicit QR content for previews/exports | Stops temporary authored-input mutation and stale restoration. Normal callers retain implicit input behaviour and character-limit checks. No QR encoding/style algorithm change. |
| GG-21 | `src/scripts/core.js:1800`: yield between successful jsQR passes | Same full resolution, detection order, region masking and 25-pass cap. A single decode is still synchronous and can block; this is not worker cancellation. |

## Comparisons and evidence

These are deterministic operation counts and exact output comparisons, not claims about physical-GPU FPS, heap reduction, p95/p99 frame times or live venue performance.

| Workload | Tier 2 | Tier 3 |
|---|---:|---:|
| Matrix4 constructors per independently owned pose | 6 | 2 |
| Matrix4 constructors in custom render's two/one pose calculations, after initialization | 12 | 0 |
| Pose calculations per custom render | 2 | 1 |
| Canvas creations on changed positive outline radius | 4 | 3 |
| Canvas creations on cached outlined repaint | 2 | 2 |
| 42 real-canvas native/styled/alpha/radius/cache cases | 108 canvases | 90 canvases, **0 differing RGBA channels** |
| Five initial fonts plus 50 warm five-font requests in protocol fixture | 55 parses | 5 parses |
| Normal model-to-mesh polygon payloads sent back to worker | 1 | 0 |
| 100 initial scan rows, then Scanning/Processed per row | 20,100 generated row markups | 300 generated row markups |
| Escaping calls in that row fixture | 140,700 | 2,100 |
| Directory export PNGs held in application result array | Entire batch | 0; write awaited before next render |

`tests/unit/render-pose.test.cjs` compares matrices and pose values exactly over 360 latitude/bearing/tilt/size combinations, tests independently owned camera results and render reuse, and checks coherent pose and GL resets. `tests/browser/tier3-raster.spec.cjs` uses the frozen Tier 2 function in `tests/fixtures/tier2-colour-ground-mask.js`; it compares all pixels across 42 cases and verifies later calls never mutate previous results. Representative drawing includes antialiased text, gradients and alpha, not an exhaustive all-font pixel certification.

Worker details and baseline-counter reproduction are in [tier3-worker-reuse.md](tier3-worker-reuse.md). Tests exercise real service/worker dispatch with structured-cloned fixture boundaries and production extrusion; the existing font test additionally exercises generated real OpenType data.

## Targeted tests

Direct named Node tests passed, without running the full suite:

- `worker-model-reuse.test.cjs`: 6; `worker-recovery.test.cjs`: 11; `fonts-rendering.test.cjs`: 10.
- `render-pose.test.cjs`: 3; `material-batching.test.cjs`: 3; `orbit-lifecycle.test.cjs`: 11.
- `qreverse-scaling.test.cjs`: 6; `ground-model-cache.test.cjs`: 7.
- **57 cases total.** Include cache miss/eviction, worker replacement, deterministic errors, retained buffers, failed write cleanup/busy release, row removal/insertion/reindexing, full-resolution scan ordering/yields and unchanged 32 MiB rejection/protection.

Short Chromium checks used installed Playwright 1.61.1, headless Chromium, one worker, no retries, bounded batch deadlines and temporary output folders. Six selected unique checks passed after correcting the new export fixture: actual worker parsing/cache; real solid/transparent draw counts and pixel parity; orbit in all orientation modes without rebuild; raster scratch pixels/ownership; scan table/directory exports; QR generation/reverse round-trip. The original six-case batch took 45.6 seconds with five passes and one test timeout caused by clicking a deliberately hidden legacy action. Only the export check was rerun while diagnosing its fixture; its final pass took 1.3 seconds (1.8-second runner total).

Export diagnosis found jsQR returns no result for both unchanged implicit rendering and new explicit rendering at 1024 pixels for the fixture, with identical image data. Both decode at 512 pixels; raw QRious's differently rasterized 1024 image also decodes. This is an existing raster/decoder interaction, not proof that all exported designs scan reliably. The final test compares every 1024-pixel export against the normal implicit drawing path with **zero differing channels**, then decodes a 512-pixel test copy and checks ordered values, filenames, retained dimensions and authored edits. Production exports/scanning are not downscaled. Scan-required designs still need operator verification.

The separate portable-file embedded-worker check passed in 1.0 second (1.7-second runner total), bringing the unique short browser checks to **7**. Build passed; portable copies are byte-identical at 21,167,946 bytes. All 98 base-edition files checked against the audit inventory are unchanged. `git diff --check` passed.

## Deferred experimental work and remaining gates

- Full cancellable scan-worker extraction: needs portable worker provisioning, native BarcodeDetector/fallback lifecycle, cancellation semantics and additional compatibility proof. Cooperative yields cannot interrupt one expensive decode.
- Packed transferable geometry: retained worker caches must not be detached; no demonstrated case yet justifies a second ownership format/rewrite. Key-only input eliminates the clearest redundant copy safely.
- Broader raster painted-output caching: adds substantial retained canvas memory and cache-key/ownership complexity; current patch reduces transient work without another cache.
- Larger conference font residency/cache budgets or atomic large-model redesign: warm complete-model lookup already removes avoidable reparses. No physical-machine peak heap/native/GPU measurements justify raising limits. Existing two-large-model coexistence restriction remains.
- QR matrix caching, malformed-settings validation, maintenance CSS fixes and polling backoff are separate audit items, not claimed implemented by this Tier 3 change.
- No extended run, soak, physical-GPU profiling, fullscreen/display hotplug, hosted cold start or venue rehearsal performed here. User approval remains required for extended browser/soak runs. No unconditional demonstration-readiness signoff.

## Rollback criteria

Revert the affected small source change and rebuild portable outputs if visual/pixel differences, changed camera centring, lost/stale cues, repeated unexpected mesh misses, increased representative update latency, altered export contents/order, stuck busy state or sustained memory growth appears. Revert key-only protocol service/worker changes together. Camera matrix reuse and raster scratch reuse can be reverted independently. Incremental rows can return to the original full tbody render without settings migration; directory streaming can return to materializing all PNGs at the cost of peak retained memory. No persisted schema or dependency migration is needed. Compare the same messages/fonts/designs and resolution against `a7a255e`, including frame-time tails when physical hardware profiling is approved; counters alone do not establish frame smoothness.
