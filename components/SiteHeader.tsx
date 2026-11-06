import Link from "next/link";
import ArcMark from "@/components/ArcMark";

// Owner redesign, 2026-11-06: „Ce am construit” and „Despre mine” are their
// own pages, reached only from here; the other two are homepage sections.
const LINKS = [
  { href: "/proiecte", label: "Ce am construit" },
  { href: "/#recenzii", label: "Recenzii" },
  { href: "/despre", label: "Despre mine" },
  { href: "/#sustine", label: "Susține" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-[-0.01em] text-ink"
        >
          <ArcMark className="h-7" />
          RainbowApps
        </Link>
        <nav aria-label="Navigație" className="flex items-center gap-7">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden text-[15px] font-medium text-ink transition-colors hover:text-blue md:inline"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/trimite"
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-ink bg-ink px-[18px] text-[15px] font-semibold text-bg transition-colors hover:border-ink-hover hover:bg-ink-hover"
          >
            Trimite o idee
          </Link>
        </nav>
      </div>
      {/* On phones the four links get their own row, swipeable sideways, so
          the separate pages stay reachable. */}
      <nav
        aria-label="Navigație"
        className="rail -mt-1 flex gap-1 overflow-x-auto px-2 pb-2 md:hidden"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 flex-none items-center rounded-full px-3 text-[15px] font-medium whitespace-nowrap text-ink transition-colors hover:text-blue"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
