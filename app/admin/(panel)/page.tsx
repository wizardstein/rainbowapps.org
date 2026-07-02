import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import { getAvailability } from "@/lib/content";
import { STATUS } from "@/lib/site";
import ActionForm from "@/components/admin/ActionForm";
import { setAvailability } from "@/app/admin/actions";
import { STATUS_LABELS, STATUS_ORDER } from "@/app/admin/statuses";

export const dynamic = "force-dynamic";

type SubmissionRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  idea: string;
  status: string;
  attachment_path: string | null;
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter } = await searchParams;
  const availability = await getAvailability();

  const supabase = createServiceClient();
  let query = supabase
    .from("submissions")
    .select("id, created_at, name, email, idea, status, attachment_path")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter && STATUS_ORDER.includes(filter as never)) {
    query = query.eq("status", filter);
  }
  const { data, error } = await query;
  const submissions = (data ?? []) as SubmissionRow[];

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        Idei primite
      </h1>

      {/* Availability */}
      <section className="mt-6 rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Disponibilitate
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Se vede pe pagina principală în câteva secunde după salvare.
        </p>
        <ActionForm action={setAvailability} className="mt-4">
          <div className="flex flex-wrap items-center gap-6">
            {(["green", "amber"] as const).map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="availability"
                  value={value}
                  defaultChecked={availability === value}
                />
                {STATUS[value].label}
              </label>
            ))}
            <button
              type="submit"
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Salvează
            </button>
          </div>
        </ActionForm>
      </section>

      {/* Filter chips */}
      <nav aria-label="Filtru status" className="mt-8 flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin"
          className={`rounded-full border px-3 py-1 ${!filter ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-soft hover:border-ink/30"}`}
        >
          Toate
        </Link>
        {STATUS_ORDER.map((s) => (
          <Link
            key={s}
            href={`/admin?status=${s}`}
            className={`rounded-full border px-3 py-1 ${filter === s ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink-soft hover:border-ink/30"}`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </nav>

      {/* List */}
      {error ? (
        <p className="mt-8 text-ink-soft">
          Nu am putut încărca ideile. Reîncarcă pagina.
        </p>
      ) : submissions.length === 0 ? (
        <p className="mt-8 text-ink-soft">Nicio idee aici deocamdată.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {submissions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/idei/${s.id}`}
                className="block rounded-xl border border-line bg-surface p-5 transition-colors hover:border-ink/30"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display font-semibold text-ink">
                    {s.name}
                    {s.attachment_path && (
                      <span
                        className="ml-2 text-sm font-normal text-ink-soft"
                        title="Are schiță atașată"
                      >
                        📎
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {STATUS_LABELS[s.status] ?? s.status} ·{" "}
                    {new Date(s.created_at).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
                  {s.idea}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
