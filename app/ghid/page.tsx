import type { Metadata } from "next";
import GhidWizard from "@/components/GhidWizard";

export const metadata: Metadata = {
  title: "Structurează-ți ideea, pas cu pas — RainbowApps",
  description:
    "Cinci întrebări simple care transformă „am o idee vagă” în „uite exact ce vreau”. Fără termeni tehnici, fără presiune.",
  alternates: { canonical: "/ghid" },
};

export default function GhidPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Structurează-ți ideea, pas cu pas
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Cinci întrebări scurte. Răspunde cum îți vine — la final, le pun eu
          cap la cap și le torn direct în formular.
        </p>

        <GhidWizard />

        <p className="mt-16 border-t border-line pt-6 text-sm leading-relaxed text-ink-soft">
          Ghidul e o adaptare liberă, pe scurt și în cuvintele mele, a metodei
          Foundation Sprint din cartea{" "}
          <a
            href="https://www.theclickbook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line underline-offset-4 hover:text-ink"
          >
            Click
          </a>{" "}
          de Jake Knapp și John Zeratsky. Dacă ideea ta prinde rădăcini, cartea
          merită citită pe îndelete.
        </p>
      </section>
    </main>
  );
}
