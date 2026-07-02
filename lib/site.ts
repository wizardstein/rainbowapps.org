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
