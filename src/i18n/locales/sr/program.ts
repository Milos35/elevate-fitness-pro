export default {
  phaseLabel: "FAZA {{number}}",
  meta: {
    title: "Pregled programa — 90-dnevni roadmap",
    description:
      "Tri 4-nedeljne faze, nedeljni raspored treninga i sve što je uključeno u BUSY STRONG 90 za zaposlene ljude 35+.",
  },
  hero: {
    eyebrow: "PROGRAM",
    headline: "Vaš 90-dnevni",
    headlineHighlight: "roadmap",
    subhead:
      "90 dana podeljeno u tri različite 4-nedeljne faze, svaka gradi na prethodnoj. Ne preskačete faze. Ne preskačete nedelje. Verujte procesu.",
  },
  phases: [
    {
      number: "01",
      name: "FOUNDATION",
      weeks: "Nedelje 1–4",
      description:
        "Učite pokrete, gradite naviku i uspostavljate bazu. Ne idite preteško. Savršena forma sada sprečava povrede kasnije. Energija će rasti. San će se poboljšati. Odeća možda već izgleda drugačije.",
      focus: ["Tehnika", "Izgradnja navike", "Bazna ishrana"],
    },
    {
      number: "02",
      name: "INTENSITY",
      weeks: "Nedelje 5–8",
      description:
        "Težine rastu. Obim se blago povećava. Sada vam pokreti leže. Ovde vidljivi gubitak masti ubrzava i snaga skače primetno. Usklađenost ishrane postaje automatska. Ljudi oko vas počinju da primete.",
      focus: ["Progresivno opterećenje", "Gubitak masti", "Dobici u snazi"],
    },
    {
      number: "03",
      name: "TRANSFORMATION",
      weeks: "Nedelje 9–12",
      description:
        "Finalna faza. Maksimalan intenzitet. Imate navike, tehniku, ishranu. Sve se ovde spaja. Fotografije sa nedelje 12 neće ličiti na nedelju 1.",
      focus: ["Vrhunski intenzitet", "Rekompozicija tela", "Trajni životni stil"],
    },
  ],
  schedule: {
    title: "Vaš nedeljni",
    titleHighlight: "raspored",
    subhead: "Ista struktura svih 12 nedelja. Konzistentnost je kralj.",
    weeklySchedule: [
      { day: "Ponedeljak", session: "Trening A", duration: "22 min", focus: "Gornji deo — guranje", note: "Prioritetna sesija — nikad ne preskačite" },
      { day: "Utorak", session: "Odmor / šetnja", duration: "20 min", focus: "Aktivni oporavak", note: "15–20 min šetnje. Pomerite se." },
      { day: "Sreda", session: "Trening B", duration: "22 min", focus: "Donji deo", note: "Najteža sesija u nedelji" },
      { day: "Četvrtak", session: "Odmor / šetnja", duration: "20 min", focus: "Aktivni oporavak", note: "Mobilnost opciono" },
      { day: "Petak", session: "Trening C", duration: "22 min", focus: "Gornji deo — povlačenje", note: "Završite nedelju jako" },
      { day: "Subota", session: "10-min bonus", duration: "10 min", focus: "Celo telo", note: "Opciono — koristite hitni trening" },
      { day: "Nedelja", session: "Potpuni odmor", duration: "—", focus: "Oporavak", note: "Meal prep + plan za sledeću nedelju" },
    ],
    items: [
      { day: "Ponedeljak", session: "Trening A", duration: "22 min", focus: "Gornji deo — guranje", note: "Prioritetna sesija — nikad ne preskačite" },
      { day: "Utorak", session: "Odmor / šetnja", duration: "20 min", focus: "Aktivni oporavak", note: "15–20 min šetnje. Pomerite se." },
      { day: "Sreda", session: "Trening B", duration: "22 min", focus: "Donji deo", note: "Najteža sesija u nedelji" },
      { day: "Četvrtak", session: "Odmor / šetnja", duration: "20 min", focus: "Aktivni oporavak", note: "Mobilnost opciono" },
      { day: "Petak", session: "Trening C", duration: "22 min", focus: "Gornji deo — povlačenje", note: "Završite nedelju jako" },
      { day: "Subota", session: "10-min bonus", duration: "10 min", focus: "Celo telo", note: "Opciono — koristite hitni trening" },
      { day: "Nedelja", session: "Potpuni odmor", duration: "—", focus: "Oporavak", note: "Meal prep + plan za sledeću nedelju" },
    ],
  },
  included: {
    title: "Sve",
    titleHighlight: "uključeno",
    items: [
      "3 Gym programa treninga (A/B/C)",
      "3 Domaća programa treninga (A/B/C)",
      "4 Hitna 10-min vežbanja",
      "Kompletan okvir ishrane",
      "Primeri planova obroka",
      "'Eat Anywhere' vodič za restorane",
      "Suplement vodič (šta kupiti i preskočiti)",
      "Sistem od 6 navika za konzistentnost",
      "Dnevnik praćenja napretka 12 nedelja",
      "Realistična vremenska linija napretka",
    ],
    cta: "Pun pristup — {{price}}",
  },
  cta: {
    getFullAccess: "Pun pristup — {{price}}",
  },
} as const;
