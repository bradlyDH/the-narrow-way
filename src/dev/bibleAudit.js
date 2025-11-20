// src/dev/bibleAudit.js
import { getDb } from '../storage/db';

const CANON_66 = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',
  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther',
  'Job',
  'Psalms',
  'Proverbs',
  'Ecclesiastes',
  'Song of Songs',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel',
  'Hosea',
  'Joel',
  'Amos',
  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',
  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',
  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',
  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
];

export async function auditBible({ translation = 'WEB' } = {}) {
  const db = await getDb();

  const totalRow = await db.getFirstAsync(
    `SELECT COUNT(*) AS c FROM bible_verses WHERE translation_code = ?`,
    [translation]
  );
  const total = Number(totalRow?.c ?? 0);

  const rows = await db.getAllAsync(
    `SELECT book, COUNT(*) as c
     FROM bible_verses
     WHERE translation_code = ?
     GROUP BY book
     ORDER BY book`,
    [translation]
  );

  const perBook = {};
  for (const r of rows) perBook[r.book] = Number(r.c);

  const distinctBooks = Object.keys(perBook).sort();
  const missingBooks = CANON_66.filter((b) => !distinctBooks.includes(b));

  return { translation, total, distinctBooks, missingBooks, perBook };
}
