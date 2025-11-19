// src/repositories/prayerRepository.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getCurrentUserId } from './questRepository';

const TABLE = 'prayer_requests';

// local temp id (replaced by server UUID after remote upsert)
function makeLocalId() {
  return `pid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isDefined(v) {
  return typeof v !== 'undefined';
}

async function ensureLocalTables() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS prayer_requests (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      details TEXT NOT NULL,
      added_at TEXT,
      last_prayed_at TEXT,
      answered_at TEXT,
      deleted_at TEXT,
      answered INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_prayer_user_active_created
      ON prayer_requests (user_id, answered, created_at DESC);
  `);
}

// ---------- Reads ----------
export async function getRecentPrayerRequests(
  limit = 100,
  includeDeleted = false
) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  const where = includeDeleted
    ? 'user_id = ?'
    : 'user_id = ? AND deleted_at IS NULL';

  const rows = await db.getAllAsync(
    `
    SELECT id, user_id, title, details, added_at, last_prayed_at, answered_at,
           deleted_at, answered, created_at, updated_at
    FROM prayer_requests
    WHERE ${where}
    ORDER BY created_at DESC
    LIMIT ?;
    `,
    [userId, limit]
  );
  return rows?.map((r) => ({ ...r, answered: !!r.answered })) ?? [];
}

export async function getPrayerById(id) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  const row = await db.getFirstAsync(
    `
    SELECT id, user_id, title, details, added_at, last_prayed_at, answered_at,
           deleted_at, answered, created_at, updated_at
    FROM prayer_requests
    WHERE id = ? AND user_id = ?
    LIMIT 1;
    `,
    [id, userId]
  );
  return row ? { ...row, answered: !!row.answered } : null;
}

// ---------- Local upsert (merge-safe) ----------
export async function upsertPrayerLocal({
  id,
  title,
  details,
  addedAt,
  lastPrayedAt,
  answeredAt,
  deletedAt,
  answered,
  createdAt,
  updatedAt,
}) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();
  const nowIso = new Date().toISOString();

  // Read existing to avoid wiping fields when not provided
  const existing = id
    ? await db.getFirstAsync(
        `SELECT id, user_id, title, details, added_at, last_prayed_at, answered_at, deleted_at, answered, created_at, updated_at
         FROM prayer_requests
         WHERE id = ? AND user_id = ?
         LIMIT 1;`,
        [id, userId]
      )
    : null;

  const payload = {
    id: existing?.id ?? id ?? makeLocalId(),
    user_id: userId,
    title: isDefined(title) ? (title ?? '').trim() : existing?.title ?? '',
    details: isDefined(details)
      ? typeof details === 'string'
        ? details
        : ''
      : existing?.details ?? '',
    added_at: isDefined(addedAt) ? addedAt : existing?.added_at ?? nowIso,
    last_prayed_at: isDefined(lastPrayedAt)
      ? lastPrayedAt
      : existing?.last_prayed_at ?? null,
    answered_at: isDefined(answeredAt)
      ? answeredAt
      : existing?.answered_at ?? null,
    deleted_at: isDefined(deletedAt) ? deletedAt : existing?.deleted_at ?? null,
    answered: isDefined(answered)
      ? answered
        ? 1
        : 0
      : existing?.answered ?? 0,
    created_at: isDefined(createdAt)
      ? createdAt ?? nowIso
      : existing?.created_at ?? nowIso,
    updated_at: isDefined(updatedAt) ? updatedAt ?? nowIso : nowIso,
  };

  await db.runAsync(
    `
    INSERT OR REPLACE INTO prayer_requests
      (id, user_id, title, details, added_at, last_prayed_at, answered_at,
       deleted_at, answered, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      payload.id,
      payload.user_id,
      payload.title,
      payload.details,
      payload.added_at,
      payload.last_prayed_at,
      payload.answered_at,
      payload.deleted_at,
      payload.answered,
      payload.created_at,
      payload.updated_at,
    ]
  );

  return {
    ...payload,
    answered: !!payload.answered,
  };
}

// ---------- Remote upsert + local id swap ----------
export async function upsertPrayerRemote(payload) {
  const userId = await getCurrentUserId();

  const isTemp = payload.id && String(payload.id).startsWith('pid_');

  const sending = {
    ...(isTemp ? {} : { id: payload.id }),
    user_id: userId, // FK -> profiles(id)
    title: payload.title ?? '',
    details: payload.details ?? '',
    added_at: payload.added_at ?? payload.addedAt ?? null,
    last_prayed_at: payload.last_prayed_at ?? payload.lastPrayedAt ?? null,
    answered_at: payload.answered_at ?? payload.answeredAt ?? null,
    deleted_at: payload.deleted_at ?? payload.deletedAt ?? null,
    answered: !!(payload.answered ?? false),
  };

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(sending)
    .select('id')
    .single();

  if (error) {
    console.warn('[prayerRepository] remote upsert error:', error);
    return;
  }

  if (isTemp && data?.id) {
    const db = await getDb();
    await db.runAsync(
      'UPDATE prayer_requests SET id = ? WHERE id = ? AND user_id = ?;',
      [data.id, payload.id, userId]
    );
  }
}

// ---------- Mutations ----------
export async function markPrayerAnsweredLocal(
  id,
  answeredAt = new Date().toISOString()
) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `
    UPDATE prayer_requests
    SET answered = 1, answered_at = ?, updated_at = ?
    WHERE id = ? AND user_id = ?;
    `,
    [answeredAt, new Date().toISOString(), id, userId]
  );
}

export async function markPrayerAnsweredRemote(
  id,
  answeredAt = new Date().toISOString()
) {
  const userId = await getCurrentUserId();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) return;

  const { error } = await supabase
    .from(TABLE)
    .update({ answered: true, answered_at: answeredAt })
    .match({ id, user_id: userId });

  if (error)
    console.warn('[prayerRepository] remote mark answered error:', error);
}

// ---- Restore (un-answer) ----
export async function markPrayerUnansweredLocal(id) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();
  const nowIso = new Date().toISOString();

  await db.runAsync(
    `
    UPDATE prayer_requests
    SET answered = 0, answered_at = NULL, updated_at = ?
    WHERE id = ? AND user_id = ?;
    `,
    [nowIso, id, userId]
  );
}

export async function markPrayerUnansweredRemote(id) {
  const userId = await getCurrentUserId();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) return;

  const { error } = await supabase
    .from(TABLE)
    .update({ answered: false, answered_at: null })
    .match({ id, user_id: userId });

  if (error) console.warn('[prayerRepository] restore remote error:', error);
}

export async function softDeletePrayerLocal(
  id,
  deletedAt = new Date().toISOString()
) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `
    UPDATE prayer_requests
    SET deleted_at = ?, updated_at = ?
    WHERE id = ? AND user_id = ?;
    `,
    [deletedAt, new Date().toISOString(), id, userId]
  );
}

export async function softDeletePrayerRemote(
  id,
  deletedAt = new Date().toISOString()
) {
  const userId = await getCurrentUserId();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) return;

  const { error } = await supabase
    .from(TABLE)
    .update({ deleted_at: deletedAt })
    .match({ id, user_id: userId });

  if (error)
    console.warn('[prayerRepository] remote soft delete error:', error);
}

export async function touchLastPrayedLocal(id, ts = new Date().toISOString()) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `
    UPDATE prayer_requests
    SET last_prayed_at = ?, updated_at = ?
    WHERE id = ? AND user_id = ?;
    `,
    [ts, ts, id, userId]
  );
}

export async function touchLastPrayedRemote(id, ts = new Date().toISOString()) {
  const userId = await getCurrentUserId();
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) return; // skip remote if temp local id

  const { error } = await supabase
    .from(TABLE)
    .update({ last_prayed_at: ts })
    .match({ id, user_id: userId });

  if (error) console.warn('[prayerRepository] remote touch error:', error);
}

// ---------- Server → SQLite sync ----------
export async function syncPrayersFromServer(limit = 200) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, user_id, title, details, added_at, last_prayed_at, answered_at, deleted_at, answered, created_at'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[prayerRepository] fetch error:', error);
    return;
  }

  await db.runAsync('DELETE FROM prayer_requests WHERE user_id = ?', [userId]);

  for (const row of data || []) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO prayer_requests
        (id, user_id, title, details, added_at, last_prayed_at, answered_at,
         deleted_at, answered, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `,
      [
        row.id,
        userId,
        row.title ?? '',
        row.details ?? '',
        row.added_at ?? null,
        row.last_prayed_at ?? null,
        row.answered_at ?? null,
        row.deleted_at ?? null,
        row.answered ? 1 : 0,
        row.created_at || new Date().toISOString(),
        new Date().toISOString(), // local updated_at
      ]
    );
  }
}
