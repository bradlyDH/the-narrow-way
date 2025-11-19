// // src/repositories/friendsRepository.js
// import { supabase } from '../supabase';
// import { getDb } from '../storage/db';
// import { getCurrentUserId } from './questRepository';

// // ------------------------------
// // Local schema bootstrap
// // ------------------------------
// async function ensureLocalTables() {
//   const db = await getDb();

//   // 1) Create table if missing (columns nullable for migration safety)
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS friendships (
//       id TEXT PRIMARY KEY NOT NULL,
//       requester_id TEXT,
//       addressee_id TEXT,
//       status TEXT NOT NULL,
//       created_at TEXT,
//       updated_at TEXT
//     );
//   `);

//   // 2) Introspect existing columns
//   let cols = [];
//   try {
//     cols = await db.getAllAsync('PRAGMA table_info(friendships);');
//   } catch (e) {
//     cols = [];
//   }
//   const has = (name) => (cols || []).some((c) => c.name === name);

//   // 3) Add any missing columns (older installs)
//   if (!has('requester_id')) {
//     try {
//       await db.runAsync(
//         'ALTER TABLE friendships ADD COLUMN requester_id TEXT;'
//       );
//     } catch (e) {}
//   }
//   if (!has('addressee_id')) {
//     try {
//       await db.runAsync(
//         'ALTER TABLE friendships ADD COLUMN addressee_id TEXT;'
//       );
//     } catch (e) {}
//   }
//   if (!has('updated_at')) {
//     try {
//       await db.runAsync('ALTER TABLE friendships ADD COLUMN updated_at TEXT;');
//     } catch (e) {}
//     try {
//       const nowIso = new Date().toISOString();
//       await db.runAsync(
//         'UPDATE friendships SET updated_at = COALESCE(updated_at, COALESCE(created_at, ?));',
//         [nowIso]
//       );
//     } catch (e) {}
//   }

//   // 4) Create composite index (after columns exist)
//   try {
//     await db.execAsync(`
//       CREATE INDEX IF NOT EXISTS idx_friend_pairs
//       ON friendships (requester_id, addressee_id);
//     `);
//   } catch (e) {
//     // ignore
//   }
// }

// // ------------------------------
// // Remote reads (server)
// // ------------------------------
// export async function fetchFriendsAndIncomingRemote(myId) {
//   // Incoming (others -> me, pending)
//   const incRes = await supabase
//     .from('friendships')
//     .select(
//       `
//       id, status, created_at,
//       requester:requester_id ( id, display_name, short_id ),
//       addressee:addressee_id ( id, display_name, short_id )
//     `
//     )
//     .eq('addressee_id', myId)
//     .eq('status', 'pending')
//     .order('created_at', { ascending: false });

//   if (incRes.error) {
//     console.log('[FRIENDS][fetch incoming] error:', {
//       message: incRes.error.message,
//       details: incRes.error.details,
//       hint: incRes.error.hint,
//       code: incRes.error.code,
//     });
//     throw incRes.error;
//   }

//   // Accepted where I am requester OR addressee
//   const accRes = await supabase
//     .from('friendships')
//     .select(
//       `
//       id, status, created_at,
//       requester:requester_id ( id, display_name, short_id ),
//       addressee:addressee_id ( id, display_name, short_id )
//     `
//     )
//     .eq('status', 'accepted')
//     .or(`requester_id.eq.${myId},addressee_id.eq.${myId}`)
//     .order('created_at', { ascending: false });

//   if (accRes.error) {
//     console.log('[FRIENDS][fetch accepted] error:', {
//       message: accRes.error.message,
//       details: accRes.error.details,
//       hint: accRes.error.hint,
//       code: accRes.error.code,
//     });
//     throw accRes.error;
//   }

//   return {
//     incoming: incRes.data || [],
//     accepted: accRes.data || [],
//   };
// }

// // ------------------------------
// // Local snapshot replace (SQLite)
// // ------------------------------
// export async function replaceLocalFriendSnapshot(payload, myId) {
//   await ensureLocalTables();
//   const db = await getDb();

//   await db.runAsync('DELETE FROM friendships');

//   const list = []
//     .concat(payload && payload.incoming ? payload.incoming : [])
//     .concat(payload && payload.accepted ? payload.accepted : []);

//   for (let i = 0; i < list.length; i++) {
//     const r = list[i];
//     const row = {
//       id: r.id,
//       requester_id: r.requester && r.requester.id ? r.requester.id : null,
//       addressee_id: r.addressee && r.addressee.id ? r.addressee.id : null,
//       status: r.status,
//       created_at: r.created_at || new Date().toISOString(),
//       updated_at: new Date().toISOString(),
//     };

//     try {
//       await db.runAsync(
//         `
//         INSERT OR REPLACE INTO friendships
//           (id, requester_id, addressee_id, status, created_at, updated_at)
//         VALUES (?, ?, ?, ?, ?, ?);
//         `,
//         [
//           row.id,
//           row.requester_id,
//           row.addressee_id,
//           row.status,
//           row.created_at,
//           row.updated_at,
//         ]
//       );
//     } catch (e) {
//       console.log(
//         '[FRIENDS][replaceLocalFriendSnapshot] insert error:',
//         e?.message || String(e)
//       );
//     }
//   }
// }

// // ------------------------------
// // Helpers
// // ------------------------------
// export async function findAnyFriendshipPair(otherUserId) {
//   const me = await getCurrentUserId();
//   console.log(
//     '[FRIENDS][findAnyFriendshipPair] me:',
//     me,
//     'other:',
//     otherUserId
//   );

//   const res = await supabase
//     .from('friendships')
//     .select('id,status,requester_id,addressee_id')
//     .or(
//       `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
//     );

//   if (res.error) {
//     console.log('[FRIENDS][findAnyFriendshipPair] error:', {
//       message: res.error.message,
//       details: res.error.details,
//       hint: res.error.hint,
//       code: res.error.code,
//     });
//     throw res.error;
//   }

//   console.log(
//     '[FRIENDS][findAnyFriendshipPair] rows:',
//     (res.data || []).length
//   );
//   return res.data || [];
// }

// export async function clearNonBlockedPairRemote(otherUserId) {
//   const me = await getCurrentUserId();
//   const orMatch =
//     `and(requester_id.eq.${me},addressee_id.eq.${otherUserId},status.neq.blocked),` +
//     `and(requester_id.eq.${otherUserId},addressee_id.eq.${me},status.neq.blocked)`;

//   console.log('[FRIENDS][clearNonBlockedPairRemote] orMatch:', orMatch);

//   const res = await supabase
//     .from('friendships')
//     .delete()
//     .or(orMatch)
//     .select('id,requester_id,addressee_id,status');

//   if (res.error) {
//     console.log('[FRIENDS][clearNonBlockedPairRemote] error:', {
//       message: res.error.message,
//       details: res.error.details,
//       hint: res.error.hint,
//       code: res.error.code,
//     });
//     throw res.error;
//   }

//   console.log('[FRIENDS][clearNonBlockedPairRemote] deleted:', res.data || []);
//   return res.data || [];
// }

// export async function verifyFriendPairGone(otherUserId) {
//   const me = await getCurrentUserId();
//   const res = await supabase
//     .from('friendships')
//     .select('id,requester_id,addressee_id,status')
//     .or(
//       `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
//         `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
//     );
//   if (res.error) throw res.error;
//   return res.data || [];
// }

// // ------------------------------
// // Sync (server -> local)
// // ------------------------------
// export async function syncFriendsFromServer() {
//   const me = await getCurrentUserId();
//   const data = await fetchFriendsAndIncomingRemote(me);
//   await replaceLocalFriendSnapshot(data, me);
// }

// // ------------------------------
// // Remote mutations
// // ------------------------------
// export async function acceptFriendshipRemote(friendshipId) {
//   console.log('[FRIENDS][accept] id:', friendshipId);
//   const res = await supabase
//     .from('friendships')
//     .update({ status: 'accepted' })
//     .eq('id', friendshipId);

//   if (res.error) {
//     console.log('[FRIENDS][accept] error:', {
//       message: res.error.message,
//       details: res.error.details,
//       hint: res.error.hint,
//       code: res.error.code,
//     });
//     throw res.error;
//   }
//   console.log('[FRIENDS][accept] success');
// }

// export async function deleteFriendshipRemoteById(friendshipId) {
//   console.log('[FRIENDS][delete by id] id:', friendshipId);
//   const res = await supabase
//     .from('friendships')
//     .delete()
//     .eq('id', friendshipId)
//     .select('id,requester_id,addressee_id,status');

//   if (res.error) {
//     console.log('[FRIENDS][delete by id] error:', {
//       message: res.error.message,
//       details: res.error.details,
//       hint: res.error.hint,
//       code: res.error.code,
//     });
//     throw res.error;
//   }

//   console.log('[FRIENDS][delete by id] deleted:', res.data || []);
//   return res.data || [];
// }

// export async function deleteFriendshipRemoteByPair(otherUserId) {
//   const me = await getCurrentUserId();
//   const orMatch =
//     `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
//     `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`;

//   console.log('[FRIENDS][delete by pair] me:', me, 'other:', otherUserId);
//   console.log('[FRIENDS][delete by pair] orMatch:', orMatch);

//   const res = await supabase
//     .from('friendships')
//     .delete()
//     .or(orMatch)
//     .select('id,requester_id,addressee_id,status');

//   if (res.error) {
//     console.log('[FRIENDS][delete by pair] error:', {
//       message: res.error.message,
//       details: res.error.details,
//       hint: res.error.hint,
//       code: res.error.code,
//     });
//     throw res.error;
//   }

//   console.log('[FRIENDS][delete by pair] deleted:', res.data || []);
//   return res.data || [];
// }

// // Back-compat alias
// export async function deleteFriendshipRemote(friendshipId) {
//   return deleteFriendshipRemoteById(friendshipId);
// }

// // ------------------------------
// // Local cleanup (optimistic UI)
// // ------------------------------
// export async function deleteFriendshipLocal({ friendshipId, otherUserId }) {
//   await ensureLocalTables();
//   const db = await getDb();
//   const me = await getCurrentUserId();

//   console.log(
//     '[FRIENDS][local delete] friendshipId:',
//     friendshipId,
//     'otherUserId:',
//     otherUserId
//   );

//   if (friendshipId) {
//     try {
//       await db.runAsync('DELETE FROM friendships WHERE id = ?;', [
//         friendshipId,
//       ]);
//       console.log('[FRIENDS][local delete] removed by id from SQLite');
//     } catch (e) {
//       console.log(
//         '[FRIENDS][local delete] error (by id):',
//         e?.message || String(e)
//       );
//     }
//   }
//   if (otherUserId) {
//     try {
//       await db.runAsync(
//         `
//         DELETE FROM friendships
//         WHERE (requester_id = ? AND addressee_id = ?)
//            OR (requester_id = ? AND addressee_id = ?);
//         `,
//         [me, otherUserId, otherUserId, me]
//       );
//       console.log('[FRIENDS][local delete] removed by pair from SQLite');
//     } catch (e) {
//       console.log(
//         '[FRIENDS][local delete] error (by pair):',
//         e?.message || String(e)
//       );
//     }
//   }
// }

// // (Optional) quick local schema dump for debugging
// export async function __debugDescribeLocalFriendships() {
//   try {
//     const db = await getDb();
//     const cols = await db.getAllAsync('PRAGMA table_info(friendships);');
//     console.log('[FRIENDS][local schema] columns:', cols);
//     const sample = await db.getAllAsync('SELECT * FROM friendships LIMIT 5;');
//     console.log('[FRIENDS][local sample] rows:', sample);
//   } catch (e) {
//     console.log('[FRIENDS][local schema] error:', e?.message || String(e));
//   }
// }

// src/repositories/friendsRepository.js
import { supabase } from '../supabase';
import { getDb } from '../storage/db';
import { getCurrentUserId } from './questRepository';
import { createTaggedLogger } from '../utils/logger';

const L = createTaggedLogger('FRIENDS:repo');

// ------------------------------
// Local schema bootstrap
// ------------------------------
async function ensureLocalTables() {
  const db = await getDb();

  // 1) Create table if missing (columns nullable for migration safety)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS friendships (
      id TEXT PRIMARY KEY NOT NULL,
      requester_id TEXT,
      addressee_id TEXT,
      status TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  // 2) Introspect existing columns
  let cols = [];
  try {
    cols = await db.getAllAsync('PRAGMA table_info(friendships);');
  } catch (e) {
    cols = [];
  }
  const has = (name) => (cols || []).some((c) => c.name === name);

  // 3) Add any missing columns (older installs)
  if (!has('requester_id')) {
    try {
      await db.runAsync(
        'ALTER TABLE friendships ADD COLUMN requester_id TEXT;'
      );
    } catch (e) {
      L.warn('adding requester_id failed (ok if exists):', e?.message || e);
    }
  }
  if (!has('addressee_id')) {
    try {
      await db.runAsync(
        'ALTER TABLE friendships ADD COLUMN addressee_id TEXT;'
      );
    } catch (e) {
      L.warn('adding addressee_id failed (ok if exists):', e?.message || e);
    }
  }
  if (!has('updated_at')) {
    try {
      await db.runAsync('ALTER TABLE friendships ADD COLUMN updated_at TEXT;');
    } catch (e) {
      L.warn('adding updated_at failed (ok if exists):', e?.message || e);
    }
    try {
      const nowIso = new Date().toISOString();
      await db.runAsync(
        'UPDATE friendships SET updated_at = COALESCE(updated_at, COALESCE(created_at, ?));',
        [nowIso]
      );
    } catch (e) {
      L.warn('backfill updated_at failed (ok):', e?.message || e);
    }
  }

  // 4) Create composite index (after columns exist)
  try {
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_friend_pairs
      ON friendships (requester_id, addressee_id);
    `);
  } catch (e) {
    L.warn('create idx_friend_pairs failed (ok):', e?.message || e);
  }
}

// ------------------------------
// Remote reads (server)
// ------------------------------
export async function fetchFriendsAndIncomingRemote(myId) {
  // Incoming (others -> me, pending)
  const incRes = await supabase
    .from('friendships')
    .select(
      `
      id, status, created_at,
      requester:requester_id ( id, display_name, short_id ),
      addressee:addressee_id ( id, display_name, short_id )
    `
    )
    .eq('addressee_id', myId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (incRes.error) {
    L.error('fetch incoming error:', incRes.error);
    throw incRes.error;
  }

  // Accepted where I am requester OR addressee
  const accRes = await supabase
    .from('friendships')
    .select(
      `
      id, status, created_at,
      requester:requester_id ( id, display_name, short_id ),
      addressee:addressee_id ( id, display_name, short_id )
    `
    )
    .eq('status', 'accepted')
    .or(`requester_id.eq.${myId},addressee_id.eq.${myId}`)
    .order('created_at', { ascending: false });

  if (accRes.error) {
    L.error('fetch accepted error:', accRes.error);
    throw accRes.error;
  }

  L.debug(
    'fetch: incoming:',
    (incRes.data || []).length,
    'accepted:',
    (accRes.data || []).length
  );
  return { incoming: incRes.data || [], accepted: accRes.data || [] };
}

// ------------------------------
// Local snapshot replace (SQLite)
// ------------------------------
export async function replaceLocalFriendSnapshot(payload, myId) {
  await ensureLocalTables();
  const db = await getDb();

  await db.runAsync('DELETE FROM friendships');

  const list = []
    .concat(payload?.incoming ?? [])
    .concat(payload?.accepted ?? []);

  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    const row = {
      id: r.id,
      requester_id: r.requester?.id ?? null,
      addressee_id: r.addressee?.id ?? null,
      status: r.status,
      created_at: r.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await db.runAsync(
        `
        INSERT OR REPLACE INTO friendships
          (id, requester_id, addressee_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?);
        `,
        [
          row.id,
          row.requester_id,
          row.addressee_id,
          row.status,
          row.created_at,
          row.updated_at,
        ]
      );
    } catch (e) {
      L.warn('replaceLocal insert error:', e?.message || String(e));
    }
  }
  L.debug('replaceLocal snapshot complete. rows:', list.length);
}

// ------------------------------
// Helpers
// ------------------------------
export async function findAnyFriendshipPair(otherUserId) {
  const me = await getCurrentUserId();
  L.debug('findAnyFriendshipPair me:', me, 'other:', otherUserId);

  const res = await supabase
    .from('friendships')
    .select('id,status,requester_id,addressee_id')
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
    );

  if (res.error) {
    L.error('findAnyFriendshipPair error:', res.error);
    throw res.error;
  }

  L.debug('findAnyFriendshipPair rows:', (res.data || []).length);
  return res.data || [];
}

export async function clearNonBlockedPairRemote(otherUserId) {
  const me = await getCurrentUserId();
  const orMatch =
    `and(requester_id.eq.${me},addressee_id.eq.${otherUserId},status.neq.blocked),` +
    `and(requester_id.eq.${otherUserId},addressee_id.eq.${me},status.neq.blocked)`;

  L.debug('clearNonBlockedPairRemote orMatch:', orMatch);

  const res = await supabase
    .from('friendships')
    .delete()
    .or(orMatch)
    .select('id,requester_id,addressee_id,status');

  if (res.error) {
    L.error('clearNonBlockedPairRemote error:', res.error);
    throw res.error;
  }

  L.info('clearNonBlockedPairRemote deleted:', res.data || []);
  return res.data || [];
}

export async function verifyFriendPairGone(otherUserId) {
  const me = await getCurrentUserId();
  const res = await supabase
    .from('friendships')
    .select('id,requester_id,addressee_id,status')
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
        `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
    );
  if (res.error) throw res.error;
  return res.data || [];
}

// ------------------------------
// Sync (server -> local)
// ------------------------------
export async function syncFriendsFromServer() {
  const me = await getCurrentUserId();
  L.debug('syncFriendsFromServer start for user:', me);
  const data = await fetchFriendsAndIncomingRemote(me);
  await replaceLocalFriendSnapshot(data, me);
  L.debug('syncFriendsFromServer done');
}

// ------------------------------
// Remote mutations
// ------------------------------
export async function acceptFriendshipRemote(friendshipId) {
  L.info('[accept] id:', friendshipId);
  const res = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId);

  if (res.error) {
    L.error('[accept] error:', res.error);
    throw res.error;
  }
  L.info('[accept] success');
}

export async function deleteFriendshipRemoteById(friendshipId) {
  L.info('[delete by id] id:', friendshipId);
  const res = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
    .select('id,requester_id,addressee_id,status');

  if (res.error) {
    L.error('[delete by id] error:', res.error);
    throw res.error;
  }

  L.info('[delete by id] deleted:', res.data || []);
  return res.data || [];
}

export async function deleteFriendshipRemoteByPair(otherUserId) {
  const me = await getCurrentUserId();
  const orMatch =
    `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
    `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`;

  L.info('[delete by pair] me:', me, 'other:', otherUserId);
  L.debug('[delete by pair] orMatch:', orMatch);

  const res = await supabase
    .from('friendships')
    .delete()
    .or(orMatch)
    .select('id,requester_id,addressee_id,status');

  if (res.error) {
    L.error('[delete by pair] error:', res.error);
    throw res.error;
  }

  L.info('[delete by pair] deleted:', res.data || []);
  return res.data || [];
}

// Back-compat alias
export async function deleteFriendshipRemote(friendshipId) {
  return deleteFriendshipRemoteById(friendshipId);
}

// ------------------------------
// Local cleanup (optimistic UI)
// ------------------------------
export async function deleteFriendshipLocal({ friendshipId, otherUserId }) {
  await ensureLocalTables();
  const db = await getDb();
  const me = await getCurrentUserId();

  L.debug(
    '[local delete] friendshipId:',
    friendshipId,
    'otherUserId:',
    otherUserId
  );

  if (friendshipId) {
    try {
      await db.runAsync('DELETE FROM friendships WHERE id = ?;', [
        friendshipId,
      ]);
      L.debug('[local delete] removed by id from SQLite');
    } catch (e) {
      L.warn('[local delete] error (by id):', e?.message || String(e));
    }
  }
  if (otherUserId) {
    try {
      await db.runAsync(
        `
        DELETE FROM friendships
        WHERE (requester_id = ? AND addressee_id = ?)
           OR (requester_id = ? AND addressee_id = ?);
        `,
        [me, otherUserId, otherUserId, me]
      );
      L.debug('[local delete] removed by pair from SQLite');
    } catch (e) {
      L.warn('[local delete] error (by pair):', e?.message || String(e));
    }
  }
}

// Optional quick local schema dump (for one-off debugging)
export async function __debugDescribeLocalFriendships() {
  try {
    const db = await getDb();
    const cols = await db.getAllAsync('PRAGMA table_info(friendships);');
    L.info('[local schema] columns:', cols);
    const sample = await db.getAllAsync('SELECT * FROM friendships LIMIT 5;');
    L.info('[local sample] rows:', sample);
  } catch (e) {
    L.warn('[local schema] error:', e?.message || String(e));
  }
}
