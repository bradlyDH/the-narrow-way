// src/services/outboxService.js
import { supabase } from '../supabase';
import {
  dequeueOutboxBatch,
  markOutboxDone,
  bumpOutboxAttempts,
} from '../repositories/outboxRepository';

import {
  upsertJournalEntryRemote,
  deleteJournalEntryRemote,
} from '../repositories/journalRepository';

import {
  upsertPrayerRemote,
  softDeletePrayerRemote,
  touchLastPrayedRemote,
  markPrayerAnsweredRemote,
} from '../repositories/prayerRepository';

import {
  acceptFriendshipRemote,
  deleteFriendshipRemote,
  createFriendRequestRemote,
} from '../repositories/friendsRepository';

// Small guard: skip processing if obviously offline
async function isOnline() {
  try {
    const { data, error } = await supabase.auth.getUser();
    return !error && !!data?.user;
  } catch {
    return false;
  }
}

export async function processOutboxOnce(limit = 25) {
  if (!(await isOnline())) return;

  const batch = await dequeueOutboxBatch(limit);
  for (const job of batch) {
    const ok = await handleJob(job).catch(() => false);
    if (ok) {
      await markOutboxDone(job.id);
    } else {
      await bumpOutboxAttempts(job.id);
      // you could add a max attempts policy here if desired
    }
  }
}

async function handleJob(job) {
  const { entity, op, payload } = job;

  switch (entity) {
    case 'journal':
      if (op === 'upsert') {
        await upsertJournalEntryRemote(payload);
        return true;
      }
      if (op === 'delete') {
        await deleteJournalEntryRemote(payload.id);
        return true;
      }
      return false;

    case 'prayer':
      if (op === 'upsert') {
        await upsertPrayerRemote(payload);
        return true;
      }
      if (op === 'delete') {
        await softDeletePrayerRemote(payload.id, payload.deletedAt);
        return true;
      }
      if (op === 'touch') {
        await touchLastPrayedRemote(payload.id, payload.ts);
        return true;
      }
      if (op === 'answered') {
        await markPrayerAnsweredRemote(payload.id, payload.answeredAt);
        return true;
      }
      return false;

    case 'friendship':
      if (op === 'accept') {
        await acceptFriendshipRemote(payload.id);
        return true;
      }
      if (op === 'decline' || op === 'remove') {
        await deleteFriendshipRemote(payload.id);
        return true;
      }
      if (op === 'request') {
        await createFriendRequestRemote(payload.addresseeId);
        return true;
      }
      return false;

    default:
      return false;
  }
}
