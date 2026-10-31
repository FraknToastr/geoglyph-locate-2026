# Tier 1 checkpoint 1 — conference transaction ownership

Implemented GG-01 only. The remaining four Tier 1 fixes have not been applied.

The conference application lock now has a private owner independent of font selection. A superseded transaction releases its own lock and schedules deferred manual rebuilding. An older transaction cannot release a newer transaction's lock. Explicit cancellation invalidates ownership. Existing current-cue rollback and stale-result checks remain in place.

Validation:

- Before the application patch, the new five-case ownership regression file had two failures: manual font supersession and leaving Map with a changed selection version.
- After the patch, all five cases pass, including newer-owner protection, explicit cancellation and current-failure rollback.
- All 14 existing conference cue-rule cases pass.
- Conference build succeeds; generated portable deliverables are refreshed.
- No full test battery, browser run, extended run or soak was performed.

Commands: `rtk proxy node tests/unit/conference-ownership.test.cjs`, `rtk proxy node tests/unit/conference-cues.test.cjs`, `rtk proxy node scripts/build.cjs`.

Performance comparison: the lock failure reproduced against the original implementation is resolved by the deterministic regression. This change adds no geometry or per-frame operations. Browser frame timing and visual comparison remain deferred; no FPS improvement is claimed.

Review checkpoint: retain this as one isolated commit. Browser validation and publication remain deferred. Revert this commit, including its generated deliverables, if later browser checks reveal changed appearance, cue order, Fit/animation behavior or stale-result handling. Do not reset unrelated work.
