const fs = require('node:fs/promises');
const path = require('node:path');
const { createWriteStream } = require('node:fs');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { gzip, gunzip } = require('node:zlib');
const { promisify } = require('node:util');
const { DatabaseSync } = require('node:sqlite');

const segmentDuration = 30 * 60 * 1000;
const pageSize = 16;
const sessionPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const stringify = value => JSON.stringify(value, (_, item) => typeof item === 'bigint' ? String(item) : item);
const compress = promisify(gzip);
const decompress = promisify(gunzip);

class RecordingStore {
  constructor(directory) {
    this.directory = directory;
    this.db = new DatabaseSync(path.join(directory, 'recordings.sqlite'));
    try {
      // Retain SQLite's OS-backed exclusive lock for this recorder's lifetime.
      this.db.exec(`
        PRAGMA locking_mode = EXCLUSIVE;
        PRAGMA auto_vacuum = INCREMENTAL;
        PRAGMA synchronous = FULL;
        BEGIN EXCLUSIVE;
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY, meta TEXT NOT NULL, config TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS frames (
          id TEXT NOT NULL, sequence INTEGER NOT NULL, time INTEGER NOT NULL,
          bucket INTEGER NOT NULL, payload BLOB, byte_offset INTEGER, byte_length INTEGER,
          PRIMARY KEY (id, sequence)
        );
        CREATE INDEX IF NOT EXISTS frames_by_bucket ON frames(id, bucket, sequence);
        CREATE INDEX IF NOT EXISTS frames_to_archive ON frames(id, bucket) WHERE payload IS NOT NULL;
        COMMIT;
      `);
    } catch (error) {
      this.db.close();
      throw error;
    }
  }

  close() { this.db.close(); }

  start(meta, config) {
    this.db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(meta.id, stringify(meta), stringify(config));
  }

  saveMeta(meta) {
    this.db.prepare('UPDATE sessions SET meta = ? WHERE id = ?').run(stringify(meta), meta.id);
  }

  async saveFrame(meta, frame) {
    const payload = await compress(stringify(frame) + '\n');
    const bucket = Math.floor((frame.time - meta.startedAt) / segmentDuration);
    this.db.prepare(`INSERT INTO frames (id, sequence, time, bucket, payload) VALUES (?,
      (SELECT COALESCE(MAX(sequence) + 1, 0) FROM frames WHERE id = ?), ?, ?, ?)`)
      .run(meta.id, meta.id, frame.time, bucket, payload);
  }

  sessions(id) {
    const query = this.db.prepare(`SELECT meta, config,
      (SELECT COUNT(*) FROM frames WHERE frames.id = sessions.id) AS frameCount,
      (SELECT time FROM frames WHERE frames.id = sessions.id ORDER BY sequence DESC LIMIT 1) AS lastSavedAt
      FROM sessions ${id === undefined ? '' : 'WHERE id = ?'}`);
    const rows = id === undefined ? query.all() : query.all(id);
    return rows.map(({meta, config, ...stats}) => ({meta: {...JSON.parse(meta), ...stats}, config: JSON.parse(config)}));
  }

  pendingArchives() {
    return this.db.prepare(`SELECT meta FROM sessions
      WHERE id IN (SELECT DISTINCT id FROM frames WHERE payload IS NOT NULL)`)
      .all().map(({meta}) => JSON.parse(meta));
  }

  index(id) {
    return this.db.prepare('SELECT time FROM frames WHERE id = ? ORDER BY sequence').all(id).map(row => row.time);
  }

  segmentPath(id, bucket) {
    return path.join(this.directory, id, `segment-${bucket}.ndjson.gz`);
  }

  async seal(meta, now) {
    const cutoff = meta.endedAt == null ? Math.floor((now - meta.startedAt) / segmentDuration) : Infinity;
    const buckets = this.db.prepare('SELECT DISTINCT bucket FROM frames WHERE id = ? AND bucket < ? AND payload IS NOT NULL ORDER BY bucket');
    for (const {bucket} of buckets.all(meta.id, cutoff)) {
      const file = this.segmentPath(meta.id, bucket);
      const temporary = file + '.tmp';
      const directory = path.dirname(file);
      await fs.mkdir(directory, {recursive: true, mode: 0o700});
      // Each frame is a gzip member. Concatenate the members and index their byte ranges
      // so seeking can open one frame without inflating the preceding half hour.
      const next = this.db.prepare('SELECT sequence, payload FROM frames WHERE id = ? AND bucket = ? AND sequence > ? ORDER BY sequence LIMIT 1');
      const published = [];
      function* records() {
        let offset = 0;
        let row = next.get(meta.id, bucket, -1);
        while (row) {
          const length = row.payload.length;
          published.push({sequence: row.sequence, offset, length});
          yield Buffer.from(row.payload.buffer, row.payload.byteOffset, length);
          offset += length;
          row = next.get(meta.id, bucket, row.sequence);
        }
      }
      await pipeline(Readable.from(records()), createWriteStream(temporary, {mode: 0o600}));
      const handle = await fs.open(temporary, 'r+');
      try { await handle.sync(); } finally { await handle.close(); }
      await fs.rename(temporary, file);
      if (process.platform !== 'win32') {
        const parent = await fs.open(directory, 'r');
        try { await parent.sync(); } finally { await parent.close(); }
        const root = await fs.open(this.directory, 'r');
        try { await root.sync(); } finally { await root.close(); }
      }
      const publish = this.db.prepare(`UPDATE frames SET payload = NULL, byte_offset = ?, byte_length = ?
        WHERE id = ? AND sequence = ?`);
      this.db.exec('BEGIN');
      try {
        for (const {sequence, offset, length} of published) publish.run(offset, length, meta.id, sequence);
        this.db.exec('COMMIT');
      } catch (error) {
        if (this.db.isTransaction) this.db.exec('ROLLBACK');
        throw error;
      }
      this.db.exec('PRAGMA incremental_vacuum(512)');
    }
  }

  async *readFrames(id, offset, count) {
    const frame = this.db.prepare('SELECT * FROM frames WHERE id = ? AND sequence = ?');
    let file;
    let openBucket;
    try {
      for (let sequence = offset; sequence < offset + count; sequence++) {
        const row = frame.get(id, sequence);
        if (!row) break;
        let payload = row.payload;
        if (payload === null) {
          if (openBucket !== row.bucket) {
            await file?.close();
            file = undefined;
            file = await fs.open(this.segmentPath(id, row.bucket), 'r');
            openBucket = row.bucket;
          }
          payload = Buffer.allocUnsafe(row.byte_length);
          let read = 0;
          while (read < payload.length) {
            const {bytesRead} = await file.read(payload, read, payload.length - read, row.byte_offset + read);
            if (!bytesRead) throw new Error(`Recording segment ${row.bucket} is truncated.`);
            read += bytesRead;
          }
        }
        yield JSON.parse(await decompress(payload));
      }
    } finally {
      await file?.close();
    }
  }

  async legacySessions(id) {
    const ids = id ? [id] : (await fs.readdir(this.directory)).filter(name => sessionPattern.test(name));
    const sessions = await Promise.all(ids.map(async id => {
      try {
        const directory = path.join(this.directory, id);
        const meta = JSON.parse(await fs.readFile(path.join(directory, 'session.json'), 'utf8'));
        const files = (await fs.readdir(directory)).filter(file => /^\d+\.json$/.test(file))
          .sort((a, b) => parseInt(a) - parseInt(b));
        if (meta.endedAt == null) {
          meta.endedAt = files.length ? parseInt(files.at(-1)) : meta.startedAt;
          meta.error ??= 'Recording interrupted before it could be finalized.';
        }
        return {meta: {...meta, frameCount: files.length, lastSavedAt: files.length ? parseInt(files.at(-1)) : null}, files};
      } catch (error) {
        if (error.code !== 'ENOENT') console.warn('Could not read legacy recording', id, error.message);
        return null;
      }
    }));
    return sessions.filter(Boolean);
  }

  async *readLegacy(id, files, offset, count) {
    for (const file of files.slice(offset, offset + count)) {
      yield JSON.parse(await fs.readFile(path.join(this.directory, id, file), 'utf8'));
    }
  }
}

module.exports = {RecordingStore, segmentDuration, pageSize, sessionPattern, stringify};
