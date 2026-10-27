/**
 * BUSY STRONG 90 — structured content from the official program manual (PDF source of truth).
 */

export type Exercise = {
  order: number;
  name: string;
  target: string;
  sets: string;
  reps: string;
  rest: string;
  tip: string;
  /** Legacy public URL under `/public`. Prefer `demoVideoPath` for Supabase Storage. */
  demoVideoSrc?: string;
  /** Path in Supabase `workout-demos` bucket (members with program access only). */
  demoVideoPath?: string;
  /** Multiple demo clips (e.g. equipment variations V1 / V2). */
  demoVideoPaths?: WorkoutDemoClip[];
  /** Skip dead air at the start of a single demo clip (seconds). */
  demoVideoStartSec?: number;
};

export type WorkoutDemoClip = {
  label: string;
  path: string;
  /** Skip dead air at the start of this clip (seconds). */
  startSec?: number;
};

export function getExerciseDemoClips(ex: Exercise): WorkoutDemoClip[] {
  if (ex.demoVideoPaths?.length) return ex.demoVideoPaths;
  if (ex.demoVideoPath) {
    return [{ label: "Demo", path: ex.demoVideoPath, startSec: ex.demoVideoStartSec }];
  }
  return [];
}

export function exerciseHasDemo(ex: Exercise): boolean {
  return getExerciseDemoClips(ex).length > 0 || Boolean(ex.demoVideoSrc);
}

export type WorkoutPlan = {
  id: "a" | "b" | "c";
  code: string;
  title: string;
  focus: string;
  warmup: string;
  exercises: Exercise[];
  finisher: string;
};

export const programMeta = {
  name: "BUSY STRONG 90",
  tagline: "90 Days. 3x/Week. Weight down. Energy back.",
  audience: "Busy fathers 35+ in Dubai & the UAE",
  sessionsPerWeek: 3,
  sessionLength: "30–40 minutes",
  priceLaunchAed: 407,
  coach: { name: "Coach Milos", handle: "@_coachmilos" },
  quote: "You don't need to suffer more. You need to suffer smarter.",
} as const;

export const phases = [
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
] as const;

export const weeklySchedule = [
  { day: "Monday", session: "Training A", duration: "35 min", focus: "Upper Body Push", note: "Priority session — never skip" },
  { day: "Tuesday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "15–20 min walk. Move." },
  { day: "Wednesday", session: "Training B", duration: "40 min", focus: "Lower Body", note: "Heaviest session of the week" },
  { day: "Thursday", session: "Rest / Walk", duration: "20 min", focus: "Active Recovery", note: "Mobility work optional" },
  { day: "Friday", session: "Training C", duration: "35 min", focus: "Upper Body Pull", note: "End the week strong" },
  { day: "Saturday", session: "10-Min Bonus", duration: "10 min", focus: "Full Body", note: "Optional — use emergency workout" },
  { day: "Sunday", session: "Full Rest", duration: "—", focus: "Recovery", note: "Meal prep + plan next week" },
] as const;

export const gymWorkouts: Record<WorkoutPlan["id"], WorkoutPlan> = {
  a: {
    id: "a",
    code: "gym-a",
    title: "TRAINING A — UPPER BODY PUSH",
    focus: "Chest · Shoulders · Triceps",
    warmup: "5 min: Arm circles, band pull-aparts, 10 push-ups",
    exercises: [
      {
        order: 1,
        name: "Barbell / Dumbbell Bench Press",
        target: "Chest, Shoulders, Triceps",
        sets: "4",
        reps: "6–8",
        rest: "90s",
        tip: "Keep shoulder blades retracted. Control the descent for 2 sec.",
        demoVideoPath: "gym/a/01-bench-press.mp4",
      },
      {
        order: 2,
        name: "Overhead Press (DB or BB)",
        target: "Shoulders, Triceps",
        sets: "3",
        reps: "8–10",
        rest: "75s",
        tip: "Brace your core. Don't lean back — keep ribs down.",
        demoVideoPath: "gym/a/02-overhead-press.mp4",
      },
      {
        order: 3,
        name: "Incline Dumbbell Press",
        target: "Upper Chest",
        sets: "3",
        reps: "10–12",
        rest: "60s",
        tip: "Set bench to 30–45°. Full stretch at bottom, squeeze at top.",
        demoVideoPath: "gym/a/03-incline-dumbbell-press.mp4",
      },
      {
        order: 4,
        name: "Lateral Raises",
        target: "Side Delts",
        sets: "3",
        reps: "12–15",
        rest: "45s",
        tip: "Lead with elbows, not wrists. Slight forward lean is fine.",
        demoVideoPath: "gym/a/04-lateral-raises.mp4",
      },
      {
        order: 5,
        name: "Cable / Band Tricep Pushdown",
        target: "Triceps",
        sets: "3",
        reps: "12–15",
        rest: "45s",
        tip: "Keep elbows tucked. Squeeze hard at full extension.",
        demoVideoPath: "gym/a/05-tricep-pushdown.mp4",
        /** Remove after running: npm run retrim:tricep-pushdown */
        demoVideoStartSec: 2,
      },
    ],
    finisher: "2 min: Max push-ups (bodyweight). Rest 60s. Done.",
  },
  b: {
    id: "b",
    code: "gym-b",
    title: "TRAINING B — LOWER BODY",
    focus: "Quads · Hamstrings · Glutes · Core",
    warmup: "5 min: Hip circles, bodyweight squats x15, leg swings",
    exercises: [
      {
        order: 1,
        name: "Barbell Squat / Goblet Squat",
        target: "Quads, Glutes, Core",
        sets: "4",
        reps: "6–8",
        rest: "2 min",
        tip: "Depth below parallel. Chest up, knees track over toes.",
        demoVideoPath: "gym/b/01-barbell-squat-goblet-squat.mp4",
      },
      {
        order: 2,
        name: "Romanian Deadlift (RDL)",
        target: "Hamstrings, Glutes, Lower Back",
        sets: "3",
        reps: "8–10",
        rest: "90s",
        tip: "Push hips back, not down. Feel the hamstring stretch.",
        demoVideoPath: "gym/b/02-romanian-deadlift.mp4",
      },
      {
        order: 3,
        name: "Leg Press or Bulgarian Split Squat",
        target: "Quads, Glutes",
        sets: "3",
        reps: "10–12",
        rest: "75s",
        tip: "Split squat: rear foot elevated, front foot forward. Stay tall.",
        demoVideoPath: "gym/b/03-leg-press-bulgarian-split-squat.mp4",
      },
      {
        order: 4,
        name: "Leg Curl (Machine or Band)",
        target: "Hamstrings",
        sets: "3",
        reps: "12–15",
        rest: "60s",
        tip: "Squeeze hard at peak contraction. Control the negative.",
        demoVideoPath: "gym/b/04-leg-curl.mp4",
      },
      {
        order: 5,
        name: "Standing Calf Raises",
        target: "Calves",
        sets: "4",
        reps: "15–20",
        rest: "45s",
        tip: "Full range of motion — all the way up, all the way down.",
        demoVideoPath: "gym/b/05-standing-calf-raises.mp4",
      },
      {
        order: 6,
        name: "Plank Hold",
        target: "Core, Abs",
        sets: "3",
        reps: "30–45s",
        rest: "45s",
        tip: "Squeeze glutes and abs simultaneously. Breathe normally.",
        demoVideoPath: "gym/b/06-plank-hold.mp4",
      },
    ],
    finisher: "3 sets: 20 bodyweight squats + 20 walking lunges. No rest between sets.",
  },
  c: {
    id: "c",
    code: "gym-c",
    title: "TRAINING C — UPPER BODY PULL",
    focus: "Back · Biceps · Rear Delts",
    warmup: "5 min: Cat-cow, band pull-aparts, dead hang 20s",
    exercises: [
      {
        order: 1,
        name: "Pull-Ups / Lat Pulldown",
        target: "Lats, Biceps, Rear Delts",
        sets: "4",
        reps: "6–8",
        rest: "90s",
        tip: "Initiate with shoulder blades, then pull elbows to hips.",
        demoVideoPaths: [
          { label: "V1", path: "gym/c/01-pull-ups-lat-pulldown-v1.mp4" },
          { label: "V2", path: "gym/c/01-pull-ups-lat-pulldown-v2.mp4" },
        ],
      },
      {
        order: 2,
        name: "Barbell or Dumbbell Row",
        target: "Mid Back, Lats, Rhomboids",
        sets: "4",
        reps: "8–10",
        rest: "75s",
        tip: "Row to lower chest, not upper. Control — don't swing.",
        demoVideoPaths: [
          { label: "V1", path: "gym/c/02-barbell-dumbbell-row-v1.mp4" },
          { label: "V2", path: "gym/c/02-barbell-dumbbell-row-v2.mp4" },
        ],
      },
      {
        order: 3,
        name: "Seated Cable Row / Band Row",
        target: "Mid Back, Traps",
        sets: "3",
        reps: "10–12",
        rest: "60s",
        tip: "Chest proud, pull elbows back as far as possible.",
        demoVideoPaths: [
          { label: "V1", path: "gym/c/03-seated-cable-row-band-row-v1.mp4" },
          { label: "V2", path: "gym/c/03-seated-cable-row-band-row-v2.mp4" },
        ],
      },
      {
        order: 4,
        name: "Face Pulls or Rear Delt Fly",
        target: "Rear Delts, Rotator Cuff",
        sets: "3",
        reps: "15–20",
        rest: "45s",
        tip: "Light weight, full range. Elbows high. Crucial for posture.",
        demoVideoPaths: [
          { label: "V1", path: "gym/c/04-face-pulls-rear-delt-fly-v1.mp4" },
          { label: "V2", path: "gym/c/04-face-pulls-rear-delt-fly-v2.mp4" },
        ],
      },
      {
        order: 5,
        name: "Barbell / Dumbbell Bicep Curl",
        target: "Biceps",
        sets: "3",
        reps: "10–12",
        rest: "60s",
        tip: "No swinging. Control top and bottom. Supinate at top.",
        demoVideoPaths: [
          { label: "V1", path: "gym/c/05-barbell-dumbbell-bicep-curl-v1.mp4" },
          { label: "V2", path: "gym/c/05-barbell-dumbbell-bicep-curl-v2.mp4" },
        ],
      },
      {
        order: 6,
        name: "Hammer Curl",
        target: "Brachialis, Forearms",
        sets: "2",
        reps: "12–15",
        rest: "45s",
        tip: "Alternate arms. Keep wrists neutral throughout.",
        demoVideoPath: "gym/c/06-hammer-curl.mp4",
      },
    ],
    finisher: "2 sets: 10 pull-ups or 15 lat pulldown reps at 70%. Slow and controlled.",
  },
};

export const homeWorkouts: Record<WorkoutPlan["id"], WorkoutPlan> = {
  a: {
    id: "a",
    code: "home-a",
    title: "HOME A — UPPER BODY PUSH",
    focus: "Chest · Shoulders · Triceps",
    warmup: "5 min: Shoulder circles, push-up to downward dog x8",
    exercises: [
      {
        order: 1,
        name: "Push-Ups (Standard)",
        target: "Chest, Shoulders, Triceps",
        sets: "4",
        reps: "Max",
        rest: "60s",
        tip: "Go to failure each set. Hands shoulder-width. Full ROM.",
        demoVideoPath: "home/a/01-push-ups-standard.mp4",
      },
      {
        order: 2,
        name: "Pike Push-Ups",
        target: "Shoulders",
        sets: "3",
        reps: "10–15",
        rest: "60s",
        tip: "Hips high, head between arms. Mimic an overhead press.",
        demoVideoPath: "home/a/02-pike-push-ups.mp4",
      },
      {
        order: 3,
        name: "Decline Push-Ups",
        target: "Upper Chest",
        sets: "3",
        reps: "10–12",
        rest: "60s",
        tip: "Feet elevated on chair. Chest to floor level.",
        demoVideoPath: "home/a/03-decline-push-ups.mp4",
      },
      {
        order: 4,
        name: "Diamond Push-Ups",
        target: "Triceps",
        sets: "3",
        reps: "8–12",
        rest: "60s",
        tip: "Hands close together in diamond shape under chest.",
        demoVideoPath: "home/a/04-diamond-push-ups.mp4",
      },
      {
        order: 5,
        name: "Lateral Shoulder Raise (Water Bottles)",
        target: "Side Delts",
        sets: "3",
        reps: "15–20",
        rest: "45s",
        tip: "Use water bottles, backpack, or any household weight.",
        demoVideoPath: "home/a/05-lateral-shoulder-raise.mp4",
      },
    ],
    finisher: "Max push-up burnout: 3 sets to failure. 45s rest between sets.",
  },
  b: {
    id: "b",
    code: "home-b",
    title: "HOME B — LOWER BODY",
    focus: "Quads · Hamstrings · Glutes · Core",
    warmup: "5 min: Hip circles, bodyweight squats x15, high knees 30s",
    exercises: [
      {
        order: 1,
        name: "Bodyweight Squat / Jump Squat",
        target: "Quads, Glutes",
        sets: "4",
        reps: "15–20",
        rest: "60s",
        tip: "Add a jump to increase intensity. Land soft.",
        demoVideoPaths: [
          { label: "V1", path: "home/b/01-bodyweight-squat-jump-squat-v1.mp4" },
          { label: "V2", path: "home/b/01-bodyweight-squat-jump-squat-v2.mp4" },
        ],
      },
      {
        order: 2,
        name: "Bulgarian Split Squat (Chair)",
        target: "Quads, Glutes",
        sets: "3",
        reps: "10–12/leg",
        rest: "75s",
        tip: "Rear foot on chair. Drop down controlled, drive up hard.",
        demoVideoPath: "home/b/02-bulgarian-split-squat.mp4",
      },
      {
        order: 3,
        name: "Glute Bridge / Hip Thrust",
        target: "Glutes, Hamstrings",
        sets: "4",
        reps: "15–20",
        rest: "45s",
        tip: "Squeeze glutes at top. Hold 1 second. Add backpack for load.",
        demoVideoPaths: [
          { label: "V1", path: "home/b/03-glute-bridge-hip-thrust-v1.mp4" },
          { label: "V2", path: "home/b/03-glute-bridge-hip-thrust-v2.mp4" },
        ],
      },
      {
        order: 4,
        name: "Single-Leg Romanian Deadlift",
        target: "Hamstrings, Glutes, Balance",
        sets: "3",
        reps: "10/leg",
        rest: "60s",
        tip: "Hold wall for support if needed. Hinge from hips.",
        demoVideoPath: "home/b/04-single-leg-romanian-deadlift.mp4",
      },
      {
        order: 5,
        name: "Calf Raises (Step Edge)",
        target: "Calves",
        sets: "4",
        reps: "20–25",
        rest: "30s",
        tip: "Use a step for full range. Slow and controlled.",
        demoVideoPath: "home/b/05-calf-raises.mp4",
      },
      {
        order: 6,
        name: "Plank + Hollow Hold Circuit",
        target: "Core",
        sets: "3",
        reps: "30s each",
        rest: "30s",
        tip: "30s plank, immediately into 30s hollow body hold.",
        demoVideoPaths: [
          { label: "V1", path: "home/b/06-plank-hollow-hold-circuit-v1.mp4" },
          { label: "V2", path: "home/b/06-plank-hollow-hold-circuit-v2.mp4" },
        ],
      },
    ],
    finisher: "5 min AMRAP: 10 squats, 10 lunges (each leg), 10 glute bridges.",
  },
  c: {
    id: "c",
    code: "home-c",
    title: "HOME C — UPPER BODY PULL + CORE",
    focus: "Back · Biceps · Core",
    warmup: "5 min: Cat-cow x10, doorframe stretch 30s, arm swings",
    exercises: [
      {
        order: 1,
        name: "Door / Bar Pull-Ups or Inverted Rows",
        target: "Back, Biceps",
        sets: "4",
        reps: "Max",
        rest: "90s",
        tip: "Inverted rows: use table edge. Body straight, pull chest to edge.",
        demoVideoPath: "home/c/01-door-bar-pull-ups-inverted-rows.mp4",
      },
      {
        order: 2,
        name: "Resistance Band Row or Towel Row",
        target: "Mid Back",
        sets: "3",
        reps: "12–15",
        rest: "60s",
        tip: "Towel row: loop towel around door handle, lean back and row.",
        demoVideoPath: "home/c/02-resistance-band-row-towel-row.mp4",
      },
      {
        order: 3,
        name: "Superman Hold",
        target: "Lower Back, Glutes",
        sets: "3",
        reps: "10 reps",
        rest: "45s",
        tip: "Lift chest AND legs simultaneously. Hold 2s at top.",
        demoVideoPath: "home/c/03-superman-hold.mp4",
      },
      {
        order: 4,
        name: "Bicep Curl (Resistance Band/Bottles)",
        target: "Biceps",
        sets: "3",
        reps: "12–15",
        rest: "45s",
        tip: "Keep elbows glued to sides. Slow eccentric.",
        demoVideoPath: "home/c/04-bicep-curl-resistance-band.mp4",
      },
      {
        order: 5,
        name: "Renegade Row (Push-Up Position)",
        target: "Back, Core, Biceps",
        sets: "3",
        reps: "8/arm",
        rest: "60s",
        tip: "Use dumbbells or water bottles. Keep hips level.",
        demoVideoPath: "home/c/05-renegade-row.mp4",
      },
      {
        order: 6,
        name: "Dead Bug Hold",
        target: "Core, Transverse Abdominis",
        sets: "3",
        reps: "30s",
        rest: "30s",
        tip: "Lower back pressed to floor at all times.",
        demoVideoPath: "home/c/06-dead-bug-hold.mp4",
      },
    ],
    finisher: "Core circuit: 20 crunches, 20 leg raises, 30s plank. x3.",
  },
};

export const emergencyWorkouts = [
  {
    id: "push",
    name: "Push Day",
    time: "10 min",
    rows: [
      { exercise: "Push-Up Variation", sets: "3", reps: "Max", rest: "30s" },
      { exercise: "Pike Push-Up", sets: "3", reps: "10–15", rest: "30s" },
      { exercise: "Diamond Push-Up", sets: "2", reps: "Max", rest: "20s" },
    ],
  },
  {
    id: "pull",
    name: "Pull Day",
    time: "10 min",
    rows: [
      { exercise: "Pull-Ups or Inverted Row", sets: "3", reps: "Max", rest: "45s" },
      { exercise: "Band Row or Towel Row", sets: "3", reps: "15", rest: "30s" },
      { exercise: "Bicep Curl (bottles)", sets: "2", reps: "15", rest: "20s" },
    ],
  },
  {
    id: "leg",
    name: "Leg Day",
    time: "10 min",
    rows: [
      { exercise: "Jump Squat or Bodyweight Squat", sets: "3", reps: "20", rest: "30s" },
      { exercise: "Bulgarian Split Squat", sets: "3", reps: "10/leg", rest: "30s" },
      { exercise: "Glute Bridge", sets: "3", reps: "20", rest: "20s" },
    ],
  },
  {
    id: "full",
    name: "Full Body Blast",
    time: "10 min",
    rows: [
      { exercise: "Burpees", sets: "3", reps: "10", rest: "30s" },
      { exercise: "Push-Ups", sets: "2", reps: "Max", rest: "20s" },
      { exercise: "Reverse Lunges", sets: "2", reps: "12/leg", rest: "20s" },
      { exercise: "Plank", sets: "1", reps: "60s", rest: "Done" },
    ],
  },
] as const;

export const nutritionRules = [
  {
    number: "01",
    title: "PROTEIN AT EVERY MEAL",
    body:
      "1.6–2.2g per kg of bodyweight per day. This is the single most important nutrition variable. Protein preserves muscle while losing fat, keeps you full, and has the highest thermic effect of all macros (you burn calories digesting it).",
  },
  {
    number: "02",
    title: "CONTROL CALORIES — NOT OBSESSIVELY",
    body:
      "You do not need to count every calorie. But awareness matters. A rough daily target: bodyweight (kg) × 30–33 = maintenance calories. Subtract 300–500 kcal for fat loss. Add 200–300 kcal for muscle building. Simple.",
  },
  {
    number: "03",
    title: "WHOLE FOODS FIRST",
    body:
      "If it grew from the ground or had a mother, eat it. If it comes in a crinkly packet with 47 ingredients, limit it. 80% whole foods + 20% flexibility = sustainable for life.",
  },
] as const;

export const sampleMealPlan = [
  { time: "6–8 AM", name: "Breakfast", meal: "4 whole eggs scrambled + 2 slices wholegrain toast + 1 banana", macros: "~550 kcal · 35g protein · 55g carbs · 18g fat", tip: "Prep in 8 min. High protein start fuels the morning and prevents overeating." },
  { time: "10–11 AM", name: "Mid-Morning Snack", meal: "Greek yoghurt (200g) + handful mixed nuts + 1 piece of fruit", macros: "~350 kcal · 22g protein · 25g carbs · 14g fat", tip: "Keep nuts pre-portioned in a bag. Never skip — prevents blood sugar crash." },
  { time: "1–2 PM", name: "Lunch", meal: "Large chicken breast (200g) + rice (100g dry) + steamed broccoli or salad", macros: "~580 kcal · 52g protein · 65g carbs · 8g fat", tip: "Batch cook chicken and rice Sunday night. This is your anchor meal." },
  { time: "4–5 PM", name: "Pre-Workout (if training)", meal: "Protein shake + 1 medium banana + rice cake x2", macros: "~320 kcal · 28g protein · 40g carbs · 4g fat", tip: "Carbs before training = energy. Protein = muscle preservation." },
  { time: "7–8 PM", name: "Dinner", meal: "Salmon fillet (180g) or lean beef (150g) + sweet potato (200g) + greens", macros: "~560 kcal · 44g protein · 45g carbs · 16g fat", tip: "Omega-3s from salmon accelerate recovery. Don't skip the greens." },
  { time: "9–10 PM", name: "Evening Snack (optional)", meal: "Cottage cheese (200g) OR casein shake + 1 tbsp almond butter", macros: "~280 kcal · 30g protein · 8g carbs · 12g fat", tip: "Casein protein digests slowly overnight — feeds muscles while you sleep." },
] as const;

export const eatAnywhere = [
  { place: "Fast Food", tips: ["Grilled chicken > fried. Always.", "Remove the bun, double the salad side.", "Skip sauces (200 kcal hidden there).", "Water or black coffee. Never soda."] },
  { place: "Restaurant", tips: ["Ask: grilled or baked protein + vegetables.", "Sauce on the side. Control portion yourself.", "Start with a protein-heavy appetizer.", "Share dessert or skip. One bite won't kill you."] },
  { place: "Airport / Travel", tips: ["Pack: protein bar, nuts, rice cakes in carry-on.", "Sushi or poke bowls: great airport protein options.", "Avoid: croissants, muffins, airport sandwiches.", "Hydrate heavily — flying dehydrates muscle function."] },
  { place: "Office / Busy Days", tips: ["Meal prep containers in the fridge at work.", "Almonds and Greek yoghurt as desk snacks.", "Protein shake is always an acceptable meal.", "Black coffee before meetings > energy drink."] },
] as const;

export const supplementEssential = [
  { name: "Creatine Monohydrate", dose: "5g/day", note: "Most researched supplement in history. Strength, power, muscle. No loading needed." },
  { name: "Whey Protein", dose: "1–2 scoops/day", note: "Convenient protein top-up. Use when food isn't practical. Not magic — just food." },
  { name: "Vitamin D3 + K2", dose: "2000–4000 IU D3 daily", note: "Most busy adults are deficient. Critical for testosterone, immunity, mood." },
  { name: "Magnesium Glycinate", dose: "300–400mg before bed", note: "Improves sleep quality and recovery. Cheap and highly effective." },
  { name: "Omega-3 Fish Oil", dose: "2–3g EPA+DHA/day", note: "Anti-inflammatory, supports heart health, cognitive function, joint health." },
] as const;

export const supplementOptional = [
  { name: "Caffeine / Pre-workout", dose: "100–200mg caffeine", note: "Genuine performance boost. Use only before training. Avoid after 2 PM." },
  { name: "ZMA", dose: "Taken before sleep", note: "Zinc + Magnesium combo. Good if you sweat a lot or skip vegetables often." },
  { name: "Collagen + Vitamin C", dose: "10g collagen + 500mg C", note: "Take 30–60 min pre-workout. Supports joint and tendon health." },
] as const;

export const supplementWaste = [
  { name: "Testosterone Boosters", reason: "None of them work. Save your money." },
  { name: "Fat Burners", reason: "All marketing. Diet and training are the only fat burners that work." },
  { name: "BCAAs (if already eating enough protein)", reason: "Redundant if your protein intake is already adequate. Skip it." },
] as const;

export const habits = [
  { n: 1, title: "NON-NEGOTIABLE TRAINING SLOTS", body: "Schedule your 3 sessions like doctor appointments — they cannot be moved. Put them in your calendar with an alarm. Before work, lunch break, or after work. Same time, same days, every week. Consistency > Perfection.", action: "Example: 6:00 AM Monday · 12:30 PM Wednesday · 6:00 AM Friday" },
  { n: 2, title: "SLEEP IS YOUR #1 PERFORMANCE DRUG", body: "7–9 hours is non-negotiable. Sleep debt destroys testosterone, raises cortisol, kills motivation, and increases fat storage. No training program overcomes chronic sleep deprivation. Protect your sleep like an athlete.", action: "Target: 7.5 hours minimum · Consistent wake time daily" },
  { n: 3, title: "DAILY PROTEIN FIRST", body: "At every meal, ask: where is my protein? Build your plate around it. 1.6–2.2g per kg of bodyweight daily. This one habit alone will transform your body composition over 90 days.", action: "Example 80kg: 128–176g protein per day" },
  { n: 4, title: "THE 5-MINUTE RULE", body: "On days you don't feel like training, commit to just 5 minutes. Get changed, start warming up. In 20+ years of coaching, almost nobody stops at 5 minutes. Momentum is everything. The hardest part is starting.", action: "Put your gym clothes out the night before. Always." },
  { n: 5, title: "TRACK SOMETHING — NOT EVERYTHING", body: "Weigh yourself every Monday morning, same conditions. Take monthly progress photos. Log your main lifts (bench, squat, deadlift). You don't need to obsess — you just need 3 data points to see if the system is working.", action: "Weekly: weight · Monthly: photos · Per session: main lifts" },
  { n: 6, title: "THE SUNDAY RESET", body: "Every Sunday: prep 3 meals for the week. Review next week's schedule and confirm your 3 training slots. Shop for protein sources. 90 minutes on Sunday saves you from 7 days of poor decisions.", action: "Prep · Plan · Shop · Sleep. Every Sunday." },
] as const;

export const progressExpectations = [
  { metric: "Body Weight", w1: "May stay same or drop 1–2kg", w2: "1–2kg fat loss", w3: "1–2kg more fat loss" },
  { metric: "Bench Press", w1: "+2.5–5kg possible", w2: "+2.5–5kg more", w3: "+2.5kg more" },
  { metric: "Squat / Leg Press", w1: "+5–10kg possible", w2: "+5–10kg more", w3: "+5kg more" },
  { metric: "Energy Levels", w1: "Rising from week 2", w2: "Noticeably higher", w3: "Peak — sustained" },
  { metric: "Visible Change", w1: "Subtle week 3–4", w2: "Clear changes week 6–7", w3: "Significant by week 10" },
] as const;

/** Public FAQ (home + /faq) */
export const faqs = [
  {
    q: "I've tried programs before and always quit. Why would this be different?",
    a: "Most busy men don't fail because they lack discipline — they fail because the plan didn't fit real life. A gym membership you never use, a fitness app with a fixed 12-week block you're supposed to follow while travelling, or an online coach who starts strong then sends copy-paste training weeks… none of that survives kids, deadlines, and a packed calendar. Busy Strong 90 is built the other way: three sessions per week, 30–40 minutes, train at home (or hotel) with no commute, and nutrition without a food scale — protein at every meal, simple rules. With Coached Strong 90, your plan is built around your schedule and we track what actually matters: weight on the scale (kg) and energy day to day — not perfection on paper.",
  },
  {
    q: "I travel a lot for work. Can I still do this?",
    a: "Yes. Every session works with zero equipment in a hotel room, a park, or your living room. Before you travel, we adjust your week so you know exactly what to do on the road. Several clients travel two to three weeks a month — the plan goes with you.",
  },
  {
    q: "My weeks go sideways — kids, deadlines, no solid hour. Will I fall off?",
    a: "Life interrupts. The system assumes that. You're not failing because a session got cut short or moved — you're failing only if you stop entirely. We use 30–40 minute sessions you can protect on the calendar, optional 10-minute emergency workouts when the day explodes, and coaching check-ins so a hectic week doesn't turn into a lost month.",
  },
  {
    q: "I'm wiped after work. I have no energy to train.",
    a: "That's common — and it's exactly why the program is minimum effective dose, not maximum suffering. Three short sessions, progressive strength work, and simple nutrition (protein at every meal, no food scale) are designed to raise energy over the 90 days — not drain you further. Many clients train early morning or right after work once the first two weeks pass; we find the slot you can actually keep.",
  },
  {
    q: "I'm over 40 / have old injuries. Is this safe?",
    a: "The program uses progressive overload and compound movements — not high-impact burnout. With coaching, everything is adapted around your knees, back, or shoulders. Several clients are 45+; we work around limitations, not through them.",
  },
  {
    q: "Do I need a gym or equipment?",
    a: "No gym required. The base program is fully bodyweight. Resistance bands or dumbbells are optional progressions — not required. If you already have a gym membership, you can use it; many men train at home because it removes the commute and the guilt of not going.",
  },
  {
    q: "Do I need to count calories or use a food scale?",
    a: "No food scale. No macro app obsession. One rule: protein at every meal. We keep nutrition simple enough to eat with your family, order sensibly when you travel, and stay consistent without weighing every portion.",
  },
  {
    q: "What results should I expect in 90 days?",
    a: "We focus on two things you can feel and measure: body weight (kg) and daily energy — playing with your kids after work instead of crashing on the couch, showing up sharper, sleeping better. Strength and waist size follow when you show up for the sessions and hit protein consistently. With coaching, we review both every week.",
  },
  {
    q: "What's the difference between self-guided and coaching?",
    a: "Self-guided (407 AED) gives you the full 90-day system — training, nutrition framework, habits. Coached Strong 90 (1,299 AED/month) adds a plan built for your calendar, weekly check-ins, form reviews via video, and someone who won't let you quietly disappear after week three. If you've quit programs alone before, coaching is the practical fix.",
  },
  {
    q: "How is this different from hiring a personal trainer?",
    a: "A gym PT gives you an hour in their facility. This gives you a system for your life: when to train at home, what to eat without a food scale, how to handle travel, and accountability across the whole 90 days — not just the session you showed up to. The training is one piece; the habit and energy shift is the product.",
  },
] as const;

export const trackingGuidance = {
  headline: "How to Track Like an Athlete",
  body:
    "You cannot manage what you cannot measure. Track these three things and nothing else: (1) Bodyweight every Monday morning — same time, same conditions. (2) Progress photos every 4 weeks — front, side, back, same lighting. (3) Main lifts each session — log the weight and reps for bench press, squat, and deadlift or row.",
} as const;
