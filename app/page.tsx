import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { PROJECTS } from "@/lib/site";

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

export default function Home() {
  return (
    <>
      <header className="mx-auto w-full max-w-5xl px-6 py-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-ink"
        >
          RainbowApps
        </Link>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-20 sm:pt-16 sm:pb-28">
          <div className="max-w-2xl">
            <StatusBadge />
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Ai o idee bună? O construiesc gratis.
            </h1>
            <div className="spectrum-rule mt-5 w-44" aria-hidden="true" />
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Sunt Adelin, programator din Cluj. Dacă ai o idee de aplicație
              care ajută oameni, dar nu știi să programezi, o construiesc eu —
              gratuit. Tu păstrezi totul: ideea, codul, domeniul.
            </p>
            <Link
              href="/trimite"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90"
            >
              Spune-mi ideea ta
            </Link>
          </div>
        </section>

        {/* Cum funcționează */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
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

        {/* De ce fac asta */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              De ce fac asta
            </h2>
            <blockquote className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Cred că o idee bună nu ar trebui să rămână blocată doar fiindcă
              omul din spatele ei nu scrie cod. M-au inspirat profesorii care
              predau gratis și oamenii care construiesc open source. Acesta e
              felul meu de a da înapoi.
            </blockquote>
          </div>
        </section>

        {/* Ce nu pot construi */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Ce nu pot construi
            </h2>
            <blockquote className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Las deoparte ideile care țin de jocuri de noroc sau pariuri,
              politică, religie, sau orice ar putea face rău cuiva. Și,
              deocamdată, sisteme foarte complexe cu multe părți — sunt un
              singur om.
            </blockquote>
          </div>
        </section>

        {/* Portofoliu */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Portofoliu
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {PROJECTS.map((project) => (
                <li key={project.url}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-xl border border-line bg-surface p-6 transition-colors hover:border-ink/30"
                  >
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {project.title}
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

        {/* CTA repeat */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
            <Link
              href="/trimite"
              className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90"
            >
              Spune-mi ideea ta
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm leading-relaxed text-ink-soft">
          <p className="max-w-2xl">
            RainbowApps — o inițiativă personală, sub Rainbow Engineering SRL,
            Cluj-Napoca. Construiesc și fac voluntariat pentru comunitate.
          </p>
          <p className="mt-4 max-w-2xl">
            Datele pe care le trimiți sunt folosite doar ca să te pot contacta
            despre ideea ta. Nu le dau nimănui.
          </p>
        </div>
      </footer>
    </>
  );
}
