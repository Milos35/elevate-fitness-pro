export default {
  meta: {
    title: "Aplikacija — kako Busy Strong 90 radi",
    description:
      "Busy Strong 90 aplikacija za članove: tvoj plan za 90 dana, treninzi sa video demonstracijama, ishrana bez vage i nedeljno praćenje napretka — sve na telefonu. {{priceOneTime}}.",
  },
  breadcrumb: { home: "Početna", current: "Aplikacija" },
  hero: {
    eyebrow: "O aplikaciji",
    headline: "Tvojih 90 dana.",
    headlineHighlight: "Jedna aplikacija.",
    subhead:
      "Busy Strong 90 nije PDF koji zaboraviš u folderu. To je aplikacija na telefonu koja ti kaže šta da radiš danas, pokaže kako i prati napredak — da nikad ne moraš da nagađaš.",
    screenAlt: "Busy Strong 90 aplikacija — pregled 90 dana",
  },
  facts: [
    { value: "90", label: "Dana", note: "12 nedelja, 3 faze" },
    { value: "36", label: "Treninga", note: "Svaki unapred isplaniran" },
    { value: "30–40", label: "Minuta", note: "Po treningu, od početka do kraja" },
    { value: "3×", label: "Nedeljno", note: "Pon · Sre · Pet" },
  ],
  ticker: [
    "Bez vage za hranu",
    "Teretana ili kuća",
    "Rezervni treninzi od 10 minuta",
    "Video za svaku vežbu",
    "Nedeljno praćenje napretka",
    "Instalira se na telefon",
    "English · Srpski · العربية",
  ],
  steps: {
    eyebrow: "Kako radi",
    headline: "Od uplate do prvog treninga",
    headlineHighlight: "u četiri koraka",
    subhead: "Bez uvodnih poziva i bez čekanja da ti neko napiše plan. Treniraš isti dan.",
    items: [
      {
        title: "Uzmi program",
        text: "Jedna uplata. Napravi nalog i pristup se otključava odmah — bez pretplate, bez obnavljanja.",
      },
      {
        title: "Dodaj ga na telefon",
        text: "Otvori sajt na telefonu i dodaj ga na početni ekran. Otvara se preko celog ekrana, kao svaka druga aplikacija — iPhone i Android.",
      },
      {
        title: "Prati nedelju",
        text: "Otvoriš aplikaciju, vidiš današnji trening, odradiš, čekiraš. Ponedeljak, sreda, petak — plan je već tu.",
      },
      {
        title: "Ponedeljkom check-in",
        text: "Upiši kilažu i kratku belešku. Grafikon pokazuje trend, pa napredak vidiš u brojevima, a ne po osećaju.",
      },
    ],
  },
  week: {
    eyebrow: "Tvoj nedeljni plan",
    headline: "Znaš tačno šta radiš,",
    headlineHighlight: "svaki dan",
    subhead: "Ista A / B / C struktura svake nedelje, pa se navika gradi sama. Izaberi gde treniraš — plan ide za tobom.",
    modes: { gym: "Teretana", home: "Kuća", quick: "10 min" },
    modesLabel: "Gde treniraš?",
    optional: "Opciono",
    minutes: "{{n}} min",
    days: [
      { day: "Ponedeljak", kind: "train", focus: "Grudi · Ramena · Triceps", titles: { gym: "Trening A — Gornji deo, guranje", home: "Kuća A — Gornji deo, guranje", quick: "Push dan" } },
      { day: "Utorak", kind: "walk", focus: "Aktivni oporavak", titles: { gym: "Šetnja 15–20 min", home: "Šetnja 15–20 min", quick: "Šetnja 15–20 min" } },
      { day: "Sreda", kind: "train", focus: "Kvadricepsi · Zadnja loža · Gluteus · Core", titles: { gym: "Trening B — Noge", home: "Kuća B — Noge", quick: "Dan za noge" } },
      { day: "Četvrtak", kind: "walk", focus: "Mobilnost po želji", titles: { gym: "Šetnja 15–20 min", home: "Šetnja 15–20 min", quick: "Šetnja 15–20 min" } },
      { day: "Petak", kind: "train", focus: "Leđa · Biceps · Zadnja ramena", titles: { gym: "Trening C — Gornji deo, vučenje", home: "Kuća C — Vučenje + Core", quick: "Pull dan" } },
      { day: "Subota", kind: "bonus", focus: "Celo telo", titles: { gym: "Bonus od 10 minuta", home: "Bonus od 10 minuta", quick: "Full Body Blast" } },
      { day: "Nedelja", kind: "rest", focus: "Isplaniraj sledeću nedelju", titles: { gym: "Dan odmora", home: "Dan odmora", quick: "Dan odmora" } },
    ],
    points: [
      { title: "Ista struktura svake nedelje", text: "A, B, C — guranje, noge, vučenje. Prestaneš da razmišljaš šta treniraš i samo dođeš." },
      { title: "30–40 minuta", text: "Dovoljno kratko da stane pre nego što se porodica probudi ili između sastanaka. Svaka serija ima svrhu." },
      { title: "Teretana ili kuća, jednim klikom", text: "Na putu si ili ne možeš iz kuće? Prebaci na kućnu ili verziju od 10 minuta i nedelja se i dalje računa." },
      { title: "Napredak ide sa tobom", text: "Svaki čekiran trening pomera tvoj napredak kroz 90 dana — uvek vidiš koliko si odmakao." },
    ],
  },
  roadmap: {
    eyebrow: "Plan za 12 nedelja",
    headline: "Tri faze.",
    headlineHighlight: "Jedan pravac.",
    subhead: "Aplikacija uvek pokazuje u kojoj si fazi i čemu ona služi — pa 7. nedelja nikad ne liči na prvu.",
    phases: [
      {
        weeks: "Nedelje 1–4",
        name: "Temelj",
        text: "Učiš pokrete, gradiš naviku i postavljaš početnu tačku. Savršena tehnika sada čuva od povreda kasnije — energija i san počinju da se popravljaju.",
        focus: ["Tehnika", "Građenje navike", "Osnove ishrane"],
      },
      {
        weeks: "Nedelje 5–8",
        name: "Intenzitet",
        text: "Kilaže rastu, obim lagano raste. Ovde se gubitak masti ubrzava, snaga skače — i ljudi oko tebe počinju da primećuju.",
        focus: ["Progresivno opterećenje", "Gubitak masti", "Rast snage"],
      },
      {
        weeks: "Nedelje 9–12",
        name: "Transformacija",
        text: "Sve se spaja: navike, tehnika, ishrana. Najveći intenzitet u programu — i fotografije koje to dokazuju.",
        focus: ["Vrhunski intenzitet", "Rekompozicija tela", "Trajne navike"],
      },
    ],
  },
  features: {
    eyebrow: "Napravljeno za zauzete očeve",
    headline: "Sve što zauzeta nedelja traži,",
    headlineHighlight: "ništa višak",
    items: [
      { stat: "0", title: "Vaga za hranu", text: "Tri jednostavna pravila ishrane, primer dana sa obrocima i kako da jedeš napolju. Bez aplikacije za brojanje." },
      { stat: "10", title: "Minuta rezerva", text: "Loša nedelja? Hitni trening od 10 minuta čuva kontinuitet umesto da preskočiš." },
      { stat: "1×", title: "Nedeljni check-in", text: "Kilaža ponedeljkom i kratka beleška. Dva minuta, i znaš trend." },
      { stat: "24/7", title: "Na telefonu", text: "Instalira se na početni ekran i otvara preko celog ekrana. Plan je gde si i ti." },
      { stat: "1", title: "Dnevni podsetnik", text: "Uključi dnevnu motivacionu poruku na telefonu da plan ne sklizne u gužvi." },
      { stat: "3", title: "Jezika", text: "Engleski, srpski i arapski — promeniš jednim klikom, cela aplikacija prati." },
    ],
  },
  cta: {
    eyebrow: "Busy Strong 90",
    headline: "Prestani da nagađaš.",
    headlineHighlight: "Počni ove nedelje.",
    body: "Ceo program od 90 dana, aplikacija i sva ažuriranja — jedna uplata, doživotni pristup.",
  },
} as const;
