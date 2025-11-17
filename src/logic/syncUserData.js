// // // src/logic/syncUserData.js
// // import { getDb } from '../storage/db';
// // import { supabase } from '../supabase';
// // import { getString, setString } from '../storage/mmkv';

// // // Throttle sync so we don't hammer the network
// // const LAST_SYNC_KEY = 'userSync:last';
// // const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// // function shouldSkipSync() {
// //   try {
// //     const raw = getString(LAST_SYNC_KEY, null);
// //     if (!raw) return false;
// //     const last = Number(raw);
// //     if (!Number.isFinite(last)) return false;
// //     return Date.now() - last < SYNC_INTERVAL_MS;
// //   } catch {
// //     return false;
// //   }
// // }

// // function markSyncedNow() {
// //   try {
// //     setString(LAST_SYNC_KEY, String(Date.now()));
// //   } catch {
// //     // ignore
// //   }
// // }

// // // ---- JOURNAL: server → SQLite (server is source of truth) ----
// // async function syncJournal(db, userId) {
// //   // Pull a *bounded* number of entries to keep cache small
// //   const { data, error } = await supabase
// //     .from('journal_entries')
// //     .select('id, date, virtue, note, created_at, updated_at')
// //     .eq('user_id', userId)
// //     .order('date', { ascending: false })
// //     .limit(200); // last ~200 entries

// //   if (error) {
// //     console.warn('[syncUserData] journal_entries fetch error:', error);
// //     return;
// //   }

// //   // For simplicity, we treat SQLite as a pure cache:
// //   // wipe & re-fill from server.
// //   await db.runAsync('DELETE FROM journal_entries');

// //   for (const row of data || []) {
// //     await db.runAsync(
// //       `
// //       INSERT OR REPLACE INTO journal_entries
// //         (id, date, virtue, note, created_at, updated_at)
// //       VALUES (?, ?, ?, ?, ?, ?);
// //     `,
// //       [
// //         row.id,
// //         row.date, // 'YYYY-MM-DD'
// //         row.virtue || '',
// //         row.note || '',
// //         row.created_at || new Date().toISOString(),
// //         row.updated_at || row.created_at || new Date().toISOString(),
// //       ]
// //     );
// //   }
// // }

// // // ---- QUEST_STATUS: server → SQLite ----
// // async function syncQuestStatus(db, userId) {
// //   const today = new Date();
// //   const past = new Date();
// //   past.setDate(today.getDate() - 30); // last 30 days only

// //   const todayStr = today.toISOString().slice(0, 10);
// //   const pastStr = past.toISOString().slice(0, 10);

// //   const { data, error } = await supabase
// //     .from('quest_status')
// //     .select('date, completed')
// //     .eq('user_id', userId)
// //     .gte('date', pastStr)
// //     .lte('date', todayStr);

// //   if (error) {
// //     console.warn('[syncUserData] quest_status fetch error:', error);
// //     return;
// //   }

// //   // quest_status is tiny; safe to clear and re-fill
// //   await db.runAsync('DELETE FROM quest_status');

// //   for (const row of data || []) {
// //     await db.runAsync(
// //       `
// //       INSERT OR REPLACE INTO quest_status (date, completed)
// //       VALUES (?, ?);
// //     `,
// //       [row.date, row.completed ? 1 : 0]
// //     );
// //   }
// // }

// // // ---- Public API: called on login / app focus ----
// // export async function syncUserData() {
// //   try {
// //     if (shouldSkipSync()) {
// //       return;
// //     }

// //     const {
// //       data: { user },
// //       error: authError,
// //     } = await supabase.auth.getUser();

// //     if (authError || !user) {
// //       // no user → nothing to sync
// //       return;
// //     }

// //     const userId = user.id;
// //     const db = await getDb();

// //     // Do both syncs in a single transaction
// //     await db.execAsync('BEGIN');
// //     try {
// //       await syncJournal(db, userId);
// //       await syncQuestStatus(db, userId);
// //       await db.execAsync('COMMIT');
// //     } catch (e) {
// //       await db.execAsync('ROLLBACK');
// //       throw e;
// //     }

// //     markSyncedNow();
// //   } catch (e) {
// //     console.warn('[syncUserData] Failed:', e);
// //   }
// // }

// // src/logic/syncUserData.js
// import { getDb } from '../storage/db';
// import { supabase } from '../supabase';
// import { getString, setString } from '../storage/mmkv';

// // Throttle sync so we don't hammer the network
// const LAST_SYNC_KEY = 'userSync:last';
// const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// function shouldSkipSync() {
//   try {
//     const raw = getString(LAST_SYNC_KEY, null);
//     if (!raw) return false;
//     const last = Number(raw);
//     if (!Number.isFinite(last)) return false;
//     return Date.now() - last < SYNC_INTERVAL_MS;
//   } catch {
//     return false;
//   }
// }

// function markSyncedNow() {
//   try {
//     setString(LAST_SYNC_KEY, String(Date.now()));
//   } catch {
//     // ignore
//   }
// }

// // ---- JOURNAL: server → SQLite (server is source of truth) ----
// async function syncJournal(db, userId) {
//   const { data, error } = await supabase
//     .from('journal_entries')
//     .select('id, date, virtue, note, created_at, updated_at')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(200); // last ~200 entries

//   if (error) {
//     console.warn('[syncUserData] journal_entries fetch error:', error);
//     return;
//   }

//   // Treat SQLite as a cache: clear & refill for this user
//   await db.runAsync('DELETE FROM journal_entries');

//   for (const row of data || []) {
//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO journal_entries
//         (id, user_id, date, virtue, note, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?);
//     `,
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

// // ---- QUEST_STATUS: server → SQLite ----
// async function syncQuestStatus(db, userId) {
//   const today = new Date();
//   const past = new Date();
//   past.setDate(today.getDate() - 30); // last 30 days only

//   const todayStr = today.toISOString().slice(0, 10);
//   const pastStr = past.toISOString().slice(0, 10);

//   const { data, error } = await supabase
//     .from('quest_status')
//     .select('date, completed') // ⬅️ no updated_at column
//     .eq('user_id', userId)
//     .gte('date', pastStr)
//     .lte('date', todayStr);

//   if (error) {
//     console.warn('[syncUserData] quest_status fetch error:', error);
//     return;
//   }

//   await db.runAsync('DELETE FROM quest_status');

//   for (const row of data || []) {
//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO quest_status (date, completed)
//       VALUES (?, ?);
//     `,
//       [row.date, row.completed ? 1 : 0]
//     );
//   }
// }

// // ---- Public API: called on login / app focus ----
// export async function syncUserData() {
//   try {
//     if (shouldSkipSync()) return;

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       // no user → nothing to sync
//       return;
//     }

//     const userId = user.id;
//     const db = await getDb();

//     // No explicit BEGIN/COMMIT here to avoid nested transaction issues
//     await syncJournal(db, userId);
//     await syncQuestStatus(db, userId);

//     markSyncedNow();
//   } catch (e) {
//     console.warn('[syncUserData] Failed:', e);
//   }
// }

// src/logic/syncUserData.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getString, setString } from '../storage/mmkv';

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
    .limit(200); // last ~200 entries

  if (error) {
    console.warn('[syncUserData] journal_entries fetch error:', error);
    return;
  }

  // Clear ONLY this user's local journal rows
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

// ---- QUEST_STATUS: server → SQLite ----
async function syncQuestStatus(db, userId) {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 30); // last 30 days only

  const todayStr = today.toISOString().slice(0, 10);
  const pastStr = past.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('quest_status')
    .select('user_id, date, completed, completed_at')
    .eq('user_id', userId)
    .gte('date', pastStr)
    .lte('date', todayStr);

  if (error) {
    console.warn('[syncUserData] quest_status fetch error:', error);
    return;
  }

  // Clear ONLY this user's recent window (or keep it simple and clear all for this user)
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
        row.user_id ?? userId, // defensive
        row.date,
        row.completed ? 1 : 0,
        row.completed_at ?? null,
      ]
    );
  }
}

// ---- Public API: called on login / app focus ----
export async function syncUserData() {
  try {
    if (shouldSkipSync()) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // no user → nothing to sync
      return;
    }

    const userId = user.id;
    const db = await getDb();

    // Avoid nested transactions; let each routine handle its own writes
    await syncJournal(db, userId);
    await syncQuestStatus(db, userId);

    markSyncedNow();
  } catch (e) {
    console.warn('[syncUserData] Failed:', e);
  }
}
