"use client";

import { useEffect, useRef } from "react";

export type BandTestimonial = {
  id: string;
  author: string;
  text: string;
  url: string | null;
  /** The project's hostname, shown under the author. */
  host: string | null;
};

// How fast the band drifts on its own, in px per second.
const SPEED = 40;
// After the person lets go (or scrolls it sideways), the band waits this
// long before drifting again, so a flick can finish.
const RESUME_AFTER_MS = 600;
const RESUME_AFTER_TOUCH_MS = 900;
// One copy of the list should be wider than a big screen, or the loop shows
// a gap; short lists are repeated until they have at least this many cards.
const MIN_CARDS = 4;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** The testimonials as an endless band (owner redesign, 2026-11-06). It
 *  drifts by itself and keeps drifting while the page scrolls; holding a
 *  finger or the mouse on it pauses it, dragging moves it by hand (also with
 *  a trackpad, to skip ahead), and letting go carries on from there. With
 *  reduced motion it never moves by itself, but can still be dragged. */
export default function TestimonialBand({
  testimonials,
}: {
  testimonials: BandTestimonial[];
}) {
  const band = useRef<HTMLDivElement>(null);
  const firstCopy = useRef<HTMLDivElement>(null);
  const secondCopy = useRef<HTMLDivElement>(null);
  const hold = useRef({ holding: false, focus: false, until: 0, dragged: false });
  const drag = useRef<{ x: number; scroll: number } | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    // Any sideways scroll we didn't make ourselves (trackpad, wheel, a touch
    // flick still coasting, keyboard) counts as the person moving it.
    let written = el.scrollLeft;
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - written) > 1) {
        hold.current.until = performance.now() + RESUME_AFTER_MS;
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const a = firstCopy.current;
      const b = secondCopy.current;
      const h = hold.current;
      if (a && b && visible) {
        // The two copies are identical, so jumping back by one copy's
        // width is invisible: that is what makes the band endless.
        const loop = b.offsetLeft - a.offsetLeft;
        const byHand = h.holding || h.focus || now < h.until || reduce.matches;
        if (byHand) {
          if (loop > 0 && el.scrollLeft >= loop) {
            el.scrollLeft -= loop;
            if (drag.current) drag.current.scroll -= loop;
          } else if (loop > 0 && el.scrollLeft <= 0 && h.holding) {
            el.scrollLeft += loop;
            if (drag.current) drag.current.scroll += loop;
          }
          pos = el.scrollLeft;
          written = el.scrollLeft;
        } else {
          pos += (SPEED * dt) / 1000;
          if (loop > 0 && pos >= loop) pos -= loop;
          el.scrollLeft = pos;
          written = el.scrollLeft;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Mouse: press = pause, drag = move it by hand, release = carry on.
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0 || !band.current) return;
    hold.current.holding = true;
    hold.current.dragged = false;
    drag.current = { x: e.clientX, scroll: band.current.scrollLeft };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Pointer already gone — dragging still works uncaptured.
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    const el = band.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) hold.current.dragged = true;
    el.scrollLeft = d.scroll - dx;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType !== "mouse" || !drag.current) return;
    drag.current = null;
    hold.current.holding = false;
    hold.current.until = performance.now() + RESUME_AFTER_MS;
  }

  // Touch: a finger on the band pauses it and the browser scrolls it
  // natively; a mostly vertical move is the page scrolling, so the band
  // keeps going.
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
    hold.current.holding = true;
  }
  function onTouchMove(e: React.TouchEvent) {
    const s = touch.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - s.x);
    const dy = Math.abs(t.clientY - s.y);
    if (dy > 10 && dy > dx) {
      touch.current = null;
      hold.current.holding = false;
    }
  }
  function onTouchEnd() {
    if (!touch.current) return;
    touch.current = null;
    hold.current.holding = false;
    hold.current.until = performance.now() + RESUME_AFTER_TOUCH_MS;
  }

  // A drag never also opens the link it started on.
  function onClickCapture(e: React.MouseEvent) {
    if (hold.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
      hold.current.dragged = false;
    }
  }

  // Keyboard users: the band holds still while a link in it has focus.
  function onFocus(e: React.FocusEvent) {
    hold.current.focus = (e.target as HTMLElement).matches(":focus-visible");
  }
  function onBlur() {
    hold.current.focus = false;
  }

  let list = testimonials;
  while (list.length > 0 && list.length < MIN_CARDS) list = [...list, ...testimonials];

  const cards = (copy: boolean) =>
    list.map((t, i) => (
      <figure
        key={`${t.id}-${i}`}
        className="flex w-[min(460px,82vw)] flex-none flex-col justify-between gap-7 rounded-[24px] border border-line bg-surface p-7 select-none sm:p-8"
      >
        <blockquote className="flex flex-col gap-3.5">
          <span
            aria-hidden="true"
            className="font-display text-[56px] leading-[0.6] font-bold text-line-strong"
          >
            “
          </span>
          <p className="text-[17px] leading-[1.6] text-ink-soft text-pretty">
            {t.text}
          </p>
        </blockquote>
        <figcaption className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex size-11 flex-none items-center justify-center rounded-full bg-ink font-display text-[15px] font-semibold text-bg"
          >
            {initials(t.author)}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <cite className="text-base font-semibold text-ink not-italic">
              {t.author}
            </cite>
            {t.url && (
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={copy ? -1 : undefined}
                className="truncate text-sm text-ink-muted underline-offset-4 hover:text-blue hover:underline"
                draggable={false}
              >
                {t.host ?? t.url}
              </a>
            )}
          </span>
        </figcaption>
      </figure>
    ));

  return (
    <section id="recenzii" className="scroll-mt-32 bg-crem py-20 sm:py-24 md:scroll-mt-20">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-4 sm:px-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          100% clienți mulțumiți
        </p>
        <h2 className="font-display text-[clamp(34px,3.8vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
          Ce spun oamenii cu care am lucrat
        </h2>
      </div>
      <div
        ref={band}
        className="band relative mt-10 cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className="flex w-max py-2 pl-4 sm:pl-8">
          <div ref={firstCopy} className="flex flex-none gap-6 pr-6">
            {cards(false)}
          </div>
          <div ref={secondCopy} aria-hidden="true" className="flex flex-none gap-6 pr-6">
            {cards(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
