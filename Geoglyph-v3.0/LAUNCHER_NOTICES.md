# Launcher sources and notices

The globe launcher is a local adaptation of the user's Explorer Suite v2 launcher. Its original source workspace remains untouched. The Explorer branding and application links were replaced by the user's supplied ChatGPT Experiments title and Geoglyph image button. Survey123 controls are inside Launcher Controls above the globe settings.

The copied application code retains the original procedural space background, orbiting craft, formation controls and SID jukebox. The alien-car artwork remains a local asset; the Explorer logo is not included. The SID tunes are embedded in `launcher/sid-tracks.js`, so launcher assets load directly from disk.

- COBE 2.0.1 is bundled in `vendor/cobe-2.0.1.js`; its retained MIT licence is in `vendor/cobe-LICENSE.txt`, with adaptation details in `vendor/cobe-NOTICE.md`.
- Hermit jsSID 0.9.1 credits and licence statement are retained in `vendor/jsSID-README.txt`; the adapted emulator is `vendor/sid-core.js`.
- Combat School and Arkanoid use the bundled libsidplayfp/reSIDfp engine. Source and licence details are in `vendor/libsidplayfp-NOTICE.md`.
- Tune authorship, source and rights details are retained in `assets/sid-credits.txt`. The tune copyrights are distinct from the emulator's licence.

Geoglyph's own dependency notices are retained under `apps/geoglyph/`.
