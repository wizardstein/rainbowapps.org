import type { Metadata } from "next";
import IdeaBand from "@/components/IdeaBand";

export const metadata: Metadata = {
  title: "Despre mine — RainbowApps",
  description:
    "Sunt Adelin, programator din Cluj. De la primul calculator, la 4 ani, la aplicații pentru oameni cu idei bune.",
  alternates: { canonical: "/despre" },
};

// The story, reached only from the header (owner redesign, 2026-11-06: not on
// the homepage, and no public photo). One spectrum node per moment, ink for
// today — the one place the rainbow repeats.
const MOMENTE = [
  { cand: "la 4 ani", ce: "Primul meu calculator.", culoare: "#E2574C" },
  { cand: "la 10 ani", ce: "Primul calculator reparat pe bani. Cinci lei.", culoare: "#F0933D" },
  { cand: "la 17 ani", ce: "Anunț în ziar: repar orice calculator, la domiciliu.", culoare: "#EFC23F" },
  { cand: "2008", ce: "Primul job: depanator de calculatoare, apoi de case de marcat.", culoare: "#55A45E" },
  { cand: "2009", ce: "Primul meu program — scris ca să ușureze munca într-o firmă mică.", culoare: "#3FA39B" },
  { cand: "2012", ce: "M-am mutat la Cluj, în software. Am învățat să programez singur, din nevoie.", culoare: "#4E7FD0" },
  { cand: "anii de după", ce: "Automatizare de teste, proiecte internaționale, echipe conduse.", culoare: "#8B66C6" },
  { cand: "azi", ce: "Construiesc aplicații pentru oameni cu idei bune.", culoare: "#15141A" },
];

const PARAGRAF = "text-lg leading-[1.65] text-ink-soft text-pretty sm:text-[19px]";

export default function DesprePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-14 px-4 pt-14 pb-20 sm:px-8 sm:pt-[72px] sm:pb-24">
        <div className="flex max-w-[860px] flex-col gap-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Despre mine
          </p>
          <h1 className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink text-balance">
            Sunt Adelin. Construiesc lucruri care ajută oameni.
          </h1>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-[72px]">
          <div className="flex flex-col gap-5">
            <p className={PARAGRAF}>
              Calculatoarele m-au fascinat de mic. Am avut primul PC la 4 ani,
              iar la 10 am reparat primul calculator „pe bani” — cinci lei. Am
              și stricat unul între timp (am formatat un hard disk fără backup),
              dar cam așa se învață.
            </p>
            <p className={PARAGRAF}>
              De atunci, drumul a trecut prin service-uri de calculatoare și
              case de marcat, apoi prin testare de software, automatizări și
              echipe conduse în companii mari. Să programez am învățat singur,
              din nevoie: întâi ca să-mi ușurez munca, apoi pentru că nu m-am
              mai putut opri.
            </p>
            <p className={PARAGRAF}>
              Am urcat și pe scara corporate, destul cât să înțeleg că nu acolo
              mi-e locul. Cel mai fericit sunt când construiesc ceva care ajută
              pe cineva. Așa a apărut RainbowApps.
            </p>
            <p className={PARAGRAF}>
              M-au inspirat profesorii care predau gratis și oamenii care
              construiesc open source. Și știu exact cum e: am și eu idei care
              stau în sertar fiindcă nu am cunoștințele să le construiesc
              singur. Nu vreau ca ideea ta să rămână acolo.
            </p>
          </div>

          <div className="flex flex-col gap-5 rounded-[24px] border border-line bg-surface p-7 sm:p-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Drumul meu
            </h2>
            <ol className="flex flex-col">
              {MOMENTE.map((moment, i) => (
                <li key={moment.cand} className="grid grid-cols-[22px_minmax(0,1fr)] gap-3.5">
                  <span aria-hidden="true" className="flex flex-col items-center">
                    <span
                      className="mt-[5px] size-3.5 rounded-[5px]"
                      style={{ background: moment.culoare }}
                    />
                    {i < MOMENTE.length - 1 && (
                      <span className="min-h-[18px] w-0.5 flex-1 bg-line" />
                    )}
                  </span>
                  <p className="pb-4.5 text-base leading-normal text-ink-soft">
                    <strong className="font-semibold text-ink">{moment.cand}</strong>{" "}
                    · {moment.ce}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <IdeaBand />
    </main>
  );
}
