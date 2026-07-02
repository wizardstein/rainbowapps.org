import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin, signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Intrare — RainbowApps",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await requireAdmin()) {
    redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-2xl px-6 pt-16 pb-24 sm:pt-24">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Zona de administrare
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Doar pentru Adelin. Dacă ai ajuns aici din greșeală, ideea ta e
          binevenită pe pagina principală.
        </p>
        {error && (
          <p role="alert" className="mt-6 max-w-md text-ink-soft">
            Contul ăsta nu are acces aici.
          </p>
        )}
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="btn-primary"
          >
            Intră cu Google
          </button>
        </form>
      </section>
    </main>
  );
}
