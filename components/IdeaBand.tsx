import Link from "next/link";
import { ArrowIcon } from "@/components/Icons";

/** The dark band that closes every page: one invitation, one button. */
export default function IdeaBand() {
  return (
    <section id="idee" className="bg-ink text-bg">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-7 px-4 py-20 sm:px-8 sm:py-28">
        <span
          aria-hidden="true"
          className="spectrum-bar block h-1.5 w-[72px] rounded-full"
        />
        <h2 className="max-w-[900px] font-display text-[clamp(40px,5.4vw,76px)] font-semibold leading-none tracking-[-0.04em] text-balance">
          Ai o idee? Spune-mi-o.
        </h2>
        <p className="max-w-[620px] text-lg leading-normal text-paper-dim sm:text-xl">
          Nu trebuie să fie perfectă și nu trebuie să fie tehnică. Două minute,
          fără cont. Răspund la toate.
        </p>
        <Link href="/trimite" className="btn-light">
          Spune-mi ideea ta <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
