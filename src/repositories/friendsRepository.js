// src/repositories/friendsRepository.js
import { supabase } from '../supabase';
import { getDb } from '../storage/db';
import { getCurrentUserId } from './questRepository';

// --- OPTIONAL: ensure local table (only if you cache friendships locally)
async function ensureLocalTables() {
  const db = await getDb();

  // Create if missing (with our full, current shape)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS friendships (
      id TEXT PRIMARY KEY NOT NULL,
      requester_id TEXT,     -- make nullable for migration safety
      addressee_id TEXT,     -- make nullable for migration safety
      status TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT        -- make nullable for migration safety
    );
    CREATE INDEX IF NOT EXISTS idx_friend_pairs
      ON friendships (requester_id, addressee_id);
  `);

  // Introspect existing columns to add any that are missing (older installs)
  let cols = [];
  try {
    cols = await db.getAllAsync(`PRAGMA table_info(friendships);`);
  } catch {
    cols = [];
  }

  const has = (name) => (cols || []).some((c) => c.name === name);

  // ⚠️ Add missing columns as NULLable so we don't violate existing rows
  if (!has('requester_id')) {
    try {
      await db.runAsync(
        `ALTER TABLE friendships ADD COLUMN requester_id TEXT;`
      );
    } catch {}
  }
  if (!has('addressee_id')) {
    try {
      await db.runAsync(
        `ALTER TABLE friendships ADD COLUMN addressee_id TEXT;`
      );
    } catch {}
  }
  if (!has('updated_at')) {
    try {
      await db.runAsync(`ALTER TABLE friendships ADD COLUMN updated_at TEXT;`);
    } catch {}
    // Backfill updated_at to something sane so future NOT NULL expectations don't fail
    try {
      const nowIso = new Date().toISOString();
      await db.runAsync(
        `UPDATE friendships SET updated_at = COALESCE(updated_at, COALESCE(created_at, ?));`,
        [nowIso]
      );
    } catch {}
  }
}

// ---- Reads from server (used by sync) ----
export async function fetchFriendsAndIncomingRemote(myId) {
  // incoming pending → me
  const { data: incoming, error: incErr } = await supabase
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

  if (incErr) throw incErr;

  // accepted where I’m requester or addressee
  const { data: accepted, error: accErr } = await supabase
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

  if (accErr) throw accErr;

  return { incoming: incoming || [], accepted: accepted || [] };
}

// ---- Local write helpers (if you cache friendships in SQLite) ----
export async function replaceLocalFriendSnapshot({ incoming, accepted }, myId) {
  await ensureLocalTables();
  const db = await getDb();

  // Clear snapshot (optional: only for simplicity)
  await db.runAsync(`DELETE FROM friendships`);

  const toRow = (row) => ({
    id: row.id,
    requester_id: row.requester?.id,
    addressee_id: row.addressee?.id,
    status: row.status,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(), // ensure NOT NULL
  });

  for (const r of [...(incoming || []), ...(accepted || [])]) {
    const row = toRow(r);
    await db.runAsync(
      `INSERT OR REPLACE INTO friendships
       (id, requester_id, addressee_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        row.id,
        row.requester_id,
        row.addressee_id,
        row.status,
        row.created_at,
        row.updated_at,
      ]
    );
  }
}

// Find any friendship rows between me and otherUserId (either direction)
export async function findAnyFriendshipPair(otherUserId) {
  const me = await getCurrentUserId();
  const { data, error } = await supabase
    .from('friendships')
    .select('id,status,requester_id,addressee_id')
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
    );
  if (error) throw error;
  return data || [];
}

// Delete any non-blocked friendship rows between the pair (both directions)
export async function clearNonBlockedPairRemote(otherUserId) {
  const me = await getCurrentUserId();
  const { error } = await supabase
    .from('friendships')
    .delete()
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId},status.neq.blocked),` +
        `and(requester_id.eq.${otherUserId},addressee_id.eq.${me},status.neq.blocked)`
    );
  if (error) throw error;
}

export async function verifyFriendPairGone(otherUserId) {
  const me = await getCurrentUserId();
  const { data, error } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id, status')
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
        `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
    );
  if (error) throw error;
  return data || [];
}

export async function syncFriendsFromServer() {
  const me = await getCurrentUserId();
  const data = await fetchFriendsAndIncomingRemote(me);
  await replaceLocalFriendSnapshot(data, me);
}

// ---- Mutations (remote) ----
export async function acceptFriendshipRemote(friendshipId) {
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId);
  if (error) throw error;
}

export async function deleteFriendshipRemoteById(friendshipId) {
  const { data, error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)
    .select('id'); // returns deleted row when allowed
  if (error) throw error;
  return data || [];
}

export async function deleteFriendshipRemoteByPair(otherUserId) {
  const me = await getCurrentUserId();
  const { data, error } = await supabase
    .from('friendships')
    .delete()
    .or(
      `and(requester_id.eq.${me},addressee_id.eq.${otherUserId}),` +
        `and(requester_id.eq.${otherUserId},addressee_id.eq.${me})`
    )
    .select('id'); // returns deleted rows
  if (error) throw error;
  return data || [];
}

// ---- Backward-compat export (old name used somewhere) ----
export async function deleteFriendshipRemote(friendshipId) {
  // Prefer delete by id; callers that need pair should use deleteFriendshipRemoteByPair
  return deleteFriendshipRemoteById(friendshipId);
}

// ---- Local cleanup (optional but nice for instant UI) ----
export async function deleteFriendshipLocal({ friendshipId, otherUserId }) {
  await ensureLocalTables();
  const db = await getDb();
  const me = await getCurrentUserId();

  if (friendshipId) {
    try {
      await db.runAsync(`DELETE FROM friendships WHERE id = ?;`, [
        friendshipId,
      ]);
    } catch {}
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
    } catch {}
  }
}
