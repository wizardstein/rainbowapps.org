import { createServiceClient } from "@/lib/supabase";
import ActionForm from "@/components/admin/ActionForm";
import { saveTestimonial, deleteTestimonial } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type TestimonialRow = {
  id: string;
  author: string;
  text: string;
  url: string | null;
  sort_order: number;
  published: boolean;
};

function TestimonialFields({ t }: { t?: TestimonialRow }) {
  return (
    <div className="flex flex-col gap-3">
      {t && <input type="hidden" name="id" value={t.id} />}
      <label className="flex flex-col gap-1 text-sm">
        Nume (cine spune)
        <input
          name="author"
          defaultValue={t?.author ?? ""}
          required
          className="rounded-lg border border-line bg-bg px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Text
        <textarea
          name="text"
          defaultValue={t?.text ?? ""}
          required
          rows={3}
          className="rounded-lg border border-line bg-bg px-3 py-2 leading-relaxed"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Link către aplicația lor (opțional)
        <input
          name="url"
          type="url"
          defaultValue={t?.url ?? ""}
          className="rounded-lg border border-line bg-bg px-3 py-2"
        />
      </label>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm">
          Ordine
          <input
            name="sort_order"
            type="number"
            defaultValue={t?.sort_order ?? 0}
            className="w-20 rounded-lg border border-line bg-bg px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="published"
            type="checkbox"
            defaultChecked={t?.published ?? false}
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

export default async function AdminTestimoniale() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, author, text, url, sort_order, published")
    .order("sort_order", { ascending: true });
  const testimonials = (data ?? []) as TestimonialRow[];

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        Testimoniale
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Secțiunea „Ce spun oamenii” apare pe pagina principală doar când există
        cel puțin un testimonial publicat.
      </p>

      <ul className="mt-6 space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="rounded-xl border border-line bg-surface p-6">
            <ActionForm action={saveTestimonial}>
              <TestimonialFields t={t} />
            </ActionForm>
            <ActionForm action={deleteTestimonial} className="mt-3">
              <input type="hidden" name="id" value={t.id} />
              <button
                type="submit"
                className="text-sm text-red-700 underline decoration-line underline-offset-4"
              >
                Șterge testimonialul
              </button>
            </ActionForm>
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border border-dashed border-line p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Adaugă un testimonial
        </h2>
        <ActionForm action={saveTestimonial} className="mt-4">
          <TestimonialFields />
        </ActionForm>
      </section>
    </>
  );
}
