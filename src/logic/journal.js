// src/logic/journal.js
import { getDb } from '../storage/db';
import { getTodaysVirtue } from './dailyVirtue';

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Create a new journal entry for today
export async function createJournalEntry(note, virtueOverride) {
  if (!note || !note.trim()) return null;

  const db = await getDb();
  const now = new Date();
  const isoNow = now.toISOString();
  const dateKey = getTodayKey();
  const virtue = virtueOverride || getTodaysVirtue() || 'Today';

  const id = `${dateKey}:${now.getTime()}`;

  await db.runAsync(
    `
    INSERT INTO journal_entries (
      id, date, virtue, note, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [id, dateKey, virtue, note.trim(), isoNow, isoNow]
  );

  return {
    id,
    date: dateKey,
    virtue,
    note: note.trim(),
    created_at: isoNow,
    updated_at: isoNow,
  };
}

// Get all entries, newest first
export async function getJournalEntries() {
  const db = await getDb();
  const rows = await db.getAllAsync(
    `
    SELECT id, date, virtue, note, created_at, updated_at
    FROM journal_entries
    ORDER BY date DESC, created_at DESC
  `
  );
  return rows;
}

export async function updateJournalEntry(id, note) {
  if (!id || !note || !note.trim()) return null;

  const db = await getDb();
  const trimmed = note.trim();
  const now = new Date().toISOString();

  await db.runAsync(
    `
    UPDATE journal_entries
    SET note = ?, updated_at = ?
    WHERE id = ?
  `,
    [trimmed, now, id]
  );

  return { id, note: trimmed, updated_at: now };
}

export async function deleteJournalEntry(id) {
  if (!id) return;

  const db = await getDb();
  await db.runAsync(
    `
    DELETE FROM journal_entries
    WHERE id = ?
  `,
    [id]
  );
}
