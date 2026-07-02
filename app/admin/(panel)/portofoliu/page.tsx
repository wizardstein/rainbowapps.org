import { createServiceClient } from "@/lib/supabase";
import ActionForm from "@/components/admin/ActionForm";
import { saveProject, deleteProject } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  url: string;
  sort_order: number;
  published: boolean;
};

function ProjectFields({ p }: { p?: ProjectRow }) {
  return (
    <div className="flex flex-col gap-3">
      {p && <input type="hidden" name="id" value={p.id} />}
      <label className="flex flex-col gap-1 text-sm">
        Titlu
        <input
          name="title"
          defaultValue={p?.title ?? ""}
          required
          className="rounded-lg border border-line bg-bg px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Descriere (o propoziție)
        <textarea
          name="description"
          defaultValue={p?.description ?? ""}
          required
          rows={2}
          className="rounded-lg border border-line bg-bg px-3 py-2 leading-relaxed"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Adresă (URL)
        <input
          name="url"
          type="url"
          defaultValue={p?.url ?? ""}
          required
          className="rounded-lg border border-line bg-bg px-3 py-2"
        />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm">
          Ordine
          <input
            name="sort_order"
            type="number"
            defaultValue={p?.sort_order ?? 0}
            className="w-20 rounded-lg border border-line bg-bg px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="published"
            type="checkbox"
            defaultChecked={p?.published ?? true}
          />
          Publicat
        </label>
        <button
          type="submit"
          className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Salvează
        </button>
      </div>
    </div>
  );
}

export default async function AdminPortofoliu() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("projects")
    .select("id, title, description, url, sort_order, published")
    .order("sort_order", { ascending: true });
  const projects = (data ?? []) as ProjectRow[];

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        Portofoliu
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Cardurile publicate apar pe pagina principală în câteva secunde.
      </p>

      <ul className="mt-6 space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="rounded-xl border border-line bg-surface p-6">
            <ActionForm action={saveProject}>
              <ProjectFields p={p} />
            </ActionForm>
            <ActionForm action={deleteProject} className="mt-3">
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="text-sm text-red-700 underline decoration-line underline-offset-4"
              >
                Șterge cardul
              </button>
            </ActionForm>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border border-dashed border-line p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Adaugă un proiect
        </h2>
        <ActionForm action={saveProject} className="mt-4">
          <ProjectFields />
        </ActionForm>
      </section>
    </>
  );
}
