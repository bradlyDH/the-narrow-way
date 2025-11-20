// src/services/prayerService.js
import {
  getRecentPrayerRequests,
  upsertPrayerLocal,
  upsertPrayerRemote,
  markPrayerAnsweredLocal,
  markPrayerAnsweredRemote,
  deletePrayerLocal,
  deletePrayerRemote,
  syncPrayersFromServer,
} from '../repositories/prayerRepository';

export async function loadPrayers(limit = 100) {
  return getRecentPrayerRequests(limit);
}

export async function savePrayer({
  id,
  title,
  details,
  isAnswered,
  answeredAt,
}) {
  const payload = await upsertPrayerLocal({
    id,
    title,
    details,
    isAnswered: !!isAnswered,
    answeredAt: answeredAt ?? null,
  });

  upsertPrayerRemote(payload).catch((e) =>
    console.warn('[prayerService] remote save error:', e)
  );

  return payload;
}

export async function answerPrayer(id) {
  await markPrayerAnsweredLocal(id);
  markPrayerAnsweredRemote(id).catch((e) =>
    console.warn('[prayerService] remote answer error:', e)
  );
}

export async function removePrayer(id) {
  await deletePrayerLocal(id);
  deletePrayerRemote(id).catch((e) =>
    console.warn('[prayerService] remote delete error:', e)
  );
}

export async function syncPrayers(limit = 200) {
  await syncPrayersFromServer(limit);
}
