// src/logic/seedBible.js
import { getDb } from '../storage/db';

// NOTE: You will create this file once you have WEB JSON data.
// For now, think "bibleWebData = [{ book, chapter, verse, text }, ...]"
import bibleWebData from '../../assets/data/web_bible.json';

export async function seedBibleIfNeeded() {
  const db = await getDb();

  // 1) Check if WEB translation is known
  const row = await db.getFirstAsync(
    'SELECT COUNT(*) AS cnt FROM bible_translations WHERE code = ?;',
    ['WEB']
  );

  const hasWebMeta = row && row.cnt > 0;

  if (!hasWebMeta) {
    await db.runAsync(
      `
      INSERT INTO bible_translations (code, name, public_domain, info_url)
      VALUES (?, ?, ?, ?);
    `,
      ['WEB', 'World English Bible', 1, 'https://worldenglish.bible/']
    );
  }

  // 2) Check if we have any WEB verses already
  const countRow = await db.getFirstAsync(
    `
    SELECT COUNT(*) AS cnt
    FROM bible_verses
    WHERE translation_code = 'WEB';
  `
  );

  if (countRow && countRow.cnt > 0) {
    // Already seeded
    return;
  }

  // 3) Seed all WEB verses
  await db.execAsync('BEGIN TRANSACTION;');
  try {
    for (const v of bibleWebData) {
      await db.runAsync(
        `
        INSERT INTO bible_verses
          (translation_code, book, chapter, verse, text)
        VALUES (?, ?, ?, ?, ?);
      `,
        ['WEB', v.book, v.chapter, v.verse, v.text]
      );
    }
    await db.execAsync('COMMIT;');
  } catch (e) {
    await db.execAsync('ROLLBACK;');
    console.warn('Error seeding WEB Bible:', e);
    throw e;
  }
}
