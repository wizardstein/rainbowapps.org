"use server";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase";

// Public support actions. Same philosophy as the submission form: validate
// everything, never crash, fail with a gentle Romanian message.

export type SupportState = {
  ok?: boolean;
  already?: boolean;
  count?: number;
  error?: string;
} | null;

export type ThoughtState = {
  ok?: boolean;
  errors?: { author?: string; text?: string; consent?: string };
  formError?: string;
} | null;

const GENERIC = "Ceva n-a mers. Încearcă din nou peste un moment.";

const SUPPORT_COOKIE = "sustinere";

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

async function countSupporters(): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("supporters")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function supportInitiative(): Promise<SupportState> {
  try {
    const secret = process.env.AUTH_SECRET;
    const cookieStore = await cookies();

    // One click per visitor — a signed cookie, soft by design.
    if (secret) {
      const raw = cookieStore.get(SUPPORT_COOKIE)?.value;
      if (raw === `1.${sign("1", secret)}`) {
        return { ok: true, already: true, count: await countSupporters() };
      }
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("supporters").insert({});
    if (error) {
      console.error("supportInitiative failed:", error.message);
      return { error: GENERIC };
    }

    if (secret) {
      cookieStore.set(SUPPORT_COOKIE, `1.${sign("1", secret)}`, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    updateTag("supporters");
    return { ok: true, count: await countSupporters() };
  } catch (err) {
    console.error("supportInitiative failed:", err);
    return { error: GENERIC };
  }
}

export async function submitThought(
  _prev: ThoughtState,
  formData: FormData,
): Promise<ThoughtState> {
  try {
    // Honeypot — same trick as the idea form.
    const honeypot = String(formData.get("contact_notes") ?? "").trim();
    if (honeypot.length > 0) {
      return { ok: true }; // pretend success, store nothing
    }

    const author = String(formData.get("author") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    const url = String(formData.get("url") ?? "").trim();
    const consent = formData.get("consent") === "on";

    const errors: NonNullable<ThoughtState>["errors"] = {};
    if (!author) errors.author = "Te rog scrie numele tău.";
    if (author.length > 80) errors.author = "Numele e prea lung.";
    if (text.length < 10)
      errors.text = "Scrie măcar câteva cuvinte — două rânduri sunt de ajuns.";
    if (text.length > 600)
      errors.text = "Mesajul e prea lung (maxim 600 de caractere).";
    if (!consent)
      errors.consent =
        "Te rog bifează că ești de acord să apară public pe site.";
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from("testimonials").insert({
      author,
      text,
      url: url || null,
      published: false, // always moderated — appears only after Adelin approves
    });
    if (error) {
      console.error("submitThought failed:", error.message);
      return { formError: GENERIC };
    }

    return { ok: true };
  } catch (err) {
    console.error("submitThought failed:", err);
    return { formError: GENERIC };
  }
}
