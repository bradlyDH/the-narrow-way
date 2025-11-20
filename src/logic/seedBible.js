// src/logic/seedBible.js
import * as FileSystem from 'expo-file-system';
import { getDb } from '../storage/db';

// Prefer the bundled JSON if you’ve included it in your app bundle.
// (DebugScreen’s "Hard Reseed" can pass a fileUri instead.)
let bundledWebData = null;
try {
  // Keep your existing import so the default seeding path still works
  bundledWebData = require('../../assets/data/web_bible.json');
} catch {
  bundledWebData = null;
}

// --- schema helpers ---------------------------------------------------------
async function ensureSchema(db) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS bible_translations (
      code TEXT PRIMARY KEY,
      name TEXT,
      public_domain INTEGER,
      info_url TEXT
    );

    CREATE TABLE IF NOT EXISTS bible_verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      translation_code TEXT NOT NULL,
      book TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (translation_code) REFERENCES bible_translations(code)
    );

    CREATE INDEX IF NOT EXISTS idx_bv_tbc
      ON bible_verses (translation_code, book, chapter);

    CREATE INDEX IF NOT EXISTS idx_bv_t
      ON bible_verses (translation_code);
  `);
}

async function upsertTranslation(
  db,
  { code = 'WEB', name = 'World English Bible' } = {}
) {
  await db.runAsync(
    `INSERT OR REPLACE INTO bible_translations (code, name, public_domain, info_url)
     VALUES (?, ?, ?, ?);`,
    [code, name, 1, 'https://worldenglish.bible/']
  );
}

// --- public API -------------------------------------------------------------

/**
 * Light check used on app start. If < minRows verses exist for WEB, we report not seeded.
 * (We don’t auto-insert here; that keeps startup fast and lets DebugScreen control reseed.)
 */
export async function seedBibleIfNeeded({
  translation = 'WEB',
  minRows = 30000,
} = {}) {
  const db = await getDb();
  await ensureSchema(db);

  // Ensure translation row at least exists (metadata)
  await upsertTranslation(db, { code: translation });

  const row = await db.getFirstAsync(
    'SELECT COUNT(*) AS cnt FROM bible_verses WHERE translation_code = ?;',
    [translation]
  );

  return { alreadySeeded: (row?.cnt ?? 0) >= minRows, count: row?.cnt ?? 0 };
}

/**
 * Verify simple counts for a translation.
 * Returns: { total, books, ok } (ok ~ 66 books and >30k verses for WEB).
 */
export async function verifyBible({ translation = 'WEB' } = {}) {
  const db = await getDb();
  await ensureSchema(db);

  const totalRow = await db.getFirstAsync(
    `SELECT COUNT(*) AS total FROM bible_verses WHERE translation_code = ?;`,
    [translation]
  );

  const booksRow = await db.getFirstAsync(
    `SELECT COUNT(DISTINCT book) AS books FROM bible_verses WHERE translation_code = ?;`,
    [translation]
  );

  const total = totalRow?.total ?? 0;
  const books = booksRow?.books ?? 0;
  const ok = books >= 66 && total > 30000; // WEB has ~31,102 verses

  return { total, books, ok };
}

/**
 * Remove all verses for a translation (and its translation row).
 */
export async function wipeBible({ translation = 'WEB' } = {}) {
  const db = await getDb();
  await ensureSchema(db);

  await db.execAsync('BEGIN;');
  try {
    await db.runAsync(`DELETE FROM bible_verses WHERE translation_code = ?;`, [
      translation,
    ]);
    await db.runAsync(`DELETE FROM bible_translations WHERE code = ?;`, [
      translation,
    ]);
    await db.execAsync('COMMIT;');
    return { ok: true };
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    throw e;
  }
}

/**
 * Seed from either a JSON file on disk (fileUri) or the bundled JSON (data).
 * You can pass `onProgress(inserted, total)` to surface progress.
 */
export async function hardSeedBible({
  fileUri, // optional file:// path (e.g. from expo-asset)
  data = bundledWebData, // fallback to bundled JSON if present
  translation = 'WEB',
  name = 'World English Bible',
  batchSize = 200,
  onProgress,
} = {}) {
  // Resolve rows from file or bundled data
  let rows = null;

  if (fileUri) {
    if (!fileUri.startsWith('file://')) {
      throw new Error('hardSeedBible: fileUri must be a file:// path');
    }
    const json = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    try {
      rows = JSON.parse(json);
    } catch {
      throw new Error('hardSeedBible: invalid JSON content at fileUri');
    }
  } else {
    rows = data;
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('hardSeedBible: no verse rows to import');
  }

  const db = await getDb();
  await ensureSchema(db);
  await upsertTranslation(db, { code: translation, name });

  // Wipe existing verses for this translation before inserting
  await db.execAsync('BEGIN;');
  try {
    await db.runAsync(`DELETE FROM bible_verses WHERE translation_code = ?;`, [
      translation,
    ]);
    await db.execAsync('COMMIT;');
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    throw e;
  }

  // Batched inserts
  const total = rows.length;
  let inserted = 0;

  while (inserted < total) {
    const chunk = rows.slice(inserted, inserted + batchSize);

    await db.execAsync('BEGIN;');
    try {
      for (let i = 0; i < chunk.length; i++) {
        const v = chunk[i];
        if (
          !v ||
          !v.book ||
          !v.chapter ||
          !v.verse ||
          typeof v.text !== 'string'
        )
          continue;

        await db.runAsync(
          `INSERT INTO bible_verses
            (translation_code, book, chapter, verse, text)
           VALUES (?, ?, ?, ?, ?);`,
          [
            translation,
            String(v.book),
            Number(v.chapter),
            Number(v.verse),
            v.text,
          ]
        );
      }
      await db.execAsync('COMMIT;');
    } catch (e) {
      await db.execAsync('ROLLBACK;');
      throw e;
    }

    inserted += chunk.length;
    if (typeof onProgress === 'function') {
      try {
        onProgress(inserted, total);
      } catch {}
    }
  }

  const verify = await verifyBible({ translation });
  return { ok: verify.ok, count: verify.total, verify };
}
