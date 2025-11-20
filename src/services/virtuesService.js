// src/services/virtuesService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const AS_KEY = 'virtues.cache.v1';
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

/**
 * Shape returned by Supabase:
 * { virtue: string, color?: string|null, verse_ref?: string|null, verse_text?: string|null }
 */
export async function fetchVirtuesFromSupabase({ forceRefresh = false } = {}) {
  // 1) Try cache first
  if (!forceRefresh) {
    const raw = await AsyncStorage.getItem(AS_KEY);
    if (raw) {
      try {
        const { at, data } = JSON.parse(raw);
        if (Date.now() - at < TTL_MS && Array.isArray(data)) {
          return data;
        }
      } catch {}
    }
  }

  // 2) Fetch from Supabase
  const { data, error } = await supabase
    .from('virtues')
    .select('virtue, color, verse_ref, verse_text')
    .order('virtue', { ascending: true });

  if (error) throw error;

  // 3) Persist to cache
  try {
    await AsyncStorage.setItem(
      AS_KEY,
      JSON.stringify({ at: Date.now(), data })
    );
  } catch {}

  return data ?? [];
}

/** Clear the local cache (handy during development). */
export async function clearVirtuesCache() {
  await AsyncStorage.removeItem(AS_KEY);
}
