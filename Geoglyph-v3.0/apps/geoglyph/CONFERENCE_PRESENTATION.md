# Locate 2026 presentation

Open `GeoGlyph_Locate_2026.html` or run `rtk npm run dev` and visit
`http://localhost:4174`. Ordinary entry opens Message mode with the full controls
sidebar and Message section expanded; the launcher's `Launch Geoglyph` command
opens Geoglyph mode with the mini-CP. Segoe UI Emoji is selected, Fix Font Colours checked, 2D enabled,
Small size, with polling stopped. Choose **Start** for one-second anonymous polling,
or **Fetch** for a single request. The camera initially shows all of
Australia, north-up and untilted. Sleeping Geo (😴) is prepared beside the
Melbourne Convention and Exhibition Centre in South Wharf. Map tiles and survey
polling require an internet connection.

The modular `index.html` also opens directly from disk when its `src/` folder is
kept alongside it. Browsers prohibit fetching local font files, so the build
provides `src/fonts/conference-font-data.js`, loaded as a classic script only
for this case. HTTP development still loads the individual font files; the
portable HTML remains self-contained. Rebuild after changing bundled fonts.

Double-click the [launcher](../../index.html). Survey123 starts polling
automatically. Check its connection status under **Launcher Controls** and send
**special_commands = Begin Geoglyph**. The map fills the viewport and runs the
[Locate 2026 rehearsal](src/scripts/locate-2026-rehearsal.json). The main header
and map controls are hidden for presentation.
**Launch Geoglyph** opens the app without running the script. The former
`Begin` value is no longer recognised.

Geoglyph enters browser fullscreen when permitted. If the browser requires
a gesture, click the map or use F11. Exiting fullscreen restores the main
header. Press Escape to restore it from the windowed map-only view.

Begin Geoglyph selects Geoglyph mode from Message, ArcGIS administration,
Canvas or Font Explorer. After exiting fullscreen, use the UOS logo to reopen
the control panel in its current full or mini layout. Active polling continues
across these workspaces.

The rehearsal restores sleeping Geo at the venue in Segoe UI Emoji, with native
colours, 2D and Small size. The **20-second** flight to Geo begins as
**Conference Day.** appears over the map. The title gains one dot every
**2 seconds** and clears two seconds after the fifth dot appears. The yawn cue
starts once the camera arrives. Reduced-motion preferences use immediate camera
positioning.

The opening emoji is prepared at close-up texture quality before the flight.
Its native colours and outline remain visible during the approach, without a
texture-size change at arrival. The speech uses a new face on each cue after
**Hello!**, then demonstrates four faces on **The amazing** above **Geoglyph**.
The 2D showcase takes place at Federation Square. Geo displays **こんにちは**
at 3,000 metres in the Mount Fuji foothills, switches to 3D for **Bonjour** in
Paris, and displays **Ciao** in Marcellus in Rome. Each greeting has a white
language caption at the top of the map. Rome jumps directly to the Colosseum
view and holds it for eight seconds. Geo returns to
normal size at the Royal Exhibition Building for the 3D morphs, then returns to the
Convention Centre Place forecourt for the finale. The first three 3D morph
targets each hold for five seconds. **I become them** then cycles through the
bundled English outline fonts in 3D. Each morph takes two seconds, followed by
a two-second hold while the orbit continues. A new survey message, Reset or
Script Stop ends the font cycle. Set the finale timing in the script's
`fontCycle` settings.

The rehearsal's scripted rows are checked before the first cue. A failure
identifies the affected row so you can correct it and submit a fresh Begin Geoglyph.

**special_commands = Reset** interrupts the flight, font preparation or active
animation, discards preceding queued cues, restores the opening emoji/defaults
and South Wharf anchor, and returns immediately to Australia. Polling stays active.
Begin Geoglyph and Reset take precedence over every other field in the same response.
Values are case-insensitive and surrounding spaces are ignored.

On the first manual poll, the newest stored response establishes the cursor without
replaying its content or command. Reload always returns to Australia. New cues
are processed in Object ID order. In the overview, automatic Fit and survey
animations are suppressed. After Begin, every new submission containing Emoji,
Geoglyph speaks or What's on your mind fits after its final model is drawn,
even if the message text is unchanged.
Edit an existing response only to correct the data; submit a **new response** to
send another presentation cue. There is no extra hold/dwell time between cues.

## Survey fields and precedence

The **Script** section below Font Morph replaces the hard-coded introduction.
Each row has up to four actions, multiline text, and a hold duration. Use its plus
buttons and modal pickers to edit it, and Save JSON/Load JSON to exchange scripts.
The **Location** action uses latitude and longitude to place and frame Geo at a
new anchor. **Fit** on a morph cue frames both shapes before the transition.
The last local draft survives reload; **Introduction** restores the bundled
`src/scripts/introduction.json`. Begin Geoglyph plays the saved rehearsal JSON
independently of the editor draft. You can load the rehearsal JSON in the editor
for manual playback. Rebuild the copied app to use edits to the rehearsal JSON
for Survey123 playback. Manual script playback stops polling. Start stops script
playback and begins polling.

| Survey field | Effect |
| --- | --- |
| `special_commands` | Launch Geoglyph opens the app from the launcher; Begin Geoglyph starts the editable conference script; Reset restores the Australia opening. Commands override other fields in the response. |
| `emojis` | Highest-priority content; forces Segoe UI Emoji, native colours, 2D and stopped animation before drawing. |
| `geoglyph_speaks` | Text content when Emoji is blank. |
| `whats_on_your_mind` | Text content when Emoji and Geoglyph speaks are blank. |
| `random_font` | Yes chooses an eligible survey text font, excluding Emoji and the current font when alternatives exist. Wins over the explicit Font choice. Fits the finished artwork even when no new text is supplied. |
| `choose_a_font_font` | Gill Sans, Forte, Chiller, Magneto or Showcard Gothic. Gill Sans maps to the approved Gill Sans Ultra Bold Condensed face. |
| `choose_a_colour_colour` | Bright Green, Orange, Blue, Purple, Yellow or Pink fill for text; outline stays unchanged. |
| `_2d_or_3d` | Sets text to 2D or 3D. |
| `animation` | Orbit, Turn or Face ensures that animation is running and implies 3D. Repeating the selection does not stop it. |
| `fit` | Explicitly fits even a controls-only cue, after its 2D/3D transition and final drawing reach a map frame. Combines with automatic message/Random Fit into one flight. |
| `_size_size` | Uses the sizes below and remembers depth even in 2D. |
| Point geometry | Sets the anchor once for that response, requested in WGS84. Missing/invalid geometry and Survey123's unanswered-location default `(0,0)` preserve the current anchor. |

| Size | Base height (m) | 3D depth (m) |
| --- | ---: | ---: |
| Small | 300 | 30 |
| Medium | 3,000 | 300 |
| Large | 30,000 | 3,000 |
| Huge | 300,000 | 6,000 |

Emoji responses still apply Size, point and Fit, while ignoring text font,
colour, 3D and animation requests. A response containing only controls retains
the displayed content; an existing emoji retains its rendering restrictions.
Text after emoji restores the last text font unless a new font is requested;
the initial text font is Gill Sans Ultra Bold Condensed. Text always disables
native font colours before drawing.

Animation wins over a simultaneous 2D choice. Automatic message/Random Fit smoothly
reframes a running animation without stopping it. Blank animation leaves it
running, unless 2D or an explicit Fit stops it. Explicit Fit plus a selected animation uses
one framing flight, then starts orbiting. Manual clicks still place the glyph;
repeat polls preserve that location until a new response supplies another point.
For this conference feed, exact `(0,0)` is treated as an unanswered location,
including on startup (which retains the South Wharf anchor). Points elsewhere on the equator
or Greenwich meridian remain valid. The feed cannot distinguish an intentional
`(0,0)` choice from Survey123's default. See [Esri's location behavior](https://doc.arcgis.com/en/survey123/analyze/trackingsurveys.htm).

Expand the Map panel and use **Stop** to pause polling and queued cues. A cue
already accepted finishes its draw/Fit safely. **Start** resumes queued cues and
polling. Fetch alone can fill the queue while paused; Start resumes playback.
A new Begin Geoglyph received by Fetch also starts the conference script without
starting a polling timer.
Leaving Map or ArcGIS pauses the connection. A failed cue reports its error,
retains the previous display and allows later submissions to continue.

## Camera framing

The Map **Random** button waits for the selected font to draw and reach a map
frame, then applies Fit and waits for camera framing to finish. It preserves the
message, anchor and running animation. A cancelled or failed font change does
not automatically fit the previous artwork. Rapid font selections supersede
older requests. Survey Random uses the same post-draw framing rule, with one
flight when Random, new content and an explicit Fit occur in the same response.

Automatic and manual Fit target roughly 80% of the Map canvas, with 10% margins
on each side. The limiting message dimension determines zoom, within the existing
zoom limits. 2D no longer adds an extra zoom-out level. Static 3D includes the
complete projected model, extrusion depth and tilt.

Orbit, Turn and Face use projected model bounds across a full rotation rather
than an enclosing sphere. Heading samples every 5 degrees have a 2% distance
clearance allowance. The distance stays stable through each orbit, and updates
smoothly when the model or viewport changes. A fixed oblique model can occupy
less than 80% of the screen because perspective makes its projected bounds
asymmetric; it still approaches the padded edge at the limiting heading while
the camera remains pointed at the model centre.

Framing is cached until dimensions, depth, tilt, orientation, anchor or viewport
change. A Fit changes the camera without changing the geographic anchor or size.

## Fonts and rendering policy

All six approved font faces are bundled in both editions, so startup needs no
system-font scan or Local Font Access permission. The portable HTML contains
their bytes; the modular edition loads `src/fonts/`. Keep this private conference
copy within the font licences that apply to those files. Additional manually
loaded fonts are not added to portable builds automatically.

Chromium rejects the Windows Gill Sans file's nonzero Unicode cmap language ID.
The conference copy normalizes that metadata with FontTools and recalculates
checksums; the glyph outline bytes remain identical. The reproducible preparation
script is `scripts/prepare-conference-gill-font.py`. This is a font-file metadata
correction; the shared outline, contour, fallback and mesh policies are unchanged.

Random 3D choices are checked against those policies and skip incompatible
outlines. An explicit font/text combination with unsafe outlines retains the
previous model and reports the failure; 2D can use the existing exact-face styled
raster fallback. Rehearse your intended words/fonts before the conference.

## Authoring and diagnostics

Add `?studio=1` to the URL to open the usual authoring workflow without conference
auto-start, including when opening the portable HTML. The original project is
unchanged. Conference settings use their own storage prefix and development port.

`GeoGlyphConference.state` exposes readiness, the `overview`/`beginning`/`live`
phase, queue cursors and a bounded history of cue IDs/phases (`started`, `drawn`,
`flight`, `fit`, `animation`, `applied`, `ignored`, `failed`).
History does not copy survey message text. The transport requests only approved
cue fields, IDs/date and point geometry, without cookies, tokens or sign-in.
Queries remain read-only POST requests to avoid stale public GET query caches.
