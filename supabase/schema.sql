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

-- ── Admin section additions (2026-07-02, TODO §5) ─────────────────────────

-- Single-row settings table: the availability flag, editable from /admin.
create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  availability text not null default 'green'
    check (availability in ('green','amber')),
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (true) on conflict (id) do nothing;

-- Portfolio cards, editable from /admin (replaces the hardcoded PROJECTS array).
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text not null,
  url text not null,
  sort_order int not null default 0,
  published boolean not null default true
);

-- Testimonials, editable from /admin; the landing section renders only when
-- at least one published row exists.
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null,
  text text not null,
  url text,
  sort_order int not null default 0,
  published boolean not null default false
);

-- Same security pattern as submissions: RLS on, zero anon policies,
-- explicit grants for the API's service_role.
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
grant all privileges on table public.site_settings to service_role;
grant all privileges on table public.projects to service_role;
grant all privileges on table public.testimonials to service_role;

-- Seed the current three portfolio cards.
insert into public.projects (title, description, url, sort_order)
select * from (values
  ('scoala.beard-brothers.ro',
   'Site-ul campaniei prin care un ONG din Cluj construiește o școală, cărămidă cu cărămidă.',
   'https://scoala.beard-brothers.ro', 1),
  ('joaca.beard-brothers.ro',
   'Joc în browser făcut pentru aceeași campanie: prinzi cărămizi, ocolești prejudecăți.',
   'https://joaca.beard-brothers.ro', 2),
  ('ymarchive.chat',
   'Cititor de arhive Yahoo Messenger, direct în browser. Nimic nu pleacă de pe calculatorul tău.',
   'https://ymarchive.chat', 3)
) as seed(title, description, url, sort_order)
where not exists (select 1 from public.projects);

-- ── Support section additions (2026-07-02) ────────────────────────────────

-- One row per "Susțin inițiativa" click (anonymous, timestamp only).
create table if not exists public.supporters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);
alter table public.supporters enable row level security;
grant all privileges on table public.supporters to service_role;
