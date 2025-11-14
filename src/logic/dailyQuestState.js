// src/logic/dailyQuestState.js
import { getString, setString } from '../storage/mmkv';

const KEY_PREFIX = 'questDone:';

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Returns { virtue, completedAt } or null
export async function isQuestCompletedToday() {
  const key = KEY_PREFIX + getTodayKey();
  const raw = getString(key, null);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Mark a quest as completed for today
export async function markQuestCompletedToday(virtue) {
  const key = KEY_PREFIX + getTodayKey();
  const payload = {
    virtue,
    completedAt: new Date().toISOString(),
  };
  try {
    setString(key, JSON.stringify(payload));
  } catch (e) {
    console.warn('Error marking quest completed:', e);
  }
  return payload;
}
