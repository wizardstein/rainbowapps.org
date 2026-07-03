import Link from "next/link";
import ArcMark from "@/components/ArcMark";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-[#F7F4EE]">
      <div className="mx-auto flex w-full max-w-[70rem] flex-col gap-2.5 px-6 py-8 sm:px-8">
        <div className="flex items-center gap-2.5">
          <ArcMark mono className="h-5" />
          <span className="font-display text-sm font-extrabold text-ink">
            RainbowApps
          </span>
        </div>
        <p className="max-w-2xl text-[13px] leading-relaxed text-ink-muted">
          RainbowApps — o inițiativă personală, sub Rainbow Engineering SRL,
          Cluj-Napoca. Construiesc și fac voluntariat pentru comunitate. Datele
          pe care le trimiți sunt folosite doar ca să te pot contacta despre
          ideea ta. Nu le dau nimănui.
        </p>
        <p className="flex gap-3.5 text-[13px]">
          <Link
            href="/colaborare"
            className="text-blue transition-colors hover:text-blue-deep"
          >
            Cum colaborăm
          </Link>
          <Link
            href="/confidentialitate"
            className="text-blue transition-colors hover:text-blue-deep"
          >
            Confidențialitate
          </Link>
        </p>
      </div>
    </footer>
  );
}
