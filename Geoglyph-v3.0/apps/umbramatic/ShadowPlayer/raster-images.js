/* Prepare image-source URLs without retaining decoded rasters in the player. */
(() => {
  'use strict';

  function paintTint(canvas, image, colour, jpegMask) {
    const context = canvas.getContext('2d', { willReadFrequently: jpegMask });
    context.drawImage(image, 0, 0);
    if (jpegMask) {
      // ArcGIS JPEG masks use gray 25 for shadows and 246 for sunlit/NoData pixels.
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 3] = pixels.data[i] < 136 ? 255 : 0;
      }
      context.putImageData(pixels, 0, 0);
    }
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = colour;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function runTintWorker() {
    if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas !== 'function' ||
        typeof OffscreenCanvas.prototype.convertToBlob !== 'function' ||
        !new OffscreenCanvas(1, 1).getContext('2d')) {
      self.postMessage({ unavailable: true });
      return;
    }

    self.onmessage = async ({ data: { id, image, finish } }) => {
      let bitmap;
      try {
        if (typeof image === 'string') {
          const response = await fetch(image);
          if (!response.ok) throw new Error(`Image request returned HTTP ${response.status}`);
          image = await response.blob();
        }
        bitmap = await createImageBitmap(image);
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        paintTint(canvas, bitmap, finish.colour, finish.jpegMask);
        bitmap.close();
        bitmap = null;
        const blob = await canvas.convertToBlob({ type: 'image/png' });
        self.postMessage({ id, blob });
      } catch (error) {
        self.postMessage({ id, error: error.message });
      } finally {
        bitmap?.close();
      }
    };
  }

  async function withImage(image, signal, useImage) {
    signal.throwIfAborted();
    const img = new Image();
    const url = typeof image === 'string' ? image : URL.createObjectURL(image);
    let cancel;
    try {
      img.decoding = 'async';
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        cancel = () => {
          img.removeAttribute('src');
          reject(signal.reason);
        };
        signal.addEventListener('abort', cancel, { once: true });
        img.onload = resolve;
        img.onerror = () => reject(new Error('Unable to read raster image.'));
        img.src = url;
      });
      if (img.decode) await img.decode();
      signal.throwIfAborted();
      return await useImage(img);
    } finally {
      signal.removeEventListener('abort', cancel);
      img.removeAttribute('src');
      if (typeof image !== 'string') URL.revokeObjectURL(url);
    }
  }

  function tintOnMainThread(image, finish, signal) {
    return withImage(image, signal, img => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      paintTint(canvas, img, finish.colour, finish.jpegMask);
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Could not recolour the shadow tile.'));
        }, 'image/png');
      });
    });
  }

  function create({ byteLimit = 64 * 1024 * 1024 } = {}) {
    const cache = new Map();
    let cacheBytes = 0;
    let worker, workerUrl, nextId = 0;
    let useWorker = typeof Worker === 'function';
    const pending = new Map();
    const unavailable = Symbol('Tint worker unavailable');

    function stopWorker(reason) {
      worker?.terminate();
      worker = null;
      if (workerUrl) URL.revokeObjectURL(workerUrl);
      workerUrl = null;
      for (const job of pending.values()) job.reject(reason);
      pending.clear();
    }

    function getWorker() {
      if (worker || !useWorker) return worker;
      // A blob worker keeps folder loading available when the page runs from file://.
      workerUrl = URL.createObjectURL(new Blob([
        paintTint.toString(), '\n(', runTintWorker.toString(), ')();'
      ], { type: 'text/javascript' }));
      try {
        const instance = new Worker(workerUrl);
        worker = instance;
        const fallBack = () => {
          if (worker !== instance) return;
          useWorker = false;
          stopWorker(unavailable);
        };
        instance.onerror = event => {
          event.preventDefault();
          fallBack();
        };
        instance.onmessage = ({ data }) => {
          if (worker !== instance) return;
          if (data.unavailable) return fallBack();
          const job = pending.get(data.id);
          if (data.blob) job?.resolve(data.blob);
          else job?.reject(new Error(data.error || 'Could not recolour the shadow tile.'));
        };
      } catch {
        useWorker = false;
        stopWorker(unavailable);
      }
      return worker;
    }

    async function tint(image, finish, signal) {
      if (typeof image === 'string' && image.startsWith('file:')) {
        return tintOnMainThread(image, finish, signal);
      }
      const instance = getWorker();
      if (instance) {
        const id = nextId++;
        const abort = () => stopWorker(signal.reason);
        signal.addEventListener('abort', abort, { once: true });
        try {
          return await new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            instance.postMessage({ id, image, finish });
          });
        } catch (error) {
          if (error !== unavailable) throw error;
        } finally {
          signal.removeEventListener('abort', abort);
          pending.delete(id);
        }
      }
      return tintOnMainThread(image, finish, signal);
    }

    function drop(key) {
      cacheBytes -= cache.get(key)?.bytes ?? 0;
      cache.delete(key);
    }

    async function read(key, image, finish, signal) {
      signal.throwIfAborted();
      const cacheKey = JSON.stringify([key, finish.colour, finish.jpegMask]);
      const entry = cache.get(cacheKey);
      if (entry) {
        cache.delete(cacheKey);
        cache.set(cacheKey, entry);
        return entry.blob ?? image;
      }

      // Original tiles only need a validation record. Tints retain compressed blobs.
      const blob = finish.colour
        ? await tint(image, finish, signal)
        : await withImage(image, signal, () => null);
      signal.throwIfAborted();
      const bytes = (blob?.size ?? 0) + cacheKey.length * 2 + 256;
      if (bytes <= byteLimit) {
        drop(cacheKey);
        while (cacheBytes + bytes > byteLimit) drop(cache.keys().next().value);
        cache.set(cacheKey, { blob, bytes });
        cacheBytes += bytes;
      }
      return blob ?? image;
    }

    return {
      read,
      clear() {
        cache.clear();
        cacheBytes = 0;
      },
      stats: () => ({ cacheSize: cache.size, cacheBytes, cacheBudget: byteLimit, tintBackend: useWorker ? 'worker' : 'main' })
    };
  }

  window.ShadowRasterImages = { create };
})();
