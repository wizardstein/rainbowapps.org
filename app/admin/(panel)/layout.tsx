import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin — RainbowApps",
  robots: { index: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await requireAdmin())) {
    redirect("/admin/login");
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-6 pt-8 pb-20">
        <nav
          aria-label="Administrare"
          className="flex flex-wrap items-center gap-5 border-b border-line pb-4 text-sm"
        >
          <Link href="/admin" className="font-medium text-ink hover:underline">
            Idei
          </Link>
          <Link
            href="/admin/portofoliu"
            className="font-medium text-ink hover:underline"
          >
            Portofoliu
          </Link>
          <Link
            href="/admin/testimoniale"
            className="font-medium text-ink hover:underline"
          >
            Testimoniale
          </Link>
          <form
            className="ml-auto"
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-ink-soft underline decoration-line underline-offset-4 hover:text-ink"
            >
              Ieși
            </button>
          </form>
        </nav>
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
