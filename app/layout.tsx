import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

// Homepage redesign (2026-10-16, Claude Design canvas "RainbowApps — redesign
// homepage"): Bricolage Grotesque for display, Instrument Sans for body. Both
// variable, with latin-ext for ș/ț.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rainbowapps.org";
const title = "RainbowApps — Ai o idee bună? O construiesc, de la 0 lei.";
const description =
  "Sunt Adelin, programator din Cluj. Dacă ai o idee de aplicație care ajută oameni, dar nu știi să programezi, o construiesc eu — gratuit pentru ONG‑uri și cauze bune, contra cost pentru proiecte mai mari.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "RainbowApps",
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${bricolage.variable} ${instrument.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
