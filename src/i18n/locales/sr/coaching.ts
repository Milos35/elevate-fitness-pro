export default {
  meta: {
    title: "Prijavi se za coaching — Coach Milos",
    description: "Prijavite se za trening sa Coach Milos-om. Ograničen broj mesta. Odgovor u roku od 24 sata.",
  },
  back: {
    toCoaching: "Nazad na lični coaching",
    toPlan: "Nazad na {{planName}}",
  },
  heading: {
    eyebrow: "Prijava",
    title: "Prijavi se za trening sa",
    titleHighlight: "Coach Milos-om",
    body:
      "Radim sa ograničenim brojem klijenata istovremeno da svakom mogu posvetiti pažnju koju zaslužuje. Popunite ovu kratku prijavu i javiću vam se u roku od 24 sata.",
  },
  planPicker: {
    applyingFor: "Prijavljujete se za",
    monthlyBilling: "Mesečna naplata · ograničen broj mesta.",
    noPlanBody:
      "Izaberite program da bi vaša prijava bila označena pravim planom i cenom. Možete i otvoriti ovu stranicu sa",
    pricingCards: "kartica cena",
    noPlanBodySuffix: "na početnoj stranici.",
    coachedStrong90: {
      name: "Coached Strong 90",
      tier: "Osnovni coaching · {{price}}",
    },
    privateTransformation: {
      name: "Privatna transformacija",
      tier: "Elitni paket · {{price}}",
    },
  },
  form: {
    moreOptional: "Više o tebi (nije obavezno, pomaže mi da se pripremim za razgovor)",
    firstName: {
      label: "Ime",
      placeholder: "Vaše ime",
    },
    lastName: {
      label: "Prezime",
      placeholder: "Vaše prezime",
    },
    email: {
      label: "Email",
      placeholder: "you@email.com",
    },
    whatsapp: {
      label: "WhatsApp broj",
      placeholder: "+971 50 123 4567",
    },
    location: {
      label: "Gde se nalazite?",
      placeholder: "Grad, država",
    },
    age: {
      label: "Koliko imate godina?",
      placeholder: "Izaberite starosni opseg",
      options: {
        "25-34": "25–34",
        "35-39": "35–39",
        "40-44": "40–44",
        "45-49": "45–49",
        "50+": "50+",
      },
    },
    role: {
      label: "Šta vas najbolje opisuje?",
      placeholder: "Izaberite jedno",
      options: {
        founder: "Vlasnik biznisa / osnivač",
        corporate: "Korporativni profesionalac",
        parent: "Roditelj (kod kuće ili part-time)",
        freelance: "Freelancer / samozaposlen",
        other: "Drugo",
      },
    },
    fitness: {
      label: "Kako biste opisali svoj trenutni nivo fitnesa?",
      options: {
        scratch: {
          title: "Nisam trenirao 6+ meseci",
          subtitle: "Počinjete ispočetka — to je u redu",
        },
        inconsistent: {
          title: "Nekonzistentno — treniram ponekad ali ne mogu da se držim",
          subtitle: "Najčešći odgovor. Niste sami.",
        },
        "no-results": {
          title: "Redovno treniram ali ne vidim rezultate",
          subtitle: "Trud bez sistema. To popravljamo.",
        },
        experienced: {
          title: "Iskusan — treba mi struktura i odgovornost",
          subtitle: "Znate šta da radite, treba vam neko da vas drži odgovornim.",
        },
      },
    },
    goal: {
      label: "Koji je vaš #1 cilj trenutno?",
      hint: "Budite konkretni. „Skinuti stomak i imati energiju da se igram sa decom“ je bolje od „biti fit“.",
      placeholder: "Recite mi šta želite da promenite i zašto vam je važno...",
    },
    triedBefore: {
      label: "Šta ste već probali? Šta nije radilo?",
      hint: "Ovo mi pomaže da razumem šta da uradim drugačije za vas.",
      placeholder: "Članarine u teretanama, lični treneri, aplikacije, programi, dijete...",
    },
    minutes: {
      label: "Koliko minuta dnevno možete realno da posvetite treningu?",
      placeholder: "Budite iskreni — gradim oko toga",
      options: {
        "20-30": "20–30 minuta",
        "30-40": "30–40 minuta",
        "40-60": "40–60 minuta",
        less: "Manje od 20 minuta (razgovaraćemo)",
      },
    },
    anythingElse: {
      label: "Još nešto što želite da znam?",
      hint: "Povrede, zdravstvena stanja, putovanja, dijetetska ograničenja — sve relevantno.",
      placeholder: "Opciono — ali što više znam, bolje mogu da pomognem",
    },
    submit: "Pošalji prijavu",
    submitting: "Slanje…",
    footerNote:
      "Svaku prijavu pregledam lično i odgovaram u roku od 24 sata. Dobićete potvrdni email sa linkom za zakazivanje kratke konsultacije.",
    footerSpamNote: "Nakon slanja, proverite inbox u narednih nekoliko minuta — ako ništa ne stigne, pogledajte u",
    spam: "Spam",
    promotions: "Promotions",
  },
  toast: {
    incompleteTitle: "Popunite sva polja",
    successTitle: "Prijava primljena",
    successDescription:
      "Proverite inbox za potvrdni email sa linkom za zakazivanje konsultacije. Ako ga ne vidite, proverite Spam ili Promotions.",
    errorTitle: "Slanje nije uspelo",
    errorFallback: "Pokušajte ponovo ili pišite na info@ptmilosilic.com.",
    deployError:
      "Forma nije mogla da kontaktira email servis. Proverite da li je sajt deploy-ovan na Vercel-u sa /api/coaching-apply funkcijom, ili pišite direktno na info@ptmilosilic.com.",
    serverError: "Nešto je pošlo po zlu",
    emailNotConfigured: "Email servis nije podešen na serveru (nedostaje RESEND_API_KEY).",
  },
  trust: {
    limitedSpots: "Ograničen broj mesta",
    noCommitment: "Bez obaveze dok ne razgovorimo",
    personalized: "100% personalizovano",
  },
} as const;
