import "server-only";
import { Resend } from "resend";

export type SubmissionEmail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  idea: string;
  attachmentPath: string | null;
  uploadFailed: boolean;
};

export type TestimonialEmail = {
  id: string;
  author: string;
  text: string;
  url: string | null;
};

type EmailConfig = { resend: Resend; from: string; owner: string };

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getConfig(): EmailConfig | null {
  try {
    return {
      resend: new Resend(required("RESEND_API_KEY")),
      from: required("RESEND_FROM"),
      owner: required("OWNER_EMAIL"),
    };
  } catch (err) {
    console.error("Resend not configured, skipping email:", err);
    return null;
  }
}

function ownerText(s: SubmissionEmail): string {
  const lines = [`Nume: ${s.name}`, `Email: ${s.email}`];
  if (s.phone) lines.push(`Telefon: ${s.phone}`);
  lines.push("", "Idee:", s.idea, "");
  lines.push(
    s.attachmentPath
      ? `Schiță atașată: da — în Supabase Storage la ${s.attachmentPath}`
      : "Schiță atașată: nu",
  );
  if (s.uploadFailed) {
    lines.push(
      "Atenție: trimițătorul a atașat o schiță, dar încărcarea a eșuat.",
    );
  }
  lines.push("", `ID submisie: ${s.id}`);
  return lines.join("\n");
}

function submitterText(s: SubmissionEmail): string {
  return [
    `Salut ${s.name},`,
    "",
    "Mulțumesc că mi-ai trimis ideea ta. O să mă uit peste ea cu atenție și îți răspund pe email, indiferent dacă o pot construi sau nu.",
    "",
    "Toate cele bune,",
    "Adelin — RainbowApps",
  ].join("\n");
}

function testimonialText(t: TestimonialEmail): string {
  const lines = [`Nume: ${t.author}`];
  if (t.url) lines.push(`Link: ${t.url}`);
  lines.push("", "Gândul:", t.text, "");
  lines.push("Apare pe site abia după ce îl publici din /admin/testimoniale.");
  lines.push("", `ID testimonial: ${t.id}`);
  return lines.join("\n");
}

/** Sends one email; never throws. Returns true only on confirmed acceptance
 *  by Resend, so callers can record delivery and a cron can retry the rest. */
async function trySend(
  config: EmailConfig,
  label: string,
  payload: {
    to: string;
    replyTo?: string;
    subject: string;
    text: string;
  },
): Promise<boolean> {
  try {
    const { error } = await config.resend.emails.send({
      from: config.from,
      ...payload,
    });
    if (error) {
      console.error(`${label} failed:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`${label} threw:`, err);
    return false;
  }
}

/** A) Owner notification for a new idea. */
export async function sendOwnerSubmissionEmail(
  s: SubmissionEmail,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;
  return trySend(config, "Owner notification email", {
    to: config.owner,
    replyTo: s.email,
    subject: `Idee nouă pe RainbowApps — ${s.name}`,
    text: ownerText(s),
  });
}

/** B) Confirmation for the person who submitted the idea. */
export async function sendSubmitterConfirmationEmail(
  s: SubmissionEmail,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;
  return trySend(config, "Submitter confirmation email", {
    to: s.email,
    replyTo: config.owner,
    subject: "Am primit ideea ta — RainbowApps",
    text: submitterText(s),
  });
}

/** Owner notification for a new testimonial ("gând") awaiting moderation. */
export async function sendOwnerTestimonialEmail(
  t: TestimonialEmail,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;
  return trySend(config, "Testimonial notification email", {
    to: config.owner,
    subject: `Gând nou pe RainbowApps — ${t.author}`,
    text: testimonialText(t),
  });
}

/**
 * Send both transactional emails for a new submission. Failure-tolerant by
 * contract: the submission row is already saved, so this never throws — it
 * reports which emails went out so the caller can mark them delivered (the
 * unsent ones get retried by the daily cron).
 */
export async function sendSubmissionEmails(
  s: SubmissionEmail,
): Promise<{ ownerSent: boolean; submitterSent: boolean }> {
  // Both emails in parallel — independent, and failures only get logged.
  const [ownerSent, submitterSent] = await Promise.all([
    sendOwnerSubmissionEmail(s),
    sendSubmitterConfirmationEmail(s),
  ]);
  return { ownerSent, submitterSent };
}
