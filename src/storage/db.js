// // // src/storage/db.js
// // import { openDatabase } from 'expo-sqlite';

// // let dbInstance = null;

// // export function getDb() {
// //   if (dbInstance) return dbInstance;

// //   // Newer expo-sqlite API
// //   dbInstance = openDatabase('app.db');

// //   dbInstance.transaction((tx) => {
// //     tx.executeSql('PRAGMA foreign_keys = ON;');

// //     tx.executeSql(`
// //       CREATE TABLE IF NOT EXISTS questions (
// //         id TEXT PRIMARY KEY NOT NULL,
// //         virtue TEXT NOT NULL,
// //         type TEXT NOT NULL,
// //         prompt TEXT NOT NULL,
// //         options_json TEXT NOT NULL,
// //         answer_index INTEGER NOT NULL,
// //         scripture_ref TEXT,
// //         scripture_passage TEXT,
// //         updated_at TEXT NOT NULL,
// //         active INTEGER NOT NULL
// //       );
// //     `);

// //     tx.executeSql(`
// //       CREATE TABLE IF NOT EXISTS challenges (
// //         id TEXT PRIMARY KEY NOT NULL,
// //         virtue TEXT NOT NULL,
// //         prompt TEXT NOT NULL,
// //         scripture_ref TEXT,
// //         updated_at TEXT NOT NULL,
// //         active INTEGER NOT NULL
// //       );
// //     `);

// //     tx.executeSql(`
// //       CREATE TABLE IF NOT EXISTS served_log (
// //         id TEXT PRIMARY KEY NOT NULL,
// //         question_id TEXT NOT NULL,
// //         served_at TEXT NOT NULL
// //       );
// //     `);

// //     tx.executeSql(`
// //       CREATE INDEX IF NOT EXISTS idx_served_log_qdate
// //       ON served_log (question_id, served_at);
// //     `);

// //     tx.executeSql(`
// //       CREATE TABLE IF NOT EXISTS challenge_log (
// //         id TEXT PRIMARY KEY NOT NULL,
// //         challenge_id TEXT NOT NULL,
// //         served_at TEXT NOT NULL
// //       );
// //     `);

// //     tx.executeSql(`
// //       CREATE INDEX IF NOT EXISTS idx_challenge_log_qdate
// //       ON challenge_log (challenge_id, served_at);
// //     `);

// //     tx.executeSql(`
// //       CREATE TABLE IF NOT EXISTS journal_entries (
// //         id TEXT PRIMARY KEY NOT NULL,
// //         date TEXT NOT NULL,
// //         virtue TEXT NOT NULL,
// //         note TEXT,
// //         created_at TEXT NOT NULL,
// //         updated_at TEXT NOT NULL
// //       );
// //     `);

// //     tx.executeSql(`
// //       CREATE INDEX IF NOT EXISTS idx_journal_date
// //       ON journal_entries (date);
// //     `);
// //   });

// //   return dbInstance;
// // }

// // src/storage/db.js
// import * as SQLite from 'expo-sqlite';

// let dbInstance = null;

// export async function getDb() {
//   if (dbInstance) return dbInstance;

//   // ✅ New JSI API for expo-sqlite on SDK 54
//   const db = await SQLite.openDatabaseAsync('app.db');

//   // Create schema in one execAsync batch
//   await db.execAsync(`
//     PRAGMA foreign_keys = ON;

//     CREATE TABLE IF NOT EXISTS questions (
//       id TEXT PRIMARY KEY NOT NULL,
//       virtue TEXT NOT NULL,
//       type TEXT NOT NULL,
//       prompt TEXT NOT NULL,
//       options_json TEXT NOT NULL,
//       answer_index INTEGER NOT NULL,
//       scripture_ref TEXT,
//       scripture_passage TEXT,
//       updated_at TEXT NOT NULL,
//       active INTEGER NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_questions_virtue
//       ON questions (virtue);
//     CREATE INDEX IF NOT EXISTS idx_questions_updated_at
//       ON questions (updated_at);

//     CREATE TABLE IF NOT EXISTS challenges (
//       id TEXT PRIMARY KEY NOT NULL,
//       virtue TEXT NOT NULL,
//       prompt TEXT NOT NULL,
//       scripture_ref TEXT,
//       updated_at TEXT NOT NULL,
//       active INTEGER NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_challenges_virtue
//       ON challenges (virtue);
//     CREATE INDEX IF NOT EXISTS idx_challenges_updated_at
//       ON challenges (updated_at);

//     CREATE TABLE IF NOT EXISTS served_log (
//       id TEXT PRIMARY KEY NOT NULL,
//       question_id TEXT NOT NULL,
//       served_at TEXT NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_served_log_qdate
//       ON served_log (question_id, served_at);

//     CREATE TABLE IF NOT EXISTS challenge_log (
//       id TEXT PRIMARY KEY NOT NULL,
//       challenge_id TEXT NOT NULL,
//       served_at TEXT NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_challenge_log_qdate
//       ON challenge_log (challenge_id, served_at);

//     CREATE TABLE IF NOT EXISTS journal_entries (
//       id TEXT PRIMARY KEY NOT NULL,
//       date TEXT NOT NULL,
//       virtue TEXT NOT NULL,
//       note TEXT,
//       created_at TEXT NOT NULL,
//       updated_at TEXT NOT NULL
//     );
//     CREATE INDEX IF NOT EXISTS idx_journal_date
//       ON journal_entries (date);
//   `);

//   dbInstance = db;
//   return dbInstance;
// }

// src/storage/db.js
import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  // open or create the DB file
  dbInstance = await SQLite.openDatabaseAsync('app.db');

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
      date TEXT NOT NULL,
      virtue TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_journal_date
      ON journal_entries (date);

    -- NEW: store quest completion per day (SQLite survives full app restarts)
    CREATE TABLE IF NOT EXISTS quest_status (
      date TEXT PRIMARY KEY NOT NULL,
      completed INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_quest_status_date
      ON quest_status (date);
  
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
