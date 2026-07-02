"use client";

import { useActionState } from "react";
import { submitThought } from "@/app/sustine/actions";

const inputBase =
  "mt-2 w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-soft/70";

/** Public testimonial form. Everything lands unpublished — Adelin reads and
 *  publishes from /admin, so nothing appears on the site unmoderated. */
export default function ThoughtForm() {
  const [state, formAction, pending] = useActionState(submitThought, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-xl border border-line bg-surface p-6 leading-relaxed text-ink">
        Mulțumesc! Am primit gândul tău — îl citesc și apare pe site în cel
        mai scurt timp.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state?.formError && (
        <p role="alert" className="text-sm text-[#a23a30]">
          {state.formError}
        </p>
      )}

      <div>
        <label htmlFor="author" className="font-medium text-ink">
          Numele tău
        </label>
        <input
          id="author"
          name="author"
          type="text"
          maxLength={80}
          required
          className={inputBase}
        />
        {state?.errors?.author && (
          <p className="mt-1.5 text-sm text-[#a23a30]">{state.errors.author}</p>
        )}
      </div>

      <div>
        <label htmlFor="text" className="font-medium text-ink">
          Gândul tău
        </label>
        <textarea
          id="text"
          name="text"
          rows={4}
          maxLength={600}
          required
          placeholder="Două rânduri sunt de ajuns. Ce ți-a plăcut, ce ți-a folosit, de ce crezi în idee."
          className={`${inputBase} resize-y`}
        />
        {state?.errors?.text && (
          <p className="mt-1.5 text-sm text-[#a23a30]">{state.errors.text}</p>
        )}
      </div>

      <div>
        <label htmlFor="url" className="font-medium text-ink">
          Link (opțional)
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="De exemplu, aplicația construită împreună"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="thought-consent" className="flex items-start gap-3">
          <input
            id="thought-consent"
            name="consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-line accent-ink"
          />
          <span className="text-ink-soft">
            Sunt de acord ca numele și mesajul meu să apară public pe site.
          </span>
        </label>
        {state?.errors?.consent && (
          <p className="mt-1.5 text-sm text-[#a23a30]">
            {state.errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from people and assistive tech. Must stay empty. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="thought-notes">Note de contact</label>
        <input
          id="thought-notes"
          name="contact_notes"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary disabled:opacity-60"
      >
        {pending ? "Se trimite…" : "Trimite gândul"}
      </button>
    </form>
  );
}
