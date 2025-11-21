// // src/repositories/journalRepository.js
// import { getDb } from '../storage/db';
// import { supabase } from '../supabase';
// import { getCurrentUserId } from './questRepository'; // reuse the same helper

// // Lightweight ID for local-first creates (replaced by server UUID after remote upsert)
// function makeLocalId() {
//   return `jid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// function isUuid(v) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//     String(v)
//   );
// }

// /**
//  * Get most-recent journal entries for the current user.
//  * Returns array of rows ordered by date DESC.
//  */
// export async function getRecentJournalEntries(limit = 200) {
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const rows = await db.getAllAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ?
//     ORDER BY date DESC
//     LIMIT ?;
//     `,
//     [userId, limit]
//   );

//   return rows ?? [];
// }

// /**
//  * Get a journal entry by exact date (YYYY-MM-DD) for current user.
//  * Returns row or null.
//  */
// export async function getJournalEntryByDate(dateStr) {
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const row = await db.getFirstAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ? AND date = ?
//     LIMIT 1;
//     `,
//     [userId, dateStr]
//   );
//   return row ?? null;
// }

// /**
//  * Upsert locally in SQLite. If id is missing, generates a local id.
//  * Returns the row payload used.
//  */
// export async function upsertJournalEntryLocal({
//   id,
//   date,
//   virtue,
//   note,
//   createdAt,
//   updatedAt,
// }) {
//   const db = await getDb();
//   const userId = await getCurrentUserId();
//   const nowIso = new Date().toISOString();

//   const payload = {
//     userId,
//     // keep existing date if not provided
//     date:
//       typeof date === 'string'
//         ? date
//         : existing?.date ?? new Date().toISOString().slice(0, 10),
//     virtue:
//       typeof virtue === 'string' && virtue.trim().length
//         ? virtue.trim()
//         : existing?.virtue ?? 'Today',
//     note:
//       typeof note === 'string'
//         ? note
//         : typeof existing?.note === 'string'
//         ? existing.note
//         : '',
//     createdAt: createdAt ?? existing?.created_at ?? nowIso,
//     updatedAt: updatedAt ?? nowIso,
//   };

//   // 🔎 read existing for merge
//   const existing =
//     id &&
//     (await db.getFirstAsync(
//       `SELECT id, user_id, date, virtue, note, created_at, updated_at
//       FROM journal_entries
//       WHERE id = ? AND user_id = ?
//       LIMIT 1;`,
//       [id, userId]
//     ));

//   await db.runAsync(
//     `
//     INSERT OR REPLACE INTO journal_entries
//       (id, user_id, date, virtue, note, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?);
//     `,
//     [
//       payload.id,
//       userId,
//       payload.date,
//       payload.virtue,
//       payload.note,
//       payload.createdAt,
//       payload.updatedAt,
//     ]
//   );

//   // Return both camelCase and snake_case so existing UI code works either way
//   return {
//     ...payload,
//     created_at: payload.createdAt,
//     updated_at: payload.updatedAt,
//   };
// }

// /**
//  * Upsert remotely in Supabase for the current user.
//  * If local id is a temp "jid_*", omit it so Supabase generates a UUID.
//  * After upsert, swap the local id to the server UUID so lists/edits stay in sync.
//  */
// export async function upsertJournalEntryRemote(payload) {
//   const userId = await getCurrentUserId();

//   const isTemp = payload.id && String(payload.id).startsWith('jid_');
//   const sending = {
//     ...(isTemp ? {} : { id: payload.id }), // omit temp id so server generates UUID
//     user_id: userId,
//     date: payload.date, // 'YYYY-MM-DD'
//     // virtue: typeof payload.virtue === 'string' ? payload.virtue : '',
//     virtue:
//       typeof payload.virtue === 'string' && payload.virtue.trim().length
//         ? payload.virtue.trim()
//         : 'Today',
//     note: typeof payload.note === 'string' ? payload.note : '',
//     // created_at / updated_at handled by server defaults + trigger
//   };

//   const { data, error } = await supabase
//     .from('journal_entries')
//     // .upsert(sending)
//     .upsert(sending, { onConflict: 'user_id,date' })
//     .select('id') // get the real UUID back
//     .single();

//   if (error) {
//     console.warn('[journalRepository] remote upsert error:', error);
//     return;
//   }

//   if (isTemp && data?.id) {
//     const db = await getDb();
//     await db.runAsync(
//       'UPDATE journal_entries SET id = ? WHERE id = ? AND user_id = ?;',
//       [data.id, payload.id, userId]
//     );
//   }
// }

// // 🔧 Explicit remote UPDATE (only for real UUID ids)
// export async function updateJournalEntryRemote(id, fields) {
//   const userId = await getCurrentUserId();
//   if (!isUuid(id)) return; // skip for temp ids

//   const patch = {};
//   if (typeof fields.note === 'string') patch.note = fields.note;
//   if (typeof fields.virtue === 'string' && fields.virtue.trim().length)
//     patch.virtue = fields.virtue.trim();
//   if (typeof fields.date === 'string') patch.date = fields.date; // optional; only if you want to move dates

//   if (Object.keys(patch).length === 0) return;

//   const { error } = await supabase
//     .from('journal_entries')
//     .update(patch)
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote update error:', error);
// }

// /**
//  * Delete locally.
//  */
// export async function deleteJournalEntryLocal(id) {
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   await db.runAsync(
//     `DELETE FROM journal_entries WHERE id = ? AND user_id = ?;`,
//     [id, userId]
//   );
// }

// /**
//  * Delete remotely.
//  */
// // src/repositories/journalRepository.js
// // export async function deleteJournalEntryRemote(id) {
// //   const userId = await getCurrentUserId();

// //   // If the id isn't a UUID (e.g., local temp "jid_*"), there's nothing to delete remotely.
// //   // Regex: 8-4-4-4-12 hex segments (case-insensitive).
// //   const isUuid =
// //     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
// //       String(id)
// //     );
// //   if (!isUuid) {
// //     return; // local-only row already removed by deleteJournalEntryLocal
// //   }

// //   const { error } = await supabase
// //     .from('journal_entries')
// //     .delete()
// //     .match({ id, user_id: userId });

// //   if (error) console.warn('[journalRepository] remote delete error:', error);
// // }

// export async function deleteJournalEntryRemote(id) {
//   const userId = await getCurrentUserId();
//   const isUuid =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//       String(id)
//     );
//   if (!isUuid) return; // local-only temp id (jid_*) → nothing to delete remotely

//   const { error } = await supabase
//     .from('journal_entries')
//     .delete()
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote delete error:', error);
// }

// /**
//  * Pull recent entries from Supabase -> write into SQLite (server is source of truth).
//  */
// export async function syncJournalFromServer(limit = 200) {
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const { data, error } = await supabase
//     .from('journal_entries')
//     .select('id, date, virtue, note, created_at, updated_at')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(limit);

//   if (error) {
//     console.warn('[journalRepository] fetch error:', error);
//     return;
//   }

//   await db.runAsync('DELETE FROM journal_entries WHERE user_id = ?', [userId]);

//   for (const row of data || []) {
//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO journal_entries
//         (id, user_id, date, virtue, note, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?);
//       `,
//       [
//         row.id,
//         userId,
//         row.date,
//         row.virtue || '',
//         row.note || '',
//         row.created_at || new Date().toISOString(),
//         row.updated_at || row.created_at || new Date().toISOString(),
//       ]
//     );
//   }
// }

// // src/repositories/journalRepository.js
// import { getDb } from '../storage/db';
// import { supabase } from '../supabase';
// import { getCurrentUserId } from './questRepository'; // reuse the same helper

// // ---------- Helpers ----------
// function makeLocalId() {
//   return `jid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// function isUuid(v) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//     String(v)
//   );
// }

// async function ensureLocalTables() {
//   const db = await getDb();
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS journal_entries (
//       id TEXT PRIMARY KEY NOT NULL,
//       user_id TEXT NOT NULL,
//       date TEXT NOT NULL,
//       virtue TEXT NOT NULL DEFAULT '',
//       note TEXT NOT NULL DEFAULT '',
//       created_at TEXT NOT NULL,
//       updated_at TEXT NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_journal_user_date
//       ON journal_entries (user_id, date DESC, created_at DESC);
//   `);
// }

// function todayKey() {
//   const d = new Date();
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// // ---------- Reads ----------
// /**
//  * Get most-recent journal entries for the current user.
//  * Returns array of rows ordered by date DESC.
//  */
// export async function getRecentJournalEntries(limit = 200) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const rows = await db.getAllAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ?
//     ORDER BY date DESC, created_at DESC
//     LIMIT ?;
//     `,
//     [userId, limit]
//   );

//   return rows ?? [];
// }

// /**
//  * Get a journal entry by exact date (YYYY-MM-DD) for current user.
//  * Returns row or null.
//  */
// export async function getJournalEntryByDate(dateStr) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const row = await db.getFirstAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ? AND date = ?
//     LIMIT 1;
//     `,
//     [userId, dateStr]
//   );
//   return row ?? null;
// }

// // ---------- Local upsert (merge-safe) ----------
// /**
//  * Upsert locally in SQLite. If id is missing, generates a local id.
//  * Returns the row payload used (snake_case fields).
//  */
// export async function upsertJournalEntryLocal({
//   id,
//   date,
//   virtue,
//   note,
//   createdAt,
//   updatedAt,
// }) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();
//   const nowIso = new Date().toISOString();

//   // Read existing row first (so we can merge)
//   const existing =
//     id &&
//     (await db.getFirstAsync(
//       `SELECT id, user_id, date, virtue, note, created_at, updated_at
//        FROM journal_entries
//        WHERE id = ? AND user_id = ?
//        LIMIT 1;`,
//       [id, userId]
//     ));

//   // Always guarantee a non-empty id for local writes
//   const safeId =
//     (typeof id === 'string' && id.trim().length ? id : null) ??
//     existing?.id ??
//     makeLocalId();

//   const payload = {
//     id: safeId,
//     user_id: userId,
//     date:
//       typeof date === 'string' && date.length
//         ? date
//         : existing?.date ?? todayKey(),
//     virtue:
//       typeof virtue === 'string' && virtue.trim().length
//         ? virtue.trim()
//         : existing?.virtue ?? 'Today',
//     note:
//       typeof note === 'string'
//         ? note
//         : typeof existing?.note === 'string'
//         ? existing.note
//         : '',
//     created_at: createdAt ?? existing?.created_at ?? nowIso,
//     updated_at: updatedAt ?? nowIso,
//   };

//   await db.runAsync(
//     `
//     INSERT OR REPLACE INTO journal_entries
//       (id, user_id, date, virtue, note, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?);
//     `,
//     [
//       payload.id,
//       payload.user_id,
//       payload.date,
//       payload.virtue,
//       payload.note,
//       payload.created_at,
//       payload.updated_at,
//     ]
//   );

//   return payload; // snake_case; service/repo both expect id/date/virtue/note
// }

// // ---------- Remote upsert / update ----------
// /**
//  * Upsert remotely in Supabase for the current user.
//  * If local id is a temp "jid_*", omit it so Supabase generates a UUID.
//  * After upsert, swap the local id to the server UUID so lists/edits stay in sync.
//  */
// export async function upsertJournalEntryRemote(payload) {
//   const userId = await getCurrentUserId();

//   const isTemp = payload.id && String(payload.id).startsWith('jid_');
//   const sending = {
//     ...(isTemp ? {} : { id: payload.id }),
//     user_id: userId,
//     date: payload.date, // 'YYYY-MM-DD'
//     virtue:
//       typeof payload.virtue === 'string' && payload.virtue.trim().length
//         ? payload.virtue.trim()
//         : 'Today',
//     note: typeof payload.note === 'string' ? payload.note : '',
//   };

//   const { data, error } = await supabase
//     .from('journal_entries')
//     .upsert(sending, { onConflict: 'user_id,date' }) // optional unique(user_id,date)
//     .select('id')
//     .single();

//   if (error) {
//     console.warn('[journalRepository] remote upsert error:', error);
//     return;
//   }

//   if (isTemp && data?.id) {
//     const db = await getDb();
//     await db.runAsync(
//       'UPDATE journal_entries SET id = ? WHERE id = ? AND user_id = ?;',
//       [data.id, payload.id, userId]
//     );
//   }
// }

// // Explicit remote UPDATE for real UUID ids
// export async function updateJournalEntryRemote(id, fields) {
//   const userId = await getCurrentUserId();
//   if (!isUuid(id)) return;

//   const patch = {};
//   if (typeof fields.note === 'string') patch.note = fields.note;
//   if (typeof fields.virtue === 'string' && fields.virtue.trim().length)
//     patch.virtue = fields.virtue.trim();
//   if (typeof fields.date === 'string') patch.date = fields.date;

//   if (Object.keys(patch).length === 0) return;

//   const { error } = await supabase
//     .from('journal_entries')
//     .update(patch)
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote update error:', error);
// }

// // ---------- Deletes ----------
// export async function deleteJournalEntryLocal(id) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   await db.runAsync(
//     `DELETE FROM journal_entries WHERE id = ? AND user_id = ?;`,
//     [id, userId]
//   );
// }

// export async function deleteJournalEntryRemote(id) {
//   const userId = await getCurrentUserId();
//   if (!isUuid(id)) return; // local temp id → nothing to delete remotely

//   const { error } = await supabase
//     .from('journal_entries')
//     .delete()
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote delete error:', error);
// }

// // ---------- Server → SQLite sync ----------
// export async function syncJournalFromServer(limit = 200) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const { data, error } = await supabase
//     .from('journal_entries')
//     .select('id, date, virtue, note, created_at, updated_at')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(limit);

//   if (error) {
//     console.warn('[journalRepository] fetch error:', error);
//     return;
//   }

//   await db.runAsync('DELETE FROM journal_entries WHERE user_id = ?', [userId]);

//   for (const row of data || []) {
//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO journal_entries
//         (id, user_id, date, virtue, note, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?);
//       `,
//       [
//         row.id,
//         userId,
//         row.date,
//         row.virtue || 'Today',
//         row.note || '',
//         row.created_at || new Date().toISOString(),
//         row.updated_at || row.created_at || new Date().toISOString(),
//       ]
//     );
//   }
// }

// // src/repositories/journalRepository.js
// import { getDb } from '../storage/db';
// import { supabase } from '../supabase';
// import { getCurrentUserId } from './questRepository'; // reuse the same helper

// // ---------- Helpers ----------
// function makeLocalId() {
//   return `jid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
// }

// function isUuid(v) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//     String(v)
//   );
// }

// async function ensureLocalTables() {
//   const db = await getDb();
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS journal_entries (
//       id TEXT PRIMARY KEY NOT NULL,
//       user_id TEXT NOT NULL,
//       date TEXT NOT NULL,
//       virtue TEXT NOT NULL DEFAULT '',
//       note TEXT NOT NULL DEFAULT '',
//       created_at TEXT NOT NULL,
//       updated_at TEXT NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_journal_user_date
//       ON journal_entries (user_id, date DESC, created_at DESC);
//   `);
// }

// function todayKey() {
//   const d = new Date();
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// // ---------- Reads ----------
// /**
//  * Get most-recent journal entries for the current user.
//  * Returns array of rows ordered by date DESC.
//  */
// export async function getRecentJournalEntries(limit = 200) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const rows = await db.getAllAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ?
//     ORDER BY date DESC, created_at DESC
//     LIMIT ?;
//     `,
//     [userId, limit]
//   );

//   return rows ?? [];
// }

// /**
//  * Get a journal entry by exact date (YYYY-MM-DD) for current user.
//  * Returns row or null.
//  */
// export async function getJournalEntryByDate(dateStr) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const row = await db.getFirstAsync(
//     `
//     SELECT id, user_id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     WHERE user_id = ? AND date = ?
//     LIMIT 1;
//     `,
//     [userId, dateStr]
//   );
//   return row ?? null;
// }

// // ---------- Local upsert (merge-safe) ----------
// /**
//  * Upsert locally in SQLite. If id is missing, generates a local id.
//  * Returns the row payload used (snake_case fields).
//  */
// export async function upsertJournalEntryLocal({
//   id,
//   date,
//   virtue,
//   note,
//   createdAt,
//   updatedAt,
// }) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();
//   const nowIso = new Date().toISOString();

//   // Read existing row first (so we can merge)
//   const existing =
//     id &&
//     (await db.getFirstAsync(
//       `SELECT id, user_id, date, virtue, note, created_at, updated_at
//        FROM journal_entries
//        WHERE id = ? AND user_id = ?
//        LIMIT 1;`,
//       [id, userId]
//     ));

//   // Always guarantee a non-empty id for local writes
//   const safeId =
//     (typeof id === 'string' && id.trim().length ? id : null) ??
//     existing?.id ??
//     makeLocalId();

//   const payload = {
//     id: safeId,
//     user_id: userId,
//     date:
//       typeof date === 'string' && date.length
//         ? date
//         : existing?.date ?? todayKey(),
//     virtue:
//       typeof virtue === 'string' && virtue.trim().length
//         ? virtue.trim()
//         : existing?.virtue ?? 'Today',
//     note:
//       typeof note === 'string'
//         ? note
//         : typeof existing?.note === 'string'
//         ? existing.note
//         : '',
//     created_at: createdAt ?? existing?.created_at ?? nowIso,
//     updated_at: updatedAt ?? nowIso,
//   };

//   await db.runAsync(
//     `
//     INSERT OR REPLACE INTO journal_entries
//       (id, user_id, date, virtue, note, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?);
//     `,
//     [
//       payload.id,
//       payload.user_id,
//       payload.date,
//       payload.virtue,
//       payload.note,
//       payload.created_at,
//       payload.updated_at,
//     ]
//   );

//   return payload; // snake_case; service/repo both expect id/date/virtue/note
// }

// // ---------- Remote upsert / update ----------
// /**
//  * Upsert remotely in Supabase for the current user.
//  * If local id is a temp "jid_*", omit it so Supabase generates a UUID.
//  * After upsert, swap the local id to the server UUID so lists/edits stay in sync.
//  */
// export async function upsertJournalEntryRemote(payload) {
//   const userId = await getCurrentUserId();

//   const isTemp = payload.id && String(payload.id).startsWith('jid_');
//   const sending = {
//     ...(isTemp ? {} : { id: payload.id }),
//     user_id: userId,
//     date: payload.date, // 'YYYY-MM-DD'
//     virtue:
//       typeof payload.virtue === 'string' && payload.virtue.trim().length
//         ? payload.virtue.trim()
//         : 'Today',
//     note: typeof payload.note === 'string' ? payload.note : '',
//   };

//   const { data, error } = await supabase
//     .from('journal_entries')
//     .insert(sending)
//     .select('id')
//     .single();

//   if (error) {
//     console.warn('[journalRepository] remote upsert error:', error);
//     return undefined;
//   }

//   if (isTemp && data?.id) {
//     const db = await getDb();
//     await db.runAsync(
//       'UPDATE journal_entries SET id = ? WHERE id = ? AND user_id = ?;',
//       [data.id, payload.id, userId]
//     );
//   }
// }

// // Explicit remote UPDATE for real UUID ids
// export async function updateJournalEntryRemote(id, fields) {
//   const userId = await getCurrentUserId();
//   if (!isUuid(id)) return;

//   const patch = {};
//   if (typeof fields.note === 'string') patch.note = fields.note;
//   if (typeof fields.virtue === 'string' && fields.virtue.trim().length)
//     patch.virtue = fields.virtue.trim();
//   if (typeof fields.date === 'string') patch.date = fields.date;

//   if (Object.keys(patch).length === 0) return;

//   const { error } = await supabase
//     .from('journal_entries')
//     .update(patch)
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote update error:', error);
// }

// // ---------- Deletes ----------
// export async function deleteJournalEntryLocal(id) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   await db.runAsync(
//     `DELETE FROM journal_entries WHERE id = ? AND user_id = ?;`,
//     [id, userId]
//   );
// }

// export async function deleteJournalEntryRemote(id) {
//   const userId = await getCurrentUserId();
//   if (!isUuid(id)) return; // local temp id → nothing to delete remotely

//   const { error } = await supabase
//     .from('journal_entries')
//     .delete()
//     .match({ id, user_id: userId });

//   if (error) console.warn('[journalRepository] remote delete error:', error);
// }

// // ---------- Server → SQLite sync ----------
// export async function syncJournalFromServer(limit = 200) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const userId = await getCurrentUserId();

//   const { data, error } = await supabase
//     .from('journal_entries')
//     .select('id, date, virtue, note, created_at, updated_at')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(limit);

//   if (error) {
//     console.warn('[journalRepository] fetch error:', error);
//     return;
//   }

//   await db.runAsync('DELETE FROM journal_entries WHERE user_id = ?', [userId]);

//   for (const row of data || []) {
//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO journal_entries
//         (id, user_id, date, virtue, note, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?);
//       `,
//       [
//         row.id,
//         userId,
//         row.date,
//         row.virtue || 'Today',
//         row.note || '',
//         row.created_at || new Date().toISOString(),
//         row.updated_at || row.created_at || new Date().toISOString(),
//       ]
//     );
//   }
// }

// src/repositories/journalRepository.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getCurrentUserId } from './questRepository'; // reuse the same helper

// ---------- Helpers ----------
function makeLocalId() {
  return `jid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(v)
  );
}

async function ensureLocalTables() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      virtue TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_journal_user_date
      ON journal_entries (user_id, date DESC, created_at DESC);
  `);
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------- Reads ----------
/**
 * Get most-recent journal entries for the current user.
 * Returns array of rows ordered by date DESC.
 */
export async function getRecentJournalEntries(limit = 200) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  const rows = await db.getAllAsync(
    `
    SELECT id, user_id, date, virtue, note, created_at, updated_at
    FROM journal_entries
    WHERE user_id = ?
    ORDER BY date DESC, created_at DESC
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
  await ensureLocalTables();
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

// ---------- Local upsert (merge-safe) ----------
/**
 * Upsert locally in SQLite. If id is missing, generates a local id.
 * Returns the row payload used (snake_case fields).
 */
export async function upsertJournalEntryLocal({
  id,
  date,
  virtue,
  note,
  createdAt,
  updatedAt,
}) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();
  const nowIso = new Date().toISOString();

  // Read existing row first (so we can merge)
  const existing =
    id &&
    (await db.getFirstAsync(
      `SELECT id, user_id, date, virtue, note, created_at, updated_at
       FROM journal_entries
       WHERE id = ? AND user_id = ?
       LIMIT 1;`,
      [id, userId]
    ));

  // Always guarantee a non-empty id for local writes
  const safeId =
    (typeof id === 'string' && id.trim().length ? id : null) ??
    existing?.id ??
    makeLocalId();

  const payload = {
    id: safeId,
    user_id: userId,
    date:
      typeof date === 'string' && date.length
        ? date
        : existing?.date ?? todayKey(),
    virtue:
      typeof virtue === 'string' && virtue.trim().length
        ? virtue.trim()
        : existing?.virtue ?? 'Today',
    note:
      typeof note === 'string'
        ? note
        : typeof existing?.note === 'string'
        ? existing.note
        : '',
    created_at: createdAt ?? existing?.created_at ?? nowIso,
    updated_at: updatedAt ?? nowIso,
  };

  await db.runAsync(
    `
    INSERT OR REPLACE INTO journal_entries
      (id, user_id, date, virtue, note, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      payload.id,
      payload.user_id,
      payload.date,
      payload.virtue,
      payload.note,
      payload.created_at,
      payload.updated_at,
    ]
  );

  return payload; // snake_case; service/repo both expect id/date/virtue/note
}

// ---------- Remote upsert / update ----------
/**
 * Remote CREATE for the current user (INSERT).
 * If local id is a temp "jid_*", we swap it to the server UUID.
 * Returns the definitive id (UUID if server generated one).
 */
export async function upsertJournalEntryRemote(payload) {
  const userId = await getCurrentUserId();

  const isTemp = payload.id && String(payload.id).startsWith('jid_');
  const sending = {
    ...(isTemp ? {} : { id: payload.id }),
    user_id: userId,
    date: payload.date, // 'YYYY-MM-DD'
    virtue:
      typeof payload.virtue === 'string' && payload.virtue.trim().length
        ? payload.virtue.trim()
        : 'Today',
    note: typeof payload.note === 'string' ? payload.note : '',
  };

  const { data, error } = await supabase
    .from('journal_entries')
    .insert(sending)
    .select('id')
    .single();

  if (error) {
    console.warn('[journalRepository] remote upsert error:', error);
    return undefined;
  }

  if (isTemp && data?.id) {
    const db = await getDb();
    // Avoid UNIQUE(id) collision if a UUID row already exists locally
    await db.execAsync('BEGIN TRANSACTION;');
    try {
      await db.runAsync(
        'DELETE FROM journal_entries WHERE id = ? AND user_id = ?;',
        [data.id, userId]
      );
      await db.runAsync(
        'UPDATE journal_entries SET id = ? WHERE id = ? AND user_id = ?;',
        [data.id, payload.id, userId]
      );
      await db.execAsync('COMMIT;');
    } catch (e) {
      await db.execAsync('ROLLBACK;');
      throw e;
    }
  }

  // Return authoritative id so the service can adopt it for subsequent updates
  return data?.id ?? payload.id;
}

// Explicit remote UPDATE for real UUID ids
export async function updateJournalEntryRemote(id, fields) {
  const userId = await getCurrentUserId();
  if (!isUuid(id)) return;

  const patch = {};
  if (typeof fields.note === 'string') patch.note = fields.note;
  if (typeof fields.virtue === 'string' && fields.virtue.trim().length)
    patch.virtue = fields.virtue.trim();
  if (typeof fields.date === 'string') patch.date = fields.date;

  if (Object.keys(patch).length === 0) return;

  const { error } = await supabase
    .from('journal_entries')
    .update(patch)
    .match({ id, user_id: userId });

  if (error) console.warn('[journalRepository] remote update error:', error);
}

// ---------- Deletes ----------
export async function deleteJournalEntryLocal(id) {
  await ensureLocalTables();
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `DELETE FROM journal_entries WHERE id = ? AND user_id = ?;`,
    [id, userId]
  );
}

export async function deleteJournalEntryRemote(id) {
  const userId = await getCurrentUserId();
  if (!isUuid(id)) return; // local temp id → nothing to delete remotely

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .match({ id, user_id: userId });

  if (error) console.warn('[journalRepository] remote delete error:', error);
}

// ---------- Server → SQLite sync ----------
export async function syncJournalFromServer(limit = 200) {
  await ensureLocalTables();
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
        row.virtue || 'Today',
        row.note || '',
        row.created_at || new Date().toISOString(),
        row.updated_at || row.created_at || new Date().toISOString(),
      ]
    );
  }
}
