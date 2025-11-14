// scripts/seedQuestions.js
// Run with: node scripts/seedQuestions.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function loadQuestionsJson() {
  const filePath = path.join(__dirname, '..', 'data', 'questions.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error('questions.json must contain an array at the top level.');
  }

  return data;
}

async function upsertQuestion(q) {
  const virtue = (q.virtue || '').trim();
  const type = (q.type || '').trim();
  const prompt = (q.prompt || '').trim();

  if (!virtue || !type || !prompt) {
    console.warn('Skipping question with missing virtue/type/prompt:', q);
    return;
  }

  const options = Array.isArray(q.options) ? q.options : [];
  if (options.length < 2) {
    console.warn(
      `Skipping question "${prompt}" because it has fewer than 2 options.`
    );
    return;
  }

  const answer_index = typeof q.answer_index === 'number' ? q.answer_index : 0;

  const payload = {
    virtue,
    type,
    prompt,
    options_json: options, // supabase-js will send as jsonb
    answer_index,
    scripture_ref: q.scripture_ref || null,
    scripture_passage: q.scripture_passage || null,
    active: q.active !== false, // default true unless explicitly false
  };

  // Try to find an existing question with the same virtue/type/prompt
  const { data: existingRows, error: findError } = await supabase
    .from('questions')
    .select('id')
    .eq('virtue', virtue)
    .eq('type', type)
    .eq('prompt', prompt)
    .limit(1);

  if (findError) {
    console.error('Error finding existing question:', findError);
    return;
  }

  const existing = existingRows && existingRows[0];

  if (existing) {
    // UPDATE
    const { error: updateError } = await supabase
      .from('questions')
      .update(payload)
      .eq('id', existing.id);

    if (updateError) {
      console.error(
        `Error updating question "${prompt}":`,
        updateError.message || updateError
      );
    } else {
      console.log(`Updated question: [${virtue}/${type}] "${prompt}"`);
    }
  } else {
    // INSERT
    const { error: insertError } = await supabase
      .from('questions')
      .insert(payload);

    if (insertError) {
      console.error(
        `Error inserting question "${prompt}":`,
        insertError.message || insertError
      );
    } else {
      console.log(`Inserted question: [${virtue}/${type}] "${prompt}"`);
    }
  }
}

async function main() {
  try {
    const questions = loadQuestionsJson();
    console.log(`Seeding ${questions.length} questions...`);

    // simple sequential loop (fine for your scale)
    for (const q of questions) {
      // eslint-disable-next-line no-await-in-loop
      await upsertQuestion(q);
    }

    console.log('Done seeding questions.');
  } catch (err) {
    console.error('Seed script failed:', err);
    process.exit(1);
  }
}

main();
