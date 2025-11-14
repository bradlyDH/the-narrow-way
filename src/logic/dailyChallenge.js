// // // // src/logic/dailyChallenge.js
// // // import { getDb } from '../storage/db';
// // // import { getString, setString } from '../storage/mmkv';

// // // const KEY_PREFIX = 'challenge:';

// // // function getTodayKey() {
// // //   const now = new Date();
// // //   const yyyy = now.getFullYear();
// // //   const mm = String(now.getMonth() + 1).padStart(2, '0');
// // //   const dd = String(now.getDate()).padStart(2, '0');
// // //   return `${yyyy}-${mm}-${dd}`;
// // // }

// // // export async function getOrCreateTodaysChallenge() {
// // //   const key = KEY_PREFIX + getTodayKey();

// // //   // 1️⃣ Check cached value in MMKV shim first
// // //   const cached = getString(key, null);
// // //   if (cached) {
// // //     try {
// // //       return JSON.parse(cached);
// // //     } catch {
// // //       // ignore parse error & fall through
// // //     }
// // //   }

// // //   // 2️⃣ Fallback: grab any active challenge from SQLite
// // //   const db = await getDb();

// // //   let rows = [];
// // //   try {
// // //     rows = await db.getAllAsync(
// // //       'SELECT id, virtue, prompt, scripture_ref FROM challenges WHERE active = 1 LIMIT 1;'
// // //     );
// // //   } catch (e) {
// // //     console.warn('Error querying challenges table:', e);
// // //   }

// // //   const challenge = rows[0] || {
// // //     id: 'placeholder',
// // //     virtue: null,
// // //     prompt: 'Take a moment today to encourage someone with kind words.',
// // //     scripture_ref: null,
// // //   };

// // //   // 3️⃣ Cache it for the rest of the day
// // //   try {
// // //     setString(key, JSON.stringify(challenge));
// // //   } catch {}

// // //   return challenge;
// // // }

// // // 14-day logic
// // // src/logic/dailyChallenge.js
// // import { getDb } from '../storage/db';
// // import { getString, setString } from '../storage/mmkv';

// // const KEY_PREFIX = 'challenge:';

// // function getTodayKey() {
// //   const now = new Date();
// //   const yyyy = now.getFullYear();
// //   const mm = String(now.getMonth() + 1).padStart(2, '0');
// //   const dd = String(now.getDate()).padStart(2, '0');
// //   return `${yyyy}-${mm}-${dd}`;
// // }

// // function getIsoNow() {
// //   return new Date().toISOString();
// // }

// // function getIso14DaysAgo() {
// //   const d = new Date();
// //   d.setDate(d.getDate() - 14);
// //   return d.toISOString();
// // }

// // export async function getOrCreateTodaysChallenge() {
// //   const todayKey = getTodayKey();
// //   const cacheKey = KEY_PREFIX + todayKey;

// //   // 1️⃣ Check cached value in MMKV first so it doesn't change all day
// //   const cached = getString(cacheKey, null);
// //   if (cached) {
// //     try {
// //       return JSON.parse(cached);
// //     } catch {
// //       // fall through to recompute
// //     }
// //   }

// //   const db = await getDb();

// //   // 2️⃣ Find which challenges were used in the last 14 days
// //   let recentIds = new Set();
// //   try {
// //     const cutoff = getIso14DaysAgo();
// //     const recentRows = await db.getAllAsync(
// //       `
// //       SELECT challenge_id
// //       FROM challenge_log
// //       WHERE served_at >= ?
// //     `,
// //       [cutoff]
// //     );
// //     recentIds = new Set(recentRows.map((r) => r.challenge_id));
// //   } catch (e) {
// //     console.warn('Error querying challenge_log:', e);
// //   }

// //   // 3️⃣ Load all active challenges
// //   let challenges = [];
// //   try {
// //     challenges = await db.getAllAsync(
// //       `
// //       SELECT id, virtue, prompt, scripture_ref
// //       FROM challenges
// //       WHERE active = 1
// //     `
// //     );
// //   } catch (e) {
// //     console.warn('Error querying challenges table:', e);
// //   }

// //   // 4️⃣ Filter out those used in the last 14 days
// //   let candidates = challenges.filter((c) => !recentIds.has(c.id));

// //   // If everything has been used recently, fall back to all active challenges
// //   if (candidates.length === 0 && challenges.length > 0) {
// //     candidates = challenges;
// //   }

// //   // If there are still no rows at all, use a nice placeholder
// //   let chosen =
// //     candidates.length > 0
// //       ? candidates[Math.floor(Math.random() * candidates.length)]
// //       : {
// //           id: 'placeholder',
// //           virtue: null,
// //           prompt: 'Take a moment today to encourage someone with kind words.',
// //           scripture_ref: null,
// //         };

// //   // 5️⃣ Cache for the rest of the day
// //   try {
// //     setString(cacheKey, JSON.stringify(chosen));
// //   } catch (e) {
// //     console.warn('Error caching today challenge:', e);
// //   }

// //   // 6️⃣ Log to challenge_log for cooldown logic
// //   try {
// //     const servedAt = getIsoNow();
// //     const logId = `${chosen.id}:${todayKey}`;

// //     await db.runAsync(
// //       `
// //       INSERT OR REPLACE INTO challenge_log (id, challenge_id, served_at)
// //       VALUES (?, ?, ?)
// //     `,
// //       [logId, chosen.id, servedAt]
// //     );
// //   } catch (e) {
// //     console.warn('Error inserting challenge_log row:', e);
// //   }

// //   return chosen;
// // }

// // adding rotational logic to daily challenge tile
// // src/logic/dailyChallenge.js
// import { getDb } from '../storage/db';

// // We no longer rely on MMKV here; selection is deterministic per day.

// function getTodayKey() {
//   const now = new Date();
//   const yyyy = now.getFullYear();
//   const mm = String(now.getMonth() + 1).padStart(2, '0');
//   const dd = String(now.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// function getIsoNow() {
//   return new Date().toISOString();
// }

// function getIso14DaysAgo() {
//   const d = new Date();
//   d.setDate(d.getDate() - 14);
//   return d.toISOString();
// }

// // Simple deterministic hash so the same input string always maps to
// // the same integer, but looks "random enough".
// function hashString(str) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i += 1) {
//     hash = (hash * 31 + str.charCodeAt(i)) | 0; // keep in 32 bits
//   }
//   return Math.abs(hash);
// }

// export async function getOrCreateTodaysChallenge() {
//   const todayKey = getTodayKey();
//   const db = await getDb();

//   // 1️⃣ Find which challenges were used in the last 14 days
//   let recentIds = new Set();
//   try {
//     const cutoff = getIso14DaysAgo();
//     const recentRows = await db.getAllAsync(
//       `
//       SELECT challenge_id
//       FROM challenge_log
//       WHERE served_at >= ?
//     `,
//       [cutoff]
//     );
//     recentIds = new Set(recentRows.map((r) => r.challenge_id));
//   } catch (e) {
//     console.warn('Error querying challenge_log:', e);
//   }

//   // 2️⃣ Load all active challenges
//   let challenges = [];
//   try {
//     challenges = await db.getAllAsync(
//       `
//       SELECT id, virtue, prompt, scripture_ref
//       FROM challenges
//       WHERE active = 1
//     `
//     );
//   } catch (e) {
//     console.warn('Error querying challenges table:', e);
//   }

//   // 3️⃣ Filter out those used in the last 14 days
//   let candidates = challenges.filter((c) => !recentIds.has(c.id));

//   // If everything has been used recently, fall back to all active challenges
//   if (candidates.length === 0 && challenges.length > 0) {
//     candidates = challenges;
//   }

//   // 4️⃣ If still empty, fall back to a nice placeholder
//   if (candidates.length === 0) {
//     return {
//       id: 'placeholder',
//       virtue: null,
//       prompt: 'Take a moment today to encourage someone with kind words.',
//       scripture_ref: null,
//     };
//   }

//   // 5️⃣ Deterministically choose one candidate for today:
//   // hash(todayKey) => index in [0, candidates.length)
//   const idx = hashString(todayKey) % candidates.length;
//   const chosen = candidates[idx];

//   // 6️⃣ Log to challenge_log so the 14-day cooldown can work
//   try {
//     const servedAt = getIsoNow();
//     const logId = `${chosen.id}:${todayKey}`;

//     await db.runAsync(
//       `
//       INSERT OR REPLACE INTO challenge_log (id, challenge_id, served_at)
//       VALUES (?, ?, ?)
//     `,
//       [logId, chosen.id, servedAt]
//     );
//   } catch (e) {
//     console.warn('Error inserting challenge_log row:', e);
//   }

//   return chosen;
// }

// src/logic/dailyChallenge.js
import { getDb } from '../storage/db';

// We store + look up challenges by simple date strings: YYYY-MM-DD

function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`; // e.g. "2025-11-14"
}

function fourteenDaysAgoKey() {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function mapRowToChallenge(row) {
  return {
    id: row.id,
    virtue: row.virtue,
    prompt: row.prompt,
    scriptureRef: row.scripture_ref || null,
  };
}

// ✅ Main entry point: get or create today's Live It Out challenge
export async function getOrCreateTodaysChallenge() {
  const db = await getDb();
  const today = todayKey();

  // 1️⃣ If we've already logged a challenge for *today*, reuse it.
  // This guarantees the challenge does NOT change mid-day.
  try {
    const existing = await db.getFirstAsync(
      `
      SELECT c.id, c.virtue, c.prompt, c.scripture_ref
      FROM challenge_log l
      JOIN challenges c ON c.id = l.challenge_id
      WHERE l.served_at = ?
      LIMIT 1;
    `,
      [today]
    );

    if (existing) {
      return mapRowToChallenge(existing);
    }
  } catch (e) {
    console.warn('Error reading today challenge from challenge_log:', e);
  }

  // 2️⃣ No logged challenge yet → choose one with a 14-day cooldown window.

  // 2a) Collect challenges used in the last 14 days
  let recentIds = new Set();
  try {
    const cutoff = fourteenDaysAgoKey();
    const recentRows = await db.getAllAsync(
      `
      SELECT challenge_id
      FROM challenge_log
      WHERE served_at >= ?
    `,
      [cutoff]
    );
    recentIds = new Set(recentRows.map((r) => r.challenge_id));
  } catch (e) {
    console.warn('Error querying recent challenge_log rows:', e);
  }

  // 2b) Load all active challenges
  let challenges = [];
  try {
    challenges = await db.getAllAsync(
      `
      SELECT id, virtue, prompt, scripture_ref
      FROM challenges
      WHERE active = 1
    `
    );
  } catch (e) {
    console.warn('Error querying challenges table:', e);
  }

  // 2c) Filter out challenges used in the last 14 days
  let candidates = challenges.filter((c) => !recentIds.has(c.id));

  // If all challenges have been used recently, allow all active challenges.
  if (candidates.length === 0 && challenges.length > 0) {
    candidates = challenges;
  }

  // 3️⃣ If there are still none, return a friendly default.
  if (candidates.length === 0) {
    return {
      id: 'placeholder',
      virtue: null,
      prompt: 'Take a moment today to encourage someone with kind words.',
      scripture_ref: null,
    };
  }

  // 4️⃣ Pick one "random" challenge from the candidate list.
  // We use true randomness here, but once it's chosen, we log it for today,
  // and from then on we *always* reuse that logged row for this date.
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  // 5️⃣ Log to challenge_log for today so:
  //   - we don't pick it again for 14 days,
  //   - we can reuse it whenever the app reloads on the same day.
  try {
    const logId = `${chosen.id}:${today}`;
    await db.runAsync(
      `
      INSERT OR REPLACE INTO challenge_log (id, challenge_id, served_at)
      VALUES (?, ?, ?)
    `,
      [logId, chosen.id, today]
    );
  } catch (e) {
    console.warn('Error inserting challenge_log row:', e);
  }

  return mapRowToChallenge(chosen);
}
