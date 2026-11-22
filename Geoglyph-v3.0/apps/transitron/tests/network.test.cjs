const test = require('node:test');
const assert = require('node:assert/strict');
const { band, heatCounts, punctuality, snappedCoordinates, completeHistory } = require('../js/network.js');
const { parseTrips } = require('../js/gtfs.js');

test('heat counts unique vehicles per route within the cursor window and maps band boundaries', () => {
  const vehicle = (VehicleID, RouteID) => ({ VehicleID, RouteID });
  const time = 400_000;
  const frames = [
    { time: 99_999, vehicles: [vehicle('old', '100')] },
    { time: 100_000, vehicles: [vehicle('a', '100'), vehicle('b', '100')] },
    { time, vehicles: [vehicle('a', '100'), vehicle('a', '101')] },
    { time: time + 1, vehicles: [vehicle('future', '100')] }
  ];
  assert.deepEqual([...heatCounts(frames, time)], [['100', 2], ['101', 1]]);
  assert.deepEqual([...heatCounts(frames, 100_000)], [['100', 3]]);
  assert.deepEqual([...heatCounts(frames, time, {aliases: {'101': '100'}})], [['100', 2]]);
  assert.deepEqual([0, 1, 2, 3, 5, 6, 10, 11].map(band), [0, 1, 1, 2, 2, 3, 3, 4]);
});

test('five-minute history reports gaps during and after capture', () => {
  const history = Array.from({length: 11}, (_, index) => ({time: 30_000 * index}));
  assert.equal(completeHistory(history, 300_000), true);
  assert.equal(completeHistory(history.slice(0, -3), 300_000), false);
  assert.equal(completeHistory(history.filter((_, index) => index !== 4 && index !== 5), 300_000), false);
});

test('snapping uses the trip shape, then the route and direction, and limits distance', () => {
  const index = {
    trips: { trip: 'a' },
    routes: { route: { 0: ['a'], 1: ['b'] } },
    shapes: { a: [[138, -35], [139, -35]], b: [[138, -35.0004], [139, -35.0004]] }
  };
  const vehicle = { TripID: 'trip', RouteID: 'route', DirectionID: 1, Longitude: 138.5, Latitude: -35.0003 };
  assert.deepEqual(snappedCoordinates(vehicle, index), [138.5, -35]);
  assert.deepEqual(snappedCoordinates({ ...vehicle, TripID: 'missing' }, index), [138.5, -35.0004]);
  assert.deepEqual(snappedCoordinates({ ...vehicle, Latitude: -35.002 }, index), [138.5, -35.002]);
  assert.deepEqual(snappedCoordinates({ ...vehicle, TripID: 'missing', DirectionID: null }, index), [138.5, -35.0003]);
  assert.deepEqual(snappedCoordinates({ ...vehicle, RouteID: 'other' }, index), [138.5, -35.0003]);
});

test('punctuality uses inclusive on-time boundaries and treats ambiguous trips as unknown', () => {
  const vehicle = id => ({ TripID: id, VehicleID: id });
  const vehicles = ['early', 'min', 'max', 'late', 'ambiguous', 'missing', 'next'].map(vehicle);
  vehicles[6].CurrentStopSeq = 3;
  const trips = [
    { TripID: 'early', DelaySeconds: -61 },
    { TripID: 'min', DelaySeconds: -60 },
    { TripID: 'max', DelaySeconds: 300 },
    { TripID: 'late', DelaySeconds: 301 },
    { TripID: 'ambiguous', DelaySeconds: 301 },
    { TripID: 'ambiguous', DelaySeconds: 0 },
    { TripID: 'next', StopTimeUpdates: [
      { StopSequence: 2, ArrivalDelaySeconds: 301 },
      { StopSequence: 3, ArrivalDelaySeconds: -61 }
    ] }
  ];
  assert.deepEqual(punctuality([...vehicles, vehicles[0]], trips), { early: 2, onTime: 2, late: 1, unknown: 2 });
});

test('trip update decoder preserves absent and signed stop delays', () => {
  const message = (field, body) => Buffer.from([field * 8 + 2, body.length, ...body]);
  const trip = message(1, message(1, Buffer.from('trip')));
  const stop = message(2, Buffer.concat([
    Buffer.from([8, 3]),
    message(2, Buffer.from([8, 195, 255, 255, 255, 15])),
    message(4, Buffer.from('s3'))
  ]));
  const feed = message(2, message(3, Buffer.concat([trip, stop])));
  const [update] = parseTrips(feed);
  assert.equal(update.TripID, 'trip');
  assert.equal(update.DelaySeconds, null);
  assert.equal(update.FirstStopID, 's3');
  assert.equal(update.StopTimeUpdates[0].ArrivalDelaySeconds, -61);
  assert.equal(update.StopTimeUpdates[0].DepartureDelaySeconds, null);
  assert.equal(update.StopTimeUpdates[0].StopSequence, 3);
});
