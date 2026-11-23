# ChatGPT Experiments launcher — Geoglyph v3

Open **[index.html](index.html)** to use the new launcher, including directly from disk:

```text
\\wsl.localhost\Ubuntu\home\n0rt\headroom-projects\Geoglyph-v2.0\Geoglyph-v3.0\index.html
```

This version contains an independent copy of the current Geoglyph application. The existing Geoglyph v2 working files and the Explorer Suite v2 workspace were preserved. The launcher uses the supplied **ChatGPT Experiments** title artwork at the upper left and **Geoglyph** image button at the upper right, preserving their proportions. The globe, background, orbiting craft and SID jukebox remain available. Select the alien in the flying car to open the Geoglyph remote control QR code.

## Open and return

Choose the **Geoglyph image button** to open the copied app in the same tab. Use **Return to launcher** in Geoglyph's header to return. The source, fonts, libraries and built outputs are under `apps/geoglyph/`. Builds and edits belong in this new directory.

The image button's pointer area follows the logo's visible outline; transparent margins pass through to the launcher. Mouse hover adds no visual effects. Keyboard focus outlines the logo, and Enter or Space opens it. Its SVG hit path is generated from the PNG alpha channel by `rtk node scripts/build-launch-hit-area.cjs`; the artwork is not modified.

Use the globe-shaped **Launcher controls** button at the lower right to open the control panel. Its Survey123 section appears first, followed by Globe settings. The panel starts closed and scrolls on small screens. Reset Globe affects the globe settings only.

| Entry | Geoglyph mode | Control panel |
| --- | --- | --- |
| Survey123 `Launch Geoglyph`, including stopped Fetch | Geoglyph | Visible mini-CP |
| Geoglyph image button | Message | Full sidebar; Message section expanded |
| Direct copied-app or standalone opening | Message | Full sidebar; Message section expanded |

The opening layout applies once per page load, overriding an older saved collapsed Message preference. Subsequent user changes remain in place during that visit, including when startup finishes or is retried. A duplicate Launch Geoglyph command inside an already-open app preserves the user's current layout and artwork.

The launcher works through `file://` and HTTP. To serve it locally, run this command from `Geoglyph-v3.0/`:

```sh
rtk npm run dev
```

Then open **http://127.0.0.1:4186/**. Keep the directory structure intact for navigation between the launcher and the app, including the app's standalone HTML outputs.

## Survey123 app launch

Use these stored values in the existing `special_commands` field:

| Command | On the launcher | In the open app |
| --- | --- | --- |
| `Launch Geoglyph` | Opens Geoglyph mode with the mini-CP | Acknowledges without reloading or resetting artwork/layout |
| `Begin Geoglyph` | Opens the map-only presentation and runs the rehearsal once after preparation | Enters the map-only presentation and runs the rehearsal |
| `Reset Geoglyph` | Leaves the launcher open | Interrupts the presentation and restores Geoglyph's opening |
| `Return to Launcher` | Leaves the launcher open | Returns from the open app and resumes polling from this command |
| `Launch Panoptigon` | Opens the Views & Vistas panorama explorer | Switches directly from another imported app to Panoptigon |
| `Launch Umbramatic` | Opens the ShadowPlayer | Switches directly from another imported app to Umbramatic |
| `Launch Transitron` | Opens the Transitron placeholder | Switches directly from another imported app to the Transitron placeholder |

Capitalization and surrounding whitespace are ignored. The former `Begin` value is no longer a conference-start command. This implementation reads the existing public results view; it does not edit or publish the Survey123 form.

- The launcher starts polling automatically on a fresh open and on return from Geoglyph. In the Survey123 section of **Launcher Controls**, **Stop** cancels polling for the current visit, **Start** resumes it and **Fetch** checks once. The interval initially defaults to 1 second and can be adjusted from 1 to 3600 seconds.
- The first check establishes a baseline from the latest result. Historical launch commands do not open an app. Submit a new launch command after connecting.
- A new launch command opens Geoglyph without starting its script. When polling was active, Geoglyph continues from that submission and receives subsequent Begin Geoglyph, Reset and message records, including records submitted during navigation.
- Fetch while stopped can open the app but leaves its polling stopped. A duplicate launch command inside Geoglyph is acknowledged without reloading or changing its artwork.
- **Return to launcher** resumes polling and keeps the incoming interval, selected results layer and processed submission cursor. Opening Geoglyph directly starts with its polling stopped.
- Panoptigon, Umbramatic and the Transitron placeholder continue active Survey123 polling while open. They accept `Begin Geoglyph`, linked launch commands and `Return to Launcher`. Duplicate launches of the current app leave it open. Their **Return to launcher** links use the latest polling checkpoint. `Launch Assassin's Leaves` displays an unlinked-app notice.

Panoptigon imports your photos and models from disk. Its source is pinned to [commit `7dab21d`](https://github.com/FraknToastr/adelaide-views-vistas-panorama-explorer/tree/7dab21dadf56f42c4a1db2e2c90696d4e1c168f3). The sample-export test expects a separately supplied `samples/Park_10.zip`. Umbramatic includes the original `SampleExport` folder. Use **Open export folder** in ShadowPlayer to load it. MapLibre and the online basemaps require network access. The Transitron dashboard and its GTFS data are in `apps/transitron/` for independent server use.

For a local rehearsal, double-click `index.html` and wait for Survey123 to connect. You can check the status in **Launcher Controls**. Submit **Begin Geoglyph** from your phone. The app runs [Locate 2026 opening rehearsal](apps/geoglyph/src/scripts/locate-2026-rehearsal.json), which you can also open in the script editor. Survey playback preserves your saved draft. Fonts and morphs are prepared before the first scripted cue. If preparation fails, correct the reported cue and send a new Begin Geoglyph.

The launcher passes the triggering submission ID in the validated handoff and the app continues from that cursor. An already-started connection continues across Message, ArcGIS administration, Canvas and Font Explorer. Ordinary responses wait outside Geoglyph mode. Duplicate Begin commands during the introduction do not restart it. **Fetch** can execute a new Begin command without starting a poller.

## Build and check

The copied app retains its own package manifest and lockfile. Its dependencies install locally; no dependencies or source files are linked to either original workspace.

```sh
rtk npm run setup
rtk npm run build
rtk npm run verify:preservation
rtk proxy env -u NODE_TEST_CONTEXT npm run test:unit
rtk proxy env -u NODE_TEST_CONTEXT npm run test:app
rtk npm run test:browser
```

The build updates only the copied app's development index and standalone outputs: `apps/geoglyph/GeoGlyph_Locate_2026.html` and `apps/geoglyph/dist/GeoGlyph.html`. `npm run dev` serves existing outputs; rebuild after source changes. Browser test artifacts go to `/tmp/geoglyph-v3-browser-results`.

The preservation check compares both original workspaces against their initial working-file SHA-256 inventories, including uncommitted source changes. See [preservation/README.md](preservation/README.md). Those inventories intentionally exclude installed dependencies, credentials and runtime reports. No Git commit, remote push or publishing is part of this version's setup.

Launcher third-party credits are in [LAUNCHER_NOTICES.md](LAUNCHER_NOTICES.md); Geoglyph's own notices and documentation are retained in its copied project.
