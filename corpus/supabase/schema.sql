-- ============================================================================
-- CORPUS — Supabase schema
-- ----------------------------------------------------------------------------
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- Everything the UI already reads and writes maps onto these tables:
--   profiles          -> lib/types.ts  Profile
--   learning_progress -> lib/types.ts  ProgressRecord  (dashboard, lesson cards)
--   quiz_attempts     -> lib/learning/progress.ts      (mastery maths)
--   document_chunks   -> lib/rag/retrieve.ts           (vectorSearch)
--   match_documents   -> lib/rag/retrieve.ts           (RPC called by name)
--
-- `document_chunks.embedding` is sized for text-embedding-3-small (1536).
-- Change the dimension if you switch embedding model.
-- ============================================================================

create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------ profiles
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'student' check (role in ('student', 'educator')),
  institution text,
  plan        text not null default 'free' check (plan in ('free', 'pro', 'institutional')),
  created_at  timestamptz not null default now()
);

-- Keep a profile row in step with the auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------------------------------------- learning_progress
-- One row per (user, lesson). Mirrors the shape returned by
-- lib/learning/localProgress.ts#toRecords.
create table if not exists public.learning_progress (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  lesson_id        text not null,
  status           text not null default 'not_started'
                     check (status in ('not_started', 'in_progress', 'completed')),
  completed_blocks integer not null default 0,
  total_blocks     integer not null default 0,
  mastery          numeric(4,3) not null default 0 check (mastery >= 0 and mastery <= 1),
  updated_at       timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists learning_progress_user_idx
  on public.learning_progress (user_id);

-- ------------------------------------------------------------ quiz_attempts
create table if not exists public.quiz_attempts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  lesson_id   text not null,
  question_id text not null,
  correct     boolean not null,
  created_at  timestamptz not null default now()
);

create index if not exists quiz_attempts_user_lesson_idx
  on public.quiz_attempts (user_id, lesson_id);

-- ------------------------------------------------------------- RAG corpus
create table if not exists public.document_chunks (
  id         uuid primary key default uuid_generate_v4(),
  source     text not null,          -- e.g. 'atlas', 'gray-s', 'lesson:les-femur'
  title      text not null,
  section    text not null,
  content    text not null,
  embedding  vector(1536),
  created_at timestamptz not null default now()
);

-- ivfflat: build AFTER bulk-loading for a good recall/speed trade-off.
create index if not exists document_chunks_embedding_idx
  on public.document_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- The RPC lib/rag/retrieve.ts calls: POST /rest/v1/rpc/match_documents
create or replace function public.match_documents(
  query_embedding vector(1536),
  match_count     int default 4,
  filter_source   text default null
)
returns table (
  id         uuid,
  title      text,
  section    text,
  content    text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.title,
    c.section,
    c.content,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  where c.embedding is not null
    and (filter_source is null or c.source = filter_source)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- --------------------------------------------------------------- row security
alter table public.profiles          enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_attempts     enable row level security;
alter table public.document_chunks   enable row level security;

-- Learners see only their own rows.
create policy "profiles: own row"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles: update own row"
  on public.profiles for update using (auth.uid() = id);

create policy "progress: own rows"
  on public.learning_progress for select using (auth.uid() = user_id);

create policy "progress: write own rows"
  on public.learning_progress for insert with check (auth.uid() = user_id);

create policy "progress: update own rows"
  on public.learning_progress for update using (auth.uid() = user_id);

create policy "quiz: own rows"
  on public.quiz_attempts for select using (auth.uid() = user_id);

create policy "quiz: insert own rows"
  on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- The atlas is shared reading material; ingestion goes through the
-- service-role key (lib/supabase/admin.ts), which bypasses RLS.
create policy "chunks: readable by authenticated"
  on public.document_chunks for select to authenticated using (true);
