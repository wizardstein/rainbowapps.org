// Site-level constants. Since the admin section (TODO §5), AVAILABILITY and
// PROJECTS live in the database and are edited at /admin — the values below
// are FALLBACKS used when the DB is unreachable (see lib/content.ts).

export type Availability = "green" | "amber";

export const AVAILABILITY: Availability = "green";

export const STATUS: Record<Availability, { label: string }> = {
  green: { label: "Disponibil — primesc idei noi și răspund repede." },
  amber: { label: "Construiesc acum — poți trimite o idee, dar intri la coadă." },
};

export type Project = {
  title: string;
  description: string;
  url: string;
};

// Owner convention (2026-07-03): every app keeps its own node color in the
// arc, mapped by hostname. New apps claim a free node — add them here.
// ymarchive gets violet because it already wears Yahoo's purple (#6f2da8).
export const PROJECT_NODE_COLORS: Record<string, string> = {
  "scoala.beard-brothers.ro": "#E2574C", // coral
  "joaca.beard-brothers.ro": "#F0933D", // portocaliu
  "ymarchive.chat": "#8B66C6", // violet
};

export function projectNodeColor(url: string, fallback: string): string {
  try {
    return PROJECT_NODE_COLORS[new URL(url).hostname] ?? fallback;
  } catch {
    return fallback;
  }
}

export const PROJECTS: Project[] = [
  {
    title: "scoala.beard-brothers.ro",
    description:
      "Site-ul campaniei prin care un ONG din Cluj construiește o școală, cărămidă cu cărămidă.",
    url: "https://scoala.beard-brothers.ro",
  },
  {
    title: "joaca.beard-brothers.ro",
    description:
      "Joc în browser făcut pentru aceeași campanie: prinzi cărămizi, ocolești prejudecăți.",
    url: "https://joaca.beard-brothers.ro",
  },
  {
    title: "ymarchive.chat",
    description:
      "Cititor de arhive Yahoo Messenger, direct în browser. Nimic nu pleacă de pe calculatorul tău.",
    url: "https://ymarchive.chat",
  },
];
