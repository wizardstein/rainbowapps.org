import type { Metadata } from "next";
import Link from "next/link";
import PortfolioDeck from "@/components/PortfolioDeck";
import TestimonialBand from "@/components/TestimonialBand";
import IdeaBand from "@/components/IdeaBand";
import SupportButton from "@/components/SupportButton";
import DonateCard from "@/components/DonateCard";
import ShareCard from "@/components/ShareCard";
import { ArrowIcon, CheckIcon } from "@/components/Icons";
import {
  getProjects,
  getSupportersCount,
  getTestimonials,
} from "@/lib/content";
import { portfolioItems } from "@/lib/portfolio";
import { projectHostname } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// What an NGO or a good cause gets (owner redesign, 2026-11-06). Prices for
// everyone else are left unsaid on purpose.
const NGO_POINTS = [
  "Tu păstrezi totul: ideea, codul și domeniul.",
  "Fără cont și fără pitch deck: îmi scrii ideea în câteva rânduri.",
  "Îți răspund la fiecare idee, oricare ar fi răspunsul.",
];

const H2_CARD =
  "font-display text-[clamp(32px,3.4vw,46px)] font-semibold leading-[1.05] tracking-[-0.03em]";
const EYEBROW = "text-[13px] font-semibold uppercase tracking-[0.08em]";

/** The homepage as a portfolio (owner redesign, 2026-11-06, Claude Design
 *  „RainbowApps — site de portofoliu”): the deck of delivered apps is the
 *  whole first screen, then the testimonials band, then „for good causes,
 *  free” next to „support the initiative”, then the closing invitation.
 *  The story lives on /despre, the grouped list on /proiecte. */
export default async function Home() {
  const [projects, testimonials, supporters] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getSupportersCount(),
  ]);
  const donationsEnabled = Boolean(process.env.REVOLUT_SECRET_KEY);
  const items = portfolioItems(projects);

  const supportItems = [
    {
      lead: "Trimite link-ul",
      rest: "cuiva care are o idee sau unui ONG care are nevoie de o aplicație.",
      control: <ShareCard />,
    },
    {
      lead: "Scrie două rânduri",
      rest: "de recomandare, dacă am lucrat împreună.",
      control: (
        <Link href="/sustine" className="btn-soft self-start">
          Scrie un gând
        </Link>
      ),
    },
    ...(donationsEnabled
      ? [
          {
            lead: "Donează prin Revolut",
            rest: "— 20, 50, 100 lei sau cât vrei. Nu procesez carduri pe site.",
            control: <DonateCard />,
          },
        ]
      : []),
  ];

  return (
    <main className="flex-1">
      <h1 className="sr-only">Aplicații și site-uri livrate de RainbowApps</h1>

      <PortfolioDeck items={items} />

      {testimonials.length > 0 && (
        <TestimonialBand
          testimonials={testimonials.map((t) => ({
            ...t,
            host: t.url ? projectHostname(t.url) : null,
          }))}
        />
      )}

      {/* Gratuit pentru ONG-uri | Susține inițiativa */}
      <section className="mx-auto grid w-full max-w-[1200px] items-stretch gap-6 px-4 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
        <div
          id="ong"
          className="flex scroll-mt-32 flex-col gap-5.5 rounded-[28px] bg-ink md:scroll-mt-20 p-7 text-bg sm:p-10"
        >
          <p className={`${EYEBROW} text-paper-dim`}>Pentru ONG-uri și cauze bune</p>
          <h2 className={`${H2_CARD} text-balance`}>
            Pentru o cauză bună, construiesc gratuit.
          </h2>
          <p className="text-lg leading-[1.55] text-paper-dim text-pretty">
            Dacă ai un ONG, o campanie sau o idee care ajută oameni, ți-o
            construiesc fără să-ți cer bani. Singurul tău cost e domeniul, cam
            10–15 € pe an.
          </p>
          <ul className="flex flex-col gap-3">
            {NGO_POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-base leading-normal">
                <CheckIcon className="mt-0.5 size-5 flex-none text-[#7CC489]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <Link href="/trimite" className="btn-light">
              Spune-mi ideea ta <ArrowIcon />
            </Link>
          </div>
        </div>

        <div
          id="sustine"
          className="flex scroll-mt-32 flex-col gap-5.5 rounded-[28px] border md:scroll-mt-20 border-line bg-surface p-7 sm:p-10"
        >
          <p className={`${EYEBROW} text-ink-muted`}>Susține inițiativa</p>
          <h2 className={`${H2_CARD} text-ink`}>Totul e autofinanțat.</h2>
          <p className="text-lg leading-[1.55] text-ink-soft">
            Dacă ți se pare că merită,{" "}
            {supportItems.length === 3 ? "trei" : "două"} lucruri ajută cu
            adevărat:
          </p>
          <ol className="flex flex-col gap-6">
            {supportItems.map((item, i) => (
              <li key={item.lead} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-8 flex-none items-center justify-center rounded-full border-[1.5px] border-ink font-display text-[15px] font-semibold text-ink"
                >
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <p className="text-base leading-normal text-ink">
                    <strong className="font-semibold">{item.lead}</strong>{" "}
                    {item.rest}
                  </p>
                  {item.control}
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-auto border-t border-line pt-5">
            <SupportButton initialCount={supporters} />
          </div>
        </div>
      </section>

      <IdeaBand />
    </main>
  );
}
