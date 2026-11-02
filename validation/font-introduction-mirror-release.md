# Local implementation: font access, introduction, Mirror and mode Fit

Baseline commit: `14dd480`. All changes and generated artifacts remain local and uncommitted. Do not stage, commit, push or publish until the user explicitly requests **“track, push, and commit.”** Existing Tier 1–3 improvements remain in the application.

## Delivered behaviour

### Font access

Font Explorer and Map share the font service's explicit local-font request and descriptor cache. The existing controls are labelled **Allow local fonts**. The browser request is invoked before awaiting other work so it retains the user's activation. Font bytes are read lazily from the selected descriptor's `blob()`; scanning does not parse every installed font.

Preset records can bind to newly permitted faces and recover from a previous unavailable-byte result. Matching uses exact PostScript/full name/family/style; ambiguous candidates are not silently substituted. Metadata-only aliases cannot replace a usable byte provider, and older reads/face loads/parser responses cannot poison a replacement provider. Background selection synchronisation and style loading use already acquired descriptors without prompting.

Bundled conference fonts and uploaded font files retain their established paths. Browser denial/unsupported APIs retain the file-upload fallback. Reload requires reacquiring browser descriptors; it does not serialize FontData or permission objects. Local Font Access capability is browser dependent. Colour fonts and unsupported outlines retain the established 2D/3D validation policy; this change does not promise every installed font can be extruded.

### Begin introduction

The Survey123 Begin command draws the sleeping emoji and requests the existing 30-second descent. 🥱 appears immediately after arrival. Subsequent pauses start after the committed artwork and automatic Fit complete:

1. 😴 during descent
2. 🥱 immediately after descent
3. 😶 after five seconds
4. 🫣 (U+1FAE3) after five seconds
5. 😏 after three seconds
6. Horizontally mirrored 😏 after three seconds
7. 🤗 (U+1F917, mirror off) after three seconds
8. Hello after five seconds
9. I'm Geoglyph after five seconds
10. Call me Geo after five seconds
11. I was made by ChatGPT after five seconds
12. Today I will be presenting after five seconds
13. with my best friend after five seconds
14. Josh Roberts after five seconds
15. Where are you Josh? after five seconds

Timing follow-up: 11 focused introduction unit cases passed with exact transition-time assertions, pause/visibility handling and interruption checks. One accelerated browser regression passed (3.7 seconds), verifying all 14 post-descent cues, native emoji colour, mirroring and the final Medium 3D/Turn state. Both added emoji code points were verified in the bundled font. Only the local modular entry point was rebuilt; no publication or soak performed.

Emoji use native-colour 2D. Text uses bundled Gill Sans Ultra Bold Condensed at opening size in 2D until the final message. The final message now commits Medium (height 3,000 metres, depth 300 metres, relative size 100%), 3D, completes Fit, then starts Turn. It remains turning until subsequent input changes it.

Follow-up: the Medium size change passed 18 focused unit cases, including an explicit Reset opening check for the emoji font, native colour and 2D. Generated releases were rebuilt. At that stage the intermittent U+1F634 report remained unconfirmed; those checks did not reproduce the user's browser state, and no browser run was performed for that size follow-up. A later confirmed instance (Response 169) was traced to a carried-over legacy survey placeholder and fixed; see [survey-placeholder-colour-fix.md](survey-placeholder-colour-fix.md).

The runner is sequential and cancellable. Ordinary survey submissions remain FIFO behind it; duplicate Begin is ignored while running. Reset interrupts and restores the existing overview, including mirror off. Stop pauses the remaining hold and prevents another step; a render/camera movement already started may finish. Resume continues the remaining hold. Hidden time does not consume a hold. Manual artwork changes cancel the introduction before applying the edit; queued responses resume normal processing after the synchronous edit handler. Leaving Map cancels pending work. A failed step retains the last valid display and releases busy state. Internal script steps do not create survey submissions or alter the survey cursor.

### Mirror and manual 2D/3D

Map has a **Mirror horizontally** checkbox. It reflects the complete artwork around its local centre in vector 2D, native-colour raster 2D and 3D, preserving placement/bearing and geometry cache keys. Reflected vector rings keep valid winding; raster reflection occurs when copying to the existing decal source canvas; 3D faces and outlines share the same local reflection. The `mirrorX` boolean participates in settings, undo and cue rollback. Old settings default false. New survey content resets Mirror; controls-only responses retain it.

Both manual 2D/3D controls prepare and commit the requested representation, wait for its own frame, then Fit once. Superseded switches cannot Fit stale content. Failed extrusion restores the preceding valid representation. Internal animation enablement retains its own path. Manual interruption during preparation restores uncommitted cue fields before applying the edit; a step already committed remains visible.

## Verification

Focused named Node cases passed (no full-suite run): local-font access 9; worker recovery 11; worker model reuse 6; fonts rendering 10; render pose 5; manual model control 3; orbit lifecycle 11; material batching 3; introduction 11; startup 14; cue backpressure 7; manual mode transitions 3; mirrored projection 1; conference ownership 6. **100 unique cases.**

Seven unique short Chromium checks passed:

- Permission-grant recovery after a failed preset, followed by actual worker-backed 3D rendering: local HTTP (2.2 s), modular disk (2.0 s), portable disk (2.1 s).
- Manual mode Fit, stable mesh-build count under Mirror, and exact horizontal pixel reversal of native-colour 😏 (3.7 s).
- All 13 introduction steps rendered in order under accelerated time, with the final Large/Gill Sans/3D/Turn state (3.3 s; final ownership-guard rerun 3.0 s).
- Requested 30-second descent, full introduction and queued survey ordering (3.5 s with immediate test flight and accelerated holds).
- Reset without waiting for superseded font preparation (2.4 s).

The first Mirror/Fit fixture incorrectly counted only MapLibre ease/fly calls; the application uses a custom 3D camera. The corrected fixture counts the actual 3D Fit entry point. The first accelerated legacy flight fixture stalled and reached its 30/60-second runner caps; it was corrected to inspect the requested production duration while executing an immediate test flight. Final focused checks pass. These fixture corrections do not shorten production animation or holds.

Font permission checks inject FontData-like descriptors containing a real installed DejaVu fixture under the preset name. They prove permission-to-provider recovery and real parsing/rendering across the three entry points; **they do not prove the native Windows browser prompt, installed Arial file or enterprise permission policy**. Those require the user's short acceptance check on the presentation computer. No actual hosted publication was made. Physical GPU/projector behaviour and extended operation remain unverified. No soak or full test battery ran.

## Acceptance and publication

Open the local `index.html` or `GeoGlyph_Locate_2026.html` in the intended conference browser, click Allow local fonts, grant access and select the exact installed font. Verify its 2D/3D switch and automatic Fit; verify 😏 Mirror, the Begin transcript and final Turn. Map tiles and Survey123 still require connectivity even when the HTML/fonts are local.

Review these local builds before authorizing publication. Only after **“track, push, and commit”**, commit/synchronize and smoke-check the hosted assets and native local-font permission workflow. Preserve existing permission, outline-validation and resource-budget safeguards. Roll back each isolated feature through its source diff and rebuild artifacts if there is changed appearance, stale commits, lost/reordered cues, stuck state or unrecoverable font access; no persisted-data migration or new dependency is required.
