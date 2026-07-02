// Site-level constants. Since the admin section (TODO §5), AVAILABILITY and
// PROJECTS live in the database and are edited at /admin — the values below
// are FALLBACKS used when the DB is unreachable (see lib/content.ts).

export type Availability = "green" | "amber";

export const AVAILABILITY: Availability = "green";

export const STATUS: Record<Availability, { label: string }> = {
  green: { label: "Disponibil — primesc idei noi și răspund repede." },
  amber: { label: "Construiesc acum — poți trimite o idee, dar intri la coadă." },
};

// Revolut Business payment link for donations (accountant-approved,
// 2026-07-02). Empty string hides the donation card everywhere.
export const DONATION_URL = "";

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
