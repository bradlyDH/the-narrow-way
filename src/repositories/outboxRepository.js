// src/repositories/outboxRepository.js
import { getDb } from '../storage/db';
import { getCurrentUserId } from './questRepository';

// Table shape:
// id TEXT PK, user_id TEXT, entity TEXT, op TEXT, payload_json TEXT,
// attempts INTEGER, created_at TEXT
async function ensureOutbox() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS outbox_queue (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      entity TEXT NOT NULL,         -- 'journal' | 'prayer' | 'friendship'
      op TEXT NOT NULL,             -- 'upsert' | 'delete' | 'touch' | 'accept' | 'decline' | ...
      payload_json TEXT NOT NULL,   -- stringified payload
      attempts INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_outbox_user_created
      ON outbox_queue (user_id, created_at DESC);
  `);
}

function makeId() {
  return `ob_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function enqueueOutbox(entity, op, payload) {
  await ensureOutbox();
  const db = await getDb();
  const userId = await getCurrentUserId();
  const row = {
    id: makeId(),
    userId,
    entity,
    op,
    payloadJson: JSON.stringify(payload || {}),
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    `INSERT INTO outbox_queue (id, user_id, entity, op, payload_json, attempts, created_at)
     VALUES (?, ?, ?, ?, ?, 0, ?);`,
    [row.id, row.userId, entity, op, row.payloadJson, row.createdAt]
  );

  return row.id;
}

export async function dequeueOutboxBatch(limit = 25) {
  await ensureOutbox();
  const db = await getDb();
  const userId = await getCurrentUserId();

  const rows = await db.getAllAsync(
    `SELECT id, entity, op, payload_json AS payloadJson, attempts, created_at AS createdAt
     FROM outbox_queue
     WHERE user_id = ?
     ORDER BY created_at ASC
     LIMIT ?;`,
    [userId, limit]
  );

  return (rows || []).map((r) => ({
    id: r.id,
    entity: r.entity,
    op: r.op,
    attempts: r.attempts,
    createdAt: r.createdAt,
    payload: safeParse(r.payloadJson),
  }));
}

export async function markOutboxDone(id) {
  await ensureOutbox();
  const db = await getDb();
  await db.runAsync(`DELETE FROM outbox_queue WHERE id = ?;`, [id]);
}

export async function bumpOutboxAttempts(id) {
  await ensureOutbox();
  const db = await getDb();
  await db.runAsync(
    `UPDATE outbox_queue SET attempts = attempts + 1 WHERE id = ?;`,
    [id]
  );
}

function safeParse(s) {
  try {
    return JSON.parse(String(s || '{}'));
  } catch {
    return {};
  }
}
