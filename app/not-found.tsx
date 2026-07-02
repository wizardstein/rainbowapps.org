import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-16 pb-24 sm:pt-24">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Pagina asta nu există.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Linkul e greșit sau pagina s-a mutat. Ideea ta are loc în continuare
          aici.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="btn-secondary"
          >
            Înapoi la pagina principală
          </Link>
          <Link
            href="/trimite"
            className="text-base font-medium text-ink-soft underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Trimite-mi ideea ta
          </Link>
        </div>
      </section>
    </main>
  );
}
