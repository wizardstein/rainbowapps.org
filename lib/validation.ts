import { z } from "zod";

// Shared by the client form and the server action — one source of truth.

export const IDEA_MIN = 20;
export const NAME_MAX = 120;
export const EMAIL_MAX = 254;
export const IDEA_MAX = 5000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic", // iPhone photos
  "image/heif",
  "application/pdf",
];
// Derived, so the file picker can never offer a type validation rejects.
export const ACCEPT_ATTR = ACCEPTED_FILE_TYPES.join(",");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Te rog scrie numele tău.")
    .max(NAME_MAX, "Numele e prea lung (maxim 120 de caractere)."),
  email: z
    .string()
    .trim()
    .min(1, "Te rog scrie adresa ta de email.")
    .max(EMAIL_MAX, "Adresa de email e prea lungă.")
    .refine((v) => EMAIL_RE.test(v), "Adresa de email nu pare validă."),
  phone: z
    .string()
    .trim()
    .max(40, "Numărul de telefon e prea lung.")
    .optional()
    .default(""),
  idea: z
    .string()
    .trim()
    .min(IDEA_MIN, "Te rog scrie câteva cuvinte despre idee.")
    .max(IDEA_MAX, "Ideea e prea lungă (maxim 5.000 de caractere)."),
  consent: z
    .boolean()
    .refine((v) => v === true, "Te rog bifează că ești de acord să te contactez."),
});

export type SubmissionInput = z.input<typeof submissionSchema>;
export type SubmissionValues = z.output<typeof submissionSchema>;

export type FieldKey =
  | "name"
  | "email"
  | "phone"
  | "idea"
  | "consent"
  | "attachment";

export type FieldErrors = Partial<Record<FieldKey, string>>;

/** A file-like with just what we need — works for both browser File and
 *  the File that Next gives us from FormData on the server. */
type FileLike = { size: number; type: string };

/** Validate the optional attachment. Returns an error message or null. */
export function validateFile(file: FileLike | null | undefined): string | null {
  if (!file || file.size === 0) return null; // optional
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "Pot primi doar imagini sau PDF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Fișierul e prea mare (max 5 MB).";
  }
  return null;
}

/** Validate the whole submission. Used identically on client and server. */
export function validateSubmission(
  input: unknown,
  file: FileLike | null | undefined,
): { errors: FieldErrors; data?: SubmissionValues } {
  const errors: FieldErrors = {};

  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
  }

  const fileError = validateFile(file);
  if (fileError) errors.attachment = fileError;

  return {
    errors,
    data: parsed.success && !errors.attachment ? parsed.data : undefined,
  };
}
