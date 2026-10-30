# Bundled libraries

The standalone release embeds these libraries and their licence texts in its About panel. Original licence files are retained in `src/vendor/licenses/`.

| Library | Version | Licence |
| --- | --- | --- |
| OpenType.js | 1.3.4 | MIT |
| QRious | 4.0.2 | GPL-3.0 |
| jsQR | Embedded original version | Apache-2.0 |
| JSZip | 3.10.1 | MIT or GPL-3.0 |
| MapLibre GL JS and CSS | 5.3.0 | BSD-3-Clause |
| polygon-clipping | 0.15.7 | MIT |
| Three.js | 0.186.1 | MIT |
| Lucide (five SVG icons) | 0.475.0 | ISC, with Feather-derived notices |

JSZip includes pako; its bundled header retains the applicable notices. Interface web fonts and map tiles retain their existing external attribution.

Playwright and PostCSS are development tools and are not embedded in the release.

This private conference edition bundles the six approved Windows font files in `src/fonts/` and in the portable HTML: Segoe UI Emoji, Gill Sans Ultra Bold Condensed, Forte, Chiller, Magneto Bold and Showcard Gothic. Their existing proprietary font licences continue to apply; the application and library licences do not grant font redistribution rights. Gill Sans has a cmap-language metadata correction for Chromium, with identical glyph outline bytes; see `scripts/prepare-conference-gill-font.py`. The original project does not receive these font files. Esri fonts are not bundled.
