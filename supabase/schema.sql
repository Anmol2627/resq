-- RESQ Supabase schema (run in Supabase SQL Editor)
-- Creates: profiles, emergency_contacts, incidents + RLS policies

-- Extensions
create extension if not exists "pgcrypto";

-- Helper: updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  first_name text not null,
  last_name text not null,
  phone text not null,
  dob date not null,
  role text not null check (role in ('victim','responder','both')),
  skills text[] not null default '{}',
  blood_type text null,
  allergies text null,
  chronic_conditions text null,
  medications text null,
  medical_issues text null,
  availability boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- EMERGENCY CONTACTS (3 per user, position 1..3)
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  position int not null check (position between 1 and 3),
  name text not null,
  relationship text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists emergency_contacts_user_position_uq
on public.emergency_contacts(user_id, position);

-- INCIDENTS
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references public.profiles(id) on delete set null,
  type text not null check (type in ('medical','fire','safety','technical')),
  severity text not null check (severity in ('MILD','MODERATE','CRITICAL')),
  description text null,
  status text not null default 'OPEN' check (status in ('OPEN','RESOLVED','CANCELLED')),
  accepted_by uuid null references public.profiles(id) on delete set null,
  accepted_at timestamptz null,
  lat double precision null,
  lng double precision null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz null
);

alter table public.incidents add column if not exists accepted_by uuid null references public.profiles(id) on delete set null;
alter table public.incidents add column if not exists accepted_at timestamptz null;

-- RLS
alter table public.profiles enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.incidents enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Emergency contacts policies
drop policy if exists "contacts_select_own" on public.emergency_contacts;
create policy "contacts_select_own"
on public.emergency_contacts
for select
using (auth.uid() = user_id);

drop policy if exists "contacts_insert_own" on public.emergency_contacts;
create policy "contacts_insert_own"
on public.emergency_contacts
for insert
with check (auth.uid() = user_id);

drop policy if exists "contacts_update_own" on public.emergency_contacts;
create policy "contacts_update_own"
on public.emergency_contacts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "contacts_delete_own" on public.emergency_contacts;
create policy "contacts_delete_own"
on public.emergency_contacts
for delete
using (auth.uid() = user_id);

-- Incidents policies
drop policy if exists "incidents_select_visible" on public.incidents;
create policy "incidents_select_visible"
on public.incidents
for select
using (
  auth.uid() is not null
  and (auth.uid() = user_id or status = 'OPEN')
);

drop policy if exists "incidents_insert_own" on public.incidents;
create policy "incidents_insert_own"
on public.incidents
for insert
with check (auth.uid() = user_id);

drop policy if exists "incidents_update_own" on public.incidents;
create policy "incidents_update_own"
on public.incidents
for update
using (
  auth.uid() is not null
  and (
    auth.uid() = user_id
    or (status = 'OPEN' and accepted_by is null)
    or accepted_by = auth.uid()
  )
)
with check (auth.uid() is not null);

