"use client";

import { useState } from "react";
import { submitIdea } from "@/app/trimite/actions";
import {
  ACCEPT_ATTR,
  EMAIL_MAX,
  IDEA_MAX,
  NAME_MAX,
  validateSubmission,
  type FieldErrors,
} from "@/lib/validation";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-[#a23a30]">
      {message}
    </p>
  );
}

const inputBase =
  "mt-2 w-full rounded-lg border bg-surface px-4 py-2.5 text-ink placeholder:text-ink-soft/70";

export default function SubmissionForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const input = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      idea: String(fd.get("idea") ?? ""),
      consent: fd.get("consent") === "on",
    };
    const fileEntry = fd.get("attachment");
    const file =
      fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;

    const { errors: clientErrors } = validateSubmission(input, file);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstKey = Object.keys(clientErrors)[0];
      form
        .querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    setErrors({});
    setFormError(undefined);
    setSubmitting(true);
    try {
      const result = await submitIdea(fd);
      // On success the server action redirects; we only land here on error.
      if (result?.errors) {
        setErrors(result.errors);
        const firstKey = Object.keys(result.errors)[0];
        form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      }
      if (result?.formError) {
        setFormError(result.formError);
      }
    } catch (err) {
      // redirect() in the action throws NEXT_REDIRECT — let Next handle it.
      if (
        err instanceof Error &&
        "digest" in err &&
        typeof err.digest === "string" &&
        err.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setFormError(
        "Ceva n-a mers la trimitere. Te rog încearcă din nou peste un moment.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const borderFor = (key: keyof FieldErrors) =>
    errors[key] ? "border-[#a23a30]" : "border-line";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <p
          role="alert"
          className="rounded-lg border border-[#a23a30]/30 bg-[#a23a30]/5 px-4 py-3 text-sm text-[#a23a30]"
        >
          {formError}
        </p>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="font-medium text-ink">
          Numele tău
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX}
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`${inputBase} ${borderFor("name")}`}
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={EMAIL_MAX}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`${inputBase} ${borderFor("email")}`}
        />
        <FieldError id="email-error" message={errors.email} />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="font-medium text-ink">
          Telefon (opțional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={`${inputBase} ${borderFor("phone")}`}
        />
        <FieldError id="phone-error" message={errors.phone} />
      </div>

      {/* Idea */}
      <div>
        <label htmlFor="idea" className="font-medium text-ink">
          Spune-mi ideea ta
        </label>
        <textarea
          id="idea"
          name="idea"
          rows={6}
          maxLength={IDEA_MAX}
          required
          placeholder="Ce vrei să construiești? Cui ar ajuta? Nu trebuie să fie tehnic — scrie cum îți vine."
          aria-invalid={errors.idea ? true : undefined}
          aria-describedby={errors.idea ? "idea-error" : undefined}
          className={`${inputBase} ${borderFor("idea")} resize-y`}
        />
        <FieldError id="idea-error" message={errors.idea} />
      </div>

      {/* Attachment */}
      <div>
        <label htmlFor="attachment" className="font-medium text-ink">
          Atașează o schiță sau imagine (opțional)
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept={ACCEPT_ATTR}
          aria-invalid={errors.attachment ? true : undefined}
          aria-describedby={
            errors.attachment ? "attachment-error" : undefined
          }
          className={`${inputBase} ${borderFor("attachment")} file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-bg`}
        />
        <FieldError id="attachment-error" message={errors.attachment} />
      </div>

      {/* Consent */}
      <div>
        <label htmlFor="consent" className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-1 size-4 shrink-0 rounded border-line accent-ink"
          />
          <span className="text-ink-soft">
            Sunt de acord să fiu contactat pe email în legătură cu ideea mea.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      {/* Honeypot — hidden from people and assistive tech. Must stay empty. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact_notes">Note de contact</label>
        <input
          id="contact_notes"
          name="contact_notes"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Se trimite…" : "Trimite ideea"}
      </button>
    </form>
  );
}
