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
        <p className="mt-3 text-ink-soft">
          Nu știi de unde să începi?{" "}
          <Link
            href="/ghid"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Ghidul pas cu pas
          </Link>{" "}
          te plimbă prin cinci întrebări simple.
        </p>
        <div className="mt-10">
          <SubmissionForm />
        </div>
      </section>
    </main>
  );
}
