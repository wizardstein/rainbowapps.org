# RainbowApps — Project Guide

RainbowApps (rainbowapps.org) is a service run by one person (Adelin, Cluj-Napoca, under Rainbow Engineering SRL): I build apps for people who have a good idea but can't code. **Pricing is "de la 0 lei"** (owner decision 2026-10-01): free for NGOs, good causes and many small projects; larger/complex projects (typically companies) are paid, priced case by case after reading the idea. No public price list, no pricing/organisation field in the form — triage happens from the idea text. They keep everything — idea, code, domain. This website lets people submit an idea and shows my past work so they trust me.

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
4. **No accounts for visitors, no in-site payments.** The only auth is the owner's `/admin` sign-in. Donations run through the Revolut Merchant API hosted checkout (owner + accountant decision, 2026-07-02): the server only creates the order (`REVOLUT_SECRET_KEY`, server-only) and redirects to Revolut's page — card data never touches the site.
5. **The submission form is the front door — it must never crash.** Validate on client and server, fail gracefully with clear messages.
6. **Secrets are server-only.** The Supabase service-role key, Resend key, and owner email never reach the client bundle. All Supabase/Resend access happens in a Server Action or route handler.
7. **Don't add scope.** If it isn't in `SPEC.md`, ask before building it.

## Portfolio cost estimates (`PROJECT_VALUE` in `lib/site.ts`)
Owner feedback, 2026-10-15: **don't inflate the "ar fi costat" figures.** Price every new
project as what one good senior freelancer in Cluj would have charged working solo
(~30–40 €/h, i.e. ~4.500–6.500 €/month; add a designer only where there is real identity or
design work), not as an agency team with PM and QA. Content volume (e.g. generated problem
banks) is never billed. Reference point: vreaumate.online (~24k lines, 59 routes, four paid
products, LaTeX service, CMS, admin) = `~50.000–70.000 €`, `~7–8 luni, un singur programator`.
The older entries were priced at agency level; on 2026-10-18 the owner brought joaca (`~8.000–11.000 €`) and ymarchive (`~6.000–8.000 €`) down to freelancer scale, the rest stay as they are unless the owner says otherwise. When in doubt, go
lower, and show the owner the breakdown before a number goes on the site.

## Voice (for all UI copy)
Modest, warm, genuine, human. No hype, no salesmanship, no "we" — it's one person. Empowering and kind. Romanian copy is provided verbatim in `SPEC.md` — use it, don't reinvent it.
