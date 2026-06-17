import type { Metadata } from "next";
import Link from "next/link";
import SubmissionForm from "@/components/SubmissionForm";

export const metadata: Metadata = {
  title: "Trimite-mi ideea ta — RainbowApps",
  description:
    "Nu trebuie să fie tehnic și nu trebuie să fie perfect. Scrie-mi pur și simplu ce ai în cap.",
};

export default function TrimitePage() {
  return (
    <>
      <header className="mx-auto w-full max-w-5xl px-6 py-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ink"
        >
          RainbowApps
        </Link>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Trimite-mi ideea ta
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Nu trebuie să fie tehnic și nu trebuie să fie perfect. Scrie-mi pur
            și simplu ce ai în cap.
          </p>
          <div className="mt-10">
            <SubmissionForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm leading-relaxed text-ink-soft">
          <p className="max-w-2xl">
            Datele pe care le trimiți sunt folosite doar ca să te pot contacta
            despre ideea ta. Nu le dau nimănui.
          </p>
        </div>
      </footer>
    </>
  );
}
