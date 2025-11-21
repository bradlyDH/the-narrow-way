// // src/services/prayerService.js
// import {
//   getRecentPrayerRequests,
//   upsertPrayerLocal,
//   upsertPrayerRemote,
//   markPrayerAnsweredLocal,
//   markPrayerAnsweredRemote,
//   deletePrayerLocal,
//   deletePrayerRemote,
//   syncPrayersFromServer,
// } from '../repositories/prayerRepository';

// export async function loadPrayers(limit = 100) {
//   return getRecentPrayerRequests(limit);
// }

// export async function savePrayer({
//   id,
//   title,
//   details,
//   isAnswered,
//   answeredAt,
// }) {
//   const payload = await upsertPrayerLocal({
//     id,
//     title,
//     details,
//     isAnswered: !!isAnswered,
//     answeredAt: answeredAt ?? null,
//   });

//   upsertPrayerRemote(payload).catch((e) =>
//     console.warn('[prayerService] remote save error:', e)
//   );

//   return payload;
// }

// export async function answerPrayer(id) {
//   await markPrayerAnsweredLocal(id);
//   markPrayerAnsweredRemote(id).catch((e) =>
//     console.warn('[prayerService] remote answer error:', e)
//   );
// }

// export async function removePrayer(id) {
//   await deletePrayerLocal(id);
//   deletePrayerRemote(id).catch((e) =>
//     console.warn('[prayerService] remote delete error:', e)
//   );
// }

// export async function syncPrayers(limit = 200) {
//   await syncPrayersFromServer(limit);
// }

// // src/services/prayerService.js
// import {
//   getRecentPrayerRequests,
//   upsertPrayerLocal,
//   upsertPrayerRemote,
//   markPrayerAnsweredLocal,
//   markPrayerAnsweredRemote,
//   softDeletePrayerLocal, // ✅ use the actual exports
//   softDeletePrayerRemote, // ✅
//   syncPrayersFromServer,
// } from '../repositories/prayerRepository';

// // -- Reads ---------------------------------------------------------
// export async function loadPrayers(limit = 100) {
//   return getRecentPrayerRequests(limit);
// }

// // -- Create/Update -------------------------------------------------
// /**
//  * Save or update a prayer.
//  * NOTE: repository expects "answered" (boolean), not "isAnswered".
//  */
// export async function savePrayer({
//   id,
//   title,
//   details,
//   answered, // ✅ rename from isAnswered
//   answeredAt, // pass-through; repo also accepts answered_at shape internally
//   addedAt, // optional: allow caller to set this, defaults handled in repo
//   lastPrayedAt, // optional pass-through
//   deletedAt, // optional pass-through (rare on save)
// }) {
//   const payload = await upsertPrayerLocal({
//     id,
//     title,
//     details,
//     answered: !!answered, // ✅ correct key name for repo
//     answeredAt: answeredAt ?? null,
//     addedAt: addedAt ?? undefined,
//     lastPrayedAt: lastPrayedAt ?? undefined,
//     deletedAt: deletedAt ?? undefined,
//   });

//   // fire-and-forget remote upsert (repo will ignore temp IDs smartly)
//   upsertPrayerRemote(payload).catch((e) =>
//     console.warn('[prayerService] remote save error:', e)
//   );

//   return payload;
// }

// // -- Mutations -----------------------------------------------------
// export async function answerPrayer(id, when = new Date().toISOString()) {
//   await markPrayerAnsweredLocal(id, when);
//   markPrayerAnsweredRemote(id, when).catch((e) =>
//     console.warn('[prayerService] remote answer error:', e)
//   );
// }

// /**
//  * Soft delete a prayer (sets deleted_at).
//  * UI should call only this function for deletes.
//  */
// export async function deletePrayer(id, when = new Date().toISOString()) {
//   await softDeletePrayerLocal(id, when); // ✅ correct functions
//   softDeletePrayerRemote(id, when).catch((e) =>
//     console.warn('[prayerService] remote soft delete error:', e)
//   );
// }

// // If you want to keep the existing name:
// export const removePrayer = deletePrayer; // ✅ non-breaking alias

// // -- Sync ----------------------------------------------------------
// export async function syncPrayers(limit = 200) {
//   await syncPrayersFromServer(limit);
// }

// src/services/prayerService.js
import {
  getRecentPrayerRequests,
  upsertPrayerLocal,
  upsertPrayerRemote,
  markPrayerAnsweredLocal,
  markPrayerAnsweredRemote,
  softDeletePrayerLocal,
  softDeletePrayerRemote,
  touchLastPrayedLocal, // ✅ new
  touchLastPrayedRemote, // ✅ new
  syncPrayersFromServer,
} from '../repositories/prayerRepository';

// -- Reads ---------------------------------------------------------
export async function loadPrayers(limit = 100) {
  return getRecentPrayerRequests(limit);
}

// -- Create/Update -------------------------------------------------
/**
 * Save or update a prayer.
 * NOTE: repository expects "answered" (boolean), not "isAnswered".
 */
export async function savePrayer({
  id,
  title,
  details,
  answered, // ✅ correct field name
  answeredAt, // optional
  addedAt, // optional
  lastPrayedAt, // optional
  deletedAt, // optional
}) {
  const payload = await upsertPrayerLocal({
    id,
    title,
    details,
    answered: !!answered,
    answeredAt: answeredAt ?? null,
    addedAt: addedAt ?? undefined,
    lastPrayedAt: lastPrayedAt ?? undefined,
    deletedAt: deletedAt ?? undefined,
  });

  // Fire-and-forget remote upsert (repo guards temp IDs)
  upsertPrayerRemote(payload).catch((e) =>
    console.warn('[prayerService] remote save error:', e)
  );

  return payload;
}

// -- Mutations -----------------------------------------------------
export async function answerPrayer(id, when = new Date().toISOString()) {
  await markPrayerAnsweredLocal(id, when);
  markPrayerAnsweredRemote(id, when).catch((e) =>
    console.warn('[prayerService] remote answer error:', e)
  );
}

/**
 * Soft delete a prayer (sets deleted_at).
 * UI should call only this function for deletes.
 */
export async function deletePrayer(id, when = new Date().toISOString()) {
  await softDeletePrayerLocal(id, when);
  softDeletePrayerRemote(id, when).catch((e) =>
    console.warn('[prayerService] remote soft delete error:', e)
  );
}

// Keep existing name if your UI uses it.
export const removePrayer = deletePrayer;

/**
 * Mark a prayer as "prayed now" (updates last_prayed_at).
 * Optimistic local update; remote best-effort (no-op for temp IDs).
 */
export async function setLastPrayedNow(id, when = new Date().toISOString()) {
  await touchLastPrayedLocal(id, when);
  touchLastPrayedRemote(id, when).catch((e) =>
    console.warn('[prayerService] remote touch error:', e)
  );
}

// -- Sync ----------------------------------------------------------
export async function syncPrayers(limit = 200) {
  await syncPrayersFromServer(limit);
}
