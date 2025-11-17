// // // // // // // src/logic/dailyQuest.js
// // // // // // import { storage } from '../storage/mmkv';
// // // // // // import { getDb } from '../storage/db';
// // // // // // import { getTodaysVirtue } from './dailyVirtue';

// // // // // // const QUEST_DONE_PREFIX = 'quest-done:';
// // // // // // const QUEST_DATA_PREFIX = 'quest-data:';

// // // // // // function todayKey() {
// // // // // //   return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
// // // // // // }

// // // // // // function doneKeyFor(dateStr) {
// // // // // //   return `${QUEST_DONE_PREFIX}${dateStr}`;
// // // // // // }

// // // // // // function dataKeyFor(dateStr) {
// // // // // //   return `${QUEST_DATA_PREFIX}${dateStr}`;
// // // // // // }

// // // // // // // ✅ Has the user already completed today’s quest?
// // // // // // export async function isQuestCompletedToday() {
// // // // // //   const key = doneKeyFor(todayKey());
// // // // // //   const val = storage.getString(key);
// // // // // //   return val === '1';
// // // // // // }

// // // // // // // ✅ Mark quest as completed for today
// // // // // // export async function markQuestCompletedToday() {
// // // // // //   const key = doneKeyFor(todayKey());
// // // // // //   storage.set(key, '1');
// // // // // // }

// // // // // // // Internal helper: map DB row -> question object
// // // // // // function mapRowToQuestion(row) {
// // // // // //   let options = [];
// // // // // //   try {
// // // // // //     if (typeof row.options_json === 'string') {
// // // // // //       options = JSON.parse(row.options_json);
// // // // // //     } else if (row.options_json) {
// // // // // //       // some drivers return JSON already parsed
// // // // // //       options = row.options_json;
// // // // // //     }
// // // // // //   } catch (e) {
// // // // // //     options = [];
// // // // // //   }

// // // // // //   return {
// // // // // //     id: row.id,
// // // // // //     type: row.type,
// // // // // //     virtue: row.virtue,
// // // // // //     prompt: row.prompt,
// // // // // //     options,
// // // // // //     answerIndex: row.answer_index,
// // // // // //     scriptureRef: row.scripture_ref || null,
// // // // // //     scripturePassage: row.scripture_passage || null,
// // // // // //   };
// // // // // // }

// // // // // // async function pickRandomQuestion(db, virtue, type) {
// // // // // //   const rows = await db.getAllAsync(
// // // // // //     `
// // // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // // //            scripture_ref, scripture_passage
// // // // // //     FROM questions
// // // // // //     WHERE virtue = ? AND type = ? AND active = 1
// // // // // //     ORDER BY RANDOM()
// // // // // //     LIMIT 1;
// // // // // //   `,
// // // // // //     [virtue, type]
// // // // // //   );

// // // // // //   if (!rows || rows.length === 0) return null;
// // // // // //   return mapRowToQuestion(rows[0]);
// // // // // // }

// // // // // // async function pickRandomGeneralQuestion(db) {
// // // // // //   const rows = await db.getAllAsync(
// // // // // //     `
// // // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // // //            scripture_ref, scripture_passage
// // // // // //     FROM questions
// // // // // //     WHERE virtue = 'General' AND type = 'general' AND active = 1
// // // // // //     ORDER BY RANDOM()
// // // // // //     LIMIT 1;
// // // // // //   `
// // // // // //   );
// // // // // //   if (!rows || rows.length === 0) return null;
// // // // // //   return mapRowToQuestion(rows[0]);
// // // // // // }

// // // // // // // ✅ Fetch (or create+cache) today’s quest: scenario + verse + general
// // // // // // export async function getOrCreateTodaysQuest() {
// // // // // //   const today = todayKey();
// // // // // //   const cacheKey = dataKeyFor(today);

// // // // // //   const cached = storage.getString(cacheKey);
// // // // // //   if (cached) {
// // // // // //     try {
// // // // // //       const parsed = JSON.parse(cached);
// // // // // //       // basic sanity check
// // // // // //       if (parsed && Array.isArray(parsed.questions)) {
// // // // // //         return parsed;
// // // // // //       }
// // // // // //     } catch {}
// // // // // //   }

// // // // // //   const virtueInfo = await getTodaysVirtue();
// // // // // //   const virtue =
// // // // // //     (virtueInfo &&
// // // // // //       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
// // // // // //     'Faith';

// // // // // //   const db = await getDb();

// // // // // //   // For now: simple random selection (cooldown logic can be added later)
// // // // // //   const scenarioQ = await pickRandomQuestion(db, virtue, 'scenario');
// // // // // //   const verseQ = await pickRandomQuestion(db, virtue, 'verse');
// // // // // //   const generalQ = await pickRandomGeneralQuestion(db);

// // // // // //   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

// // // // // //   const quest = {
// // // // // //     date: today,
// // // // // //     virtue,
// // // // // //     questions,
// // // // // //   };

// // // // // //   storage.set(cacheKey, JSON.stringify(quest));

// // // // // //   return quest;
// // // // // // }
// // // // // /*
// // // // // When picking questions:

// // // // // Prefer questions not served in the last 14 days.

// // // // // If none are available, fall back to “any active” (so the quest never breaks).

// // // // // When generating today’s quest (only on the first time that day):

// // // // // Log each picked question into served_log with:

// // // // // id = questionId:YYYY-MM-DD

// // // // // served_at = YYYY-MM-DD

// // // // // Keep using MMKV cache so we don’t re-roll questions later in the same day.
// // // // // */

// // // // // // src/logic/dailyQuest.js
// // // // // import { storage } from '../storage/mmkv';
// // // // // import { getDb } from '../storage/db';
// // // // // import { getTodaysVirtue } from './dailyVirtue';

// // // // // const QUEST_DONE_PREFIX = 'quest-done:';
// // // // // const QUEST_DATA_PREFIX = 'quest-data:';

// // // // // // --------------------------------------------------------
// // // // // // 🚨 TEMPORARY: override today's date for testing quests
// // // // // // Comment this out when you're done testing
// // // // // // --------------------------------------------------------
// // // // // const TEST_DAY_OFFSET = 0; // 0 = today, 1 = tomorrow, 2 = next day, -1 = yesterday

// // // // // function todayKey() {
// // // // //   const d = new Date();
// // // // //   if (TEST_DAY_OFFSET !== 0) {
// // // // //     d.setDate(d.getDate() + TEST_DAY_OFFSET);
// // // // //   }
// // // // //   return d.toISOString().slice(0, 10);
// // // // // }

// // // // // // function todayKey() {
// // // // // //   return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
// // // // // // }

// // // // // function fourteenDaysAgoKey() {
// // // // //   const now = new Date();
// // // // //   const ms = now.getTime() - 14 * 24 * 60 * 60 * 1000;
// // // // //   return new Date(ms).toISOString().slice(0, 10);
// // // // // }

// // // // // function doneKeyFor(dateStr) {
// // // // //   return `${QUEST_DONE_PREFIX}${dateStr}`;
// // // // // }

// // // // // function dataKeyFor(dateStr) {
// // // // //   return `${QUEST_DATA_PREFIX}${dateStr}`;
// // // // // }

// // // // // // ✅ Has the user already completed today’s quest?
// // // // // export async function isQuestCompletedToday() {
// // // // //   const key = doneKeyFor(todayKey());
// // // // //   const val = storage.getString(key);
// // // // //   return val === '1';
// // // // // }

// // // // // // ✅ Mark quest as completed for today
// // // // // export async function markQuestCompletedToday() {
// // // // //   const key = doneKeyFor(todayKey());
// // // // //   storage.set(key, '1');
// // // // // }

// // // // // // Internal helper: map DB row -> question object
// // // // // function mapRowToQuestion(row) {
// // // // //   let options = [];
// // // // //   try {
// // // // //     if (typeof row.options_json === 'string') {
// // // // //       options = JSON.parse(row.options_json);
// // // // //     } else if (row.options_json) {
// // // // //       options = row.options_json;
// // // // //     }
// // // // //   } catch (e) {
// // // // //     options = [];
// // // // //   }

// // // // //   return {
// // // // //     id: row.id,
// // // // //     type: row.type,
// // // // //     virtue: row.virtue,
// // // // //     prompt: row.prompt,
// // // // //     options,
// // // // //     answerIndex: row.answer_index,
// // // // //     scriptureRef: row.scripture_ref || null,
// // // // //     scripturePassage: row.scripture_passage || null,
// // // // //   };
// // // // // }

// // // // // // 📝 Log that a question was served on a given day (local SQLite only)
// // // // // async function logServedQuestion(db, questionId, dateStr) {
// // // // //   if (!questionId || !dateStr) return;
// // // // //   const id = `${questionId}:${dateStr}`;

// // // // //   await db.runAsync(
// // // // //     `
// // // // //     INSERT OR IGNORE INTO served_log (id, question_id, served_at)
// // // // //     VALUES (?, ?, ?);
// // // // //   `,
// // // // //     [id, questionId, dateStr]
// // // // //   );
// // // // // }

// // // // // // 🔍 Pick a random question with 14-day cooldown, with fallback
// // // // // async function pickRandomQuestionWithCooldown(db, virtue, type) {
// // // // //   const cutoff = fourteenDaysAgoKey();

// // // // //   // First try: respect 14-day cooldown
// // // // //   const rows = await db.getAllAsync(
// // // // //     `
// // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // //            scripture_ref, scripture_passage
// // // // //     FROM questions
// // // // //     WHERE virtue = ?
// // // // //       AND type = ?
// // // // //       AND active = 1
// // // // //       AND id NOT IN (
// // // // //         SELECT question_id
// // // // //         FROM served_log
// // // // //         WHERE served_at >= ?
// // // // //       )
// // // // //     ORDER BY RANDOM()
// // // // //     LIMIT 1;
// // // // //   `,
// // // // //     [virtue, type, cutoff]
// // // // //   );

// // // // //   if (rows && rows.length > 0) {
// // // // //     return mapRowToQuestion(rows[0]);
// // // // //   }

// // // // //   // Fallback: if we ran out of "fresh" questions, allow any active
// // // // //   const fallbackRows = await db.getAllAsync(
// // // // //     `
// // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // //            scripture_ref, scripture_passage
// // // // //     FROM questions
// // // // //     WHERE virtue = ?
// // // // //       AND type = ?
// // // // //       AND active = 1
// // // // //     ORDER BY RANDOM()
// // // // //     LIMIT 1;
// // // // //   `,
// // // // //     [virtue, type]
// // // // //   );

// // // // //   if (fallbackRows && fallbackRows.length > 0) {
// // // // //     return mapRowToQuestion(fallbackRows[0]);
// // // // //   }

// // // // //   return null;
// // // // // }

// // // // // async function pickRandomGeneralQuestionWithCooldown(db) {
// // // // //   const cutoff = fourteenDaysAgoKey();

// // // // //   const rows = await db.getAllAsync(
// // // // //     `
// // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // //            scripture_ref, scripture_passage
// // // // //     FROM questions
// // // // //     WHERE virtue = 'General'
// // // // //       AND type = 'general'
// // // // //       AND active = 1
// // // // //       AND id NOT IN (
// // // // //         SELECT question_id
// // // // //         FROM served_log
// // // // //         WHERE served_at >= ?
// // // // //       )
// // // // //     ORDER BY RANDOM()
// // // // //     LIMIT 1;
// // // // //   `,
// // // // //     [cutoff]
// // // // //   );

// // // // //   if (rows && rows.length > 0) {
// // // // //     return mapRowToQuestion(rows[0]);
// // // // //   }

// // // // //   // Fallback if we run out of "fresh" general questions
// // // // //   const fallbackRows = await db.getAllAsync(
// // // // //     `
// // // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // // //            scripture_ref, scripture_passage
// // // // //     FROM questions
// // // // //     WHERE virtue = 'General'
// // // // //       AND type = 'general'
// // // // //       AND active = 1
// // // // //     ORDER BY RANDOM()
// // // // //     LIMIT 1;
// // // // //   `
// // // // //   );

// // // // //   if (fallbackRows && fallbackRows.length > 0) {
// // // // //     return mapRowToQuestion(fallbackRows[0]);
// // // // //   }

// // // // //   return null;
// // // // // }

// // // // // // ✅ Fetch (or create+cache) today’s quest: scenario + verse + general
// // // // // export async function getOrCreateTodaysQuest() {
// // // // //   const today = todayKey();
// // // // //   const cacheKey = dataKeyFor(today);

// // // // //   const cached = storage.getString(cacheKey);
// // // // //   if (cached) {
// // // // //     try {
// // // // //       const parsed = JSON.parse(cached);
// // // // //       if (parsed && Array.isArray(parsed.questions)) {
// // // // //         return parsed;
// // // // //       }
// // // // //     } catch {}
// // // // //   }

// // // // //   const virtueInfo = await getTodaysVirtue();
// // // // //   const virtue =
// // // // //     (virtueInfo &&
// // // // //       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
// // // // //     'Faith';

// // // // //   const db = await getDb();

// // // // //   // Use cooldown-aware selection
// // // // //   const scenarioQ = await pickRandomQuestionWithCooldown(
// // // // //     db,
// // // // //     virtue,
// // // // //     'scenario'
// // // // //   );
// // // // //   const verseQ = await pickRandomQuestionWithCooldown(db, virtue, 'verse');
// // // // //   const generalQ = await pickRandomGeneralQuestionWithCooldown(db);

// // // // //   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

// // // // //   const quest = {
// // // // //     date: today,
// // // // //     virtue,
// // // // //     questions,
// // // // //   };

// // // // //   // Log served questions for cooldown tracking
// // // // //   for (const q of questions) {
// // // // //     await logServedQuestion(db, q.id, today);
// // // // //   }

// // // // //   // Cache in MMKV for the rest of the day
// // // // //   storage.set(cacheKey, JSON.stringify(quest));

// // // // //   return quest;
// // // // // }

// // // // // src/logic/dailyQuest.js
// // // // import { storage } from '../storage/mmkv';
// // // // import { getDb } from '../storage/db';
// // // // import { getTodaysVirtue } from './dailyVirtue';

// // // // const QUEST_DONE_PREFIX = 'quest-done:';
// // // // const QUEST_DATA_PREFIX = 'quest-data:';

// // // // function todayKey() {
// // // //   return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
// // // // }

// // // // function fourteenDaysAgoKey() {
// // // //   const now = new Date();
// // // //   const ms = now.getTime() - 14 * 24 * 60 * 60 * 1000;
// // // //   return new Date(ms).toISOString().slice(0, 10);
// // // // }

// // // // function doneKeyFor(dateStr) {
// // // //   return `${QUEST_DONE_PREFIX}${dateStr}`;
// // // // }

// // // // function dataKeyFor(dateStr) {
// // // //   return `${QUEST_DATA_PREFIX}${dateStr}`;
// // // // }

// // // // // ✅ Has the user already completed today’s quest?
// // // // export async function isQuestCompletedToday() {
// // // //   const key = doneKeyFor(todayKey());
// // // //   const val = storage.getString(key);
// // // //   return val === '1';
// // // // }

// // // // // ✅ Mark quest as completed for today (flag + cached quest)
// // // // export async function markQuestCompletedToday() {
// // // //   const date = todayKey();
// // // //   const doneKey = doneKeyFor(date);
// // // //   storage.set(doneKey, '1');

// // // //   // Also mark the cached quest as completed
// // // //   const cacheKey = dataKeyFor(date);
// // // //   const cached = storage.getString(cacheKey);
// // // //   if (cached) {
// // // //     try {
// // // //       const parsed = JSON.parse(cached);
// // // //       const updated = { ...parsed, completed: true };
// // // //       storage.set(cacheKey, JSON.stringify(updated));
// // // //     } catch {
// // // //       // ignore parse errors, not fatal
// // // //     }
// // // //   }
// // // // }

// // // // // -------- Helper mapping & cooldown --------

// // // // function mapRowToQuestion(row) {
// // // //   let options = [];
// // // //   try {
// // // //     if (typeof row.options_json === 'string') {
// // // //       options = JSON.parse(row.options_json);
// // // //     } else if (row.options_json) {
// // // //       options = row.options_json;
// // // //     }
// // // //   } catch (e) {
// // // //     options = [];
// // // //   }

// // // //   return {
// // // //     id: row.id,
// // // //     type: row.type,
// // // //     virtue: row.virtue,
// // // //     prompt: row.prompt,
// // // //     options,
// // // //     answerIndex: row.answer_index,
// // // //     scriptureRef: row.scripture_ref || null,
// // // //     scripturePassage: row.scripture_passage || null,
// // // //   };
// // // // }

// // // // async function logServedQuestion(db, questionId, dateStr) {
// // // //   if (!questionId || !dateStr) return;
// // // //   const id = `${questionId}:${dateStr}`;

// // // //   await db.runAsync(
// // // //     `
// // // //     INSERT OR IGNORE INTO served_log (id, question_id, served_at)
// // // //     VALUES (?, ?, ?);
// // // //   `,
// // // //     [id, questionId, dateStr]
// // // //   );
// // // // }

// // // // async function pickRandomQuestionWithCooldown(db, virtue, type) {
// // // //   const cutoff = fourteenDaysAgoKey();

// // // //   const rows = await db.getAllAsync(
// // // //     `
// // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // //            scripture_ref, scripture_passage
// // // //     FROM questions
// // // //     WHERE virtue = ?
// // // //       AND type = ?
// // // //       AND active = 1
// // // //       AND id NOT IN (
// // // //         SELECT question_id
// // // //         FROM served_log
// // // //         WHERE served_at >= ?
// // // //       )
// // // //     ORDER BY RANDOM()
// // // //     LIMIT 1;
// // // //   `,
// // // //     [virtue, type, cutoff]
// // // //   );

// // // //   if (rows && rows.length > 0) {
// // // //     return mapRowToQuestion(rows[0]);
// // // //   }

// // // //   // Fallback: allow any active if no "fresh" ones
// // // //   const fallbackRows = await db.getAllAsync(
// // // //     `
// // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // //            scripture_ref, scripture_passage
// // // //     FROM questions
// // // //     WHERE virtue = ?
// // // //       AND type = ?
// // // //       AND active = 1
// // // //     ORDER BY RANDOM()
// // // //     LIMIT 1;
// // // //   `,
// // // //     [virtue, type]
// // // //   );

// // // //   if (fallbackRows && fallbackRows.length > 0) {
// // // //     return mapRowToQuestion(fallbackRows[0]);
// // // //   }

// // // //   return null;
// // // // }

// // // // async function pickRandomGeneralQuestionWithCooldown(db) {
// // // //   const cutoff = fourteenDaysAgoKey();

// // // //   const rows = await db.getAllAsync(
// // // //     `
// // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // //            scripture_ref, scripture_passage
// // // //     FROM questions
// // // //     WHERE virtue = 'General'
// // // //       AND type = 'general'
// // // //       AND active = 1
// // // //       AND id NOT IN (
// // // //         SELECT question_id
// // // //         FROM served_log
// // // //         WHERE served_at >= ?
// // // //       )
// // // //     ORDER BY RANDOM()
// // // //     LIMIT 1;
// // // //   `,
// // // //     [cutoff]
// // // //   );

// // // //   if (rows && rows.length > 0) {
// // // //     return mapRowToQuestion(rows[0]);
// // // //   }

// // // //   const fallbackRows = await db.getAllAsync(
// // // //     `
// // // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // // //            scripture_ref, scripture_passage
// // // //     FROM questions
// // // //     WHERE virtue = 'General'
// // // //       AND type = 'general'
// // // //       AND active = 1
// // // //     ORDER BY RANDOM()
// // // //     LIMIT 1;
// // // //   `
// // // //   );

// // // //   if (fallbackRows && fallbackRows.length > 0) {
// // // //     return mapRowToQuestion(fallbackRows[0]);
// // // //   }

// // // //   return null;
// // // // }

// // // // // ✅ Fetch (or create+cache) today’s quest: scenario + verse + general
// // // // export async function getOrCreateTodaysQuest() {
// // // //   const today = todayKey();
// // // //   const cacheKey = dataKeyFor(today);

// // // //   const cached = storage.getString(cacheKey);
// // // //   if (cached) {
// // // //     try {
// // // //       const parsed = JSON.parse(cached);
// // // //       if (parsed && Array.isArray(parsed.questions)) {
// // // //         return parsed;
// // // //       }
// // // //     } catch {
// // // //       // ignore and regenerate below
// // // //     }
// // // //   }

// // // //   const virtueInfo = await getTodaysVirtue();
// // // //   const virtue =
// // // //     (virtueInfo &&
// // // //       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
// // // //     'Faith';

// // // //   const db = await getDb();

// // // //   const scenarioQ = await pickRandomQuestionWithCooldown(
// // // //     db,
// // // //     virtue,
// // // //     'scenario'
// // // //   );
// // // //   const verseQ = await pickRandomQuestionWithCooldown(db, virtue, 'verse');
// // // //   const generalQ = await pickRandomGeneralQuestionWithCooldown(db);

// // // //   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

// // // //   const quest = {
// // // //     date: today,
// // // //     virtue,
// // // //     completed: false, // <-- important new flag
// // // //     questions,
// // // //   };

// // // //   for (const q of questions) {
// // // //     await logServedQuestion(db, q.id, today);
// // // //   }

// // // //   storage.set(cacheKey, JSON.stringify(quest));

// // // //   return quest;
// // // // }

// // // // src/logic/dailyQuest.js
// // // import { storage } from '../storage/mmkv';
// // // import { getDb } from '../storage/db';
// // // import { getTodaysVirtue } from './dailyVirtue';

// // // const QUEST_DONE_PREFIX = 'quest-done:'; // legacy, kept for safety
// // // const QUEST_DATA_PREFIX = 'quest-data:'; // main source of truth

// // // function todayKey() {
// // //   return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
// // // }

// // // function fourteenDaysAgoKey() {
// // //   const now = new Date();
// // //   const ms = now.getTime() - 14 * 24 * 60 * 60 * 1000;
// // //   return new Date(ms).toISOString().slice(0, 10);
// // // }

// // // function doneKeyFor(dateStr) {
// // //   return `${QUEST_DONE_PREFIX}${dateStr}`;
// // // }

// // // function dataKeyFor(dateStr) {
// // //   return `${QUEST_DATA_PREFIX}${dateStr}`;
// // // }

// // // // ---- Cached quest helpers ----

// // // function getCachedQuestForDate(dateStr) {
// // //   const key = dataKeyFor(dateStr);
// // //   const raw = storage.getString(key);
// // //   if (!raw) return null;
// // //   try {
// // //     const parsed = JSON.parse(raw);
// // //     if (!parsed || !Array.isArray(parsed.questions)) {
// // //       return null;
// // //     }
// // //     return parsed;
// // //   } catch {
// // //     return null;
// // //   }
// // // }

// // // function saveQuestForDate(dateStr, quest) {
// // //   const key = dataKeyFor(dateStr);
// // //   try {
// // //     storage.set(key, JSON.stringify(quest));
// // //   } catch {
// // //     // ignore
// // //   }
// // // }

// // // // ✅ Has the user already completed today’s quest?
// // // export async function isQuestCompletedToday() {
// // //   const date = todayKey();

// // //   // primary: check cached quest object
// // //   const cached = getCachedQuestForDate(date);
// // //   if (cached && cached.completed) {
// // //     return true;
// // //   }

// // //   // secondary: legacy flag (kept for compatibility)
// // //   const doneKey = doneKeyFor(date);
// // //   const val = storage.getString(doneKey);
// // //   return val === '1';
// // // }

// // // // ✅ Mark quest as completed for today (updates cache + legacy flag)
// // // export async function markQuestCompletedToday() {
// // //   const date = todayKey();

// // //   // legacy flag
// // //   const doneKey = doneKeyFor(date);
// // //   storage.set(doneKey, '1');

// // //   // update cached quest
// // //   const cached = getCachedQuestForDate(date);
// // //   if (cached) {
// // //     const updated = { ...cached, completed: true };
// // //     saveQuestForDate(date, updated);
// // //   } else {
// // //     // if for some reason we don't have a cached quest, create a minimal one
// // //     const minimal = {
// // //       date,
// // //       virtue: 'Faith',
// // //       completed: true,
// // //       questions: [],
// // //     };
// // //     saveQuestForDate(date, minimal);
// // //   }
// // // }

// // // // ---- Question mapping & cooldown ----

// // // function mapRowToQuestion(row) {
// // //   let options = [];
// // //   try {
// // //     if (typeof row.options_json === 'string') {
// // //       options = JSON.parse(row.options_json);
// // //     } else if (row.options_json) {
// // //       options = row.options_json;
// // //     }
// // //   } catch (e) {
// // //     options = [];
// // //   }

// // //   return {
// // //     id: row.id,
// // //     type: row.type,
// // //     virtue: row.virtue,
// // //     prompt: row.prompt,
// // //     options,
// // //     answerIndex: row.answer_index,
// // //     scriptureRef: row.scripture_ref || null,
// // //     scripturePassage: row.scripture_passage || null,
// // //   };
// // // }

// // // async function logServedQuestion(db, questionId, dateStr) {
// // //   if (!questionId || !dateStr) return;
// // //   const id = `${questionId}:${dateStr}`;

// // //   await db.runAsync(
// // //     `
// // //     INSERT OR IGNORE INTO served_log (id, question_id, served_at)
// // //     VALUES (?, ?, ?);
// // //   `,
// // //     [id, questionId, dateStr]
// // //   );
// // // }

// // // async function pickRandomQuestionWithCooldown(db, virtue, type) {
// // //   const cutoff = fourteenDaysAgoKey();

// // //   const rows = await db.getAllAsync(
// // //     `
// // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // //            scripture_ref, scripture_passage
// // //     FROM questions
// // //     WHERE virtue = ?
// // //       AND type = ?
// // //       AND active = 1
// // //       AND id NOT IN (
// // //         SELECT question_id
// // //         FROM served_log
// // //         WHERE served_at >= ?
// // //       )
// // //     ORDER BY RANDOM()
// // //     LIMIT 1;
// // //   `,
// // //     [virtue, type, cutoff]
// // //   );

// // //   if (rows && rows.length > 0) {
// // //     return mapRowToQuestion(rows[0]);
// // //   }

// // //   // Fallback: allow any active if no "fresh" ones
// // //   const fallbackRows = await db.getAllAsync(
// // //     `
// // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // //            scripture_ref, scripture_passage
// // //     FROM questions
// // //     WHERE virtue = ?
// // //       AND type = ?
// // //       AND active = 1
// // //     ORDER BY RANDOM()
// // //     LIMIT 1;
// // //   `,
// // //     [virtue, type]
// // //   );

// // //   if (fallbackRows && fallbackRows.length > 0) {
// // //     return mapRowToQuestion(fallbackRows[0]);
// // //   }

// // //   return null;
// // // }

// // // async function pickRandomGeneralQuestionWithCooldown(db) {
// // //   const cutoff = fourteenDaysAgoKey();

// // //   const rows = await db.getAllAsync(
// // //     `
// // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // //            scripture_ref, scripture_passage
// // //     FROM questions
// // //     WHERE virtue = 'General'
// // //       AND type = 'general'
// // //       AND active = 1
// // //       AND id NOT IN (
// // //         SELECT question_id
// // //         FROM served_log
// // //         WHERE served_at >= ?
// // //       )
// // //     ORDER BY RANDOM()
// // //     LIMIT 1;
// // //   `,
// // //     [cutoff]
// // //   );

// // //   if (rows && rows.length > 0) {
// // //     return mapRowToQuestion(rows[0]);
// // //   }

// // //   const fallbackRows = await db.getAllAsync(
// // //     `
// // //     SELECT id, virtue, type, prompt, options_json, answer_index,
// // //            scripture_ref, scripture_passage
// // //     FROM questions
// // //     WHERE virtue = 'General'
// // //       AND type = 'general'
// // //       AND active = 1
// // //     ORDER BY RANDOM()
// // //     LIMIT 1;
// // //   `
// // //   );

// // //   if (fallbackRows && fallbackRows.length > 0) {
// // //     return mapRowToQuestion(fallbackRows[0]);
// // //   }

// // //   return null;
// // // }

// // // // ✅ Fetch (or return cached) today’s quest: scenario + verse + general
// // // export async function getOrCreateTodaysQuest() {
// // //   const today = todayKey();

// // //   // 1) Try cached quest first (even if completed)
// // //   const cached = getCachedQuestForDate(today);
// // //   if (cached) {
// // //     return cached;
// // //   }

// // //   // 2) Build a new one
// // //   const virtueInfo = await getTodaysVirtue();
// // //   const virtue =
// // //     (virtueInfo &&
// // //       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
// // //     'Faith';

// // //   const db = await getDb();

// // //   const scenarioQ = await pickRandomQuestionWithCooldown(
// // //     db,
// // //     virtue,
// // //     'scenario'
// // //   );
// // //   const verseQ = await pickRandomQuestionWithCooldown(db, virtue, 'verse');
// // //   const generalQ = await pickRandomGeneralQuestionWithCooldown(db);

// // //   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

// // //   const quest = {
// // //     date: today,
// // //     virtue,
// // //     completed: false, // <-- starts incomplete
// // //     questions,
// // //   };

// // //   for (const q of questions) {
// // //     await logServedQuestion(db, q.id, today);
// // //   }

// // //   saveQuestForDate(today, quest);

// // //   return quest;
// // // }

// // // debug logic
// // // src/logic/dailyQuest.js
// // import { storage } from '../storage/mmkv';
// // import { getDb } from '../storage/db';
// // import { getTodaysVirtue } from './dailyVirtue';

// // const QUEST_DONE_PREFIX = 'quest-done:'; // legacy, kept for safety
// // const QUEST_DATA_PREFIX = 'quest-data:'; // main source of truth

// // function todayKey() {
// //   const d = new Date();
// //   const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
// //   return key;
// // }

// // function fourteenDaysAgoKey() {
// //   const now = new Date();
// //   const ms = now.getTime() - 14 * 24 * 60 * 60 * 1000;
// //   return new Date(ms).toISOString().slice(0, 10);
// // }

// // function doneKeyFor(dateStr) {
// //   return `${QUEST_DONE_PREFIX}${dateStr}`;
// // }

// // function dataKeyFor(dateStr) {
// //   return `${QUEST_DATA_PREFIX}${dateStr}`;
// // }

// // // ---- Cached quest helpers ----

// // function getCachedQuestForDate(dateStr) {
// //   const key = dataKeyFor(dateStr);
// //   const raw = storage.getString(key);

// //   console.log('[dailyQuest] getCachedQuestForDate', {
// //     dateStr,
// //     key,
// //     hasRaw: !!raw,
// //   });

// //   if (!raw) return null;
// //   try {
// //     const parsed = JSON.parse(raw);
// //     if (!parsed || !Array.isArray(parsed.questions)) {
// //       console.log('[dailyQuest] cached quest invalid shape:', parsed);
// //       return null;
// //     }
// //     console.log('[dailyQuest] cached quest loaded:', {
// //       completed: parsed.completed,
// //       virtue: parsed.virtue,
// //       questions: parsed.questions.length,
// //     });
// //     return parsed;
// //   } catch (e) {
// //     console.log('[dailyQuest] error parsing cached quest:', e);
// //     return null;
// //   }
// // }

// // function saveQuestForDate(dateStr, quest) {
// //   const key = dataKeyFor(dateStr);
// //   try {
// //     storage.set(key, JSON.stringify(quest));
// //     console.log('[dailyQuest] saveQuestForDate', {
// //       dateStr,
// //       key,
// //       completed: quest.completed,
// //       virtue: quest.virtue,
// //       questions: quest.questions?.length || 0,
// //     });
// //   } catch (e) {
// //     console.log('[dailyQuest] error saving quest:', e);
// //   }
// // }

// // // ✅ Has the user already completed today’s quest?
// // export async function isQuestCompletedToday() {
// //   const date = todayKey();

// //   const cached = getCachedQuestForDate(date);
// //   if (cached && cached.completed) {
// //     console.log('[dailyQuest] isQuestCompletedToday → true (cached.completed)');
// //     return true;
// //   }

// //   const doneKey = doneKeyFor(date);
// //   const val = storage.getString(doneKey);
// //   console.log('[dailyQuest] isQuestCompletedToday legacy flag', {
// //     date,
// //     doneKey,
// //     val,
// //   });

// //   return val === '1';
// // }

// // // ✅ Mark quest as completed for today (updates cache + legacy flag)
// // export async function markQuestCompletedToday() {
// //   const date = todayKey();
// //   console.log('[dailyQuest] markQuestCompletedToday called for date', date);

// //   // legacy flag
// //   const doneKey = doneKeyFor(date);
// //   storage.set(doneKey, '1');

// //   const cached = getCachedQuestForDate(date);
// //   if (cached) {
// //     const updated = { ...cached, completed: true };
// //     saveQuestForDate(date, updated);
// //     console.log(
// //       '[dailyQuest] markQuestCompletedToday updated cached quest to completed=true'
// //     );
// //   } else {
// //     const minimal = {
// //       date,
// //       virtue: 'Faith',
// //       completed: true,
// //       questions: [],
// //     };
// //     saveQuestForDate(date, minimal);
// //     console.log(
// //       '[dailyQuest] markQuestCompletedToday created minimal completed quest'
// //     );
// //   }
// // }

// // // ---- Question mapping & cooldown ----

// // function mapRowToQuestion(row) {
// //   let options = [];
// //   try {
// //     if (typeof row.options_json === 'string') {
// //       options = JSON.parse(row.options_json);
// //     } else if (row.options_json) {
// //       options = row.options_json;
// //     }
// //   } catch (e) {
// //     options = [];
// //   }

// //   return {
// //     id: row.id,
// //     type: row.type,
// //     virtue: row.virtue,
// //     prompt: row.prompt,
// //     options,
// //     answerIndex: row.answer_index,
// //     scriptureRef: row.scripture_ref || null,
// //     scripturePassage: row.scripture_passage || null,
// //   };
// // }

// // async function logServedQuestion(db, questionId, dateStr) {
// //   if (!questionId || !dateStr) return;
// //   const id = `${questionId}:${dateStr}`;

// //   await db.runAsync(
// //     `
// //     INSERT OR IGNORE INTO served_log (id, question_id, served_at)
// //     VALUES (?, ?, ?);
// //   `,
// //     [id, questionId, dateStr]
// //   );
// // }

// // async function pickRandomQuestionWithCooldown(db, virtue, type) {
// //   const cutoff = fourteenDaysAgoKey();

// //   const rows = await db.getAllAsync(
// //     `
// //     SELECT id, virtue, type, prompt, options_json, answer_index,
// //            scripture_ref, scripture_passage
// //     FROM questions
// //     WHERE virtue = ?
// //       AND type = ?
// //       AND active = 1
// //       AND id NOT IN (
// //         SELECT question_id
// //         FROM served_log
// //         WHERE served_at >= ?
// //       )
// //     ORDER BY RANDOM()
// //     LIMIT 1;
// //   `,
// //     [virtue, type, cutoff]
// //   );

// //   if (rows && rows.length > 0) {
// //     return mapRowToQuestion(rows[0]);
// //   }

// //   const fallbackRows = await db.getAllAsync(
// //     `
// //     SELECT id, virtue, type, prompt, options_json, answer_index,
// //            scripture_ref, scripture_passage
// //     FROM questions
// //     WHERE virtue = ?
// //       AND type = ?
// //       AND active = 1
// //     ORDER BY RANDOM()
// //     LIMIT 1;
// //   `,
// //     [virtue, type]
// //   );

// //   if (fallbackRows && fallbackRows.length > 0) {
// //     return mapRowToQuestion(fallbackRows[0]);
// //   }

// //   return null;
// // }

// // async function pickRandomGeneralQuestionWithCooldown(db) {
// //   const cutoff = fourteenDaysAgoKey();

// //   const rows = await db.getAllAsync(
// //     `
// //     SELECT id, virtue, type, prompt, options_json, answer_index,
// //            scripture_ref, scripture_passage
// //     FROM questions
// //     WHERE virtue = 'General'
// //       AND type = 'general'
// //       AND active = 1
// //       AND id NOT IN (
// //         SELECT question_id
// //         FROM served_log
// //         WHERE served_at >= ?
// //       )
// //     ORDER BY RANDOM()
// //     LIMIT 1;
// //   `,
// //     [cutoff]
// //   );

// //   if (rows && rows.length > 0) {
// //     return mapRowToQuestion(rows[0]);
// //   }

// //   const fallbackRows = await db.getAllAsync(
// //     `
// //     SELECT id, virtue, type, prompt, options_json, answer_index,
// //            scripture_ref, scripture_passage
// //     FROM questions
// //     WHERE virtue = 'General'
// //       AND type = 'general'
// //       AND active = 1
// //     ORDER BY RANDOM()
// //     LIMIT 1;
// //   `
// //   );

// //   if (fallbackRows && fallbackRows.length > 0) {
// //     return mapRowToQuestion(fallbackRows[0]);
// //   }

// //   return null;
// // }

// // // ✅ Fetch (or return cached) today’s quest: scenario + verse + general
// // export async function getOrCreateTodaysQuest() {
// //   const today = todayKey();
// //   console.log('[dailyQuest] getOrCreateTodaysQuest for', today);

// //   // 1) Try cached quest first (even if completed)
// //   const cached = getCachedQuestForDate(today);
// //   if (cached) {
// //     console.log('[dailyQuest] returning cached quest for today');
// //     return cached;
// //   }

// //   console.log('[dailyQuest] no cached quest found; generating new quest');

// //   const virtueInfo = await getTodaysVirtue();
// //   const virtue =
// //     (virtueInfo &&
// //       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
// //     'Faith';

// //   const db = await getDb();

// //   const scenarioQ = await pickRandomQuestionWithCooldown(
// //     db,
// //     virtue,
// //     'scenario'
// //   );
// //   const verseQ = await pickRandomQuestionWithCooldown(db, virtue, 'verse');
// //   const generalQ = await pickRandomGeneralQuestionWithCooldown(db);

// //   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

// //   const quest = {
// //     date: today,
// //     virtue,
// //     completed: false,
// //     questions,
// //   };

// //   for (const q of questions) {
// //     await logServedQuestion(db, q.id, today);
// //   }

// //   saveQuestForDate(today, quest);

// //   return quest;
// // }

// // src/logic/dailyQuest.js
// import { storage } from '../storage/mmkv';
// import { getDb } from '../storage/db';
// import { getTodaysVirtue } from './dailyVirtue';

// const QUEST_DATA_PREFIX = 'quest-data:'; // cache for today’s question set (optional, session-level)

// function todayKey() {
//   return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
// }

// function fourteenDaysAgoKey() {
//   const now = new Date();
//   const ms = now.getTime() - 14 * 24 * 60 * 60 * 1000;
//   return new Date(ms).toISOString().slice(0, 10);
// }

// function dataKeyFor(dateStr) {
//   return `${QUEST_DATA_PREFIX}${dateStr}`;
// }

// // ---- Cached quest helpers (MMKV, best-effort) ----

// function getCachedQuestForDate(dateStr) {
//   const key = dataKeyFor(dateStr);
//   const raw = storage.getString(key);
//   if (!raw) return null;
//   try {
//     const parsed = JSON.parse(raw);
//     if (!parsed || !Array.isArray(parsed.questions)) {
//       return null;
//     }
//     return parsed;
//   } catch {
//     return null;
//   }
// }

// function saveQuestForDate(dateStr, quest) {
//   const key = dataKeyFor(dateStr);
//   try {
//     storage.set(key, JSON.stringify(quest));
//   } catch {
//     // ignore
//   }
// }

// // ✅ Has the user already completed today’s quest?
// //    → uses SQLite so it persists across full app restarts
// export async function isQuestCompletedToday() {
//   // const db = await getDb();
//   // const date = todayKey();

//   // const row = await db.getFirstAsync(
//   //   `SELECT completed FROM quest_status WHERE date = ?`,
//   //   [date]
//   // );
//   return false;
//   // return !!row && row.completed === 1;
// }

// // ✅ Mark quest as completed for today
// //    → writes to SQLite (authoritative) + updates cached quest if present
// export async function markQuestCompletedToday() {
//   const db = await getDb();
//   const date = todayKey();

//   await db.runAsync(
//     `
//     INSERT OR REPLACE INTO quest_status (date, completed)
//     VALUES (?, 1);
//   `,
//     [date]
//   );

//   const cached = getCachedQuestForDate(date);
//   if (cached) {
//     const updated = { ...cached, completed: true };
//     saveQuestForDate(date, updated);
//   }
// }

// // ---- Question mapping & cooldown ----

// function mapRowToQuestion(row) {
//   let options = [];
//   try {
//     if (typeof row.options_json === 'string') {
//       options = JSON.parse(row.options_json);
//     } else if (row.options_json) {
//       options = row.options_json;
//     }
//   } catch (e) {
//     options = [];
//   }

//   return {
//     id: row.id,
//     type: row.type,
//     virtue: row.virtue,
//     prompt: row.prompt,
//     options,
//     answerIndex: row.answer_index,
//     scriptureRef: row.scripture_ref || null,
//     scripturePassage: row.scripture_passage || null,
//   };
// }

// async function logServedQuestion(db, questionId, dateStr) {
//   if (!questionId || !dateStr) return;
//   const id = `${questionId}:${dateStr}`;

//   await db.runAsync(
//     `
//     INSERT OR IGNORE INTO served_log (id, question_id, served_at)
//     VALUES (?, ?, ?);
//   `,
//     [id, questionId, dateStr]
//   );
// }

// async function pickRandomQuestionWithCooldown(db, virtue, type) {
//   const cutoff = fourteenDaysAgoKey();

//   const rows = await db.getAllAsync(
//     `
//     SELECT id, virtue, type, prompt, options_json, answer_index,
//            scripture_ref, scripture_passage
//     FROM questions
//     WHERE virtue = ?
//       AND type = ?
//       AND active = 1
//       AND id NOT IN (
//         SELECT question_id
//         FROM served_log
//         WHERE served_at >= ?
//       )
//     ORDER BY RANDOM()
//     LIMIT 1;
//   `,
//     [virtue, type, cutoff]
//   );

//   if (rows && rows.length > 0) {
//     return mapRowToQuestion(rows[0]);
//   }

//   // Fallback: allow any active if no "fresh" ones
//   const fallbackRows = await db.getAllAsync(
//     `
//     SELECT id, virtue, type, prompt, options_json, answer_index,
//            scripture_ref, scripture_passage
//     FROM questions
//     WHERE virtue = ?
//       AND type = ?
//       AND active = 1
//     ORDER BY RANDOM()
//     LIMIT 1;
//   `,
//     [virtue, type]
//   );

//   if (fallbackRows && fallbackRows.length > 0) {
//     return mapRowToQuestion(fallbackRows[0]);
//   }

//   return null;
// }

// async function pickRandomGeneralQuestionWithCooldown(db) {
//   const cutoff = fourteenDaysAgoKey();

//   const rows = await db.getAllAsync(
//     `
//     SELECT id, virtue, type, prompt, options_json, answer_index,
//            scripture_ref, scripture_passage
//     FROM questions
//     WHERE virtue = 'General'
//       AND type = 'general'
//       AND active = 1
//       AND id NOT IN (
//         SELECT question_id
//         FROM served_log
//         WHERE served_at >= ?
//       )
//     ORDER BY RANDOM()
//     LIMIT 1;
//   `,
//     [cutoff]
//   );

//   if (rows && rows.length > 0) {
//     return mapRowToQuestion(rows[0]);
//   }

//   const fallbackRows = await db.getAllAsync(
//     `
//     SELECT id, virtue, type, prompt, options_json, answer_index,
//            scripture_ref, scripture_passage
//     FROM questions
//     WHERE virtue = 'General'
//       AND type = 'general'
//       AND active = 1
//     ORDER BY RANDOM()
//     LIMIT 1;
//   `
//   );

//   if (fallbackRows && fallbackRows.length > 0) {
//     return mapRowToQuestion(fallbackRows[0]);
//   }

//   return null;
// }

// // ✅ Fetch (or return cached) today’s quest: scenario + verse + general
// export async function getOrCreateTodaysQuest() {
//   const today = todayKey();

//   // 1) Try cached quest first (session-level convenience)
//   const cached = getCachedQuestForDate(today);
//   if (cached) {
//     return cached;
//   }

//   // 2) Build a new one from SQLite
//   const virtueInfo = await getTodaysVirtue();
//   const virtue =
//     (virtueInfo &&
//       (virtueInfo.virtue || virtueInfo.name || virtueInfo.label)) ||
//     'Faith';

//   const db = await getDb();

//   const scenarioQ = await pickRandomQuestionWithCooldown(
//     db,
//     virtue,
//     'scenario'
//   );
//   const verseQ = await pickRandomQuestionWithCooldown(db, virtue, 'verse');
//   const generalQ = await pickRandomGeneralQuestionWithCooldown(db);

//   const questions = [scenarioQ, verseQ, generalQ].filter(Boolean);

//   const quest = {
//     date: today,
//     virtue,
//     completed: false,
//     questions,
//   };

//   for (const q of questions) {
//     await logServedQuestion(db, q.id, today);
//   }

//   saveQuestForDate(today, quest);

//   return quest;
// }

// src/logic/dailyQuest.js
import { getDb } from '../storage/db';
import { getTodaysVirtue } from './dailyVirtue';
import { getString, setString } from '../storage/mmkv';

const QUEST_CACHE_PREFIX = 'quest-data:';

// Exported so other modules (if needed) can get today's key
export function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------- COMPLETION HELPERS (quest_status table) ----------

export async function isQuestCompletedToday() {
  const db = await getDb();
  const dateStr = todayKey();

  try {
    const row = await db.getFirstAsync(
      `
      SELECT completed
      FROM quest_status
      WHERE date = ?
      LIMIT 1;
    `,
      [dateStr]
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

  try {
    await db.runAsync(
      `
      INSERT INTO quest_status (date, completed)
      VALUES (?, 1)
      ON CONFLICT(date) DO UPDATE SET completed = 1;
    `,
      [dateStr]
    );
  } catch (e) {
    console.warn('[dailyQuest] markQuestCompletedToday DB error:', e);
  }

  // Also update cached quest (if present) to completed = true
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

  return {
    virtue,
    questions,
  };
}

// ---------- MAIN API (with per-day cache) ----------

export async function getOrCreateTodaysQuest() {
  const dateStr = todayKey();
  const cacheKey = QUEST_CACHE_PREFIX + dateStr;

  // 1️⃣ Try MMKV cache first
  try {
    const raw = getString(cacheKey, null);
    if (raw) {
      const cached = JSON.parse(raw);

      // Always re-check completion status from SQLite so we trust DB over cache
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

  // 2️⃣ No cache → build new quest based on today’s virtue
  const virtue = getTodaysVirtue();
  const completed = await isQuestCompletedToday();

  if (completed) {
    // Already completed: return "done" quest with no questions
    const quest = {
      date: dateStr,
      virtue,
      questions: [],
      completed: true,
    };
    try {
      setString(cacheKey, JSON.stringify(quest));
    } catch (e) {
      console.warn('[dailyQuest] failed to write completed quest cache:', e);
    }
    return quest;
  }

  // Not completed → build today’s 3-question quest
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
