/* Playback for original RSID programs using the bundled reSIDfp engine. */
(() => {
  'use strict';

  let binary, compiled;
  function bytes() {
    binary ??= Uint8Array.from(atob(window.UOSLibsidplayfpBinary), character => character.charCodeAt(0));
    return binary;
  }
  function compile() {
    compiled ??= WebAssembly.compile(bytes())
      .catch(error => { compiled = null; throw error; });
    return compiled;
  }

  // This function also runs in the audio worklet with a precompiled module.
  async function create(rate, wasm, factory) {
    const library = await factory()({
      instantiateWasm(imports, ready) {
        const instance = new WebAssembly.Instance(wasm, imports);
        ready(instance, wasm);
        return instance.exports;
      }
    });
    let player = null, chunk = null, offset = 0, frames = 0, skip = 0;

    function load(bytes, subtune) {
      const next = new library.SidPlayerContext();
      try {
        if (!next.configure(rate, false) || !next.loadSidBuffer(bytes)) throw Error(next.getLastError());
        const song = subtune + 1;
        if (next.getTuneInfo().currentSong !== song && next.selectSong(song) !== song) throw Error(next.getLastError());
        if (!next.reset()) throw Error(next.getLastError());
      } catch (error) {
        next.delete();
        throw error;
      }
      player?.delete();
      player = next;
      chunk = null;
      offset = frames = skip = 0;
    }

    function readChunk() {
      if (chunk && offset < chunk.length) return true;
      // Consume the view before asking WebAssembly for the next block.
      chunk = player.render(20000);
      offset = 0;
      return Boolean(chunk?.length);
    }

    function render(output) {
      // Restore positions by emulating ahead in bounded batches. This leaves
      // the audio thread available for mute and track changes during a seek.
      for (let blocks = 0; skip > 0 && blocks < 8 && readChunk(); blocks++) {
        const count = Math.min(skip, chunk.length - offset);
        offset += count;
        skip -= count;
      }
      let written = 0;
      while (skip === 0 && written < output.length && readChunk()) {
        const count = Math.min(output.length - written, chunk.length - offset);
        for (let i = 0; i < count; i++) output[written + i] = chunk[offset + i] / 32768;
        offset += count;
        written += count;
      }
      output.fill(0, written);
      frames += written;
    }

    return {
      load,
      render,
      time: () => frames / rate,
      save: () => ({version: 2, rate, frames}),
      restore(checkpoint) { frames = skip = checkpoint.frames; },
      dispose() { player?.delete(); player = chunk = null; }
    };
  }

  window.UOSRSIDPlayback = Object.freeze({bytes, compile, create});
})();
