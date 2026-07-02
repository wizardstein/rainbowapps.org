import Link from "next/link";

export default function SiteFooter() {
  return (
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
        <p className="mt-4">
          <Link
            href="/colaborare"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Cum colaborăm
          </Link>
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          <Link
            href="/confidentialitate"
            className="underline decoration-line underline-offset-4 transition-colors hover:text-ink"
          >
            Confidențialitate
          </Link>
        </p>
      </div>
    </footer>
  );
}
