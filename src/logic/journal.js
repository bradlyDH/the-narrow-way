// src/logic/journal.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Read from local cache (per-user)
export async function getJournalEntries() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const db = await getDb();
  const rows = await db.getAllAsync(
    `
      SELECT id, date, virtue, note, created_at, updated_at
      FROM journal_entries
      WHERE user_id = ?
      ORDER BY date DESC, created_at DESC;
    `,
    [user.id]
  );

  return rows || [];
}

// Create new entry → Supabase + mirror into SQLite
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

  const db = await getDb();
  await db.runAsync(
    `
      INSERT OR REPLACE INTO journal_entries
        (id, user_id, date, virtue, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      data.id,
      userId,
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

// Update existing entry
export async function updateJournalEntry(id, note) {
  const trimmed = (note || '').trim();
  if (!id || !trimmed) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No active user session. Please sign in again.');
  }

  const userId = user.id;
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from('journal_entries')
    .update({
      note: trimmed,
      updated_at: nowIso,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, updated_at')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update journal entry.');
  }

  const db = await getDb();
  await db.runAsync(
    `
      UPDATE journal_entries
      SET note = ?, updated_at = ?
      WHERE id = ? AND user_id = ?;
    `,
    [trimmed, data.updated_at || nowIso, id, userId]
  );

  return { updated_at: data.updated_at || nowIso };
}

// Delete entry
export async function deleteJournalEntry(id) {
  if (!id) return;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('No active user session. Please sign in again.');
  }

  const userId = user.id;

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message || 'Failed to delete journal entry.');
  }

  const db = await getDb();
  await db.runAsync(
    `
      DELETE FROM journal_entries
      WHERE id = ? AND user_id = ?;
    `,
    [id, userId]
  );

  return true;
}
