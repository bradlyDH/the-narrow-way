// src/services/dailyQuestService.js
import { getDb } from '../storage/db';
import { getTodaysVirtue } from '../logic/dailyVirtue';
import { getCachedQuest, setCachedQuest } from '../cache/questCache';
import {
  getQuestStatusForDate,
  markQuestCompleted,
} from '../repositories/questRepository';

export function todayKey() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---- Completion helpers ----
export async function isQuestCompletedToday() {
  const dateStr = todayKey();

  try {
    const status = await getQuestStatusForDate(dateStr);
    return !!(status && status.completed);
  } catch (e) {
    console.warn('[dailyQuestService] isQuestCompletedToday error:', e);
    return false;
  }
}

export async function markQuestCompletedToday() {
  const dateStr = todayKey();

  let completedAt;
  try {
    const res = await markQuestCompleted(dateStr);
    completedAt = res.completedAt;
  } catch (e) {
    console.warn('[dailyQuestService] markQuestCompletedToday repo error:', e);
  }

  // Update cache if present
  try {
    const cached = getCachedQuest(dateStr);
    if (cached) {
      const updated = {
        ...cached,
        completed: true,
        completedAt: completedAt || cached.completedAt || null,
      };
      setCachedQuest(dateStr, updated);
    }
  } catch (e) {
    console.warn('[dailyQuestService] cache update error:', e);
  }

  return true;
}

// ---- Internal question helpers ----
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

async function buildQuestForToday() {
  const db = await getDb();
  const virtue = getTodaysVirtue(); // "Faith" | "Love" | etc.

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

// ---- Main API ----
export async function getOrCreateTodaysQuest() {
  const dateStr = todayKey();

  // 1) Cache
  try {
    const cached = getCachedQuest(dateStr);
    if (cached) {
      const done = await isQuestCompletedToday();
      return {
        ...cached,
        date: cached.date || dateStr,
        completed: done,
      };
    }
  } catch (e) {
    console.warn('[dailyQuestService] cache read error:', e);
  }

  // 2) No cache → build
  const virtue = getTodaysVirtue();
  const completed = await isQuestCompletedToday();

  if (completed) {
    const quest = { date: dateStr, virtue, questions: [], completed: true };
    setCachedQuest(dateStr, quest);
    return quest;
  }

  const built = await buildQuestForToday();
  const quest = {
    date: dateStr,
    virtue: built.virtue,
    questions: built.questions,
    completed: false,
  };

  setCachedQuest(dateStr, quest);
  return quest;
}

export async function getTodaysQuestVirtue() {
  const dateStr = todayKey();

  try {
    const cached = getCachedQuest(dateStr);
    if (cached && typeof cached.virtue === 'string') {
      return cached.virtue;
    }
  } catch (e) {
    console.warn('[dailyQuestService] getTodaysQuestVirtue cache error:', e);
  }

  return getTodaysVirtue() || 'Today';
}
