// src/storage/db.js
import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  // open or create the DB file
  dbInstance = await SQLite.openDatabaseAsync('app_v2.db');

  // create tables if they don't exist yet
  await dbInstance.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY NOT NULL,
      virtue TEXT NOT NULL,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      options_json TEXT NOT NULL,
      answer_index INTEGER NOT NULL,
      scripture_ref TEXT,
      scripture_passage TEXT,
      updated_at TEXT NOT NULL,
      active INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_questions_virtue
      ON questions (virtue);
    CREATE INDEX IF NOT EXISTS idx_questions_updated_at
      ON questions (updated_at);

    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY NOT NULL,
      virtue TEXT NOT NULL,
      prompt TEXT NOT NULL,
      scripture_ref TEXT,
      updated_at TEXT NOT NULL,
      active INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_challenges_virtue
      ON challenges (virtue);
    CREATE INDEX IF NOT EXISTS idx_challenges_updated_at
      ON challenges (updated_at);

    CREATE TABLE IF NOT EXISTS served_log (
      id TEXT PRIMARY KEY NOT NULL,
      question_id TEXT NOT NULL,
      served_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_served_log_qdate
      ON served_log (question_id, served_at);

    CREATE TABLE IF NOT EXISTS challenge_log (
      id TEXT PRIMARY KEY NOT NULL,
      challenge_id TEXT NOT NULL,
      served_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_challenge_log_qdate
      ON challenge_log (challenge_id, served_at);

   CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      virtue TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_journal_user_date
      ON journal_entries (user_id, date DESC);

    -- NEW: store quest completion per day (SQLite survives full app restarts)
   CREATE TABLE IF NOT EXISTS quest_status (
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER NOT NULL,
      completed_at TEXT,
      PRIMARY KEY (user_id, date)
    );
    CREATE INDEX IF NOT EXISTS idx_quest_status_user_date
      ON quest_status (user_id, date);
  
  CREATE TABLE IF NOT EXISTS bible_translations (
  code TEXT PRIMARY KEY,        -- 'WEB', 'KJV', 'ESV', etc
  name TEXT NOT NULL,           -- 'World English Bible'
  public_domain INTEGER NOT NULL, -- 1 or 0
  info_url TEXT                 -- optional, for attribution/help
  );

  CREATE TABLE IF NOT EXISTS bible_verses (
  id INTEGER PRIMARY KEY,
  translation_code TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (translation_code)
    REFERENCES bible_translations(code)
);
CREATE INDEX IF NOT EXISTS idx_bible_translation_book_chapter
  ON bible_verses (translation_code, book, chapter, verse);

    `);

  return dbInstance;
}
