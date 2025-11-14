// src/logic/dailyVirtue.js

// For now we define virtues in code.
// Later, this could read from the Supabase `virtues` table if needed.
const VIRTUES = ['Faith', 'Love', 'Patience', 'Kindness'];

function getTodayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate() + 0)
    .toString()
    .padStart(2, '0'); // +0 for clarity
  return `${yyyy}-${mm}-${dd}`;
}

// Simple deterministic hash so the same input string always maps to
// the same integer, but looks "random enough".
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; // keep in 32 bits
  }
  return Math.abs(hash);
}

// For v1, we simply pick a virtue deterministically based on the date.
// (We can upgrade to "balanced with 14-day cooldown" later.)
export function getTodaysVirtue() {
  if (VIRTUES.length === 0) return null;
  const todayKey = getTodayKey();
  const idx = hashString(todayKey) % VIRTUES.length;
  return VIRTUES[idx];
}
