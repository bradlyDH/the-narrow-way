// // src/services/syncService.js
// import { getDb } from '../storage/db';
// import { supabase } from '../supabase';
// import { getString, setString } from '../storage/mmkv';
// import { syncQuestStatusWindow } from '../repositories/questRepository';
// import { syncPrayers } from './prayerService';
// import { syncFriends } from './friendsService';
// import { syncFriendsFromServer } from '../repositories/friendsRepository';

// const LAST_SYNC_KEY = 'userSync:last';
// const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// let friendsRtChannel = null;

// async function startFriendsRealtime() {
//   try {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     // Tear down any prior channel
//     if (friendsRtChannel) {
//       supabase.removeChannel(friendsRtChannel);
//       friendsRtChannel = null;
//     }

//     const reqFilter = `requester_id=eq.${user.id}`;
//     const addFilter = `addressee_id=eq.${user.id}`;
//     console.log('[friends-global-rt] filters:', reqFilter, addFilter);

//     friendsRtChannel = supabase
//       .channel('friends-global-rt')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'friendships',
//           filter: reqFilter,
//         },
//         async () => {
//           try {
//             await syncFriendsFromServer();
//           } catch (e) {
//             console.warn(
//               '[syncService] friends sync (req) failed:',
//               e?.message || e
//             );
//           }
//         }
//       )
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'friendships',
//           filter: addFilter,
//         },
//         async () => {
//           try {
//             await syncFriendsFromServer();
//           } catch (e) {
//             console.warn(
//               '[syncService] friends sync (add) failed:',
//               e?.message || e
//             );
//           }
//         }
//       )
//       .subscribe();
//   } catch (e) {
//     console.warn('[syncService] startFriendsRealtime error:', e?.message || e);
//   }
// }

// export function stopFriendsRealtime() {
//   if (friendsRtChannel) {
//     supabase.removeChannel(friendsRtChannel);
//     friendsRtChannel = null;
//   }
// }

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
// // kept here for now until journalRepository covers reads fully
// async function syncJournal(db, userId) {
//   const { data, error } = await supabase
//     .from('journal_entries')
//     .select('id, date, virtue, note, created_at, updated_at')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//     .limit(200);

//   if (error) {
//     console.warn('[syncService] journal_entries fetch error:', error);
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

// // ---- Public API ----
// export async function syncUserDataService() {
//   try {
//     if (shouldSkipSync()) return;

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) return;

//     const userId = user.id;
//     const db = await getDb();

//     // Core feature syncs
//     await syncJournal(db, userId);
//     await syncQuestStatusWindow(30); // quests: last 30 days
//     await syncPrayers(200); // prayers: recent
//     await syncFriends(); // friendships: recent (normal refresh)

//     // --- Hard refresh friendships snapshot to avoid stale resurrects ---
//     try {
//       await db.runAsync('DELETE FROM friendships'); // local cache only
//     } catch {}
//     await syncFriendsFromServer();

//     // Realtime after data is in a known-good state
//     await startFriendsRealtime();

//     markSyncedNow();
//   } catch (e) {
//     console.warn('[syncService] Failed:', e);
//   }
// }

// src/services/syncService.js
import { getDb } from '../storage/db';
import { supabase } from '../supabase';
import { getString, setString } from '../storage/mmkv';
import { syncQuestStatusWindow } from '../repositories/questRepository';
import { syncPrayers } from './prayerService';
import { syncFriends } from './friendsService';
import { syncFriendsFromServer } from '../repositories/friendsRepository';
import { createTaggedLogger } from '../utils/logger';

const L = createTaggedLogger('syncService');

const LAST_SYNC_KEY = 'userSync:last';
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let friendsRtChannel = null;

async function startFriendsRealtime() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (friendsRtChannel) {
      supabase.removeChannel(friendsRtChannel);
      friendsRtChannel = null;
    }

    const reqFilter = `requester_id=eq.${user.id}`;
    const addFilter = `addressee_id=eq.${user.id}`;
    L.info('[global-rt] filters:', reqFilter, addFilter);

    friendsRtChannel = supabase
      .channel('friends-global-rt')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: reqFilter,
        },
        async () => {
          try {
            await syncFriendsFromServer();
          } catch (e) {
            L.warn('friends sync (req) failed:', e?.message || e);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: addFilter,
        },
        async () => {
          try {
            await syncFriendsFromServer();
          } catch (e) {
            L.warn('friends sync (add) failed:', e?.message || e);
          }
        }
      )
      .subscribe();
  } catch (e) {
    L.warn('startFriendsRealtime error:', e?.message || e);
  }
}

export function stopFriendsRealtime() {
  if (friendsRtChannel) {
    supabase.removeChannel(friendsRtChannel);
    friendsRtChannel = null;
  }
}

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

async function syncJournal(db, userId) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('id, date, virtue, note, created_at, updated_at')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(200);

  if (error) {
    L.warn('journal_entries fetch error:', error);
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

    if (authError || !user) return;

    const userId = user.id;
    const db = await getDb();

    // Core feature syncs
    await syncJournal(db, userId);
    await syncQuestStatusWindow(30);
    await syncPrayers(200);
    await syncFriends(); // quick refresh

    // Hard refresh friendships snapshot to avoid stale resurrects
    try {
      await db.runAsync('DELETE FROM friendships');
    } catch (e) {
      L.warn('clearing local friendships failed (ok):', e?.message || e);
    }
    await syncFriendsFromServer();

    // Realtime after snapshot is fresh
    await startFriendsRealtime();

    markSyncedNow();
  } catch (e) {
    L.warn('Failed:', e);
  }
}
