import { createServiceClient } from "@/lib/supabase";
import ActionForm from "@/components/admin/ActionForm";
import SortableList from "@/components/admin/SortableList";
import {
  saveTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

type TestimonialRow = {
  id: string;
  author: string;
  text: string;
  url: string | null;
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

function excerpt(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > 90 ? `${flat.slice(0, 90)}…` : flat;
}

export default async function AdminTestimoniale() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, author, text, url, published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const testimonials = (data ?? []) as TestimonialRow[];

  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
        Testimoniale
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Ordinea de aici e ordinea de pe bandă. Trage un testimonial de mâner ca
        să-l muți; se salvează singur. Cele trimise de pe site apar sus,
        nepublicate, până le muți. Banda apare pe pagina principală doar când
        există cel puțin unul publicat.
      </p>

      <SortableList
        onReorder={reorderTestimonials}
        rows={testimonials.map((t) => ({
          id: t.id,
          title: t.author,
          meta: excerpt(t.text),
          published: t.published,
          body: (
            <>
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
            </>
          ),
        }))}
      />

      <section className="mt-8 rounded-xl border border-dashed border-line p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Adaugă un testimonial
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Apare la finalul listei; îl muți apoi unde vrei.
        </p>
        <ActionForm action={saveTestimonial} className="mt-4">
          <TestimonialFields />
        </ActionForm>
      </section>
    </>
  );
}
