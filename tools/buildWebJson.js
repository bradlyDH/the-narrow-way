// // tools/buildWebJson.js
// // Run with: node tools/buildWebJson.js

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Boilerplate for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 🔹 Your actual WEB JSON download:
// const SOURCE_PATH = path.join(
//   __dirname,
//   '..',
//   'assets',
//   'data',
//   'web_raw.json'
// );

// // 🔹 Where your app will read from:
// const OUTPUT_PATH = path.join(
//   __dirname,
//   '..',
//   'assets',
//   'data',
//   'web_bible.json'
// );

// function main() {
//   console.log('Reading source:', SOURCE_PATH);
//   const raw = fs.readFileSync(SOURCE_PATH, 'utf8');
//   const source = JSON.parse(raw);

//   if (!source || !Array.isArray(source.verses)) {
//     console.error('❌ ERROR: Expected { metadata, verses: [] } shape.');
//     process.exit(1);
//   }

//   // Convert to app shape:
//   const out = source.verses.map((v) => ({
//     book: v.book_name.trim(), // "Genesis"
//     chapter: Number(v.chapter),
//     verse: Number(v.verse),
//     text: String(v.text || '').trim(),
//   }));

//   console.log('Total verses:', out.length);

//   fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
//   fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out), 'utf8');

//   console.log('✅ Wrote app-ready WEB JSON to:', OUTPUT_PATH);
// }

// main();

// tools/buildWebJson.js
// Run with: node tools/buildWebJson.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM boilerplate
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source (your downloaded WEB JSON with { metadata, verses: [...] })
const SOURCE_PATH = path.join(
  __dirname,
  '..',
  'assets',
  'data',
  'web_raw.json'
);
// Output (the compact app shape)
const OUTPUT_PATH = path.join(
  __dirname,
  '..',
  'assets',
  'data',
  'web_bible.json'
);

// Canonical 66 names used by the app/UI
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

// Map common alternative names from sources → canonical names above
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
  Psalm: 'Psalms', // sometimes present in metadata
};

function normBookName(name) {
  const n = String(name || '').trim();
  return NAME_MAP[n] || n;
}

function main() {
  console.log('Reading source:', SOURCE_PATH);
  const raw = fs.readFileSync(SOURCE_PATH, 'utf8');
  const source = JSON.parse(raw);

  if (!source || !Array.isArray(source.verses)) {
    console.error('❌ Expected { metadata, verses: [] }');
    process.exit(1);
  }

  // Normalize & filter to 66-book canon (drop deuterocanon if present)
  const unknownBooks = new Set();
  const out = [];

  for (const v of source.verses) {
    const book = normBookName(v.book_name);
    if (!CANON_66.includes(book)) {
      unknownBooks.add(book);
      continue; // skip apocrypha or unknown labels
    }
    out.push({
      book,
      chapter: Number(v.chapter),
      verse: Number(v.verse),
      text: String(v.text || '').trim(),
    });
  }

  // Sort for determinism (by OT/NT order, then chapter/verse)
  const order = new Map(CANON_66.map((b, i) => [b, i]));
  out.sort((a, b) => {
    const ob = order.get(a.book) - order.get(b.book);
    if (ob !== 0) return ob;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });

  // Summaries
  const perBook = out.reduce((acc, r) => {
    acc[r.book] = (acc[r.book] || 0) + 1;
    return acc;
  }, {});
  const distinctBooks = Object.keys(perBook);
  const missing = CANON_66.filter((b) => !distinctBooks.includes(b));

  console.log('Books present:', distinctBooks.length, '/', CANON_66.length);
  console.log('Total verses:', out.length);
  if (missing.length) console.warn('⚠️ Missing books:', missing.join(', '));
  if (unknownBooks.size)
    console.warn(
      'ℹ️ Skipped (unknown/apocrypha):',
      [...unknownBooks].join(', ')
    );

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out), 'utf8');
  console.log('✅ Wrote app-ready WEB JSON to:', OUTPUT_PATH);
}

main();
