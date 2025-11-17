// src/services/syncService.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getString, setString } from '../storage/mmkv';
import { syncQuestStatusWindow } from '../repositories/questRepository';

// Throttle sync so we don't hammer the network
const LAST_SYNC_KEY = 'userSync:last';
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

function shouldSkipSync() {
  try {
    const raw = getString(LAST_SYNC_KEY, null);
    if (!raw) return false;
    const last = Number(raw);
    if (!Number.isFinite(last)) return false;
    return Date.now() - last < SYNC_INTERVAL_MS;
  } catch {
    return false;
  }
}

function markSyncedNow() {
  try {
    setString(LAST_SYNC_KEY, String(Date.now()));
  } catch {
    // ignore
  }
}

// ---- JOURNAL: server → SQLite (server is source of truth) ----
async function syncJournal(db, userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, date, virtue, note, created_at, updated_at')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(200);

  if (error) {
    console.warn('[syncService] journal_entries fetch error:', error);
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

// ---- Public API ----
export async function syncUserDataService() {
  try {
    if (shouldSkipSync()) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return;
    }

    const userId = user.id;
    const db = await getDb();

    await syncJournal(db, userId);
    await syncQuestStatusWindow(30);

    markSyncedNow();
  } catch (e) {
    console.warn('[syncService] Failed:', e);
  }
}
