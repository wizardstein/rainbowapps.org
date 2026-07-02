"use server";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { IDEA_MAX, IDEA_MIN } from "@/lib/validation";

// Optional AI helper for the idea field. The form NEVER depends on this path —
// every failure returns a gentle message and plain submission keeps working.

export type RefineResult =
  | { ok: true; suggestion: string }
  | { ok: false; message: string };

// One gentle failure message for everything that isn't the visitor's fault.
const GENERIC_FAIL =
  "Nu am putut pregăti o sugestie acum. Nicio grijă — ideea ta e bună și așa cum e, o poți trimite direct.";

const TOO_SHORT =
  "Scrie mai întâi câteva rânduri despre idee — apoi te pot ajuta să o structurezi.";

const TOO_LONG =
  "Textul e prea lung pentru asistent (maxim 5.000 de caractere). Scurtează-l puțin sau trimite-l așa cum e.";

const CAP_REACHED =
  "Ai folosit deja asistentul de trei ori — ideea ta e în formă bună. Trimite-o liniștit așa cum e.";

// The exact sentence the model returns for anything that isn't an app idea.
const OFF_TOPIC_SENTENCE =
  "Aici pot ajuta doar la clarificarea unei idei de aplicație.";

const SYSTEM_PROMPT = `Ajuți oameni fără pregătire tehnică să își exprime mai clar ideea de aplicație, înainte să o trimită printr-un formular. Primești textul unei idei și răspunzi în limba română, doar cu varianta îmbunătățită — fără introducere, fără explicații, fără formatare specială.

Cum îmbunătățești:
- Păstrează cât mai mult cuvintele, tonul și intenția persoanei. Nu evalua ideea, nu da sfaturi generale.
- Adaugă claritate reală, nu doar corecturi: dacă singurele schimbări ar fi diacritice sau virgule, dezvoltă puțin ce e deja acolo — fă concretul mai concret (cine folosește, când, ce face aplicația), tot pornind de la materialul persoanei.
- Dacă textul are deja structura cu etichete („Pentru cine e:", „Ce problemă rezolvă:", „Cum se descurcă oamenii azi:", „De ce a mea ar fi mai bună:", „Cum ar arăta, în forma cea mai simplă:"), păstrează etichetele exact așa și îmbunătățește răspunsurile de sub ele.
- Singura excepție de la regula „nu inventa nimic": dacă un răspuns lipsește sau spune „nu știu", propune ceva modest și logic dedus din celelalte răspunsuri, marcat clar: „(propunerea mea: …)". În rest, nu inventa funcționalități sau detalii care nu apar în text.

Dacă textul primit nu este o idee de aplicație — de exemplu o rețetă, o temă, o conversație, o cerere de cod sau orice altceva — răspunde exact cu propoziția: „${OFF_TOPIC_SENTENCE}" și nimic în plus.`;

// Per-visitor cap: 3 calls, tracked in a signed HTTP-only cookie.
const REFINE_COOKIE = "refine_count";
const REFINE_LIMIT = 3;
const COOKIE_MAX_AGE = 60 * 60 * 24; // a day is plenty for one form session

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Read the call count from the signed cookie. Anything malformed or with a
 *  bad signature counts as 0 — the cookie is a soft cap, not a security wall
 *  (the Vercel WAF rate limit is the hard backstop). */
function readCount(raw: string | undefined, secret: string): number {
  if (!raw) return 0;
  const dot = raw.lastIndexOf(".");
  if (dot === -1) return 0;
  const value = raw.slice(0, dot);
  if (sign(value, secret) !== raw.slice(dot + 1)) return 0;
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n >= 0 ? n : 0;
}

export async function refineIdea(formData: FormData): Promise<RefineResult> {
  try {
    // 1. Honeypot — bots pay nothing. Same field as the main form.
    const honeypot = String(formData.get("contact_notes") ?? "").trim();
    if (honeypot.length > 0) {
      return { ok: false, message: GENERIC_FAIL };
    }

    // 2. Length bounds — reject before any API call.
    const idea = String(formData.get("idea") ?? "").trim();
    if (idea.length < IDEA_MIN) {
      return { ok: false, message: TOO_SHORT };
    }
    if (idea.length > IDEA_MAX) {
      return { ok: false, message: TOO_LONG };
    }

    // 3. Per-visitor cap. No AUTH_SECRET means we can't sign the cookie —
    //    skip the AI call gracefully rather than run uncapped.
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      console.error("Refine: AUTH_SECRET is missing — skipping the AI call.");
      return { ok: false, message: GENERIC_FAIL };
    }
    const cookieStore = await cookies();
    const count = readCount(cookieStore.get(REFINE_COOKIE)?.value, secret);
    if (count >= REFINE_LIMIT) {
      return { ok: false, message: CAP_REACHED };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error(
        "Refine: ANTHROPIC_API_KEY is missing — skipping the AI call.",
      );
      return { ok: false, message: GENERIC_FAIL };
    }

    // Count the call before making it, so failures spend the budget too.
    const next = String(count + 1);
    cookieStore.set(REFINE_COOKIE, `${next}.${sign(next, secret)}`, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    // Data minimization: ONLY the idea text goes to Anthropic — never the
    // name, email, phone, or attachment.
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: idea }],
    });

    console.log(
      `Refine usage: input_tokens=${response.usage.input_tokens} output_tokens=${response.usage.output_tokens}`,
    );

    let text = "";
    for (const block of response.content) {
      if (block.type === "text") text += block.text;
    }
    text = text.trim();

    if (!text) {
      return { ok: false, message: GENERIC_FAIL };
    }

    // The fixed off-topic sentence is a notice, not a suggestion — never
    // offer to replace the visitor's text with it.
    if (
      text.includes("doar la clarificarea unei idei de aplicație") &&
      text.length <= OFF_TOPIC_SENTENCE.length + 20
    ) {
      return { ok: false, message: OFF_TOPIC_SENTENCE };
    }

    return { ok: true, suggestion: text };
  } catch (err) {
    console.error("Refine failed:", err);
    return { ok: false, message: GENERIC_FAIL };
  }
}
