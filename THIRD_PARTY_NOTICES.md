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
| Noto Color Emoji (flag subset) | 2.047 | SIL Open Font License 1.1 |

JSZip includes pako; its bundled header retains the applicable notices. Interface web fonts and map tiles retain their existing external attribution.

Playwright and PostCSS are development tools and are not embedded in the release.

`src/fonts/geoglyph-emoji-flags.ttf` is a subset of Noto Color Emoji, copyright Google Inc. and Arjen Nienhuis. It provides regional-indicator and subdivision flags missing from the primary emoji face. Its original notices and licence are retained in `src/vendor/licenses/noto-emoji.txt` and embedded in About. The subset retains the original name and copyright metadata. Reproduce it with FontTools 4.46.0:

```sh
/usr/bin/python3 -m fontTools.subset /usr/share/fonts/truetype/noto/NotoColorEmoji.ttf --output-file=src/fonts/geoglyph-emoji-flags.ttf --unicodes=U+1F1E6-1F1FF,U+1F3F4,U+E0020-E007F '--layout-features=*' '--name-IDs=*' --name-legacy '--name-languages=*'
```

This private conference edition bundles the six approved Windows font files in `src/fonts/` and in the portable HTML: Segoe UI Emoji, Gill Sans Ultra Bold Condensed, Forte, Chiller, Magneto Bold and Showcard Gothic. Their existing proprietary font licences continue to apply; the application and library licences do not grant font redistribution rights. Gill Sans has a cmap-language metadata correction for Chromium, with identical glyph outline bytes; see `scripts/prepare-conference-gill-font.py`. The original project does not receive these font files. Esri fonts are not bundled.
