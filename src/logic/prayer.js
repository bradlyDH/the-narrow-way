// src/logic/prayer.js
import {
  loadPrayers,
  savePrayer,
  answerPrayer,
  removePrayer,
  syncPrayers,
} from '../services/prayerService';

// New API
export { loadPrayers, savePrayer, answerPrayer, removePrayer, syncPrayers };

// Legacy-ish helpers (positional signatures)
export async function getPrayerItems(limit = 100) {
  return loadPrayers(limit);
}

export async function addPrayerItem(title, details) {
  return savePrayer({ title, details });
}

export async function updatePrayerItem(
  id,
  { title, details, isAnswered, answeredAt } = {}
) {
  return savePrayer({ id, title, details, isAnswered, answeredAt });
}

export async function markPrayerAnswered(id) {
  return answerPrayer(id);
}

export async function deletePrayerItem(id) {
  return removePrayer(id);
}
