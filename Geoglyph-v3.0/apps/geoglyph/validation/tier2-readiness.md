# Tier 2 controlled improvements and validation

Implemented in the conference edition against the reviewed Tier 1 baseline `3ec073c`. The preserved base studio is unchanged. No new dependencies, reduced rendering quality, altered font-outline policy or raised resource budgets.

## Implemented code changes

- **GG-06:** Extrusion packs identical cap/side triangles into two material ranges for solid mode. Transparent mode retains its original group sequence through remapped offsets. Outline positions, normals, material association and geometry bounds are preserved.
- **GG-07:** Data queries return at most four pages/100 rows, reduced to available queue capacity. At most 100 pending cues are retained, plus the currently accepted cue. Subsequent polls resume from the last retained Object ID. No latest-only coalescing or silent dropping of ordinary submissions.
- **Reset priority:** When a batch may be truncated or the queue is full, a separate bounded command lookup checks for a newer Reset. It uses the hosted service's supported UPPER/LIKE filter and verifies exact trim/case semantics in JavaScript. Reset intentionally discards preceding work under the existing command policy; rows after it remain on the service for subsequent polls. The lookup itself is bounded to four pages of at most 25 candidates; pathological malformed substring matches beyond this limit can delay discovering an older Reset. Normal content backlog cannot conceal a valid Reset behind a full data queue.
- **GG-09:** Hidden presentations pause further cue admission/draining, while accepted work remains current. Render/camera deadlines count visible time, resume/repaint on return and clean up timers/listeners. Hidden waits still check cancellation. Startup deadlines retain their separate real-time policy.

## Measurements and checks

- Actual short Chromium custom-layer measurement: solid **401 → 3 draw calls**; transparent **801 → 801**. Frozen-camera framebuffer comparison: **zero differing RGBA channels** in both modes. These are custom-layer calls, excluding basemap draws. Environment: Chromium 149 / ANGLE Vulkan SwiftShader; no physical-GPU FPS improvement is claimed. Details: `tier2-material-batching.json` and `tests/browser/material-batching.spec.cjs`.
- Focused unit cases passed: 3 material preservation/batching; 7 paging/queue/FIFO/Stop/Reset; 3 command-priority; 6 visible-time deadline/cancellation/cleanup; 7 existing mesh-cache; 15 existing transport; 14 startup cases. The full test battery was not run.
- Ten selected browser integration cases passed across targeted batches: Reset supersession, FIFO burst, size presets/settings, Stop/Resume, Tier 1 manual supersession, Tier 1 worker recovery, shared context restoration, bounded queue with priority Reset, injected visibility coordination and production-bundle material/pixel parity.
- Initial integration result was 9 passes and one test-setup failure: visibility was injected before the first cue finished. The corrected test waits for initial application. Only the affected visibility/context cases were rerun (2 passed, 7.2 s). After adding priority Reset, only its three related checks were rerun (3 passed, 11.4 s). Initial integration batch duration: 39.1 s. No browser batch exceeded its short explicit time limit.
- The visibility browser test injects `document.hidden` for 200 ms against a 100 ms deadline; its virtual-clock unit counterpart simulates 60 seconds. Neither is a real prolonged browser hide or a measurement of background timer throttling.
- A real shared-context loss/restore completed and a subsequent 3D cue rendered without page errors. This verifies that short recovery scenario, not every driver/browser failure mode.
- The public Pages root returned HTTP 200. Its served font-service SHA-256 matched the reviewed Tier 1 commit: `a6cf11d25f1fb3c3b1c470f2d1f9d7b1d4b2d56ad565213a58256f4270bb0ce4`. The new Tier 2 code has not been published as part of this implementation.
- Read-only count probes confirmed service access and UPPER/LIKE support. TRIM and LTRIM/RTRIM variants were rejected, so they are not used. No respondent records, access tokens or survey writes were involved in these probes.
- Conference build succeeds and both portable deliverables are byte-identical. No application source changed merely to pass a test fixture.

## Remaining Tier 2 release gates

Tier 2 includes validation work as well as code fixes; this is not an unconditional demonstration-ready signoff.

- Physical presentation GPU/driver, refresh rate, external display/DPR and venue network rehearsal remain unverified. SwiftShader evidence cannot establish physical-GPU frame-time tails.
- Exact operator-selected longest messages/fonts and consecutive large-model transitions still require rehearsal; existing outline rejection and active/candidate memory limits deliberately remain in force.
- Hosted Tier 2 revision verification follows publication. HTTP/script hash checks are not a full cold hosted-browser rehearsal.
- Real fullscreen/display transitions, actual background throttling and prolonged resource stability remain separate checks.
- No full browser suite, extended browser run or soak was performed. Extended runs and soaks require explicit user approval.

Rollback must restore the corresponding source and rebuild conference generated artifacts together. Do not remove compatibility adapters, raise budgets or relax outline validity to mask a regression. Other audit findings, such as network backoff and optional QART/scanning optimizations, are not included in these Tier 2 code changes.
