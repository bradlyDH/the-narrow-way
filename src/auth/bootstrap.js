// // src/auth/bootstrap.js
// import { supabase } from '../supabase';

// export async function ensureSessionAndProfile() {
//   // 1) Check for existing session
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   let user = session?.user;

//   // 2) If no session, sign in anonymously
//   if (!user) {
//     const { data, error } = await supabase.auth.signInAnonymously();
//     if (error) throw error;
//     user = data.user;
//   }

//   // 3) Upsert the profile (id = auth uid)
//   const { error: upErr } = await supabase
//     .from('profiles')
//     .upsert({ id: user.id }, { onConflict: 'id' });
//   if (upErr) throw upErr;

//   return user; // has .id for your short code
// }

// src/auth/bootstrap.js
import { supabase } from '../supabase';

export async function ensureSessionAndProfile() {
  // 1) Is there already a session?
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let user = session?.user;

  // 2) If not, create an anonymous session (no PII)
  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    user = data.user;
  }

  // 3) Ensure a profile row exists (minimal fields)
  const { error: upErr } = await supabase
    .from('profiles')
    .upsert({ id: user.id }, { onConflict: 'id' });
  if (upErr) throw upErr;

  return user; // has a stable UUID you can turn into a short code
}
