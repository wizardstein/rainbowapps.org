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
const COMMIT_PX = 70; // release past this distance = change card
const FULL_PULL = 200; // drag distance that counts as "fully pulled"

/** The portfolio as a hand of cards: every project overlaps the next, the
 *  active one sits on top. The fan follows the finger while dragging and
 *  settles on the new card at release; arrows and taps work too. Only ~4
 *  cards peek out no matter how many projects pile up over time. */
export default function PortfolioFan({ items }: { items: FanItem[] }) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0); // live px while the finger is down
  const [dragging, setDragging] = useState(false);
  const start = useRef<number | null>(null);
  const stepPx = useRef(56);
  const cardPx = useRef(400);
  const moved = useRef(false);
  const n = items.length;

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);
  const prevIndex = (active - 1 + n) % n;

  // 0..1 — how far the drag has pulled toward the next / previous card.
  const pullNext = dragging ? Math.min(1, Math.max(0, -drag) / FULL_PULL) : 0;
  const pullPrev = dragging ? Math.min(1, Math.max(0, drag) / FULL_PULL) : 0;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    start.current = e.clientX;
    moved.current = false;
    setDragging(true);
    const el = e.currentTarget;
    stepPx.current =
      parseFloat(getComputedStyle(el).getPropertyValue("--fan-step")) || 56;
    cardPx.current =
      el.getBoundingClientRect().width -
      stepPx.current * Math.min(VISIBLE - 1, n - 1);
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Pointer already gone (or synthetic) — drag still works uncaptured.
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (start.current === null) return;
    const delta = e.clientX - start.current;
    if (Math.abs(delta) > 8) moved.current = true;
    setDrag(delta);
  }

  function onPointerEnd() {
    if (start.current === null) return;
    const delta = drag;
    start.current = null;
    setDragging(false);
    setDrag(0);
    if (delta < -COMMIT_PX) next();
    else if (delta > COMMIT_PX) prev();
  }

  // A finished drag must not count as a click on the card underneath.
  function onClickCapture(e: React.MouseEvent) {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  const current = items[active];
  const widthCss = `calc(100% - var(--fan-step) * ${Math.min(VISIBLE - 1, n - 1)})`;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
      {/* The fan. A hidden sizer card in normal flow gives the block its
          height; the real cards stack absolutely on top of it. */}
      <div
        className="relative cursor-grab select-none [--fan-step:36px] [touch-action:pan-y] active:cursor-grabbing sm:[--fan-step:56px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
      >
        <div
          aria-hidden="true"
          className="invisible aspect-[4/3]"
          style={{ width: widthCss }}
        />
        {items.map((item, i) => {
          const p = (i - active + n) % n; // 0 = front of the fan
          const depth = Math.min(p, VISIBLE - 1);

          let transform: string;
          let zIndex = n - p;
          let opacity = p >= VISIBLE ? 0 : 1;

          if (dragging && p === 0) {
            // The front card rides along with the finger.
            transform = `translate(${drag}px, 0px) rotate(${-1.5 + drag / 30}deg)`;
          } else if (dragging && pullPrev > 0 && i === prevIndex) {
            // Dragging right: the previous card slides back in from the left,
            // over everything, and settles on top at release.
            const fromX = -cardPx.current * 0.4;
            transform = `translate(${fromX * (1 - pullPrev)}px, 0px) rotate(${
              -8 + 6.5 * pullPrev
            }deg) scale(1)`;
            zIndex = n + 1;
            opacity = 1;
          } else if (dragging && pullNext > 0 && p >= 1) {
            // Dragging left: everything behind slides one slot forward.
            const d = Math.max(0, depth - pullNext);
            transform = `translate(${d * stepPx.current}px, ${d * STEP_Y}px) rotate(${
              d * STEP_ROT
            }deg) scale(${1 - d * 0.04})`;
            if (p === VISIBLE) opacity = pullNext;
          } else {
            transform = `translate(calc(var(--fan-step) * ${depth}), ${depth * STEP_Y}px) rotate(${
              p === 0 ? -1.5 : depth * STEP_ROT
            }deg) scale(${1 - depth * 0.04})`;
          }

          const style: React.CSSProperties = {
            width: widthCss,
            transform,
            zIndex,
            opacity,
            pointerEvents: p >= VISIBLE ? "none" : undefined,
            transition: dragging
              ? "none"
              : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease",
          };
          const face = item.preview ? (
            <Image
              src={item.preview}
              alt={p === 0 ? `Captură de ecran din ${item.title}` : ""}
              placeholder="blur"
              sizes="(min-width: 1024px) 540px, (min-width: 640px) 70vw, 90vw"
              className="pointer-events-none size-full object-cover object-top"
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
