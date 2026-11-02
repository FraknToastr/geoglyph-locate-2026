# Location-only survey updates after Begin

## Confirmed cause and correction

Response 184 supplied a valid WGS84 map point, the carried-over legacy `whats_on_your_mind: "😴"` value, empty newer content fields and no other controls. The earlier Response 169 correction recognised enumerated controls such as colour but omitted location-only updates. The resolver consequently attempted to extrude the sleeping placeholder as new text in Gill Sans.

Point validation now runs once before content selection. A valid, non-default anchor counts as a control for the existing legacy-placeholder rule. It does not replace the current message. Invalid points retain their warning and placement policy; the unanswered `(0,0)` point remains ignored, while either zero ordinate alone is valid. Explicit messages, emoji selections and command precedence are unchanged. Survey cue queries already request WGS84 geometry (`outSR=4326`).

The renderer compares the validated anchor with its previous anchor. An actual change requests the existing post-render, animation-preserving Fit. An unchanged point does not add another Fit. Opening/overview/suppress-Fit policy remains in force. No tile, projection, font-provider or animation-speed changes were made.

## Targeted validation

- Two new resolver cases failed before the source correction, reproducing the incorrect 😴 content selection. Afterward, all **20 cue resolver** and **9 cue ownership/framing** cases passed. Coverage includes Response 184's exact content/control fields and point, source immutability, invalid/default/equator/Greenwich points, colour-only controls, explicit content and Reset, post-frame Fit ordering, unchanged-point suppression and overview behaviour.
- One short Chromium **file://** regression passed in **6.1 seconds** (6.9 seconds runner total), with accelerated script timing and mocked services. Sequence: Begin → Yellow/Response 169 → location-only/Response 184 → repeated point → Reset.
- The relocated block retained “Where are you Josh?”, Gill Sans, Yellow, native colour off, Medium (3,000 m height/300 m depth), 3D and running Turn. The camera targeted its projected centre, all eight projected 3D bounds corners were in front of the camera and retained at least a 9.5% viewport margin. Location triggered one recorded Fit; repeating the same point triggered none.
- The location update added no mesh builds, GPU uploads or disposals. The previous colour-only check and final native-colour 2D sleeping-emoji Reset also passed, with no presentation error or unhandled browser error.

## Release copies and limits

The full build regenerated the modular entry and both portable copies. The portable files are byte-identical at **21,480,531 bytes** each; SHA-256: `8bcf98d8cfd3c0ad04d83aef232c82efebeb0d8a0cde48d7b9d88e7656627f0c`. All 43 embedded script/style assets match their current source and there are no unresolved asset markers. Syntax/whitespace checks passed.

The browser regression did not write to real survey services, exercise real network delays or perform a soak. Hosted/portable runtime checks were not repeated for this follow-up; release parity here is a source/build check. Changes remain local and uncommitted; no push performed. The previously published `e167ab1` release does not yet include this location-only correction.
