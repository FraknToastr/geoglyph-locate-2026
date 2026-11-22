const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const folder = path.resolve(__dirname, '../GTFS data');

async function readFeed(name, visit) {
  const input = fs.createReadStream(path.join(folder, name), { encoding: 'utf8' });
  const lines = readline.createInterface({ input, crlfDelay: Infinity });
  let columns;
  for await (const line of lines) {
    if (!line.trim()) continue;
    const parts = (line.match(/(?:^|,)(?:"(?:[^"]|"")*"|[^,]*)/g) || [])
      .map((part, index) => (index ? part.slice(1) : part).replace(/^"|"$/g, '').replace(/""/g, '"'));
    if (!columns) {
      columns = parts;
      continue;
    }
    visit(key => parts[columns.indexOf(key)]);
  }
}

async function main() {
  const trips = new Map();
  const tripRoutes = new Map();
  const shapes = new Map();
  const routes = new Map();
  await readFeed('trips.txt', get => {
    const trip = get('trip_id');
    const shape = get('shape_id');
    const route = get('route_id');
    const direction = get('direction_id');
    if (!trip || !shape || !route) return;
    trips.set(trip, shape);
    tripRoutes.set(trip, route);
    if (!shapes.has(shape)) shapes.set(shape, []);
    if (!routes.has(route)) routes.set(route, new Map());
    const directions = routes.get(route);
    if (!directions.has(direction)) directions.set(direction, new Set());
    directions.get(direction).add(shape);
  });
  await readFeed('shapes.txt', get => {
    const points = shapes.get(get('shape_id'));
    const lon = Number(get('shape_pt_lon'));
    const lat = Number(get('shape_pt_lat'));
    const seq = Number(get('shape_pt_sequence'));
    if (points && Number.isFinite(lon) && Number.isFinite(lat) && Number.isFinite(seq)) {
      points.push([lon, lat, seq]);
    }
  });
  const labels = new Map();
  const modes = new Map();
  const names = new Map();
  const colourGroups = new Map();
  await readFeed('routes.txt', get => {
    const route = get('route_id');
    const colour = get('route_color')?.trim().toUpperCase();
    if (route && /^[0-9A-F]{6}$/.test(colour)) {
      if (!colourGroups.has(colour)) colourGroups.set(colour, []);
      colourGroups.get(colour).push(route.trim().toUpperCase());
    }
    if (!routes.has(route)) return;
    names.set(route, get('route_long_name'));
    const type = parseInt(get('route_type'), 10);
    const name = [get('route_long_name'), get('route_desc')].join(' ');
    if (type === 0 || (type >= 900 && type < 1000)) modes.set(route, 'tram');
    if (type === 2 || (type >= 100 && type < 200)) modes.set(route, 'train');
    if (type === 3 || (type >= 200 && type < 300) || (type >= 700 && type < 800)) {
      modes.set(route, /\b[oO][\s\-–‑]*bahn\b/i.test(name) ? 'obahn' : 'bus');
    }
    const label = get('route_short_name');
    if (!label || routes.has(label)) return;
    labels.set(label, labels.has(label) && labels.get(label) !== route ? null : route);
  });
  const index = {
    modes: Object.fromEntries(modes),
    names: Object.fromEntries(names),
    aliases: Object.fromEntries([...labels].filter(([, route]) => route)),
    trips: Object.fromEntries(trips),
    shapes: Object.fromEntries([...shapes].filter(([, points]) => points.length >= 2)
      .map(([id, points]) => [id, points.sort((a, b) => a[2] - b[2]).map(([lon, lat]) => [lon, lat])])),
    routes: Object.fromEntries([...routes].map(([id, directions]) => [id,
      Object.fromEntries([...directions].map(([direction, ids]) => [direction, [...ids]]))]))
  };
  const target = path.join(folder, 'route-index.json');
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(index));
  fs.renameSync(temporary, target);

  const stops = new Map();
  await readFeed('stops.txt', get => {
    stops.set(get('stop_id'), {name: get('stop_name'), code: get('stop_code'), modes: []});
  });
  await readFeed('stop_times.txt', get => {
    const mode = modes.get(tripRoutes.get(get('trip_id')));
    const stop = stops.get(get('stop_id'));
    const service = mode === 'obahn' ? 'bus' : mode;
    if (stop && service && !stop.modes.includes(service)) stop.modes.push(service);
  });
  fs.writeFileSync(path.join(folder, 'stop-details.json'), JSON.stringify(Object.fromEntries(stops)));
  const colours = [...colourGroups].sort(([a], [b]) => a.localeCompare(b)).map(([colour, ids]) =>
    `    ${JSON.stringify(colour)}: ${JSON.stringify(ids.sort())}`);
  fs.writeFileSync(path.resolve(__dirname, '../js/route-colours.js'), [
    '// Generated from Adelaide Metro GTFS routes.txt by npm run build:routes.',
    '(function () {',
    '  const colours = {',
    colours.join(',\n'),
    '  };',
    "  if (typeof module !== 'undefined' && module.exports) module.exports = colours;",
    '  else window.MetroRouteColours = colours;',
    '})();',
    ''
  ].join('\n'));
  console.log(`Indexed ${trips.size} trips and ${routes.size} routes.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
