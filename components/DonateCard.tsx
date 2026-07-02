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
    <div>
      <div
        className="mt-4 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Alege suma donației"
      >
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            aria-pressed={amount === String(preset)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              amount === String(preset)
                ? "border-ink bg-ink text-bg"
                : "border-line bg-bg text-ink hover:border-ink/40"
            }`}
          >
            {preset} lei
          </button>
        ))}
        <label className="flex items-center gap-1.5 text-sm text-ink-soft">
          <span className="sr-only">Altă sumă în lei</span>
          <input
            type="number"
            inputMode="numeric"
            min={5}
            max={10000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24 rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink"
          />
          lei
        </label>
      </div>
      <button
        type="button"
        onClick={donate}
        disabled={pending}
        className="btn-secondary mt-4 disabled:opacity-60"
      >
        {pending ? "Pregătesc plata…" : "Donează prin Revolut ↗"}
      </button>
      <div aria-live="polite">
        {state?.error && (
          <p className="mt-3 text-sm text-ink-soft">{state.error}</p>
        )}
      </div>
      <p className="mt-3 text-xs text-ink-soft/80">
        Plata se face pe pagina securizată Revolut — datele cardului nu trec
        pe aici.
      </p>
    </div>
  );
}
