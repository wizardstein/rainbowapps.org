import Link from "next/link";
import ArcMark from "@/components/ArcMark";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pt-8 pb-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-[560px] flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <ArcMark mono className="h-5" />
            <span className="font-display text-sm font-bold text-ink">
              RainbowApps
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-ink-muted">
            RainbowApps este o inițiativă personală sub Rainbow Engineering SRL,
            Cluj-Napoca. Datele trimise sunt folosite doar ca să te contactez
            despre ideea ta. Nu le dau nimănui.
          </p>
          <p className="text-xs leading-relaxed text-ink-muted/80">
            RAINBOW ENGINEERING S.R.L. · CUI: 49009851 · Nr. Reg. Comerțului:
            J12/4542/2023
          </p>
        </div>
        <nav
          aria-label="Secundar"
          className="flex flex-wrap gap-5 text-[13px] text-ink-muted md:pt-1"
        >
          <Link
            href="/colaborare"
            className="underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Cum colaborăm
          </Link>
          <Link
            href="/confidentialitate"
            className="underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Confidențialitate
          </Link>
        </nav>
      </div>
    </footer>
  );
}
