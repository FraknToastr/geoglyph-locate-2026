# Release rebuild and short hosted-mode checks

## Build and parity

The full existing build (`node scripts/build.cjs`) regenerated the modular `index.html` and both portable copies, `dist/GeoGlyph.html` and `GeoGlyph_Locate_2026.html`. This supersedes earlier validation notes that the portable copies still lagged the modular version.

- Portable copies are byte-identical: **21,480,382 bytes** each.
- SHA-256 for both: `45e7e9a4696c9d4a40953f176aca1953bc68c29a636d3d09a7a65837cdb758e0`.
- All **43 script/style assets** embedded in the portable HTML match current source, accounting for HTML script/style closing-tag escapes. Modular references match the same asset manifest.
- All **six embedded conference fonts** decode to the original font-file bytes.
- No unresolved asset markers; whitespace integrity check passed.

The portable copies now include the login/Reset 123 interface, saved general 3D-font list and explicit Rescan behaviour, bulk-control fixes, updated Begin script, Random framing fix and Response 169 placeholder correction. There were no application functionality changes during this release step.

## Hosted-mode smoke results

The two existing targeted regressions now support `GEOGLYPH_HOSTED_SMOKE=1` to use the local HTTP server. Their default `file://` behaviour is preserved. Assertions verify the selected URL protocol; the font-list case also checks for unhandled browser errors.

Both hosted checks passed, one worker, **11.3 seconds total**, with a 45-second overall cap:

| Check | Result | Duration |
|---|---|---:|
| Begin → Response 169 colour control → Reset | Passed | 4.9 s |
| Saved general 3D-font list, reload/toggles/message independence and explicit Rescan | Passed | 5.5 s |

The first check verifies the full scripted sequence, Medium/3D/Turn, native-colour policy, actual Yellow material after the legacy-placeholder colour submission, geometry reuse and clean Reset. The second verifies saved result metadata, zero checks on toggles/messages/reload, explicit rescanning, unchanged artwork and no automatic font-access prompt. Survey and tile responses were mocked; no actual survey records were changed. Script timing was accelerated; no soak or broad test battery was run.

Repeat command:

```sh
rtk proxy env GEOGLYPH_HOSTED_SMOKE=1 node node_modules/@playwright/test/cli.js test tests/browser/font-filter.spec.cjs tests/browser/conference-presentation.spec.cjs --grep 'general 3D list persists|retains final text for Response 169' --workers=1 --retries=0 --global-timeout=45000 --reporter=list --output=/tmp/geoglyph-hosted-release-smoke
```

## User acceptance and limits

The user reports successfully using **Reset 123** against the real survey. This is user acceptance evidence, separate from the mocked browser checks; live authentication/deletion was not repeated here. The user also reports not seeing tile pop-in recur since the earlier report. This is not a claim that the underlying tile issue was fixed. No tile settings were changed.

Hosted mode was checked on local HTTP, not live GitHub Pages HTTPS. Real Windows font-permission UI and the newly rebuilt portable copies were not browser-tested during this release step; portable validation here establishes source/font parity, not standalone runtime acceptance. This does not certify prolonged conference operation.

All existing work was preserved. Nothing was staged, committed or pushed; GitHub remains unchanged pending a separate publication instruction.
