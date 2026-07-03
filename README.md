# rainbowapps.org

Free service run by Adelin (Cluj-Napoca, Rainbow Engineering SRL): people with a good
app idea who can't code submit it through a form; Adelin builds it for free; they keep
everything — idea, code, domain. Romanian-only UI.

**Read `SPEC.md` (product source of truth) and `CLAUDE.md` (hard rules) before changing anything.**
Open work lives in `TODO.md`.

## Stack

Next.js (App Router, TypeScript strict) · Tailwind CSS · Supabase (Postgres + private
Storage bucket for sketches) · Resend (transactional email) · Vercel (hosting, deploys
on push to `main`).

## Commands

```bash
npm run dev     # local dev server
npm run build   # production build — must pass before any deploy
npm run lint    # eslint
```

## Environment

Copy `.env.example` to `.env.local` and fill in (or `vercel env pull` — the repo is
linked to the `rainbowapps-org` Vercel project):

| Var | What |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role/secret key — **server-only, never `NEXT_PUBLIC`** |
| `RESEND_API_KEY` | Resend key with sending access |
| `OWNER_EMAIL` | where new-idea notifications (and replies) go |
| `RESEND_FROM` | `idei@rainbowapps.org` (verified domain in Resend) |
| `NEXT_PUBLIC_SITE_URL` | `https://rainbowapps.org` |
| `CRON_SECRET` | guards `/api/cron/retry-emails`; Vercel Cron sends it as a Bearer token |

(Newer vars — admin sign-in, AI refine, Revolut — are documented in `.env.example`.)

## Email reliability

Notification emails (owner + submitter for ideas, owner for testimonials) are stamped
on their row (`*_notified_at`) when Resend accepts them. A daily Vercel cron
(`vercel.json` → `/api/cron/retry-emails`, 06:00 UTC) re-sends anything unstamped from
the last 14 days, so a Resend outage or a spike never loses an email.

## Database

Schema lives in `supabase/migrations/` (versioned SQL, applied with the Supabase CLI —
the prisma-migrate equivalent). All tables have RLS on with zero anon policies — only
the service-role key can touch them.

```bash
npm run db:new <name>   # create supabase/migrations/<timestamp>_<name>.sql, then edit it
npm run db:push         # apply pending migrations to the linked remote DB
```

One-time setup on a new machine: `supabase login`, then
`supabase link --project-ref <ref>` (ref is the subdomain of `SUPABASE_URL`; it asks
for the database password — Dashboard → Settings → Database). The pre-migrations
production schema is baselined as `20260702000000_initial_schema.sql`; on a database
that already has those tables, mark it applied instead of running it:
`supabase migration repair --status applied 20260702000000`.

## Availability badge

Flip `AVAILABILITY` in `lib/site.ts` between `"green"` (open for ideas) and `"amber"`
(building, submissions queue). One-line commit; Vercel auto-deploys.
