# Map controls sidebar

The Map control panel now occupies a separate left sidebar beneath the application header. It reserves 340px on desktop and at most 50vw on narrow windows. The map canvas resizes to the remaining space. Other workspaces retain their existing controls.

The UOS logo is a button that hides or restores Map controls; it is disabled outside Map. The internal − / + button switches between the full sidebar and the existing floating mini panel. The same editor and input nodes move between these presentations, retaining handlers, values and section preferences. Mini dimensions, position, shortcuts and exports remain unchanged.

Visibility and full/mini presentation are independent choices held in memory. They survive Map/Canvas switches and reset to visible/full on reload. Font Explorer temporarily suppresses controls while retaining its 50/50 split. Closing Explorer restores the previous choice. Clicking UOS while Explorer is open closes Explorer and shows the remembered full or mini controls.

## Integration

- `src/scripts/map-sidebar.js` owns presentation, visibility, suppression, accessible button states, focus and editor reparenting. `GeoGlyphMapSidebar` exposes `state`, `setVisible`, `setPresentation` and `sync`.
- `src/styles/map-controls.css` contains the independent sidebar layout, narrow wrapping and theme-aware section headings.
- The engine coalesces viewport updates over two animation frames. Resize observers track the Map container and application header. Sidebar operations resize the existing map without requesting Fit, stopping an animation or rebuilding font geometry.
- Startup no longer forces the mini panel. Conference overview padding measures actual editor overlap relative to the map.
- Very large elevated models on narrow maps retain their camera target and orbit phase. The existing pinned MapLibre adapter relaxes the implicit finite-world constraint for elevated cameras and projection trials, while retaining zoom limits, explicit bounds and normal 2D constraints. World copies remain disabled. At extreme zoom, background may be visible beyond the finite basemap rather than displacing the model.
- Fit requested during a manual 2D/3D switch now waits for the committed model and consumes its pending request. Failed switches fit the retained artwork when requested.

## Verification

Final checks:

- **254/254 unit tests pass.** The startup fixture now supplies the existing `arcgisAdminBusy` closure value; no production polling behavior changed.
- **34/34 final browser checks pass** across sidebar, section controls, panel layout, mini shortcuts, basemap coverage and orbit suites.
- Additional targeted checks passed for smooth orbit resizing, all animation modes at every size in the narrow portrait map, conference overview, HTTP startup, modular file startup and portable startup.
- Earlier integration checks also passed existing font morph UI, Explorer keyboard, font swap, undo, export and workspace workflows.
- Desktop and 390px layouts were visually inspected in both themes. Visible section headings pass 4.5:1 contrast checks. The full sidebar measures 340px / 195px respectively; mini height remains 138px.
- Paused 2D progress and the camera remain unchanged through sidebar transitions. Live 3D morph progress and orbit frames continue through full, mini, hidden and Explorer layouts without additional worker mesh builds or GPU uploads.
- `index.html`, `dist/GeoGlyph.html` and `GeoGlyph_Locate_2026.html` were rebuilt. Both standalone files have identical SHA-256 hashes. `git diff --check` passes.

Reproduce the final unit and browser checks:

```sh
rtk node --test tests/unit/*.test.cjs
rtk node node_modules/@playwright/test/cli.js test \
  tests/browser/map-sidebar.spec.cjs \
  tests/browser/map-section-controls.spec.cjs \
  tests/browser/map-panel-layout.spec.cjs \
  tests/browser/map-mode-fixes.spec.cjs \
  tests/browser/basemap-coverage.spec.cjs \
  tests/browser/orbit-solid.spec.cjs \
  --workers=1 --reporter=list
```

The MapLibre adapter depends on the bundled 5.3 transform. Its unit regression exercises that exact bundled implementation; recheck the adapter when upgrading MapLibre.
