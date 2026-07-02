import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceClient, SKETCHES_BUCKET } from "@/lib/supabase";
import ActionForm from "@/components/admin/ActionForm";
import { updateSubmission } from "@/app/admin/actions";
import { STATUS_LABELS, STATUS_ORDER } from "@/app/admin/statuses";

export const dynamic = "force-dynamic";

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: s, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !s) notFound();

  let sketchUrl: string | null = null;
  if (s.attachment_path) {
    const { data: signed } = await supabase.storage
      .from(SKETCHES_BUCKET)
      .createSignedUrl(s.attachment_path, 3600);
    sketchUrl = signed?.signedUrl ?? null;
  }

  return (
    <>
      <Link
        href="/admin"
        className="text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
      >
        ← Înapoi la listă
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
        {s.name}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        <a href={`mailto:${s.email}`} className="underline underline-offset-4">
          {s.email}
        </a>
        {s.phone && <> · {s.phone}</>}
        {" · "}
        {new Date(s.created_at).toLocaleString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Ideea</h2>
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink-soft">
          {s.idea}
        </p>
        {s.attachment_path &&
          (sketchUrl ? (
            <p className="mt-4">
              <a
                href={sketchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline underline-offset-4"
              >
                Deschide schița atașată ↗
              </a>{" "}
              <span className="text-sm text-ink-soft">
                (linkul expiră într-o oră)
              </span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-ink-soft">
              Are o schiță atașată, dar nu am putut genera linkul — încearcă
              din Supabase Storage.
            </p>
          ))}
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Status și notițe
        </h2>
        <ActionForm action={updateSubmission} className="mt-4">
          <input type="hidden" name="id" value={s.id} />
          <div className="flex flex-col gap-4">
            <label className="flex flex-wrap items-center gap-3 text-sm">
              Status:
              <select
                name="status"
                defaultValue={s.status}
                className="rounded-lg border border-line bg-bg px-3 py-2"
              >
                {STATUS_ORDER.map((value) => (
                  <option key={value} value={value}>
                    {STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Notițe private (doar tu le vezi):
              <textarea
                name="notes"
                defaultValue={s.notes ?? ""}
                rows={4}
                className="rounded-lg border border-line bg-bg px-3 py-2 leading-relaxed"
              />
            </label>
            <div>
              <button
                type="submit"
                className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                Salvează
              </button>
            </div>
          </div>
        </ActionForm>
      </section>
    </>
  );
}
