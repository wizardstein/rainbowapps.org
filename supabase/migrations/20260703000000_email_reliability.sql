-- Email reliability (2026-07-03): delivery tracking so notification emails
-- survive a Resend failure. Each row records when its emails actually went
-- out; the daily cron (/api/cron/retry-emails) retries the rest.

alter table public.submissions
  add column if not exists upload_failed boolean not null default false,
  add column if not exists owner_notified_at timestamptz,
  add column if not exists submitter_notified_at timestamptz;

alter table public.testimonials
  add column if not exists owner_notified_at timestamptz;

-- Backfill: rows from before delivery tracking were already handled by hand.
-- (Runs once — migrations never re-run — so it can't cancel pending retries.)
update public.submissions
  set owner_notified_at = created_at, submitter_notified_at = created_at
  where owner_notified_at is null and submitter_notified_at is null;
update public.testimonials
  set owner_notified_at = created_at
  where owner_notified_at is null;
