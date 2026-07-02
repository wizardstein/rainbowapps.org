import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-6">
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight text-ink"
      >
        RainbowApps
      </Link>
      <nav aria-label="Navigație" className="flex items-center gap-6 text-sm">
        <Link
          href="/#cum-functioneaza"
          className="hidden text-ink-soft transition-colors hover:text-ink sm:inline"
        >
          Cum funcționează
        </Link>
        <Link
          href="/#povestea"
          className="hidden text-ink-soft transition-colors hover:text-ink sm:inline"
        >
          Povestea mea
        </Link>
        <Link
          href="/#portofoliu"
          className="hidden text-ink-soft transition-colors hover:text-ink sm:inline"
        >
          Portofoliu
        </Link>
        <Link
          href="/trimite"
          className="rounded-lg border border-line bg-surface px-4 py-2 font-medium text-ink transition-colors hover:border-ink/30"
        >
          Trimite o idee
        </Link>
      </nav>
    </header>
  );
}
