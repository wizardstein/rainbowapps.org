"use client";

import { useState, useTransition } from "react";
import { supportInitiative, type SupportState } from "@/app/sustine/actions";

/** The 2-second tier of support: one click, one counter. */
export default function SupportButton({
  initialCount,
}: {
  initialCount: number;
}) {
  const [state, setState] = useState<SupportState>(null);
  const [pending, startTransition] = useTransition();

  const count = state?.count ?? initialCount;
  const done = Boolean(state?.ok);

  function handleClick() {
    startTransition(async () => {
      try {
        setState(await supportInitiative());
      } catch {
        setState({ error: "Ceva n-a mers. Încearcă din nou peste un moment." });
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[14.5px] leading-relaxed text-ink-muted" aria-live="polite">
        {count === 0
          ? "Fii primul care susține."
          : count === 1
            ? "Un om susține inițiativa până acum."
            : `${count.toLocaleString("ro-RO")} oameni susțin inițiativa până acum.`}
      </p>
      <div aria-live="polite">
        {done ? (
          <p className="font-display font-bold text-ink">
            {state?.already
              ? "Mulțumesc — susținerea ta e deja numărată. ♥"
              : "Mulțumesc! ♥"}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={pending}
            className="btn-soft disabled:opacity-60"
          >
            {pending ? "O secundă…" : "Susțin inițiativa"}
          </button>
        )}
        {state?.error && (
          <p className="mt-3 text-sm text-ink-muted">{state.error}</p>
        )}
      </div>
    </div>
  );
}
