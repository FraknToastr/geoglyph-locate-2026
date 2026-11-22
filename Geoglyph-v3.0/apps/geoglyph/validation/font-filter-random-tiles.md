# Local font filter, Random framing and tile observations

## Implemented

The Map Font section now has an initially unchecked **3D compatible** filter and an inline **Rescan** button. Compatibility is general, independent of the displayed message. A positive result requires a successful worker-generated extrusion of at least one supported printable glyph within the existing 32 MiB per-model preparation budget. The bounded probe tries up to eight glyphs, preferring Latin letters/digits then other mapped printable characters, including non-Latin/private-use characters. Colour fonts are excluded under the current 3D policy; unresolved fonts remain unverified rather than being declared permanently incompatible. Existing runtime checks still reject messages with missing or unsupported characters. No GPU uploads or selection changes are caused by the scan.

Only Rescan starts a scan; checking, unchecking, messages and reloads never start or resume work. An explicit scan continues when the checkbox is unticked, and Rescan is disabled until it finishes. Checks run sequentially with background-priority preparation, yielding between fonts and deferring new checks during foreground rebuilding, Random and conference work. Inaccessible entries are counted from metadata immediately. The scan never requests Local Font Access permission. The current selection is retained separately if it is absent from the verified list.

Definitive results are saved to versioned browser localStorage under `geoglyph-locate2026.3d-font-results`, using stable resource identities and available file/source metadata, not transient provider counters. Saved data contains only identity/result pairs and schema/scan metadata—no font bytes, glyphs, geometry or meshes. Aliases share checks/results. Writes are batched, flushed at scan completion/page hide, and limited to 4,000 entries and 1 MiB, evicting oldest entries. Blocked/corrupt/full storage falls back to memory with a concise status. Inaccessible/transient outcomes are not saved as permanent incompatibility. New/unmatched fonts require explicit Rescan. The cache does not grant font access, copy font files, or share itself across browser profiles/origins; Rescan is appropriate after font replacements. The checkbox itself remains session-only and defaults off after reload.

Manual Random now overrides the conference overview guard for its post-draw Fit. It still waits for its own rendered block, retains a running animation and uses the full-turn framing calculation; explicit manual Fit retains its existing stop behaviour. No animation speed, visual quality or camera framing algorithm was changed.

Only local modular `index.html` was rebuilt. Portable copies retain their preceding state. No commit or push.

## Saved general-list verification

- Twelve focused unit cases passed: explicit-only scanning, saved-list restoration without font work, alias deduplication, transient outcomes, blocked/full/corrupt/obsolete storage, entry/byte limits, foreground deferral/disposal, stable identities, non-Latin/private-use probing, bounded probing and worker-failure handling.
- One short Chromium `file://` regression passed, checking the label/button alignment, initial no-scan state, active-scan toggles, saved results across reload, message-independent filtering, zero checks on repeated toggles/reload, explicit rechecking despite cached outcomes, unchanged selection/artwork/GPU uploads and zero permission prompts. Only scan-result metadata was stored. First scan or a cleared cache requires clicking Rescan.
- Local modular build, syntax and whitespace checks passed. No soak, dependency changes, commit or push.

## Prior iteration's verification (message-specific filter)

- Six focused compatibility-controller cases passed: result classification, cache reuse/invalidation, single-flight stale-response protection, disabling, foreground-work deferral and bounded caching. Seven existing cue-ownership cases also passed.
- Four distinct short browser regressions passed: local disk filtering, static 3D Random swaps, Turn Random swaps, and Random while conference overview suppresses ordinary automatic Fit. The last case also independently projects model bounds across 24 headings and verifies at least a 9.5% viewport margin.
- The disk filter case checks actual bundled Gill Sans/Magneto models, excludes Segoe UI Emoji and an inaccessible record, updates on a new emoji message, retains the selection, makes zero font-permission calls and adds no GPU uploads or artwork rebuilds after the initial scene settles.
- Initial filter-test failure was caused by measuring its baseline before the initial 2D camera finished moving; that motion legitimately triggered zoom-related rebuilds. Waiting for the map to settle corrected the measurement, which then passed without an application change.
- Syntax and whitespace checks passed. No broad test battery or soak run.

## Tile pop-in: reproduced, not patched

An opt-in diagnostic in `tests/browser/tile-loading-profile.spec.cjs` samples the actual Medium/Gill Sans/final-message Turn state for three seconds of motion and 1.2 seconds after stopping. It colours the background magenta and samples 8-pixel strips at the right and top edges. The 3D layer is hidden during classification to isolate raster coverage. Percentages below describe those narrow strips, **not the whole viewport**.

| Tile responses | Additional requests during motion | Maximum right-edge gap | Maximum top-edge gap | Right/top gaps after stopping |
|---|---:|---:|---:|---:|
| Immediate green mocks | 76 | 85.2% | 100% | 0% / 0% |
| Green mocks delayed 600 ms | 61 | 100% | 100% | 0% / 0% |
| Real imagery | 76 | 85.2% | 100% | 0% / 0% |

All three baseline scenarios eventually reported all tiles loaded. A diagnostic-only comparison using the supported `cancelPendingTileRequestsWhileZooming:false` option did not improve coverage; the delayed case still had 10.5% right and 4.5% top gaps after the stopped interval. That option was **not** retained. There is no measured case for increasing cache size: first-time newly visible coverage still needs to be requested and loaded.

This confirms transient raster coverage gaps during motion, consistent with the user's observation that they fill after stopping. It does not prove a historical regression or establish whether MapLibre's request/coverage scheduling, decoding, rendering or real network latency dominates the user's visible symptom. Existing basemap coverage, clipping and cache settings remain unchanged.

Limits: only about 36 degrees of rotation sampled; headless Chromium; edge pixel reads perturb frame timing; real imagery changes over time; this diagnostic does not assess final model appearance or physical Windows GPU performance. The results do not justify an undocumented MapLibre internal patch, extra predictive traffic, a larger memory budget or reduced visual quality.

Raw machine-local diagnostic results: `/tmp/geoglyph-tile-results.json` and `/tmp/geoglyph-tile-keep-pending.json`. The opt-in browser diagnostic requires `GEOGLYPH_TILE_PROFILE=1`; set `GEOGLYPH_REAL_TILE_PROFILE=1` to include real imagery. It remains skipped during normal tests. No live survey records were altered.
