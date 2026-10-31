# Tier 1 checkpoint 5 — bounded startup and retry

All five Tier 1 fixes are now implemented locally in separate commits. Browser validation and publication remain deferred. No browser runs, extended browser runs, soaks or full test battery were performed during these fixes.

Conference startup now coalesces repeated calls, retains successfully acquired font bytes, bounds dependency/download/face/map readiness, and exposes retryStartup() through the existing ArcGIS Start control while startup is incomplete. Healthy ready-state Start retains its polling behavior. Default UI/map initialization runs once. Explicit retry can replace only a failed non-ready map, with generation checks preventing late old initialization/style callbacks from taking ownership. Portable fonts remain supported without HTTP fetching.

Limits: host readiness 10 seconds; each font download including body 15 seconds with three total attempts and 1/2-second delays for transient failures; native FontFace load 30 seconds inside its service acquisition slot; map readiness 20 seconds; whole startup 120 seconds. Successful resources are reused, stale continuations are invalidated and failure feedback uses existing controls/status. Actual browser timer scheduling remains to be validated.

Focused checks passed: 14 startup/download/native-face/map/Start cases using virtual clocks; 10 existing font cases; 11 worker recovery cases. After the map changes, the five ownership regressions also pass. Engine syntax and conference build pass. The body-timeout case verifies abortion of the specific held font request. No timing figure from these VM tests represents page load time or FPS.

Performance/reliability comparison: prior startup waits/downloads could remain unresolved indefinitely and startup had no retry entry point; virtual-clock tests now settle those failure scenarios at the specified bounds and verify recovery without repeating successful font downloads or starting duplicate pollers. Visual startup, actual HTTP/file browser behavior, frame metrics and physical-GPU performance remain deferred.

Rollback: revert this isolated commit and generated deliverables if real browser checks show altered opening appearance, stale startup work, duplicate maps/pollers, broken font recovery or changed normal Start behavior. Existing worker recovery remains a separate earlier commit. Preserve unrelated work and the untouched base studio.

Targeted-test policy: run relevant cases for a changed subsystem; do not automatically run the full suite after each checkpoint. Extended browser runs and soaks require explicit user approval.
