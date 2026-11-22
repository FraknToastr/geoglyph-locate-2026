# libsidplayfp for the SID jukebox

The reSIDfp build shipped in libsidplayfp-wasm 1.1.1 uses libsidplayfp 3.1.1
and libresidfp 1.2.3. Both projects and the wrapper use GPL-2.0-or-later.
See the accompanying licence and third-party notices.

The browser copy wraps the published Emscripten module factory for classic
scripts and embeds the original WebAssembly bytes. Geoglyph passes those
bytes to the audio worklet and compiles them locally in either audio backend.

The [pinned npm distribution](https://registry.npmjs.org/libsidplayfp-wasm/-/libsidplayfp-wasm-1.1.1.tgz)
contains the complete corresponding source in `dist/complete-source.tar.gz`
alongside the original browser build. The upstream repositories are
[libsidplayfp-wasm](https://github.com/chrisgleissner/libsidplayfp-wasm),
[libsidplayfp](https://github.com/libsidplayfp/libsidplayfp/tree/732fa8ec8131fc75aafc2eaea583ddcdeea2a3cc)
and [libresidfp](https://github.com/libsidplayfp/libresidfp/tree/32c8525418a643eaed8dfafa3d7039e250050cfa).
