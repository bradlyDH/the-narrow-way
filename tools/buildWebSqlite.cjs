// Run with: node tools/buildWebSqlite.cjs
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'assets', 'data', 'web_bible.json');
const OUTPUT_DIR = path.join(ROOT, 'assets', 'db');
const OUTPUT = path.join(OUTPUT_DIR, 'bible_web_v1.sqlite3');

const CANON = new Set([
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
]);

const NAME_MAP = {
  'Song of Solomon': 'Song of Songs',
  Canticles: 'Song of Songs',
  'I Samuel': '1 Samuel',
  'II Samuel': '2 Samuel',
  'I Kings': '1 Kings',
  'II Kings': '2 Kings',
  'I Chronicles': '1 Chronicles',
  'II Chronicles': '2 Chronicles',
  'I Corinthians': '1 Corinthians',
  'II Corinthians': '2 Corinthians',
  'I Thessalonians': '1 Thessalonians',
  'II Thessalonians': '2 Thessalonians',
  'I Timothy': '1 Timothy',
  'II Timothy': '2 Timothy',
  'I Peter': '1 Peter',
  'II Peter': '2 Peter',
  'I John': '1 John',
  'II John': '2 John',
  'III John': '3 John',
  '1st John': '1 John',
  '2nd John': '2 John',
  '3rd John': '3 John',
  Psalm: 'Psalms',
};
const norm = (n) => NAME_MAP[n] || n;

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('❌ Missing input JSON at', INPUT);
    process.exit(1);
  }
  const rows = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  if (!Array.isArray(rows) || !rows.length) {
    console.error('❌ web_bible.json empty');
    process.exit(1);
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

  const db = new Database(OUTPUT);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS bible_translations (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      public_domain INTEGER NOT NULL,
      info_url TEXT
    );
    CREATE TABLE IF NOT EXISTS bible_verses (
      id INTEGER PRIMARY KEY,
      translation_code TEXT NOT NULL,
      book TEXT NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS ux_bible_verses_unique
      ON bible_verses (translation_code, book, chapter, verse);
    CREATE INDEX IF NOT EXISTS idx_bible_translation_book_chapter
      ON bible_verses (translation_code, book, chapter, verse);
  `);

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT OR IGNORE INTO bible_translations (code, name, public_domain, info_url)
       VALUES (?, ?, ?, ?)`
    ).run('WEB', 'World English Bible', 1, 'https://worldenglish.bible/');

    const stmt = db.prepare(
      `INSERT INTO bible_verses
       (translation_code, book, chapter, verse, text)
       VALUES ('WEB', ?, ?, ?, ?)
       ON CONFLICT(translation_code, book, chapter, verse)
       DO UPDATE SET text = excluded.text`
    );

    for (const r of rows) {
      const book = norm(r.book);
      if (!CANON.has(book)) continue;
      stmt.run(book, r.chapter, r.verse, r.text);
    }
  });
  tx();
  db.exec('VACUUM');
  db.close();

  console.log('✅ Built', OUTPUT);
}
main();
