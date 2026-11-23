/* Sun dome adapted from the supplied ShadowTime Solar Observatory. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const radians = Math.PI / 180;
  const deg = angle => angle / radians;
  const rad = angle => angle * radians;
  const bearing = angle => ((angle % 360) + 360) % 360;
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
  const finite = value => value != null && value !== '' && Number.isFinite(Number(value));
  const adelaideClock = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Adelaide', timeZoneName: 'shortOffset'
  });

  function sunPosition(utc, latitude, longitude) {
    // Geometric solar coordinates used by ShadowTime. Atmospheric refraction is excluded.
    const t = (utc.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
    const meanLongitude = bearing(280.46646 + t * (36000.76983 + t * .0003032));
    const anomaly = rad(bearing(357.52911 + t * (35999.05029 - .0001537 * t)));
    const eccentricity = .016708634 - t * (.000042037 + .0000001267 * t);
    const centre = Math.sin(anomaly) * (1.914602 - t * (.004817 + .000014 * t))
      + Math.sin(2 * anomaly) * (.019993 - .000101 * t) + Math.sin(3 * anomaly) * .000289;
    const omega = rad(125.04 - 1934.136 * t);
    const apparentLongitude = rad(meanLongitude + centre - .00569 - .00478 * Math.sin(omega));
    const meanObliquity = 23 + (26 + (21.448 - t * (46.815 + t * (.00059 - t * .001813))) / 60) / 60;
    const obliquity = rad(meanObliquity + .00256 * Math.cos(omega));
    const declination = Math.asin(Math.sin(obliquity) * Math.sin(apparentLongitude));
    const l = rad(meanLongitude);
    const y = Math.tan(obliquity / 2) ** 2;
    const equationOfTime = 4 * deg(y * Math.sin(2 * l) - 2 * eccentricity * Math.sin(anomaly)
      + 4 * eccentricity * y * Math.sin(anomaly) * Math.cos(2 * l) - .5 * y * y * Math.sin(4 * l)
      - 1.25 * eccentricity * eccentricity * Math.sin(2 * anomaly));
    const minute = utc.getUTCHours() * 60 + utc.getUTCMinutes() + utc.getUTCSeconds() / 60;
    const hourAngle = rad((minute + equationOfTime + 4 * longitude + 4320) % 1440 / 4 - 180);
    const lat = rad(latitude);
    const zenith = Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
    const azimuth = Math.atan2(Math.sin(hourAngle), Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat));
    return { azimuth: bearing(deg(azimuth) + 180), altitude: 90 - deg(Math.acos(clamp(zenith, -1, 1))) };
  }

  function parseUTC(value) {
    if (!value) return NaN;
    return Date.parse(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value : value + 'Z');
  }

  function adelaideOffset(date) {
    const noon = new Date(`${date}T02:00:00Z`);
    if (!Number.isFinite(noon.getTime())) return 9.5;
    const offset = adelaideClock.formatToParts(noon).find(part => part.type === 'timeZoneName')?.value;
    const match = offset?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);
    return match ? (match[1] === '-' ? -1 : 1) * (Number(match[2]) + Number(match[3] || 0) / 60) : 9.5;
  }

  function captureOffset(frame) {
    if (finite(frame.utc_offset_hours)) return Number(frame.utc_offset_hours);
    const offset = (parseUTC(frame.local_datetime) - parseUTC(frame.utc_datetime)) / 3600000;
    return Math.abs(offset) <= 14 ? offset : adelaideOffset(frame.date);
  }

  function captureSun(frame, latitude, longitude) {
    if (finite(frame.solar_azimuth_deg) && finite(frame.solar_altitude_deg)) {
      return { azimuth: bearing(Number(frame.solar_azimuth_deg)), altitude: Number(frame.solar_altitude_deg), recorded: true };
    }
    const utc = parseUTC(frame.utc_datetime);
    const instant = Number.isFinite(utc) ? utc : parseUTC(frame.local_datetime) - captureOffset(frame) * 3600000;
    return Number.isFinite(instant) ? sunPosition(new Date(instant), latitude, longitude) : null;
  }

  function dayPath(date, offset, latitude, longitude) {
    const start = Date.parse(`${date}T00:00:00Z`) - offset * 3600000;
    if (!Number.isFinite(start)) return [];
    const points = [];
    for (let minute = 0; minute <= 1440; minute += 5) {
      const sun = sunPosition(new Date(start + minute * 60000), latitude, longitude);
      if (sun.altitude >= 0) points.push(sun);
    }
    return points;
  }

  function footprintCentre(frame) {
    const corners = frame.tiles.flatMap(tile => tile.coordinates);
    const longitude = corners.map(point => point[0]);
    const latitude = corners.map(point => point[1]);
    return [(Math.min(...latitude) + Math.max(...latitude)) / 2, (Math.min(...longitude) + Math.max(...longitude)) / 2];
  }

  function svg(parent, tag, attributes = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    parent.append(element);
    return element;
  }

  function create({ onSelectFrame }) {
    const dome = $('solarDome');
    const seasons = $('showSeasons');
    const reset = $('resetDome');
    let yaw = 145;
    let tilt = 38;
    let drag = null;
    let frames = [];
    let selected = 0;
    let currentSun = null;
    let pathKey = '';
    let path = [];
    let seasonPaths = [];
    let markers = new Map();
    let sunGroup;

    function project({ azimuth, altitude }) {
      const a = rad(azimuth);
      const h = rad(altitude);
      const view = rad(yaw);
      const inclination = rad(tilt);
      const east = Math.sin(a) * Math.cos(h);
      const north = Math.cos(a) * Math.cos(h);
      const right = east * Math.cos(view) - north * Math.sin(view);
      const depth = east * Math.sin(view) + north * Math.cos(view);
      return [170 + 111 * right, 151 + 111 * (depth * Math.sin(inclination) - Math.sin(h) * Math.cos(inclination))];
    }

    function line(parent, points, className) {
      if (!points.length) return;
      const d = points.map((point, index) => {
        const [x, y] = project(point);
        return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' ');
      svg(parent, 'path', { d, class: className, fill: 'none' });
    }

    function updateSun() {
      if (!sunGroup) return;
      for (const [index, marker] of markers) {
        const active = index === selected;
        marker.classList.toggle('is-selected', active);
        marker.setAttribute('aria-pressed', String(active));
      }
      sunGroup.replaceChildren();
      if (!currentSun) return;
      const [cx, cy] = project(currentSun);
      line(sunGroup, [{ azimuth: currentSun.azimuth, altitude: 0 }, currentSun], 'solar-sun-vector');
      svg(sunGroup, 'circle', { cx, cy, r: 24, fill: 'url(#solar-sun-glow)' });
      svg(sunGroup, 'circle', { cx, cy, r: 7, class: 'solar-sun-disc' });
      svg(sunGroup, 'circle', { cx, cy, r: 3, class: 'solar-sun-core' });
    }

    function draw() {
      if (!frames.length) return;
      const focusedIndex = Number(document.activeElement?.dataset.captureIndex);
      dome.replaceChildren();
      markers = new Map();
      const defs = svg(dome, 'defs');
      const glow = svg(defs, 'radialGradient', { id: 'solar-sun-glow' });
      svg(glow, 'stop', { offset: '0%', 'stop-color': '#fff3bd', 'stop-opacity': '.9' });
      svg(glow, 'stop', { offset: '100%', 'stop-color': '#ffbc54', 'stop-opacity': '0' });

      const grid = svg(dome, 'g', { 'aria-hidden': 'true' });
      for (const altitude of [0, 20, 40, 60]) {
        const points = Array.from({ length: 73 }, (_, i) => ({ azimuth: i * 5, altitude }));
        line(grid, points, altitude ? 'solar-grid-line' : 'solar-horizon');
      }
      for (let azimuth = 0; azimuth < 360; azimuth += 30) {
        const points = Array.from({ length: 19 }, (_, i) => ({ azimuth, altitude: i * 5 }));
        line(grid, points, 'solar-grid-line');
      }
      for (const [azimuth, label] of [[0, 'N'], [90, 'E'], [180, 'S'], [270, 'W']]) {
        const [x, y] = project({ azimuth, altitude: 0 });
        svg(grid, 'text', { x, y: y + 4, 'text-anchor': 'middle', class: 'solar-cardinal' }).textContent = label;
      }
      if (seasons.checked) {
        for (const [name, points] of seasonPaths) line(grid, points, `solar-season solar-season-${name}`);
      }
      line(grid, path, 'solar-current-path');

      const captureGroup = svg(dome, 'g');
      const { date } = frames[selected];
      const [latitude, longitude] = footprintCentre(frames[selected]);
      frames.forEach((frame, index) => {
        if (frame.date !== date) return;
        const sun = captureSun(frame, latitude, longitude);
        if (!sun) return;
        const [cx, cy] = project(sun);
        const captureLabel = `Select capture at ${frame.time}`;
        const marker = svg(captureGroup, 'circle', {
          cx, cy, r: 7, tabindex: 0, role: 'button', class: 'solar-capture-marker',
          'aria-label': captureLabel, 'data-tooltip': captureLabel, 'data-capture-index': index
        });
        marker.addEventListener('click', () => onSelectFrame(index));
        marker.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          onSelectFrame(index);
        });
        markers.set(index, marker);
      });
      sunGroup = svg(dome, 'g', { class: 'solar-sun', 'aria-hidden': 'true' });
      $('domeDirection').textContent = `View ${Math.round(yaw)}° · tilt ${Math.round(tilt)}°`;
      updateSun();
      if (Number.isInteger(focusedIndex)) (markers.get(focusedIndex) ?? dome).focus({ preventScroll: true });
    }

    function render(nextFrames, index) {
      const frame = nextFrames[index];
      $('solarData').hidden = reset.disabled = !frame;
      $('solarEmpty').hidden = Boolean(frame);
      if (!frame) return;

      const [latitude, longitude] = footprintCentre(frame);
      const offset = captureOffset(frame);
      const key = `${frame.date}|${latitude}|${longitude}|${offset}`;
      const redraw = key !== pathKey || nextFrames !== frames;
      frames = nextFrames;
      selected = index;
      currentSun = captureSun(frame, latitude, longitude);
      if (key !== pathKey) {
        pathKey = key;
        path = dayPath(frame.date, offset, latitude, longitude);
        const year = frame.date.slice(0, 4);
        seasonPaths = [['december', '12-21'], ['march', '03-20'], ['june', '06-21']].map(([name, day]) => {
          const date = `${year}-${day}`;
          const seasonOffset = offset === adelaideOffset(frame.date) ? adelaideOffset(date) : offset;
          return [name, dayPath(date, seasonOffset, latitude, longitude)];
        });
      }
      $('solarCapture').textContent = `${frame.date} · ${frame.time}`;
      $('domeAzimuth').textContent = currentSun ? `${currentSun.azimuth.toFixed(1)}°` : '—';
      $('domeAltitude').textContent = currentSun ? `${currentSun.altitude.toFixed(1)}°` : '—';
      $('solarPositionSource').textContent = currentSun?.recorded ? 'Sun position from capture metadata.'
        : currentSun ? 'Sun position calculated from capture time and location.' : 'Sun position unavailable.';
      if (redraw) draw();
      else updateSun();
    }

    dome.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.solar-capture-marker')) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, tilt };
      dome.setPointerCapture(drag.id);
      dome.classList.add('is-dragging');
    });
    dome.addEventListener('pointermove', event => {
      if (drag?.id !== event.pointerId) return;
      yaw = bearing(drag.yaw + (event.clientX - drag.x) * .65);
      tilt = clamp(drag.tilt + (event.clientY - drag.y) * .35, 12, 75);
      draw();
    });
    dome.addEventListener('lostpointercapture', () => {
      drag = null;
      dome.classList.remove('is-dragging');
    });
    dome.addEventListener('keydown', event => {
      if (event.target !== dome) return;
      const rotation = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }[event.key];
      if (!rotation) return;
      event.preventDefault();
      yaw = bearing(yaw + rotation[0]);
      tilt = clamp(tilt + rotation[1], 12, 75);
      draw();
    });
    reset.addEventListener('click', () => {
      yaw = 145;
      tilt = 38;
      draw();
    });
    seasons.addEventListener('change', () => {
      $('solarSeasonKey').hidden = !seasons.checked;
      draw();
    });

    return { render };
  }

  window.ShadowSolar = { create };
})();
