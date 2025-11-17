// src/repositories/questRepository.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';

/**
 * Get the current Supabase user id.
 * You chose "Supabase-only IDs", so no local fallback.
 */
export async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.warn('[questRepository] getCurrentUserId error:', error);
  }

  if (!user || !user.id) {
    throw new Error('[questRepository] No authenticated user');
  }

  return user.id;
}

/**
 * Read quest_status for this user on a specific date.
 * Returns: { userId, date, completed, completedAt } or null
 */
export async function getQuestStatusForDate(dateStr) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  const row = await db.getFirstAsync(
    `
    SELECT user_id, date, completed, completed_at
    FROM quest_status
    WHERE user_id = ? AND date = ?
    LIMIT 1;
    `,
    [userId, dateStr]
  );

  if (!row) return null;

  return {
    userId: row.user_id,
    date: row.date,
    completed: !!row.completed,
    completedAt: row.completed_at || null,
  };
}

/**
 * Upsert quest_status in SQLite for this user.
 */
export async function upsertQuestStatusLocal(dateStr, completed, completedAt) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  await db.runAsync(
    `
    INSERT INTO quest_status (user_id, date, completed, completed_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET
      completed = excluded.completed,
      completed_at = excluded.completed_at;
    `,
    [userId, dateStr, completed ? 1 : 0, completedAt ?? null]
  );

  return { userId, date: dateStr, completed, completedAt };
}

/**
 * Upsert quest_status in Supabase for this user.
 */
export async function upsertQuestStatusRemote(dateStr, completed, completedAt) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.warn(
      '[questRepository] upsertQuestStatusRemote auth error:',
      error
    );
    return;
  }

  if (!user) return; // not logged in (shouldn't happen in your flow)

  const { error: upsertError } = await supabase.from('quest_status').upsert(
    {
      user_id: user.id,
      date: dateStr,
      completed,
      completed_at: completedAt ?? null,
    },
    { onConflict: 'user_id,date' }
  );

  if (upsertError) {
    console.warn('[questRepository] Supabase upsert failed:', upsertError);
  }
}

/**
 * Mark quest completed for this user on dateStr (local + remote).
 */
export async function markQuestCompleted(dateStr) {
  const completedAt = new Date().toISOString();

  await upsertQuestStatusLocal(dateStr, true, completedAt);
  await upsertQuestStatusRemote(dateStr, true, completedAt);

  return { date: dateStr, completedAt };
}

/**
 * Sync a window of quest_status rows from Supabase → SQLite for this user.
 */
export async function syncQuestStatusWindow(daysBack = 30) {
  const db = await getDb();
  const userId = await getCurrentUserId();

  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - daysBack);

  const todayStr = today.toISOString().slice(0, 10);
  const pastStr = past.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('quest_status')
    .select('user_id, date, completed, completed_at')
    .eq('user_id', userId)
    .gte('date', pastStr)
    .lte('date', todayStr);

  if (error) {
    console.warn('[questRepository] quest_status fetch error:', error);
    return;
  }

  // Clear only this user's rows
  await db.runAsync('DELETE FROM quest_status WHERE user_id = ?', [userId]);

  for (const row of data || []) {
    await db.runAsync(
      `
      INSERT INTO quest_status (user_id, date, completed, completed_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
        completed = excluded.completed,
        completed_at = excluded.completed_at;
      `,
      [
        row.user_id ?? userId,
        row.date,
        row.completed ? 1 : 0,
        row.completed_at ?? null,
      ]
    );
  }
}
