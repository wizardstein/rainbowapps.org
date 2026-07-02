# RainbowApps — Project Guide

RainbowApps (rainbowapps.org) is a free service run by one person (Adelin, Cluj-Napoca, under Rainbow Engineering SRL): I build apps for people who have a good idea but can't code. They keep everything — idea, code, domain. This website lets people submit an idea and shows my past work so they trust me.

**Read `SPEC.md` in full before planning or building anything.** This file is only the quick reference.

## Stack
- Next.js (latest stable, App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Storage) — stores submissions
- Resend — sends email notifications
- Hosted on Vercel
- UI language: Romanian only (v1)

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (must pass before any deploy)
- `npm run lint` — lint

## Hard rules — do not violate
1. **AI only for the opt-in refine step** on `/trimite` (owner decision 2026-07-02, TODO §4; supersedes the original "no AI" rule). The form NEVER depends on the AI path; only the idea text is ever sent to Anthropic; strict cost guardrails.
2. **No scores shown to users.** The admin lives at `/admin` (owner decision 2026-07-02, TODO §5): Google sign-in allowlisted to `ADMIN_EMAIL` only. The public site must never depend on admin/auth code.
3. **Romanian only.** No machine translations, no i18n framework.
4. **No accounts for visitors, no payments.** The only auth is the owner's `/admin` sign-in.
5. **The submission form is the front door — it must never crash.** Validate on client and server, fail gracefully with clear messages.
6. **Secrets are server-only.** The Supabase service-role key, Resend key, and owner email never reach the client bundle. All Supabase/Resend access happens in a Server Action or route handler.
7. **Don't add scope.** If it isn't in `SPEC.md`, ask before building it.

## Voice (for all UI copy)
Modest, warm, genuine, human. No hype, no salesmanship, no "we" — it's one person. Empowering and kind. Romanian copy is provided verbatim in `SPEC.md` — use it, don't reinvent it.
