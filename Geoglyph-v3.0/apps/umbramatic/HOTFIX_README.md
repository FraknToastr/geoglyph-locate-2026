# Shadow / Time — MapLibre player v1.0.2 hotfix

## Symptom
The time, capture counter and solar-position metadata advance, but the map continues to display the first shadow image (for both synthetic and real exported sequences).

## Root cause
The player ships MapLibre GL JS 5.13.0. In this specific release, `ImageSource.updateImage()` accepts `{url, coordinates}` and silently does nothing when passed `{image: HTMLImageElement, coordinates}`. The earlier v1.0.1 player incorrectly used the latter form. [MapLibre 5.13.0 source](https://github.com/maplibre/maplibre-gl-js/blob/v5.13.0/src/source/image_source.ts#L163-L174).

## Correction
`ShadowPlayer/app.js` now uses:

```js
source.updateImage({url, coordinates:tile.coordinates});
```

This changes the map's actual image source on every capture. Initial source creation, folder loading, image cache, date filtering, playback controls, GIS world files, and all 3 ArcGIS tools are preserved.

## Installation
Replace the existing `ShadowPlayer/app.js` with the one in this package and hard refresh (Ctrl+F5), OR replace the entire `ShadowPlayer` directory with the fixed one. The HTML version label will show `v1.0.2` after replacing the directory.

Existing real data exports do NOT need to be re-run.

## Validation
The supplied synthetic sample contains six distinct captures per date; six unique SHA-256 hashes for the six time slots. JavaScript syntax validation and a regression test based on the MapLibre 5.13.0 implementation's URL requirement have passed. Live MapLibre WebGL rendering and ArcGIS Pro geoprocessing were not exercised in the test container.

## If images still look unchanged
Compare the corresponding JPEG/WebP tiles across two exported frame folders by file size or SHA-256. If those are identical, investigate batch rasters / the export input. If they are different, test frame stepping in this updated player and check browser console errors.
