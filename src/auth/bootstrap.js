// // // src/auth/bootstrap.js
// // import { supabase } from '../supabase';
// // import { setAdminCached } from './utils/adminGate';
// // /**
// //  * Ensures there is an auth session (anonymous) and a minimal profile row.
// //  * Returns the current user.
// //  */
// // export async function ensureSessionAndProfile() {
// //   // 1) Check for an existing session
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession();

// //   let user = session?.user;

// //   // 2) Create an anonymous session if needed (no PII)
// //   if (!user) {
// //     const { data, error } = await supabase.auth.signInAnonymously();
// //     if (error) throw error;
// //     user = data.user;
// //   }

// //   // 3) Ensure a profile row exists (id = auth uid). This is safe to call repeatedly.
// //   await upsertProfileRow(user.id);

// //   return user;
// // }

// // /** Convenience: get the current userId quickly (or null if none). */
// // export async function getUserId() {
// //   const { data } = await supabase.auth.getUser();
// //   return data?.user?.id ?? null;
// // }

// // /* ---------- internal helpers ---------- */

// // async function upsertProfileRow(userId) {
// //   // Try once
// //   let { error } = await supabase
// //     .from('profiles')
// //     .upsert({ id: userId }, { onConflict: 'id' });

// //   // Rare race: if the anonymous user was just created, upsert may fail once.
// //   // Small delay + retry smooths over that first-second timing.
// //   if (error) {
// //     await wait(150);
// //     ({ error } = await supabase
// //       .from('profiles')
// //       .upsert({ id: userId }, { onConflict: 'id' }));
// //     if (error) throw error;
// //   }
// // }

// // function wait(ms) {
// //   return new Promise((res) => setTimeout(res, ms));
// // }

// // src/bootstrap.js

// // --- Logging bootstrap (optional but recommended) ---
// import { setLogLevel, getLogLevel, log } from './utils/logger';
// import { getString } from './storage/mmkv';

// // Prefer a persisted override if present, else use logger's default
// try {
//   const persistedLevel = getString?.('debug:logLevel', null);
//   if (persistedLevel) setLogLevel(persistedLevel); // 'silent'|'error'|'warn'|'info'|'debug'|'trace'
// } catch {
//   // ignore
// }

// // Print effective level once at startup
// try {
//   log('bootstrap').info('Log level:', getLogLevel());
// } catch {}

// // --- Admin flag from Supabase app_metadata.role ---
// import { supabase } from './supabase';
// import { setAdminCached } from './utils/adminGate';

// (async () => {
//   try {
//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser();
//     if (error) {
//       log('bootstrap').warn('supabase.getUser error:', error.message || error);
//     }
//     setAdminCached(user?.app_metadata?.role === 'admin');
//   } catch (e) {
//     log('bootstrap').warn('admin flag init failed:', e?.message || String(e));
//   }
// })();

// // Keep it fresh on auth state change
// try {
//   supabase.auth.onAuthStateChange?.(async (_event, session) => {
//     try {
//       const role = session?.user?.app_metadata?.role;
//       setAdminCached(role === 'admin');
//       log('bootstrap').info('Auth change → admin:', role === 'admin');
//     } catch (e) {
//       log('bootstrap').warn(
//         'admin flag update failed:',
//         e?.message || String(e)
//       );
//     }
//   });
// } catch {
//   // ignore
// }

// src/auth/bootstrap.js
import { supabase } from '../supabase';

// --- Logging bootstrap ---
import { setLogLevel, getLogLevel, log } from '../utils/logger';
import { getString } from '../storage/mmkv';

// Prefer a persisted override if present, else use logger's default
try {
  const persisted = getString?.('debug:logLevel', null);
  if (persisted) setLogLevel(persisted); // 'silent'|'error'|'warn'|'info'|'debug'|'trace'
} catch {
  /* noop */
}

// Optional: print effective level at startup
log('bootstrap').info('Log level:', getLogLevel());

// --- Admin gate (local-only secret toggle; no app_metadata required) ---
import { setAdminCached } from '../utils/adminGate';

// Initialize once at launch (no server role needed)
setAdminCached(false);

// Keep flag sane on auth changes (you can extend this later to read a DB flag)
supabase.auth.onAuthStateChange((_event, _session) => {
  // no-op for now; you could call setAdminCached(true/false) based on a row in `profiles`
});
