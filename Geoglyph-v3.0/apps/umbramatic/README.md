> **Player update v1.0.2:** Fixed an issue where MapLibre GL JS 5.13.0 ignored new images on frame changes. See `HOTFIX_README.md`. All GIS processing tools remain unchanged.

> Player hotfix v1.0.1: see `HOTFIX_README.md`.

# LiDAR Shadow Tools v3 — Browser Export and Shadow / Time

**Contents:** Updated ArcGIS Pro toolbox (three tools), vanilla HTML/CSS/JavaScript MapLibre player, a synthetic sample export, and this guide. No `.bat` launcher or external Python installation required.

## 1. What has changed?

Existing v2 tools are preserved:

1. **LiDAR Shadow Analyzer (LAS / DSM / DTM)** — original snapshot/duration workflow.
2. **Batch Shadow Capture (LAS / DSM / DTM)** — original temporal batch workflow.
3. **NEW: Export Shadow Images for MapLibre (World Files + Manifest)** — converts each saved binary shadow capture into compressed image tiles with georeferencing, a unified JSON timestamp catalog, and optional spatial-resolution reduction.

The third tool reads an existing batch **run directory** that contains `captures_manifest.csv`, or accepts a single binary shadow raster. The source raster must have **1 = shaded, 0 = illuminated, NoData = no coverage**. Aggregate rasters are *not* suitable for this binary-image exporter.

## 2. Install in ArcGIS Pro

1. Unzip the package to a folder, e.g., `C:\Temp\GIS\LiDARShadow_v3\`.
2. In ArcGIS Pro Catalog, **Add Toolbox** > `LiDARShadow_Batch_v3.pyt`.
3. Open **Export Shadow Images for MapLibre**.
4. In **Shadow Batch run folder**, select the folder containing `captures_manifest.csv`, not the `captures` subfolder or a `.gdb` directly. Alternatively choose **one binary shadow raster**.
5. Set an **existing export parent folder**. The tool creates a named child folder for the export.
6. Set format, quality, image tile dimensions, downsampling, and run it. Open the generated export folder through the player.

### Export parameters

| Parameter | Default / recommendation | Notes |
|---|---|---|
| Batch run folder | A completed v2/v3 `ShadowBatch_...` folder | Reads successful captures, keeps most recent CSV record per timestamp, and skips missing/filter-failed captures. |
| OR single shadow raster | Leave blank in batch mode | For exporting one raster; supply its local timestamp. |
| Existing export parent folder | Fast local SSD | Keeps exports separate from geoprocessing scratch. |
| Export subfolder name | Automatic from batch name | Change to safely compare multiple export settings. |
| Image format | **WebP (transparent, compact)** | PNG and JPEG also supported. |
| WebP/JPEG quality | **83** | 75–85 balances speed, appearance and size. Does not affect PNG. |
| Tile edge (output pixels) | **2048** | 1024 for memory-constrained PCs; 4096 only for capable browsers. |
| Downsample factor | **1** | Use 2 or 4 for citywide overviews; preserve 1 for detailed streets/trees. |
| Export every Nth capture | **1** | Use 2 or 4 for a light preview of a long batch. |
| Shadow colour | **#15263F** | Dark navy shadows; rendered transparent where lit. |
| Shadow alpha | **185 / 255** | Baked into WebP/PNG. Player can further adjust layer opacity. JPEG cannot store transparency. |
| Reuse existing images | **Yes** | Resume interrupted exports with the **same** export settings. |
| Continue after errors | No | Enable to export valid captures despite isolated raster failures. |

**Recommended:** WebP for small, coloured transparent overlays; PNG for pixel-perfect lossless display; JPEG only when an opaque binary image is acceptable. JPEG light areas are near-white rather than transparent, so setting the player opacity to roughly 30–45% helps but still washes out the underlying map. Lossy formats are **display copies**, not inputs for further shade calculations.

`NumPy` and `Pillow` are shipped with the standard `arcgispro-py3` ArcGIS Pro environment. They are imported only when the export tool runs; no admin rights or Python environment cloning is needed. ArcPy is supplied by ArcGIS Pro. If your institution uses a reduced `arcpy-base` environment without Pillow, choose the normal Pro Python environment.

### Format and file layout

```text
ExportParent/
  ShadowBatch_20261221_0800_30m_fixed_web/
    shadow_player_manifest.json   # timestamps, WGS84 corners, relative image paths
    export_settings.json          # prevents mixed/resumed incompatible settings
    source.prj                    # original projected raster CRS
    frames/
      20261221_0800/
        tile_r000_c000.webp
        tile_r000_c000.wld         # affine world file
        tile_r000_c000.prj         # CRS companion
        tile_r000_c001.webp
        ...
      20261221_0830/
        ...
```

For JPEG, files end in `.jpg`, `.jgw`, `.prj`; for PNG, `.png`, `.pgw`, `.prj`; for WebP, `.webp`, `.wld`, `.prj`. The data retain their **original projected raster grid** (e.g., GDA2020 / MGA zone 54), avoiding expensive re-projection of each capture. Each image tile has its own GIS-compatible world file and CRS companion. The JSON manifest additionally contains the corresponding four **WGS84** corners (top-left, top-right, bottom-right, bottom-left), required by MapLibre image overlays.

> **Important:** World files alone do **not** contain a coordinate reference system, and browsers / MapLibre do not automatically parse them. The manifest is necessary for the web animation. For extremely large geographical extents or survey-grade image alignment, consider reprojecting to EPSG:3857 with nearest-neighbour resampling before export; four-corner image georeferencing approximates non-linear projection distortion between corners.

### Performance strategy

- The exporter processes **bounded raster blocks**, not the entire huge raster in memory.
- A tile is at most 2048 × 2048 output pixels by default, staying below common WebGL texture limits.
- All captures in a batch must have identical raster dimensions, pixel size, CRS and extent; the exporter detects incompatible grids.
- Georeferenced corner coordinates are calculated once per tile position and reused for other dates.
- Re-running an export with the same settings can skip image encoding for files already generated. Existing raster changes are *not* automatically detected; use a new export name or delete a stale export to rebuild.
- If exporting thousands of high-resolution tiles, reduce resolution / narrow the study extent / export every Nth timepoint. Large batches can produce many small files and considerable browser GPU memory usage.

## 3. Open Shadow / Time — the MapLibre browser app

### Local, no installation or web server

1. Open `ShadowPlayer/index.html` by double-clicking it in Microsoft Edge/Chrome.
2. Click **Open export folder**.
3. Select the complete export folder created by Tool 3 (the one containing `shadow_player_manifest.json`).
4. The folder picker grants read access to the images, so the player does **not** need to `fetch()` restricted `file://` image paths. This avoids a common browser local-file security restriction.
5. Play, pause, step forward/back, scrub the timeline, filter by a particular date, set speed (0.25×–8×), choose loop / ping-pong / once, change basemap and opacity.

**MapLibre library dependency:** `index.html` loads MapLibre GL JS and CSS from **unpkg.com** (pinned v5.13.0); this requires network access to that CDN. Satellite, street and dark basemaps also need online tiles. The exported shadow images themselves load locally via the folder picker. If the CDN is blocked by corporate firewall, the player cannot display the map until the library is hosted locally or the CDN is whitelisted. The optional `launch_player.py` does not remove that CDN dependency.

**Alternative local launcher without BAT:** Run `python launch_player.py` inside `ShadowPlayer`. It creates a localhost server using Python's standard library and opens the viewer. This can be useful for serving a `data/` subfolder.

### Optional playback previews

From `apps/umbramatic`, run the command with Python 3.8 or later and a Pillow build with WebP support. Pass the folder that contains `shadow_player_manifest.json`.

```sh
python ShadowPlayer/build_previews.py "/path/to/web-export"
```

The command adds `shadow_player_previews/` inside the export and reuses previews for identical source tiles. Run it again after re-exporting or replacing tiles. The previews use half the width and height of each tile, with lossless WebP encoding and the original geographic corners.

Open the export folder as usual. Playback uses previews when it finds a complete set for a snapshot. Pause, seek, and step open the full-resolution snapshot while keeping the current one visible during loading. When preview files are missing or unreadable, the player uses the original tiles.

### Hosted / GitHub Pages

To publish a permitted dataset beside the viewer, copy the export folder's **contents** into `ShadowPlayer/data/` so the expected paths include `ShadowPlayer/data/shadow_player_manifest.json` and `ShadowPlayer/data/frames/...`. Include `shadow_player_previews/` to enable previews for the hosted copy. Git ignores generated preview directories in this workspace. The player automatically attempts to load `data/shadow_player_manifest.json` when served over HTTP(S). No build system is required.

**Check data-sharing/licensing before making municipal LiDAR-derived outputs public.** Publishing a GitHub repository (or Pages branch) may expose the underlying image archive, not just the visual map.

### App controls

| Control | Function |
|---|---|
| Play/pause | Start or stop automatic frame advances. |
| Step back/forward | One capture in either direction. |
| Timeline scrubber | Jump to a particular capture. |
| Speed | 0.25×, 0.5×, 1×, 2×, 4× and 8×; 1× waits about 650 ms between frames **after** each frame loads. |
| Date filter | Choose a day using the date picker or visible date chips. All = full series. |
| Loop / Ping-pong / Once | Repeat sequence, reverse at endpoints, or stop at the end. |
| Dark / Light / Aerial / Blank | Dark uses ArcGIS Nova. Light uses Esri Light Gray Canvas with place labels. Blank displays the shadows on a plain background. |
| Opacity | Adjust the entire georeferenced shadow overlay. |
| Fit map | Zoom to the dataset's overall bounds. |
| Keyboard | Space = play/pause, Left/Right = step, F = fit. |

`SampleExport/` in the ZIP is an additional 12-frame, two-date synthetic export with world files and a JSON manifest. It can be selected with **Open export folder** to test folder loading and date filtering before exporting real captures.

## 4. ArcGIS Pro environment recommendations

| Environment | Recommendation |
|---|---|
| Output Coordinate System | **Same as source shadows**; for Adelaide commonly GDA2020 / MGA Zone 54 (EPSG:7854). Exporter preserves native coordinates. |
| Cell Size / Snap Raster | **Same as source DSM/shadow grid** for shadow production; the export tool reads existing raster pixels, so overrides are unnecessary. |
| Processing Extent | Full shadow capture extent; avoid clipping shadow-generating buildings/trees in the upstream analysis. |
| Mask | None during shadow calculation; exported NoData is transparent in WebP/PNG. |
| Parallel Processing Factor | Leave default/blank for export (image writing is handled serially in bounded blocks). |
| Scratch Workspace | Local SSD for shadow analysis. Export tool does not require a scratch GDB. |
| Output directory | Local SSD first, move/export finished package later. |
| Pyramids/statistics | Not necessary for the image export itself. |
| Overwrite outputs | Use the export tool's **Reuse existing images** setting, rather than depending on global overwrite. |

## 5. Validation and known limits

- **Passed:** Python syntax checks; mocked ArcPy parameter registration for all 3 tools; exporter using *actual NumPy + Pillow* on multi-tile rasters; georeferenced world-file pixel-origin checks; WebP transparency; JPEG `.jgw`; PNG `.pgw`; downsampling; output JSON; resuming files; JavaScript syntax and referenced HTML element checks.
- **Not verified here:** Live ArcGIS Pro execution with a real geodatabase/Spatial Analyst licence; live MapLibre browser rendering. The test environment restricts headless-browser navigation, so MapLibre live interactions remain to be checked in Edge or Chrome after extraction.
- **Geographic accuracy:** Tile boundaries have geographic positions based on projected corner coordinates. Curvature/distortion *inside* each tile is approximated by MapLibre's image-corner mapping. A smaller tile size reduces any local affine approximation error. For engineering-grade precision, use proper reprojection/tiling validation.
- **No numeric analysis from images:** Image outputs are display-only; retain original `0/1` rasters for shadow-duration calculations, zonal statistics and analysis.
- **Sources:** The shadow workflow uses approximate solar positions and Esri Hillshade rather than physically based solar ray tracing; the viewer does not increase analytical accuracy.

### Reference documentation

- [ArcGIS Pro — RasterToNumPyArray](https://doc.esri.com/en/arcgis-pro/latest/arcpy/functions/rastertonumpyarray-function.html)
- [ArcGIS Pro — World files](https://doc.esri.com/en/arcgis-pro/latest/help/data/imagery/world-files-for-raster-datasets.html)
- [MapLibre GL JS — ImageSource, updateImage and corner coordinates](https://maplibre.org/maplibre-gl-js/docs/API/classes/ImageSource/)
