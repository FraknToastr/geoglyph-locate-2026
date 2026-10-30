# Font outline policy plan: overlapping contours

## Objective

Correct missing internal components such as the crossbar in Sitka Text `A` while preserving OpenType nonzero-winding behaviour, existing fallback policies, performance limits, 2D rendering, GeoJSON export and 3D extrusion.

## Evidence

- Installed fixtures include `/mnt/c/Windows/Fonts/SitkaVF.ttf` and `SitkaVF-Italic.ttf`.
- Parsing Sitka Text `A` through the current `opentype.js` and `ground-geometry.js` produces two positive-area contours: outer area about `108,497` and inner component area about `14,003` in the regular face.
- The current classifier returns one polygon containing only the outer ring. The inner component's vertices are inside the outer ring, but its boundary crosses the open space between the legs. This proves corner containment alone is insufficient.
- A boolean union of the two contours returns two rings and restores the intended filled component/counter structure.
- An in-memory classifier correction that rejects containment when boundaries intersect changed only `A` across printable ASCII for Sitka regular/italic; it produced no new failures in DejaVu Sans, DejaVu Serif or Segoe UI.
- The corrected model produced two rings for Sitka `A` at quality values `4`, `10` and `36`.
- OpenType permits overlapping contours, including in variable fonts; `OVERLAP_SIMPLE` is optional. TrueType uses a nonzero winding rule for interior classification. The existing `polygon-clipping` union normalizes output rings and handles overlap.

## Implementation plan

1. Update `src/scripts/ground-geometry.js` contour-parent detection so a candidate parent requires bounding-box containment, vertex containment and no boundary intersection with the child. Use the existing `boundariesIntersect` function; perform cheap checks first.
2. Leave signed-area winding and nested hole/island handling unchanged. Do not introduce font-name checks, a universal even-odd rule, replacement glyphs or forced raster rendering.
3. Preserve the existing union path for multiple filled polygons, worker execution, geometry vertex limits, cache keys, complex/self-intersection fallbacks and browser-rendered decal fallback.
4. Add unit coverage for an overlapping arch-plus-crossbar contour whose corners are contained but whose edges cross the parent; verify the component remains filled and the counter remains present.
5. Extend regression coverage for reversed contour order/winding, ordinary counters, nested islands, disconnected contours, overlapping text and existing unsafe/self-intersecting fallback errors.
6. Add optional installed-Sitka coverage for regular and italic `A` and `ADELAIDE` across low/default/high quality. Keep a synthetic fixture so the test suite remains portable.
7. Verify the corrected model feeds both vector 2D/GeoJSON and the 3D mesh, including finite coordinates, cap area, counter preservation and outline generation.
8. Run unit and Chromium browser suites, rebuild `dist/GeoGlyph.html` and `GeoGlyph_Studio_MapGeometry_v18.5.html`, and verify the portable copies remain identical.

## Acceptance criteria

- Sitka regular and italic capital `A` display their crossbar and counter in 2D and 3D.
- Existing DejaVu, Segoe UI, emoji styling, overlapping-letter, cache, placement and animation tests remain green.
- No new raster fallback is triggered for valid overlapping contours.
- No font-specific exception or public settings/API change is introduced.
- Geometry remains bounded by current vertex and cache limits.

## Current status

Implemented and verified on 2026-10-20. Contour-parent detection now checks for boundary intersections after bounding-box and vertex containment. All other winding, union, fallback, worker and cache policies remain in place.

## Verification results

- The new regression tests failed before the correction: both the synthetic overlapping component and installed Sitka `A` lost their counter/crossbar structure. They pass with the containment correction.
- Full unit suite: **39 passed**, no failures or skips.
- Full Chromium browser suite: **66 passed**, no failures or skips (3 workers, approximately 1.6 minutes).
- Four new browser cases cover the synthetic font in development and portable HTML, and installed Sitka regular and italic. Each checks vector 2D, GeoJSON and actual 3D cap triangles at qualities 4/10/36, including filled crossbars, empty counters, finite meshes, mesh reuse and stable anchors.
- Synthetic unit coverage also verifies known area/perimeter, contour order and winding reversal, nested/disconnected contours, existing safety fallbacks, repeated letters and cache reuse. Installed-Sitka unit cases include `AAA` and `ADELAIDE` and compare extrusion cap area with the source polygon area.
- Printable ASCII comparison against the previous classifier at quality 10:

| Installed font | Identical successful glyphs | Corrected glyphs | New failures | Existing fallback glyphs |
| --- | ---: | --- | ---: | ---: |
| SitkaVF.ttf | 89 | A | 0 | 4 |
| SitkaVF-Italic.ttf | 81 | A | 0 | 12 |
| DejaVuSans.ttf | 94 | none | 0 | 0 |
| DejaVuSerif.ttf | 94 | none | 0 | 0 |
| segoeui.ttf | 94 | none | 0 | 0 |

- Both portable HTML copies rebuilt and confirmed byte-identical.
- Original baseline SHA256 remains `fa75780c23973e95cffacc8b34cc663241ee5b93d857e5fcbcda7711c20328f0`.

Regression sources: `tests/fixtures/overlapping-outline.cjs`, `tests/unit/outline-policy.test.cjs` and `tests/browser/outline-policy.spec.cjs`. No proprietary fonts are bundled.

Reference rules: [TrueType nonzero winding](https://learn.microsoft.com/en-us/typography/opentype/spec/ttch01), [valid overlapping contours](https://learn.microsoft.com/en-us/typography/opentype/spec/glyf), and [polygon-clipping union behaviour](https://github.com/mfogel/polygon-clipping).
