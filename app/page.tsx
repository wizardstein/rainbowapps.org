import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import previewScoala from "@/public/previews/scoala.jpg";
import previewJoaca from "@/public/previews/joaca.jpg";
import previewYmarchive from "@/public/previews/ymarchive.jpg";
import previewDonfitway from "@/public/previews/donfitway.jpg";
import previewNsfab from "@/public/previews/nsfab.jpg";
import previewBbapp from "@/public/previews/bbapp.jpg";
import previewVreaumate from "@/public/previews/vreaumate.jpg";
import ArcMark, { SPECTRU } from "@/components/ArcMark";
import PortfolioRail, { type RailItem } from "@/components/PortfolioRail";
import SupportButton from "@/components/SupportButton";
import DonateCard from "@/components/DonateCard";
import ShareCard from "@/components/ShareCard";
import {
  getProjects,
  getSupportersCount,
  getTestimonials,
} from "@/lib/content";
import {
  costFloorEur,
  projectHostname,
  projectPlatform,
  projectSlug,
  projectTags,
  PROJECT_VALUE,
} from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Static screenshots of the finished apps (public/previews), keyed by
// hostname like the value figures. Apps without one fall back to a plain card.
const PREVIEWS: Record<string, StaticImageData> = {
  "scoala.beard-brothers.ro": previewScoala,
  "joaca.beard-brothers.ro": previewJoaca,
  "ymarchive.chat": previewYmarchive,
  "donfitway.ro": previewDonfitway,
  "nightshiftfabrications.ro": previewNsfab,
  "app.beard-brothers.ro": previewBbapp,
  "vreaumate.online": previewVreaumate,
};

// "Șapte aplicații" — the count in words, capitalised, for the hero lead.
const NUMERALE = ["", "O", "Două", "Trei", "Patru", "Cinci", "Șase", "Șapte", "Opt", "Nouă", "Zece"];

function numeral(n: number): string {
  return NUMERALE[n] ?? String(n);
}

// The three steps, as a real sequence (SPEC §10: numbered markers only here).
const STEPS = [
  {
    title: "Îmi trimiți ideea",
    body: "Un formular scurt. Spui ce problemă rezolvă și pe cine ajută.",
  },
  {
    title: "O citesc și îți răspund",
    body: "Primești răspuns în orice caz — da, nu, sau „hai să vorbim”.",
  },
  {
    title: "O construiesc",
    body: "De la un weekend la o lună. Proiectele mici costă doar domeniul (10–15 €/an). Pentru cele mari, preț stabilit de la început.",
  },
];

// Life moments, in order — one spectrum node each, the mark for today.
const MOMENTE = [
  { cand: "la 4 ani", ce: "Primul meu calculator." },
  { cand: "la 10 ani", ce: "Primul calculator reparat pe bani. Cinci lei." },
  {
    cand: "la 17 ani",
    ce: "Anunț în ziar: repar orice calculator, la domiciliu.",
  },
  {
    cand: "2008",
    ce: "Primul job: depanator de calculatoare, apoi de case de marcat.",
  },
  {
    cand: "2009",
    ce: "Primul meu program — scris ca să ușureze munca într-o firmă mică.",
  },
  {
    cand: "2012",
    ce: "M-am mutat la Cluj, în software. Am învățat să programez singur, din nevoie.",
  },
  {
    cand: "anii de după",
    ce: "Automatizare de teste, proiecte internaționale, echipe conduse.",
  },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Short name for the hero pills: sites by hostname, the app by its name. */
function pillLabel(item: RailItem): string {
  if (item.platform.kind === "app") {
    return `${item.title.split(/\s[—–-]\s/)[0]} · app iOS/Android`;
  }
  return item.title;
}

const FIGURE =
  "font-display text-[clamp(60px,7.8vw,116px)] font-semibold leading-[0.9] tracking-[-0.045em]";
const FIGURE_LABEL =
  "font-display text-[clamp(22px,2.4vw,32px)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink";

const H2 =
  "font-display text-[clamp(32px,3.6vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink";
const H2_SMALL =
  "font-display text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.025em] text-ink";

export default async function Home() {
  const [projects, testimonials, supporters] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getSupportersCount(),
  ]);
  const donationsEnabled = Boolean(process.env.REVOLUT_SECRET_KEY);

  const items: RailItem[] = projects.map((project) => {
    const host = projectHostname(project.url);
    return {
      ...project,
      host,
      slug: projectSlug(host),
      preview: host ? PREVIEWS[host] : undefined,
      value: host ? PROJECT_VALUE[host] : undefined,
      platform: projectPlatform(host),
      tags: projectTags(host),
    };
  });
  const n = items.length;

  // The headline adds up the lower bounds of the projects actually shown, so
  // it stays right when a project is added or hidden from /admin.
  const totalFloor =
    Math.floor(
      items.reduce(
        (sum, item) => sum + (item.value ? costFloorEur(item.value.cost) : 0),
        0,
      ) / 10_000,
    ) * 10_000;
  const totalLabel = `${String(totalFloor).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

  const supportItems = [
    {
      lead: "Trimite link-ul",
      rest: "cuiva care are o idee sau un ONG care are nevoie de o aplicație.",
      control: <ShareCard />,
    },
    {
      lead: "Scrie două rânduri",
      rest: "de recomandare dacă am lucrat împreună.",
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
      {/* Hero (direcția B): cifrele ca titlu — two figures, each with its
          meaning right under it and its proof next to it (owner, 2026-10-18).
          The h1 carries the sentence; the figures are its visual form. */}
      <header className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 pt-14 pb-14 sm:px-8 sm:pt-[72px]">
        <div className="flex flex-col gap-8">
          <StatusBadge />
          <h1 className="sr-only">
            {totalLabel} de software livrat. 100% clienți mulțumiți.
          </h1>
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p aria-hidden="true" className="flex flex-col gap-2">
                <span className={`${FIGURE} text-spectrum self-start`}>
                  {totalLabel}
                </span>
                <span className={FIGURE_LABEL}>de software livrat</span>
              </p>
              <p className="text-[15px] leading-normal text-ink-muted">
                Valoarea e o estimare de piață, nu facturi.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p aria-hidden="true" className="flex flex-col gap-2">
                <span className={`${FIGURE} text-ink`}>100%</span>
                <span className={FIGURE_LABEL}>clienți mulțumiți</span>
              </p>
              {testimonials.length > 0 && (
                <a
                  href="#testimoniale"
                  className="group inline-flex items-center gap-3 self-start text-[15px] font-medium text-ink"
                >
                  <span aria-hidden="true" className="flex -space-x-1.5">
                    {testimonials.map((t) => (
                      <span
                        key={t.id}
                        className="flex size-9 items-center justify-center rounded-full bg-ink font-display text-[13px] font-semibold text-bg ring-2 ring-bg"
                      >
                        {initials(t.author)}
                      </span>
                    ))}
                  </span>
                  <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-ink">
                    Citește ce au scris
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-2 lg:gap-10">
          <p className="max-w-[560px] text-xl leading-normal text-ink-soft text-pretty">
            {numeral(n)} aplicații construite pentru ONG-uri și cauze bune, de
            un programator din Cluj. Următoarea poate fi ideea ta — nu
            trebuie să fie perfectă, trebuie doar să ajute pe cineva.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/trimite" className="btn-primary">
              Spune-mi ideea ta <Arrow />
            </Link>
            <a href="#portofoliu" className="btn-secondary">
              Vezi cele {n} proiecte
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 border-t border-rule pt-6">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-muted">
            Construite până acum
          </p>
          <ul className="flex flex-wrap gap-3">
            {items.map((item) => (
              <li key={item.url}>
                <a
                  href={`#${item.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-4 text-[15px] font-medium text-ink transition-colors hover:border-ink"
                >
                  {pillLabel(item)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Portofoliu: rail de carduri, swipe / săgeți / tastatură. */}
      <PortfolioRail items={items} />

      {/* Ce spun oamenii */}
      {testimonials.length > 0 && (
        <section
          id="testimoniale"
          className="relative mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 pt-20 pb-20 sm:px-8"
        >
          <span
            aria-hidden="true"
            className="quote-glyph pointer-events-none absolute top-2 left-2 select-none"
          >
            “
          </span>
          <p className="relative pt-16 text-sm font-medium uppercase tracking-[0.08em] text-ink-muted">
            Ce spun oamenii cu care am lucrat
          </p>

          {/* All quotes at one large size (owner decision 2026-10-18): the
              size is fixed, not by length, and suits the longest (~600 chars). */}
          <div className="relative mt-14 flex flex-col">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="flex max-w-[960px] flex-col gap-6 border-t border-rule py-10 first:border-t-0 first:pt-0"
              >
                <p className="font-display text-[clamp(21px,2.3vw,28px)] font-medium leading-[1.4] tracking-[-0.015em] text-ink text-pretty">
                  {t.text}
                </p>
                <footer className="flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className="flex size-11 flex-none items-center justify-center rounded-full bg-ink font-display text-base font-semibold text-bg"
                  >
                    {initials(t.author)}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <cite className="text-base font-semibold text-ink not-italic">
                      {t.author}
                    </cite>
                    {t.url && (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-ink-muted transition-colors hover:text-ink"
                      >
                        {projectHostname(t.url) ?? t.url}
                      </a>
                    )}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Cum funcționează */}
      <section
        id="cum-functioneaza"
        className="scroll-mt-20 border-y border-line bg-surface"
      >
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-4 py-20 sm:px-8">
          <div className="flex max-w-[640px] flex-col gap-2.5">
            <h2 className={H2}>Cum funcționează</h2>
            <p className="text-[17px] leading-normal text-ink-soft">
              Fără cont, fără pitch deck. O idee descrisă în câteva rânduri e
              suficientă.
            </p>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-8">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3.5 border-t-[1.5px] border-ink pt-5"
              >
                <span className="font-display text-[15px] font-semibold text-ink-muted">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] text-ink">
                  {step.title}
                </h3>
                <p className="text-base leading-normal text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="max-w-[760px] text-[15px] leading-normal text-ink-muted text-pretty">
            Las deoparte jocurile de noroc, politica, religia sau orice ar putea
            face rău cuiva — și, deocamdată, sistemele foarte complexe cu multe
            părți: sunt un singur om. În rest, orice idee care ajută e
            binevenită, inclusiv una din care vrei să câștigi.
          </p>
        </div>
      </section>

      {/* Povestea mea + Susține */}
      <section className="mx-auto grid w-full max-w-[1200px] items-start gap-12 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div id="povestea" className="flex scroll-mt-20 flex-col gap-4.5">
          <h2 className={H2_SMALL}>Povestea mea</h2>
          <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
            Calculatoarele m-au fascinat de mic. Am avut primul PC la 4 ani,
            iar la 10 am reparat primul calculator „pe bani” — cinci lei. Am și
            stricat unul formatând un hard fără backup; așa se învață.
          </p>
          <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
            Din 2012 lucrez în software, la Cluj. RainbowApps e felul meu de a
            pune meseria în slujba unor oameni care au idei bune, dar nu și
            buget.
          </p>
          <details className="group">
            <summary className="cursor-pointer list-none self-start text-base font-semibold text-ink underline underline-offset-4 [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Citește toată povestea</span>
              <span className="hidden group-open:inline">Strânge povestea</span>
            </summary>
            <div className="mt-5 flex flex-col gap-4">
              <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
                De atunci, drumul a trecut prin service-uri de calculatoare și
                case de marcat, apoi prin testare de software, automatizări și
                echipe conduse în companii mari. Să programez am învățat
                singur, din nevoie: întâi ca să-mi ușurez munca, apoi pentru
                că nu m-am mai putut opri.
              </p>
              <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
                Am urcat și pe scara corporate, destul cât să înțeleg că nu
                acolo mi-e locul. Cel mai fericit sunt când construiesc ceva
                care ajută pe cineva. Așa a apărut RainbowApps.
              </p>
              <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
                M-au inspirat profesorii care predau gratis și oamenii care
                construiesc open source. Și știu exact cum e: am și eu idei
                care stau în sertar fiindcă nu am cunoștințele să le construiesc
                singur. Nu vreau ca ideea ta să rămână acolo.
              </p>
              <ol className="mt-2 border-t border-rule pt-3">
                {MOMENTE.map((moment, i) => (
                  <li key={moment.cand} className="flex gap-3.5 py-2">
                    <span
                      aria-hidden="true"
                      className="mt-[5px] size-2.5 flex-none rounded-[3px]"
                      style={{ background: SPECTRU[i] }}
                    />
                    <p className="text-[15px] leading-normal text-ink-soft">
                      <strong className="font-semibold text-ink">
                        {moment.cand}
                      </strong>{" "}
                      · {moment.ce}
                    </p>
                  </li>
                ))}
                <li className="mt-1 flex gap-3.5 border-t border-dashed border-rule py-2.5">
                  <ArcMark className="mt-0.5 h-3.5 flex-none" />
                  <p className="text-[15px] leading-normal text-ink-soft">
                    <strong className="font-semibold text-ink">azi</strong> ·
                    Construiesc aplicații pentru oameni cu idei bune — de la 0
                    lei.
                  </p>
                </li>
              </ol>
            </div>
          </details>
        </div>

        <div
          id="sustine"
          className="flex scroll-mt-20 flex-col gap-4.5 rounded-[20px] border border-line bg-surface p-6 sm:p-8"
        >
          <h2 className={H2_SMALL}>Susține inițiativa</h2>
          <p className="text-base leading-[1.55] text-ink-soft">
            Totul e autofinanțat. Dacă ți se pare că merită,{" "}
            {supportItems.length === 3 ? "trei" : "două"} lucruri ajută cu
            adevărat:
          </p>
          <ol className="flex flex-col gap-6">
            {supportItems.map((item, i) => (
              <li key={item.lead} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex-none font-display text-sm font-semibold text-ink-muted"
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
          <div className="border-t border-line pt-4">
            <SupportButton initialCount={supporters} />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section id="idee" className="bg-ink text-bg">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-7 px-4 py-20 sm:px-8 sm:py-24">
          <span
            aria-hidden="true"
            className="spectrum-bar block h-1.5 w-[72px] rounded-full"
          />
          <h2 className="max-w-[820px] font-display text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
            Ai o idee care ar ajuta pe cineva? Spune-mi-o. Nu trebuie să fie
            perfectă.
          </h2>
          <p className="max-w-[560px] text-lg leading-normal text-paper-dim">
            Două minute, fără cont. Răspund la toate.
          </p>
          <Link href="/trimite" className="btn-light">
            Spune-mi ideea ta <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
