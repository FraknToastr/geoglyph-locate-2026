# Local ArcGIS administration

The modular `index.html` restores the v18.5 ArcGIS-hosted authorization-code/PKCE workflow for `file://`. Message and Character remain; Geoglyph is the existing presentation; ArcGIS reveals sign-in and administration. Authentication remains in memory and is excluded from settings exports.

Open ArcGIS sign-in, approve access, copy the returned code, paste it into the masked field and choose Exchange code. Use token also accepts an existing access token. Clear removes the session. Reset 123 appears after identity validation.

Reset 123 inspects the configured Survey123 Results service. Its public layer metadata was checked read-only: layer 0 is an updatable view with Query/Extract capabilities. If authenticated metadata still lacks Delete, the application requests its administrative view definition and resolves its source on the same ArcGIS organization host. It requires a single unambiguous survey layer and deletion permission. Ownership restrictions require verified ownership or administrator/full-edit privileges. No old v18.5 data-service URL is reused.

Preparation snapshots record IDs without deletion. Confirmation displays the actual target and record count, including an attachment warning. Confirmed deletion stops polling and clears queued presentation work, sends batches of at most 200 IDs with rollback requested, then verifies those IDs are gone. Newly submitted IDs are excluded. Failures stop without automatic retries; polling stays stopped after confirmation. Cancel preserves polling, including rescheduling a timer consumed during preparation. Existing artwork remains visible.

Validation: 11 focused administration unit tests passed (PKCE, stale code, Clear, in-flight cancellation, ID batches, verified source resolution, permissions, ownership restrictions, partial failure, verification failure, token expiry and request timeout). The 11 existing introduction cases passed with Medium as the final size. Two short Chromium tests passed from disk: mode visibility/Poll stepper, and mocked popup/code exchange plus cancelled/confirmed deletion and Clear. No actual records were deleted, no real ArcGIS account was used, and no soak was run. Authenticated source discovery and the real sign-in approval page require user acceptance testing.

Build using `node scripts/build.cjs --modular-only` for this review. The portable copies retain the previous implementation, including the earlier pending Medium change; administration changes were intentionally built only into the modular local version. No commit or push performed.

## Bulk controls follow-up

Reproduced Expand All remaining disabled after the shared controls refreshed while the whole editor was collapsed and the editor subsequently reopened. The map controls observer now watches the editor's own class changes, and mode UI updates explicitly refresh the shared controls. Existing registration already refreshes dynamically added sections. A short Chromium regression from `file://` failed before the fix and passed afterward (3.3 seconds), covering Message, Character, Geoglyph and ArcGIS, collapse/reopen/expand, accessibility attributes, preservation of hidden section preferences, and Reset 123 remaining hidden without authentication. Only the modular entry point was rebuilt; no soak, commit or push performed.
