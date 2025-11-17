// tools/buildWebJson.js
// Run with: node tools/buildWebJson.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Boilerplate for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Your actual WEB JSON download:
const SOURCE_PATH = path.join(
  __dirname,
  '..',
  'assets',
  'data',
  'web_raw.json'
);

// 🔹 Where your app will read from:
const OUTPUT_PATH = path.join(
  __dirname,
  '..',
  'assets',
  'data',
  'web_bible.json'
);

function main() {
  console.log('Reading source:', SOURCE_PATH);
  const raw = fs.readFileSync(SOURCE_PATH, 'utf8');
  const source = JSON.parse(raw);

  if (!source || !Array.isArray(source.verses)) {
    console.error('❌ ERROR: Expected { metadata, verses: [] } shape.');
    process.exit(1);
  }

  // Convert to app shape:
  const out = source.verses.map((v) => ({
    book: v.book_name.trim(), // "Genesis"
    chapter: Number(v.chapter),
    verse: Number(v.verse),
    text: String(v.text || '').trim(),
  }));

  console.log('Total verses:', out.length);

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out), 'utf8');

  console.log('✅ Wrote app-ready WEB JSON to:', OUTPUT_PATH);
}

main();
