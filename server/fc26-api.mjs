// API de resultados de FC 26: Node puro + SQLite nativo (node:sqlite), sin dependencias.
// nginx le pasa /api/fc26/* y sirve el resto del sitio estático.
//
// Variables de entorno:
//   FC26_PIN   PIN para cargar/borrar partidos (sin PIN, la API es solo lectura)
//   FC26_DB    ruta del archivo SQLite (default ./data/fc26.sqlite)
//   PORT       puerto (default 8787), siempre en 127.0.0.1

import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const PORT = Number(process.env.PORT) || 8787;
const DB_PATH = resolve(process.env.FC26_DB || 'data/fc26.sqlite');
const PIN = process.env.FC26_PIN?.trim() || '';
const MAX_BODY = 256 * 1024;
const MAX_PHOTO = 200 * 1024;

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 3000;
  CREATE TABLE IF NOT EXISTS matches (
    id          TEXT PRIMARY KEY,
    date        TEXT NOT NULL,
    home_player TEXT NOT NULL,
    home_team   TEXT NOT NULL DEFAULT '',
    home_goals  INTEGER NOT NULL,
    away_player TEXT NOT NULL,
    away_team   TEXT NOT NULL DEFAULT '',
    away_goals  INTEGER NOT NULL,
    started_at  INTEGER,
    goals       TEXT NOT NULL DEFAULT '[]',
    created_at  INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS matches_date ON matches (date);
  CREATE TABLE IF NOT EXISTS photos (
    name       TEXT PRIMARY KEY,
    mime       TEXT NOT NULL,
    data       BLOB NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const listStmt = db.prepare('SELECT * FROM matches ORDER BY date, created_at');
const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO matches
    (id, date, home_player, home_team, home_goals, away_player, away_team, away_goals, started_at, goals, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const deleteStmt = db.prepare('DELETE FROM matches WHERE id = ?');
const photoVersionsStmt = db.prepare('SELECT name, updated_at FROM photos');
const photoStmt = db.prepare('SELECT mime, data FROM photos WHERE name = ?');
const putPhotoStmt = db.prepare(`
  INSERT INTO photos (name, mime, data, updated_at) VALUES (?, ?, ?, ?)
  ON CONFLICT (name) DO UPDATE SET mime = excluded.mime, data = excluded.data, updated_at = excluded.updated_at
`);
const deletePhotoStmt = db.prepare('DELETE FROM photos WHERE name = ?');

const toMatch = (r) => ({
  id: r.id,
  date: r.date,
  homePlayer: r.home_player,
  homeTeam: r.home_team,
  homeGoals: r.home_goals,
  awayPlayer: r.away_player,
  awayTeam: r.away_team,
  awayGoals: r.away_goals,
  ...(r.started_at != null && { startedAt: r.started_at }),
  goals: JSON.parse(r.goals),
});

// --- Validación: nunca se guarda lo que manda el cliente sin limpiar ---
const text = (v, max = 40) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const score = (v) => (Number.isInteger(v) && v >= 0 && v <= 99 ? v : null);
const time = (v) => (Number.isFinite(v) && v > 0 && v < 8.64e15 ? Math.trunc(v) : null);

function clean(m) {
  if (!m || typeof m !== 'object') return null;
  const id = text(m.id, 64);
  const date = text(m.date, 10);
  const homePlayer = text(m.homePlayer);
  const awayPlayer = text(m.awayPlayer);
  const homeGoals = score(m.homeGoals);
  const awayGoals = score(m.awayGoals);
  if (!/^[\w-]{1,64}$/.test(id) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (!homePlayer || !awayPlayer || homeGoals === null || awayGoals === null) return null;
  const goals = (Array.isArray(m.goals) ? m.goals : [])
    .slice(0, 200)
    .filter((g) => (g?.side === 'home' || g?.side === 'away') && time(g.at))
    .map((g) => ({ side: g.side, at: time(g.at) }));
  return {
    id, date, homePlayer, awayPlayer, homeGoals, awayGoals,
    homeTeam: text(m.homeTeam),
    awayTeam: text(m.awayTeam),
    startedAt: time(m.startedAt),
    goals,
  };
}

// --- PIN: comparación en tiempo constante + freno a la fuerza bruta ---
const hash = (s) => createHash('sha256').update(s).digest();
const pinHash = PIN ? hash(PIN) : null;
let failures = [];

function checkPin(req) {
  if (!pinHash) return { ok: false, status: 503, error: 'Falta configurar FC26_PIN en el servidor' };
  const now = Date.now();
  failures = failures.filter((t) => now - t < 10 * 60_000);
  if (failures.length >= 20) return { ok: false, status: 429, error: 'Demasiados intentos, probá en unos minutos' };
  const given = String(req.headers['x-fc26-pin'] ?? '');
  if (given && timingSafeEqual(hash(given), pinHash)) return { ok: true };
  failures.push(now);
  return { ok: false, status: 401, error: 'PIN incorrecto' };
}

// --- HTTP ---
function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readBody(req, max = MAX_BODY) {
  return new Promise((ok, fail) => {
    let size = 0;
    const chunks = [];
    // Si se pasa del límite se sigue leyendo (y descartando) para poder responder 413
    req.on('data', (c) => {
      size += c.length;
      if (size <= max) chunks.push(c);
    });
    req.on('end', () =>
      size > max ? fail(Object.assign(new Error('Archivo demasiado grande'), { status: 413 })) : ok(Buffer.concat(chunks)),
    );
    req.on('error', fail);
  });
}

async function readJson(req) {
  const buf = await readBody(req);
  try {
    return JSON.parse(buf.toString('utf8') || 'null');
  } catch {
    throw Object.assign(new Error('JSON inválido'), { status: 400 });
  }
}

// Solo se aceptan imágenes reales: se mira la firma del archivo, no lo que dice el cliente
function imageType(buf) {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

const all = () => listStmt.all().map(toMatch);
// Versión de cada foto (para que el navegador la cachee hasta que cambie)
const photos = () => Object.fromEntries(photoVersionsStmt.all().map((r) => [r.name, r.updated_at]));
const playerName = (raw) => {
  try {
    const name = decodeURIComponent(raw).trim();
    return name && name.length <= 40 ? name : null;
  } catch {
    return null;
  }
};

async function handle(req, res) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '');

  if (path === '/api/fc26/health') return send(res, 200, { ok: true });

  if (path === '/api/fc26/matches' && req.method === 'GET') {
    return send(res, 200, { matches: all(), photos: photos(), canWrite: Boolean(pinHash) });
  }

  if (path === '/api/fc26/pin' && req.method === 'POST') {
    const auth = checkPin(req);
    return auth.ok ? send(res, 200, { ok: true }) : send(res, auth.status, { error: auth.error });
  }

  // Alta de uno o varios partidos (importar / subir los que estaban solo en el celu)
  if (path === '/api/fc26/matches' && req.method === 'POST') {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    const body = await readJson(req);
    const list = (Array.isArray(body) ? body : [body]).slice(0, 500).map(clean);
    if (!list.length || list.some((m) => !m)) return send(res, 400, { error: 'Partido inválido' });
    let added = 0;
    const now = Date.now();
    db.exec('BEGIN');
    try {
      list.forEach((m, i) => {
        const r = insertStmt.run(
          m.id, m.date, m.homePlayer, m.homeTeam, m.homeGoals,
          m.awayPlayer, m.awayTeam, m.awayGoals, m.startedAt, JSON.stringify(m.goals), now + i,
        );
        added += Number(r.changes);
      });
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
    return send(res, 200, { added, matches: all() });
  }

  const del = path.match(/^\/api\/fc26\/matches\/([\w-]{1,64})$/);
  if (del && req.method === 'DELETE') {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    deleteStmt.run(del[1]);
    return send(res, 200, { matches: all() });
  }

  // Fotos de perfil
  const photo = path.match(/^\/api\/fc26\/photos\/([^/]+)$/);
  if (photo) {
    const name = playerName(photo[1]);
    if (!name) return send(res, 400, { error: 'Jugador inválido' });

    if (req.method === 'GET') {
      const row = photoStmt.get(name);
      if (!row) return send(res, 404, { error: 'Sin foto' });
      res.writeHead(200, {
        'content-type': row.mime,
        // La URL lleva ?v=<versión>: cuando cambia la foto, cambia la URL
        'cache-control': url.searchParams.has('v') ? 'public, max-age=31536000, immutable' : 'no-cache',
        'content-security-policy': "default-src 'none'",
        'x-content-type-options': 'nosniff',
      });
      return res.end(Buffer.from(row.data));
    }

    if (req.method === 'PUT' || req.method === 'DELETE') {
      const auth = checkPin(req);
      if (!auth.ok) return send(res, auth.status, { error: auth.error });
      if (req.method === 'DELETE') deletePhotoStmt.run(name);
      else {
        const buf = await readBody(req, MAX_PHOTO);
        const mime = imageType(buf);
        if (!mime) return send(res, 415, { error: 'La foto tiene que ser JPG, PNG o WebP' });
        putPhotoStmt.run(name, mime, buf, Date.now());
      }
      return send(res, 200, { photos: photos() });
    }
  }

  send(res, 404, { error: 'No encontrado' });
}

const server = createServer((req, res) => {
  handle(req, res).catch((e) => {
    if (!e.status) console.error(e);
    if (!res.headersSent) send(res, e.status || 500, { error: e.status ? e.message : 'Error del servidor' });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`fc26-api en http://127.0.0.1:${PORT} · db ${DB_PATH} · ${pinHash ? 'con PIN' : 'solo lectura (falta FC26_PIN)'}`);
});

for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => {
    db.close();
    process.exit(0);
  }));
}
