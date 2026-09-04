-- ============================================================================
-- TimeBloom — Database schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh
-- project. Safe to re-run: guarded with IF NOT EXISTS / OR REPLACE / DROP-then-CREATE.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- profiles — one row per auth.users row, created automatically on signup.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  email_notifications boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per authenticated user, mirrors auth.users.';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- capsules
-- ----------------------------------------------------------------------------
create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 400),
  memory_text text not null default '',
  mood text not null default 'nostalgic'
    check (mood in ('joyful','nostalgic','hopeful','peaceful','grateful','bittersweet')),
  cover_theme text not null default 'midnight',
  cover_image_url text,
  unlock_at timestamptz not null,
  timezone text not null default 'UTC',
  privacy text not null default 'private' check (privacy in ('private','shareable','recipient')),
  recipient_email text,
  recipient_subject text,
  share_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists capsules_user_id_idx on public.capsules (user_id);
create index if not exists capsules_unlock_at_idx on public.capsules (unlock_at);
create index if not exists capsules_share_token_idx on public.capsules (share_token);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists capsules_set_updated_at on public.capsules;
create trigger capsules_set_updated_at
  before update on public.capsules
  for each row execute procedure public.set_updated_at();

-- Server-computed, never trust the client: is this capsule unlocked *right now*?
create or replace function public.capsule_is_unlocked(capsule_row public.capsules)
returns boolean language sql stable as $$
  select capsule_row.unlock_at <= now();
$$;

-- ----------------------------------------------------------------------------
-- capsule_media
-- ----------------------------------------------------------------------------
create table if not exists public.capsule_media (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  file_url text not null,
  file_type text not null check (file_type in ('image','video','audio')),
  file_name text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists capsule_media_capsule_id_idx on public.capsule_media (capsule_id);

-- ----------------------------------------------------------------------------
-- reflections — one per capsule per user, added after unlock.
-- ----------------------------------------------------------------------------
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reflection_text text not null check (char_length(reflection_text) between 1 and 2000),
  created_at timestamptz not null default now(),
  unique (capsule_id, user_id)
);

create index if not exists reflections_capsule_id_idx on public.reflections (capsule_id);

-- ----------------------------------------------------------------------------
-- notification_log — prevents duplicate "opens soon" / "unlocked" emails.
-- Only ever written by the service-role cron route, never by end users.
-- ----------------------------------------------------------------------------
create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  type text not null check (type in ('upcoming','unlocked')),
  sent_at timestamptz not null default now(),
  unique (capsule_id, type)
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.capsules         enable row level security;
alter table public.capsule_media    enable row level security;
alter table public.reflections      enable row level security;
alter table public.notification_log enable row level security;
-- notification_log has no policies: only the service-role client (which
-- bypasses RLS) ever touches it, so it's implicitly deny-all for everyone else.

-- profiles ---------------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- capsules -----------------------------------------------------------------
-- Owners can always see their own row (the app hides locked *content* —
-- memory_text, media — in the API/data layer, never the row's existence,
-- so status and countdowns can still render).
drop policy if exists "capsules: owner select" on public.capsules;
create policy "capsules: owner select" on public.capsules
  for select using (auth.uid() = user_id);

drop policy if exists "capsules: owner insert" on public.capsules;
create policy "capsules: owner insert" on public.capsules
  for insert with check (auth.uid() = user_id);

drop policy if exists "capsules: owner update" on public.capsules;
create policy "capsules: owner update" on public.capsules
  for update using (auth.uid() = user_id);

drop policy if exists "capsules: owner delete" on public.capsules;
create policy "capsules: owner delete" on public.capsules
  for delete using (auth.uid() = user_id);

-- Anonymous/shared read access is intentionally NOT granted via RLS. Shared,
-- unlocked capsules are served through /api/share/[token] using the
-- service-role key so unlock-time enforcement lives in one place rather
-- than being duplicated in a policy expression.

-- capsule_media --------------------------------------------------------------
drop policy if exists "capsule_media: owner select" on public.capsule_media;
create policy "capsule_media: owner select" on public.capsule_media
  for select using (
    exists (select 1 from public.capsules c where c.id = capsule_media.capsule_id and c.user_id = auth.uid())
  );

drop policy if exists "capsule_media: owner insert" on public.capsule_media;
create policy "capsule_media: owner insert" on public.capsule_media
  for insert with check (
    exists (select 1 from public.capsules c where c.id = capsule_media.capsule_id and c.user_id = auth.uid())
  );

drop policy if exists "capsule_media: owner delete" on public.capsule_media;
create policy "capsule_media: owner delete" on public.capsule_media
  for delete using (
    exists (select 1 from public.capsules c where c.id = capsule_media.capsule_id and c.user_id = auth.uid())
  );

-- reflections ----------------------------------------------------------------
drop policy if exists "reflections: owner select" on public.reflections;
create policy "reflections: owner select" on public.reflections
  for select using (auth.uid() = user_id);

drop policy if exists "reflections: owner insert" on public.reflections;
create policy "reflections: owner insert" on public.reflections
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.capsules c
      where c.id = reflections.capsule_id
        and c.user_id = auth.uid()
        and public.capsule_is_unlocked(c)
    )
  );

drop policy if exists "reflections: owner update" on public.reflections;
create policy "reflections: owner update" on public.reflections
  for update using (auth.uid() = user_id);

-- ============================================================================
-- Storage buckets (private — accessed only via signed URLs from the server)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('capsule-media', 'capsule-media', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Files live under `${user_id}/${capsule_id}/...`, so a path-prefix check
-- doubles as an ownership check.
drop policy if exists "capsule-media: owner all" on storage.objects;
create policy "capsule-media: owner all" on storage.objects
  for all using (
    bucket_id = 'capsule-media' and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'capsule-media' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: owner write" on storage.objects;
create policy "avatars: owner write" on storage.objects
  for all using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars: public read" on storage.objects;
create policy "avatars: public read" on storage.objects
  for select using (bucket_id = 'avatars');
