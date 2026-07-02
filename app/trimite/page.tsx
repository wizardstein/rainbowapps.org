import type { Metadata } from "next";
import Link from "next/link";
import SubmissionForm from "@/components/SubmissionForm";

export const metadata: Metadata = {
  title: "Trimite-mi ideea ta — RainbowApps",
  description:
    "Nu trebuie să fie tehnic și nu trebuie să fie perfect. Scrie-mi pur și simplu ce ai în cap.",
  alternates: { canonical: "/trimite" },
};

export default function TrimitePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Trimite-mi ideea ta
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Nu trebuie să fie tehnic și nu trebuie să fie perfect. Scrie-mi pur
          și simplu ce ai în cap.
        </p>
        <div className="mt-6 rounded-xl border border-line bg-surface p-5">
          <p className="font-display text-lg font-semibold text-ink">
            Nu știi de unde să începi?
          </p>
          <p className="mt-1 leading-relaxed text-ink-soft">
            Ghidul pas cu pas te plimbă prin cinci întrebări simple și îți
            aduce răspunsurile direct aici, în formular.
          </p>
          <Link
            href="/ghid"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-ink/25 bg-bg px-5 py-2.5 font-medium text-ink transition-colors hover:border-ink/50"
          >
            Deschide ghidul →
          </Link>
        </div>
        <div className="mt-10">
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
