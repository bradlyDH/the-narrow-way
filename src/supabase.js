// src/supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config'; // or wherever you read your env

export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  }
);

/**
 * Remove ALL realtime channels. Use sparingly (e.g., on logout or
 * when you intentionally want to rebuild every subscription).
 */
export function resetRealtime() {
  try {
    const chans = supabase.getChannels?.() || [];
    chans.forEach((ch) => supabase.removeChannel(ch));
  } catch (e) {
    // no-op
  }
}

/**
 * Convenience: remove a specific channel instance if present.
 * Call with your screen's channel ref before creating a new one.
 */
export function removeChannelIfPresent(chRef) {
  try {
    if (chRef?.current) {
      supabase.removeChannel(chRef.current);
      chRef.current = null;
    }
  } catch (e) {
    // no-op
  }
}

/**
 * Convenience: fetch a snapshot of current channel names (for debugging).
 */
export function listChannelTopics() {
  try {
    return (supabase.getChannels?.() || []).map((c) => c.topic);
  } catch {
    return [];
  }
}
