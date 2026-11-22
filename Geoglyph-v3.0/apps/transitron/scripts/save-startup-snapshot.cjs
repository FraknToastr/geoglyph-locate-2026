const fs = require('node:fs/promises');
const path = require('node:path');
const {execFile} = require('node:child_process');
const {promisify} = require('node:util');
const decoder = require('../js/gtfs.js');
const run = promisify(execFile);

const feeds = [
  ['vehicle_positions', 'vehicles', decoder.parseVehicles],
  ['trip_updates', 'trips', decoder.parseTrips],
  ['service_alerts', 'alerts', decoder.parseAlerts]
];

async function main() {
  const base = (process.argv[2] || 'https://gtfs.adelaidemetro.com.au/v1/realtime').replace(/\/+$/, '');
  const results = await Promise.all(feeds.map(async ([endpoint, key, decode]) => {
    const {stdout} = await run('curl', [
      '--fail', '--silent', '--show-error', '--location', '--max-time', '12',
      '--header', 'Cache-Control: no-cache', base + '/' + endpoint
    ], {
      encoding: 'buffer',
      maxBuffer: 16 * 1024 * 1024
    });
    if (stdout[0] !== 0x0a) throw Error(endpoint + ' did not return GTFS-Realtime');
    const bytes = stdout.buffer.slice(stdout.byteOffset, stdout.byteOffset + stdout.byteLength);
    return [key, decode(bytes)];
  }));
  const snapshot = {capturedAt: new Date().toISOString(), ...Object.fromEntries(results)};
  const target = path.join(__dirname, '..', 'GTFS data', 'startup-snapshot.json');
  const temporary = target + '.' + process.pid + '.tmp';
  await fs.mkdir(path.dirname(target), {recursive: true});
  await fs.writeFile(temporary, JSON.stringify(snapshot));
  await fs.rename(temporary, target);
  console.log('Saved ' + results.map(([key, rows]) => rows.length + ' ' + key).join(', ') + ' at ' + snapshot.capturedAt);
}

main().catch(error => {
  console.error('Startup snapshot capture failed:', error.message);
  process.exitCode = 1;
});
