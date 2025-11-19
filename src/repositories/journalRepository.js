// src/repositories/journalRepository.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getCurrentUserId } from './questRepository'; // reuse the same helper

// Lightweight ID for local-first creates (replaced by server UUID after remote upsert)
function makeLocalId() {
  return `jid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Get most-recent journal entries for the current user.
 * Returns array of rows ordered by date DESC.
 */
export async function getRecentJournalEntries(limit = 200) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  const rows = await db.getAllAsync(
    `
    SELECT id, user_id, date, virtue, note, created_at, updated_at
    FROM journal_entries
    WHERE user_id = ?
    ORDER BY date DESC
    LIMIT ?;
    `,
    [userId, limit]
  );

  return rows ?? [];
}

/**
 * Get a journal entry by exact date (YYYY-MM-DD) for current user.
 * Returns row or null.
 */
export async function getJournalEntryByDate(dateStr) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  const row = await db.getFirstAsync(
    `
    SELECT id, user_id, date, virtue, note, created_at, updated_at
    FROM journal_entries
    WHERE user_id = ? AND date = ?
    LIMIT 1;
    `,
    [userId, dateStr]
  );
  return row ?? null;
}

/**
 * Upsert locally in SQLite. If id is missing, generates a local id.
 * Returns the row payload used.
 */
export async function upsertJournalEntryLocal({
  id,
  date,
  virtue,
  note,
  createdAt,
  updatedAt,
}) {
  const db = await getDb();
  const userId = await getCurrentUserId();
  const nowIso = new Date().toISOString();

  const payload = {
    id: id || makeLocalId(), // <-- fixed )
    userId,
    date,
    virtue: typeof virtue === 'string' ? virtue : '',
    note: typeof note === 'string' ? note : '',
    createdAt: createdAt || nowIso,
    updatedAt: updatedAt || nowIso,
  };

  await db.runAsync(
    `
    INSERT OR REPLACE INTO journal_entries
      (id, user_id, date, virtue, note, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      payload.id,
      userId,
      payload.date,
      payload.virtue,
      payload.note,
      payload.createdAt,
      payload.updatedAt,
    ]
  );

  // Return both camelCase and snake_case so existing UI code works either way
  return {
    ...payload,
    created_at: payload.createdAt,
    updated_at: payload.updatedAt,
  };
}

/**
 * Upsert remotely in Supabase for the current user.
 * If local id is a temp "jid_*", omit it so Supabase generates a UUID.
 * After upsert, swap the local id to the server UUID so lists/edits stay in sync.
 */
export async function upsertJournalEntryRemote(payload) {
  const userId = await getCurrentUserId();

  const isTemp = payload.id && String(payload.id).startsWith('jid_');
  const sending = {
    ...(isTemp ? {} : { id: payload.id }), // omit temp id so server generates UUID
    user_id: userId,
    date: payload.date, // 'YYYY-MM-DD'
    virtue: typeof payload.virtue === 'string' ? payload.virtue : '',
    note: typeof payload.note === 'string' ? payload.note : '',
    // created_at / updated_at handled by server defaults + trigger
  };

  const { data, error } = await supabase
    .from('journal_entries')
    .upsert(sending)
    .select('id') // get the real UUID back
    .single();

  if (error) {
    console.warn('[journalRepository] remote upsert error:', error);
    return;
  }

  if (isTemp && data?.id) {
    const db = await getDb();
    await db.runAsync(
      'UPDATE journal_entries SET id = ? WHERE id = ? AND user_id = ?;',
      [data.id, payload.id, userId]
    );
  }
}

/**
 * Delete locally.
 */
export async function deleteJournalEntryLocal(id) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `DELETE FROM journal_entries WHERE id = ? AND user_id = ?;`,
    [id, userId]
  );
}

/**
 * Delete remotely.
 */
// src/repositories/journalRepository.js
export async function deleteJournalEntryRemote(id) {
  const userId = await getCurrentUserId();

  // If the id isn't a UUID (e.g., local temp "jid_*"), there's nothing to delete remotely.
  // Regex: 8-4-4-4-12 hex segments (case-insensitive).
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) {
    return; // local-only row already removed by deleteJournalEntryLocal
  }

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .match({ id, user_id: userId });

  if (error) console.warn('[journalRepository] remote delete error:', error);
}

/**
 * Pull recent entries from Supabase -> write into SQLite (server is source of truth).
 */
export async function syncJournalFromServer(limit = 200) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, date, virtue, note, created_at, updated_at')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[journalRepository] fetch error:', error);
    return;
  }

  await db.runAsync('DELETE FROM journal_entries WHERE user_id = ?', [userId]);

  for (const row of data || []) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO journal_entries
        (id, user_id, date, virtue, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        row.id,
        userId,
        row.date,
        row.virtue || '',
        row.note || '',
        row.created_at || new Date().toISOString(),
        row.updated_at || row.created_at || new Date().toISOString(),
      ]
    );
  }
}
