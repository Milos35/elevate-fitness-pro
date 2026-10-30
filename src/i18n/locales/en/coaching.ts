export default {
  meta: {
    title: "Apply for Coaching — Coach Milos",
    description: "Apply to train with Coach Milos. Limited spots. Response within 24 hours.",
  },
  back: {
    toCoaching: "Back to coaching",
    toPlan: "Back to {{planName}}",
  },
  heading: {
    eyebrow: "Application",
    title: "Apply to Train With",
    titleHighlight: "Coach Milos",
    body:
      "I work with a limited number of clients at a time so I can give each person the attention they deserve. Fill out this short application and I'll get back to you within 24 hours.",
  },
  planPicker: {
    applyingFor: "You're applying for",
    monthlyBilling: "Monthly billing · limited spots.",
    noPlanBody:
      "Pick a program so your application is tagged with the right plan and price. You can also open this page from the",
    pricingCards: "pricing cards",
    noPlanBodySuffix: "on the home page.",
    coachedStrong90: {
      name: "Coached Strong 90",
      tier: "Core Coaching · {{price}}",
    },
    privateTransformation: {
      name: "Private Transformation",
      tier: "Elite · {{price}}",
    },
  },
  form: {
    moreOptional: "More about you (optional, helps me prepare for our call)",
    firstName: {
      label: "First Name",
      placeholder: "Your first name",
    },
    lastName: {
      label: "Last Name",
      placeholder: "Your last name",
    },
    email: {
      label: "Email",
      placeholder: "you@email.com",
    },
    whatsapp: {
      label: "WhatsApp Number",
      placeholder: "+971 50 123 4567",
    },
    location: {
      label: "Where are you based?",
      placeholder: "City, Country",
    },
    age: {
      label: "How old are you?",
      placeholder: "Select your age range",
      options: {
        "25-34": "25–34",
        "35-39": "35–39",
        "40-44": "40–44",
        "45-49": "45–49",
        "50+": "50+",
      },
    },
    role: {
      label: "What best describes you?",
      placeholder: "Select one",
      options: {
        founder: "Business Owner / Founder",
        corporate: "Corporate Professional",
        parent: "Parent (stay-at-home or part-time)",
        freelance: "Freelancer / Self-Employed",
        other: "Other",
      },
    },
    fitness: {
      label: "How would you describe your current fitness level?",
      options: {
        scratch: {
          title: "Haven't trained in 6+ months",
          subtitle: "Starting from scratch — that's okay",
        },
        inconsistent: {
          title: "Inconsistent — train sometimes but can't stick to it",
          subtitle: "The most common answer. You're not alone.",
        },
        "no-results": {
          title: "Training regularly but not seeing results",
          subtitle: "Effort without a system. We fix that.",
        },
        experienced: {
          title: "Experienced — just need structure and accountability",
          subtitle: "You know what to do, you need someone to keep you honest.",
        },
      },
    },
    goal: {
      label: "What's your #1 goal right now?",
      hint: "Be specific. \"Lose the gut and have energy to play with my kids\" is better than \"get fit.\"",
      placeholder: "Tell me what you want to change and why it matters to you...",
    },
    triedBefore: {
      label: "What have you tried before? What didn't work?",
      hint: "This helps me understand what to do differently for you.",
      placeholder: "Gym memberships, personal trainers, apps, programs, diets...",
    },
    minutes: {
      label: "How many minutes per day can you realistically commit to training?",
      placeholder: "Be honest — I'll build around it",
      options: {
        "20-30": "20–30 minutes",
        "30-40": "30–40 minutes",
        "40-60": "40–60 minutes",
        less: "Less than 20 minutes (we'll talk)",
      },
    },
    anythingElse: {
      label: "Anything else you want me to know?",
      hint: "Injuries, medical conditions, travel schedule, dietary restrictions — anything relevant.",
      placeholder: "Optional — but the more I know, the better I can help",
    },
    submit: "Submit Application",
    submitting: "Sending…",
    footerNote:
      "I review every application personally and respond within 24 hours. You'll get a confirmation email with a link to book a quick consultation.",
    footerSpamNote: "After submitting, please check your inbox within a few minutes — if nothing appears, look in",
    spam: "Spam",
    promotions: "Promotions",
  },
  toast: {
    incompleteTitle: "Please complete all fields",
    successTitle: "Application received",
    successDescription:
      "Check your inbox for a confirmation email with a link to book your consultation. If you don't see it, check Spam or Promotions.",
    errorTitle: "Could not submit",
    errorFallback: "Please try again or email info@ptmilosilic.com.",
    deployError:
      "The form could not reach the email service. Confirm the site is deployed on Vercel with the /api/coaching-apply function, or email info@ptmilosilic.com directly.",
    serverError: "Something went wrong",
    emailNotConfigured: "Email service is not configured on the server (missing RESEND_API_KEY).",
  },
  trust: {
    limitedSpots: "Limited spots",
    noCommitment: "No commitment until we talk",
    personalized: "100% personalized",
  },
} as const;
