"use client";

import { useState, useTransition } from "react";
import { createDonation, type DonationState } from "@/app/sustine/actions";

const PRESETS = [20, 50, 100];

/** Donation flow: pick or type an amount → server creates a Revolut order →
 *  the person pays on Revolut's hosted checkout page. */
export default function DonateCard() {
  const [amount, setAmount] = useState<string>("50");
  const [state, setState] = useState<DonationState>(null);
  const [pending, startTransition] = useTransition();

  function donate() {
    setState(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("amount", amount);
        const result = await createDonation(null, fd);
        if (result?.url) {
          window.location.assign(result.url);
        } else {
          setState(result);
        }
      } catch {
        setState({ error: "Ceva n-a mers. Încearcă din nou peste un moment." });
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Alege suma donației"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            aria-pressed={amount === String(preset)}
            className={`inline-flex min-h-10 items-center rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
              amount === String(preset)
                ? "border-ink bg-ink text-bg"
                : "border-line-strong bg-surface text-ink hover:border-ink"
            }`}
          >
            {preset} lei
          </button>
        ))}
        <label className="flex items-center gap-1.5 text-[13px] text-ink-muted">
          <span className="sr-only">Altă sumă în lei</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="min-h-10 w-24 rounded-full border border-line-strong bg-surface px-3.5 text-[13px] text-ink"
          />
          lei
        </label>
        <button
          type="button"
          onClick={donate}
          disabled={pending}
          className="inline-flex min-h-10 items-center rounded-full border border-ink bg-ink px-4 text-[13px] font-semibold text-bg transition-colors hover:bg-ink-hover disabled:opacity-60"
        >
          {pending ? "Pregătesc plata…" : "Donează prin Revolut ↗"}
        </button>
      </div>
      <div aria-live="polite">
        {state?.error && (
          <p className="text-sm text-ink-muted">{state.error}</p>
        )}
      </div>
      <p className="text-[11.5px] text-ink-faint">
        Plata se face pe pagina securizată Revolut — datele cardului nu trec
        pe aici.
      </p>
    </div>
  );
}
