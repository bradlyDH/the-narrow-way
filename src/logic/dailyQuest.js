// // src/logic/dailyQuest.js
// import { getDb } from '../storage/db';
// import { getTodaysVirtue } from './dailyVirtue';
// import { getString, setString } from '../storage/mmkv';
// import { supabase } from '../supabase';

// const QUEST_CACHE_PREFIX = 'quest-data:';

// // Exported so other modules (if needed) can get today's key
// export function todayKey() {
//   const now = new Date();
//   const yyyy = now.getFullYear();
//   const mm = String(now.getMonth() + 1).padStart(2, '0');
//   const dd = String(now.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// // ---------- COMPLETION HELPERS (quest_status table) ----------

// export async function isQuestCompletedToday() {
//   const db = await getDb();
//   const dateStr = todayKey();

//   try {
//     const row = await db.getFirstAsync(
//       `
//       SELECT completed
//       FROM quest_status
//       WHERE date = ?
//       LIMIT 1;
//     `,
//       [dateStr]
//     );

//     return !!(row && row.completed);
//   } catch (e) {
//     console.warn('[dailyQuest] isQuestCompletedToday error:', e);
//     return false;
//   }
// }

// // src/logic/dailyQuest.js
// import { getDb } from '../storage/db';
// import { getTodaysVirtue } from './dailyVirtue';
// import { getString, setString } from '../storage/mmkv';
// import { supabase } from '../supabase';

// // --- NEW: stable local user id for signed-out / offline mode ---
// const LOCAL_UID_KEY = 'auth:local-user-id';
// function getLocalUserId() {
//   let id = getString(LOCAL_UID_KEY, null);
//   if (!id) {
//     // Simple stable id; if you have uuid available, use that instead.
//     id = 'local-' + Math.random().toString(36).slice(2, 10);
//     setString(LOCAL_UID_KEY, id);
//   }
//   return id;
// }
// async function getScopedUserId() {
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     return user?.id ?? getLocalUserId();
//   } catch {
//     return getLocalUserId();
//   }
// }

// // --- OPTIONAL (but recommended): ensure table schema matches our usage ---
// export async function ensureQuestStatusTable() {
//   const db = await getDb();
//   // Composite PK (user_id, date)
//   await db.runAsync(`
//     CREATE TABLE IF NOT EXISTS quest_status (
//       user_id TEXT NOT NULL,
//       date TEXT NOT NULL,
//       completed INTEGER NOT NULL DEFAULT 0,
//       completed_at TEXT,
//       PRIMARY KEY (user_id, date)
//     );
//   `);

//   // If you previously had a table without user_id, you'd add a migration here:
//   // - PRAGMA table_info('quest_status') to check columns
//   // - ALTER TABLE ... ADD COLUMN user_id TEXT
//   // - UPDATE quest_status SET user_id = '<some default or local id>' WHERE user_id IS NULL
//   // - CREATE UNIQUE INDEX IF NOT EXISTS quest_status_user_date ON quest_status(user_id, date);
// }

// // ---------- COMPLETION HELPERS (quest_status table) ----------
// export async function isQuestCompletedToday() {
//   const db = await getDb();
//   const dateStr = todayKey();
//   const userId = await getScopedUserId();

//   try {
//     const row = await db.getFirstAsync(
//       `
//       SELECT completed
//       FROM quest_status
//       WHERE user_id = ? AND date = ?
//       LIMIT 1;
//     `,
//       [userId, dateStr]
//     );
//     return !!(row && row.completed);
//   } catch (e) {
//     console.warn('[dailyQuest] isQuestCompletedToday error:', e);
//     return false;
//   }
// }

// export async function markQuestCompletedToday() {
//   const db = await getDb();
//   const dateStr = todayKey();
//   const userId = await getScopedUserId();
//   const completedAt = new Date().toISOString();

//   // 1) Local SQLite (now includes user_id)
//   try {
//     await db.runAsync(
//       `
//         INSERT OR REPLACE INTO quest_status (user_id, date, completed, completed_at)
//         VALUES (?, ?, 1, ?);
//       `,
//       [userId, dateStr, completedAt]
//     );
//   } catch (e) {
//     console.warn('[dailyQuest] markQuestCompletedToday DB error:', e);
//   }

//   // 2) MMKV cache stays the same
//   const cacheKey = QUEST_CACHE_PREFIX + dateStr;
//   try {
//     const raw = getString(cacheKey, null);
//     if (raw) {
//       const parsed = JSON.parse(raw);
//       parsed.completed = true;
//       setString(cacheKey, JSON.stringify(parsed));
//     }
//   } catch (e) {
//     console.warn('[dailyQuest] markQuestCompletedToday cache update error:', e);
//   }

//   // 3) Remote Supabase (already user-scoped)
//   try {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       await supabase.from('quest_status').upsert(
//         {
//           user_id: user.id,
//           date: dateStr,
//           completed: true,
//           completed_at: completedAt,
//         },
//         { onConflict: 'user_id,date' }
//       );
//     }
//   } catch (e) {
//     console.warn('[dailyQuest] Failed to sync quest_status to Supabase:', e);
//   }

//   return true;
// }

// // ---------- QUESTION PICKING HELPERS ----------

// async function pickOneQuestion(db, virtue, type) {
//   const rows = await db.getAllAsync(
//     `
//     SELECT id, type, prompt, options_json, answer_index,
//            scripture_ref, scripture_passage
//     FROM questions
//     WHERE active = 1
//       AND virtue = ?
//       AND type = ?
//     ORDER BY RANDOM()
//     LIMIT 1;
//   `,
//     [virtue, type]
//   );

//   if (!rows || !rows.length) return null;
//   const q = rows[0];

//   let options = [];
//   try {
//     options = JSON.parse(q.options_json || '[]');
//   } catch {
//     options = [];
//   }

//   return {
//     id: q.id,
//     type: q.type,
//     prompt: q.prompt,
//     options,
//     answerIndex: q.answer_index,
//     scriptureRef: q.scripture_ref || null,
//     scripturePassage: q.scripture_passage || null,
//   };
// }

// // Build a *fresh* quest (questions only) for today
// async function buildQuestForToday() {
//   const db = await getDb();
//   const virtue = getTodaysVirtue(); // "Faith" | "Love" | "Patience" | "Kindness"

//   const scenario = await pickOneQuestion(db, virtue, 'scenario');
//   const verse = await pickOneQuestion(db, virtue, 'verse');
//   const general = await pickOneQuestion(db, 'General', 'general');

//   const questions = [scenario, verse, general].filter(Boolean);

//   if (!questions.length) {
//     questions.push({
//       id: 'placeholder',
//       type: 'scenario',
//       prompt:
//         'Today, look for a small way to obey Jesus in your ordinary routine.',
//       options: ['Got it!'],
//       answerIndex: 0,
//       scriptureRef: 'James 1:22',
//       scripturePassage:
//         'But be doers of the word, and not hearers only, deceiving yourselves.',
//     });
//   }

//   return {
//     virtue,
//     questions,
//   };
// }

// // ---------- MAIN API (with per-day cache) ----------

// export async function getOrCreateTodaysQuest() {
//   const dateStr = todayKey();
//   const cacheKey = QUEST_CACHE_PREFIX + dateStr;

//   // 1️⃣ Try MMKV cache first
//   try {
//     const raw = getString(cacheKey, null);
//     if (raw) {
//       const cached = JSON.parse(raw);

//       // Always re-check completion status from SQLite so we trust DB over cache
//       const done = await isQuestCompletedToday();

//       return {
//         ...cached,
//         date: cached.date || dateStr,
//         completed: done,
//       };
//     }
//   } catch (e) {
//     console.warn('[dailyQuest] failed to read cached quest:', e);
//   }

//   // 2️⃣ No cache → build new quest based on today’s virtue
//   const virtue = getTodaysVirtue();
//   const completed = await isQuestCompletedToday();

//   if (completed) {
//     // Already completed: return "done" quest with no questions
//     const quest = {
//       date: dateStr,
//       virtue,
//       questions: [],
//       completed: true,
//     };
//     try {
//       setString(cacheKey, JSON.stringify(quest));
//     } catch (e) {
//       console.warn('[dailyQuest] failed to write completed quest cache:', e);
//     }
//     return quest;
//   }

//   // Not completed → build today’s 3-question quest
//   const built = await buildQuestForToday();

//   const quest = {
//     date: dateStr,
//     virtue: built.virtue,
//     questions: built.questions,
//     completed: false,
//   };

//   try {
//     setString(cacheKey, JSON.stringify(quest));
//   } catch (e) {
//     console.warn('[dailyQuest] failed to write quest cache:', e);
//   }

//   return quest;
// }

// // ---------- Virtue helper for Journal / other screens ----------

// export async function getTodaysQuestVirtue() {
//   const dateStr = todayKey();
//   const cacheKey = QUEST_CACHE_PREFIX + dateStr;

//   try {
//     const raw = getString(cacheKey, null);
//     if (raw) {
//       const cached = JSON.parse(raw);
//       if (cached && typeof cached.virtue === 'string') {
//         return cached.virtue;
//       }
//     }
//   } catch (e) {
//     console.warn('[dailyQuest] getTodaysQuestVirtue cache error:', e);
//   }

//   // Fallback: pure rotation if nothing cached yet
//   return getTodaysVirtue() || 'Today';
// }

// src/logic/dailyQuest.js
import { getDb } from '../storage/db';
import { getTodaysVirtue } from './dailyVirtue';
import { getString, setString } from '../storage/mmkv';
import { supabase } from '../supabase';

const QUEST_CACHE_PREFIX = 'quest-data:';

export function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// --- stable local user id for signed-out / offline mode ---
const LOCAL_UID_KEY = 'auth:local-user-id';
function getLocalUserId() {
  let id = getString(LOCAL_UID_KEY, null);
  if (!id) {
    id = 'local-' + Math.random().toString(36).slice(2, 10);
    setString(LOCAL_UID_KEY, id);
  }
  return id;
}
async function getScopedUserId() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? getLocalUserId();
  } catch {
    return getLocalUserId();
  }
}

// ---------- COMPLETION HELPERS (quest_status table) ----------
export async function isQuestCompletedToday() {
  const db = await getDb();
  const dateStr = todayKey();
  const userId = await getScopedUserId();

  try {
    const row = await db.getFirstAsync(
      `
      SELECT completed
      FROM quest_status
      WHERE user_id = ? AND date = ?
      LIMIT 1;
      `,
      [userId, dateStr]
    );
    return !!(row && row.completed);
  } catch (e) {
    console.warn('[dailyQuest] isQuestCompletedToday error:', e);
    return false;
  }
}

export async function markQuestCompletedToday() {
  const db = await getDb();
  const dateStr = todayKey();
  const userId = await getScopedUserId();
  const completedAt = new Date().toISOString();

  // 1) Local SQLite (now includes user_id)
  try {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO quest_status (user_id, date, completed, completed_at)
      VALUES (?, ?, 1, ?);
      `,
      [userId, dateStr, completedAt]
    );
  } catch (e) {
    console.warn('[dailyQuest] markQuestCompletedToday DB error:', e);
  }

  // 2) MMKV cache update
  const cacheKey = QUEST_CACHE_PREFIX + dateStr;
  try {
    const raw = getString(cacheKey, null);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.completed = true;
      setString(cacheKey, JSON.stringify(parsed));
    }
  } catch (e) {
    console.warn('[dailyQuest] markQuestCompletedToday cache update error:', e);
  }

  // 3) Supabase sync (user-scoped)
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('quest_status').upsert(
        {
          user_id: user.id,
          date: dateStr,
          completed: true,
          completed_at: completedAt,
        },
        { onConflict: 'user_id,date' }
      );
    }
  } catch (e) {
    console.warn('[dailyQuest] Failed to sync quest_status to Supabase:', e);
  }

  return true;
}

// ---------- QUESTION PICKING HELPERS ----------
async function pickOneQuestion(db, virtue, type) {
  const rows = await db.getAllAsync(
    `
    SELECT id, type, prompt, options_json, answer_index,
           scripture_ref, scripture_passage
    FROM questions
    WHERE active = 1
      AND virtue = ?
      AND type = ?
    ORDER BY RANDOM()
    LIMIT 1;
    `,
    [virtue, type]
  );

  if (!rows || !rows.length) return null;
  const q = rows[0];

  let options = [];
  try {
    options = JSON.parse(q.options_json || '[]');
  } catch {
    options = [];
  }

  return {
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    options,
    answerIndex: q.answer_index,
    scriptureRef: q.scripture_ref || null,
    scripturePassage: q.scripture_passage || null,
  };
}

// Build a *fresh* quest (questions only) for today
async function buildQuestForToday() {
  const db = await getDb();
  const virtue = getTodaysVirtue(); // "Faith" | "Love" | "Patience" | "Kindness"

  const scenario = await pickOneQuestion(db, virtue, 'scenario');
  const verse = await pickOneQuestion(db, virtue, 'verse');
  const general = await pickOneQuestion(db, 'General', 'general');

  const questions = [scenario, verse, general].filter(Boolean);

  if (!questions.length) {
    questions.push({
      id: 'placeholder',
      type: 'scenario',
      prompt:
        'Today, look for a small way to obey Jesus in your ordinary routine.',
      options: ['Got it!'],
      answerIndex: 0,
      scriptureRef: 'James 1:22',
      scripturePassage:
        'But be doers of the word, and not hearers only, deceiving yourselves.',
    });
  }

  return { virtue, questions };
}

// ---------- MAIN API (with per-day cache) ----------
export async function getOrCreateTodaysQuest() {
  const dateStr = todayKey();
  const cacheKey = QUEST_CACHE_PREFIX + dateStr;

  // 1) Try MMKV cache first
  try {
    const raw = getString(cacheKey, null);
    if (raw) {
      const cached = JSON.parse(raw);

      // Always re-check completion status from SQLite
      const done = await isQuestCompletedToday();

      return {
        ...cached,
        date: cached.date || dateStr,
        completed: done,
      };
    }
  } catch (e) {
    console.warn('[dailyQuest] failed to read cached quest:', e);
  }

  // 2) No cache → build new quest
  const virtue = getTodaysVirtue();
  const completed = await isQuestCompletedToday();

  if (completed) {
    const quest = { date: dateStr, virtue, questions: [], completed: true };
    try {
      setString(cacheKey, JSON.stringify(quest));
    } catch (e) {
      console.warn('[dailyQuest] failed to write completed quest cache:', e);
    }
    return quest;
  }

  const built = await buildQuestForToday();
  const quest = {
    date: dateStr,
    virtue: built.virtue,
    questions: built.questions,
    completed: false,
  };

  try {
    setString(cacheKey, JSON.stringify(quest));
  } catch (e) {
    console.warn('[dailyQuest] failed to write quest cache:', e);
  }

  return quest;
}

// ---------- Virtue helper for Journal / other screens ----------
export async function getTodaysQuestVirtue() {
  const dateStr = todayKey();
  const cacheKey = QUEST_CACHE_PREFIX + dateStr;

  try {
    const raw = getString(cacheKey, null);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && typeof cached.virtue === 'string') {
        return cached.virtue;
      }
    }
  } catch (e) {
    console.warn('[dailyQuest] getTodaysQuestVirtue cache error:', e);
  }

  // Fallback: pure rotation if nothing cached yet
  return getTodaysVirtue() || 'Today';
}
