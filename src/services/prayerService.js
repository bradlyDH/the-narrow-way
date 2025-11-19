// src/services/prayerService.js
import {
  getRecentPrayerRequests,
  upsertPrayerLocal,
  upsertPrayerRemote,
  markPrayerAnsweredLocal,
  markPrayerAnsweredRemote,
  softDeletePrayerLocal,
  softDeletePrayerRemote,
  touchLastPrayedLocal,
  touchLastPrayedRemote,
  syncPrayersFromServer,
} from '../repositories/prayerRepository';

// normalize: always expose snake_case props for the UI
function normalize(row) {
  if (!row) return row;
  return {
    ...row,
    created_at: row.created_at ?? row.createdAt ?? null,
    updated_at: row.updated_at ?? row.updatedAt ?? null,
    added_at: row.added_at ?? row.addedAt ?? null,
    last_prayed_at: row.last_prayed_at ?? row.lastPrayedAt ?? null,
    answered_at: row.answered_at ?? row.answeredAt ?? null,
    deleted_at: row.deleted_at ?? row.deletedAt ?? null,
    // ensure boolean
    answered: !!row.answered,
  };
}

export async function loadPrayers(limit = 100) {
  const rows = await getRecentPrayerRequests(limit);
  return (rows || []).map(normalize);
}

// Creates/Updates (local-first; remote fire-and-forget)
export async function savePrayer({
  id,
  title,
  details,
  answered,
  answeredAt,
  addedAt,
}) {
  const payload = await upsertPrayerLocal({
    id,
    title,
    details,
    answered: !!answered,
    answeredAt: answeredAt ?? null,
    addedAt: addedAt ?? undefined,
  });
  // async remote
  upsertPrayerRemote(payload).catch((e) =>
    console.warn('[prayerService] remote save error:', e)
  );
  return normalize(payload);
}

export async function answerPrayer(id, answeredAt = new Date().toISOString()) {
  await markPrayerAnsweredLocal(id, answeredAt);
  // remote only if UUID (guard also in repository, but keeping logic tight here)
  try {
    await markPrayerAnsweredRemote(id, answeredAt);
  } catch (e) {
    console.warn('[prayerService] remote answer error:', e);
  }
}

export async function removePrayer(id, deletedAt = new Date().toISOString()) {
  await softDeletePrayerLocal(id, deletedAt);
  try {
    await softDeletePrayerRemote(id, deletedAt);
  } catch (e) {
    console.warn('[prayerService] remote soft delete error:', e);
  }
}

export async function setLastPrayedNow(id, ts = new Date().toISOString()) {
  // Local-first so the UI updates immediately
  await touchLastPrayedLocal(id, ts);

  // Guard: only hit Supabase when the id is a real UUID (skip temp ids like "pid_...")
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      String(id)
    );
  if (!isUuid) return;

  try {
    await touchLastPrayedRemote(id, ts);
  } catch (e) {
    console.warn('[prayerService] remote touch error:', e);
  }
}

// Sync (server → SQLite)
export async function syncPrayers(limit = 200) {
  await syncPrayersFromServer(limit);
}
