# Geometry and CPU audit evidence

Audit-only: no application or existing test file changed. These are actual-source Node CPU measurements, not browser FPS, GPU, DOM, rendering latency, or a 60–120-minute soak.

## Reproduction

From `Locate 2026 version`:

```sh
rtk proxy node --expose-gc audit/2026-10-31/geometry-benchmark.cjs
rtk proxy node audit/2026-10-31/geometry-capacity-probe.cjs
```

No added dependencies. The harness uses project-local esbuild, Three.js, and vendored OpenType/polygon-clipping. It compiles the unchanged extrusion/cache modules in memory and executes the unchanged classic worker protocol in a Node VM. VM messages explicitly use `structuredClone` in both directions; the VM has no browser worker scheduling.

Environment: Node v22.23.2, AMD Ryzen 9 7950X3D 16-Core Processor, 32 logical CPUs, WSL2 6.18.54.1-microsoft-standard-WSL2. Shared host without exclusive CPU reservation. GC was exposed for memory checkpoints.

Parse: 20 samples after 3 warmups; cold model: 12 independent parsed fonts (parse excluded); warm glyph-cache model: 50 samples after 5 warmups; extrusion: 20 samples after 3 warmups; clone: 50 samples after 5 warmups. Nearest-rank percentiles; p95/p99 of 12 samples equal the maximum and are not a stable frame-tail estimate. JSON preserves means, median/p95/p99/min/max and counts.

Synthetic scenarios: short `GeoGlyph` (8 characters), normal `GeoGlyph\nLocate 2026` (20 including a newline), heavy eight repeats of `GEOGLYPH LIVE VISUALISATION ` trimmed (223 characters). No respondent data was used.

| Font / scenario | Cold model median / p95 ms | Warm glyph-cache model median ms | Extrusion median / p95 ms | Mesh MiB | Material groups |
|---|---:|---:|---:|---:|---:|
| Gill Sans / short | 1.862 / 9.141 | 0.033 | 2.885 / 3.673 | 0.363 | 16 |
| Gill Sans / normal-multiline | 2.617 / 3.286 | 0.172 | 6.688 / 7.158 | 0.934 | 36 |
| Gill Sans / heavy-update | 24.651 / 57.834 | 21.246 | 35.614 / 42.397 | 4.875 | 400 |
| Forte / short | 1.695 / 2.630 | 0.057 | 6.681 / 7.383 | 0.897 | 16 |
| Forte / normal-multiline | Existing outline policy rejects | — | — | — | — |
| Forte / heavy-update | Existing outline policy rejects | — | — | — | — |
| Chiller / short | 1.145 / 2.168 | 0.027 | 2.014 / 2.958 | 0.307 | 28 |
| Chiller / normal-multiline | 2.930 / 5.778 | 0.051 | 5.512 / 6.250 | 0.705 | 76 |
| Chiller / heavy-update | 51.276 / 62.134 | 49.753 | 75.301 / 88.917 | 9.097 | 1008 |
| Magneto / short | 2.712 / 5.407 | 1.259 | 2.808 / 4.039 | 0.451 | 6 |
| Magneto / normal-multiline | 6.944 / 10.334 | 4.848 | 9.223 / 10.014 | 1.190 | 16 |
| Magneto / heavy-update | 113.296 / 139.332 | 110.943 | 147.724 / 159.320 | 17.908 | 256 |
| Showcard Gothic / short | 1.447 / 2.578 | 0.023 | 2.375 / 3.723 | 0.380 | 16 |
| Showcard Gothic / normal-multiline | 2.885 / 6.013 | 0.062 | 6.442 / 7.368 | 0.904 | 36 |
| Showcard Gothic / heavy-update | 2.901 / 3.754 | 0.468 | 50.351 / 56.185 | 6.447 | 400 |

A warm glyph cache still performs text layout and overlap union. This table deliberately bypasses the separate complete-model cache to measure changed-text work; it must not be described as cost paid on every steady animation frame.

## Findings

### GEO-B1 — High: material-group count scales with outline islands, independently of the mesh-byte budget

**Sources:** `src/workers/extrusion-entry.js:7–21`, `src/scripts/ground-model-cache.js:30–34`, `src/scripts/ground-3d.js:61–66,89–95`. `ExtrudeGeometry` generates cap/side groups for each shape; the application preserves every group and uses a material array.

**Measured:** 223-character Gill Sans / Chiller messages produce 400 / 1,008 nonempty groups; 1,000 Gill Sans `A`s fit all budgets at 3,696,000 mesh bytes and 44,000 triangles but produce 2,000 groups. Each group is a separate material draw under the existing renderer. Thus nominal solid-model draws with one visible outline are approximately 401 / 1,009 / 2,001 respectively. These are source-derived counts, not observed GPU draw calls. Basemap draws are additional; transparent double-sided rendering may require additional passes.

**Impact:** accepted geometry can remain CPU/driver-bound during every orbit frame despite a modest buffer footprint. Rendering resolution reduction would not remove the root cause.

**Recommendation:** profile group/draw counts on the demonstration GPU; then batch cap and side ranges while preserving every position/normal/outline, e.g. reorder typed-array ranges into two groups. Retain exact geometry and quality. Verify solid and transparent rendering, front/back faces, holes, depth and lighting before adoption.

**Regression:** Medium (range ordering, transparency and materials); independently implementable. Strong source + CPU structure evidence, GPU benefit remains to be profiled. Do not market this as a low-risk one-line fix.

### GEO-B2 — Medium: changed overlapping text and large model copying can dominate update latency

**Sources:** `src/scripts/ground-geometry.js:156–192` (especially union at 186–189), `src/workers/extrusion-entry.js:16–24`, `src/workers/font-geometry-worker.js:29–39`, `src/scripts/font-service.js:120–124,143`.

**Measured:** heavy Magneto median cold model 113.296 ms, warm glyph-cache model 110.943 ms, extrusion 147.724 ms (p95 159.320 ms); an 18,777,984-byte mesh. The heavy model structured-clone median/p95/p99 is 9.072 / 10.010 / 23.476 ms; mesh clone median/p95 2.834 / 8.725 ms. Node clone figures identify possible scheduling pressure, not browser long-task measurements.

**Recommendation:** preserve worker execution and full-model caching. Coalesce obsolete manual work before dispatch while preserving accepted conference FIFO semantics. The mesh worker can usually resolve the model by the render key already present in its model cache; consider a key-only request with a cache-miss fallback, avoiding a complete model send back to the worker. Profile the browser before introducing packed-coordinate formats or incremental geometry. A naive transfer of retained cached ArrayBuffers would detach them and break caching.

**Regression:** Low–Medium for key lookup with explicit miss recovery; Medium for scheduling semantics; High for data representation rewrites. Independent of visual fidelity. Current unchanged main-cache hits already avoid these costs.

### GEO-B3 — Low: two-entry font cache forces repeated parsing across the five conference fonts

**Sources:** `src/workers/font-geometry-worker.js:5–9,17–31`, `src/scripts/font-service.js:120–124`, `src/scripts/conference-presentation.js:224–245`.

**Measured:** all five outline source files total 348,232 bytes, but preparation retains only two. Cycling the same short text through all five 50 times causes 50 `FONT_EVICTED` retries and 55 parses including initial preparation, even though five complete text models remain cached. Median retry path 0.384 ms, p95 16.923 ms; the higher early tails include first-time geometry. Isolated font parse medians are only 0.046–0.211 ms here.

**Recommendation:** permit a small conference-specific parsed-font residency set within an accurately measured memory budget, or return a cached complete model before requiring its parsed font. Keep eviction for general font catalogues. Do not imply large FPS gains from the small parse timings.

**Regression:** Low–Medium; independent. Verify 100 mixed-font changes, zero avoidable parse retries for warmed models, and stable actual heap. Increasing global count limits without measuring glyph-cache memory is not justified.

### GEO-B4 — Medium capacity constraint: two individually valid large models cannot coexist for an atomic swap

**Sources:** `src/scripts/ground-model-cache.js:28–39`; `src/scripts/geoglyph-map-engine-inline.js:1669–1671,1699–1705`.

**Measured:** the 223-character Magneto phrase and that phrase plus ` 1` (225 characters) each succeed in an empty main cache. Their retained budget costs are 22,363,136 and 22,380,864 bytes, respectively. With the first active, preparing the second fails the 32 MiB combined limit. The previous geometry is preserved without disposal and the rejected candidate does not enter the cache. This confirms an intentional safety trade-off, not a leak.

**Recommendation:** preflight consecutive longest expected cues using the actual chosen font, quality and 3D mode. Retain the previous image and explicit operator feedback. Any later increase or staged transition design must prove peak GPU/JS memory headroom on the presentation hardware; do not simply raise the budget or reduce quality without consent.

**Regression:** Low for rehearsal/preflight; Medium–High for allocation/atomic-swap changes. Independent of font parsing. This can produce an apparently stale display even when each message works after a reload.

### GEO-B5 — Medium: cache counters describe payload estimates, not actual heap ceilings

**Sources:** `src/workers/font-geometry-worker.js:3–11,30`, `src/scripts/ground-geometry.js:125–153`, `src/scripts/ground-model-cache.js:28`.

**Measured short CPU stress:** 600 distinct changed messages. Worker model cache reaches ~32 MiB and ~207–210 entries; mesh cache remains ~30–31.5 MiB and 14–15 entries. Forced-GC process heap rises from 14,756,184 bytes to 122,491,016 after 300 updates, then 123,053,064 after 600. It is approximately stable during the latter half. RSS goes from 605,286,400 to 678,633,472 bytes; the high starting RSS reflects prior heavy-benchmark allocations, not a cold page. This is evidence of bounded retention in the probe, not a proven leak or a browser memory ceiling.

**Recommendation:** document counters as estimates and profile browser retained heap/GPU resources during the required long soak. Nested coordinate arrays and per-glyph path data exceed nominal numeric payload bytes. Keep existing cache limits until the measured peak is known; packed data or budget recalibration belongs after demonstration validation.

**Regression:** Low for measurement/documentation; Medium–High for representation changes. Independent. The 600-update CPU probe is ~62 seconds of processing, not a 60-minute continuous visualisation test.

### GEO-B6 — Existing compatibility boundary: some approved fonts reject particular legitimate phrases in 3D

**Sources:** `src/scripts/ground-geometry.js:114–120`, `src/scripts/conference-presentation.js:58–77`, `src/scripts/geoglyph-map-engine-inline.js:1608–1615,1673–1686`.

**Measured:** Forte accepts `GeoGlyph`, but rejects the normal multiline and heavy synthetic phrases with `Complex or self-crossing outline requires styled raster rendering`. This is the existing conservative outline policy, not a new bug caused by this audit. Explicit Forte 3D cues may therefore retain an earlier visual; random selection should try another eligible font.

**Recommendation:** include exact-font exact-text rehearsal and verify successful-cue/failure status semantics. Preserve established fallback and outline policy; do not disable validation for demonstration appearance.

**Regression:** Low for tests/preflight; broad outline-policy changes are High risk and unsuitable immediately before a demonstration.

## Positive verified behavior

- 1,000 main-cache prepares of an unchanged model cause exactly one worker build request, one retained entry, 1,000 hits, and no eviction. Median host lookup below 0.001 ms; this is only a Node bookkeeping measurement.
- Repeated actual worker model/mesh requests produce one model and one mesh build; median cloned-request latencies 0.300 / 0.953 ms for the normal Gill Sans phrase. The main GPU-geometry cache avoids even these worker round trips.
- Mesh sizes are validated; main-cache oversize rejection preserves the active geometry.
- Worker model/mesh retention stabilises during 600 unique updates; no unbounded cache growth was demonstrated.

## Limits

No browser rendered these benchmark scenarios. No frame-time, 1% low FPS, GPU utilisation, GPU allocation, initial page-load, or displayed-text latency number is claimed. Normal idle and continuous orbit performance are not measured. No 60–120-minute GPU/browser/network-failure soak was performed by this harness. Actual browser test execution and GPU diagnostics belong to the parent audit. Source hashes are recorded in `geometry-results.json`.

Whole harness elapsed 85.781 s; user/system process CPU 100.381/8.874 s. These totals include all benchmark phases and GC; they are not normal application CPU utilisation.
