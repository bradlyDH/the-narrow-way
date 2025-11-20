// // src/logic/journal.js
// import { getDb } from '../storage/db';
// import { getTodaysVirtue } from './dailyVirtue';

// function getTodayKey() {
//   const now = new Date();
//   const yyyy = now.getFullYear();
//   const mm = String(now.getMonth() + 1).padStart(2, '0');
//   const dd = String(now.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// // Create a new journal entry for today
// export async function createJournalEntry(note, virtueOverride) {
//   if (!note || !note.trim()) return null;

//   const db = await getDb();
//   const now = new Date();
//   const isoNow = now.toISOString();
//   const dateKey = getTodayKey();
//   const virtue = virtueOverride || getTodaysVirtue() || 'Today';

//   const id = `${dateKey}:${now.getTime()}`;

//   await db.runAsync(
//     `
//     INSERT INTO journal_entries (
//       id, date, virtue, note, created_at, updated_at
//     )
//     VALUES (?, ?, ?, ?, ?, ?)
//   `,
//     [id, dateKey, virtue, note.trim(), isoNow, isoNow]
//   );

//   return {
//     id,
//     date: dateKey,
//     virtue,
//     note: note.trim(),
//     created_at: isoNow,
//     updated_at: isoNow,
//   };
// }

// // Get all entries, newest first
// export async function getJournalEntries() {
//   const db = await getDb();
//   const rows = await db.getAllAsync(
//     `
//     SELECT id, date, virtue, note, created_at, updated_at
//     FROM journal_entries
//     ORDER BY date DESC, created_at DESC
//   `
//   );
//   return rows;
// }

// export async function updateJournalEntry(id, note) {
//   if (!id || !note || !note.trim()) return null;

//   const db = await getDb();
//   const trimmed = note.trim();
//   const now = new Date().toISOString();

//   await db.runAsync(
//     `
//     UPDATE journal_entries
//     SET note = ?, updated_at = ?
//     WHERE id = ?
//   `,
//     [trimmed, now, id]
//   );

//   return { id, note: trimmed, updated_at: now };
// }

// export async function deleteJournalEntry(id) {
//   if (!id) return;

//   const db = await getDb();
//   await db.runAsync(
//     `
//     DELETE FROM journal_entries
//     WHERE id = ?
//   `,
//     [id]
//   );
// }

// src/logic/journal.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';

// Helper: today as YYYY-MM-DD (local)
function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Get all journal entries for the *current user* from local SQLite.
 * (Supabase → SQLite sync is handled by syncUserData().)
 */
export async function getJournalEntries() {
  const db = await getDb();

  // We treat SQLite as a cache already filtered by user via syncUserData().
  const rows = await db.getAllAsync(
    `
      SELECT id, date, virtue, note, created_at, updated_at
      FROM journal_entries
      ORDER BY date DESC, created_at DESC;
    `
  );

  return rows || [];
}

/**
 * Create a new journal entry for today's date & the passed virtue.
 * - Writes to Supabase (journal_entries table, user_id-scoped)
 * - Mirrors to local SQLite
 * - Returns the created entry object for UI insertion
 */
export async function createJournalEntry(note, virtue) {
  const trimmed = (note || '').trim();
  if (!trimmed) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No active user session. Please sign in again.');
  }

  const userId = user.id;
  const date = todayStr();

  // 1️⃣ Remote insert
  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      date,
      virtue: virtue || 'Today',
      note: trimmed,
    })
    .select('id, date, virtue, note, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to save journal entry.');
  }

  // 2️⃣ Mirror into SQLite cache
  const db = await getDb();
  await db.runAsync(
    `
      INSERT OR REPLACE INTO journal_entries
        (id, date, virtue, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    [
      data.id,
      data.date,
      data.virtue || 'Today',
      data.note || '',
      data.created_at || new Date().toISOString(),
      data.updated_at || data.created_at || new Date().toISOString(),
    ]
  );

  return {
    id: data.id,
    date: data.date,
    virtue: data.virtue || 'Today',
    note: data.note || '',
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

/**
 * Update an existing journal entry (note only, virtue/date stay put).
 * - Updates Supabase
 * - Updates SQLite
 * - Returns { updated_at } for your UI to patch into state
 */
export async function updateJournalEntry(entryId, note) {
  const trimmed = (note || '').trim();
  if (!trimmed) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No active user session. Please sign in again.');
  }

  const nowIso = new Date().toISOString();

  // 1️⃣ Remote update
  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      note: trimmed,
      updated_at: nowIso,
    })
    .eq('id', entryId)
    .eq('user_id', user.id)
    .select('id, updated_at')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update journal entry.');
  }

  // 2️⃣ Local SQLite update
  const db = await getDb();
  await db.runAsync(
    `
      UPDATE journal_entries
      SET note = ?, updated_at = ?
      WHERE id = ?;
    `,
    [trimmed, data.updated_at || nowIso, entryId]
  );

  return { updated_at: data.updated_at || nowIso };
}

/**
 * Delete a journal entry.
 * - Deletes from Supabase
 * - Deletes from SQLite
 */
export async function deleteJournalEntry(entryId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No active user session. Please sign in again.');
  }

  // 1️⃣ Remote delete
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message || 'Failed to delete journal entry.');
  }

  // 2️⃣ Local delete
  const db = await getDb();
  await db.runAsync(
    `
      DELETE FROM journal_entries
      WHERE id = ?;
    `,
    [entryId]
  );

  return true;
}
