import type { Metadata } from "next";
import ThoughtForm from "@/components/ThoughtForm";

export const metadata: Metadata = {
  title: "Spune o vorbă bună — RainbowApps",
  description:
    "Ai lucrat cu mine sau crezi în inițiativă? Scrie două rânduri — apar pe site după ce le citesc.",
  alternates: { canonical: "/sustine" },
};

export default async function SustinePage({
  searchParams,
}: {
  searchParams: Promise<{ donatie?: string }>;
}) {
  const { donatie } = await searchParams;

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        {donatie === "multumesc" && (
          <p
            role="status"
            className="mb-8 rounded-xl border border-line bg-surface p-5 leading-relaxed text-ink"
          >
            Mulțumesc pentru donație! ♥ Fiecare leu ține uneltele pornite
            pentru următoarea idee.
          </p>
        )}
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Spune o vorbă bună
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Ai lucrat cu mine, ți-a folosit ceva de aici, sau pur și simplu crezi
          în idee? Două rânduri de la tine cântăresc mult pentru următorul om
          care se întreabă dacă ideea lui „e destul de bună”.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Gândul tău apare pe site după ce îl citesc eu — de obicei în aceeași
          zi.
        </p>
        <div className="mt-10">
          <ThoughtForm />
        </div>
      </section>
    </main>
  );
}
