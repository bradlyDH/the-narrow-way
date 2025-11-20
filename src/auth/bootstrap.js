// src/auth/bootstrap.js
import { supabase } from '../supabase';

// --- Logging bootstrap (keeps your current behavior) ---
import { setLogLevel, getLogLevel, log } from '../utils/logger';
import { getString } from '../storage/mmkv';

try {
  const persisted = getString?.('debug:logLevel', null);
  if (persisted) setLogLevel(persisted); // 'silent'|'error'|'warn'|'info'|'debug'|'trace'
} catch {} // ignore

log('bootstrap').info('Log level:', getLogLevel());

// --- Admin gate (local-only toggle; can be extended later) ---
import { setAdminCached } from '../utils/adminGate';
setAdminCached(false); // default off on cold start

// Keep hook if you later want to react to auth changes for admin flag
supabase.auth.onAuthStateChange((_event, _session) => {
  // no-op for now
});

// ---------- Helpers ----------
async function safeUpsertProfile(userId) {
  // Idempotent: creates row once; subsequent calls no-op
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id' })
    .select('id')
    .single();

  if (error && error.code !== '23505') {
    // ignore unique conflict just in case
    throw error;
  }
}

// ---------- Public API ----------

/**
 * Ensure there is an active session (anonymous if necessary), and a profiles row.
 * Returns the current user object.
 */
export async function ensureSessionAndProfile() {
  const L = log('auth/bootstrap');

  // 1) Ensure a session (reuse if present; otherwise create anonymous)
  const { data: sessData, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) {
    L.warn('getSession error:', sessErr);
  }
  if (!sessData?.session) {
    const { error: anonErr } = await supabase.auth.signInAnonymously();
    if (anonErr) {
      L.error('signInAnonymously failed:', anonErr);
      throw new Error(
        anonErr.message || 'Anonymous sign-in failed. Please try again.'
      );
    }
  }

  // 2) Get the user for this session
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    L.error('getUser after session error:', userErr);
    throw userErr;
  }
  if (!user) {
    throw new Error('No user available after ensuring session.');
  }

  // 3) Ensure a profile row exists
  try {
    await safeUpsertProfile(user.id);
  } catch (e) {
    L.warn('upsert profile failed (continuing):', e);
  }

  return user;
}

/**
 * Ensure we have any session (anonymous if needed), without touching profiles.
 */
export async function ensureSession() {
  const { data } = await supabase.auth.getSession();
  if (!data?.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
  }
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('No user after ensureSession');
  return user;
}

// Optional default export for legacy imports (safe no-op object)
export default { ensureSessionAndProfile, ensureSession };
