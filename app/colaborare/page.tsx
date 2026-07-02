import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cum colaborăm — RainbowApps",
  description:
    "Regulile colaborării, puține și simple: construirea e gratuită, stabilim împreună ce înseamnă „gata”, și totul rămâne al tău.",
  alternates: { canonical: "/colaborare" },
};

const REGULI = [
  {
    title: "Construirea e gratuită.",
    body: "De la ideea ta la o aplicație funcțională, nu mă plătești. Tu acoperi doar domeniul (~€10–15/an) și găzduirea (de regulă gratuită la început).",
  },
  {
    title: "Stabilim împreună ce înseamnă „gata”.",
    body: "Înainte să scriu orice linie de cod, definim în scris, în câteva propoziții, cum arată versiunea terminată. Ăsta e acordul nostru — eu construiesc până acolo.",
  },
  {
    title: "Totul e al tău.",
    body: "Ideea, codul, domeniul, conturile — pe numele tău, de la început. Dacă mâine nu mai vrei să lucrezi cu mine, pleci cu tot.",
  },
  {
    title: "După predare, aplicația e a ta.",
    body: "O poți duce mai departe singur, cu altcineva sau cu mine. Dacă vrei să continuăm — funcționalități noi, întreținere, ajutor — stabilim atunci, separat. E posibil ca partea asta să nu mai fie gratuită; construirea, da, întotdeauna.",
  },
  {
    title: "Un singur proiect o dată.",
    body: "Sunt un singur om, cu câteva ore pe săptămână. Dacă e coadă, îți spun sincer unde ești în ea.",
  },
  {
    title: "Răspund oricum.",
    body: "Chiar dacă nu pot construi ideea ta, primești un răspuns pe email. Nicio idee trimisă nu rămâne fără răspuns.",
  },
];

export default function ColaborarePage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-10 pb-20 sm:pt-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Cum colaborăm
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Ca să nu existe surprize, astea sunt regulile — puține și simple.
        </p>
        <div className="mt-10 space-y-8">
          {REGULI.map((regula) => (
            <section key={regula.title}>
              <h2 className="font-display text-xl font-semibold text-ink">
                {regula.title}
              </h2>
              <p className="mt-2 leading-relaxed text-ink-soft">
                {regula.body}
              </p>
            </section>
          ))}
        </div>
        <Link
          href="/trimite"
          className="btn-primary mt-12"
        >
          Spune-mi ideea ta
        </Link>
      </section>
    </main>
  );
}
