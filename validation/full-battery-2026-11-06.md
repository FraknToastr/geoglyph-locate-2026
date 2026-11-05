# Full bounded regression battery — 6 November 2026

This records the three-dot build tested before the later five-dot/banner-size revision. See [the current Begin validation note](begin-conference-day-update.md) for that follow-up's focused checks. The full battery was not rerun for that follow-up.

## Result

**The full regression suite did not pass.** The revised Begin end-to-end case passed, but broader coverage found the failures below. These results do not provide a clean regression sign-off for the application.

| Suite | Passed | Failed | Skipped | Total |
| --- | ---: | ---: | ---: | ---: |
| Unit tests, 28 files | 224 | 1 | 0 | 225 |
| Chromium browser tests, 31 files | 166 | 11 | 2 | 179 |
| Combined | 390 | 12 | 2 | 404 |

Unit execution took 5.2 seconds. The browser suite took 5 minutes 18 seconds with three workers and no retries. Individual failing cases reached their normal 30- or 90-second failure deadlines; no continuous-operation stress test or soak was started.

The two skipped cases were the opt-in Turn comparison and tile-loading profiling diagnostics. Their enabling environment variables were explicitly unset. No missing-font case was skipped in this run.

## Method and evidence

- Rebuilt the current local application using `scripts/build.cjs` before testing.
- Ran every `tests/unit/*.test.cjs` file in a separate Node process and checked its actual TAP case totals. The first launch attempt was blocked by sandbox child-process restrictions (`EPERM`) and did not execute the tests. The completed run used approved execution outside the sandbox. Those launch failures are not counted as application test failures.
- Ran the complete normal Playwright discovery set with `--workers=3 --retries=0`, list/JSON reporting and a 15-minute overall safety deadline. The suite completed before that deadline. Chromium also ran outside the sandbox with approval.
- Environment: Node 22.23.2, Playwright 1.61.1 and the installed Chromium 1228 runtime. Browser cases use the repository's own fixtures, including mocked tiles, survey services and accelerated clocks where configured. This is not a real-service or conference-hardware acceptance run.
- Raw unit TAP logs, unit totals, browser JSON and failure snapshots are in `/tmp/geoglyph-full-battery.WKFMe8/`. Key files are `unit-results.json`, `browser-results.json` and `browser-artifacts/`.

## Failures and assessment

### U01 — Startup test harness lacks an application binding

`tests/unit/conference-startup.test.cjs:157` failed with `ReferenceError: arcgisAdminBusy is not defined`. It extracts `startArcgisPolling` into a VM but does not supply the module variable used by that function. The application declares the variable in `src/scripts/geoglyph-map-engine-inline.js:1147`; its guard is at line 1219. Both the missing fixture binding and the application guard also exist in published commit `eb43f5e`.

**Confirmed fixture defect.** Supply the binding in the VM and cover the busy/idle states; do not remove the application's administration guard to satisfy this test.

### B01 — Queued Begin/camera case cannot complete

`tests/browser/conference-presentation.spec.cjs:261` timed out after 90 seconds in `completeIntroduction` while waiting for a scripted step. Its failure snapshot records **`Response 1: Camera movement did not complete`**. This fixture combines an accelerated clock with a `flyTo` wrapper that forces the requested flight to duration zero. A later, unreached assertion also still hardcodes 13 introduction steps rather than the current 15.

**Requires investigation.** Determine whether the camera completion failure is in the application or the mixed-clock fixture. The passing revised Begin case does not clear this failure. Update the obsolete step-count assertion only as part of preserving this case's real queuing and 30-second-request checks.

### B02 — Native-colour case compares unequal texture heights

`tests/browser/conference-presentation.spec.cjs:303` passed its coloured-pixel and white-pixel checks, then failed at line 358 because the post-flight texture height was **1055**, compared with **1081** before flight. The first post-descent emoji is intentionally immediate, so this fixture must establish that it is comparing the same artwork before asserting identical raster dimensions.

**Not evidence that native colour was disabled.** Investigate the sampled artwork/phase and retain the pixel-colour checks. No resolution or visual-quality reduction is justified by this assertion alone.

### B03 — Paused queue case expects Reset to remain queued

`tests/browser/conference-presentation.spec.cjs:982` failed at line 1001: expected queue `[126]`, received `[]`, after admitting a Reset while paused. The earlier admission/cursor assertions passed.

**Conflicts with the established Reset policy.** Reset is allowed to drain immediately while ordinary work remains paused. The introduction unit tests also cover that policy. Check Reset completion and cursor retention instead of requiring Reset to stay queued; do not change application priority handling to satisfy this assertion.

### B04 — Random-font fixture has no local-descriptor list

`tests/browser/map-mode-fixes.spec.cjs:27` failed at line 38 while reading `localFontDescriptors.length`; the value was `null`. The test installs a `queryLocalFonts` mock and assumes descriptors are already populated before it exercises Random.

**Permission/initialisation assumption needs checking.** Exercise the intended font-access action or supply the appropriate permission fixture, then establish whether Random itself fails. This run did not reach that case's Random/orbit assertions.

### B05 — Manual 3D-to-2D Fit does not satisfy completion checks

`tests/browser/map-mode-fixes.spec.cjs:120` timed out after 30 seconds at line 147. This is the `settled()` wait after toggling to 2D and requesting a deferred Fit. That helper requires no rebuilding, pending build, explicit pending Fit or framing operation.

**Prioritise investigation.** Capture which completion flag remains set and whether the camera/artwork actually fits. Do not merely lengthen the timeout or weaken the completion conditions. This case did not complete its later 2D/3D Fit assertions.

### B06 — Panel controls do not share the expected row alignment

`tests/browser/map-panel-layout.spec.cjs:9` failed at line 17: a same-row coordinate comparison expected **117** and received **145**, a 28-pixel difference.

**Layout contract needs review.** Identify the control group and viewport involved, then distinguish an intentional row change from an unintended wrap. This result alone does not establish which layout should be changed.

### B07/B08 — Outline fixtures do not become visible in 3D

Two cases at `tests/browser/outline-policy.spec.cjs:62` failed:

- The synthetic overlapping font timed out after 30 seconds waiting for its committed render state.
- The installed `SitkaVF.ttf` fixture reached the visibility assertion at line 85, but 3D visibility was false where true was expected.

Both snapshots show **`This content cannot be extruded`**. The Sitka fixture was available and the case ran; this was not a missing-font skip.

**Prioritise investigation.** Trace the outline eligibility/mesh failure and committed-state handling for these exact fixtures. The passing tests for other fonts do not clear these two failures. Do not bypass the rendering policy without verifying valid geometry and preserved counters/crossbars.

### B09 — Unsupported colour-font checkbox request is rejected

`tests/browser/placement-3d.spec.cjs:117` failed at line 119 because Playwright's `.check()` requires the checkbox to stay checked, but the click did not leave it checked. The remainder of the case expects a 2D decal, no visible 3D model and an extrusion explanation.

**Likely interaction/assertion mismatch.** Check that requesting unsupported extrusion correctly falls back to 2D with its explanation. Use an interaction that can assert a rejected request, rather than requiring the incompatible mode to remain selected. Those fallback assertions were not reached in this run.

### B10/B11 — Public-connection cases still expect login controls to be absent

The modular and portable cases at `tests/browser/survey-results.spec.cjs:47` failed at line 53: expected zero login-control DOM elements, received three. The application intentionally reinstates those controls for the requested administration mode.

**Confirmed obsolete DOM-absence expectation.** Check that administration controls have the correct visibility and that a public connection does not require authentication. Both cases stopped before their subsequent empty-table fetch assertions, so those exact scenarios did not finish.

## Sign-off, limits and next checks

The new 15-step Begin transcript, title transitions, native-colour flags, mirroring, final Medium 3D Turn, colour-only update, location-only update and Reset passed in the main end-to-end case during this full run. That success must not be presented as a full-suite pass.

Investigate the unresolved camera/Fit and outline failures first. Repair confirmed fixture conflicts while preserving established behaviour, then rerun the affected cases. The previous release was not executed as a separate browser baseline in this session; do not classify all browser failures as pre-existing or as regressions introduced by this update.

The build, syntax and whitespace checks passed. Both portable releases are byte-identical at **21,483,715 bytes**; SHA-256 is `e130877db978f0a0f1d8ac29057308c5935c183a41456af7d2acfb59cd5c6323`. All **43 embedded script/style assets** match source and the modular entry references them.

No application or test source was changed during this verification run. No fixes, dependency installations, commit or push were performed. Reports are local. No extended browser run, soak, live-service write or 60–120-minute stability certification was performed.
