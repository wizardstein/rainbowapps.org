// Single source of truth for site-level constants.
// Flipping AVAILABILITY is a one-line commit; Vercel auto-deploys.

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

export const PROJECTS: Project[] = [
  {
    title: "scoala.beard-brothers.ro",
    description: "Platformă educațională construită pentru un ONG din Cluj.",
    url: "https://scoala.beard-brothers.ro",
  },
  {
    title: "ymarchive.chat",
    description:
      "Cititor de arhive Yahoo Messenger, direct în browser. Nimic nu pleacă de pe calculatorul tău.",
    url: "https://ymarchive.chat",
  },
];
