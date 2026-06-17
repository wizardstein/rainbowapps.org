"use server";

import { redirect } from "next/navigation";
import { validateSubmission, type FieldErrors } from "@/lib/validation";

export type SubmitState = { errors: FieldErrors } | null;

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

  // M5: upload optional file to Storage + insert the submissions row here.
  // M6: send the two Resend emails here (failure-tolerant).

  redirect("/multumesc");
}
