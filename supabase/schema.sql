-- Netrak: Supabase Postgres schema
-- Run this in the Supabase SQL editor (or via migrations) to create the core tables + RLS.

-- UUID generation (Supabase usually has this, but keep it explicit)
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------------
-- Enums
-- -------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('CITIZEN', 'OFFICER', 'ADMIN');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.case_status as enum ('OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.evidence_type as enum ('audio', 'image', 'video', 'document', 'chat', 'link', 'note');
exception
  when duplicate_object then null;
end $$;

-- -------------------------------------------------------------------
-- Helper functions
-- -------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------------------------------------------------
-- Profiles (maps to Supabase Auth users)
-- -------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role public.user_role not null default 'CITIZEN',
  name text,
  phone text,
  district text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

-- Create a profile row automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Staff helper (defined after profiles exists to avoid dependency errors)
create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('OFFICER', 'ADMIN')
  );
$$;

-- -------------------------------------------------------------------
-- Cases
-- -------------------------------------------------------------------
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status public.case_status not null default 'OPEN',
  category text,
  risk_level text,
  location text,
  user_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cases_user_id on public.cases(user_id);
create index if not exists idx_cases_status on public.cases(status);

drop trigger if exists set_cases_updated_at on public.cases;
create trigger set_cases_updated_at
before update on public.cases
for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------
-- Case evidence
-- -------------------------------------------------------------------
create table if not exists public.case_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  type public.evidence_type not null,
  label text not null,
  reference text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_case_evidence_case_id on public.case_evidence(case_id);

-- -------------------------------------------------------------------
-- Case timeline events
-- -------------------------------------------------------------------
create table if not exists public.case_timeline_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  title text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_case_timeline_case_id on public.case_timeline_events(case_id);

-- -------------------------------------------------------------------
-- Notifications
-- -------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read);

-- -------------------------------------------------------------------
-- Threat feed (public read)
-- -------------------------------------------------------------------
create table if not exists public.threats (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  level text not null,
  region text not null,
  summary text not null,
  indicators jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_threats_category on public.threats(category);
create index if not exists idx_threats_region on public.threats(region);
create index if not exists idx_threats_level on public.threats(level);

drop trigger if exists set_threats_updated_at on public.threats;
create trigger set_threats_updated_at
before update on public.threats
for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------
-- RLS
-- -------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_evidence enable row level security;
alter table public.case_timeline_events enable row level security;
alter table public.notifications enable row level security;
alter table public.threats enable row level security;

-- Profiles: each user can see/update their own profile; staff can read all.
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
on public.profiles
for select
using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

-- Cases: owner or staff can read; owner can create; owner or staff can update/delete.
drop policy if exists "cases_select_own_or_staff" on public.cases;
create policy "cases_select_own_or_staff"
on public.cases
for select
using (user_id = auth.uid() or public.is_staff());

drop policy if exists "cases_insert_own" on public.cases;
create policy "cases_insert_own"
on public.cases
for insert
with check (user_id = auth.uid());

drop policy if exists "cases_update_own_or_staff" on public.cases;
create policy "cases_update_own_or_staff"
on public.cases
for update
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

drop policy if exists "cases_delete_own_or_staff" on public.cases;
create policy "cases_delete_own_or_staff"
on public.cases
for delete
using (user_id = auth.uid() or public.is_staff());

-- Evidence: allowed if user can access the parent case (owner or staff).
drop policy if exists "case_evidence_select_parent_case" on public.case_evidence;
create policy "case_evidence_select_parent_case"
on public.case_evidence
for select
using (
  exists (
    select 1
    from public.cases c
    where c.id = case_evidence.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "case_evidence_insert_parent_case" on public.case_evidence;
create policy "case_evidence_insert_parent_case"
on public.case_evidence
for insert
with check (
  exists (
    select 1
    from public.cases c
    where c.id = case_evidence.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "case_evidence_delete_parent_case" on public.case_evidence;
create policy "case_evidence_delete_parent_case"
on public.case_evidence
for delete
using (
  exists (
    select 1
    from public.cases c
    where c.id = case_evidence.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

-- Timeline: allowed if user can access the parent case (owner or staff).
drop policy if exists "case_timeline_select_parent_case" on public.case_timeline_events;
create policy "case_timeline_select_parent_case"
on public.case_timeline_events
for select
using (
  exists (
    select 1
    from public.cases c
    where c.id = case_timeline_events.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "case_timeline_insert_parent_case" on public.case_timeline_events;
create policy "case_timeline_insert_parent_case"
on public.case_timeline_events
for insert
with check (
  exists (
    select 1
    from public.cases c
    where c.id = case_timeline_events.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists "case_timeline_delete_parent_case" on public.case_timeline_events;
create policy "case_timeline_delete_parent_case"
on public.case_timeline_events
for delete
using (
  exists (
    select 1
    from public.cases c
    where c.id = case_timeline_events.case_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

-- Notifications: users can read/create for themselves; staff can read all.
drop policy if exists "notifications_select_own_or_staff" on public.notifications;
create policy "notifications_select_own_or_staff"
on public.notifications
for select
using (user_id = auth.uid() or public.is_staff());

drop policy if exists "notifications_insert_own" on public.notifications;
create policy "notifications_insert_own"
on public.notifications
for insert
with check (user_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
on public.notifications
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Threat feed: public read, staff write.
drop policy if exists "threats_public_read" on public.threats;
create policy "threats_public_read"
on public.threats
for select
using (true);

drop policy if exists "threats_staff_write" on public.threats;
create policy "threats_staff_write"
on public.threats
for insert
with check (public.is_staff());

drop policy if exists "threats_staff_update" on public.threats;
create policy "threats_staff_update"
on public.threats
for update
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "threats_staff_delete" on public.threats;
create policy "threats_staff_delete"
on public.threats
for delete
using (public.is_staff());
