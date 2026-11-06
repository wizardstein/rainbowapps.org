"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ArcMark from "@/components/ArcMark";
import { ArrowBackIcon, ArrowIcon, CheckIcon } from "@/components/Icons";
import type { PortfolioItem } from "@/lib/portfolio";

// How the cards behind the top one fan out (owner redesign, 2026-11-06):
// up to three peek out, each a step to the right, lower and turned a little.
// The deck box is tall enough for the last one to stay clear of the arrows.
const PEEK = 3;
const STEP_X_PCT = 4.6;
const STEP_Y_PX = 9;
const STEP_ROT_DEG = 2;
const SWIPE_PX = 50;

/** The portfolio as a deck of cards, the whole first screen of the homepage:
 *  the top card is the project shown on the right with its features and
 *  store links. Arrows, a swipe on the deck, or ← → while it's on screen
 *  bring the next card up; the deck loops. */
export default function PortfolioDeck({ items }: { items: PortfolioItem[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const inView = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const step = useCallback(
    (dir: 1 | -1) => setActive((a) => (a + dir + n) % n),
    [n],
  );

  // Keyboard: ← → flip the deck while it is on screen (or has focus);
  // Home/End only when it has focus, so they keep scrolling the page
  // elsewhere. Typing in a field is never intercepted.
  useEffect(() => {
    const section = root.current;
    if (!section || n < 2) return;
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
      else if (e.key === "Home" && focused) setActive(0);
      else if (e.key === "End" && focused) setActive(n - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [n, step]);

  if (n === 0) return null;

  // A horizontal swipe on the deck flips it; vertical moves scroll the page
  // (touch-action: pan-y). A swipe never also opens the top card's link.
  function onPointerDown(e: React.PointerEvent) {
    swipe.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  }
  function onPointerUp(e: React.PointerEvent) {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  }
  function onClickCapture(e: React.MouseEvent) {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      swiped.current = false;
    }
  }

  const current = items[active];

  return (
    <section
      ref={root}
      id="aplicatii"
      aria-label="Ce am construit"
      className="mx-auto w-full max-w-[1200px] scroll-mt-20 overflow-x-clip px-4 pt-10 pb-20 sm:px-8 sm:pt-16 sm:pb-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-6">
          <div
            className="relative aspect-[10/9] w-full touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
            onClickCapture={onClickCapture}
            onDragStart={(e) => e.preventDefault()}
          >
            {items.map((item, i) => {
              const pos = (i - active + n) % n;
              const k = Math.min(pos, PEEK);
              const top = pos === 0;
              return (
                <div
                  key={item.url}
                  aria-hidden={!top}
                  inert={!top}
                  className="absolute top-0 left-0 w-[86%] origin-[20%_100%] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  style={{
                    zIndex: n - pos,
                    opacity: pos > PEEK ? 0 : 1,
                    transform: top
                      ? "none"
                      : `translate(${k * STEP_X_PCT}%, ${k * STEP_Y_PX}px) rotate(${k * STEP_ROT_DEG}deg)`,
                  }}
                >
                  <div className="flex flex-col gap-2.5 rounded-[22px] border border-line bg-surface p-2.5 shadow-[0_22px_44px_-22px_rgba(21,20,26,0.35),0_4px_10px_-6px_rgba(21,20,26,0.18)]">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Deschide ${item.title}`}
                      className="block aspect-[4/3] overflow-hidden rounded-[14px] bg-crem"
                      draggable={false}
                    >
                      {item.preview ? (
                        <Image
                          src={item.preview}
                          alt=""
                          placeholder="blur"
                          priority={i === 0}
                          sizes="(min-width: 1024px) 480px, 86vw"
                          className="size-full object-cover object-top"
                          draggable={false}
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center">
                          <ArcMark className="h-10 opacity-60" />
                        </span>
                      )}
                    </a>
                    <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-1.5">
                      <span className="truncate font-display text-lg font-semibold tracking-[-0.01em] text-ink">
                        {item.title}
                      </span>
                      <span className="flex-none text-[13px] font-medium text-ink-muted">
                        {item.kind}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {n > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Proiectul anterior"
                className="flex size-[52px] items-center justify-center rounded-full border-[1.5px] border-ink text-ink transition-colors hover:bg-crem"
              >
                <ArrowBackIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Proiectul următor"
                className="flex size-[52px] items-center justify-center rounded-full border-[1.5px] border-ink bg-ink text-bg transition-colors hover:border-ink-hover hover:bg-ink-hover"
              >
                <ArrowIcon className="size-5" />
              </button>
              <p
                aria-hidden="true"
                className="ml-auto font-display text-base font-semibold text-ink-muted"
              >
                {active + 1} / {n}
              </p>
              <p className="sr-only" aria-live="polite">
                {`Proiectul ${active + 1} din ${n}: ${current.title}`}
              </p>
            </div>
          )}
        </div>

        {/* Every project's details sit in the same grid cell, so the cell is
            as tall as the longest one and nothing below jumps when the deck
            flips. Only the top card's details are visible. */}
        <div className="grid">
          {items.map((item, i) => {
            const shown = i === active;
            return (
              <article
                key={item.url}
                aria-hidden={!shown}
                inert={!shown}
                className={`col-start-1 row-start-1 flex flex-col gap-4.5 transition-[opacity,visibility] duration-300 ${
                  shown ? "visible opacity-100" : "invisible opacity-0"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display text-[clamp(30px,3.2vw,42px)] font-semibold leading-[1.08] tracking-[-0.025em] text-ink">
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
                </h2>
                <p className="text-[17px] leading-[1.55] text-ink-soft text-pretty">
                  {item.description}
                </p>
                {item.features.length > 0 && (
                  <ul className="flex flex-col gap-3">
                    {item.features.map((text) => (
                      <li
                        key={text}
                        className="flex gap-3 text-base leading-normal text-ink"
                      >
                        <CheckIcon className="mt-0.5 size-5 flex-none text-status-green" />
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
