# Adelaide Metro Dashboard

A responsive, multi-file HTML / CSS / JavaScript dashboard. This is a local derivative of the previously supplied Adelaide Metro GTFS application; nothing has been pushed to GitHub.

## How to open

For local live-feed testing, launch the Python server from the workspace root:

```sh
./start_server.sh
```

Open `http://127.0.0.1:8090` and select **Refresh latest feeds** in the map controls. The Python server relays all three Adelaide Metro realtime feeds to the page on the same origin, so live refresh and browser recording work even when the upstream does not permit direct browser requests. No Python packages are required. Use `./start_server.sh --port 8091` to choose another port.

The Geoglyph launcher opens Transitron on `127.0.0.1:8090`. Keep that port for the launcher logo and Survey123 command. **Return to Launcher** opens the same server's `/suite/` copy of the launcher.

Run `rtk npm run save:snapshot` to replace the startup snapshot with current feeds. This uses Node and curl and saves the three decoded feeds in `GTFS data/startup-snapshot.json`. The dashboard shows the capture time when it loads the file and falls back to the bundled sample when the file is absent.

### Background recording

Use the Node server with built-in SQLite enabled for background recording. Run from this workspace with a current Node.js 22 LTS release or newer:

```sh
rtk npm run build:routes
rtk npm start
```

Open `http://127.0.0.1:8080`. The route-index build uses `trips.txt` and `shapes.txt` in `GTFS data/`. Copy the supplied routes and stops GeoJSON files into that folder to use the map overlays. The folder and the generated index are local Git exclusions. Run `rtk npm test` for the fixture tests.

To use the background-recording server with the Geoglyph launcher, start it with `METRO_PORT=8090 rtk npm start` in place of the Python server.

The local host is required for background capture. Browser capture works on an HTTP-hosted copy if its browser can retrieve the feeds and access IndexedDB.

The background recorder saves each completed frame in `.metro-recordings/recordings.sqlite` and seals compressed segments every 30 minutes. All segments share one library entry. Stop seals the final partial segment. Restarting the server resumes an unfinished background capture and leaves the downtime visible on the timeline. Keep the SQLite database and its segment folders together when moving saved recordings. The recorder reads existing background files from the same directory.

## Map and recordings

In **Network layers**, toggle **Bus routes**, **O-Bahn bus routes**, **Tram routes**, and **Train routes** independently. The O-Bahn layer shows the full routes whose local GTFS descriptions name the O-Bahn. The supplied unfiltered network is available under **All routes (GeoJSON)**.

Open **Bus route colours** in **Network layers** for the area colour key. Bus and O-Bahn routes, report badges and map route labels use the colours published in the GTFS feed. Run `rtk npm run build:routes` after updating that feed to refresh the route colours and index.

- Use **Routes** and **Stops** to show the supplied network overlays, and **Snap vehicles to routes** to align displays to nearby matching route geometry. **Route heat** offers **Current frame** and **Last 5 minutes**, two palettes, and a dark basemap. The Overview shows early, on-time, late, and unknown counts.
- The dashboard opens on **Recorder**. Set the source with the Browser / Background rocker, adjust the interval with the stepper, and press **Record**. Browser recordings stay in IndexedDB and need an open tab. Background recordings are saved in `.metro-recordings/` and continue while the Node server runs.
- Click a recording or use the library joystick to move the highlight. Press its centre, **Play**, or Enter to play the selection. The playback dial goes from 1× to 120×. Tap **Rewind** or **Fast-forward** to step one frame. Hold either to scan at 4×. **Stop** returns to live view during playback or stops capture on the selected source. **Power** puts the deck in standby and leaves active captures running.
- **Delete** removes the selected browser recording or imported copy after confirmation. Background recordings remain available for playback and saving.
- **Save** downloads a compressed `.ndjson.gz` file. **Load** accepts compressed exports and older `.json` recordings. Compressed imports are saved in this browser. JSON imports stay in the library for the current page session.
- New captures save decoded rows, timestamps, and feed errors. Select **Keep original feed packets** before recording to include the raw protobuf as well. **Skip Gaps** lights green when the playhead enters a capture gap. Press it to jump to the next recorded frame.

Unzip the archive, then double-click `index.html`. You can also host the unzipped folder on a normal web server or GitHub Pages. MapLibre raster tiles and live feed requests require internet access and, depending on the environment, CORS-permitted services. When MapLibre is unavailable, the map panel uses a schematic offline fallback. The initial vehicle records are **historical sample data** until a live refresh succeeds.

## Features implemented

### Header / vehicle art

- Removed the old icon fence entirely, including its routes, routine switches, animations and controls.
- The bus, train and tram artwork is centred on the green, blue and red bands of the header, respectively. Hover reveals a white glow. An active vehicle filter glows yellow.
- Bus, train and tram each have a separate, extremely close-fitting hit area based on the **actual visible alpha pixels** of that vehicle.
- Click a vehicle to show only its type on the map; click the same vehicle again to restore all types. Vehicle-layer checkboxes still work.
- Pixel-accurate hit masks are precomputed in `js/vehicle-hit-masks.js`; they do not depend on canvas CORS or access to a web server.
- The original image is retained in `assets/adelaide-metro-pixel-trio-original.png`.

### Welcome screen

- Whole icons fill the wall around the Adelaide Metro logo and Dashboard lettering. The icons make overlapping half-turns from right to left, top to bottom, top left to bottom right, left to right, bottom to top, then bottom right to top left.
- Select **Enter dashboard** to open the app. Click the Adelaide Metro logo in the header to return to the welcome screen.
- The icons stay in full colour throughout the waves. Reduced motion shows a stationary full-colour wall.

### Basemaps

- Default: **Esri Nova**, using ArcGIS' Nova vector basemap style. Vehicle route labels start hidden and can be enabled with the tag button.
- `Theme` is replaced with a `Basemap` dropdown.
- **Basemap** also offers **Esri Dark Gray Canvas**, **Esri Nova** from the supplied ArcGIS web map, and **MetroMap aerial imagery**.
- The tag button toggles vehicle route numbers. **Aa** in the Basemap menu toggles annotations on Nova and Dark Gray Canvas, where they start hidden. Esri World Topography includes its place names in the raster tiles.
- The map controls sit below the canvas. The information icon in the upper left opens the map credits.
- **Fit map** frames the selected vehicle, stop or route. With no selection, it frames the enabled vehicles and network geometry. **3D** tilts the view and **2D** returns it overhead.
- MetroMap uses its WMTS tile endpoint and requires **your own API key** with an appropriate subscription and permitted usage.
- `Remember key` saves the entered MetroMap key to browser `localStorage` only when explicitly clicked. Merely entering or using a key does not save it.
- `Forget key` clears the stored and currently entered key, and reverts to Esri Topography if MetroMap was active.
- Browser local storage is not encrypted or a secret vault; use a provider-restricted key where possible. Any API key sent in raster tile URLs can be visible in browser network tools.

### Removed controls

The following controls have been removed from the header: `HISTORICAL SAMPLE`, `Pause icons`, `Auto live: OFF`. The archived/live status remains visible in the Overview report.

### Retained

- Responsive split map and report layout, plus mobile stacked layout.
- MapLibre vehicle markers, filtering and vehicle selection.
- Overview, Vehicles, Trip Updates, Service Alerts and Recorder share one row that scrolls horizontally on narrow viewports. Debug logging remains available internally.
- A selected vehicle has a yellow ring and a bearing arrow when heading data is available. Its message starts in the centre of the LCD ticker, which you can drag to rewind.
- Initial historical data sample and live feed refresh UI.

## Changes relative to the old to-do list

- Basemap selector and MetroMap API-key controls: **implemented**.
- Existing icon-fence pattern proposals: **superseded** as requested.
- Three unwanted header controls: **removed**.
- Vehicle-icon introduction and close-fitting header filters: **implemented**.

## Map tile references

- Esri: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`
- MetroMap: `https://api.metromap.com.au/ogc/key/{YOUR_API_KEY}/wmts/Australia_latest/webmercator/{z}/{x}/{y}.png`
- MetroMap documentation: https://docs.metromap.com.au/docs/ogc-wmts/

## Browser checks

Tested desktop 1920×1080, 1366×768, laptop 1024×768 and mobile 420×900 in headless Chromium with an offline map fallback. Checked opacity-aware vehicle hit areas, individual vehicle type filters and toggle-off, dropdown selection, temporary MetroMap key flow, Forget Key, animated intro and automatic dismissal. No page JavaScript errors occurred during the tests. Live feeds and provider-hosted tiles require a connected browser and valid credentials and were not tested against live endpoints.
