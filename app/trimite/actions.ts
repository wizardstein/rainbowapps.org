"use server";

import { redirect } from "next/navigation";
import { createServiceClient, SKETCHES_BUCKET } from "@/lib/supabase";
import { sendSubmissionEmails } from "@/lib/email";
import { validateSubmission, type FieldErrors } from "@/lib/validation";

export type SubmitState = {
  errors?: FieldErrors;
  formError?: string;
} | null;

const GENERIC_ERROR =
  "Ceva n-a mers la trimitere. Te rog încearcă din nou peste un moment.";

function storagePath(uuid: string, fileName: string): string {
  const safe =
    fileName.replace(/[^\w.\-]+/g, "_").slice(-100).replace(/^_+/, "") ||
    "fisier";
  return `submissions/${uuid}/${safe}`;
}

export async function submitIdea(formData: FormData): Promise<SubmitState> {
  // Honeypot: a bot fills this hidden field. Pretend success, do nothing.
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot.length > 0) {
    redirect("/multumesc");
  }

  const input = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    idea: String(formData.get("idea") ?? ""),
    consent: formData.get("consent") === "on",
  };

  const fileEntry = formData.get("attachment");
  const file =
    fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

  // Re-validate everything server-side — never trust the client.
  const { errors, data } = validateSubmission(input, file);
  if (!data) {
    return { errors };
  }

  try {
    const supabase = createServiceClient();
    const id = crypto.randomUUID();

    // Optional sketch upload. A failed upload must NOT lose the submission —
    // log it and save the idea without the attachment.
    let attachmentPath: string | null = null;
    if (file) {
      const path = storagePath(id, file.name);
      const { error: uploadError } = await supabase.storage
        .from(SKETCHES_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) {
        console.error("Sketch upload failed:", uploadError.message);
      } else {
        attachmentPath = path;
      }
    }

    const { error: insertError } = await supabase.from("submissions").insert({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone ? data.phone : null,
      idea: data.idea,
      attachment_path: attachmentPath,
    });

    if (insertError) {
      console.error("Submission insert failed:", insertError.message);
      return { formError: GENERIC_ERROR };
    }

    // Emails are best-effort: the submission is already saved, so a Resend
    // failure is logged but never fails the request.
    await sendSubmissionEmails({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone ? data.phone : null,
      idea: data.idea,
      attachmentPath,
    });
  } catch (err) {
    console.error("Unexpected error saving submission:", err);
    return { formError: GENERIC_ERROR };
  }

  redirect("/multumesc");
}
