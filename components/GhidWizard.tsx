"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { IDEA_MAX } from "@/lib/validation";

// A gentle, six-step walk through the questions that make an idea concrete —
// a short, loose adaptation of the Foundation Sprint (from "Click" by Jake
// Knapp & John Zeratsky), rewritten in our own words for non-technical people.
// Everything is optional; the guide never blocks anyone from just submitting.

export const IDEA_DRAFT_KEY = "rainbowapps:idee-din-ghid";

type StepKey = "client" | "problema" | "azi" | "diferenta" | "abordare";

const STEPS: {
  key: StepKey;
  title: string;
  question: string;
  why: string;
  placeholder: string;
}[] = [
  {
    key: "client",
    title: "Omul tău",
    question: "Cine e omul care ar folosi aplicația?",
    why: "Cu cât îl vezi mai concret, cu atât ideea devine mai clară. Nu „toată lumea” — un om anume.",
    placeholder:
      "De exemplu: părinții din clasa copilului meu, mecanicii din service-urile mici, bunica…",
  },
  {
    key: "problema",
    title: "Problema",
    question: "Ce îl încurcă azi pe omul ăsta?",
    why: "O idee bună rezolvă o durere reală. Când apare? Cât timp sau câți nervi îl costă?",
    placeholder:
      "De exemplu: uită când expiră borcanele din cămară și aruncă mâncare bună…",
  },
  {
    key: "azi",
    title: "Azi",
    question: "Cum se descurcă acum, fără aplicația ta?",
    why: "Orice idee concurează cu felul în care omul se descurcă deja — chiar dacă ăla e un caiet, un Excel sau memoria. Asta e „concurența” ta.",
    placeholder:
      "De exemplu: ține minte din cap, întreabă pe grupul de WhatsApp, are un caiet în sertar…",
  },
  {
    key: "diferenta",
    title: "Diferența",
    question: "De ce ar alege aplicația ta în locul felului în care se descurcă azi?",
    why: "Alege una-două lucruri, nu zece. Mai simplă? Mai rapidă? În română? Făcută exact pentru omul tău?",
    placeholder:
      "De exemplu: îi amintește singură, fără să facă el nimic; e atât de simplă că o folosește și bunica…",
  },
  {
    key: "abordare",
    title: "Simplu",
    question: "Dacă aplicația ar face un singur lucru, care ar fi ăla?",
    why: "Versiunea mică e cea care ajunge să existe. Restul se poate adăuga după.",
    placeholder:
      "De exemplu: un singur ecran unde adaugi borcanul și data — atât. Aplicația te anunță ea…",
  },
];

const LABELS: Record<StepKey, string> = {
  client: "Pentru cine e",
  problema: "Ce problemă rezolvă",
  azi: "Cum se descurcă oamenii azi",
  diferenta: "De ce a mea ar fi mai bună",
  abordare: "Cum ar arăta, în forma cea mai simplă",
};

function assemble(answers: Record<StepKey, string>): string {
  const lines = (Object.keys(LABELS) as StepKey[])
    .filter((key) => answers[key].trim())
    .map((key) => `${LABELS[key]}: ${answers[key].trim()}`);
  return lines.join("\n\n").slice(0, IDEA_MAX);
}

export default function GhidWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    client: "",
    problema: "",
    azi: "",
    diferenta: "",
    abordare: "",
  });
  const [finalText, setFinalText] = useState<string | null>(null);

  const answered = useMemo(
    () => Object.values(answers).filter((v) => v.trim()).length,
    [answers],
  );

  const atRecap = step >= STEPS.length;
  const current = STEPS[step];

  function next() {
    if (step === STEPS.length - 1) {
      setFinalText(assemble(answers));
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function back() {
    if (atRecap) setFinalText(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function sendToForm() {
    try {
      sessionStorage.setItem(IDEA_DRAFT_KEY, finalText ?? "");
    } catch {
      // Storage unavailable (private mode etc.) — the form still works,
      // the person just pastes or rewrites.
    }
    router.push("/trimite");
  }

  return (
    <div className="mt-10">
      {/* Progress */}
      <p className="text-sm text-ink-soft" aria-live="polite">
        {atRecap
          ? "Gata — recapitularea"
          : `Pasul ${step + 1} din ${STEPS.length} · ${current.title}`}
      </p>
      <div
        className="mt-3 flex gap-1.5"
        aria-hidden="true"
      >
        {[...Array(STEPS.length + 1)].map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-ink" : "bg-line"
            }`}
          />
        ))}
      </div>

      {!atRecap ? (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            {current.question}
          </h2>
          <p className="mt-2 leading-relaxed text-ink-soft">{current.why}</p>
          <textarea
            key={current.key}
            rows={4}
            value={answers[current.key]}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, [current.key]: e.target.value }))
            }
            placeholder={current.placeholder}
            className="mt-5 w-full rounded-lg border border-line bg-surface px-4 py-3 leading-relaxed text-ink placeholder:text-ink-soft/70"
          />
          <p className="mt-2 text-xs text-ink-soft/80">
            Nu-ți vine nimic acum? E în regulă — mergi mai departe, poți sări
            peste orice pas.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
              >
                ← Înapoi
              </button>
            )}
            <button type="button" onClick={next} className="btn-primary">
              {step === STEPS.length - 1 ? "Vezi recapitularea" : "Continuă"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Ideea ta, pusă cap la cap
          </h2>
          {answered > 0 ? (
            <>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Poți corecta orice înainte s-o trimiți — sunt cuvintele tale,
                doar așezate.
              </p>
              <textarea
                rows={10}
                maxLength={IDEA_MAX}
                value={finalText ?? ""}
                onChange={(e) => setFinalText(e.target.value)}
                className="mt-5 w-full rounded-lg border border-line bg-surface px-4 py-3 leading-relaxed text-ink"
              />
            </>
          ) : (
            <p className="mt-2 leading-relaxed text-ink-soft">
              N-ai completat nimic — și e perfect în regulă. Uneori ideea se
              spune mai bine liber, cu cuvintele tale, direct în formular.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={back}
              className="text-sm text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
            >
              ← Înapoi
            </button>
            <button type="button" onClick={sendToForm} className="btn-primary">
              Trimite-mi ideea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
