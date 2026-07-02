import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rainbowapps.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    { url: `${siteUrl}/trimite`, priority: 0.8 },
    { url: `${siteUrl}/ghid`, priority: 0.6 },
    { url: `${siteUrl}/sustine`, priority: 0.5 },
    { url: `${siteUrl}/colaborare`, priority: 0.5 },
    { url: `${siteUrl}/confidentialitate`, priority: 0.3 },
  ];
}
