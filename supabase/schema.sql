-- RainbowApps — schema (source: SPEC.md §8)
-- Run this in the Supabase SQL editor of the project you create for rainbowapps.org.

create extension if not exists "pgcrypto";

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  idea text not null,
  attachment_path text,
  status text not null default 'new',
  notes text,
  locale text not null default 'ro'
);

alter table public.submissions
  add constraint submissions_status_check
  check (status in ('new','reviewing','accepted','building','shipped','declined'));

-- Enable RLS and add NO policies for anon/authenticated.
-- Result: only the service_role (used server-side) can read/write.
alter table public.submissions enable row level security;

-- Needed when this file is run over a direct psql connection (the SQL editor's
-- default privileges don't apply there): the API's service_role must be able
-- to touch the table. RLS still blocks anon/authenticated (no policies).
grant usage on schema public to service_role;
grant all privileges on table public.submissions to service_role;

-- Private storage bucket for sketches.
insert into storage.buckets (id, name, public)
values ('sketches', 'sketches', false)
on conflict (id) do nothing;
