// // // // // src/auth/bootstrap.js
// // // // import { supabase } from '../supabase';

// // // // export async function ensureSessionAndProfile() {
// // // //   // 1) Check for existing session
// // // //   const {
// // // //     data: { session },
// // // //   } = await supabase.auth.getSession();
// // // //   let user = session?.user;

// // // //   // 2) If no session, sign in anonymously
// // // //   if (!user) {
// // // //     const { data, error } = await supabase.auth.signInAnonymously();
// // // //     if (error) throw error;
// // // //     user = data.user;
// // // //   }

// // // //   // 3) Upsert the profile (id = auth uid)
// // // //   const { error: upErr } = await supabase
// // // //     .from('profiles')
// // // //     .upsert({ id: user.id }, { onConflict: 'id' });
// // // //   if (upErr) throw upErr;

// // // //   return user; // has .id for your short code
// // // // }

// // // // src/auth/bootstrap.js
// // // import { supabase } from '../supabase';

// // // export async function ensureSessionAndProfile() {
// // //   // 1) Is there already a session?
// // //   const {
// // //     data: { session },
// // //   } = await supabase.auth.getSession();
// // //   let user = session?.user;

// // //   // 2) If not, create an anonymous session (no PII)
// // //   if (!user) {
// // //     const { data, error } = await supabase.auth.signInAnonymously();
// // //     if (error) throw error;
// // //     user = data.user;
// // //   }

// // //   // 3) Ensure a profile row exists (minimal fields)
// // //   const { error: upErr } = await supabase
// // //     .from('profiles')
// // //     .upsert({ id: user.id }, { onConflict: 'id' });
// // //   if (upErr) throw upErr;

// // //   return user; // has a stable UUID you can turn into a short code
// // // }

// // // src/auth/bootstrap.js
// // import { supabase } from '../supabase';

// // export async function ensureSessionAndProfile() {
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession();
// //   let user = session?.user;

// //   if (!user) {
// //     const { data, error } = await supabase.auth.signInAnonymously();
// //     if (error) throw error;
// //     user = data.user;
// //   }

// //   // create profile row if missing
// //   await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' });

// //   return user;
// // }

// import { supabase } from '../supabase';

// export async function ensureSessionAndProfile() {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   let user = session?.user;

//   if (!user) {
//     const { data, error } = await supabase.auth.signInAnonymously();
//     if (error) throw error;
//     user = data.user;
//   }

//   // Ensure a minimal profile row exists (id = auth uid)
//   await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' });

//   return user;
// }

// src/auth/bootstrap.js
import { supabase } from '../supabase';

/**
 * Ensures there is an auth session (anonymous) and a minimal profile row.
 * Returns the current user.
 */
export async function ensureSessionAndProfile() {
  // 1) Check for an existing session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let user = session?.user;

  // 2) Create an anonymous session if needed (no PII)
  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    user = data.user;
  }

  // 3) Ensure a profile row exists (id = auth uid). This is safe to call repeatedly.
  await upsertProfileRow(user.id);

  return user;
}

/** Convenience: get the current userId quickly (or null if none). */
export async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

/* ---------- internal helpers ---------- */

async function upsertProfileRow(userId) {
  // Try once
  let { error } = await supabase
    .from('profiles')
    .upsert({ id: userId }, { onConflict: 'id' });

  // Rare race: if the anonymous user was just created, upsert may fail once.
  // Small delay + retry smooths over that first-second timing.
  if (error) {
    await wait(150);
    ({ error } = await supabase
      .from('profiles')
      .upsert({ id: userId }, { onConflict: 'id' }));
    if (error) throw error;
  }
}

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
