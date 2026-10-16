"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import ArcMark from "@/components/ArcMark";
import type { ProjectPlatform, ProjectValue } from "@/lib/site";

export type RailItem = {
  slug: string;
  title: string;
  description: string;
  url: string;
  host: string | null;
  preview?: StaticImageData;
  value?: ProjectValue;
  platform: ProjectPlatform;
  tags: string[];
};

const ARROW = "M5 12h14M13 6l6 6-6 6";
const ARROW_BACK = "M19 12H5M11 6l-6 6 6 6";
const CHECK = "M5 12l5 5L20 7";

function Icon({
  d,
  className = "size-5",
  strokeWidth = 2,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

/** "~160.000–240.000 €" → "160.000–240.000 €": the label under it already
 *  says it is an estimate. */
function bare(s: string): string {
  return s.replace(/^~\s*/, "");
}

function ValueRow({ value }: { value: ProjectValue }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[22px] font-semibold leading-[1.1] text-ink">
          {bare(value.cost)}
        </span>
        <span className="text-[13px] text-ink-muted">valoare estimată</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[22px] font-semibold leading-[1.1] text-ink">
          {bare(value.time)}
        </span>
        <span className="text-[13px] text-ink-muted">timp de lucru</span>
      </div>
    </div>
  );
}

function Preview({
  item,
  className,
  sizes,
}: {
  item: RailItem;
  className: string;
  sizes: string;
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Deschide ${item.title}`}
      className={`block overflow-hidden rounded-[14px] border border-line bg-crem ${className}`}
    >
      {item.preview ? (
        <Image
          src={item.preview}
          alt={`Captură de ecran din ${item.title}`}
          placeholder="blur"
          sizes={sizes}
          className="size-full object-cover object-top"
          draggable={false}
        />
      ) : (
        <span className="flex size-full items-center justify-center">
          <ArcMark className="h-10 opacity-60" />
        </span>
      )}
    </a>
  );
}

function TitleLink({ item, className }: { item: RailItem; className: string }) {
  return (
    <h3 className={className}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-colors hover:text-blue"
      >
        {item.title}{" "}
        <span
          aria-hidden="true"
          className="inline-block font-medium text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </a>
    </h3>
  );
}

/** One card per project, the same layout for all: screenshot and the
 *  cost/time figures on the left, tags, title, description, the five
 *  features and (for native apps) the store links on the right. On phones it
 *  stacks: screenshot, text, figures. */
function Card({ item }: { item: RailItem }) {
  return (
    <article
      id={item.slug}
      data-card
      className="grid w-[min(920px,92vw)] shrink-0 snap-start scroll-mt-24 grid-cols-1 items-start gap-5 rounded-[20px] border border-line bg-surface p-5 sm:p-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-5"
    >
      <Preview
        item={item}
        className="aspect-[4/3] md:col-start-1 md:row-start-1"
        sizes="(min-width: 768px) 400px, 90vw"
      />
      <div className="flex flex-col gap-4 md:col-start-2 md:row-span-2 md:row-start-1">
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <TitleLink
          item={item}
          className="font-display text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[30px]"
        />
        <p className="text-base leading-[1.55] text-ink-soft">{item.description}</p>
        {item.value && (
          <ul className="flex flex-col gap-2.5">
            {item.value.features.map((text) => (
              <li
                key={text}
                className="flex gap-2.5 text-[15px] leading-[1.45] text-ink"
              >
                <Icon
                  d={CHECK}
                  strokeWidth={2.4}
                  className="mt-0.5 size-[18px] flex-none text-status-green"
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        )}
        {item.platform.kind === "app" && (
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "App Store", href: item.platform.appStore },
              { label: "Google Play", href: item.platform.googlePlay },
            ].map((store) => (
              <a
                key={store.label}
                href={store.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-soft"
              >
                {store.label}
                <span aria-hidden="true" className="text-ink-faint">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
      {item.value && (
        <div className="md:col-start-1 md:row-start-2">
          <ValueRow value={item.value} />
        </div>
      )}
    </article>
  );
}

/** The portfolio as a horizontal rail of cards: swipe on phones, arrows or
 *  ← → keys on desktop, one card per step, snapping to the card's edge. */
export default function PortfolioRail({ items }: { items: RailItem[] }) {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const inView = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // The rail is position:relative, so each card's offsetLeft is measured from
  // the rail's own edge (padding included) — not from the page.
  const step = useCallback((dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    const current = el.scrollLeft;
    const target =
      dir === 1
        ? cards.find((c) => c.offsetLeft - pad > current + 8)
        : [...cards].reverse().find((c) => c.offsetLeft - pad < current - 8);
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
  }, []);

  const jump = useCallback((where: "start" | "end") => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: where === "start" ? 0 : el.scrollWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  // Arrow buttons dim at the ends of the rail.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  // Keyboard: ← → move one card while the section is on screen (or the rail
  // has focus); Home/End only when the rail has focus, so they keep scrolling
  // the page elsewhere. Typing in a field is never intercepted.
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.intersectionRatio >= 0.4;
      },
      { threshold: [0, 0.4, 1] },
    );
    io.observe(section);
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
        return;
      const focused = section.contains(document.activeElement);
      if (!inView.current && !focused) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Home" && focused) jump("start");
      else if (e.key === "End" && focused) jump("end");
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [step, jump]);

  const n = items.length;

  return (
    <section
      ref={root}
      id="portofoliu"
      className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 pt-[72px] pb-10 sm:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[640px] flex-col gap-2.5">
          <h2 className="font-display text-[clamp(32px,3.6vw,48px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
            Ce am construit până acum
          </h2>
          <p className="text-[17px] leading-normal text-ink-soft">
            Glisează prin proiecte. Fiecare a pornit de la o idee trimisă de
            cineva ca tine.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={!canPrev}
            aria-label="Proiectul anterior"
            className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-ink text-ink transition-colors hover:bg-crem disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Icon d={ARROW_BACK} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={!canNext}
            aria-label="Proiectul următor"
            className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-ink bg-ink text-bg transition-colors hover:border-ink-hover hover:bg-ink-hover disabled:cursor-default disabled:opacity-30 disabled:hover:border-ink disabled:hover:bg-ink"
          >
            <Icon d={ARROW} />
          </button>
        </div>
      </div>

      <div
        ref={rail}
        tabIndex={0}
        role="group"
        aria-roledescription="carusel"
        aria-label={`Cardurile proiectelor, ${n} în total. Săgețile stânga și dreapta schimbă cardul.`}
        aria-keyshortcuts="ArrowLeft ArrowRight Home End"
        className="rail relative -mx-4 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-4 px-4 pt-2 pb-6 sm:-mx-8 sm:scroll-pl-8 sm:px-8"
      >
        {items.map((item) => (
          <Card key={item.url} item={item} />
        ))}
      </div>
    </section>
  );
}
