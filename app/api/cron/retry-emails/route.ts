import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import {
  sendOwnerSubmissionEmail,
  sendSubmitterConfirmationEmail,
  sendOwnerTestimonialEmail,
} from "@/lib/email";

// Daily retry for notification emails that failed at submit time (see
// vercel.json crons). Rows record delivery in *_notified_at; anything
// unstamped gets re-sent here and stamped on success.

export const dynamic = "force-dynamic";

// Stop retrying after two weeks — by then a duplicate would confuse more
// than help, and the row is still visible in /admin.
const RETRY_WINDOW_DAYS = 14;
// Skip rows younger than this: their submit request may still be in flight.
const IN_FLIGHT_GRACE_MINUTES = 15;
// Resend allows ~2 requests/second; sends run sequentially with a pause.
const PAUSE_MS = 600;
const BATCH_LIMIT = 50;

const pause = () => new Promise((r) => setTimeout(r, PAUSE_MS));

type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  idea: string;
  attachment_path: string | null;
  upload_failed: boolean;
  owner_notified_at: string | null;
  submitter_notified_at: string | null;
};

type TestimonialRow = {
  id: string;
  author: string;
  text: string;
  url: string | null;
};

export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically
  // when the env var is set. Nobody else gets to trigger sends.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();
  const now = Date.now();
  const oldest = new Date(
    now - RETRY_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();
  const newest = new Date(
    now - IN_FLIGHT_GRACE_MINUTES * 60 * 1000,
  ).toISOString();

  let sent = 0;
  let failed = 0;

  // ── Submissions with at least one undelivered email ──────────────────────
  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select(
      "id, name, email, phone, idea, attachment_path, upload_failed, owner_notified_at, submitter_notified_at",
    )
    .or("owner_notified_at.is.null,submitter_notified_at.is.null")
    .gte("created_at", oldest)
    .lte("created_at", newest)
    .order("created_at", { ascending: true })
    .limit(BATCH_LIMIT);
  if (subError) {
    console.error("retry-emails: submissions query failed:", subError.message);
  }

  for (const row of (submissions ?? []) as SubmissionRow[]) {
    const email = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      idea: row.idea,
      attachmentPath: row.attachment_path,
      uploadFailed: row.upload_failed,
    };
    const delivered: Record<string, string> = {};

    if (!row.owner_notified_at) {
      if (await sendOwnerSubmissionEmail(email)) {
        delivered.owner_notified_at = new Date().toISOString();
        sent++;
      } else {
        failed++;
      }
      await pause();
    }
    if (!row.submitter_notified_at) {
      if (await sendSubmitterConfirmationEmail(email)) {
        delivered.submitter_notified_at = new Date().toISOString();
        sent++;
      } else {
        failed++;
      }
      await pause();
    }

    if (Object.keys(delivered).length > 0) {
      const { error: markError } = await supabase
        .from("submissions")
        .update(delivered)
        .eq("id", row.id);
      if (markError) {
        console.error(
          `retry-emails: failed to mark submission ${row.id}:`,
          markError.message,
        );
      }
    }
  }

  // ── Testimonials with an undelivered owner notification ──────────────────
  const { data: testimonials, error: tesError } = await supabase
    .from("testimonials")
    .select("id, author, text, url")
    .is("owner_notified_at", null)
    .gte("created_at", oldest)
    .lte("created_at", newest)
    .order("created_at", { ascending: true })
    .limit(BATCH_LIMIT);
  if (tesError) {
    console.error(
      "retry-emails: testimonials query failed:",
      tesError.message,
    );
  }

  for (const row of (testimonials ?? []) as TestimonialRow[]) {
    if (await sendOwnerTestimonialEmail(row)) {
      sent++;
      const { error: markError } = await supabase
        .from("testimonials")
        .update({ owner_notified_at: new Date().toISOString() })
        .eq("id", row.id);
      if (markError) {
        console.error(
          `retry-emails: failed to mark testimonial ${row.id}:`,
          markError.message,
        );
      }
    } else {
      failed++;
    }
    await pause();
  }

  if (sent > 0 || failed > 0) {
    console.log(`retry-emails: re-sent ${sent}, still failing ${failed}`);
  }
  return NextResponse.json({ sent, failed });
}
