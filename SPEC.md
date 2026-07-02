# RainbowApps — v1 Specification

> Source of truth for building rainbowapps.org from an empty folder.
> Build exactly what is in this document. If something you want to add is not here, ask first.

---

## How to use this with Claude Code

1. Put this file and `CLAUDE.md` at the repo root of an empty folder.
2. Enter **plan mode** and say: *"Read SPEC.md and CLAUDE.md, then propose a build plan following the milestones in section 12. Don't write code yet."*
3. Review the plan, then build milestone by milestone. Run `npm run build` after each milestone.
4. The owner (you) does the manual steps in section 14 (domain, Supabase project, Resend domain, env vars).

---

## 1. What this is

A small, fast, Romanian-language website with two jobs:

1. **Let people submit an app idea** through a simple, robust form. Submissions are stored in Supabase and the owner is notified by email. The submitter gets a warm confirmation email.
2. **Show credibility** through a short portfolio of work already shipped.

There is also a **status indicator** (green = open for ideas / amber = currently building, submissions queued) so visitors know what to expect.

That is the whole product. It is intentionally small.

## 2. Who it's for

Non-technical people in Romania who have an idea for an app that helps people, but can't build it themselves. The tone and copy must feel safe and welcoming to someone who is *not* a developer and may feel their idea isn't "good enough."

## 3. Principles for this build

- **Ship the smallest honest version.** Every feature here earns its place; nothing speculative.
- **Robustness over cleverness.** The form is the front door. It must validate everything and never crash, even on weird input or a failing third-party.
- **Server-side and secret-safe.** No secrets in the client bundle. All Supabase and Resend calls happen server-side.
- **Cheap and abuse-resistant.** No public API surface that someone can script against to run up a bill. A honeypot field is the v1 anti-spam.
- **Accessible and mobile-first.** Real people on real phones. Keyboard focus visible, reduced motion respected.

## 4. Tech stack (decided — don't substitute)

| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable), App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Database | Supabase (Postgres) |
| File storage | Supabase Storage (private bucket) |
| Email | Resend |
| Hosting | Vercel |
| UI language | Romanian only |
| Forms/data flow | React Server Component pages + a Server Action for the submission |

No CMS, no auth library, no i18n library, no AI SDK.

## 5. Routes

| Route | Type | Purpose |
|---|---|---|
| `/` | Server Component | Landing: hero, how it works, why, what I don't build, portfolio, status, CTA |
| `/trimite` | Server Component wrapping a client form | The submission form |
| `/multumesc` | Server Component | Confirmation page shown after a successful submit |
| `/ghid` | Server Component wrapping a client wizard | Five-step idea-structuring guide — a short, attributed adaptation of the Foundation Sprint ("Click", Knapp & Zeratsky); assembled draft prefills the /trimite form (added 2026-07-02) |
| `/colaborare` | Server Component | "Cum colaborăm" — the working agreement: free build, definition of done, ownership, post-handover support (added 2026-07-02) |
| `/confidentialitate` | Server Component | Privacy policy in plain Romanian — GDPR information duty (added 2026-07-02) |

The landing page links prominently to `/trimite`. After a successful submit, redirect to `/multumesc`.

## 6. Page content (use this Romanian copy verbatim)

### 6.1 Landing `/`

**Hero**
- H1: `Ai o idee bună? O construiesc gratis.`
- Subtitle: `Sunt Adelin, programator din Cluj. Dacă ai o idee de aplicație care ajută oameni, dar nu știi să programezi, o construiesc eu — gratuit. Tu păstrezi totul: ideea, codul, domeniul.`
- Primary CTA button → `/trimite`: `Spune-mi ideea ta`
- Show the **status badge** (section 6.4) near the hero.

**Cum funcționează** (a real 3-step sequence — numbered markers are appropriate here)
1. `Îmi spui ideea` — `Completezi un formular scurt. Fără jargon, fără cont, fără costuri.`
2. `Mă uit peste ea` — `Aleg ideile care ajută oameni și pe care le pot construi singur. Îți răspund oricum, indiferent de răspuns.`
3. `O construiesc` — `De la un weekend la o lună. Tu plătești doar domeniul (~€10–15/an) și găzduirea (gratuită). Restul e din partea mea.`

**Povestea mea** *(added 2026-07-02, owner request — builds trust through the real arc, without private details)*

Intro (three paragraphs):
> `Calculatoarele m-au fascinat de mic. Am avut primul PC la 4 ani, iar la 10 am reparat primul calculator „pe bani” — cinci lei. Am și stricat unul între timp (am formatat un hard disk fără backup), dar cam așa se învață.`
>
> `De atunci, drumul a trecut prin service-uri de calculatoare și case de marcat, apoi prin testare de software, automatizări și echipe conduse în companii mari. Să programez am învățat singur, din nevoie: întâi ca să-mi ușurez munca, apoi pentru că nu m-am mai putut opri.`
>
> `Am urcat și pe scara corporate, destul cât să înțeleg că nu acolo mi-e locul. Cel mai fericit sunt când construiesc ceva care ajută pe cineva. Așa a apărut RainbowApps.`

Timeline (a real chronological sequence — rendered along a vertical spectrum spine, the one place the rainbow signature repeats):
- `la 4 ani` — `Primul meu calculator.`
- `la 10 ani` — `Primul calculator reparat pe bani. Cinci lei.`
- `la 17 ani` — `Anunț în ziar: repar orice calculator, la domiciliu.`
- `2008` — `Primul job: depanator de calculatoare, apoi de case de marcat.`
- `2009` — `Primul meu program — scris ca să ușureze munca într-o firmă mică.`
- `2012` — `M-am mutat la Cluj, în software. Am învățat să programez singur, din nevoie.`
- `anii de după` — `Automatizare de teste, proiecte internaționale, echipe conduse.`
- `azi` — `Construiesc aplicații gratuite pentru oameni cu idei bune.`

**De ce fac asta**
> `Cred că o idee bună nu ar trebui să rămână blocată doar fiindcă omul din spatele ei nu scrie cod. M-au inspirat profesorii care predau gratis și oamenii care construiesc open source. Acesta e felul meu de a da înapoi.`

Second paragraph (added 2026-07-02):
> `Și pentru că știu exact cum e: am și eu idei care stau în sertar fiindcă nu am cunoștințele să le construiesc singur. Nu vreau ca ideea ta să rămână acolo.`

**Ce nu pot construi** (kept gentle, not a wall of "no")
> `Las deoparte ideile care țin de jocuri de noroc sau pariuri, politică, religie, sau orice ar putea face rău cuiva. Și, deocamdată, sisteme foarte complexe cu multe părți — sunt un singur om.`

Second paragraph (added 2026-07-02 — profit-first ideas are welcome as long as they help):
> `În rest, orice idee care ajută e binevenită — inclusiv una din care vrei să câștigi. Nu trebuie să fie caritate: ideea, codul și ce câștigi din ea rămân ale tale.`

**Portofoliu** (section 6.3)

**Footer** (section 6.5)

### 6.2 Submission page `/trimite`

- Short heading: `Trimite-mi ideea ta`
- One reassuring line: `Nu trebuie să fie tehnic și nu trebuie să fie perfect. Scrie-mi pur și simplu ce ai în cap.`
- The form (section 7).

### 6.3 Portfolio cards (hardcoded, 3 items — third added 2026-07-02)

Store as a typed array in `lib/site.ts`. Each card: title, one-line description, URL, opens in new tab.

- `scoala.beard-brothers.ro` — `Site-ul campaniei prin care un ONG din Cluj construiește o școală, cărămidă cu cărămidă.` → https://scoala.beard-brothers.ro
- `joaca.beard-brothers.ro` — `Joc în browser făcut pentru aceeași campanie: prinzi cărămizi, ocolești prejudecăți.` → https://joaca.beard-brothers.ro
- `ymarchive.chat` — `Cititor de arhive Yahoo Messenger, direct în browser. Nimic nu pleacă de pe calculatorul tău.` → https://ymarchive.chat

### 6.4 Status badge

A small pill: a colored dot + label. Driven by a single constant `AVAILABILITY: 'green' | 'amber'` in `lib/site.ts` (flipping it is a one-line commit; Vercel auto-deploys).

- `green`: dot green, text `Disponibil — primesc idei noi și răspund repede.`
- `amber`: dot amber, text `Construiesc acum — poți trimite o idee, dar intri la coadă.`

(Use a CSS-styled dot, not an emoji.)

### 6.5 Footer

> `RainbowApps — o inițiativă personală, sub Rainbow Engineering SRL, Cluj-Napoca. Construiesc și fac voluntariat pentru comunitate.`

Plus a short privacy line linking to nothing fancy — just inline text:
> `Datele pe care le trimiți sunt folosite doar ca să te pot contacta despre ideea ta. Nu le dau nimănui.`

### 6.6 Thank-you page `/multumesc`

- H1: `Mulțumesc! Am primit ideea ta.`
- Body: `O să mă uit peste ea cu atenție și îți răspund pe email — indiferent dacă o pot construi sau nu. Poate dura câteva zile.`
- Link back to `/`: `Înapoi la pagina principală`

## 7. The submission form

A client component (`SubmissionForm`) that submits to a **Server Action**. Fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | text | yes | label `Numele tău` |
| `email` | email | yes | label `Email`, validated format |
| `phone` | tel | no | label `Telefon (opțional)` |
| `idea` | textarea | yes | label `Spune-mi ideea ta`; placeholder `Ce vrei să construiești? Cui ar ajuta? Nu trebuie să fie tehnic — scrie cum îți vine.`; min 20 chars |
| `attachment` | file | no | label `Atașează o schiță sau imagine (opțional)`; accept images + PDF; max 5 MB |
| `consent` | checkbox | yes | label `Sunt de acord să fiu contactat pe email în legătură cu ideea mea.` |
| `company` | hidden honeypot | — | must stay empty; if filled, silently drop as spam |

Submit button: `Trimite ideea`. While submitting, disable it and show `Se trimite…`.

**Client-side:** validate required fields, email format, idea min length, file type/size. Show inline, friendly Romanian errors (e.g. `Te rog scrie câteva cuvinte despre idee.`, `Fișierul e prea mare (max 5 MB).`). Errors state what to fix, in the interface's voice — no apologizing.

**On submit (Server Action `submitIdea`):**
1. Re-validate everything server-side (never trust the client). Reject on failure with a field-level error.
2. If `company` (honeypot) is non-empty → return success to the user but do nothing (silently drop).
3. If a file is attached: upload to Supabase Storage bucket `sketches` under a path like `submissions/{uuid}/{filename}` using the service-role client. Keep the file private. Store the path.
4. Insert a row into `submissions` (section 8).
5. Send **two emails via Resend** (section 9). Email failure must not lose the submission — the row is already saved; log the error and still return success to the user.
6. Redirect to `/multumesc`.

**Defense in depth:** even though the Server Action uses the service-role key (which bypasses RLS), RLS is still enabled on the table with no anon policies (section 8), so nothing is reachable directly from the client.

## 8. Data model (Supabase)

Run this SQL in the Supabase SQL editor.

```sql
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

-- Private storage bucket for sketches.
insert into storage.buckets (id, name, public)
values ('sketches', 'sketches', false)
on conflict (id) do nothing;
```

**How the owner manages ideas:** entirely in the Supabase Table Editor. Change `status` by hand as an idea moves through `new → reviewing → accepted → building → shipped` (or `declined`). Use `notes` for private thoughts. To view an attached sketch, generate a signed URL from the Storage UI. No admin UI is built.

## 9. Email (Resend)

Two transactional emails per accepted submission, both via Resend, sent from a verified domain (e.g. `idei@rainbowapps.org`).

**A) To the owner** (`OWNER_EMAIL`)
- Subject: `Idee nouă pe RainbowApps — {name}`
- Body (plain, readable): name, email, phone (if any), the full idea text, whether a sketch was attached, and the submission id. If a sketch exists, note that it's in Storage under the saved path.

**B) To the submitter** (their email) — warm confirmation
- Subject: `Am primit ideea ta — RainbowApps`
- Body:
  > `Salut {name},`
  > `Mulțumesc că mi-ai trimis ideea ta. O să mă uit peste ea cu atenție și îți răspund pe email, indiferent dacă o pot construi sau nu.`
  > `Toate cele bune,`
  > `Adelin — RainbowApps`

If Resend fails, log it; do not fail the submission.

## 10. Design direction

This is direction, not pixel-by-pixel orders. Finalize a concrete token system in plan mode, then build to it. Take one justified aesthetic risk.

**Feeling:** calm, optimistic, human, hand-built. It should feel like one trustworthy person made it, not an agency or a startup. Generous whitespace, confident type, nothing loud.

**Avoid the AI-default looks.** Do *not* ship: a cream (#F4F1EA-ish) background with a high-contrast serif + terracotta accent; or near-black with a single acid-green/vermilion accent; or a hairline broadsheet grid. These read as templated.

**On "rainbow":** the name invites a spectrum, but a literal multicolor rainbow reads childish or like a logo cliché. Use color as a *single restrained signature* — e.g. a thin spectrum gradient used once (a hairline under the H1, or the status dot's halo, or a single arc motif), with the rest of the palette quiet and warm. Spend boldness in one place; keep everything around it disciplined.

**Type:** pair a characterful but readable display face with a clean humanist body face. Make the type treatment memorable, not a neutral delivery vehicle. Set a clear scale.

**Structure:** the "Cum funcționează" steps are a genuine sequence, so numbered markers (1/2/3) are appropriate there — but only there.

**Quality floor (non-negotiable):** responsive down to small phones, visible keyboard focus, `prefers-reduced-motion` respected, semantic HTML, labels tied to inputs, color contrast AA.

**Copy is design material:** use the provided Romanian copy; buttons say exactly what they do (`Trimite ideea`, not `Submit`); keep sentence case; no filler.

## 11. Environment variables

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=     # server-only, never NEXT_PUBLIC
RESEND_API_KEY=                # server-only
OWNER_EMAIL=                   # where new-idea notifications go
RESEND_FROM=idei@rainbowapps.org
NEXT_PUBLIC_SITE_URL=https://rainbowapps.org
```

No public Supabase keys are needed, because all DB/Storage access is server-side. Provide a `.env.example` with these keys and empty values.

## 12. Build milestones (do in order; build must pass after each)

1. **Scaffold.** Next.js + TS (strict) + Tailwind. ESLint. `.env.example`. Push to GitHub, connect to Vercel, confirm an empty deploy works.
2. **Static landing.** Hero, Cum funcționează, De ce, Ce nu pot construi, portfolio, status badge, footer — all from the copy in section 6. `lib/site.ts` holds `AVAILABILITY` and the `PROJECTS` array.
3. **Supabase.** Create project, run the SQL in section 8, create the `sketches` bucket. Add server-side Supabase client (service role).
4. **Form UI.** `/trimite` with `SubmissionForm`, full client-side validation and friendly errors. Honeypot field included.
5. **Server Action.** `submitIdea`: server validation, optional file upload, insert row, redirect to `/multumesc`. (Wire emails in the next step so the data path is provable first.)
6. **Email.** Resend integration, both emails (section 9), with failure-tolerant handling.
7. **Thank-you page** `/multumesc`.
8. **Polish & ship.** Responsive pass, accessibility pass, metadata + Open Graph (title, description, a simple OG image), favicon, `robots.txt`. Final `npm run build`. Owner sets env vars and domain.

## 13. Acceptance criteria

- Submitting a valid form inserts exactly one row in `submissions` with the right values.
- The owner receives the notification email; the submitter receives the confirmation email.
- A valid attachment lands in the private `sketches` bucket and its path is stored; the file is **not** publicly accessible.
- Invalid input (missing fields, bad email, short idea, oversized/wrong-type file) is caught on both client and server with clear Romanian messages and never throws an unhandled error.
- A failing Resend call does not lose a submission.
- No secret (service-role key, Resend key, owner email) appears in the client bundle.
- Site is responsive on a 360px-wide phone, keyboard-navigable with visible focus, and respects reduced motion.
- The status badge reflects `AVAILABILITY` and changing that one constant changes the site.

## 14. Manual steps the owner does (outside Claude Code)

1. Buy `rainbowapps.org` at Namecheap; point DNS to Vercel.
2. Create the Supabase project; run the SQL; confirm the `sketches` bucket exists and is private.
3. In Resend, verify the sending domain (add the DNS records Resend gives you) so `RESEND_FROM` works.
4. Set all env vars (section 11) in Vercel.
5. Flip `AVAILABILITY` in `lib/site.ts` to `green` when open, `amber` when mid-build.

## 15. Explicitly out of scope for v1

No idea scoring or scores shown to users · no languages other than Romanian · no visitor accounts · no payments or donation processing · no submission queue UI · no analytics. These can come later, each only when there's a real need.

**Superseded on 2026-07-02 by owner decisions** (details in `TODO.md` §4–5):
- ~~No AI/LLM calls~~ → opt-in AI idea refinement on `/trimite`, strict guardrails, form never depends on it.
- ~~No admin panel / no auth~~ → `/admin` with Google sign-in allowlisted to the owner; availability flag, submissions, portfolio and testimonials managed there (DB-driven with tag revalidation).
