"use client";

import { useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import ArcMark from "@/components/ArcMark";

export type FanItem = {
  title: string;
  description: string;
  url: string;
  preview?: StaticImageData;
};

// How far each card behind the front one sits. The horizontal step lives in
// the --fan-step CSS var so it can shrink on small screens.
const STEP_Y = 10;
const STEP_ROT = 2.5;
const VISIBLE = 4;

/** The portfolio as a hand of cards: every project overlaps the next, the
 *  active one sits on top, and a sideways swipe (or the arrows) brings the
 *  next card to the front. Only ~4 peek out at once no matter how many
 *  projects pile up over time. */
export default function PortfolioFan({ items }: { items: FanItem[] }) {
  const [active, setActive] = useState(0);
  const dragStart = useRef<number | null>(null);
  const n = items.length;

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);

  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (dragStart.current === null) return;
    const delta = e.clientX - dragStart.current;
    dragStart.current = null;
    if (delta < -40) next();
    if (delta > 40) prev();
  }

  const current = items[active];

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
      {/* The fan. A hidden sizer card in normal flow gives the block its
          height; the real cards stack absolutely on top of it. */}
      <div
        className="relative select-none [--fan-step:36px] [touch-action:pan-y] sm:[--fan-step:56px]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
      >
        <div
          aria-hidden="true"
          className="invisible aspect-[4/3]"
          style={{ width: `calc(100% - var(--fan-step) * ${Math.min(VISIBLE - 1, n - 1)})` }}
        />
        {items.map((item, i) => {
          const p = (i - active + n) % n; // 0 = front of the fan
          const hiddenDepth = Math.min(p, VISIBLE - 1);
          const style: React.CSSProperties = {
            width: `calc(100% - var(--fan-step) * ${Math.min(VISIBLE - 1, n - 1)})`,
            transform: `translate(calc(var(--fan-step) * ${hiddenDepth}), ${hiddenDepth * STEP_Y}px) rotate(${
              p === 0 ? -1.5 : hiddenDepth * STEP_ROT
            }deg) scale(${1 - hiddenDepth * 0.04})`,
            zIndex: n - p,
            opacity: p >= VISIBLE ? 0 : 1,
            pointerEvents: p >= VISIBLE ? "none" : undefined,
            transition:
              "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
          };
          const face = item.preview ? (
            <Image
              src={item.preview}
              alt={p === 0 ? `Captură de ecran din ${item.title}` : ""}
              placeholder="blur"
              sizes="(min-width: 1024px) 540px, (min-width: 640px) 70vw, 90vw"
              className="size-full object-cover object-top"
              draggable={false}
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-surface">
              <ArcMark className="h-10 opacity-60" />
            </span>
          );
          return p === 0 ? (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Deschide ${item.title}`}
              className="absolute inset-0 block aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-md"
              style={style}
              draggable={false}
            >
              {face}
            </a>
          ) : (
            <button
              key={item.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Adu în față ${item.title}`}
              className="absolute inset-0 block aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-line shadow-sm"
              style={style}
            >
              {face}
            </button>
          );
        })}
      </div>

      {/* The active card's story: link, description, controls. */}
      <div className="flex flex-col gap-3">
        <a
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group font-display text-[19px] font-extrabold text-ink"
        >
          {current.title}{" "}
          <span
            aria-hidden="true"
            className="inline-block font-semibold text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </a>
        <p className="text-[15px] leading-relaxed text-ink-muted" aria-live="polite">
          {current.description}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Proiectul anterior"
            className="flex size-10 items-center justify-center rounded-full border border-line bg-crem font-display text-base font-bold text-ink transition-colors hover:bg-crem-deep"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Proiectul următor"
            className="flex size-10 items-center justify-center rounded-full border border-line bg-crem font-display text-base font-bold text-ink transition-colors hover:bg-crem-deep"
          >
            →
          </button>
          <span className="text-[13px] font-semibold text-ink-faint">
            {active + 1} / {n}
          </span>
        </div>
      </div>
    </div>
  );
}
