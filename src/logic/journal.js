// src/logic/journal.js
import {
  loadRecentJournalEntries,
  loadJournalEntryForDate,
  saveJournalEntry,
  removeJournalEntry,
  syncJournal,
} from '../services/journalService';

function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// New API
export {
  loadRecentJournalEntries,
  loadJournalEntryForDate,
  saveJournalEntry,
  removeJournalEntry,
  syncJournal,
};

// Legacy API (compat)
export async function getJournalEntries(limit = 200) {
  return loadRecentJournalEntries(limit);
}

export async function getJournalEntryForDate(dateStr) {
  return loadJournalEntryForDate(dateStr);
}

export async function createJournalEntry({
  date,
  virtue,
  note,
  createdAt,
  updatedAt,
} = {}) {
  return saveJournalEntry({
    id: undefined,
    date: date ?? todayKey(),
    virtue,
    note,
    createdAt,
    updatedAt,
  });
}

export async function updateJournalEntry(
  id,
  { date, virtue, note, updatedAt } = {}
) {
  return saveJournalEntry({
    id,
    date: date ?? todayKey(),
    virtue,
    note,
    updatedAt: updatedAt ?? new Date().toISOString(),
  });
}

export async function deleteJournalEntry(id) {
  return removeJournalEntry(id);
}

export async function syncJournalEntries(limit = 200) {
  return syncJournal(limit);
}
