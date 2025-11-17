// src/cache/questCache.js
import { getString, setString } from '../storage/mmkv';

const QUEST_CACHE_PREFIX = 'quest-data:';

export function questCacheKeyForDate(dateStr) {
  return `${QUEST_CACHE_PREFIX}${dateStr}`;
}

/**
 * Read cached quest for a given date.
 * Returns parsed object or null.
 */
export function getCachedQuest(dateStr) {
  const key = questCacheKeyForDate(dateStr);
  const raw = getString(key, null);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Write quest payload into cache for a given date.
 */
export function setCachedQuest(dateStr, quest) {
  const key = questCacheKeyForDate(dateStr);
  try {
    setString(key, JSON.stringify(quest));
  } catch (e) {
    console.warn('[questCache] failed to write cache:', e);
  }
}
