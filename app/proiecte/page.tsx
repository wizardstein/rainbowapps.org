import type { Metadata } from "next";
import Image from "next/image";
import ArcMark from "@/components/ArcMark";
import IdeaBand from "@/components/IdeaBand";
import { getProjects } from "@/lib/content";
import { portfolioItems, type PortfolioItem } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Ce am construit — RainbowApps",
  description:
    "Aplicațiile de telefon și site-urile pe care le-am construit până acum, cu linkuri către fiecare.",
  alternates: { canonical: "/proiecte" },
};

/** Every project, grouped into phone apps and web (owner redesign,
 *  2026-11-06): reached from the header, never shown on the homepage, where
 *  the deck is the way through them. */
export default async function ProiectePage() {
  const items = portfolioItems(await getProjects());
  const mobile = items.filter((item) => item.platform.kind === "app");
  const web = items.filter((item) => item.platform.kind !== "app");

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 px-4 pt-14 pb-20 sm:gap-[72px] sm:px-8 sm:pt-[72px] sm:pb-24">
        <h1 className="font-display text-[clamp(44px,5.6vw,80px)] font-semibold leading-none tracking-[-0.04em] text-ink">
          Ce am construit
        </h1>

        {mobile.length > 0 && (
          <Group
            id="pe-telefon"
            title="Aplicații de telefon"
            note={`iOS și Android · ${mobile.length}`}
            items={mobile}
            large
          />
        )}
        {web.length > 0 && (
          <Group
            id="pe-web"
            title="Site-uri și aplicații web"
            note={`în browser · ${web.length}`}
            items={web}
          />
        )}
      </div>

      <IdeaBand />
    </main>
  );
}

function Group({
  id,
  title,
  note,
  items,
  large = false,
}: {
  id: string;
  title: string;
  note: string;
  items: PortfolioItem[];
  large?: boolean;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-7">
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-b border-rule pb-3.5">
        <h2
          id={id}
          className="font-display text-[clamp(28px,2.8vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink"
        >
          {title}
        </h2>
        <span className="text-base font-medium text-ink-muted">{note}</span>
      </div>
      <div
        className={`grid gap-6 ${
          large
            ? "grid-cols-[repeat(auto-fit,minmax(min(460px,100%),1fr))]"
            : "grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))]"
        }`}
      >
        {items.map((item) => (
          <ProjectCard key={item.url} item={item} large={large} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ item, large }: { item: PortfolioItem; large: boolean }) {
  return (
    <article
      id={item.slug}
      className="flex flex-col gap-4 rounded-[22px] border border-line bg-surface p-3.5 pb-6 sm:p-4 sm:pb-6"
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Deschide ${item.title}`}
        className="block aspect-[4/3] overflow-hidden rounded-[14px] bg-crem"
      >
        {item.preview ? (
          <Image
            src={item.preview}
            alt=""
            placeholder="blur"
            sizes={large ? "(min-width: 1024px) 560px, 92vw" : "(min-width: 1024px) 370px, 92vw"}
            className="size-full object-cover object-top"
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <ArcMark className="h-10 opacity-60" />
          </span>
        )}
      </a>
      <div className="flex flex-col gap-3 px-1.5 sm:px-2">
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <h3
          className={`font-display font-semibold tracking-[-0.02em] text-ink ${
            large ? "text-[26px] leading-[1.15]" : "text-[22px] leading-[1.2]"
          }`}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-colors hover:text-blue"
          >
            {item.title}{" "}
            <span
              aria-hidden="true"
              className="inline-block font-medium text-ink-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </h3>
        <p className="text-[15px] leading-[1.55] text-ink-soft sm:text-base">
          {item.description}
        </p>
        {item.platform.kind === "app" && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[
              { label: "App Store", href: item.platform.appStore },
              { label: "Google Play", href: item.platform.googlePlay },
            ].map((store) => (
              <a
                key={store.label}
                href={store.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-soft"
              >
                {store.label}
                <span aria-hidden="true" className="text-ink-faint">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
