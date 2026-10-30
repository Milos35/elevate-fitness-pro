export default {
  phaseLabel: "PHASE {{number}}",
  meta: {
    title: "Program overview — 90-day roadmap",
    description:
      "Three 4-week phases, weekly training schedule, and everything included in BUSY STRONG 90 for busy people 35+.",
  },
  hero: {
    eyebrow: "THE PROGRAM",
    headline: "Your 90-Day",
    headlineHighlight: "Road Map",
    subhead:
      "90 days divided into three distinct 4-week phases, each building on the last. You do not jump phases. You do not skip weeks. Trust the process.",
  },
  phases: [
    {
      number: "01",
      name: "FOUNDATION",
      weeks: "Weeks 1–4",
      description:
        "You are learning the movements, building the habit, and establishing your baseline. Do not go too heavy. Perfect form now saves injury later. Energy will rise. Sleep will improve. Clothes may already feel different.",
      focus: ["Technique", "Habit building", "Baseline nutrition"],
    },
    {
      number: "02",
      name: "INTENSITY",
      weeks: "Weeks 5–8",
      description:
        "Weights go up. Volume increases slightly. You are now comfortable with the movements. This is where visible fat loss accelerates and strength jumps noticeably. Nutrition compliance becomes automatic. People around you start to notice.",
      focus: ["Progressive overload", "Fat loss", "Strength gains"],
    },
    {
      number: "03",
      name: "TRANSFORMATION",
      weeks: "Weeks 9–12",
      description:
        "The final phase. Maximum intensity. You have the habits, the technique, the nutrition. Everything comes together here. Photos taken at week 12 will look nothing like week 1.",
      focus: ["Peak intensity", "Body recomposition", "Permanent lifestyle lock-in"],
    },
  ],
  schedule: {
    title: "Your Weekly",
    titleHighlight: "Schedule",
    subhead: "Same structure for all 12 weeks. Consistency is king.",
    weeklySchedule: [
      { day: "Monday", session: "Training A", duration: "22 min", focus: "Upper Body Push", note: "Priority session — never skip" },
      { day: "Tuesday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "15–20 min walk. Move." },
      { day: "Wednesday", session: "Training B", duration: "22 min", focus: "Lower Body", note: "Heaviest session of the week" },
      { day: "Thursday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "Mobility work optional" },
      { day: "Friday", session: "Training C", duration: "22 min", focus: "Upper Body Pull", note: "End the week strong" },
      { day: "Saturday", session: "10-Min Bonus", duration: "10 min", focus: "Full Body", note: "Optional — use emergency workout" },
      { day: "Sunday", session: "Full Rest", duration: "—", focus: "Recovery", note: "Meal prep + plan next week" },
    ],
    items: [
      { day: "Monday", session: "Training A", duration: "22 min", focus: "Upper Body Push", note: "Priority session — never skip" },
      { day: "Tuesday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "15–20 min walk. Move." },
      { day: "Wednesday", session: "Training B", duration: "22 min", focus: "Lower Body", note: "Heaviest session of the week" },
      { day: "Thursday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "Mobility work optional" },
      { day: "Friday", session: "Training C", duration: "22 min", focus: "Upper Body Pull", note: "End the week strong" },
      { day: "Saturday", session: "10-Min Bonus", duration: "10 min", focus: "Full Body", note: "Optional — use emergency workout" },
      { day: "Sunday", session: "Full Rest", duration: "—", focus: "Recovery", note: "Meal prep + plan next week" },
    ],
  },
  included: {
    title: "Everything",
    titleHighlight: "Included",
    items: [
      "3 Gym Training Programs (A/B/C)",
      "3 Home Training Programs (A/B/C)",
      "4 Emergency 10-Min Workouts",
      "Complete Nutrition Framework",
      "Sample Meal Plans",
      "'Eat Anywhere' Restaurant Guide",
      "Supplement Guide (What to buy & skip)",
      "6-Habit System for Consistency",
      "12-Week Progress Tracking Log",
      "Realistic Progress Timeline",
    ],
    cta: "Get Full Access — {{price}}",
  },
  cta: {
    getFullAccess: "Get Full Access — {{price}}",
  },
} as const;
