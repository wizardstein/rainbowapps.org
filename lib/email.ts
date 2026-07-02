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

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
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

/**
 * Send both transactional emails. Failure-tolerant by contract: the
 * submission row is already saved, so this never throws — it only logs.
 * Each email is attempted independently.
 */
export async function sendSubmissionEmails(s: SubmissionEmail): Promise<void> {
  let resend: Resend;
  let from: string;
  let owner: string;
  try {
    resend = new Resend(required("RESEND_API_KEY"));
    from = required("RESEND_FROM");
    owner = required("OWNER_EMAIL");
  } catch (err) {
    console.error("Resend not configured, skipping emails:", err);
    return;
  }

  // Both emails in parallel — independent, and failures only get logged.
  const [ownerResult, submitterResult] = await Promise.allSettled([
    // A) Owner notification
    resend.emails.send({
      from,
      to: owner,
      replyTo: s.email,
      subject: `Idee nouă pe RainbowApps — ${s.name}`,
      text: ownerText(s),
    }),
    // B) Submitter confirmation
    resend.emails.send({
      from,
      to: s.email,
      replyTo: owner,
      subject: "Am primit ideea ta — RainbowApps",
      text: submitterText(s),
    }),
  ]);

  if (ownerResult.status === "rejected") {
    console.error("Owner notification email threw:", ownerResult.reason);
  } else if (ownerResult.value.error) {
    console.error("Owner notification email failed:", ownerResult.value.error);
  }

  if (submitterResult.status === "rejected") {
    console.error("Submitter confirmation email threw:", submitterResult.reason);
  } else if (submitterResult.value.error) {
    console.error(
      "Submitter confirmation email failed:",
      submitterResult.value.error,
    );
  }
}
