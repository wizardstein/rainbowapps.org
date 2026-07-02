import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import portret from "@/public/adelin.jpg";
import SupportButton from "@/components/SupportButton";
import DonateCard from "@/components/DonateCard";
import {
  getProjects,
  getSupportersCount,
  getTestimonials,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const STEPS = [
  {
    title: "Îmi spui ideea",
    body: "Completezi un formular scurt. Fără jargon, fără cont, fără costuri.",
  },
  {
    title: "Mă uit peste ea",
    body: "Aleg ideile care ajută oameni și pe care le pot construi singur. Îți răspund oricum, indiferent de răspuns.",
  },
  {
    title: "O construiesc",
    body: "De la un weekend la o lună. Tu plătești doar domeniul (~€10–15/an) și găzduirea (gratuită). Restul e din partea mea.",
  },
];

// Life moments, in order — the spectrum spine runs through them.
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
  {
    cand: "azi",
    ce: "Construiesc aplicații gratuite pentru oameni cu idei bune.",
  },
];

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
      <section className="relative overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-6 pt-12 pb-20 sm:pt-20 sm:pb-28 lg:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <StatusBadge />
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Ai o idee bună? O construiesc{" "}
              <span className="underline-spectrum">gratis</span>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Sunt Adelin, programator din Cluj. Dacă ai o idee de aplicație
              care ajută oameni, dar nu știi să programezi, o construiesc eu —
              gratuit. Tu păstrezi totul: ideea, codul, domeniul.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/trimite" className="btn-primary">
                Spune-mi ideea ta
              </Link>
              <Link
                href="/#povestea"
                className="text-base font-medium text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                Cine sunt eu
              </Link>
            </div>
          </div>
          <Image
            src={portret}
            alt="Adelin, zâmbind"
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 288px, 192px"
            className="w-48 justify-self-start rounded-3xl border border-line object-cover shadow-sm lg:w-72"
          />
        </div>
      </section>

      {/* Cum funcționează */}
      <section id="cum-functioneaza" className="scroll-mt-20 border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Cum funcționează
          </h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-bold text-ink-soft"
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Povestea mea */}
      <section id="povestea" className="scroll-mt-20 border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Povestea mea
          </h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                Calculatoarele m-au fascinat de mic. Am avut primul PC la 4
                ani, iar la 10 am reparat primul calculator „pe bani” — cinci
                lei. Am și stricat unul între timp (am formatat un hard disk
                fără backup), dar cam așa se învață.
              </p>
              <p>
                De atunci, drumul a trecut prin service-uri de calculatoare și
                case de marcat, apoi prin testare de software, automatizări și
                echipe conduse în companii mari. Să programez am învățat
                singur, din nevoie: întâi ca să-mi ușurez munca, apoi pentru
                că nu m-am mai putut opri.
              </p>
              <p>
                Am urcat și pe scara corporate, destul cât să înțeleg că nu
                acolo mi-e locul. Cel mai fericit sunt când construiesc ceva
                care ajută pe cineva. Așa a apărut RainbowApps.
              </p>
            </div>
            <div className="relative max-w-md lg:w-80">
              <div
                className="spectrum-spine absolute inset-y-1 left-0"
                aria-hidden="true"
              />
              <ol className="space-y-6 pl-6">
              {MOMENTE.map((moment) => (
                <li key={moment.cand}>
                  <span className="font-display text-sm font-semibold uppercase tracking-wide text-ink">
                    {moment.cand}
                  </span>
                  <p className="mt-1 leading-relaxed text-ink-soft">
                    {moment.ce}
                  </p>
                </li>
              ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* De ce fac asta */}
      <section className="border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            De ce fac asta
          </h2>
          <blockquote className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Cred că o idee bună nu ar trebui să rămână blocată doar fiindcă
            omul din spatele ei nu scrie cod. M-au inspirat profesorii care
            predau gratis și oamenii care construiesc open source. Acesta e
            felul meu de a da înapoi.
          </blockquote>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Și pentru că știu exact cum e: am și eu idei care stau în sertar
            fiindcă nu am cunoștințele să le construiesc singur. Nu vreau ca
            ideea ta să rămână acolo.
          </p>
        </div>
      </section>

      {/* Ce nu pot construi */}
      <section className="border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Ce nu pot construi
          </h2>
          <blockquote className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Las deoparte ideile care țin de jocuri de noroc sau pariuri,
            politică, religie, sau orice ar putea face rău cuiva. Și,
            deocamdată, sisteme foarte complexe cu multe părți — sunt un
            singur om.
          </blockquote>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            În rest, orice idee care ajută e binevenită — inclusiv una din
            care vrei să câștigi. Nu trebuie să fie caritate: ideea, codul și
            ce câștigi din ea rămân ale tale.
          </p>
        </div>
      </section>

      {/* Portofoliu */}
      <section id="portofoliu" className="scroll-mt-20 border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Portofoliu
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.url}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full rounded-xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-sm"
                >
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {project.title}
                    <span
                      aria-hidden="true"
                      className="ml-1.5 inline-block text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Susține inițiativa */}
      <section id="sustine" className="scroll-mt-20 border-t border-line">
        <div className="reveal mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Susține inițiativa
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Nu ai o idee de trimis, dar îți place ce se întâmplă aici? Poți
            împinge lucrurile înainte în felul tău.
          </p>
          <div
            className={`mt-10 grid gap-6 sm:grid-cols-2 ${donationsEnabled ? "lg:grid-cols-3" : ""}`}
          >
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                Cu un click
              </h3>
              <div className="mt-2">
                <SupportButton initialCount={supporters} />
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="font-display text-lg font-semibold text-ink">
                Cu o vorbă bună
              </h3>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Ai lucrat cu mine sau crezi în idee? Două rânduri de la tine
                cântăresc mult pentru următorul om.
              </p>
              <Link href="/sustine" className="btn-secondary mt-4">
                Scrie un gând
              </Link>
            </div>
            {donationsEnabled && (
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Cu o donație
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  Construirea e gratuită pentru oameni, dar uneltele și
                  găzduirea costă. Orice sumă ajută.
                </p>
                <DonateCard />
              </div>
            )}
          </div>

          {testimonials.length > 0 && (
            <>
              <h3 className="mt-14 font-display text-xl font-semibold text-ink">
                Ce spun oamenii
              </h3>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                {testimonials.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-xl border border-line bg-surface p-6"
                  >
                    <blockquote className="leading-relaxed text-ink-soft">
                      {t.text}
                    </blockquote>
                    <p className="mt-4 font-display text-sm font-semibold text-ink">
                      {t.author}
                      {t.url && (
                        <>
                          {" · "}
                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans font-normal text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
                          >
                            {new URL(t.url).hostname}
                          </a>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* CTA repeat */}
      <section className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 text-center sm:py-24">
          <p className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Ideea ta poate ajuta pe cineva.
          </p>
          <Link href="/trimite" className="btn-primary mt-8">
            Spune-mi ideea ta
          </Link>
        </div>
      </section>
    </main>
  );
}
