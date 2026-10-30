
(() => {
  "use strict";
  window.addEventListener("DOMContentLoaded", () => {
    const api = window.GeoGlyphStudio;
    const moduleHead = document.querySelector("#sharedColourModule>.module-head");
    const status = document.getElementById("colourTargetStatus");
    if (!api || !moduleHead) return;

    const button = document.createElement("button");
    button.className = "square-btn magic-eye-random-btn";
    button.id = "magicEyeRandomColourBtn";
    button.type = "button";
    button.textContent = "Random";
    button.title = "Create a contrasting random Magic Eye foreground and background";
    if (status?.parentElement === moduleHead) moduleHead.insertBefore(button, status);
    else moduleHead.append(button);

    function randomUnit() {
      if (window.crypto?.getRandomValues) {
        const value = new Uint32Array(1);
        window.crypto.getRandomValues(value);
        return value[0] / 0x100000000;
      }
      return Math.random();
    }
    const randomBetween = (min, max) => min + randomUnit() * (max - min);
    const randomChoice = values => values[Math.floor(randomUnit() * values.length)];

    function hslToHex(hue, saturation, lightness) {
      const s = saturation / 100, l = lightness / 100;
      const chroma = (1 - Math.abs(2 * l - 1)) * s;
      const section = ((hue % 360) + 360) % 360 / 60;
      const x = chroma * (1 - Math.abs(section % 2 - 1));
      const [r1, g1, b1] = section < 1 ? [chroma,x,0] : section < 2 ? [x,chroma,0] : section < 3 ? [0,chroma,x] : section < 4 ? [0,x,chroma] : section < 5 ? [x,0,chroma] : [chroma,0,x];
      const m = l - chroma / 2;
      return `#${[r1,g1,b1].map(channel => Math.round((channel + m) * 255).toString(16).padStart(2,"0")).join("").toUpperCase()}`;
    }

    function relativeLuminance(hex) {
      const channels = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
      return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
    }

    function randomBandColour(hue, light) {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const colour = hslToHex(
          hue + randomBetween(-14, 14),
          randomBetween(light ? 45 : 52, light ? 92 : 90),
          randomBetween(light ? 78 : 6, light ? 96 : 23)
        );
        const luminance = relativeLuminance(colour);
        if ((light && luminance >= .55) || (!light && luminance <= .06)) return colour;
      }
      return light ? "#F5F7F8" : "#071013";
    }

    function randomColour(light) {
      return randomBandColour(randomBetween(0, 360), light);
    }

    function randomGradient(light) {
      const startHue = randomBetween(0, 360);
      const hueStep = randomChoice([28, 42, 60, 90, 120]) * (randomUnit() < .5 ? -1 : 1);
      const stopB = Math.round(randomBetween(20, 43));
      const stopC = Math.round(randomBetween(57, 80));
      return {
        colors: Array.from({ length: 4 }, (_, index) => randomBandColour(startHue + hueStep * index, light)),
        stops: [0, stopB, stopC, 100],
        direction: randomChoice(["horizontal","vertical","diagonal","radial"])
      };
    }

    button.addEventListener("click", async () => {
      const state = api.state;
      const gradientMode = state.colourView === "gradient";
      const lightForeground = randomUnit() < .5;
      const bg = state.colourTargets.qrBg;
      const fg = state.colourTargets.qrFg;
      if (gradientMode) {
        bg.mode = "gradient";
        fg.mode = "gradient";
        bg.gradient = randomGradient(!lightForeground);
        fg.gradient = randomGradient(lightForeground);
      } else {
        bg.mode = "solid";
        fg.mode = "solid";
        bg.solid = randomColour(!lightForeground);
        fg.solid = randomColour(lightForeground);
      }
      state.colourTarget = "qrFg";
      state.colourView = gradientMode ? "gradient" : "palette";
      api.syncControlsFromState();
      await api.renderPreview();
      document.dispatchEvent(new CustomEvent("geoglyph:magic-eye-rendered"));
      api.showToast(gradientMode ? "Random Magic Eye gradients applied" : "Random Magic Eye colours applied");
    });
  });
})();
