// import { createClient } from '@supabase/supabase-js';
// import { CONFIG } from '../config/index';

// export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
//   auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
// });

// src/lib/supabase.js (or keep your existing path and filename)
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config';

// Fail fast in dev if config is missing
if (__DEV__) {
  if (!CONFIG?.SUPABASE_URL || !CONFIG?.SUPABASE_ANON_KEY) {
    // eslint-disable-next-line no-console
    console.error(
      '[supabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY. Check app.config extra / env.'
    );
  }
}

/**
 * Single Supabase client for the app.
 * - Uses AsyncStorage for auth persistence (RN-safe)
 * - Disables URL session detection (no window.location in RN)
 * - Auto-refreshes tokens in background
 */
export const supabase = createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
    // Optional: set a default schema or global headers if you need them
    // db: { schema: 'public' },
    // global: { headers: { 'X-Client-Info': 'the-narrow-way@1.0.0' } },
    realtime: {
      // Optional: throttle events if you expect lots of changes
      // params: { eventsPerSecond: 5 },
    },
  }
);

/**
 * Wait for the initial session to be loaded from AsyncStorage.
 * Call this once during app bootstrap if you need to gate UI on auth.
 *
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
export async function ensureInitialSession() {
  // supabase-js v2 loads session from storage lazily; force a read:
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/**
 * Subscribe to auth changes (login/logout/token refresh).
 * Usage:
 *   const sub = onAuthChange((_event, session) => { ... });
 *   return () => sub?.unsubscribe();
 */
export function onAuthChange(callback) {
  const { data: subscription } = supabase.auth.onAuthStateChange(
    (event, session) => callback?.(event, session)
  );
  return subscription;
}
