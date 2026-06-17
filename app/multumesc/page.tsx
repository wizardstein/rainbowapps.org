import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mulțumesc! Am primit ideea ta — RainbowApps",
  description:
    "Am primit ideea ta. O să mă uit peste ea cu atenție și îți răspund pe email.",
};

export default function MultumescPage() {
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
        <section className="mx-auto w-full max-w-2xl px-6 pt-16 pb-24 sm:pt-24">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Mulțumesc! Am primit ideea ta.
          </h1>
          <div className="spectrum-rule mt-5 w-44" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            O să mă uit peste ea cu atenție și îți răspund pe email — indiferent
            dacă o pot construi sau nu. Poate dura câteva zile.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg border border-line bg-surface px-6 py-3 text-base font-medium text-ink transition-colors hover:border-ink/30"
          >
            Înapoi la pagina principală
          </Link>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-5xl px-6 py-12 text-sm leading-relaxed text-ink-soft">
          <p className="max-w-2xl">
            RainbowApps — o inițiativă personală, sub Rainbow Engineering SRL,
            Cluj-Napoca. Construiesc și fac voluntariat pentru comunitate.
          </p>
        </div>
      </footer>
    </>
  );
}
