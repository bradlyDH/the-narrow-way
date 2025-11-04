# The Narrow Way — Starter

A runnable Expo + React Navigation skeleton with Supabase stubs and schema.

## Quick start
```bash
npm install
cp src/config/index.example.js src/config/index.js   # fill in your Supabase URL + anon key
npm run start
```

## Push to GitHub
```bash
git init
git add .
git commit -m "chore: initial scaffold"
git branch -M main
git remote add origin https://github.com/YOUR-USER/the-narrow-way.git
git push -u origin main
```

## Supabase
- Create a project → copy URL and anon key to `src/config/index.js`.
- Open Supabase SQL editor and run `supabase/schema.sql`.
- RLS policies will be added after project keys are confirmed.
