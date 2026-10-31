// API de resultados de FC 26: Node puro + SQLite nativo (node:sqlite), sin dependencias.
// nginx le pasa /api/fc26/* y sirve el resto del sitio estático.
//
// Variables de entorno:
//   FC26_PIN   PIN para entrar: sin él no se ve ni se carga nada (si no está, la API es pública y solo lectura)
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
  -- Torneos: separan los partidos (un partido está en un torneo o en ninguno)
  CREATE TABLE IF NOT EXISTS tournaments (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  -- Partidos que se están cargando ahora (se ven en vivo)
  CREATE TABLE IF NOT EXISTS live (
    id         TEXT PRIMARY KEY,
    data       TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS photos (
    name       TEXT PRIMARY KEY,
    mime       TEXT NOT NULL,
    data       BLOB NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const listStmt = db.prepare('SELECT * FROM matches ORDER BY date, created_at');
// Bases creadas antes de los torneos: se agrega la columna sin tocar los partidos
if (!db.prepare('PRAGMA table_info(matches)').all().some((c) => c.name === 'tournament_id')) {
  db.exec('ALTER TABLE matches ADD COLUMN tournament_id TEXT');
}

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO matches
    (id, date, home_player, home_team, home_goals, away_player, away_team, away_goals, started_at, goals, created_at, tournament_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const deleteStmt = db.prepare('DELETE FROM matches WHERE id = ?');
const photoVersionsStmt = db.prepare('SELECT name, updated_at FROM photos');
const photoStmt = db.prepare('SELECT mime, data FROM photos WHERE name = ?');
const putPhotoStmt = db.prepare(`
  INSERT INTO photos (name, mime, data, updated_at) VALUES (?, ?, ?, ?)
  ON CONFLICT (name) DO UPDATE SET mime = excluded.mime, data = excluded.data, updated_at = excluded.updated_at
`);
const deletePhotoStmt = db.prepare('DELETE FROM photos WHERE name = ?');
const liveStmt = db.prepare('SELECT id, data, updated_at FROM live ORDER BY updated_at DESC');
const putLiveStmt = db.prepare(`
  INSERT INTO live (id, data, updated_at) VALUES (?, ?, ?)
  ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
`);
const deleteLiveStmt = db.prepare('DELETE FROM live WHERE id = ?');
const staleLiveStmt = db.prepare('DELETE FROM live WHERE updated_at < ?');
const LIVE_TTL = 3 * 60 * 60_000; // un partido "en vivo" sin cambios por 3 h se descarta

const tournamentsStmt = db.prepare('SELECT id, name, created_at FROM tournaments ORDER BY created_at DESC');
const tournamentExists = db.prepare('SELECT 1 FROM tournaments WHERE id = ?');
const insertTournament = db.prepare('INSERT INTO tournaments (id, name, created_at) VALUES (?, ?, ?)');
const renameTournament = db.prepare('UPDATE tournaments SET name = ? WHERE id = ?');
const deleteTournament = db.prepare('DELETE FROM tournaments WHERE id = ?');
const clearTournament = db.prepare('UPDATE matches SET tournament_id = NULL WHERE tournament_id = ?');
const setMatchTournament = db.prepare('UPDATE matches SET tournament_id = ? WHERE id = ?');
const tournaments = () => tournamentsStmt.all().map((r) => ({ id: r.id, name: r.name, createdAt: r.created_at }));

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
  ...(r.tournament_id && { tournamentId: r.tournament_id }),
});

// --- Validación: nunca se guarda lo que manda el cliente sin limpiar ---
const text = (v, max = 40) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const score = (v) => (Number.isInteger(v) && v >= 0 && v <= 99 ? v : null);
const time = (v) => (Number.isFinite(v) && v > 0 && v < 8.64e15 ? Math.trunc(v) : null);
// Minuto del juego en que entró el gol (90' + descuento + alargue)
const gameMinute = (v) => (Number.isInteger(v) && v >= 1 && v <= 200 ? v : null);

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
    .map((g) => ({ side: g.side, at: time(g.at), ...(gameMinute(g.min) && { min: gameMinute(g.min) }) }));
  return {
    id, date, homePlayer, awayPlayer, homeGoals, awayGoals,
    homeTeam: text(m.homeTeam),
    awayTeam: text(m.awayTeam),
    startedAt: time(m.startedAt),
    goals,
    // Solo se acepta un torneo que exista
    tournamentId: typeof m.tournamentId === 'string' && tournamentExists.get(m.tournamentId) ? m.tournamentId : null,
  };
}

// Un partido en curso: como un partido, pero puede no tener todavía jugadores elegidos
function cleanLive(m) {
  if (!m || typeof m !== 'object') return null;
  const goals = (Array.isArray(m.goals) ? m.goals : [])
    .slice(0, 200)
    .filter((g) => (g?.side === 'home' || g?.side === 'away') && time(g.at))
    .map((g) => ({ side: g.side, at: time(g.at), ...(gameMinute(g.min) && { min: gameMinute(g.min) }) }));
  return {
    homePlayer: text(m.homePlayer),
    awayPlayer: text(m.awayPlayer),
    homeTeam: text(m.homeTeam),
    awayTeam: text(m.awayTeam),
    homeGoals: score(m.homeGoals) ?? 0,
    awayGoals: score(m.awayGoals) ?? 0,
    startedAt: time(m.startedAt),
    // Reloj de juego: duración real del partido (min), tiempo pausado acumulado y pausa en curso
    duration: Number.isFinite(m.duration) && m.duration >= 1 && m.duration <= 120 ? m.duration : 20,
    pausedMs: Number.isFinite(m.pausedMs) && m.pausedMs >= 0 ? Math.trunc(m.pausedMs) : 0,
    pausedAt: time(m.pausedAt),
    goals,
  };
}

const live = () => {
  staleLiveStmt.run(Date.now() - LIVE_TTL);
  return liveStmt.all().map((r) => ({ id: r.id, ...JSON.parse(r.data), updatedAt: r.updated_at }));
};

// --- PIN: comparación en tiempo constante + freno a la fuerza bruta ---
const hash = (s) => createHash('sha256').update(s).digest();
const pinHash = PIN ? hash(PIN) : null;
let failures = [];

// Sesión en cookie (HttpOnly) para que también las fotos <img> vayan autenticadas.
// El valor deriva del PIN: si se cambia FC26_PIN, todas las sesiones dejan de valer.
const COOKIE = 'fc26_session';
const sessionToken = PIN ? createHash('sha256').update(`fc26-session:${PIN}`).digest('hex') : '';

function cookie(req, name) {
  for (const part of String(req.headers.cookie ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return '';
}

// write: cargar/borrar. Las lecturas son libres solo si el servidor no tiene PIN.
function checkPin(req, { write = true } = {}) {
  if (!pinHash) {
    return write ? { ok: false, status: 503, error: 'Falta configurar FC26_PIN en el servidor' } : { ok: true };
  }
  const now = Date.now();
  failures = failures.filter((t) => now - t < 10 * 60_000);
  if (failures.length >= 20) return { ok: false, status: 429, error: 'Demasiados intentos, probá en unos minutos' };
  const given = String(req.headers['x-fc26-pin'] ?? '');
  const session = cookie(req, COOKIE);
  if (given && timingSafeEqual(hash(given), pinHash)) return { ok: true };
  if (!given && session && timingSafeEqual(hash(session), hash(sessionToken))) return { ok: true };
  // Solo cuentan los PIN tipeados: una cookie vieja (PIN cambiado) no puede bloquear a todos,
  // y el token de 64 hex no se puede adivinar
  if (given) failures.push(now);
  return { ok: false, status: 401, error: given ? 'PIN incorrecto' : 'Ingresá el PIN' };
}

function sessionCookie(req, value, maxAge) {
  const secure = String(req.headers['x-forwarded-proto'] ?? '').includes('https') ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/api/fc26; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

// --- HTTP ---
function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers });
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

// --- Tiempo real: Server-Sent Events ---
// Cada celu abre /api/fc26/events y recibe los cambios apenas pasan:
//   live     → la lista de partidos en curso (con los datos completos)
//   changed  → cambiaron partidos o fotos: el celu vuelve a pedir la tabla
const streams = new Set();
const MAX_STREAMS = 200;

function broadcast(event, data = {}) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of streams) res.write(msg);
}

// Un comentario cada 25 s mantiene viva la conexión a través de proxies
setInterval(() => {
  for (const res of streams) res.write(': ping\n\n');
}, 25_000).unref();
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

  // Entrar con el PIN: deja la sesión en una cookie por un año
  if (path === '/api/fc26/pin' && req.method === 'POST') {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    return send(res, 200, { ok: true }, { 'set-cookie': sessionCookie(req, sessionToken, 31536000) });
  }
  if (path === '/api/fc26/pin' && req.method === 'DELETE') {
    return send(res, 200, { ok: true }, { 'set-cookie': sessionCookie(req, '', 0) });
  }

  // Todo lo demás (salvo /health) pide estar adentro
  const read = checkPin(req, { write: false });
  if (!read.ok) return send(res, read.status, { error: read.error, pinRequired: true });

  if (path === '/api/fc26/matches' && req.method === 'GET') {
    return send(res, 200, {
      matches: all(),
      tournaments: tournaments(),
      photos: photos(),
      live: live(),
      canWrite: Boolean(pinHash),
    });
  }

  if (path === '/api/fc26/events' && req.method === 'GET') {
    if (streams.size >= MAX_STREAMS) return send(res, 503, { error: 'Demasiadas conexiones' });
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    });
    res.write(`retry: 3000\n\nevent: live\ndata: ${JSON.stringify({ live: live() })}\n\n`);
    streams.add(res);
    req.on('close', () => streams.delete(res));
    return;
  }

  // Respaldo por si el stream no anda: se consulta seguido, por eso es una ruta liviana aparte
  if (path === '/api/fc26/live' && req.method === 'GET') {
    return send(res, 200, { live: live() });
  }

  const liveMatch = path.match(/^\/api\/fc26\/live\/([\w-]{1,64})$/);
  if (liveMatch && (req.method === 'PUT' || req.method === 'DELETE')) {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    if (req.method === 'DELETE') deleteLiveStmt.run(liveMatch[1]);
    else {
      const data = cleanLive(await readJson(req));
      if (!data) return send(res, 400, { error: 'Partido inválido' });
      putLiveStmt.run(liveMatch[1], JSON.stringify(data), Date.now());
    }
    const liveNow = live();
    broadcast('live', { live: liveNow });
    return send(res, 200, { live: liveNow });
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
    // Si venía de un partido en vivo, deja de estar en vivo al guardarse
    const liveId = !Array.isArray(body) && typeof body?.liveId === 'string' ? body.liveId : '';
    db.exec('BEGIN');
    try {
      if (liveId) deleteLiveStmt.run(liveId);
      list.forEach((m, i) => {
        const r = insertStmt.run(
          m.id, m.date, m.homePlayer, m.homeTeam, m.homeGoals,
          m.awayPlayer, m.awayTeam, m.awayGoals, m.startedAt, JSON.stringify(m.goals), now + i, m.tournamentId,
        );
        added += Number(r.changes);
      });
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
    const liveNow = live();
    if (liveId) broadcast('live', { live: liveNow });
    broadcast('changed');
    return send(res, 200, { added, matches: all(), live: liveNow });
  }

  // Torneos: crear / renombrar y definir sus partidos / borrar (los partidos quedan sin torneo)
  if (path === '/api/fc26/tournaments' || path.startsWith('/api/fc26/tournaments/')) {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    const id = path.match(/^\/api\/fc26\/tournaments\/([\w-]{1,64})$/)?.[1];

    if (id && req.method === 'DELETE') {
      db.exec('BEGIN');
      try {
        clearTournament.run(id);
        deleteTournament.run(id);
        db.exec('COMMIT');
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
    } else if ((path === '/api/fc26/tournaments' && req.method === 'POST') || (id && req.method === 'PUT')) {
      const body = await readJson(req);
      const name = text(body?.name, 40);
      if (!name) return send(res, 400, { error: 'Poné un nombre para el torneo' });
      const tid = id ?? (/^[\w-]{1,64}$/.test(body?.id ?? '') ? body.id : `t-${Date.now().toString(36)}`);
      if (id && !tournamentExists.get(id)) return send(res, 404, { error: 'Ese torneo no existe' });
      // matchIds: los partidos que quedan en el torneo (los demás que estaban, salen)
      const ids = Array.isArray(body?.matchIds) ? body.matchIds.filter((x) => typeof x === 'string').slice(0, 2000) : null;
      db.exec('BEGIN');
      try {
        if (id) renameTournament.run(name, id);
        else insertTournament.run(tid, name, Date.now());
        if (ids) {
          clearTournament.run(tid);
          for (const mid of ids) setMatchTournament.run(tid, mid);
        }
        db.exec('COMMIT');
      } catch (e) {
        db.exec('ROLLBACK');
        throw e;
      }
      broadcast('changed');
      return send(res, 200, { id: tid, tournaments: tournaments(), matches: all() });
    } else return send(res, 404, { error: 'No encontrado' });
    broadcast('changed');
    return send(res, 200, { tournaments: tournaments(), matches: all() });
  }

  // Mover un partido a otro torneo (o a ninguno)
  const moveMatch = path.match(/^\/api\/fc26\/matches\/([\w-]{1,64})\/tournament$/);
  if (moveMatch && req.method === 'PUT') {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    const body = await readJson(req);
    const tid = typeof body?.tournamentId === 'string' && tournamentExists.get(body.tournamentId) ? body.tournamentId : null;
    setMatchTournament.run(tid, moveMatch[1]);
    broadcast('changed');
    return send(res, 200, { matches: all() });
  }

  const del = path.match(/^\/api\/fc26\/matches\/([\w-]{1,64})$/);
  if (del && req.method === 'DELETE') {
    const auth = checkPin(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    deleteStmt.run(del[1]);
    broadcast('changed');
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
        'cache-control': url.searchParams.has('v') ? 'private, max-age=31536000, immutable' : 'no-cache',
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
      broadcast('changed');
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
    for (const res of streams) res.end();
    db.close();
    process.exit(0);
  }));
}
