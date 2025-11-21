// // // src/services/journalService.js
// // import {
// //   getRecentJournalEntries,
// //   getJournalEntryByDate,
// //   upsertJournalEntryLocal,
// //   upsertJournalEntryRemote,
// //   deleteJournalEntryLocal,
// //   deleteJournalEntryRemote,
// //   syncJournalFromServer,
// // } from '../repositories/journalRepository';

// // function todayKey() {
// //   const now = new Date();
// //   const yyyy = now.getFullYear();
// //   const mm = String(now.getMonth() + 1).padStart(2, '0');
// //   const dd = String(now.getDate()).padStart(2, '0');
// //   return `${yyyy}-${mm}-${dd}`;
// // }

// // function isUuid(v) {
// //   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
// //     String(v)
// //   );
// // }

// // export async function loadRecentJournalEntries(limit = 200) {
// //   return getRecentJournalEntries(limit);
// // }

// // export async function loadJournalEntryForDate(dateStr) {
// //   return getJournalEntryByDate(dateStr);
// // }

// // /**
// //  * Local-first save; guarantees server-safe payload:
// //  * - date: defaults to today (YYYY-MM-DD)
// //  * - virtue: string ('' if missing)
// //  * - note: string ('' if missing)
// //  */
// // export async function saveJournalEntry({
// //   id,
// //   date,
// //   virtue,
// //   note,
// //   createdAt,
// //   updatedAt,
// // }) {
// //   // const safeDate = date ?? todayKey();
// //   // const safeVirtue = typeof virtue === 'string' ? virtue : '';
// //   // const safeNote = typeof note === 'string' ? note : '';

// //   // const safeDate = date ?? todayKey();
// //   // const safeVirtue =
// //   //   typeof virtue === 'string' && virtue.trim().length
// //   //     ? virtue.trim()
// //   //     : 'Today';
// //   // const safeNote = typeof note === 'string' ? note : '';
// //   const isUpdate = !!id;
// //   // On CREATE: default date to today; on UPDATE: leave date undefined to keep existing
// //   const safeDate = isUpdate ? date : date ?? todayKey();
// //   const safeVirtue =
// //     typeof virtue === 'string' && virtue.trim().length
// //       ? virtue.trim()
// //       : 'Today';
// //   const safeNote = typeof note === 'string' ? note : '';
// //   const payload = await upsertJournalEntryLocal({
// //     id,
// //     date: safeDate,
// //     virtue: safeVirtue,
// //     note: safeNote,
// //     createdAt,
// //     updatedAt,
// //   });

// //   // // Best-effort remote sync (non-blocking)
// //   // upsertJournalEntryRemote(payload).catch((e) =>
// //   //   console.warn('[journalService] remote save error:', e)
// //   // );
// //   // Remote:
// //   // - UUID id → do an UPDATE (prevents accidental inserts)
// //   // - temp/no id → do an UPSERT (insert), which will swap local id when UUID returns
// //   if (isUuid(payload.id)) {
// //     updateJournalEntryRemote(payload.id, {
// //       note: safeNote,
// //       virtue: safeVirtue,
// //       // date: safeDate, // include only if you intend to change the date on edit
// //     }).catch((e) => console.warn('[journalService] remote update error:', e));
// //   } else {
// //     upsertJournalEntryRemote(payload).catch((e) =>
// //       console.warn('[journalService] remote upsert error:', e)
// //     );
// //   }
// //   return payload;
// // }

// // export async function removeJournalEntry(id) {
// //   await deleteJournalEntryLocal(id);
// //   deleteJournalEntryRemote(id).catch((e) =>
// //     console.warn('[journalService] remote delete error:', e)
// //   );
// // }

// // export async function syncJournal(limit = 200) {
// //   await syncJournalFromServer(limit);
// // }

// // src/services/journalService.js
// import {
//   getRecentJournalEntries,
//   getJournalEntryByDate,
//   upsertJournalEntryLocal,
//   upsertJournalEntryRemote,
//   deleteJournalEntryLocal,
//   deleteJournalEntryRemote,
//   syncJournalFromServer,
//   // ✅ add this missing import
//   updateJournalEntryRemote,
// } from '../repositories/journalRepository';

// function todayKey() {
//   const now = new Date();
//   const yyyy = now.getFullYear();
//   const mm = String(now.getMonth() + 1).padStart(2, '0');
//   const dd = String(now.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// function isUuid(v) {
//   return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
//     String(v)
//   );
// }

// export async function loadRecentJournalEntries(limit = 200) {
//   return getRecentJournalEntries(limit);
// }

// export async function loadJournalEntryForDate(dateStr) {
//   return getJournalEntryByDate(dateStr);
// }

// /**
//  * Local-first save; guarantees server-safe payload.
//  * - On CREATE: defaults date to today
//  * - On UPDATE: keeps existing date unless explicitly provided
//  */
// export async function saveJournalEntry({
//   id,
//   date,
//   virtue,
//   note,
//   createdAt,
//   updatedAt,
// }) {
//   const isUpdate = !!id;
//   const safeDate = isUpdate ? date : date ?? todayKey();
//   const safeVirtue =
//     typeof virtue === 'string' && virtue.trim().length
//       ? virtue.trim()
//       : 'Today';
//   const safeNote = typeof note === 'string' ? note : '';

//   const payload = await upsertJournalEntryLocal({
//     id,
//     date: safeDate,
//     virtue: safeVirtue,
//     note: safeNote,
//     createdAt,
//     updatedAt,
//   });

//   // Remote: UUID → UPDATE; temp/no id → UPSERT
//   if (isUuid(payload.id)) {
//     updateJournalEntryRemote(payload.id, {
//       note: safeNote,
//       virtue: safeVirtue,
//       // date: safeDate, // include only if you intend to change the date on edit
//     }).catch((e) => console.warn('[journalService] remote update error:', e));
//   } else {
//     // Wait for INSERT to complete so the temp id is swapped to the UUID
//     try {
//       const newId = await upsertJournalEntryRemote(payload);
//       if (newId && newId !== payload.id) {
//         // reflect the UUID in the object we return to the UI
//         payload.id = newId;
//       }
//     } catch (e) {
//       console.warn('[journalService] remote upsert error:', e);
//     }
//   }

//   return payload;
// }

// export async function removeJournalEntry(id) {
//   await deleteJournalEntryLocal(id);
//   deleteJournalEntryRemote(id).catch((e) =>
//     console.warn('[journalService] remote delete error:', e)
//   );
// }

// export async function syncJournal(limit = 200) {
//   await syncJournalFromServer(limit);
// }

// src/services/journalService.js
import {
  getRecentJournalEntries,
  getJournalEntryByDate,
  upsertJournalEntryLocal,
  upsertJournalEntryRemote,
  deleteJournalEntryLocal,
  deleteJournalEntryRemote,
  syncJournalFromServer,
  updateJournalEntryRemote, // ← already present in your latest version
} from '../repositories/journalRepository';

function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(v)
  );
}

export async function loadRecentJournalEntries(limit = 200) {
  return getRecentJournalEntries(limit);
}

export async function loadJournalEntryForDate(dateStr) {
  return getJournalEntryByDate(dateStr);
}

/**
 * Local-first save.
 * - CREATE: default date to today; default virtue to "Today" if not provided
 * - UPDATE: keep existing virtue/date unless explicitly provided
 */
export async function saveJournalEntry({
  id,
  date,
  virtue,
  note,
  createdAt,
  updatedAt,
}) {
  const isUpdate = !!id;

  // Date: default only on create. On update, omit unless provided.
  const safeDate = isUpdate ? date : date ?? todayKey();

  // Virtue: default only on create. On update, only change if caller passed a non-empty string.
  const hasVirtueInput = typeof virtue === 'string' && virtue.trim().length > 0;
  const virtueForLocal = isUpdate
    ? hasVirtueInput
      ? virtue.trim()
      : undefined // let repo keep existing
    : hasVirtueInput
    ? virtue.trim()
    : 'Today'; // default on create

  const safeNote = typeof note === 'string' ? note : '';

  // Local upsert merges missing fields with existing row
  const payload = await upsertJournalEntryLocal({
    id,
    date: safeDate, // undefined on update keeps existing
    virtue: virtueForLocal, // undefined on update keeps existing
    note: safeNote,
    createdAt,
    updatedAt,
  });

  // Remote:
  // - If row already has a UUID → UPDATE only the fields the caller actually changed
  // - If temp/no id → INSERT, await and adopt the returned UUID
  if (isUuid(payload.id)) {
    const patch = { note: safeNote };
    if (hasVirtueInput) patch.virtue = virtue.trim();
    // Only include date in patch if caller provided it on update
    if (typeof date === 'string') patch.date = date;

    updateJournalEntryRemote(payload.id, patch).catch((e) =>
      console.warn('[journalService] remote update error:', e)
    );
  } else {
    try {
      const newId = await upsertJournalEntryRemote(payload);
      if (newId && newId !== payload.id) {
        payload.id = newId; // reflect UUID so subsequent edits go to UPDATE path
      }
    } catch (e) {
      console.warn('[journalService] remote upsert error:', e);
    }
  }

  return payload;
}

export async function removeJournalEntry(id) {
  await deleteJournalEntryLocal(id);
  deleteJournalEntryRemote(id).catch((e) =>
    console.warn('[journalService] remote delete error:', e)
  );
}

export async function syncJournal(limit = 200) {
  await syncJournalFromServer(limit);
}
