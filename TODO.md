# TODO

Findings from the full-repo review on 2026-07-02, plus the planned AI idea-refinement feature.
Ordered by severity within each section.

## 1. Bugs — fix first

- [x] **Attachments over ~1 MB can't be submitted.** Next.js caps Server Action request bodies
  at 1 MB by default; the form promises 5 MB (`lib/validation.ts:6`). A normal phone photo
  passes client validation, then the POST itself is rejected with a 413 before `submitIdea`
  runs. Fix: `experimental: { serverActions: { bodySizeLimit: "6mb" } }` in `next.config.ts`
  (headroom for multipart overhead).
- [x] **A failed request leaves the button stuck on "Se trimite…" forever.**
  `components/SubmissionForm.tsx:57` — `await submitIdea(fd)` has no try/catch/finally. Any
  rejection (the 413 above, flaky mobile network, timeout) escapes the handler,
  `setSubmitting(false)` never runs, no error is shown. Wrap in try/finally and surface the
  generic Romanian error on catch. Violates hard rule #5; compounds with the bug above.
- [x] **Every page canonicalizes to the homepage.** `app/layout.tsx:28` sets
  `alternates: { canonical: "/" }` in the root layout; `/trimite` and `/multumesc` inherit it
  (verified in built HTML). Google is told the submission page is a duplicate of the landing
  page. Move canonical out of the layout, set per page; add `robots: { index: false }` to
  `/multumesc`.
- [x] **Replies to the confirmation email go nowhere.** `lib/email.ts:77` — the submitter
  confirmation has no `replyTo`, so replies go to `idei@rainbowapps.org` (a Resend sending
  identity with no inbox unless MX is set up). The email says "îți răspund pe email" — people
  WILL hit Reply. Add `replyTo: owner`.
- [x] **English 404/error pages on a Romanian-only site.** No `app/not-found.tsx` or
  `app/error.tsx`. Add both, with the site shell and warm Romanian copy (rules #3 and #5).

## 2. Robustness

- [x] Max lengths on text fields (`lib/validation.ts`): name ~120, idea ~5000, email 254 —
  friendly Romanian messages. Matters more once the body limit is raised.
- [x] Failed sketch upload is invisible: owner email says "Schiță atașată: nu" whether there
  was no sketch or the upload failed (`app/trimite/actions.ts:60-64`). Pass an
  "upload failed" flag into the owner email. (The other half — a file uploaded before a
  failed DB insert stays orphaned in the bucket — is accepted knowingly: rare, cheap,
  visible in the Storage UI.)
- [x] Form is dead without JavaScript. Consider `<form action={submitIdea}>` + `useActionState`
  — native-POST fallback, pending state via `useFormStatus`, and it structurally fixes the
  stuck-button bug.
- [x] Send the two emails in parallel (`Promise.allSettled`) — the user currently waits through
  two sequential Resend round-trips before the redirect.
- [x] Honeypot autofill risk: browsers/extensions sometimes fill `name="company"` despite
  `autoComplete="off"`, silently dropping a real person. Rename to something less
  autofill-attractive.

## 3. Housekeeping

- [x] Hoist header/footer into the layout (or shared components). Currently copy-pasted on all
  three pages and inconsistent: `/trimite` footer has only the privacy line, `/multumesc` only
  the company line, `/` both.
- [x] Replace boilerplate `README.md` (still mentions Geist) with: what this is, env setup,
  where the schema lives, how to flip `AVAILABILITY`.
- [x] Check in the SPEC §8 SQL as `supabase/schema.sql`.
- [ ] Small: ~~`app/sitemap.ts`~~ (done — 2 URLs; `/multumesc` is noindex); align `ACCEPT_ATTR` with `ACCEPTED_FILE_TYPES` so the
  file picker can't offer types validation rejects; tiny test suite for `validateSubmission`
  and `storagePath` (they guard the front door).

## 4. Feature: AI idea refinement (opt-in) — decided 2026-07-02

Let submitters optionally refine/clarify their idea with AI **before** sending it. Uses
Adelin's existing Anthropic Console credits with a new project-scoped API key.

> **Supersedes CLAUDE.md hard rule #1 and SPEC §15 ("no AI/LLM calls").** Owner decision,
> 2026-07-02. Update both files as part of building this — the rule becomes "AI only for the
> opt-in refine step; the form itself never depends on it."

### UX

- On `/trimite`, next to the idea textarea: an optional, quiet button (Romanian copy in the
  site's voice — modest, no hype; copy to be written, e.g. an offer to help structure the idea).
- Result is shown as a **suggestion** the user can accept (replaces textarea content) or
  dismiss. Never auto-applied, never auto-sent, never required.
- Same failure philosophy as emails: if the AI call fails, show a gentle message; plain
  submission keeps working. The form never depends on the AI path.
- Data minimization: send **only the idea text** to Anthropic — never name, email, or phone.
- Update the privacy footer line: if you choose the AI option, the idea text is processed by
  Anthropic to generate the suggestion.

### Implementation

- Server Action or route handler only; `@anthropic-ai/sdk`; key read from `ANTHROPIC_API_KEY`
  (server-only, add to `.env.example` + Vercel). Never `NEXT_PUBLIC`.
- Model: **`claude-haiku-4-5`** — $1/$5 per MTok; rewriting a short Romanian paragraph is well
  within it, and cost control is the stated constraint. (Anthropic's general guidance is to
  default to `claude-opus-4-8` at $5/$25; deliberate downgrade here, Adelin's call. Revisit if
  suggestion quality disappoints.)
- Single non-streaming `messages.create`, system prompt in Romanian, `max_tokens` ~1000.
- Log `response.usage` (input/output tokens) per call to Vercel logs to watch spend early on.

### Cost & abuse guardrails ("no tokens for cooking recipes")

- [ ] **Strict system prompt scope**: the only job is clarifying/structuring an app idea, in
  Romanian. If the input is not an app idea (recipe, homework, essay, chat, code request,
  anything else), reply with one fixed short Romanian sentence and nothing more. Worst case
  for off-topic input is a one-sentence response, not a free general-purpose LLM.
- [ ] **Input cap**: reuse the idea max length (~5,000 chars) — reject longer server-side
  before any API call. **Output cap**: `max_tokens` ~1000. Bounds every call to well under
  $0.01 on Haiku.
- [ ] **Honeypot check runs before any AI call** (same field as the form).
- [ ] **Per-visitor limit**: e.g. 3 refine calls per form session (signed HTTP-only cookie).
- [ ] **Platform rate limit**: Vercel WAF rate-limiting rule on the refine endpoint — no new
  service dependency. (SPEC's "no rate-limiting service" predates having a paid API surface;
  a billable endpoint is exactly the "public API someone can script against" §3 warns about.)
- [ ] **Hard spend ceiling** (manual, Console): create the API key in its own workspace at
  console.anthropic.com and set a monthly spend limit on it. Whatever else fails, the bill
  is capped.

### Owner steps (manual)

1. Create a new workspace + API key at console.anthropic.com; set the monthly spend limit.
2. Add `ANTHROPIC_API_KEY` to Vercel env vars (and locally in `.env.local`).

### Acceptance

- Refine works end-to-end in Romanian; off-topic input gets the fixed refusal sentence.
- With the API failing/env var missing, the form submits normally and the UI degrades politely.
- No Anthropic key or call reachable from the client bundle.
- A scripted client hits the per-session cap, then the WAF rate limit; spend limit verified in
  Console.
