// // src/services/userService.js
// import { supabase } from '../supabase';
// import { log } from '../utils/logger';

// /**
//  * Ensures:
//  * 1) There is an auth session (creates anonymous session if missing)
//  * 2) A profile row exists for the user in `public.profiles`
//  * Returns: { user, profile }
//  */
// export async function ensureSessionAndProfile() {
//   const L = log('auth/bootstrap');

//   // 1) Ensure session
//   let {
//     data: { session },
//     error: sErr,
//   } = await supabase.auth.getSession();

//   if (sErr) {
//     L.warn('getSession error:', sErr.message || sErr);
//   }

//   if (!session) {
//     // Create/continue an anonymous session so the app can function
//     const { data, error } = await supabase.auth.signInAnonymously();
//     if (error) {
//       L.error('signInAnonymously failed:', error.message || error);
//       throw error;
//     }
//     session = data.session;
//   }

//   // 2) Ensure profile row
//   const user = session.user;
//   if (!user) {
//     throw new Error('No user in session after sign-in.');
//   }

//   // Try to read the profile
//   let { data: profile, error: pErr } = await supabase
//     .from('profiles')
//     .select('id, display_name, verse_ref, verse_text, short_id, created_at')
//     .eq('id', user.id)
//     .maybeSingle();

//   // If not exists → create minimal row; select again to get generated short_id
//   if (pErr) {
//     // Note: PGRST116 = no rows; some projects return null without error, so we test by result too.
//     log('auth/bootstrap').warn('profiles select error:', pErr.message || pErr);
//   }
//   if (!profile) {
//     const { data: inserted, error: insErr } = await supabase
//       .from('profiles')
//       .insert({ id: user.id })
//       .select('id, display_name, verse_ref, verse_text, short_id, created_at')
//       .single();

//     if (insErr) {
//       L.error('Create profile failed:', insErr.message || insErr);
//       throw insErr;
//     }
//     profile = inserted;
//   }

//   return { user, profile };
// }

// /**
//  * Returns the current user (or null if no session).
//  */
// export async function getCurrentUser() {
//   const { data, error } = await supabase.auth.getUser();
//   if (error) {
//     log('auth').warn('getUser error:', error.message || error);
//     return null;
//   }
//   return data.user || null;
// }

// /**
//  * Returns the current user id (or null).
//  */
// export async function getCurrentUserId() {
//   const u = await getCurrentUser();
//   return u?.id ?? null;
// }

// /**
//  * Reads your profile.
//  */
// export async function getMyProfile() {
//   const uid = await getCurrentUserId();
//   if (!uid) return null;

//   const { data, error } = await supabase
//     .from('profiles')
//     .select('id, display_name, verse_ref, verse_text, short_id, created_at')
//     .eq('id', uid)
//     .maybeSingle();

//   if (error) throw error;
//   return data || null;
// }

// /**
//  * Upserts your profile (keeps `id` = current user).
//  * Pass only fields you want to update; others remain unchanged.
//  */
// export async function updateMyProfile(partial) {
//   const uid = await getCurrentUserId();
//   if (!uid) throw new Error('Not signed in');

//   const payload = { id: uid, ...partial };

//   const { data, error } = await supabase
//     .from('profiles')
//     .upsert(payload, { onConflict: 'id' })
//     .select()
//     .single();

//   if (error) throw error;
//   return data;
// }

// /**
//  * Subscribe to your profile changes. Returns an unsubscribe function.
//  * NOTE: Requires realtime enabled for table and RLS allowing SELECT for current user.
//  */
// export function subscribeMyProfile(callback) {
//   const ch = supabase
//     .channel('my-profile-rt')
//     .on(
//       'postgres_changes',
//       { schema: 'public', table: 'profiles', event: '*' },
//       (payload) => {
//         // filter client-side to my id to be safe
//         const row = payload?.new ?? payload?.old ?? null;
//         if (!row) return;
//         // Optional: you could check row.id === myId if you fetch myId first.
//         callback(payload);
//       }
//     )
//     .subscribe();

//   return () => supabase.removeChannel(ch);
// }

// /**
//  * Sign out of the current session.
//  */
// export async function signOut() {
//   const { error } = await supabase.auth.signOut();
//   if (error) throw error;
// }

// /**
//  * Permanently delete the current account + related rows (server function).
//  * You already wired `rpc('delete_current_user')` in your ProfileScreen.
//  */
// export async function deleteCurrentUser() {
//   const { error } = await supabase.rpc('delete_current_user');
//   if (error) throw error;
// }

// /**
//  * True if the current session is anonymous (guest).
//  */
// export async function isGuest() {
//   const u = await getCurrentUser();
//   return !!u?.is_anonymous;
// }

// /**
//  * Simple email sign-up (for upgrade flow). You had this in ProfileScreen, keeping here too.
//  */
// export async function signUpWithEmail(email, password) {
//   const { data, error } = await supabase.auth.signUp({ email, password });
//   if (error) throw error;
//   return data;
// }

// src/services/userService.js
import { supabase } from '../supabase';
import { log } from '../utils/logger';

/**
 * Ensures:
 * 1) There is an auth session (creates anonymous session if missing)
 * 2) A profile row exists for the user in `public.profiles`
 * Returns: { user, profile }
 */
export async function ensureSessionAndProfile() {
  const L = log('auth/bootstrap');

  // 1) Ensure session
  let { data: sessionData, error: sErr } = await supabase.auth.getSession();
  if (sErr) L.warn('getSession error:', sErr.message || sErr);

  let session = sessionData?.session ?? null;

  if (!session) {
    const { error: anonErr } = await supabase.auth.signInAnonymously();
    if (anonErr) {
      L.error('signInAnonymously failed:', anonErr.message || anonErr);
      throw anonErr;
    }
    // Some clients don’t return a full session on the sign-in call; fetch again
    ({ data: sessionData } = await supabase.auth.getSession());
    session = sessionData?.session ?? null;
  }

  // 2) Ensure profile row
  const user = session?.user;
  if (!user) throw new Error('No user in session after sign-in.');

  let { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('id, display_name, verse_ref, verse_text, short_id, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (pErr) {
    L.warn('profiles select error:', pErr.message || pErr);
  }

  if (!profile) {
    const { data: inserted, error: insErr } = await supabase
      .from('profiles')
      .insert({ id: user.id })
      .select('id, display_name, verse_ref, verse_text, short_id, created_at')
      .single();

    if (insErr) {
      L.error('Create profile failed:', insErr.message || insErr);
      throw insErr;
    }
    profile = inserted;
  }

  return { user, profile };
}

/** Returns the current user (or null if no session). */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    log('auth').warn('getUser error:', error.message || error);
    return null;
  }
  return data.user || null;
}

/** Returns the current user id (or null). */
export async function getCurrentUserId() {
  const u = await getCurrentUser();
  return u?.id ?? null;
}

/** Reads your profile. */
export async function getMyProfile() {
  const uid = await getCurrentUserId();
  if (!uid) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, verse_ref, verse_text, short_id, created_at')
    .eq('id', uid)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

/** Upserts your profile (keeps `id` = current user). */
export async function updateMyProfile(partial) {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error('Not signed in');

  const payload = { id: uid, ...partial };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Subscribe to your profile changes. Returns an unsubscribe function.
 * Server-side filter avoids unrelated events.
 */
export async function subscribeMyProfile(callback) {
  const uid = await getCurrentUserId();
  if (!uid) return () => {};

  const ch = supabase
    .channel('my-profile-rt')
    .on(
      'postgres_changes',
      {
        schema: 'public',
        table: 'profiles',
        event: '*',
        filter: `id=eq.${uid}`,
      },
      (payload) => callback(payload)
    )
    .subscribe();

  return () => supabase.removeChannel(ch);
}

/** Sign out of the current session. */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Permanently delete current account (server RPC). */
export async function deleteCurrentUser() {
  const { error } = await supabase.rpc('delete_current_user');
  if (error) throw error;
}

/** True if the current session is anonymous (guest). */
export async function isGuest() {
  const u = await getCurrentUser();
  return !!u?.is_anonymous;
}

/** Simple email sign-up (for upgrade flow). */
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}
