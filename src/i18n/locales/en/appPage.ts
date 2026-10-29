export default {
  meta: {
    title: "The App — how Busy Strong 90 works",
    description:
      "The Busy Strong 90 member app: your 90-day plan, workouts with video demos, nutrition without a food scale and weekly progress tracking — all on your phone. {{priceOneTime}}.",
  },
  breadcrumb: { home: "Home", current: "The App" },
  hero: {
    eyebrow: "About the app",
    headline: "Your 90 days.",
    headlineHighlight: "One app.",
    subhead:
      "Busy Strong 90 isn't a PDF you forget in a folder. It's an app on your phone that tells you what to do today, shows you how, and tracks the progress — so you never have to guess.",
    screenAlt: "The Busy Strong 90 app — 90-day overview screen",
  },
  facts: [
    { value: "90", label: "Days", note: "12 weeks, 3 phases" },
    { value: "36", label: "Sessions", note: "Every one planned for you" },
    { value: "30–40", label: "Minutes", note: "Per session, start to finish" },
    { value: "3×", label: "Per week", note: "Mon · Wed · Fri" },
  ],
  ticker: [
    "No food scale",
    "Gym or home",
    "10-minute backup sessions",
    "Video demo for every exercise",
    "Weekly progress tracking",
    "Installs on your phone",
    "English · Srpski · العربية",
  ],
  steps: {
    eyebrow: "How it works",
    headline: "From payment to first workout",
    headlineHighlight: "in four steps",
    subhead: "No onboarding calls, no waiting for a plan to be written. You're training the same day.",
    items: [
      {
        title: "Get the program",
        text: "One payment. Create your account and access unlocks instantly — no subscription, no renewal.",
      },
      {
        title: "Add it to your phone",
        text: "Open the site on your phone and add it to your home screen. It opens full-screen, like any other app — iPhone and Android.",
      },
      {
        title: "Follow the week",
        text: "Open the app, see today's session, train, tick it off. Monday, Wednesday, Friday — the plan is already there.",
      },
      {
        title: "Check in on Mondays",
        text: "Log your weight and a short note. The chart shows your trend, so you see progress in numbers, not feelings.",
      },
    ],
  },
  week: {
    eyebrow: "Your weekly plan",
    headline: "Know exactly what to do,",
    headlineHighlight: "every day",
    subhead: "The same A / B / C structure every week, so the habit builds itself. Pick where you train — the plan follows you.",
    modes: { gym: "Gym", home: "Home", quick: "10 min" },
    modesLabel: "Where are you training?",
    optional: "Optional",
    minutes: "{{n}} min",
    days: [
      { day: "Monday", kind: "train", focus: "Chest · Shoulders · Triceps", titles: { gym: "Training A — Upper Body Push", home: "Home A — Upper Body Push", quick: "Push Day" } },
      { day: "Tuesday", kind: "walk", focus: "Active recovery", titles: { gym: "Walk 15–20 min", home: "Walk 15–20 min", quick: "Walk 15–20 min" } },
      { day: "Wednesday", kind: "train", focus: "Quads · Hamstrings · Glutes · Core", titles: { gym: "Training B — Lower Body", home: "Home B — Lower Body", quick: "Leg Day" } },
      { day: "Thursday", kind: "walk", focus: "Mobility optional", titles: { gym: "Walk 15–20 min", home: "Walk 15–20 min", quick: "Walk 15–20 min" } },
      { day: "Friday", kind: "train", focus: "Back · Biceps · Rear delts", titles: { gym: "Training C — Upper Body Pull", home: "Home C — Upper Body Pull + Core", quick: "Pull Day" } },
      { day: "Saturday", kind: "bonus", focus: "Full body", titles: { gym: "10-minute bonus", home: "10-minute bonus", quick: "Full Body Blast" } },
      { day: "Sunday", kind: "rest", focus: "Plan next week", titles: { gym: "Rest day", home: "Rest day", quick: "Rest day" } },
    ],
    points: [
      { title: "Same structure every week", text: "A, B, C — push, legs, pull. You stop thinking about what to train and just show up." },
      { title: "30–40 minutes", text: "Short enough to fit before the family wakes up or between calls. Every set has a purpose." },
      { title: "Gym or home, one tap", text: "Travelling or stuck at home? Switch to the home or 10-minute version and the week still counts." },
      { title: "Progress moves with you", text: "Every session you tick off moves your 90-day progress forward — you always see how far you've come." },
    ],
  },
  roadmap: {
    eyebrow: "The 12-week roadmap",
    headline: "Three phases.",
    headlineHighlight: "One direction.",
    subhead: "The app always shows which phase you're in and what it's for — so week 7 never feels like week 1.",
    phases: [
      {
        weeks: "Weeks 1–4",
        name: "Foundation",
        text: "Learn the movements, build the habit, set your baseline. Perfect form now saves injuries later — energy and sleep start to improve.",
        focus: ["Technique", "Habit building", "Baseline nutrition"],
      },
      {
        weeks: "Weeks 5–8",
        name: "Intensity",
        text: "Weights go up, volume rises slightly. This is where fat loss speeds up and strength jumps — and people around you start to notice.",
        focus: ["Progressive overload", "Fat loss", "Strength gains"],
      },
      {
        weeks: "Weeks 9–12",
        name: "Transformation",
        text: "Everything comes together: habits, technique, nutrition. The highest intensity of the program, and the photos to prove it.",
        focus: ["Peak intensity", "Body recomposition", "Lifestyle lock-in"],
      },
    ],
  },
  features: {
    eyebrow: "Built for busy fathers",
    headline: "Everything a busy week needs,",
    headlineHighlight: "nothing it doesn't",
    items: [
      { stat: "0", title: "Food scales", text: "Three simple nutrition rules, a sample day of meals and how to eat out. No counting app." },
      { stat: "10", title: "Minute backup", text: "Bad week? A 10-minute emergency workout keeps the streak alive instead of skipping." },
      { stat: "1×", title: "Weekly check-in", text: "Monday weight and a short note. Two minutes, and you know the trend." },
      { stat: "24/7", title: "On your phone", text: "Installs to your home screen and opens full-screen. Your plan is wherever you are." },
      { stat: "1", title: "Daily nudge", text: "Turn on a daily motivation message on your phone so the plan doesn't slip on busy days." },
      { stat: "3", title: "Languages", text: "English, Serbian and Arabic — switch in one tap, the whole app follows." },
    ],
  },
  cta: {
    eyebrow: "Busy Strong 90",
    headline: "Stop guessing.",
    headlineHighlight: "Start this week.",
    body: "The full 90-day program, the app and every update — one payment, lifetime access.",
  },
} as const;
