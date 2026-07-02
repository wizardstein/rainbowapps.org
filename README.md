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

## Database

Schema lives in `supabase/schema.sql` — run it in the Supabase SQL editor of a fresh
project. It creates the `submissions` table (RLS on, zero anon policies — only the
service-role key can touch it) and the private `sketches` storage bucket. There is no
admin UI: manage submissions in the Supabase Table Editor (`status`: new → reviewing →
accepted → building → shipped / declined; private thoughts in `notes`).

## Availability badge

Flip `AVAILABILITY` in `lib/site.ts` between `"green"` (open for ideas) and `"amber"`
(building, submissions queue). One-line commit; Vercel auto-deploys.
