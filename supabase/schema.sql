-- ============================================================
-- MANAS — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Table 1: user_profiles
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  age_group text,
  reasons text[],
  mood_score integer check (mood_score between 1 and 5),
  therapist_history text,
  preferred_language text,
  open_text text,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table user_profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can manage own profile"
  on user_profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────

-- Table 2: chat_messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references user_profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table chat_messages enable row level security;

-- Users can only read/write their own messages
create policy "Users can manage own messages"
  on chat_messages
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for faster chat history queries
create index if not exists idx_chat_messages_user_created
  on chat_messages(user_id, created_at asc);

-- ─────────────────────────────────────────────────────────────
-- IMPORTANT: Enable Anonymous Auth in your Supabase dashboard
-- Go to: Authentication → Providers → Anonymous Sign-ins → Enable
-- ============================================================
