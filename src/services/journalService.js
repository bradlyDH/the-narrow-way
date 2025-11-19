// src/services/journalService.js
import {
  getRecentJournalEntries,
  getJournalEntryByDate,
  upsertJournalEntryLocal,
  upsertJournalEntryRemote,
  deleteJournalEntryLocal,
  deleteJournalEntryRemote,
  syncJournalFromServer,
} from '../repositories/journalRepository';

function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function loadRecentJournalEntries(limit = 200) {
  return getRecentJournalEntries(limit);
}

export async function loadJournalEntryForDate(dateStr) {
  return getJournalEntryByDate(dateStr);
}

/**
 * Local-first save; guarantees server-safe payload:
 * - date: defaults to today (YYYY-MM-DD)
 * - virtue: string ('' if missing)
 * - note: string ('' if missing)
 */
export async function saveJournalEntry({
  id,
  date,
  virtue,
  note,
  createdAt,
  updatedAt,
}) {
  const safeDate = date ?? todayKey();
  const safeVirtue = typeof virtue === 'string' ? virtue : '';
  const safeNote = typeof note === 'string' ? note : '';

  const payload = await upsertJournalEntryLocal({
    id,
    date: safeDate,
    virtue: safeVirtue,
    note: safeNote,
    createdAt,
    updatedAt,
  });

  // Best-effort remote sync (non-blocking)
  upsertJournalEntryRemote(payload).catch((e) =>
    console.warn('[journalService] remote save error:', e)
  );

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
