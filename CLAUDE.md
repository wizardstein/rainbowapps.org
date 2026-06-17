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
1. **No AI on the website.** No Anthropic/LLM API calls from the public site. The form is plain and robust.
2. **No scores shown to users.** No admin panel — the Supabase dashboard is the admin.
3. **Romanian only.** No machine translations, no i18n framework.
4. **No auth, no accounts, no payments** in v1.
5. **The submission form is the front door — it must never crash.** Validate on client and server, fail gracefully with clear messages.
6. **Secrets are server-only.** The Supabase service-role key, Resend key, and owner email never reach the client bundle. All Supabase/Resend access happens in a Server Action or route handler.
7. **Don't add scope.** If it isn't in `SPEC.md`, ask before building it.

## Voice (for all UI copy)
Modest, warm, genuine, human. No hype, no salesmanship, no "we" — it's one person. Empowering and kind. Romanian copy is provided verbatim in `SPEC.md` — use it, don't reinvent it.
