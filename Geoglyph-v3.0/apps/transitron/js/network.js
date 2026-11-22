(function () {
'use strict';

const dataFolder = './GTFS%20data/';
const historyWindow = 5 * 60 * 1000;
const palettes = {
  amber: ['#596574', '#a27832', '#f7bc4a', '#ff803d', '#ff435e'],
  blue: ['#596574', '#3560ce', '#3aa6ef', '#3ee2cb', '#ffee70']
};
const files = {
  routes: 'Adelaide_Metro_GTFS_LVEShapes.geojson',
  stops: 'Adelaide_Metro_GTFS_Stops.geojson',
  index: 'route-index.json'
};
const assets = {};
let liveFrames = [];
let playback;
let latest;
let controls;
let selectDarkBasemap;
let heatGeometry;
const routeLayers = {
  bus: {label: 'Bus routes', color: '#39852b'},
  obahn: {label: 'O-Bahn bus routes', color: '#d89018'},
  tram: {label: 'Tram routes', color: '#df4060'},
  train: {label: 'Train routes', color: '#147fc6'}
};
const busRegions = {
  '633293': 'Outer North',
  'F99D1E': 'Outer North East / O-Bahn',
  '990000': 'North–South',
  '243E8C': 'East–West',
  '4D8B3F': 'Adelaide Hills',
  '0095C8': 'Outer South',
  '90489A': 'Regional services'
};
const routeColours = typeof module !== 'undefined' && module.exports
  ? require('./route-colours.js') : window.MetroRouteColours ?? {};
const routeStyles = new Map();
for (const [hex, routes] of Object.entries(routeColours)) {
  const style = { colour: '#' + hex, region: busRegions[hex] };
  for (const route of routes) routeStyles.set(route, style);
}
let lastHeatExpression;
let recentTimer;

function routeStyle(id) {
  return routeStyles.get(String(id ?? '').trim().toUpperCase());
}

function vehicleKey(vehicle) {
  return vehicle.VehicleID || vehicle.EntityID || vehicle.TripID;
}

function delayFor(vehicle, updates) {
  const candidates = updates.filter(update =>
    (!vehicle.StartDate || !update.StartDate || String(vehicle.StartDate) === String(update.StartDate)) &&
    (!vehicle.StartTime || !update.StartTime || String(vehicle.StartTime) === String(update.StartTime)) &&
    (!vehicle.VehicleID || !update.VehicleID || String(vehicle.VehicleID) === String(update.VehicleID)));
  const exact = candidates.filter(update => vehicle.VehicleID && String(vehicle.VehicleID) === String(update.VehicleID));
  const dated = (exact.length ? exact : candidates).filter(update =>
    vehicle.StartDate && String(vehicle.StartDate) === String(update.StartDate));
  const matches = dated.length ? dated : exact.length ? exact : candidates;
  if (matches.length !== 1) return null;
  const [update] = matches;
  if (update.ScheduleRelationship === 3 || update.ScheduleRelationship === 7) return null;
  if (Number.isFinite(update.DelaySeconds)) return update.DelaySeconds;
  const stops = (update.StopTimeUpdates || []).filter(stop =>
    stop.ScheduleRelationship !== 1 && stop.ScheduleRelationship !== 2);
  let next;
  if (vehicle.CurrentStopSeq != null) {
    next = stops.filter(stop => stop.StopSequence != null && stop.StopSequence >= vehicle.CurrentStopSeq)
      .sort((a, b) => a.StopSequence - b.StopSequence)[0];
  } else if (vehicle.CurrentStopID) {
    const matchingStops = stops.filter(stop => String(stop.StopID) === String(vehicle.CurrentStopID));
    if (matchingStops.length === 1) next = matchingStops[0];
  }
  if (!next && vehicle.PositionTimestamp) {
    const at = Date.parse(vehicle.PositionTimestamp);
    next = stops.find(stop => Date.parse(stop.ArrivalTime || stop.DepartureTime) >= at);
  }
  return next?.ArrivalDelaySeconds ?? next?.DepartureDelaySeconds ?? null;
}

function punctuality(vehicles, trips) {
  const byTrip = new Map();
  for (const trip of trips) {
    if (!trip.TripID) continue;
    const id = String(trip.TripID);
    if (!byTrip.has(id)) byTrip.set(id, []);
    byTrip.get(id).push(trip);
  }
  const seen = new Set();
  const counts = { early: 0, onTime: 0, late: 0, unknown: 0 };
  for (const vehicle of vehicles) {
    const key = vehicleKey(vehicle);
    if (key && seen.has(String(key))) continue;
    if (key) seen.add(String(key));
    const delay = delayFor(vehicle, byTrip.get(String(vehicle.TripID)) || []);
    if (!Number.isFinite(delay)) counts.unknown++;
    else if (delay < -60) counts.early++;
    else if (delay > 300) counts.late++;
    else counts.onTime++;
  }
  return counts;
}

function heatCounts(frames, time, index) {
  const routes = new Map();
  for (const frame of frames) {
    if (frame.time < time - historyWindow || frame.time > time) continue;
    for (const vehicle of frame.vehicles) {
      const id = vehicleKey(vehicle);
      const route = routeId(vehicle.RouteID, index);
      if (!id || !route) continue;
      if (!routes.has(String(route))) routes.set(String(route), new Set());
      routes.get(String(route)).add(String(id));
    }
  }
  return new Map([...routes].map(([route, ids]) => [route, ids.size]));
}

function addLiveFrame(vehicles, time = Date.now()) {
  liveFrames = liveFrames.filter(frame => frame.time >= time - historyWindow - 60_000);
  liveFrames.push({ time, vehicles });
}

function setPlayback(frames, time, startedAt, interval) {
  playback = frames ? { frames, time, startedAt, interval } : undefined;
}

function own(object, key) {
  return object && Object.hasOwn(object, key) ? object[key] : undefined;
}

function routeId(route, index) {
  return own(index?.aliases, route) || route;
}

function completeHistory(frames, time, interval = 30_000) {
  const cutoff = time - historyWindow;
  const maxGap = 2 * interval;
  const times = frames.map(frame => frame.time).filter(at => at >= cutoff - maxGap && at <= time);
  if (!times.length || times[0] > cutoff + interval || times.at(-1) < time - maxGap) return false;
  return times.every((at, index) => index === 0 || at - times[index - 1] <= maxGap);
}

function snappedCoordinates(vehicle, index) {
  const lon = Number(vehicle.Longitude);
  const lat = Number(vehicle.Latitude);
  const point = [lon, lat];
  if (!index || vehicle.Longitude == null || vehicle.Latitude == null || !point.every(Number.isFinite)) return point;
  const tripShape = own(index.trips, vehicle.TripID);
  const route = own(index.routes, routeId(vehicle.RouteID, index));
  const directedShapes = own(route, vehicle.DirectionID);
  const onRoute = !vehicle.RouteID || Object.values(route || {}).some(shapes => shapes.includes(tripShape));
  const exact = onRoute && own(index.shapes, tripShape);
  const shapeIds = exact ? [tripShape] : directedShapes || [];
  const latitudeScale = 111195;
  const longitudeScale = latitudeScale * Math.cos(lat * Math.PI / 180);
  let nearest = point;
  let distanceSquared = 75 ** 2;
  for (const id of shapeIds) {
    const shape = own(index.shapes, id) || [];
    for (let i = 1; i < shape.length; i++) {
      const [lon1, lat1] = shape[i - 1];
      const [lon2, lat2] = shape[i];
      const x = (lon1 - lon) * longitudeScale;
      const y = (lat1 - lat) * latitudeScale;
      const dx = (lon2 - lon1) * longitudeScale;
      const dy = (lat2 - lat1) * latitudeScale;
      const lengthSquared = dx * dx + dy * dy;
      const t = lengthSquared ? Math.max(0, Math.min(1, -(x * dx + y * dy) / lengthSquared)) : 0;
      const candidate = (x + dx * t) ** 2 + (y + dy * t) ** 2;
      if (candidate <= distanceSquared) {
        distanceSquared = candidate;
        nearest = [lon1 + (lon2 - lon1) * t, lat1 + (lat2 - lat1) * t];
      }
    }
  }
  return nearest;
}

function coordinates(vehicle) {
  return snappedCoordinates(vehicle, controls?.snap.checked ? assets.index?.data : null);
}

function band(count) {
  if (count >= 11) return 4;
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  return count > 0 ? 1 : 0;
}

function routeGeometry(index) {
  const features = [];
  for (const [route, directions] of Object.entries(index.routes)) {
    const ids = new Set(Object.values(directions).flat());
    const coordinates = [...ids].map(id => own(index.shapes, id)).filter(Boolean);
    if (!coordinates.length) continue;
    features.push({
      type: 'Feature',
      geometry: { type: 'MultiLineString', coordinates },
      properties: {
        route,
        mode: own(index.modes, route) ?? 'other',
        name: own(index.names, route) ?? '',
        colour: routeStyle(route)?.colour ?? null
      }
    });
  }
  return { type: 'FeatureCollection', features };
}

function* visibleGeometries() {
  if (!controls) return;
  for (const [name, input] of [['routes', controls.routes], ['stops', controls.stops]]) {
    if (!input.checked) continue;
    for (const feature of assets[name]?.data?.features ?? []) yield feature.geometry;
  }
  for (const feature of heatGeometry?.features ?? []) {
    if (controls.heat.checked || controls.routeTypes[feature.properties.mode]?.checked) yield feature.geometry;
  }
}

function selectedGeometry(feature) {
  const {properties, layer, geometry} = feature;
  if (properties.route) {
    return heatGeometry?.features.find(item => item.properties.route === properties.route)?.geometry ?? geometry;
  }
  if (layer.id === 'network-routes') {
    const id = properties.ID ?? properties.OBJECTID;
    if (id != null) {
      const original = assets.routes?.data?.features.find(item =>
        (item.properties.ID ?? item.properties.OBJECTID) === id);
      return original?.geometry ?? geometry;
    }
  }
  return geometry;
}

function loadAsset(key) {
  if (assets[key]?.data || assets[key]?.loading) return;
  const entry = assets[key] = { loading: true };
  fetch(dataFolder + files[key]).then(response => {
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    return response.json();
  }).then(data => {
    if (key === 'index' ? !data.trips || !data.shapes || !data.routes : data.type !== 'FeatureCollection') {
      throw Error('Unexpected file format');
    }
    entry.data = data;
    if (key === 'index') heatGeometry = routeGeometry(data);
  }).catch(() => {
    entry.error = true;
  }).finally(() => {
    entry.loading = false;
    updateMap();
    if (key === 'index') latest?.redraw();
  });
}

function layer(map, id, data, definition, enabled, source = id) {
  if (!map.getSource('vehicles')) return false;
  if (enabled && data && !map.getLayer(id)) {
    if (!map.getSource(source)) map.addSource(source, { type: 'geojson', data });
    const before = id.startsWith('network-routes') && map.getLayer('network-heat') ? 'network-heat'
      : id !== 'network-stops' && map.getLayer('network-stops') ? 'network-stops' : 'vehicle-halos';
    map.addLayer({ id, source, ...definition }, before);
  }
  if (!map.getLayer(id)) return false;
  const visibility = enabled ? 'visible' : 'none';
  if (map.getLayoutProperty(id, 'visibility') !== visibility) map.setLayoutProperty(id, 'visibility', visibility);
  return enabled;
}

function updateMap() {
  if (!controls || !latest) return;
  const { map, state, mode } = latest;
  const typedRoutes = Object.entries(controls.routeTypes).filter(([, input]) => input.checked);
  const enabled = {
    routes: controls.routes.checked,
    stops: controls.stops.checked,
    index: controls.snap.checked || controls.heat.checked || typedRoutes.length > 0
  };
  const requested = Object.keys(enabled).filter(key => enabled[key]);
  const missing = requested.filter(key => assets[key]?.error);
  const loading = requested.filter(key => assets[key]?.loading);
  controls.retry.hidden = !missing.length;
  const notes = [];
  if (!map && requested.length) notes.push('Network layers require the interactive map.');
  if (missing.length) {
    notes.push('Unavailable: ' + missing.map(key => key === 'index' ? 'route index (run npm run build:routes)' : key).join(', ') + '.');
  }
  if (loading.length) notes.push('Loading ' + loading.map(key => key === 'index' ? 'route index' : key).join(', ') + '…');
  if (typedRoutes.length && assets.index?.data && !assets.index.data.modes) {
    notes.push('Run npm run build:routes and reload to enable route types.');
  }
  controls.status.textContent = notes.join(' ');
  controls.legend.hidden = !controls.heat.checked;
  controls.heatOptions.hidden = !controls.heat.checked;
  if (map) {
    layer(map, 'network-routes', assets.routes?.data, {
      type: 'line', paint: { 'line-color': '#4d94b0', 'line-opacity': 0.65, 'line-width': 1.5 }
    }, enabled.routes);
    for (const [mode, {color}] of Object.entries(routeLayers)) {
      const show = controls.routeTypes[mode].checked && !!assets.index?.data?.modes;
      const filter = ['==', ['get', 'mode'], mode];
      const isBus = mode === 'bus' || mode === 'obahn';
      if (isBus) {
        layer(map, 'network-routes-' + mode + '-outline', heatGeometry, {
          type: 'line', filter,
          paint: { 'line-color': '#f5f8fb', 'line-width': 4, 'line-opacity': 0.82 }
        }, show, 'network-indexed-routes');
      }
      layer(map, 'network-routes-' + mode, heatGeometry, {
        type: 'line', filter,
        paint: { 'line-color': isBus ? ['to-color', ['get', 'colour'], color] : color, 'line-width': 2.5, 'line-opacity': 0.95 }
      }, show, 'network-indexed-routes');
    }
    layer(map, 'network-stops', assets.stops?.data, {
      type: 'circle', paint: {
        'circle-color': '#a8e7ef', 'circle-stroke-color': '#173d53', 'circle-stroke-width': 1,
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 4]
      }
    }, enabled.stops);
  }
  if (!controls.heat.checked) {
    if (map?.getLayer('network-heat')) map.setLayoutProperty('network-heat', 'visibility', 'none');
    return;
  }
  const time = mode === 'playback' ? playback?.time ?? 0 : Date.now();
  const recent = controls.measure.value === 'recent';
  const frames = !recent || mode === 'snapshot' || mode === 'saved' ? [{ time, vehicles: state.vehicles }]
    : mode === 'playback' ? playback?.frames || [] : liveFrames;
  const colors = palettes[controls.palette.value];
  const cutoff = time - historyWindow;
  const enoughHistory = mode !== 'snapshot'
    && (mode !== 'playback' || playback?.startedAt <= cutoff)
    && (mode !== 'live' || frames[0]?.time <= cutoff)
    && completeHistory(frames, time, mode === 'playback' ? playback?.interval : undefined);
  controls.legendTitle.textContent = recent
    ? 'Distinct vehicles · last 5 minutes' + (enoughHistory ? '' : ' · partial history')
    : 'Distinct vehicles · current frame';
  controls.legend.querySelectorAll('i').forEach((item, index) => item.style.backgroundColor = colors[index]);
  const hadHeatLayer = map?.getLayer('network-heat');
  if (!map || !layer(map, 'network-heat', heatGeometry, {
    type: 'line', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-width': 3.5, 'line-color': colors[0] }
  }, true, 'network-indexed-routes')) return;
  const active = [...heatCounts(frames, time, assets.index.data)].filter(([route]) => own(assets.index.data.routes, route));
  const matches = active.flatMap(([route, count]) => [route, band(count)]);
  const level = matches.length ? ['match', ['get', 'route'], ...matches, 0] : 0;
  const color = matches.length ? ['match', level, 1, colors[1], 2, colors[2], 3, colors[3], 4, colors[4], colors[0]] : colors[0];
  const signature = JSON.stringify([level, color]);
  if (!hadHeatLayer || signature !== lastHeatExpression) {
    map.setLayoutProperty('network-heat', 'line-sort-key', level);
    map.setPaintProperty('network-heat', 'line-color', color);
    lastHeatExpression = signature;
  }
}

function createControls() {
  const panel = document.getElementById('networkLayersMenu');
  panel.insertAdjacentHTML('beforeend', `
<label><input type="checkbox" id="networkRoutes"> All routes (GeoJSON)</label>
${Object.entries(routeLayers).map(([mode, {label, color}]) =>
  `<label><input type="checkbox" data-route-type="${mode}"> ${mode === 'bus' ? '' : `<span class="network-route-swatch" style="background:${color}" aria-hidden="true"></span> `}${label}</label>`
).join('')}
    <details class="route-colour-key">
      <summary>Bus route colours</summary>
      <ul>${Object.entries(busRegions).map(([hex, name]) =>
        `<li><span class="network-route-swatch" style="background:#${hex}" aria-hidden="true"></span> ${name}</li>`
      ).join('')}</ul>
    </details>
    <label><input type="checkbox" id="networkStops"> Stops</label>
    <label><input type="checkbox" id="networkSnap"> Snap vehicles to routes</label>
    <label><input type="checkbox" id="networkHeat"> Route heat</label>
    <div class="network-heat-options" hidden>
      <label>Measure <select id="networkHeatMeasure"><option value="frame">Current frame</option><option value="recent">Last 5 minutes</option></select></label>
      <label>Colours <select id="networkHeatPalette"><option value="amber">Amber–red</option><option value="blue">Blue–yellow</option></select></label>
    </div>
    <p class="network-status" role="status"></p>
    <button class="tool-button" type="button" hidden>Retry data</button>`);
  const legend = document.createElement('div');
  legend.className = 'network-legend';
  legend.hidden = true;
  legend.innerHTML = `<b></b><div>${['0', '1–2', '3–5', '6–10', '11+'].map(label =>
    `<span><i></i>${label}</span>`).join('')}</div>`;
  panel.after(legend);
  const metricPanel = document.createElement('div');
  metricPanel.className = 'report-card punctuality';
  metricPanel.innerHTML = `<h2>Vehicle punctuality</h2><div class="metric-grid">
    <div class="metric"><span>Early</span><strong data-punctuality="early">0</strong></div>
    <div class="metric"><span>On time</span><strong data-punctuality="onTime">0</strong></div>
    <div class="metric"><span>Late</span><strong data-punctuality="late">0</strong></div>
    <div class="metric"><span>Unknown</span><strong data-punctuality="unknown">0</strong></div>
    </div><p>On time means up to 1 minute early or 5 minutes late.</p>`;
  document.querySelector('#tab-overview .totals').after(metricPanel);
  const id = name => document.getElementById('network' + name);
  controls = {
    routes: id('Routes'), stops: id('Stops'), snap: id('Snap'), heat: id('Heat'),
    routeTypes: Object.fromEntries([...panel.querySelectorAll('[data-route-type]')].map(input => [input.dataset.routeType, input])),
    measure: id('HeatMeasure'), palette: id('HeatPalette'), legend,
    heatOptions: panel.querySelector('.network-heat-options'), legendTitle: legend.querySelector('b'),
    retry: panel.querySelector('button'), status: panel.querySelector('p'),
    metrics: [...metricPanel.querySelectorAll('[data-punctuality]')]
  };
  panel.addEventListener('change', event => {
    if (controls.routes.checked) loadAsset('routes');
    if (controls.stops.checked) loadAsset('stops');
    if (controls.snap.checked || controls.heat.checked || Object.values(controls.routeTypes).some(input => input.checked)) loadAsset('index');
    if (event.target === controls.heat && controls.heat.checked) selectDarkBasemap();
    if (event.target === controls.snap) latest.redraw();
    clearInterval(recentTimer);
    if (controls.heat.checked && controls.measure.value === 'recent') recentTimer = setInterval(updateMap, 1000);
    updateMap();
  });
  controls.retry.addEventListener('click', () => {
    for (const key of Object.keys(files)) if (assets[key]?.error) loadAsset(key);
    updateMap();
  });
}

function render(state, mode, map, actions) {
  latest = { state, mode, map, redraw: actions.redraw };
  if (!controls) {
    selectDarkBasemap = actions.selectDarkBasemap;
    createControls();
  }
  const counts = punctuality(state.vehicles, state.trips);
  controls.metrics.forEach(element => element.textContent = counts[element.dataset.punctuality].toLocaleString('en-AU'));
  updateMap();
}

let stopDetails;
function fetchStopDetails() {
  stopDetails ??= fetch(dataFolder + 'stop-details.json').then(response => {
    if (!response.ok) throw Error('Stop details unavailable');
    return response.json();
  }).catch(() => {
    stopDetails = null;
    return {};
  });
  return stopDetails;
}

async function featureInformation(feature) {
  const properties = feature.properties;
  if (feature.layer.id === 'network-stops') {
    const id = properties.GStopID;
    const stop = own(await fetchStopDetails(), id);
    const mode = stop?.modes?.length === 1 ? stop.modes[0] : undefined;
    const type = {bus: 'Bus', tram: 'Tram', train: 'Train'}[mode];
    const heading = type ? type + ' stop information' : 'Stop information';
    return {heading, mode, fields: [stop?.name, stop?.code ? 'Stop code ' + stop.code : id && 'Stop ID ' + id]};
  }
  const type = {bus: 'Bus', obahn: 'O-Bahn bus', tram: 'Tram', train: 'Train'}[properties.mode];
  return {
    heading: type ? type + ' route information' : 'Route information',
    mode: properties.mode === 'obahn' ? 'bus' : properties.mode,
    fields: [
      properties.route ? 'Route ' + properties.route : 'Network segment ' + (properties.ID ?? properties.OBJECTID ?? 'unknown'),
      properties.name
    ]
  };
}

const api = { render, updateMap, coordinates, addLiveFrame, setPlayback, featureInformation, routeStyle,
  visibleGeometries, selectedGeometry };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { punctuality, snappedCoordinates, heatCounts, band, completeHistory, routeStyle };
} else {
  window.MetroNetwork = api;
}
})();
