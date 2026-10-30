export default {
  meta: {
    title: "التقديم للتدريب الشخصي — Coach Milos",
    description: "قدّم للتدريب مع Coach Milos. أماكن محدودة. رد خلال 24 ساعة.",
  },
  back: {
    toCoaching: "العودة إلى التدريب الشخصي",
    toPlan: "العودة إلى {{planName}}",
  },
  heading: {
    eyebrow: "طلب التقديم",
    title: "قدّم للتدريب مع",
    titleHighlight: "Coach Milos",
    body:
      "أعمل مع عدد محدود من العملاء في وقت واحد لأمنح كل شخص الاهتمام الذي يستحقه. املأ هذا الطلب القصير وسأرد عليك خلال 24 ساعة.",
  },
  planPicker: {
    applyingFor: "أنت تتقدم لـ",
    monthlyBilling: "فوترة شهرية · أماكن محدودة.",
    noPlanBody:
      "اختر برنامجاً ليُوسَم طلبك بالخطة والسعر الصحيحين. يمكنك أيضاً فتح هذه الصفحة من",
    pricingCards: "بطاقات الأسعار",
    noPlanBodySuffix: "في الصفحة الرئيسية.",
    coachedStrong90: {
      name: "Coached Strong 90",
      tier: "التدريب الأساسي · {{price}}",
    },
    privateTransformation: {
      name: "Private Transformation",
      tier: "النخبة · {{price}}",
    },
  },
  form: {
    moreOptional: "المزيد عنك (اختياري)",
    firstName: {
      label: "الاسم الأول",
      placeholder: "اسمك الأول",
    },
    lastName: {
      label: "اسم العائلة",
      placeholder: "اسم عائلتك",
    },
    email: {
      label: "البريد الإلكتروني",
      placeholder: "you@email.com",
    },
    whatsapp: {
      label: "رقم WhatsApp",
      placeholder: "+971 50 123 4567",
    },
    location: {
      label: "أين تقيم؟",
      placeholder: "المدينة، الدولة",
    },
    age: {
      label: "كم عمرك؟",
      placeholder: "اختر فئتك العمرية",
      options: {
        "25-34": "25–34",
        "35-39": "35–39",
        "40-44": "40–44",
        "45-49": "45–49",
        "50+": "50+",
      },
    },
    role: {
      label: "ما الذي يصفك أفضل؟",
      placeholder: "اختر واحداً",
      options: {
        founder: "صاحب عمل / مؤسس",
        corporate: "محترف في شركة",
        parent: "أب (موظف أو يعمل من المنزل)",
        freelance: "مستقل / يعمل لحسابه",
        other: "أخرى",
      },
    },
    fitness: {
      label: "كيف تصف مستوى لياقتك الحالي؟",
      options: {
        scratch: {
          title: "لم أتدرب منذ 6+ أشهر",
          subtitle: "البداية من الصفر — لا بأس",
        },
        inconsistent: {
          title: "غير منتظم — أتدرب أحياناً لكن لا ألتزم",
          subtitle: "الإجابة الأكثر شيوعاً. لست وحدك.",
        },
        "no-results": {
          title: "أتدرب بانتظام لكن لا أرى نتائج",
          subtitle: "جهد بدون نظام. نصلح ذلك.",
        },
        experienced: {
          title: "ذو خبرة — أحتاج فقط هيكلاً ومساءلة",
          subtitle: "تعرف ماذا تفعل، تحتاج من يحافظ على صدقك.",
        },
      },
    },
    goal: {
      label: "ما هدفك رقم 1 الآن؟",
      hint: "كن محدداً. \"أخسر البطن وأملك طاقة للعب مع أطفالي\" أفضل من \"أصبح لائقاً.\"",
      placeholder: "أخبرني ماذا تريد تغييره ولماذا يهمك...",
    },
    triedBefore: {
      label: "ماذا جربت من قبل؟ ما الذي لم ينجح؟",
      hint: "هذا يساعدني أفهم ماذا أفعل بشكل مختلف لك.",
      placeholder: "اشتراكات نوادي، مدربين شخصيين، تطبيقات، برامج، حميات...",
    },
    minutes: {
      label: "كم دقيقة يومياً يمكنك الالتزام بها للتدريب واقعياً؟",
      placeholder: "كن صادقاً — سأبني حول ذلك",
      options: {
        "20-30": "20–30 دقيقة",
        "30-40": "30–40 دقيقة",
        "40-60": "40–60 دقيقة",
        less: "أقل من 20 دقيقة (سنتحدث)",
      },
    },
    anythingElse: {
      label: "أي شيء آخر تريدني أن أعرفه؟",
      hint: "إصابات، حالات طبية، جدول سفر، قيود غذائية — أي شيء ذي صلة.",
      placeholder: "اختياري — لكن كلما عرفت أكثر، استطعت مساعدتك أفضل",
    },
    submit: "إرسال الطلب",
    submitting: "جاري الإرسال…",
    footerNote:
      "أراجع كل طلب شخصياً وأرد خلال 24 ساعة. ستصلك رسالة تأكيد برابط لحجز استشارة سريعة.",
    footerSpamNote: "بعد الإرسال، تحقق من بريدك خلال دقائق — إذا لم يظهر شيء، ابحث في",
    spam: "البريد المزعج",
    promotions: "العروض الترويجية",
  },
  toast: {
    incompleteTitle: "يرجى إكمال جميع الحقول",
    successTitle: "تم استلام الطلب",
    successDescription:
      "تحقق من بريدك للحصول على رسالة تأكيد برابط لحجز استشارتك. إذا لم تجدها، تحقق من البريد المزعج أو العروض الترويجية.",
    errorTitle: "تعذّر الإرسال",
    errorFallback: "يرجى المحاولة مرة أخرى أو مراسلة info@ptmilosilic.com.",
    deployError:
      "تعذّر على النموذج الوصول إلى خدمة البريد. تأكد أن الموقع منشور على Vercel مع دالة /api/coaching-apply، أو راسل info@ptmilosilic.com مباشرة.",
    serverError: "حدث خطأ ما",
    emailNotConfigured: "خدمة البريد غير مُعدّة على الخادم (RESEND_API_KEY مفقود).",
  },
  trust: {
    limitedSpots: "أماكن محدودة",
    noCommitment: "لا التزام حتى نتحدث",
    personalized: "100% مخصص",
  },
} as const;
