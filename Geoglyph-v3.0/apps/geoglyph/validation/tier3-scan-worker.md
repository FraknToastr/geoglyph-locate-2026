# Remaining Tier 3: QR scan worker

Baseline: `ca0791f`. This extends the completed Tier 3 batch with GG-21's worker isolation. Font loading is outside this change.

## Implementation

The jsQR fallback scanner sends a fresh full-resolution pixel buffer to a dedicated worker. Native BarcodeDetector remains the preferred path. The worker uses the same bundled jsQR version, inversion policy, 25-pass maximum, detection ordering and white rectangular region masking. No image downscaling or import limits were added.

The modular application and portable HTML both embed the worker source, including its decoder, so it does not fetch a worker or decoder from a CDN. The scanner creates the worker lazily. Page departure cancels pending work, terminates the worker, revokes its URL and invalidates the scan queue. Late results cannot update rows; interrupted rows become queued. Later scans can recreate the worker after a cached-page return.

If workers or OffscreenCanvas are unavailable, or worker execution fails, scanning uses the established main-thread implementation and the original caller-owned bitmap. Explicit cancellation must not trigger fallback. The caller still closes its bitmap. A finite worker watchdog provides a failure path rather than leaving a permanently pending request; it is not a benchmark deadline or proof of maximum scan latency.

## Evidence and trade-offs

Source inspection establishes that the previous fallback called synchronous jsQR on the main thread once per decoding pass. Yielding between passes could not interrupt a single decode. The new path moves those decoding calls to the worker. Browser verification deliberately makes main-thread jsQR throw after generating the fixture, proving that successful scans use the embedded worker.

The initial canvas draw/readback still occurs on the main thread. A worker adds startup cost, a separate decoder instance and transient full-resolution image storage. Transferring the fresh pixel buffer avoids cloning that buffer; it does not eliminate all image allocation. Worker error fallback can repeat work and still block during an individual synchronous decode. These costs mean this is a responsiveness improvement in execution placement, not a measured overall speed or memory reduction.

No physical-GPU frame-time comparison, large-image latency benchmark or long-duration memory measurement was performed. Extended browser runs and soaks remain deferred. The UI has no new Stop control; cancellation is available through the scanner service and used for page lifecycle cleanup.

## Verification and rollback

Focused units passed: `qr-scanner-worker.test.cjs` (9 cases), plus existing `qreverse-scaling.test.cjs` (6 cases). They cover lifecycle/fallback, cancellation, stale messages, constructor failure cleanup, bitmap acquisition, detection ordering and masking. Both short Chromium checks passed: modular (1.1 seconds) and portable (999 milliseconds), with a 2.7-second runner total. Each decoded the fixture with main-thread jsQR disabled and successfully recreated the worker after cancellation.

Build and whitespace checks passed. Portable output is 21,441,686 bytes, an increase of 273,740 bytes over `ca0791f`, principally the second bundled jsQR copy for worker isolation. No dependencies were added and no font-loading source was changed. The full suite and extended runs were not run.

Rollback if detections, order, masking, row state or compatibility change; if pending work survives cancellation; or if representative required images show excessive worker startup/memory costs. Revert the QR worker/service, their asset/template/build provisioning and the narrow core scanner integration together, then rebuild. This restores the existing jsQR fallback without changing persisted settings, fonts or the earlier Tier 1–3 improvements.
