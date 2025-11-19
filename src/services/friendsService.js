// src/services/friendsService.js
import { supabase } from '../supabase';
import { getCurrentUserId } from '../repositories/questRepository';

import {
  syncFriendsFromServer,
  fetchFriendsAndIncomingRemote,
  acceptFriendshipRemote,
  deleteFriendshipRemoteById,
  deleteFriendshipRemoteByPair,
  deleteFriendshipLocal,
  verifyFriendPairGone, // ← add this import
} from '../repositories/friendsRepository';

/**
 * Load incoming + accepted lists shaped for the screen.
 * - Pull fresh snapshot (server → local, if you cache)
 * - Return shaped arrays: { incoming: [...], friends: [...] }
 */
export async function loadFriendLists() {
  await syncFriendsFromServer();

  const meId = await getCurrentUserId();
  const { incoming, accepted } = await fetchFriendsAndIncomingRemote(meId);

  return {
    // incoming requests → requester is the "other person"
    incoming: (incoming || []).map((row) => ({
      friendship_id: row.id,
      person: row.requester,
    })),
    // accepted → figure out which side is "other"
    friends: (accepted || []).map((row) => {
      const other = row.requester?.id === meId ? row.addressee : row.requester;
      return { friendship_id: row.id, person: other };
    }),
  };
}

/**
 * Accept a pending request (by friendship row id), then refresh snapshot.
 */
export async function acceptFriendRequest(friendshipId) {
  await acceptFriendshipRemote(friendshipId);
  await syncFriendsFromServer();
}

/**
 * Decline a pending request (delete the row), then refresh snapshot.
 */
export async function declineFriendRequest(friendshipId) {
  await deleteFriendshipRemoteById(friendshipId);
  await syncFriendsFromServer();
}

/**
 * Remove an existing friendship. If we have the row id, use it; otherwise
 * fall back to pair delete. Also applies local optimistic cleanup.
 */
export async function removeFriendship(friendshipId, otherUserId) {
  // 0) Optimistic local cleanup for snappy UI
  await deleteFriendshipLocal({ friendshipId, otherUserId });

  // 1) Try to delete the concrete row (if we know its id)
  if (friendshipId) {
    try {
      await deleteFriendshipRemoteById(friendshipId);
    } catch (e) {
      // Log but continue to pair-delete (covers reverse-direction row)
      console.warn(
        '[friendsService] delete-by-id failed, will pair-delete:',
        e?.message || e
      );
    }
  }

  // 2) Always perform pair-delete to remove any reverse row
  if (otherUserId) {
    await deleteFriendshipRemoteByPair(otherUserId);
  }

  // 3) Verify the pair is truly gone; if not, surface a clear error
  if (otherUserId) {
    const leftovers = await verifyFriendPairGone(otherUserId);
    if (leftovers.length) {
      throw new Error(
        'The friendship still exists on the server (RLS/policy preventing delete).'
      );
    }

    await syncFriendsFromServer();
  }
}
/**
 * Send a friend request to targetUserId, idempotently.
 * Behavior:
 * - If a reverse pending exists (they asked you), auto-accept it.
 * - If you're already friends (either direction), return quietly.
 * - Otherwise UPSERT (requester_id, addressee_id) → status='pending'.
 */
export async function sendFriendRequest(targetUserId) {
  const me = await getCurrentUserId();
  if (!me) throw new Error('Not signed in.');
  if (!targetUserId) throw new Error('Missing target user.');
  if (me === targetUserId) throw new Error('You cannot friend yourself.');

  // 1) If THEY already requested ME → accept their pending
  {
    const { data: reverse, error: revErr } = await supabase
      .from('friendships')
      .select('id,status,requester_id,addressee_id')
      .eq('requester_id', targetUserId)
      .eq('addressee_id', me)
      .limit(1);

    if (revErr) throw revErr;

    if (reverse && reverse.length) {
      const row = reverse[0];
      if (row.status === 'blocked') {
        throw new Error('A block exists between these accounts.');
      }
      if (row.status === 'pending') {
        const { error: accErr } = await supabase
          .from('friendships')
          .update({ status: 'accepted' })
          .eq('id', row.id);
        if (accErr) throw accErr;
        await syncFriendsFromServer();
        return; // accepted reverse; done
      }
      if (row.status === 'accepted') {
        // already friends via reverse direction
        return;
      }
    }
  }

  // 2) If a row already exists in THIS direction, handle idempotently
  {
    const { data: sameDir, error: sdErr } = await supabase
      .from('friendships')
      .select('id,status')
      .eq('requester_id', me)
      .eq('addressee_id', targetUserId)
      .limit(1);

    if (sdErr) throw sdErr;

    if (sameDir && sameDir.length) {
      const row = sameDir[0];
      if (row.status === 'blocked') {
        throw new Error('A block exists between these accounts.');
      }
      if (row.status === 'accepted') {
        // already friends in this direction
        return;
      }
      if (row.status === 'pending') {
        // already pending; treat as success
        return;
      }
    }
  }

  // 3) Idempotent create using UPSERT on (requester_id, addressee_id)
  const { error: upsertErr } = await supabase.from('friendships').upsert(
    {
      requester_id: me,
      addressee_id: targetUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    { onConflict: 'requester_id,addressee_id' }
  );

  if (upsertErr) {
    // If policies or existing accepted rows block changes, surface friendly msg
    if (
      (upsertErr.message || '').toLowerCase().includes('duplicate key') ||
      upsertErr.code === '23505'
    ) {
      throw new Error('A friendship already exists or is pending.');
    }
    throw upsertErr;
  }

  await syncFriendsFromServer();
}

/**
 * Used by syncService to refresh friends locally (if you cache).
 */
export async function syncFriends() {
  await syncFriendsFromServer();
}
