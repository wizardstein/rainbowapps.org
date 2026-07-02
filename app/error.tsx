"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-16 pb-24 sm:pt-24">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Ceva n-a mers.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Nu e vina ta. Încearcă din nou — iar dacă tot nu merge, revino puțin
          mai târziu.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90"
        >
          Încearcă din nou
        </button>
      </section>
    </main>
  );
}
