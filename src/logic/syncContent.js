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
