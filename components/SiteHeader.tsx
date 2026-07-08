import Link from "next/link";
import ArcMark from "@/components/ArcMark";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[70rem] items-center justify-between gap-4 px-6 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink"
        >
          <ArcMark className="h-7" />
          RainbowApps
        </Link>
        <nav aria-label="Navigație" className="flex items-center gap-5 text-sm">
          <Link
            href="/#portofoliu"
            className="hidden font-semibold text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Portofoliu
          </Link>
          <Link
            href="/#sustine"
            className="hidden font-semibold text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Susține
          </Link>
          <Link
            href="/#cum-functioneaza"
            className="hidden font-semibold text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Cum funcționează
          </Link>
          <Link
            href="/#povestea"
            className="hidden font-semibold text-ink-soft transition-colors hover:text-ink sm:inline"
          >
            Povestea mea
          </Link>
          <Link
            href="/trimite"
            className="rounded-full bg-blue px-[18px] py-2 font-display font-bold text-white transition-colors hover:bg-blue-deep"
          >
            Trimite o idee
          </Link>
        </nav>
      </div>
    </header>
  );
}
