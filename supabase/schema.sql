-- Minimal schema (add RLS separately)
create extension if not exists pgcrypto;
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  verse_ref text,
  verse_text text,
  short_id text unique,
  created_at timestamp with time zone default now()
);
create index if not exists idx_profiles_short_id on profiles(short_id);

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  addressee_id uuid references profiles(id) on delete cascade,
  status text check (status in ('pending','accepted','blocked')) default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  details text not null,
  added_at timestamp with time zone default now(),
  last_prayed_at timestamp with time zone,
  answered_at timestamp with time zone,
  deleted_at timestamp with time zone
);
create index if not exists idx_prayer_active on prayer_requests(user_id) where answered_at is null and deleted_at is null;

create table if not exists encouragement_templates (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  active boolean default true
);

create table if not exists encouragements (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete cascade,
  template_id uuid references encouragement_templates(id),
  delivered_at timestamp with time zone default now(),
  read_at timestamp with time zone,
  expires_at timestamp with time zone
);
create index if not exists idx_enc_recipient on encouragements(recipient_id);
create index if not exists idx_enc_expires on encouragements(expires_at);

create table if not exists virtues (
  id text primary key -- 'faith'|'love'|'patience'|'kindness'
);

create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  virtue_id text references virtues(id),
  day date not null,
  q1 jsonb,
  q2 jsonb,
  q3 jsonb,
  active boolean default true
);
create index if not exists idx_quests_day on quests(day);

create table if not exists quest_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  quest_id uuid references quests(id) on delete cascade,
  tries_q1 int,
  tries_q2 int,
  tries_q3 int,
  points_total int,
  completed_at timestamp with time zone default now(),
  unique (user_id, quest_id)
);

create table if not exists virtue_progress (
  user_id uuid references profiles(id) on delete cascade,
  virtue_id text references virtues(id),
  xp int default 0,
  level int default 1,
  primary key (user_id, virtue_id)
);
