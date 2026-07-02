import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confidențialitate — RainbowApps",
  description:
    "Ce se întâmplă cu datele pe care mi le trimiți: le folosesc doar ca să citesc ideea ta și să te contactez. Atât.",
  alternates: { canonical: "/confidentialitate" },
};

const SECTIONS = [
  {
    title: "Cine sunt",
    body: "Adelin Cavași, prin Rainbow Engineering SRL, Cluj-Napoca. Eu sunt „operatorul de date” — adică cel responsabil de ce mi-ai trimis. Îmi poți scrie oricând la adelin.cavasi@gmail.com.",
  },
  {
    title: "Ce colectez",
    body: "Doar ce completezi în formular: numele, emailul, telefonul (dacă îl lași), textul ideii și schița atașată (dacă e). Site-ul nu folosește cookies, nu are analytics și nu te urmărește în niciun fel.",
  },
  {
    title: "De ce",
    body: "Ca să citesc ideea și să îți răspund. Temeiul legal e consimțământul tău — bifa de la finalul formularului. Nu folosesc datele pentru nimic altceva: fără marketing, fără newsletter, fără vânzare către terți.",
  },
  {
    title: "Unde stau datele",
    body: "În baza mea de date la Supabase (servere în Uniunea Europeană) și în emailurile trimise prin Resend (servere în UE). Site-ul e găzduit de Vercel.",
  },
  {
    title: "Cât le păstrez",
    body: "Cât timp lucrăm la idee sau cât e nevoie să îți răspund. Dacă vrei să le șterg, scrie-mi și le șterg — simplu.",
  },
  {
    title: "Drepturile tale",
    body: "Poți oricând să îmi ceri să îți arăt ce date am despre tine, să le corectez sau să le șterg, și îți poți retrage consimțământul. Dacă ceva nu ți se pare în regulă, te poți plânge la ANSPDCP (dataprotection.ro) — dar sper să-mi scrii mie întâi.",
  },
];

export default function ConfidentialitatePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Confidențialitate
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Pe scurt: îmi trimiți o idee, eu o citesc și te contactez despre ea.
          Atât fac cu datele tale. Mai jos, aceleași lucruri spuse complet.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl font-semibold text-ink">
                {section.title}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-soft">
                {section.body}
              </p>
            </section>
          ))}
        </div>
        <Link
          href="/"
          className="mt-12 inline-flex items-center justify-center rounded-lg border border-line bg-surface px-6 py-3 text-base font-medium text-ink transition-colors hover:border-ink/30"
        >
          Înapoi la pagina principală
        </Link>
      </section>
    </main>
  );
}
