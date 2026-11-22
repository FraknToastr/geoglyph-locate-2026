# Independent network and conference lifecycle audit

Audit date: 2026-10-31. Paths below are relative to `Locate 2026 version/`. Application files were not edited. `network-repro.cjs` reads the application sources and executes their functions/client with synthetic dependencies. Run `rtk proxy node audit/2026-10-31/network-repro.cjs`. Results are in `network-repro-results.json`. This is state-machine evidence, not a browser benchmark or live-service test.

## NET-01 — Superseded conference work can leave manual rebuilding locked

- **Severity:** High. **Evidence:** source plus deterministic reproduction. **Independence:** yes, with careful ownership handling. **Regression risk:** low–medium; cancellation ownership must not let an old operation unlock a newer one.
- **Sources:** `src/scripts/geoglyph-map-engine-inline.js:1593-1599`, `:1628-1634`, `:1912-1922`, `:1941-1942`, `:1953-1965`.
- **Trigger/root cause:** a cue sets `conferenceApplying=true` and awaits geometry. A manual font choice increments `fontChoiceVersion` and requests rebuilding. That request only sets `conferenceRebuildPending` because the conference flag is true. The old cue becomes stale, but its `finally` releases the flag only if its old selection version still matches. No later manual request releases it.
- **Measured state-machine result:** deferred cue + manual font selection yielded `Cue render was superseded`, `conferenceApplying=true`, `conferenceRebuildPending=true`; a further manual rebuild request did not start another rebuild. A subsequent successful conference cue or Reset may clear it; otherwise the display remains stale and controls appear ineffective.
- **Fix:** give conference work an explicit owner token independent of font selection, releasing the lock/pending work in `finally` when that operation still owns the lock. Alternatively centralise manual supersession in an ownership-safe cancellation helper; do not unconditionally clear a newer cue's lock or stop an existing orbit as an accidental side effect.
- **Verify:** delay font preparation, change font manually, release the old work, then change text/style with no subsequent survey cue. Assert rendering resumes, the latest selection wins, flags settle, and a newer cue cannot be unlocked by old cleanup. Existing conference tests cover Reset supersession but not manual selection during a cue.

## NET-02 — No whole-poll or FIFO backpressure budget

- **Severity:** High for a sustained busy public feed; Medium likelihood at a small demonstration. **Evidence:** source and actual client with synthetic responses. **Independence:** yes, but transport and queue changes should be designed together. **Regression risk:** medium because FIFO and Reset priority must be preserved.
- **Sources:** `src/scripts/survey-results.js:186-202`; `src/scripts/conference-presentation.js:5-8`, `:78-85`, `:145-173`.
- **Root cause:** each request has a 15-second timeout, but `afterCues` has no limit on pages, rows, aggregate bytes, or overall elapsed time. It accumulates all pages before returning. The conference then appends every row to an unbounded array and removes one at a time with `shift()`. Rendering/Fit is serial. Polling continues while that rendering is busy. A feed that grows as fast as paging can keep one poll alive indefinitely; an eventual failure discards the accumulated results and rereads them on retry.
- **Measured probe:** actual `afterCues` accepted 100 full synthetic pages/2,500 rows; no rows were delivered to the conference before the probe externally aborted request 101. This demonstrates the missing bound, not a claim about current service traffic or heap consumption.
- **Impact:** increasing submission-to-display delay, large retained queues, unnecessary repeated downloads after later-page failure, and eventual memory pressure. A 30-second Begin flight intentionally holds later cues and can contribute to a transient backlog.
- **Fix:** bounded page/row/byte work per poll with a resumable cursor, and backpressure tied to pending render work. Advance acknowledged cursors only for safely retained work. Preserve every accepted cue and Reset's existing semantics; do not silently drop or coalesce content submissions. An operator-selected latest-only mode would be a separate behaviour change, not an audit optimisation.
- **Verify:** synthetic sustained arrival, 429/failure on a later page, Stop/Resume, Reset behind a burst, queue high-water/heap plateau and eventual FIFO delivery in a 60–120-minute browser soak.

## NET-03 — Outages and throttling retry at the normal one-second cadence

- **Severity:** Medium. **Evidence:** source. **Independence:** yes. **Regression risk:** low if success resets the delay and interval edits/Stop retain their existing contracts.
- **Sources:** `src/scripts/conference-config.js:3-4`; `src/scripts/survey-results.js:78-109`; `src/scripts/geoglyph-map-engine-inline.js:1122-1132`, `:1189-1199`, `:637-643`.
- **Root cause:** transient HTTP errors, including 429 and 503, are generic request failures; no `Retry-After` is preserved. Scheduling subtracts request elapsed time from the normal interval, so a long failed request is immediately followed by another one. Fast failure retries every second. Every failure also repeats a warning toast.
- **Impact:** needless public-service load and repeated distracting warnings during an outage, with no recovery advantage while a service explicitly asks clients to wait. Successful-response display is already retained.
- **Fix:** classify transient errors, honour a valid `Retry-After`, use bounded exponential backoff with jitter for consecutive failures, reset on success, and deduplicate warnings by connection state. Keep existing anonymous authentication and read-only POST `/query` requests.
- **Verify:** scripted 429/503/timeouts, bounded maximum request rate, no overlaps, Stop cancels a scheduled retry, interval changes stay valid, and automatic recovery returns to the requested cadence without blanking the display. Existing tests cover temporary failure/recovery, not throttling/backoff.

## NET-04 — Online font/startup dependencies have no timeout or recovery path

- **Severity:** High for interrupted startup. **Evidence:** source. **Independence:** yes. **Regression risk:** low–medium; preserve all six exact fonts and the intended opening sequence.
- **Sources:** `src/scripts/conference-presentation.js:202-244`, `:248-258`; `src/fonts/manifest.json:1-8`; `src/scripts/geoglyph-map-engine-inline.js:1515-1523`.
- **Root cause:** online font `fetch(font.file)` has no AbortSignal/timeout/retry. `Promise.all` gates all startup on every font. Missing host/engine/3D dependencies and `mapReady` are awaited in 20 ms loops without a deadline. A rejected font request ends startup permanently; pressing polling Start does not rerun startup. The map watchdog only changes a status message.
- **Impact:** the map may appear while sleeping-emoji preparation and live polling never become ready; reload may be needed. A 12,934,920-byte emoji font is required by the opening and dominates cold font transfer; this byte count is source inventory, not measured network latency.
- **Fix:** bound font acquisitions and dependency readiness, retry transient font failures a small number of times, and expose a controlled idempotent startup retry using existing unobtrusive operator controls/status. Cache successful acquisitions between retries. Do not replace the intended fonts or reduce visual quality to conceal acquisition failures.
- **Verify:** hold one font response indefinitely, fail one response then restore connectivity, fail map initialisation, and simulate unavailable worker. Check deadlines, cancellation, one startup/polling instance, preserved opening behaviour, and recovery without reload. Existing browser tests cover immediate font failure and slow basemap tiles, not hung font fetch or startup retry.

## NET-05 — Hidden-tab rendering and cue deadlines use conflicting clocks

- **Severity:** Medium. **Evidence:** source-supported scenario; browser verification required. **Independence:** largely independent, coordinate with queue/backpressure. **Regression risk:** medium.
- **Sources:** `src/scripts/ground-camera.js:136-150`, `:190-197`; `src/scripts/ground-3d.js:105-122`; `src/scripts/geoglyph-map-engine-inline.js:1870-1894`, `:1900-1908`; `src/scripts/conference-presentation.js:85-86`, `:122-133`, `:163-178`.
- **Root cause:** camera rAF pauses on document visibility, while polling/cue draining has no visibility gate. A commit awaiting rAF can remain pending while hidden, allowing a backlog. An already-started camera/frame wait uses wall-clock deadlines (15/30/40 seconds), so it can expire while rendering is deliberately paused. A failed row has already been shifted and its ID marked queued; it is not replayed.
- **Impact:** backgrounding during a cue can accumulate responses or classify an unrendered cue as failed; on return the user can see stale content or a long catch-up. Browser timer throttling affects the exact timing, so this is not claimed as an executed browser result.
- **Fix:** pause cue acceptance/draining at a deliberate boundary while hidden, preserve the active cue, and suspend render-specific timeout accounting during visibility pauses. Resume deterministically on visibility return. Keep network/backpressure policy explicit and preserve FIFO/Stop semantics.
- **Verify:** hide for 60 seconds during 2D draw, 3D commit, 650 ms Fit and 30-second Begin; return and assert the active cue completes once, no cue is lost/reordered, and request/heap growth remains bounded.

## NET-06 — Cue controls and repeated content still enter the full rendering path

- **Severity:** Medium (performance opportunity). **Evidence:** source, cost requires browser profiling. **Independence:** yes, after a clear dirty-state contract. **Regression risk:** medium; new content IDs intentionally trigger Fit even when text is identical.
- **Sources:** `src/scripts/conference-cues.js:46-70`, `:90-95`; `src/scripts/geoglyph-map-engine-inline.js:1929-1949`, `:1661-1667`.
- **Root cause:** every nonempty resolved cue calls `rebuildGeometry`, including a colour-only control record or unchanged repeated content. Model caches can avoid triangulation, but geographic arrays, GeoJSON transfer, metadata/UI updates and sometimes raster recolouring/texture uploads still occur. The standard authoring poll already guards identical message strings at `:1181-1187`.
- **Fix:** compare effective geometry, pose, paint and content state. Apply paint-only/transform-only changes to retained resources. Preserve automatic Fit for each new content-bearing record and explicit command semantics; do not deduplicate whole submissions by text.
- **Verify:** identical geometry hash and displayed pixels for paint-only cues; worker job/mesh upload/source setData counts stay flat where appropriate; repeated content IDs still Fit exactly once. Existing tests deliberately require repeated IDs' Fit semantics.

## Positive findings and limits

- Per-request AbortController and 15-second timeout, listener/timer cleanup in `finally`, monotonic Object ID validation, explicit field selection and page size <=25 are good transport safeguards.
- No request overlap during a normal polling generation; Stop invalidates late responses even if an underlying response cannot be cancelled. Poll frequency changes apply during a running session.
- Read-only POST `/query` avoids previously observed public GET caching. Anonymous `credentials:'omit'` is deliberate; access/schema errors stop polling rather than silently changing authentication.
- Failed requests retain the current display. Conference draw failures have a snapshot/rollback path; bounded history is capped at 1,000 phase records. Reset supersession and Stop/Resume have specific browser tests.
- No live respondent data was fetched or changed by this audit probe. No credentials or service identifiers are logged in the new evidence. Browser launch is restricted by the session sandbox; no FPS, rendered pixels, hidden-tab outcome, or 60–120-minute browser soak is claimed here.
