(() => {
  'use strict';
  const screen = document.getElementById('introScreen');
  const wall = document.getElementById('introWall');
  const content = screen.querySelector('.intro-content');
  const logo = content.querySelector('.intro-logo');
  const title = document.getElementById('introTitle');
  const enterButton = document.getElementById('introEnter');
  const icons = ['assets/red-tram.svg', 'assets/green-bus.svg', 'assets/blue-train.svg'];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const halfTurnDuration = 520;
  let waveFrame;
  let wallLayout;

  function stopWaves() {
    cancelAnimationFrame(waveFrame);
    for (const icon of wall.children) icon.style.removeProperty('transform');
  }

  function startWaves() {
    stopWaves();
    if (!screen.open || reducedMotion.matches || !wall.childElementCount) return;
    const tiles = Array.from(wall.children, icon => ({
      icon,
      row: Number(icon.style.gridRowStart),
      column: Number(icon.style.gridColumnStart)
    }));
    const rows = [...new Set(tiles.map(tile => tile.row))].sort((a, b) => a - b);
    const columns = [...new Set(tiles.map(tile => tile.column))].sort((a, b) => a - b);
    const diagonals = [...new Set(tiles.map(tile => tile.row + tile.column))].sort((a, b) => a - b);
    const firstDiagonal = columns.length + rows.length;
    const leftToRightStart = firstDiagonal + diagonals.length;
    const bottomToTopStart = leftToRightStart + columns.length;
    const strips = bottomToTopStart + rows.length + diagonals.length;
    const stagger = halfTurnDuration / Math.min(4, strips);
    const duration = strips * stagger;
    const schedule = tiles.map(({icon, row, column}) => {
      const columnIndex = columns.indexOf(column);
      const rowIndex = rows.indexOf(row);
      const diagonal = diagonals.indexOf(row + column);
      const starts = [
        columns.length - 1 - columnIndex,
        columns.length + rowIndex,
        firstDiagonal + diagonal,
        leftToRightStart + columnIndex,
        bottomToTopStart + rows.length - 1 - rowIndex,
        strips - 1 - diagonal
      ].map(strip => strip * stagger);
      return {icon, starts, angle: 0};
    });

    const start = performance.now();
    function animate(now) {
      const elapsed = now - start;
      for (const tile of schedule) {
        // Completed half-turns keep each icon on its current face when the sequence loops.
        let turns = 0;
        for (const at of tile.starts) {
          const sinceStart = elapsed - at;
          if (sinceStart < 0) continue;
          const progress = Math.min(1, (sinceStart % duration) / halfTurnDuration);
          turns += Math.floor(sinceStart / duration) + progress * progress * (3 - 2 * progress);
        }
        const angle = turns * 180 % 360;
        if (angle === tile.angle) continue;
        tile.icon.style.transform = `rotateY(${angle}deg)`;
        tile.angle = angle;
      }
      waveFrame = requestAnimationFrame(animate);
    }
    waveFrame = requestAnimationFrame(animate);
  }

  function foregroundOverlap() {
    const brand = logo.getBoundingClientRect();
    const heading = title.getBoundingClientRect();
    const button = enterButton.getBoundingClientRect();
    const style = getComputedStyle(title);
    const overhang = parseFloat(style.fontSize) / 5;
    const left = Math.floor(Math.min(brand.left, heading.left - overhang, button.left));
    const top = Math.floor(Math.min(brand.top, heading.top - overhang, button.top));
    const right = Math.ceil(Math.max(brand.right, heading.right + overhang, button.right));
    const bottom = Math.ceil(Math.max(brand.bottom, heading.bottom + overhang, button.bottom));
    const canvas = document.createElement('canvas');
    canvas.width = right - left;
    canvas.height = bottom - top;
    const ctx = canvas.getContext('2d');

    if (logo.complete && logo.naturalWidth) {
      ctx.drawImage(logo, brand.left - left, brand.top - top, brand.width, brand.height);
    } else {
      ctx.fillRect(brand.left - left, brand.top - top, brand.width, brand.height);
    }
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.letterSpacing = style.letterSpacing;
    ctx.textAlign = 'center';
    const metrics = ctx.measureText(title.textContent);
    const baseline = heading.top + (heading.height + metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2;
    if (Number.isFinite(baseline)) {
      ctx.fillText(title.textContent, heading.left + heading.width / 2 - left, baseline - top);
    } else {
      ctx.fillRect(heading.left - left, heading.top - top, heading.width, heading.height);
    }
    ctx.beginPath();
    ctx.roundRect(button.left - left, button.top - top, button.width, button.height, button.height / 2);
    ctx.fill();

    let pixels;
    try {
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (error) {
      if (error.name !== 'SecurityError') throw error;
      // A local-file origin can prevent inspection of image pixels.
      return (x, y, radius) => [brand, heading, button].some(box => Math.hypot(
        Math.max(box.left - x, x - box.right, 0), Math.max(box.top - y, y - box.bottom, 0)
      ) <= radius);
    }

    return (x, y, radius) => {
      const centreX = x - left;
      const centreY = y - top;
      const firstRow = Math.max(0, Math.ceil(centreY - radius - 0.5));
      const lastRow = Math.min(canvas.height - 1, Math.floor(centreY + radius - 0.5));
      for (let row = firstRow; row <= lastRow; row++) {
        const width = Math.sqrt(radius ** 2 - (row + 0.5 - centreY) ** 2);
        const firstColumn = Math.max(0, Math.ceil(centreX - width - 0.5));
        const lastColumn = Math.min(canvas.width - 1, Math.floor(centreX + width - 0.5));
        for (let column = firstColumn; column <= lastColumn; column++) {
          if (pixels[(row * canvas.width + column) * 4 + 3]) return true;
        }
      }
      return false;
    };
  }

  function fillWall(replay = false) {
    const bounds = wall.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const style = getComputedStyle(wall);
    const tileSize = parseFloat(style.gridAutoRows);
    if (!(tileSize > 0)) return;
    const columns = Math.ceil(bounds.width / tileSize);
    const rows = Math.ceil(bounds.height / tileSize);
    const iconRadius = tileSize * parseFloat(style.getPropertyValue('--wall-icon-proportion')) / 2;
    const intersectsForeground = foregroundOverlap();
    const gridLeft = bounds.left + (bounds.width - columns * tileSize) / 2;
    const gridTop = bounds.top + (bounds.height - rows * tileSize) / 2;
    const visible = [];
    for (let index = 0; index < columns * rows; index++) {
      const x = gridLeft + (index % columns + 0.5) * tileSize;
      const y = gridTop + (Math.floor(index / columns) + 0.5) * tileSize;
      if (!intersectsForeground(x, y, iconRadius + 2)) visible.push(index);
    }

    const layout = [columns, rows, ...visible].join(',');
    if (wallLayout === layout) {
      if (replay) startWaves();
      return;
    }
    wallLayout = layout;

    const tiles = document.createDocumentFragment();
    for (const index of visible) {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const image = document.createElement('img');
      image.src = icons[(row + column) % icons.length];
      image.alt = '';
      image.width = image.height = 49;
      image.style.gridRowStart = row + 1;
      image.style.gridColumnStart = column + 1;
      tiles.append(image);
    }
    wall.style.setProperty('--wall-columns', columns);
    wall.style.setProperty('--wall-rows', rows);
    wall.replaceChildren(tiles);
    startWaves();
  }

  function play() {
    if (screen.open) return;
    screen.showModal();
    fillWall(true);
  }

  function enter() {
    stopWaves();
    screen.close();
  }

  const observer = new ResizeObserver(() => fillWall());
  observer.observe(wall);
  observer.observe(content);
  logo.addEventListener('load', () => fillWall());
  reducedMotion.addEventListener('change', startWaves);
  enterButton.addEventListener('click', enter);
  screen.addEventListener('cancel', event => event.preventDefault());
  const brand = document.querySelector('.brand-logo');
  brand.setAttribute('aria-label', 'Replay opening animation');
  brand.addEventListener('click', event => {
    event.preventDefault();
    play();
  });
  window.MetroIntro = {play, skip: enter};
  play();
})();
