# Tier 1 checkpoint 3 — camera-only 3D invalidation

The zoomend handler skips geometry dispatch only for a visible, committed vector model with extrusion enabled. Other geometry inputs still use the existing rebuild path; 2D, decals and incomplete/invisible models retain zoom-dependent rebuilding.

Three focused regression cases and all 11 existing camera lifecycle cases pass. A deterministic handler comparison dispatches zero rebuilds for 100 unchanged committed-3D zoom events, versus 100 under the original unconditional zoom handler. This is dispatch-count evidence; browser frame times and actual rendered pixels remain unmeasured/deferred. Conference build succeeds. No full battery, browser or soak run was performed.

Revert this isolated commit and generated files if later browser checks reveal stale content, changed adaptive sampling, appearance, camera Fit or exports. Material/geometry quality and the base studio are unchanged.
