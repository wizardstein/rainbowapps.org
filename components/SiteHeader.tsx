import Link from "next/link";
import ArcMark from "@/components/ArcMark";

const LINKS = [
  { href: "/#portofoliu", label: "Ce am construit" },
  { href: "/#cum-functioneaza", label: "Cum funcționează" },
  { href: "/#povestea", label: "Povestea mea" },
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
    </header>
  );
}
