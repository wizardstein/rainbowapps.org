import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import portret from "@/public/adelin.jpg";
import previewScoala from "@/public/previews/scoala.jpg";
import previewJoaca from "@/public/previews/joaca.jpg";
import previewYmarchive from "@/public/previews/ymarchive.jpg";
import previewDonfitway from "@/public/previews/donfitway.jpg";
import ArcMark, { SPECTRU } from "@/components/ArcMark";
import PortfolioFan from "@/components/PortfolioFan";
import SupportButton from "@/components/SupportButton";
import DonateCard from "@/components/DonateCard";
import ShareCard from "@/components/ShareCard";
import {
  getProjects,
  getSupportersCount,
  getTestimonials,
} from "@/lib/content";
import { projectHostname } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Static screenshots of the finished apps (public/previews), keyed by
// hostname like the node colors. Apps without one fall back to a plain card.
const PREVIEWS: Record<string, StaticImageData> = {
  "scoala.beard-brothers.ro": previewScoala,
  "joaca.beard-brothers.ro": previewJoaca,
  "ymarchive.chat": previewYmarchive,
  "donfitway.ro": previewDonfitway,
};

const STEPS = [
  {
    title: "Îmi spui ideea",
    body: "Completezi un formular scurt. Fără jargon, fără cont, fără costuri.",
    color: SPECTRU[0],
  },
  {
    title: "Mă uit peste ea",
    body: "Aleg ideile care ajută oameni și pe care le pot construi singur. Îți răspund oricum, indiferent de răspuns.",
    color: SPECTRU[2],
  },
  {
    title: "O construiesc",
    body: "De la un weekend la o lună. Singurul tău cost e domeniul, ~10–15 € pe an. Găzduirea e gratuită, iar restul e din partea mea.",
    color: SPECTRU[3],
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

function Kicker({ color, children }: { color: string; children: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="size-3 rounded-[4px]"
        style={{ background: color }}
      />
      <span className="font-display text-xs font-extrabold uppercase tracking-[1.5px] text-ink-faint">
        {children}
      </span>
    </div>
  );
}

export default async function Home() {
  const [projects, testimonials, supporters] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getSupportersCount(),
  ]);
  const donationsEnabled = Boolean(process.env.REVOLUT_SECRET_KEY);

  return (
    <main className="flex-1">
      {/* Hero */}
      <header className="mx-auto grid w-full max-w-[70rem] items-center gap-12 px-6 pt-14 pb-16 sm:px-8 sm:pt-[72px] sm:pb-20 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div className="flex flex-col items-start gap-[22px]">
          <StatusBadge />
          <h1 className="font-display text-[40px] font-extrabold leading-[1.12] tracking-[-1px] text-ink text-balance sm:text-[56px]">
            Ai o idee <span className="underline-spectrum">bună</span>? O
            construiesc gratis.
          </h1>
          <p className="max-w-[520px] text-lg leading-[1.65] text-ink-soft text-pretty">
            Sunt Adelin, programator din Cluj. Dacă ai o idee de aplicație care
            ajută oameni, dar nu știi să programezi, o construiesc eu —
            gratuit. Tu păstrezi totul: ideea, codul, domeniul.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-3">
            <Link href="/trimite" className="btn-primary">
              Spune-mi ideea ta
            </Link>
            <Link href="/#povestea" className="btn-secondary">
              Cine sunt eu
            </Link>
          </div>
        </div>
        <div className="relative max-w-sm lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute rounded-3xl bg-gradient-to-br from-crem to-crem-deep"
            style={{ inset: "14px -14px -14px 14px" }}
          />
          <Image
            src={portret}
            alt="Adelin, zâmbind"
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 100vw"
            className="relative aspect-[4/4.4] w-full rounded-3xl border border-line object-cover"
          />
        </div>
      </header>

      {/* Portofoliu */}
      <section
        id="portofoliu"
        className="mx-auto w-full max-w-[70rem] scroll-mt-20 px-6 py-16 sm:px-8"
      >
        <div className="reveal">
          <Kicker color={SPECTRU[0]}>Portofoliu</Kicker>
          <h2 className="mt-2.5 mb-9 font-display text-3xl font-extrabold tracking-[-0.5px] text-ink sm:text-[34px]">
            Ce am construit până acum.
          </h2>
          <PortfolioFan
            items={projects.map((project) => {
              const host = projectHostname(project.url);
              return { ...project, preview: host ? PREVIEWS[host] : undefined };
            })}
          />
          <p className="mt-6 text-[13px] text-ink-faint">
            Aici e loc și pentru ideea ta.
          </p>
        </div>
      </section>

      {/* Ce spun oamenii */}
      {testimonials.length > 0 && (
        <section
          id="testimoniale"
          className="mx-auto w-full max-w-[70rem] scroll-mt-20 px-6 py-16 sm:px-8"
        >
          <div className="reveal">
            <Kicker color={SPECTRU[1]}>Vorbe bune</Kicker>
            <h2 className="mt-2.5 mb-7 font-display text-3xl font-extrabold tracking-[-0.5px] text-ink sm:text-[34px]">
              Ce spun oamenii cu care am lucrat.
            </h2>
            <div className="rounded-2xl bg-[#26221D] p-5 sm:p-7">
              <div className="gap-5 md:columns-2">
                {testimonials.map((t) => (
                  <figure
                    key={t.id}
                    className="mb-5 break-inside-avoid rounded-xl border border-white/10 p-5 last:mb-0"
                  >
                    <blockquote className="font-display text-[17px] font-bold leading-[1.55] text-[#F5F1EA] text-pretty">
                      „{t.text}”
                    </blockquote>
                    <figcaption className="mt-3.5 text-[13.5px] text-[#B5AC9C]">
                      {t.author}
                      {t.url && (
                        <>
                          {" · "}
                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 transition-colors hover:text-[#F5F1EA]"
                          >
                            {new URL(t.url).hostname.replace(/^www\./, "")}
                          </a>
                        </>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Susține inițiativa */}
      <section
        id="sustine"
        className="mx-auto w-full max-w-[70rem] scroll-mt-20 px-6 py-16 sm:px-8"
      >
        <div className="reveal">
          <Kicker color={SPECTRU[2]}>Susține inițiativa</Kicker>
          <h2 className="mt-2.5 font-display text-3xl font-extrabold tracking-[-0.5px] text-ink sm:text-[34px]">
            Nu ai o idee, dar îți place ce se întâmplă aici?
          </h2>
          <p className="mt-3 mb-7 text-ink-soft">
            Poți împinge lucrurile înainte în felul tău.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]">
              <h3 className="font-display text-lg font-extrabold text-ink">
                Cu un click
              </h3>
              <SupportButton initialCount={supporters} />
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]">
              <h3 className="font-display text-lg font-extrabold text-ink">
                Cu o vorbă bună
              </h3>
              <p className="text-[14.5px] leading-relaxed text-ink-muted">
                Ai lucrat cu mine sau crezi în idee? Două rânduri de la tine
                cântăresc mult pentru următorul om.
              </p>
              <Link href="/sustine" className="btn-soft self-start">
                Scrie un gând
              </Link>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]">
              <h3 className="font-display text-lg font-extrabold text-ink">
                Cu un share
              </h3>
              <p className="text-[14.5px] leading-relaxed text-ink-muted">
                Poate omul cu ideea bună e chiar în lista ta de prieteni. Dă
                vestea mai departe.
              </p>
              <ShareCard />
            </div>
            {donationsEnabled && (
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]">
                <h3 className="font-display text-lg font-extrabold text-ink">
                  Cu o donație
                </h3>
                <p className="text-[14.5px] leading-relaxed text-ink-muted">
                  Construirea e gratuită pentru oameni, dar uneltele și
                  găzduirea costă. Orice sumă ajută.
                </p>
                <DonateCard />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cum funcționează */}
      <section
        id="cum-functioneaza"
        className="mx-auto w-full max-w-[70rem] scroll-mt-20 px-6 py-16 sm:px-8"
      >
        <div className="reveal">
          <Kicker color={SPECTRU[3]}>Cum funcționează</Kicker>
          <h2 className="mt-2.5 mb-7 font-display text-3xl font-extrabold tracking-[-0.5px] text-ink sm:text-[34px]">
            Trei pași, zero costuri.
          </h2>
          <ol className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-[26px]"
              >
                <span
                  aria-hidden="true"
                  className="flex size-[34px] items-center justify-center rounded-[10px] font-display text-base font-extrabold text-white"
                  style={{ background: step.color }}
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-[19px] font-extrabold text-ink">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Povestea mea */}
      <section
        id="povestea"
        className="mx-auto w-full max-w-[70rem] scroll-mt-20 px-6 py-16 sm:px-8"
      >
        <div className="reveal">
          <Kicker color={SPECTRU[4]}>Povestea mea</Kicker>
          <div className="mt-2.5 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.5px] text-ink sm:text-[34px]">
                De la cinci lei la RainbowApps.
              </h2>
              <p className="leading-[1.7] text-ink-soft text-pretty">
                Calculatoarele m-au fascinat de mic. Am avut primul PC la 4
                ani, iar la 10 am reparat primul calculator „pe bani” — cinci
                lei. Am și stricat unul între timp (am formatat un hard disk
                fără backup), dar cam așa se învață.
              </p>
              <p className="leading-[1.7] text-ink-soft text-pretty">
                De atunci, drumul a trecut prin service-uri de calculatoare și
                case de marcat, apoi prin testare de software, automatizări și
                echipe conduse în companii mari. Să programez am învățat
                singur, din nevoie: întâi ca să-mi ușurez munca, apoi pentru
                că nu m-am mai putut opri.
              </p>
              <p className="leading-[1.7] text-ink-soft text-pretty">
                Am urcat și pe scara corporate, destul cât să înțeleg că nu
                acolo mi-e locul. Cel mai fericit sunt când construiesc ceva
                care ajută pe cineva. Așa a apărut RainbowApps.
              </p>
            </div>
            <ol className="self-start rounded-2xl border border-line bg-surface px-[26px] pt-[26px] pb-[22px]">
              {MOMENTE.map((moment, i) => (
                <li key={moment.cand} className="flex gap-3.5 py-[9px]">
                  <span
                    aria-hidden="true"
                    className="mt-[3px] size-3 flex-none rounded-[4px]"
                    style={{ background: SPECTRU[i] }}
                  />
                  <p className="text-sm leading-normal text-ink-soft">
                    <strong className="text-ink">{moment.cand}</strong> ·{" "}
                    {moment.ce}
                  </p>
                </li>
              ))}
              <li className="mt-1.5 flex gap-3.5 border-t border-dashed border-line py-[9px]">
                <ArcMark className="mt-0.5 h-3.5 flex-none" />
                <p className="text-sm leading-normal text-ink-soft">
                  <strong className="text-ink">azi</strong> · Construiesc
                  aplicații gratuite pentru oameni cu idei bune.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* De ce fac asta / Ce nu pot construi */}
      <section className="mx-auto grid w-full max-w-[70rem] gap-5 px-6 py-16 sm:px-8 md:grid-cols-2">
        <div className="reveal flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-[30px]">
          <Kicker color={SPECTRU[5]}>De ce fac asta</Kicker>
          <p className="font-display text-[19px] font-bold leading-normal text-ink text-pretty">
            Cred că o idee bună nu ar trebui să rămână blocată doar fiindcă
            omul din spatele ei nu scrie cod.
          </p>
          <p className="text-[15px] leading-[1.65] text-ink-soft text-pretty">
            M-au inspirat profesorii care predau gratis și oamenii care
            construiesc open source. Acesta e felul meu de a da înapoi. Și
            pentru că știu exact cum e: am și eu idei care stau în sertar
            fiindcă nu am cunoștințele să le construiesc singur. Nu vreau ca
            ideea ta să rămână acolo.
          </p>
        </div>
        <div className="reveal flex flex-col gap-3.5 rounded-2xl border border-line bg-surface p-[30px]">
          <Kicker color={SPECTRU[6]}>Ce nu pot construi</Kicker>
          <p className="font-display text-[19px] font-bold leading-normal text-ink text-pretty">
            Las deoparte jocurile de noroc, politica, religia sau orice ar
            putea face rău cuiva.
          </p>
          <p className="text-[15px] leading-[1.65] text-ink-soft text-pretty">
            Deocamdată, nici sisteme foarte complexe cu multe părți — sunt un
            singur om. În rest, orice idee care ajută e binevenită — inclusiv
            una din care vrei să câștigi. Nu trebuie să fie caritate: ideea,
            codul și ce câștigi din ea rămân ale tale.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto flex w-full max-w-[70rem] flex-col items-center gap-5 px-6 pt-16 pb-[88px] text-center sm:px-8">
        <ArcMark className="h-[58px]" />
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.6px] text-ink text-balance sm:text-[38px]">
          Ideea ta poate ajuta pe cineva.
        </h2>
        <Link href="/trimite" className="btn-primary">
          Spune-mi ideea ta
        </Link>
      </section>
    </main>
  );
}
