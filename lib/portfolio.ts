import type { StaticImageData } from "next/image";
import previewScoala from "@/public/previews/scoala.jpg";
import previewJoaca from "@/public/previews/joaca.jpg";
import previewYmarchive from "@/public/previews/ymarchive.jpg";
import previewDonfitway from "@/public/previews/donfitway.jpg";
import previewNsfab from "@/public/previews/nsfab.jpg";
import previewBbapp from "@/public/previews/bbapp.jpg";
import previewVreaumate from "@/public/previews/vreaumate.jpg";
import previewVreaumateApp from "@/public/previews/vreaumate-app.jpg";
import {
  PROJECT_VALUE,
  projectKey,
  projectPlatform,
  projectSlug,
  projectTags,
  type Project,
  type ProjectPlatform,
} from "@/lib/site";

// A portfolio project with everything the pages show about it: the DB row
// (title, description, url) plus the hand-written data from lib/site.ts,
// looked up by projectKey. Used by the deck on / and the grid on /proiecte.
export type PortfolioItem = {
  slug: string;
  title: string;
  description: string;
  url: string;
  preview?: StaticImageData;
  features: string[];
  platform: ProjectPlatform;
  tags: string[];
  /** Short label on a deck card: "iOS · Android", "Site web", … */
  kind: string;
};

// Static screenshots of the finished apps (public/previews), keyed by
// projectKey like the rest of the hand-written data. Apps without one fall
// back to a plain card with the logo.
const PREVIEWS: Record<string, StaticImageData> = {
  "scoala.beard-brothers.ro": previewScoala,
  "joaca.beard-brothers.ro": previewJoaca,
  "ymarchive.chat": previewYmarchive,
  "donfitway.ro": previewDonfitway,
  "nightshiftfabrications.ro": previewNsfab,
  "app.beard-brothers.ro": previewBbapp,
  "vreaumate.online": previewVreaumate,
  "vreaumate.online/aplicatie": previewVreaumateApp,
};

export function portfolioItems(projects: Project[]): PortfolioItem[] {
  return projects.map((project) => {
    const key = projectKey(project.url);
    const platform = projectPlatform(key);
    const tags = projectTags(key);
    return {
      ...project,
      slug: projectSlug(key),
      preview: key ? PREVIEWS[key] : undefined,
      features: (key && PROJECT_VALUE[key]?.features) || [],
      platform,
      tags,
      kind: platform.kind === "app" ? "iOS · Android" : (tags[0] ?? "Site web"),
    };
  });
}
