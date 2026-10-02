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

// "Cât ar fi costat / cât ar fi durat" figures shown in the portfolio, keyed by
// hostname (see PROJECT_VALUE). These are hand-written market estimates, kept
// out of the DB on purpose — not owner-editable content.
export type ProjectValue = {
  cost: string;
  time: string;
  features: string[];
};

// What kind of thing a portfolio project is. Web sites are the default; native
// apps carry their store links. Keyed by hostname like PROJECT_VALUE —
// hand-written, not owner-editable content.
export type ProjectPlatform =
  | { kind: "web" }
  | { kind: "app"; appStore: string; googlePlay: string };

export const PROJECT_PLATFORM: Record<string, ProjectPlatform> = {
  "app.beard-brothers.ro": {
    kind: "app",
    appStore: "https://apps.apple.com/ro/app/id6789177473",
    googlePlay: "https://play.google.com/store/apps/details?id=ro.beardbrothers.app",
  },
};

export function projectPlatform(host: string | null): ProjectPlatform {
  return (host && PROJECT_PLATFORM[host]) || { kind: "web" };
}

// Lower bound of a cost range like "~70.000–100.000 €", in euro. Used to add up
// the "cât ar fi costat" band under the hero.
export function costFloorEur(cost: string): number {
  const m = cost.match(/\d{1,3}(?:\.\d{3})*/);
  return m ? Number(m[0].replace(/\./g, "")) : 0;
}

// Used to key the static preview screenshots in public/previews.
export function projectHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export const PROJECTS: Project[] = [
  {
    title: "Beard Brothers — aplicația de voluntariat",
    description:
      "Aplicația de voluntariat a unui ONG din Cluj: proiecte, check-in pe teren, chat, contracte și certificate, direct pe telefon.",
    url: "https://app.beard-brothers.ro",
  },
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
  {
    title: "donfitway.ro",
    description:
      "Site-ul unui antrenor personal din Cluj: pachete, transformări și programare direct pe WhatsApp.",
    url: "https://www.donfitway.ro",
  },
  {
    title: "nightshiftfabrications.ro",
    description:
      "Site pentru un atelier de fabricație din Cluj: galerie de lucrări, cerere de ofertă și un panou propriu de administrare.",
    url: "https://nightshiftfabrications.ro",
  },
];

// Value figures keyed by hostname (projectHostname), like the preview
// screenshots. A missing entry simply hides the value block for that project.
export const PROJECT_VALUE: Record<string, ProjectValue> = {
  "app.beard-brothers.ro": {
    cost: "~160.000–240.000 €",
    time: "~10–12 luni, în echipă",
    features: [
      "Aceeași aplicație pe iPhone, Android și web, publicată în App Store și Google Play. Actualizările ajung fără reinstalare.",
      "Voluntarii își semnează contractul direct pe telefon și primesc certificate de voluntariat în PDF, conforme cu Legea 78/2014.",
      "Check-in automat: telefonul observă când ajungi la locul proiectului și îți propune pontajul. Merge și cu cod QR.",
      "Chat complet pentru echipă, în timp real: canale, mesaje private, fire de discuție, sondaje, poze și video.",
      "Merge și fără semnal: ce scrii se salvează pe telefon și pleacă singur când revine conexiunea. Notificările chiar ajung.",
    ],
  },
  "scoala.beard-brothers.ro": {
    cost: "~70.000–100.000 €",
    time: "~9–10 luni, în echipă",
    features: [
      "Un model 3D al școlii, cărămidă cu cărămidă — te plimbi prin clădire direct în browser.",
      "O cărămidă nu se vinde niciodată de două ori, chiar și când donează sute de oameni în același minut.",
      "Cele 12.012 cărămizi sunt așezate după planurile reale ale clădirii.",
      "Plăți reale, cu chitanță pe e-mail și certificat cu cod de verificare.",
      "Panou de administrare complet, ca banii oamenilor să fie mereu în regulă.",
    ],
  },
  "joaca.beard-brothers.ro": {
    cost: "~15.000–22.000 €",
    time: "~6–9 săptămâni",
    features: [
      "Motor de joc scris de la zero — perspectivă, mișcare, senzație de joc adevărat, nu un șablon.",
      "Tot sunetul e făcut din cod, fără fișiere audio — și merge inclusiv pe iPhone, cu butonul silențios pornit.",
      "Toată grafica e desenată în cod: roaba, cărămizile, cele 14 iconițe.",
      "Butonul de distribuire merge și în Facebook sau Instagram, unde de obicei se blochează.",
      "Se joacă în română și engleză, cu tot textul tradus cu grijă, nu pe jumătate.",
    ],
  },
  "ymarchive.chat": {
    cost: "~18.000–25.000 €",
    time: "~2–3 luni",
    features: [
      "Citește formatul vechi de arhivă Yahoo, descâlcit byte cu byte — nu există unealtă gata-făcută pentru asta.",
      "Totul se întâmplă pe calculatorul tău; nicio conversație nu pleacă nicăieri — poți verifica singur.",
      "Merge lin și la mii de mesaje, fără să înghețe browserul.",
      "Îți exporți conversațiile într-un PDF frumos, cu cuprins pe luni.",
      "Mesajele apar exact cum le-ai scris atunci — cu diacriticele la locul lor, nu semne stricate.",
    ],
  },
  "donfitway.ro": {
    cost: "~9.000–16.000 €",
    time: "~6–9 săptămâni, în echipă",
    features: [
      "Pagină de prezentare gândită să transforme vizitatorii în clienți.",
      "Clienții scriu direct pe WhatsApp, dintr-o atingere.",
      "Galerie de transformări înainte/după, cu pachete și prețuri clare.",
      "Panou propriu: schimbă texte, poze și prețuri singur, fără programator.",
      "Recenzii cu aprobare și cererile clienților, toate într-un loc.",
    ],
  },
  "nightshiftfabrications.ro": {
    cost: "~12.000–19.000 €",
    time: "~2–3 luni",
    features: [
      "Barna își schimbă singur tot ce apare pe site — poze, prețuri, noutăți, recenzii — dintr-un panou privat, fără să depindă de nimeni.",
      "Galeria adună peste 130 de poze din lucrări reale, aranjate pe camere; la un clic, fiecare se deschide mare și o poți răsfoi cu degetul sau din tastatură.",
      "Când cineva cere o ofertă, completează un formular scurt care se adaptează după cum e persoană fizică sau firmă, iar cererea ajunge direct pe mail.",
      "Pozele urcate din panou se micșorează și se optimizează singure, așa că site-ul rămâne rapid chiar și cu sute de imagini.",
      "Pagina de pornire prezintă atelierul cap-coadă — lucrări, cifre, recenzii și pașii de lucru — clar și rapid pe telefon.",
    ],
  },
};
