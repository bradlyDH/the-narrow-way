// // // // src/logic/syncContent.js
// // // import { getDb } from '../storage/db';
// // // import { getString, setString } from '../storage/mmkv';
// // // import { supabase } from '../lib/supabase'; // adjust path to your client

// // // const LAST_SYNC_KEY = 'lastSyncAt';

// // // export async function syncContent() {
// // //   const db = await getDb();

// // //   const lastSyncAt = getString(LAST_SYNC_KEY, null);

// // //   // Build Supabase queries
// // //   let questionsQuery = supabase
// // //     .from('questions')
// // //     .select('*')
// // //     .eq('active', true);

// // //   let challengesQuery = supabase
// // //     .from('challenges')
// // //     .select('*')
// // //     .eq('active', true);

// // //   // If we already synced once, only get newer/updated rows
// // //   if (lastSyncAt) {
// // //     questionsQuery = questionsQuery.gte('updated_at', lastSyncAt);
// // //     challengesQuery = challengesQuery.gte('updated_at', lastSyncAt);
// // //   }

// // //   const [questionsResult, challengesResult] = await Promise.all([
// // //     questionsQuery,
// // //     challengesQuery,
// // //   ]);

// // //   if (questionsResult.error) {
// // //     console.warn('Error fetching questions:', questionsResult.error);
// // //   }
// // //   if (challengesResult.error) {
// // //     console.warn('Error fetching challenges:', challengesResult.error);
// // //   }

// // //   const questions = questionsResult.data ?? [];
// // //   const challenges = challengesResult.data ?? [];

// // //   // Nothing to do? still bump lastSyncAt so we don't spam the server
// // //   if (questions.length === 0 && challenges.length === 0) {
// // //     setString(LAST_SYNC_KEY, new Date().toISOString());
// // //     return;
// // //   }

// // //   // Wrap writes in a transaction
// // //   await db.withTransactionAsync(async () => {
// // //     // Upsert questions
// // //     for (const q of questions) {
// // //       await db.runAsync(
// // //         `
// // //           INSERT OR REPLACE INTO questions (
// // //             id, virtue, type, prompt,
// // //             options_json, answer_index,
// // //             scripture_ref, scripture_passage,
// // //             updated_at, active
// // //           )
// // //           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
// // //         `,
// // //         [
// // //           q.id,
// // //           q.virtue,
// // //           q.type,
// // //           q.prompt,
// // //           JSON.stringify(q.options_json ?? []),
// // //           q.answer_index,
// // //           q.scripture_ref ?? null,
// // //           q.scripture_passage ?? null,
// // //           q.updated_at,
// // //           q.active ? 1 : 0,
// // //         ]
// // //       );
// // //     }

// // //     // Upsert challenges
// // //     for (const c of challenges) {
// // //       await db.runAsync(
// // //         `
// // //           INSERT OR REPLACE INTO challenges (
// // //             id, virtue, prompt,
// // //             scripture_ref, updated_at, active
// // //           )
// // //           VALUES (?, ?, ?, ?, ?, ?);
// // //         `,
// // //         [
// // //           c.id,
// // //           c.virtue,
// // //           c.prompt,
// // //           c.scripture_ref ?? null,
// // //           c.updated_at,
// // //           c.active ? 1 : 0,
// // //         ]
// // //       );
// // //     }
// // //   });

// // //   // Record successful sync
// // //   setString(LAST_SYNC_KEY, new Date().toISOString());
// // // }

// // // src/logic/syncContent.js
// // import { getDb } from '../storage/db';
// // import { getString, setString } from '../storage/mmkv';
// // import { supabase } from '../supabase';

// // const LAST_SYNC_KEY = 'lastSyncAt';

// // export async function syncContent() {
// //   const db = getDb(); // no await now

// //   const lastSyncAt = getString(LAST_SYNC_KEY, null);

// //   let questionsQuery = supabase
// //     .from('questions')
// //     .select('*')
// //     .eq('active', true);

// //   let challengesQuery = supabase
// //     .from('challenges')
// //     .select('*')
// //     .eq('active', true);

// //   if (lastSyncAt) {
// //     questionsQuery = questionsQuery.gte('updated_at', lastSyncAt);
// //     challengesQuery = challengesQuery.gte('updated_at', lastSyncAt);
// //   }

// //   const [questionsResult, challengesResult] = await Promise.all([
// //     questionsQuery,
// //     challengesQuery,
// //   ]);

// //   if (questionsResult.error) {
// //     console.warn('Error fetching questions:', questionsResult.error);
// //   }
// //   if (challengesResult.error) {
// //     console.warn('Error fetching challenges:', challengesResult.error);
// //   }

// //   const questions = questionsResult.data ?? [];
// //   const challenges = challengesResult.data ?? [];

// //   if (questions.length === 0 && challenges.length === 0) {
// //     setString(LAST_SYNC_KEY, new Date().toISOString());
// //     return;
// //   }

// //   // Legacy transaction API
// //   db.transaction((tx) => {
// //     // Upsert questions
// //     for (const q of questions) {
// //       tx.executeSql(
// //         `
// //         INSERT OR REPLACE INTO questions (
// //           id, virtue, type, prompt,
// //           options_json, answer_index,
// //           scripture_ref, scripture_passage,
// //           updated_at, active
// //         )
// //         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
// //         `,
// //         [
// //           q.id,
// //           q.virtue,
// //           q.type,
// //           q.prompt,
// //           JSON.stringify(q.options_json ?? []),
// //           q.answer_index,
// //           q.scripture_ref ?? null,
// //           q.scripture_passage ?? null,
// //           q.updated_at,
// //           q.active ? 1 : 0,
// //         ]
// //       );
// //     }

// //     // Upsert challenges
// //     for (const c of challenges) {
// //       tx.executeSql(
// //         `
// //         INSERT OR REPLACE INTO challenges (
// //           id, virtue, prompt,
// //           scripture_ref, updated_at, active
// //         )
// //         VALUES (?, ?, ?, ?, ?, ?);
// //         `,
// //         [
// //           c.id,
// //           c.virtue,
// //           c.prompt,
// //           c.scripture_ref ?? null,
// //           c.updated_at,
// //           c.active ? 1 : 0,
// //         ]
// //       );
// //     }
// //   });

// //   setString(LAST_SYNC_KEY, new Date().toISOString());
// // }

// // src/logic/syncContent.js
// import { getDb } from '../storage/db';
// import { getString, setString } from '../storage/mmkv';
// import { supabase } from '../supabase';

// const LAST_SYNC_KEY = 'lastSyncAt';

// export async function syncContent() {
//   const db = getDb(); // classic SQLite API, sync

//   const lastSyncAt = getString(LAST_SYNC_KEY, null);

//   let questionsQuery = supabase
//     .from('questions')
//     .select('*')
//     .eq('active', true);

//   let challengesQuery = supabase
//     .from('challenges')
//     .select('*')
//     .eq('active', true);

//   if (lastSyncAt) {
//     questionsQuery = questionsQuery.gte('updated_at', lastSyncAt);
//     challengesQuery = challengesQuery.gte('updated_at', lastSyncAt);
//   }

//   const [questionsResult, challengesResult] = await Promise.all([
//     questionsQuery,
//     challengesQuery,
//   ]);

//   if (questionsResult.error) {
//     console.warn('Error fetching questions:', questionsResult.error);
//   }
//   if (challengesResult.error) {
//     console.warn('Error fetching challenges:', challengesResult.error);
//   }

//   const questions = questionsResult.data ?? [];
//   const challenges = challengesResult.data ?? [];

//   if (questions.length === 0 && challenges.length === 0) {
//     setString(LAST_SYNC_KEY, new Date().toISOString());
//     return;
//   }

//   // Single transaction for all upserts
//   db.transaction((tx) => {
//     for (const q of questions) {
//       tx.executeSql(
//         `
//         INSERT OR REPLACE INTO questions (
//           id, virtue, type, prompt,
//           options_json, answer_index,
//           scripture_ref, scripture_passage,
//           updated_at, active
//         )
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//         `,
//         [
//           q.id,
//           q.virtue,
//           q.type,
//           q.prompt,
//           JSON.stringify(q.options_json ?? []),
//           q.answer_index,
//           q.scripture_ref ?? null,
//           q.scripture_passage ?? null,
//           q.updated_at,
//           q.active ? 1 : 0,
//         ]
//       );
//     }

//     for (const c of challenges) {
//       tx.executeSql(
//         `
//         INSERT OR REPLACE INTO challenges (
//           id, virtue, prompt,
//           scripture_ref, updated_at, active
//         )
//         VALUES (?, ?, ?, ?, ?, ?);
//         `,
//         [
//           c.id,
//           c.virtue,
//           c.prompt,
//           c.scripture_ref ?? null,
//           c.updated_at,
//           c.active ? 1 : 0,
//         ]
//       );
//     }
//   });

//   setString(LAST_SYNC_KEY, new Date().toISOString());
// }

// src/logic/syncContent.js
import { getDb } from '../storage/db';
import { getString, setString } from '../storage/mmkv';
import { supabase } from '../supabase';

const LAST_SYNC_KEY = 'lastSyncAt';

export async function syncContent() {
  const db = await getDb(); // ✅ async now

  const lastSyncAt = getString(LAST_SYNC_KEY, null);

  let questionsQuery = supabase
    .from('questions')
    .select('*')
    .eq('active', true);

  let challengesQuery = supabase
    .from('challenges')
    .select('*')
    .eq('active', true);

  if (lastSyncAt) {
    questionsQuery = questionsQuery.gte('updated_at', lastSyncAt);
    challengesQuery = challengesQuery.gte('updated_at', lastSyncAt);
  }

  const [questionsResult, challengesResult] = await Promise.all([
    questionsQuery,
    challengesQuery,
  ]);

  if (questionsResult.error) {
    console.warn('Error fetching questions:', questionsResult.error);
  }
  if (challengesResult.error) {
    console.warn('Error fetching challenges:', challengesResult.error);
  }

  const questions = questionsResult.data ?? [];
  const challenges = challengesResult.data ?? [];

  if (questions.length === 0 && challenges.length === 0) {
    setString(LAST_SYNC_KEY, new Date().toISOString());
    return;
  }

  // ✅ Use withTransactionAsync + runAsync with the new API
  await db.withTransactionAsync(async () => {
    for (const q of questions) {
      await db.runAsync(
        `
        INSERT OR REPLACE INTO questions (
          id, virtue, type, prompt,
          options_json, answer_index,
          scripture_ref, scripture_passage,
          updated_at, active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        [
          q.id,
          q.virtue,
          q.type,
          q.prompt,
          JSON.stringify(q.options_json ?? []),
          q.answer_index,
          q.scripture_ref ?? null,
          q.scripture_passage ?? null,
          q.updated_at,
          q.active ? 1 : 0,
        ]
      );
    }

    for (const c of challenges) {
      await db.runAsync(
        `
        INSERT OR REPLACE INTO challenges (
          id, virtue, prompt,
          scripture_ref, updated_at, active
        )
        VALUES (?, ?, ?, ?, ?, ?);
        `,
        [
          c.id,
          c.virtue,
          c.prompt,
          c.scripture_ref ?? null,
          c.updated_at,
          c.active ? 1 : 0,
        ]
      );
    }
  });

  setString(LAST_SYNC_KEY, new Date().toISOString());
}
