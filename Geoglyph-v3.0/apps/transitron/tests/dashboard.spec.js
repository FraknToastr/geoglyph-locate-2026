const path = require('node:path');
const {readFile} = require('node:fs/promises');
const {test, expect} = require('@playwright/test');

test.beforeEach(async ({context}) => {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'localhost') return route.abort();
    if (url.pathname.startsWith('/api/') || url.pathname.endsWith('/startup-snapshot.json')) {
      return route.fulfill({status: 404});
    }
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    await route.fulfill({path: path.join(__dirname, '..', file)});
  });
});

test('fills the wall around the logo and title and alternates the axes of all six waves', async ({page}) => {
  const time = new Date('2026-11-18T00:00:00Z');
  await page.clock.install({time});
  await page.clock.pauseAt(new Date(time.getTime() + 1000));
  await page.goto('http://localhost/');
  const screen = page.getByRole('dialog', {name: 'Dashboard'});
  const enter = screen.getByRole('button', {name: 'Enter dashboard'});
  const wall = page.locator('#introWall');
  const wallPattern = () => wall.evaluate(element => {
    const {left, top, width, height} = element.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const content = element.parentElement.querySelector('.intro-content');
    const brand = content.querySelector('.intro-logo').getBoundingClientRect();
    const button = content.querySelector('.intro-enter').getBoundingClientRect();
    const previousRadius = 14 + Math.max(...Array.from(content.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.hypot(
        Math.max(Math.abs(rect.left - x), Math.abs(rect.right - x)),
        Math.max(Math.abs(rect.top - y), Math.abs(rect.bottom - y))
      );
    }));
    const icons = Array.from(element.children, image => ({
      row: Number(image.style.gridRowStart),
      column: Number(image.style.gridColumnStart),
      source: image.src,
      rect: image.getBoundingClientRect()
    }));
    const cells = new Map(icons.map(({row, column, source}) => [row + ':' + column, source]));
    const columns = Number(element.style.getPropertyValue('--wall-columns'));
    const rows = Number(element.style.getPropertyValue('--wall-rows'));
    return {
      columns,
      count: icons.length,
      omitted: columns * rows - icons.length,
      restored: icons.some(({rect}) =>
        Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y) < previousRadius + rect.height / 2 - 1
      ),
      overlapsLogoBounds: icons.some(({rect}) => rect.right > brand.left && rect.left < brand.right &&
        rect.bottom > brand.top && rect.top < brand.bottom),
      clearsButton: icons.every(({rect}) => {
        const radius = button.height / 2;
        const x = rect.left + rect.width / 2;
        const dx = Math.max(0, button.left + radius - x, x - (button.right - radius));
        const dy = rect.top + rect.height / 2 - (button.top + radius);
        return Math.hypot(dx, dy) >= radius + rect.height / 2;
      }),
      differentNeighbours: icons.every(({row, column, source}) =>
        cells.get(row + ':' + (column - 1)) !== source && cells.get((row - 1) + ':' + column) !== source
      )
    };
  });

  await expect(screen).toBeVisible();
  const logo = screen.getByRole('img', {name: 'Adelaide Metro'});
  await expect(logo).toBeVisible();
  await expect(logo).toHaveCSS('filter', 'none');
  const title = screen.getByRole('heading', {name: 'Dashboard'});
  await expect(title).toBeVisible();
  await expect(title).toHaveCSS('color', 'rgb(246, 250, 252)');
  await expect(title).toHaveCSS('text-shadow', 'none');
  await expect(wall).toHaveCSS('mask-image', 'none');
  await expect(wall.locator('img').first()).toHaveCSS('opacity', '1');
  await expect(wall.locator('img').first()).toHaveCSS('border-top-width', '2px');
  await expect(wall.locator('img').first()).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
  await expect(wall.locator('img').first()).toHaveCSS('filter', 'none');
  await expect(enter).toHaveText('Enter dashboard');
  await expect(enter).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
  await expect(enter).toHaveCSS('border-top-width', '8px');
  const desktop = await wallPattern();
  expect(desktop.count).toBeGreaterThan(0);
  expect(desktop.omitted).toBeGreaterThan(0);
  expect(desktop.restored).toBe(true);
  expect(desktop.overlapsLogoBounds).toBe(true);
  expect(desktop.clearsButton).toBe(true);
  expect(desktop.differentNeighbours).toBe(true);

  const bands = await wall.evaluate(element => {
    const cells = Array.from(element.children, image => ({
      row: Number(image.style.gridRowStart),
      column: Number(image.style.gridColumnStart)
    }));
    const ordered = values => [...new Set(values)].sort((a, b) => a - b);
    return {
      columns: ordered(cells.map(cell => cell.column)),
      rows: ordered(cells.map(cell => cell.row)),
      diagonals: ordered(cells.map(cell => cell.row + cell.column))
    };
  });
  const {columns, rows, diagonals} = bands;
  const lastColumn = wall.locator(`img[style*="grid-column-start: ${columns.at(-1)};"]`);
  let elapsed = 0;
  async function sweepAt(strip, axis) {
    const target = strip * 130;
    await page.clock.runFor(target - elapsed);
    elapsed = target;
    const motion = await wall.evaluate((element, dimension) => {
      const moving = new Set();
      let uncoloured = 0;
      for (const image of element.children) {
        const {transform, filter} = getComputedStyle(image);
        const cosine = transform === 'none' ? 1 : new DOMMatrix(transform).m11;
        const row = Number(image.style.gridRowStart);
        if (filter !== 'none') uncoloured++;
        if (Math.abs(Math.abs(cosine) - 1) < 0.001) continue;
        const column = Number(image.style.gridColumnStart);
        moving.add(dimension === 'diagonal' ? row + column : dimension === 'row' ? row : column);
      }
      return {moving: [...moving].sort((a, b) => a - b), uncoloured};
    }, axis);
    expect(motion.uncoloured).toBe(0);
    return motion.moving;
  }

  expect(await sweepAt(.5, 'column')).toEqual(columns.slice(-1));
  await expect(lastColumn.first()).toHaveCSS('filter', 'none');
  await expect(wall.locator('img').first()).toHaveCSS('filter', 'none');
  expect(await sweepAt(3.5, 'column')).toEqual(columns.slice(-4));
  await sweepAt(4.5, 'column');
  await expect(lastColumn.first()).toHaveCSS('filter', 'none');
  const completed = await lastColumn.first()
    .evaluate(image => new DOMMatrix(getComputedStyle(image).transform).m11);
  expect(completed).toBeCloseTo(-1);
  expect(await sweepAt(columns.length + 3.5, 'row')).toEqual(rows.slice(0, 4));
  expect(await sweepAt(columns.length + rows.length + 3.5, 'diagonal')).toEqual(diagonals.slice(0, 4));
  const secondPass = columns.length + rows.length + diagonals.length;
  expect(await sweepAt(secondPass + 3.5, 'column')).toEqual(columns.slice(0, 4));
  expect(await sweepAt(secondPass + columns.length + 3.5, 'row')).toEqual(rows.slice(-4));
  expect(await sweepAt(secondPass + columns.length + rows.length + 3.5, 'diagonal')).toEqual(diagonals.slice(-4));
  expect(await sweepAt(2 * secondPass + 3.5, 'column')).toEqual(columns.slice(-4));

  await page.clock.fastForward(30_000);
  await page.keyboard.press('Escape');
  await expect(screen).toBeVisible();
  await enter.click();
  await expect(screen).toBeHidden();

  await page.clock.resume();
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('link', {name: 'Replay opening animation'}).press('Enter');
  await expect(screen).toBeVisible();
  const phone = await wallPattern();
  expect(phone.columns).toBeLessThan(desktop.columns);
  expect(phone.count).toBeGreaterThan(0);
  expect(phone.omitted).toBeGreaterThan(0);
  expect(phone.restored).toBe(true);
  expect(phone.clearsButton).toBe(true);
  expect(phone.differentNeighbours).toBe(true);
  await expect(enter).toBeFocused();
  await expect(enter).toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
  await expect(enter).toHaveCSS('box-shadow', 'rgb(255, 255, 255) 0px 0px 0px 2px inset');
  await expect(enter).toHaveCSS('text-decoration-line', 'none');
  await page.mouse.move(0, 0);
  await expect(enter).toHaveCSS('background-color', 'rgb(252, 177, 46)');
  await enter.hover();
  await expect(enter).toHaveCSS('background-color', 'rgb(238, 158, 22)');
  await page.mouse.move(0, 0);
  await expect(enter).toHaveCSS('background-color', 'rgb(252, 177, 46)');
  await enter.press('Enter');
  await expect(screen).toBeHidden();
});

test('centres the vehicle artwork and aligns all four frames on desktop and mobile', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.setViewportSize({width: 1440, height: 900});
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  const navigation = page.getByRole('navigation', {name: 'Report navigation'});
  const buttons = navigation.getByRole('button');
  await expect(buttons).toHaveText(['Overview', 'Vehicles', 'Trip Updates', 'Service Alerts', 'Recorder']);
  await expect(page.locator('[data-tab="outputs"], #tab-outputs')).toHaveCount(0);
  await expect(navigation.locator('[data-tab="debug"]')).toHaveAttribute('hidden', '');
  await expect(page.locator('#debugLogWindow')).toHaveValue(/dashboard loaded/);
  await page.evaluate(() => window.MetroApp.selectTab('debug'));
  await expect(page.getByRole('button', {name: 'Export log'})).toBeVisible();
  await page.getByRole('button', {name: 'Clear', exact: true}).click();
  await expect(page.locator('#debugLogWindow')).toHaveValue(/Debug log cleared/);
  await navigation.getByRole('button', {name: 'Overview'}).click();
  await page.mouse.move(0, 0);

  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height: 900});
    const navSize = await navigation.evaluate(nav => ({
      client: nav.clientWidth,
      content: nav.scrollWidth
    }));
    expect(navSize.content > navSize.client).toBe(width === 390);
    const buttonBoxes = await Promise.all((await buttons.all()).map(button => button.boundingBox()));
    for (const box of buttonBoxes) {
      expect(box.y).toBe(buttonBoxes[0].y);
      expect(box.width).toBeCloseTo(buttonBoxes[0].width, 0);
    }
    const header = page.locator('.brand-row');
    const {x, y, width: headerWidth, height: headerHeight} = await header.boundingBox();
    for (const selector of ['.brand-row', '.map-chrome', '.report-chrome', '.ticker-window']) {
      await expect(page.locator(selector)).toHaveCSS('border-top', '4px solid rgb(255, 255, 255)');
      await expect(page.locator(selector)).toHaveCSS('border-top-left-radius', '14px');
    }
    const mapBox = await page.locator('.map-chrome').boundingBox();
    const reportBox = await page.locator('.report-chrome').boundingBox();
    const tickerBox = await page.locator('.ticker-window').boundingBox();
    expect(mapBox.x).toBe(x);
    expect(reportBox.x + reportBox.width).toBe(x + headerWidth);
    expect(tickerBox.x).toBe(x);
    expect(tickerBox.width).toBe(headerWidth);
    const lcd = await page.locator('.lcd-canvas').boundingBox();
    expect(lcd).toEqual({
      x: tickerBox.x + 4, y: tickerBox.y + 4,
      width: tickerBox.width - 8, height: tickerBox.height - 8
    });
    await expect(page.locator('.ticker-window')).not.toHaveCSS('box-shadow', /inset/);

    const vehicles = header.locator('.vehicle-sprite');
    const visibleArtwork = await vehicles.locator('img').evaluateAll(async images => {
      const canvas = document.createElement('canvas');
      return await Promise.all(images.map(async image => {
        await image.decode();
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const {data} = context.getImageData(0, 0, canvas.width, canvas.height);
        const clip = getComputedStyle(image).clipPath;
        const clippedWidth = clip === 'inset(0px 0px 0px 1%)' ? canvas.width / 100 : 0;
        let left = canvas.width, top = canvas.height, right = 0, bottom = 0;
        for (let offset = 3; offset < data.length; offset += 4) {
          if (data[offset] <= 45) continue;
          const pixel = (offset - 3) / 4;
          const col = pixel % canvas.width;
          if (col < clippedWidth) continue;
          const row = Math.floor(pixel / canvas.width);
          left = Math.min(left, col);
          right = Math.max(right, col);
          top = Math.min(top, row);
          bottom = Math.max(bottom, row);
        }
        const box = image.getBoundingClientRect();
        return {
          x: box.x + (left + right + 1) / 2 * box.width / canvas.width,
          y: box.y + (top + bottom + 1) / 2 * box.height / canvas.height
        };
      }));
    });

    for (const [index, centre] of visibleArtwork.entries()) {
      const stripeCentre = x + 4 + (headerWidth - 8) * (index + 1.5) / 4;
      expect(Math.abs(centre.x - stripeCentre)).toBeLessThan(1.5);
      expect(Math.abs(centre.y - (y + headerHeight / 2))).toBeLessThan(1.5);
      if (width !== 1440) continue;
      const vehicle = vehicles.nth(index);
      const artwork = vehicle.locator(':scope > :is(img,.tram-art)');
      await page.mouse.move(centre.x, centre.y);
      await expect(artwork).toHaveCSS('filter', /rgb\(255, 255, 255\)/);
      await expect(page.locator('#appTooltip')).toBeHidden();
      await page.mouse.click(centre.x, centre.y);
      await expect(vehicle).toHaveAttribute('aria-pressed', 'true');
      await expect(artwork).toHaveCSS('filter', /rgb\(252, 177, 46\)/);
      await page.mouse.click(centre.x, centre.y);
      await expect(vehicle).toHaveAttribute('aria-pressed', 'false');
    }
  }
});

test('imports a recording and switches between playback frames and the dashboard', async ({page}) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install({time: new Date('2026-11-18T00:00:00Z')});
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://localhost/');
  await expect(page.locator('#introScreen')).toBeVisible();
  await expect(page.locator('#introWall img').first()).toHaveCSS('transform', 'none');
  await expect(page.locator('#introWall img').first()).toHaveCSS('filter', 'none');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  expect((await page.locator('.ticker-window').boundingBox()).height).toBeCloseTo(65, 1);
  const report = page.getByRole('complementary', {name: 'Realtime report panels'});
  const navigation = report.getByRole('navigation', {name: 'Report navigation'});
  await expect(navigation.getByRole('button')).toHaveCount(5);
  await expect(navigation.getByRole('button', {name: 'Refresh', exact: true})).toHaveCount(0);
  const map = page.getByRole('region', {name: 'Vehicle map'});
  const controls = map.getByRole('group', {name: 'Map controls'});
  const basemap = controls.getByRole('button', {name: 'Basemap'});
  const refresh = controls.getByRole('button', {name: 'Refresh latest feeds'});
  const tooltip = page.getByRole('tooltip');
  await expect(basemap).toHaveCSS('width', '58px');
  await expect(basemap).toHaveCSS('height', '58px');
  await basemap.hover();
  await expect(tooltip).toHaveText('Basemap');
  const buttonBox = await basemap.boundingBox();
  const tipBox = await tooltip.boundingBox();
  const pointerX = buttonBox.x + buttonBox.width / 2;
  expect(tipBox.x).toBeGreaterThanOrEqual(8);
  expect(tipBox.y).toBeGreaterThanOrEqual(8);
  expect(tipBox.x + tipBox.width).toBeLessThanOrEqual(382);
  expect(tipBox.y + tipBox.height).toBeLessThanOrEqual(836);
  expect(pointerX - tipBox.x - tipBox.width).toBeGreaterThanOrEqual(63);
  await page.mouse.move(20, 20);
  await expect(tooltip).toBeHidden();
  await controls.getByRole('button', {name: 'Network layers'}).focus();
  await page.keyboard.press('Tab');
  await expect(basemap).toBeFocused();
  await expect(tooltip).toHaveText('Basemap');
  await expect(basemap).toHaveAttribute('aria-describedby', 'appTooltip');
  await page.keyboard.press('Escape');
  await expect(tooltip).toBeHidden();
  await expect(basemap).not.toHaveAttribute('aria-describedby');
  await basemap.click();
  await expect(map.getByRole('button', {name: 'Esri World Topography'})).toHaveAttribute('aria-pressed', 'true');
  await expect(map.getByRole('button', {name: 'Esri Nova'})).toHaveAttribute('aria-pressed', 'false');
  await expect(map.locator('#basemapStatus')).toContainText('Nova is unavailable');
  await map.getByRole('button', {name: 'Forget key'}).scrollIntoViewIfNeeded();
  await page.keyboard.press('Escape');
  await expect(basemap).toHaveAttribute('aria-expanded', 'false');
  await expect(basemap).toBeFocused();
  await controls.getByRole('button', {name: 'Vehicle layers'}).click();
  const vehicleLayers = map.getByRole('region', {name: 'Vehicle layers'});
  await expect(vehicleLayers.getByRole('checkbox', {name: 'Bus'})).toBeChecked();
  await controls.getByRole('button', {name: 'Network layers'}).click();
  await expect(vehicleLayers).toBeHidden();
  await expect(map.getByRole('checkbox', {name: 'Bus routes', exact: true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.app-viewport')).toHaveCSS('background-image', /linear-gradient/);
  await expect(page.locator('.brand-row')).toHaveCSS('border-top-width', '4px');
  await expect(page.locator('.brand-row')).toHaveCSS('border-top-color', 'rgb(255, 255, 255)');
  await expect(page.locator('.brand-row')).toHaveCSS('background-image', /25%.*25%.*50%.*50%.*75%.*75%/);
  await expect(page.locator('.masthead')).toHaveCSS('border-bottom-width', '0px');
  await expect(page.locator('.bottom-rail')).toHaveCSS('border-top-width', '0px');
  await page.getByRole('button', {name: 'Recorder', exact: true}).click();
  const time = Date.UTC(2026, 10, 18);
  const recording = {
    version: 1, id: 'browser-fixture', mode: 'browser', startedAt: time, endedAt: time + 30_000,
    frames: [0, 1].map(index => ({
      time: time + index * 30_000,
      feeds: {
        vehicle_positions: {time, raw: 'CgEw', rows: [{VehicleID: 'test-' + index, VehicleType: 'Bus', RouteID: '100'}]},
        trip_updates: {time, error: 'Test outage'},
        service_alerts: {time, raw: 'CgEw', rows: []}
      }
    }))
  };
  await page.locator('[data-control="file"]').setInputFiles({
    name: 'recording.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(recording))
  });
  const deck = page.locator('#recorderDeck');
  const mode = deck.locator('[data-control="mode"]');
  const timeline = deck.getByRole('slider', {name: 'Playback position'});
  const library = deck.getByRole('listbox', {name: 'Recording library'});
  const power = deck.getByRole('button', {name: 'Power'});
  const layout = () => deck.evaluate(element => {
    const top = element.getBoundingClientRect().top;
    return ['.recorder-screen', '.recorder-transport', '.recorder-player', '.recorder-settings'].map(selector => {
      const {y, height} = element.querySelector(selector).getBoundingClientRect();
      return [y - top, height];
    });
  });
  await expect(library.locator('option')).toHaveText('recording.json · Import · 2 frames');
  await expect(deck.locator('[data-control="program"]')).toHaveText('recording.json');
  await expect(deck.locator('[data-control="frame-status"]')).toContainText('Unavailable: trip updates');
  await expect(deck.locator('[data-control="elapsed"]')).toHaveText('00:00:00 / 00:00:30');
  const playbackLayout = await layout();
  await expect(refresh).toBeDisabled();
  await page.getByRole('button', {name: 'Next frame'}).click();
  await expect(timeline).toHaveValue('30000');
  await page.getByRole('button', {name: 'Previous frame'}).click();
  await expect(timeline).toHaveValue('0');

  await deck.getByRole('button', {name: 'Fast-forward'}).click();
  await expect(mode).toHaveText('Fast-forward 4×');
  await page.clock.runFor(7_700);
  await expect(mode).toHaveText('Pause');
  expect(await layout()).toEqual(playbackLayout);
  await expect(timeline).toHaveValue('30000');
  await deck.getByRole('button', {name: 'Rewind'}).click();
  await expect(mode).toHaveText('Rewind 4×');
  await page.clock.runFor(7_700);
  await expect(mode).toHaveText('Pause');
  await expect(timeline).toHaveValue('0');
  const speed = deck.getByRole('combobox', {name: 'Playback speed'});
  await expect(speed).toHaveValue('1');
  await speed.selectOption('0.25');
  await deck.getByRole('button', {name: 'Play', exact: true}).click();
  await expect(deck).toHaveAttribute('data-transport', 'play');
  await page.clock.runFor(1_100);
  await deck.getByRole('button', {name: 'Pause', exact: true}).click();
  await expect(mode).toHaveText('Pause');
  const pausedAt = await timeline.inputValue();
  expect(Number(pausedAt)).toBeGreaterThan(200);
  expect(Number(pausedAt)).toBeLessThan(800);
  await page.clock.runFor(1_500);
  await expect(timeline).toHaveValue(pausedAt);
  await speed.selectOption('120');
  await deck.getByRole('button', {name: 'Play', exact: true}).click();
  await page.clock.runFor(400);
  await expect(timeline).toHaveValue('30000');
  await expect(mode).toHaveText('Pause');
  expect(await layout()).toEqual(playbackLayout);
  await speed.selectOption('1');

  await power.click();
  await expect(power).toHaveAttribute('aria-pressed', 'false');
  await expect(mode).toHaveText('Standby');
  await expect(library).toBeHidden();
  await expect(deck.getByRole('button', {name: 'Record', exact: true})).toBeDisabled();
  await expect(refresh).toBeEnabled();
  await expect(timeline).toBeDisabled();
  expect(await layout()).toEqual(playbackLayout);
  await power.click();
  await expect(library).toBeVisible();
  await page.locator('[data-control="file"]').setInputFiles({
    name: 'other-night.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(recording))
  });
  await expect(library.locator('option')).toHaveText([
    'other-night.json · Import · 2 frames', 'recording.json · Import · 2 frames'
  ]);
  await deck.getByRole('button', {name: 'Next recording'}).click();
  await expect(library).toHaveValue('imported:1');
  await library.press('Enter');
  await expect(deck.locator('[data-control="program"]')).toHaveText('recording.json');
  await expect(mode).toHaveText('Play');
  await deck.getByRole('button', {name: 'Stop', exact: true}).click();
  await expect(refresh).toBeEnabled();
  await expect(timeline).toHaveValue('0');
  expect(await layout()).toEqual(playbackLayout);
  await page.route('https://gtfs.adelaidemetro.com.au/**', route => route.fulfill({
    headers: {'access-control-allow-origin': '*'},
    body: Buffer.from([0x0a, 0x03, 0x0a, 0x01, 0x32])
  }));
  await refresh.click();
  await expect(map.locator('#refreshStatus')).toHaveText('3 of 3 feeds refreshed.');
  expect(await page.locator('body').evaluate(body => body.scrollWidth)).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});

test('uses the Recorder joystick and mouse to navigate the same library', async ({page}) => {
  const time = Date.UTC(2026, 10, 21);
  const sessions = Array.from({length: 12}, (_, index) => ({
    id: 'recording-' + index,
    name: 'Recording ' + (index + 1),
    mode: 'background',
    startedAt: time - index * 60_000,
    frameCount: 2
  }));
  let catalogue = [];
  const recordingReady = Promise.withResolvers();
  await page.route(url => url.pathname === '/api/recordings', route =>
    route.fulfill({json: {activeId: null, sessions: catalogue}}));
  await page.route('**/api/recordings/recording-11', async route => {
    await recordingReady.promise;
    await route.fulfill({json: {
      version: 1, startedAt: sessions.at(-1).startedAt,
      frames: [0, 30_000].map(offset => ({
        time: time + offset,
        feeds: Object.fromEntries(['vehicle_positions', 'trip_updates', 'service_alerts'].map(feed =>
          [feed, {time: time + offset, raw: 'CgEw', rows: []}]))
      }))
    }});
  });

  await page.clock.install({time: new Date(time)});
  await page.setViewportSize({width: 1440, height: 900});
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  await page.getByRole('button', {name: 'Recorder', exact: true}).click();
  const deck = page.locator('#recorderDeck');
  const library = deck.getByRole('listbox', {name: 'Recording library'});
  const joystick = deck.getByRole('group', {name: 'Recording library joystick'});
  const up = joystick.getByRole('button', {name: 'Previous recording'});
  const down = joystick.getByRole('button', {name: 'Next recording'});
  const centre = joystick.getByRole('button', {name: 'Play selected recording'});
  const power = deck.getByRole('button', {name: 'Power'});
  const mode = deck.locator('[data-control="mode"]');
  const layout = () => deck.evaluate(element => {
    const deckTop = element.getBoundingClientRect().top;
    return ['.recorder-screen', '.recorder-joystick', '.recorder-transport', '.recorder-settings'].map(selector => {
      const {x, y, width, height} = element.querySelector(selector).getBoundingClientRect();
      return [x, y - deckTop, width, height];
    });
  });

  await expect(library.locator('option')).toHaveText('No recordings');
  for (const key of [up, down, centre]) await expect(key).toBeDisabled();
  const desktopLayout = await layout();
  catalogue = sessions;
  await page.clock.fastForward(5_100);
  await expect(library.locator('option')).toHaveCount(sessions.length);
  await expect(up).toBeDisabled();
  await expect(down).toBeEnabled();

  // Click a library entry directly and continue from it with the joystick.
  const second = await library.locator('option').nth(1).boundingBox();
  await page.mouse.click(second.x + 12, second.y + second.height / 2);
  await expect(library).toHaveValue('background:recording-1');
  await down.click();
  await expect(library).toHaveValue('background:recording-2');
  await expect(down).toBeFocused();
  await up.press('Enter');
  await expect(library).toHaveValue('background:recording-1');
  await library.press('ArrowUp');
  await expect(up).toBeDisabled();
  await expect(library).toHaveValue('background:recording-0');
  expect(await layout()).toEqual(desktopLayout);

  await page.setViewportSize({width: 390, height: 844});
  const mobileLayout = await layout();
  expect(mobileLayout[1][1]).toBeGreaterThanOrEqual(mobileLayout[0][1] + mobileLayout[0][3]);
  await down.click();
  const pageScroll = await page.evaluate(() => window.scrollY);
  for (let index = 2; index < sessions.length; index++) await down.click();
  await expect(library).toHaveValue('background:recording-11');
  await expect(down).toBeDisabled();
  const lastRow = await library.evaluate(list => ({
    scroll: list.scrollTop,
    bottom: list.selectedOptions[0].getBoundingClientRect().bottom,
    viewportBottom: list.getBoundingClientRect().top + list.clientTop + list.clientHeight
  }));
  expect(lastRow.scroll).toBeGreaterThan(0);
  expect(lastRow.bottom).toBeLessThanOrEqual(lastRow.viewportBottom + 1);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);

  await centre.click();
  await expect(mode).toHaveText('Loading');
  for (const key of [up, down, centre]) await expect(key).toBeDisabled();
  recordingReady.resolve();
  await expect(mode).toHaveText('Play');
  await expect(deck.locator('[data-control="program"]')).toHaveText('Recording 12');
  await expect(centre).toBeDisabled();
  expect(await layout()).toEqual(mobileLayout);

  await power.click();
  await expect(mode).toHaveText('Standby');
  for (const key of [up, down, centre]) await expect(key).toBeDisabled();
  expect(await layout()).toEqual(mobileLayout);
  await power.click();
  await expect(library).toHaveValue('background:recording-11');
  await expect(centre).toBeEnabled();
  expect(await page.locator('body').evaluate(body => body.scrollWidth)).toBeLessThanOrEqual(390);

  await page.setViewportSize({width: 1440, height: 900});
  await centre.click();
  await expect(mode).toHaveText('Play');
  expect(await layout()).toEqual(desktopLayout);
  await power.click();
  await expect(mode).toHaveText('Standby');
  expect(await layout()).toEqual(desktopLayout);
});

test('records at the chosen interval and clears browser captures without deleting background recordings', async ({page, context}) => {
  await page.clock.install({time: new Date('2026-03-21T22:30:00Z')});
  await page.emulateMedia({reducedMotion: 'reduce'});
  const backgroundMethods = new Set();
  await context.route(url => url.hostname === 'localhost' && url.pathname === '/api/recordings', route => {
    backgroundMethods.add(route.request().method());
    return route.fulfill({
      json: {activeId: null, sessions: [{id: 'background-fixture', mode: 'background', startedAt: 1, frameCount: 2}]}
    });
  });
  const requests = [];
  const emptyFeed = Buffer.from([0x0a, 0x03, 0x0a, 0x01, 0x32]);
  const message = (field, body) => Buffer.from([(field << 3) | 2, body.length, ...body]);
  const position = Buffer.alloc(10);
  position[0] = 13;
  position.writeFloatLE(-34.92, 1);
  position[5] = 21;
  position.writeFloatLE(138.6, 6);
  const vehicle = Buffer.concat([
    message(1, message(5, Buffer.from('100'))),
    message(2, position),
    message(8, message(1, Buffer.from('fixture')))
  ]);
  const oneVehicleFeed = Buffer.concat([emptyFeed, message(2, message(4, vehicle))]);
  await page.route('https://gtfs.adelaidemetro.com.au/**', route => {
    const endpoint = new URL(route.request().url()).pathname.split('/').at(-1);
    const hasVehicle = endpoint === 'vehicle_positions' && requests.includes(endpoint);
    requests.push(endpoint);
    return route.fulfill({
      headers: {'access-control-allow-origin': '*'},
      contentType: 'application/protobuf',
      body: hasVehicle ? oneVehicleFeed : emptyFeed
    });
  });
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  const recordings = page.getByRole('button', {name: 'Recorder', exact: true});
  const lcd = page.locator('#lcdReadable');
  await recordings.click();
  const interval = page.getByRole('spinbutton', {name: 'Recording interval (seconds)'});
  const deleteButton = page.getByRole('button', {name: 'Delete all browser recordings'});
  await expect(deleteButton).toBeDisabled();
  await expect(interval).toHaveValue('30');
  await interval.fill('7');
  await page.getByRole('button', {name: 'Record', exact: true}).click();
  await expect(page.locator('[data-control="capture-status"]')).toContainText('1 frame');
  await expect(recordings).toHaveAttribute('data-recording', 'true');
  const led = recordings.locator('.recording-led');
  await expect(led).toHaveCSS('background-color', 'rgb(255, 64, 84)');
  await expect(led).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await expect(led).toHaveCSS('animation-name', 'recording-led-pulse');
  await expect(lcd).toContainText('BROWSER RECORDING');
  await expect.poll(() => page.locator('.lcd-canvas').evaluate(canvas => canvas.getContext('2d').fillStyle)).toBe('#ff5f6a');
  await expect(lcd).toContainText('1 FRAME');
  await expect(lcd).toContainText('STARTED 22/03/2026 9:00am');
  await expect(lcd).toContainText('EVERY 7 SEC');
  await expect(page.locator('#sourceDescription')).toContainText('Live GTFS-Realtime');
  await expect(page.locator('#countVehicles')).toHaveText('0');
  await expect(deleteButton).toBeDisabled();
  expect(new Set(requests)).toEqual(new Set(['vehicle_positions', 'trip_updates', 'service_alerts']));
  const deck = page.locator('#recorderDeck');
  const power = deck.getByRole('button', {name: 'Power'});
  await power.click();
  await expect(deck).toHaveAttribute('data-power', 'standby');
  await expect(deck).toHaveAttribute('data-recording', 'true');
  await expect(deck.getByRole('button', {name: 'Stop', exact: true})).toBeDisabled();
  expect(await deck.locator('.recorder-light-record').evaluate(light =>
    getComputedStyle(light, '::before').backgroundColor)).toBe('rgb(255, 64, 84)');
  await page.clock.fastForward(8_000);
  await expect(page.locator('[data-control="capture-status"]')).toContainText('2 frames');
  await power.click();
  await expect(deck.getByRole('button', {name: 'Stop', exact: true})).toBeEnabled();
  await expect(page.locator('#countVehicles')).toHaveText('1');
  await expect(lcd).toContainText('2 FRAMES');
  await expect(lcd).toContainText(/LENGTH 00:00:0[89]/);
  await page.locator('.fallback-pin').click();
  await expect(lcd).toContainText('BUS INFORMATION');
  await page.clock.fastForward(3_000);
  await expect(lcd).toContainText('BUS INFORMATION');
  await recordings.click();
  await expect(lcd).toContainText('RECORDING INFORMATION');
  await expect(lcd).toContainText('2 FRAMES');
  expect(requests).toHaveLength(6);
  await page.getByRole('button', {name: 'Stop', exact: true}).click();
  await expect(page.locator('[data-control="status"]')).toContainText('Browser recording saved');
  await expect(recordings).toHaveAttribute('data-recording', 'false');
  const picker = page.locator('[data-control="sessions"]');
  const browserRecording = picker.locator('option[value^="browser:"]');
  await expect(browserRecording).toContainText('2 frames');
  await picker.selectOption(await browserRecording.getAttribute('value'));
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Export JSON'}).click();
  const download = await downloading;
  const recording = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(recording.intervalSeconds).toBe(7);
  expect(recording.frames).toHaveLength(2);
  await page.getByRole('button', {name: 'Play', exact: true}).click();
  await expect(page.locator('[data-control="frame-status"]')).toContainText('Frame 1 of 2');

  page.once('dialog', dialog => dialog.dismiss());
  await deleteButton.click();
  await expect(browserRecording).toHaveCount(1);
  await expect(page.locator('[data-control="timeline"]')).toBeEnabled();
  page.once('dialog', dialog => dialog.accept());
  await deleteButton.click();
  await expect(page.locator('[data-control="status"]')).toHaveText('Browser recordings deleted.');
  await expect(browserRecording).toHaveCount(0);
  await expect(picker.locator('option')).toHaveText(/Background/);
  await expect(page.locator('[data-control="timeline"]')).toBeDisabled();

  await page.getByRole('button', {name: 'Record', exact: true}).click();
  await expect(page.locator('[data-control="capture-status"]')).toContainText('1 frame');
  const otherTab = await context.newPage();
  await otherTab.emulateMedia({reducedMotion: 'reduce'});
  await otherTab.goto('http://localhost/');
  await otherTab.getByRole('button', {name: 'Enter dashboard'}).click();
  await otherTab.getByRole('button', {name: 'Recorder', exact: true}).click();
  otherTab.once('dialog', dialog => dialog.accept());
  await otherTab.getByRole('button', {name: 'Delete all browser recordings'}).click();
  await expect(otherTab.locator('[data-control="status"]')).toHaveText('Browser recordings deleted.');
  await otherTab.close();
  await page.clock.fastForward(8_000);
  await expect(page.locator('[data-control="status"]')).toContainText('This browser recording was deleted.');

  const counts = await page.evaluate(() => new Promise((resolve, reject) => {
    const request = indexedDB.open('adelaide-metro-recordings');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(['sessions', 'frames'], 'readonly');
      const sessions = tx.objectStore('sessions').count();
      const frames = tx.objectStore('frames').count();
      tx.oncomplete = () => {
        db.close();
        resolve([sessions.result, frames.result]);
      };
      tx.onabort = () => reject(tx.error);
    };
  }));
  expect(counts).toEqual([0, 0]);
  expect([...backgroundMethods]).toEqual(['GET']);
});

test('refreshes the live view from background recordings during playback', async ({page}) => {
  const time = Date.UTC(2026, 10, 18);
  await page.clock.install({time: new Date(time)});
  await page.emulateMedia({reducedMotion: 'reduce'});
  const id = 'background-fixture';
  const bus = {VehicleID: 'recorded-bus', VehicleType: 'Bus', RouteID: '100'};
  const firstFrame = {
    time,
    feeds: {
      vehicle_positions: {time, rows: [bus]},
      trip_updates: {time, rows: [{TripID: 'live-trip', RouteID: '100'}]},
      service_alerts: {time, rows: []}
    }
  };
  let latestFrame;
  let directFeedRequests = 0;
  await page.route('https://gtfs.adelaidemetro.com.au/**', route => {
    directFeedRequests++;
    return route.abort();
  });
  await page.route(url => url.hostname === 'localhost' && url.pathname === '/api/recordings', route => {
    if (route.request().method() === 'POST') {
      latestFrame = firstFrame;
      return route.fulfill({status: 201, json: {id}});
    }
    const after = new URL(route.request().url()).searchParams.get('after');
    return route.fulfill({json: {
      activeId: latestFrame ? id : null,
      sessions: latestFrame ? [{id, mode: 'background', startedAt: time, intervalSeconds: 30,
        frameCount: latestFrame.time === time ? 1 : 2}] : [],
      ...(latestFrame?.time > Number(after) && {latestFrame})
    }});
  });
  await page.route('**/api/recordings/' + id + '/stop', route => {
    const stopped = latestFrame;
    latestFrame = undefined;
    return route.fulfill({json: {id, latestFrame: stopped}});
  });
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  const recordings = page.getByRole('button', {name: 'Recorder', exact: true});
  await recordings.click();
  await page.getByRole('combobox', {name: 'Recording source'}).selectOption('background');
  await page.getByRole('button', {name: 'Record', exact: true}).click();
  await expect(recordings).toHaveAttribute('data-recording', 'true');
  await expect(page.locator('#lcdReadable')).toContainText('BACKGROUND RECORDING · 1 FRAME');
  await expect(page.locator('#sourceDescription')).toContainText('Live GTFS-Realtime');
  await expect(page.locator('#countVehicles')).toHaveText('1');

  const emptyFeed = {time, raw: 'CgEw', rows: []};
  const playback = {version: 1, startedAt: time, frames: [{time, feeds: {
    vehicle_positions: emptyFeed, trip_updates: emptyFeed, service_alerts: emptyFeed
  }}]};
  await page.locator('[data-control="file"]').setInputFiles({
    name: 'recording.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(playback))
  });
  await expect(page.locator('#sourceDescription')).toContainText('Recording');
  const nextTime = time + 30_000;
  latestFrame = {time: nextTime, feeds: {
    vehicle_positions: {time: nextTime, rows: [bus, {...bus, VehicleID: 'second-bus'}]},
    trip_updates: {time: nextTime, error: 'Fixture outage'},
    service_alerts: {time: nextTime, rows: []}
  }};
  await page.clock.fastForward(30_000);
  await expect(page.locator('#refreshStatus')).toContainText('Fixture outage');
  await expect(page.locator('#sourceDescription')).toContainText('Recording');
  await expect(page.locator('#countVehicles')).toHaveText('0');
  await page.getByRole('button', {name: 'Stop', exact: true}).click();
  await expect(page.locator('#countVehicles')).toHaveText('2');
  await expect(page.locator('#countTrips')).toHaveText('1');
  await expect(page.locator('#lcdReadable')).toContainText('BACKGROUND RECORDING · 2 FRAMES');
  await page.getByRole('button', {name: 'Stop', exact: true}).click();
  await expect(recordings).toHaveAttribute('data-recording', 'false');
  expect(directFeedRequests).toBe(0);
});

test('starts the larger ticker from the centre and supports dragging to rewind', async ({page}) => {
  const time = new Date('2026-11-18T00:00:00Z');
  await page.clock.install({time});
  await page.clock.pauseAt(new Date(time.getTime() + 1000));
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  await expect(page.locator('.pane-caption, .hero-filter-info')).toHaveCount(0);
  await page.getByRole('button', {name: 'Vehicles', exact: true}).click();
  const vehicle = page.locator('#vehicleTable tbody tr.selectable').first();
  await vehicle.click();
  const announcement = page.locator('#selectionAnnouncement');
  await expect(announcement).toHaveText(/^(Bus|Train|Tram|Vehicle) information: Route .+ · Vehicle .+ · /);
  await expect(announcement).toContainText('06/08/2026 12:26pm');
  const tickerImage = () => page.locator('.lcd-canvas').evaluate(canvas => canvas.toDataURL());
  const tickerState = () => page.evaluate(() => window.MetroTicker.debugState());
  const panel = await page.locator('.ticker-window').boundingBox();
  expect(panel.height).toBeCloseTo(67.5, 1);
  const initial = await tickerState();
  expect(initial.pitch).toBeCloseTo(5);
  const inset = await page.locator('.lcd-canvas').evaluate(canvas => {
    const context = canvas.getContext('2d');
    const colour = parseInt(context.fillStyle.slice(1), 16);
    const [red, green, blue] = [colour >> 16, (colour >> 8) & 255, colour & 255];
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let firstLitColumn = canvas.width;
    for (let index = 0; index < rgba.length; index += 4) {
      if (rgba[index] === red && rgba[index + 1] === green && rgba[index + 2] === blue) {
        firstLitColumn = Math.min(firstLitColumn, index / 4 % canvas.width);
      }
    }
    return Math.abs(firstLitColumn - canvas.width / 2);
  });
  expect(inset).toBeLessThan(initial.pitch + 1);
  const start = await tickerImage();
  await page.clock.runFor(380);
  expect((await tickerState()).scrollColumn).toBe(initial.scrollColumn);
  expect(await tickerImage()).not.toBe(start);
  await page.clock.runFor(620);
  const moving = await tickerState();
  expect((moving.scrollColumn - initial.scrollColumn) * moving.pitch).toBeGreaterThanOrEqual(54);
  await page.evaluate(() => window.MetroApp.setHeaderVehicleFilter('all'));
  expect((await tickerState()).scrollColumn).toBe(moving.scrollColumn);
  const grabX = panel.x + panel.width * 0.3;
  const grabY = panel.y + panel.height * 0.8;
  await page.mouse.move(grabX, grabY);
  await page.mouse.down();
  await page.mouse.move(grabX + 35, grabY + panel.height);
  const rewound = await tickerState();
  expect(rewound.scrollColumn).toBe(moving.scrollColumn - 7);
  await page.clock.runFor(800);
  expect((await tickerState()).scrollColumn).toBe(rewound.scrollColumn);
  await page.mouse.up();
  await page.clock.runFor(800);
  expect((await tickerState()).scrollColumn).toBeGreaterThan(rewound.scrollColumn);
  await vehicle.click();
  expect((await tickerState()).scrollColumn).toBe(initial.scrollColumn);
});

test('map selection shows a ring and bearing arrow and announces stop and route information', async ({page}) => {
  const novaUrl = 'https://cdn.arcgis.com/sharing/rest/content/items/1237385e55d9487489fe2a21766b43bb/resources/styles/root.json';
  const vectorService = 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer';
  const novaStyleReady = Promise.withResolvers();
  await page.route(novaUrl, async route => {
    await novaStyleReady.promise;
    await route.fulfill({json: {
      version: 8, sprite: '../sprites/sprite', glyphs: '../fonts/{fontstack}/{range}.pbf',
      sources: {esri: {type: 'vector', url: vectorService}},
      layers: [
        {id: 'Nova background', type: 'background', paint: {'background-color': '#161f44'}},
        {id: 'Place label', type: 'symbol', source: 'esri', 'source-layer': 'Places',
          layout: {'text-field': ['get', 'name']}}
      ]
    }});
  });
  await page.route('**/stop-details.json', route => route.fulfill({
    json: {'6669': {name: 'Belair Railway Station', code: '16494', modes: ['train']}}
  }));
  const paths = [[138.55, -34.9], [138.65, -34.85]];
  const stop = [138.64, -35.022];
  await page.route('**/Adelaide_Metro_GTFS_Stops.geojson', route => route.fulfill({json: {
    type: 'FeatureCollection',
    features: [{type: 'Feature', properties: {GStopID: '6669'}, geometry: {type: 'Point', coordinates: stop}}]
  }}));
  await page.route('**/route-index.json', route => route.fulfill({json: {
    trips: {},
    shapes: {shape: paths},
    routes: {'100': {0: ['shape']}, '224': {0: ['shape']}, 'J1': {0: ['shape']}},
    modes: {'100': 'bus', '224': 'bus', 'J1': 'obahn'}
  }}));
  await page.goto('http://localhost/');
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  const report = await page.getByRole('complementary', {name: 'Realtime report panels'}).boundingBox();
  const mapPane = page.getByRole('region', {name: 'Vehicle map'});
  const mapBounds = await mapPane.boundingBox();
  expect(report.x).toBeGreaterThanOrEqual(mapBounds.x + mapBounds.width);
  const clearSelection = mapPane.getByRole('button', {name: 'Clear selection'});
  await expect(clearSelection).toBeDisabled();
  const waitingForStyle = await page.evaluate(() => {
    class NavigationControlFixture {
      onAdd() {
        const controls = document.createElement('div');
        controls.className = 'maplibregl-ctrl-group';
        controls.style.cssText = 'position:absolute;top:10px;right:10px';
        for (const label of ['Zoom in', 'Zoom out']) {
          const button = document.createElement('button');
          button.setAttribute('aria-label', label);
          button.textContent = label === 'Zoom in' ? '+' : '−';
          button.title = label;
          controls.append(button);
        }
        return controls;
      }
    }
    class BoundsFixture {
      points = [];
      extend(point) { this.points.push(point); }
      isEmpty() { return this.points.length === 0; }
    }
    class MapFixture {
      constructor({style}) {
        window.testMap = this;
        this.setStyle(style);
        this.zoomLevel = 15.8;
        this.pitch = 0;
        this.homeMoves = 0;
      }
      setStyle(style) {
        this.style = style;
        this.layers = style.layers;
        this.sources = new Map();
        for (const [id, source] of Object.entries(style.sources)) this.addSource(id, source);
        this.selection = this.getSource('vehicleSelection');
        this['style.load']?.();
      }
      addControl(control, position) {
        const group = control.onAdd?.(this);
        if (group) {
          group.dataset.position = position;
          this.getCanvas().append(group);
        }
      }
      on(event, handler) { this[event] = handler; }
      getCanvas() { return document.querySelector('#map'); }
      flyTo() {}
      fitBounds(bounds, options) {
        if (typeof options.padding === 'number') this.homeMoves++;
        this.fitPoints = bounds.points;
      }
      easeTo({pitch}) { this.pitch = pitch; this.pitchend(); }
      getPitch() { return this.pitch; }
      getZoom() { return this.zoomLevel; }
      addSource(id, source) { this.sources.set(id, {...source, setData(data) { this.data = data; }}); }
      getSource(id) { return this.sources.get(id); }
      getLayer(id) { return this.layers.find(layer => layer.id === id); }
      addLayer(layer) { this.layers.push(layer); }
      getLayoutProperty(id, property) { return this.getLayer(id).layout?.[property]; }
      setLayoutProperty(id, property, value) {
        const layer = this.getLayer(id);
        layer.layout ??= {};
        layer.layout[property] = value;
      }
      getStyle() { return {layers: [this.feature.layer]}; }
      setPaintProperty(id, property, value) { this.getLayer(id).paint[property] = value; }
      setFilter(id, filter) { this.getLayer(id).filter = filter; }
      queryRenderedFeatures() { return [this.feature]; }
    }
    window.maplibregl = {Map: MapFixture, LngLatBounds: BoundsFixture,
      NavigationControl: NavigationControlFixture, AttributionControl: class {}};
    window.MetroApp.upgradeMap();
    return window.MetroApp.debugState();
  });
  novaStyleReady.resolve();
  expect(waitingForStyle).toMatchObject({basemap: 'nova', loadedMap: false});
  await expect.poll(() => page.evaluate(() => window.MetroApp.debugState()))
    .toMatchObject({basemap: 'nova', loadedMap: true});
  await expect(page.locator('#debugLogWindow')).not.toHaveValue(/MapLibre initialization failed/);
  await page.evaluate(() => window.testMap['style.load']());
  const mapNavigation = mapPane.locator('.maplibregl-ctrl-group[data-position="top-right"]');
  const zoomIn = mapNavigation.getByRole('button', {name: 'Zoom in'});
  await expect(zoomIn).toHaveAttribute('data-tooltip', 'Zoom in');
  await expect(page.locator('[title]')).toHaveCount(0);
  await expect(zoomIn).toHaveCSS('height', '58px');
  await expect(zoomIn).toHaveCSS('width', '58px');
  await expect(mapNavigation.getByRole('button', {name: 'Zoom out'})).toBeAttached();
  const home = mapNavigation.getByRole('button', {name: 'Home'});
  await expect(home).toBeVisible();
  await expect(mapNavigation.getByRole('button', {name: 'Clear selection'})).toBeDisabled();
  await expect(mapNavigation.getByRole('button', {name: 'Vehicle layers'})).toBeVisible();
  const basemap = mapNavigation.getByRole('button', {name: 'Basemap'});
  const labels = mapNavigation.getByRole('button', {name: 'Map labels'});
  const fit = mapNavigation.getByRole('button', {name: 'Fit map'});
  const view = mapNavigation.getByRole('button', {name: '3D view'});
  await expect(labels.locator('.map-label-icon')).toHaveCSS('clip-path', /polygon/);
  await expect(labels).toHaveText('');
  await view.click();
  expect(await page.evaluate(() => window.testMap.pitch)).toBe(55);
  await expect(view).toHaveAttribute('aria-pressed', 'true');
  await expect(view).toHaveText('2D');
  await view.click();
  expect(await page.evaluate(() => window.testMap.pitch)).toBe(0);
  await expect(view).toHaveAttribute('aria-pressed', 'false');
  const labelVisibility = id => page.evaluate(layer => window.testMap.getLayer(layer)?.layout?.visibility, id);
  await expect(labels).toHaveAttribute('aria-pressed', 'false');
  expect(await labelVisibility('route-labels')).toBe('none');
  await labels.click();
  await expect(labels).toHaveAttribute('aria-pressed', 'true');
  expect(await labelVisibility('route-labels')).toBe('visible');
  await labels.click();
  await expect(labels).toHaveAttribute('aria-pressed', 'false');
  expect(await labelVisibility('route-labels')).toBe('none');
  await basemap.click();
  const darkCanvas = mapPane.getByRole('button', {name: 'Esri Dark Gray Canvas'});
  await darkCanvas.click();
  await expect(darkCanvas).toHaveAttribute('aria-pressed', 'true');
  const darkTiles = await page.evaluate(() => [
    window.testMap.getSource('basemap').tiles[0],
    window.testMap.getSource('basemapLabels').tiles[0]
  ]);
  expect(darkTiles[0]).toMatch(/\/Canvas\/World_Dark_Gray_Base\/MapServer\/tile\//);
  expect(darkTiles[1]).toMatch(/\/Canvas\/World_Dark_Gray_Reference\/MapServer\/tile\//);
  expect(await labelVisibility('basemap-labels')).toBe('none');
  expect(await labelVisibility('route-labels')).toBe('none');
  const annotations = mapPane.getByRole('button', {name: 'Basemap annotations'});
  await expect(annotations).toHaveAttribute('aria-pressed', 'false');
  await annotations.click();
  expect(await labelVisibility('basemap-labels')).toBe('visible');
  expect(await labelVisibility('route-labels')).toBe('none');
  await annotations.click();
  const nova = mapPane.getByRole('button', {name: 'Esri Nova'});
  await nova.click();
  await expect(nova).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => window.testMap.getSource('esri').tiles[0]))
    .toBe(vectorService + '/tile/{z}/{y}/{x}.pbf');
  expect(await page.evaluate(() => window.testMap.style.glyphs)).toContain('/fonts/{fontstack}/{range}.pbf');
  expect(await labelVisibility('Place label')).toBe('none');
  await page.keyboard.press('Escape');
  await labels.click();
  await expect(labels).toHaveAttribute('aria-pressed', 'true');
  expect(await labelVisibility('route-labels')).toBe('visible');
  expect(await labelVisibility('Place label')).toBe('none');
  await basemap.click();
  await annotations.click();
  expect(await labelVisibility('Place label')).toBe('visible');
  await page.keyboard.press('Escape');
  await expect(mapNavigation.getByRole('button', {name: 'Refresh latest feeds'})).toBeVisible();
  await mapNavigation.getByRole('button', {name: 'Network layers'}).click();
  await mapPane.getByRole('checkbox', {name: 'Bus routes', exact: true}).check();
  await mapPane.getByRole('checkbox', {name: 'O-Bahn bus routes'}).check();
  await mapPane.getByRole('checkbox', {name: 'Stops', exact: true}).check();
  await expect.poll(() => page.evaluate(() => window.testMap.getLayer('network-routes-obahn')?.paint['line-color']))
    .toEqual(['to-color', ['get', 'colour'], '#d89018']);
  expect(await page.evaluate(() => {
    const {features} = window.testMap.getSource('network-indexed-routes').data;
    return Object.fromEntries(features.map(({properties}) => [properties.route, properties.colour]));
  })).toEqual({'100': '#243E8C', '224': '#633293', J1: '#F99D1E'});
  await expect.poll(() => page.evaluate(() => !!window.testMap.getLayer('network-stops'))).toBe(true);
  await page.keyboard.press('Escape');
  const fitPoints = () => page.evaluate(() => window.testMap.fitPoints);
  await fit.click();
  expect(await fitPoints()).toEqual(expect.arrayContaining([...paths, stop]));
  expect((await fitPoints()).length).toBeGreaterThan(paths.length + 1);
  const clickFeature = feature => page.evaluate(async target => {
    window.testMap.feature = target;
    await window.testMap.click({point: {x: 10, y: 10}});
  }, feature);
  const announcement = page.locator('#selectionAnnouncement');
  const tickerColour = () => page.locator('.lcd-canvas').evaluate(canvas => canvas.getContext('2d').fillStyle);
  const haloColor = () => page.evaluate(() => window.testMap.getLayer('vehicle-halos').paint['circle-color']);
  const colors = ['match', ['get', 'VehicleType'], 'Bus', '#4c9c2e', 'Tram', '#eb2127', 'Train', '#0082ca', '#808080'];
  const busLogo = page.locator('.vehicle-sprite[data-filter="Bus"]');
  await expect(busLogo).toHaveCSS('--vehicle-halo', '#4c9c2e');
  expect(await haloColor()).toEqual(colors);
  await page.evaluate(() => window.MetroApp.setHeaderVehicleFilter('Bus'));
  const bus = {
    VehicleID: 'test-bus', VehicleType: 'Bus', RouteID: '100', Longitude: 138.6, Latitude: -34.9,
    PositionTimestamp: '2026-03-21T22:30:00Z'
  };
  await clickFeature({layer: {id: 'vehicles-circle'}, properties: {...bus, Bearing: 90}});
  await expect(busLogo).toHaveCSS('--vehicle-halo', '#fcb12e');
  expect(await haloColor()).toEqual(['case', ['==', ['get', 'VehicleKey'], 'test-bus'], '#fcb12e', colors]);
  await expect(announcement).toHaveText(/^Bus information: Route 100/);
  await expect.poll(tickerColour).toBe('#88db66');
  await expect(page.locator('#lcdReadable')).toContainText('22/03/2026 9:00am');
  await fit.click();
  expect(await fitPoints()).toEqual([[bus.Longitude, bus.Latitude]]);
  await expect(page.locator('.maplibregl-popup')).toHaveCount(0);
  const selection = () => page.evaluate(() => window.testMap.selection.data.features.map(feature => feature.geometry));
  const [point, arrow] = await selection();
  expect(point.type).toBe('Point');
  expect(arrow.type).toBe('Polygon');
  const ring = await page.evaluate(() => window.testMap.getLayer('vehicle-ring'));
  expect(ring.paint['circle-stroke-color']).toBe('#fcb12e');
  expect(ring.paint['circle-stroke-width']).toBeGreaterThan(3);
  expect(ring.filter).toContainEqual(['==', ['geometry-type'], 'Point']);
  const [lon, lat] = point.coordinates;
  const [east, eastLat] = arrow.coordinates[0][3];
  expect(east).toBeGreaterThan(lon);
  expect(eastLat).toBeCloseTo(lat, 6);
  await page.evaluate(() => {
    window.testMap.zoomLevel -= 2;
    window.testMap.zoom();
  });
  const zoomedEast = (await selection())[1].coordinates[0][3][0];
  expect(zoomedEast - lon).toBeCloseTo(4 * (east - lon), 8);
  await clickFeature({layer: {id: 'vehicles-circle'}, properties: {...bus, Bearing: 0}});
  const [northLon, north] = (await selection())[1].coordinates[0][3];
  expect(northLon).toBeCloseTo(lon, 6);
  expect(north).toBeGreaterThan(lat);
  await clickFeature({layer: {id: 'vehicles-circle'}, properties: bus});
  expect((await selection()).map(geometry => geometry.type)).toEqual(['Point']);
  await clearSelection.click();
  await expect(announcement).toHaveText('Selection cleared');
  await expect.poll(tickerColour).toBe('#ffd05e');
  await expect(clearSelection).toBeDisabled();
  expect(await selection()).toHaveLength(0);
  expect(await page.evaluate(() => window.testMap.homeMoves)).toBe(0);
  await clickFeature({layer: {id: 'network-stops'}, properties: {GStopID: '6669'}, geometry: {type: 'Point', coordinates: stop}});
  await expect(announcement).toHaveText('Train stop information: Belair Railway Station · Stop code 16494');
  await expect.poll(tickerColour).toBe('#69c9ff');
  expect(await haloColor()).toEqual(colors);
  expect(await selection()).toHaveLength(0);
  await fit.click();
  expect(await fitPoints()).toEqual([stop]);
  await clickFeature({layer: {id: 'network-routes-obahn'}, properties: {mode: 'obahn', route: 'J1', name: 'Elizabeth to Airport'},
    geometry: {type: 'LineString', coordinates: [[138.56, -34.88], [138.57, -34.87]]}});
  await expect(announcement).toHaveText('O-Bahn bus route information: Route J1 · Elizabeth to Airport');
  await expect.poll(tickerColour).toBe('#88db66');
  await fit.click();
  expect(await fitPoints()).toEqual(paths);
  await clearSelection.click();
  await expect(announcement).toHaveText('Selection cleared');
  await expect(clearSelection).toBeDisabled();
  await home.click();
  expect(await page.evaluate(() => window.testMap.homeMoves)).toBe(1);
  await clickFeature({layer: {id: 'vehicles-circle'}, properties: {...bus, VehicleID: 'test-tram', VehicleType: 'Tram', RouteID: 'GLNELG'}});
  await expect(announcement).toHaveText(/^Tram information: Route GLNELG/);
  await expect.poll(tickerColour).toBe('#ff6b72');
});

test('loads the saved snapshot when the dashboard opens', async ({page}) => {
  await page.route('**/startup-snapshot.json', route => route.fulfill({
    json: {
      capturedAt: '2026-11-18T01:00:00Z',
      vehicles: [{VehicleID: 'saved-1', VehicleType: 'Bus', RouteID: 'J1'}, {VehicleID: 'unknown', VehicleType: 'Unknown'}],
      trips: [{TripID: 'saved-trip', RouteID: '224'}],
      alerts: [{RouteIDs: '100;224;J1', HeaderText: 'Detour'}]
    }
  }));
  await page.goto('http://localhost/');
  await expect(page.locator('#sourceDescription')).toContainText('Saved startup snapshot captured');
  await expect(page.locator('#countVehicles')).toHaveText('1');
  await expect(page.locator('#countTrips')).toHaveText('1');
  await expect(page.locator('[data-vehicle-toggle]')).toHaveCount(3);
  await expect(page.locator('#countUnknown')).toHaveCount(0);
  await page.getByRole('button', {name: 'Enter dashboard'}).click();
  await page.getByRole('button', {name: 'Vehicles', exact: true}).click();
  const vehicleRoute = page.locator('#vehicleTable .route-pill');
  await expect(vehicleRoute).toHaveText('J1');
  await expect(vehicleRoute).toHaveCSS('--route-accent', '#F99D1E');
  await page.getByRole('button', {name: 'Trip Updates', exact: true}).click();
  const tripRoute = page.locator('#tripTable .route-pill');
  await expect(tripRoute).toHaveText('224');
  await expect(tripRoute).toHaveCSS('--route-accent', '#633293');
  await page.getByRole('button', {name: 'Service Alerts', exact: true}).click();
  const alertRoutes = page.locator('#alertList .route-pill');
  await expect(alertRoutes).toHaveText(['100', '224', 'J1']);
  await expect(alertRoutes.first()).toHaveCSS('--route-accent', '#243E8C');
  await expect(alertRoutes.nth(1)).toHaveCSS('--route-accent', '#633293');
  await expect(alertRoutes.last()).toHaveCSS('--route-accent', '#F99D1E');
});
