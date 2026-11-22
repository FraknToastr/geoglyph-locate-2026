# Turn smoothness investigation

## Outcome

The reported regression was not reproduced in controlled comparisons. No application rendering or camera source was changed: the evidence does not justify a speculative optimisation or a claim that the user's stutter is fixed. A normal-browser trace on the user's display remains necessary.

Compared the current renderer with the compiled renderer from `14dd480`, using the same current application shell, exact font/message, camera mode, dimensions and mocked imagery. This isolates recent 3D-renderer changes, not every historical shell change. The ground-camera source itself is unchanged since that revision. No live Survey123 requests, authentication or deletion were involved.

## Measurements

Two corrected comparison passes completed. The retained repeat used Chromium headless, 1440 × 1000, local modular `file://`, Gill Sans Ultra Bold Condensed, “Where are you Josh?”, yaw/Turn, and 3-second steady-animation samples after framing. Initial framing time is excluded. Numbers below are measured map-render intervals, not estimates of the user's display FPS.

| Renderer | Size | Render intervals | Median ms | p95 ms | p99 ms | Camera jumpTo p95 ms |
|---|---|---:|---:|---:|---:|---:|
| Previous | Medium | 43 | 68.9 | 75.4 | 88.7 | 0.4 |
| Previous | Large | 44 | 69.5 | 74.6 | 83.4 | 0.4 |
| Current | Medium | 44 | 68.5 | 73.3 | 75.8 | 0.4 |
| Current | Large | 44 | 68.4 | 72.3 | 82.9 | 0.3 |

All samples had zero control-panel DOM mutations and zero additional GPU model uploads, mesh builds or worker resource growth. Mesh storage remained 849,888 bytes; model storage 61,440 bytes. Frequent roughly 60–70 ms long tasks accompanied the slow rendering. The measured jumpTo duration excludes pose calculation and GPU completion. Generic WebGL renderer identification was `WebKit WebGL`; the actual GPU/driver and acceleration path were not established. Small differences between samples are not evidence of an improvement.

The environment renders slowly for both versions. These results cannot establish real GPU performance, actual imagery cost, physical presentation smoothness, or concurrent survey-update effects. Mocked transparent tiles intentionally remove network variability but also omit real imagery decoding/upload work. The short duration does not cover a complete 30-second orbit or all camera headings. No soak was performed.

Two initial setup attempts hit their overall caps and yielded no measurements. The successful diagnostic waits for font import and follows the same applyConferenceCue/ensureOrbit path used by Begin. Those failed attempts are excluded from the table. Raw retained repeat: `/tmp/geoglyph-turn-results.json` (temporary, machine-local).

## Checks and further opportunities

Eleven orbit lifecycle cases and five pose/render cases passed: one animation callback chain, elapsed-time rotation, pause/resume behaviour, retained camera phase, framing cache invalidation and transform equivalence. Source inspection found no steady-frame path into the newly added bulk-control observer, admin UI or introduction timers.

The next useful measurement is a short performance trace in the actual Windows browser while the final Begin message turns, including the browser's GPU acceleration status and whether the issue persists after imagery settles and polling is stopped. This should distinguish rendering/driver stalls, tile work and update-related interruptions before choosing a patch.

Potential optimisations remain conditional: reuse camera pose scratch outputs if allocation profiling shows garbage-collection spikes; unify camera/render scheduling only if a trace shows missed or uneven render opportunities; reduce redundant material/pose updates if their measured CPU cost is material. Do not reduce resolution, outlines, effects or animation speed to conceal the issue. Compare p95/p99 intervals and visual output before retaining any change.

## Repeatable diagnostic

`tests/browser/turn-profile.spec.cjs` is opt-in and skipped in ordinary runs. With Chromium execution permitted, run:

```sh
rtk proxy env GEOGLYPH_TURN_PROFILE=1 GEOGLYPH_PROFILE_OUTPUT=/tmp/geoglyph-turn-results.json node node_modules/@playwright/test/cli.js test tests/browser/turn-profile.spec.cjs --workers=1 --retries=0 --global-timeout=60000 --reporter=list --output=/tmp/geoglyph-turn-profile
```

The diagnostic records rendered-frame intervals, jumpTo duration, long tasks, control DOM changes and before/after worker/GPU-resource counters. Assertions require actual rendering and stable mesh/upload counts. No dependencies added, application rebuild needed, commit or push performed for this investigation.
