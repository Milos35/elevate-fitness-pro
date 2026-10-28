/**
 * Daily motivation push messages — one per program day (1–90), in the order of the 12-week plan:
 * days 1–28 Foundation, 29–56 Intensity, 57–90 Transformation.
 * Each entry: [en, sr, ar]. Serbian uses the formal "Vi" like the rest of the site.
 */
export type MotivationLocale = "en" | "sr" | "ar";

const MESSAGES: ReadonlyArray<readonly [en: string, sr: string, ar: string]> = [
  // Phase 1 — Foundation (days 1–28)
  ["Day one. You don't need to be ready — you just need to start. 30 minutes today.", "Prvi dan. Ne morate biti spremni — samo počnite. 30 minuta danas.", "اليوم الأول. لا تحتاج أن تكون مستعداً — فقط ابدأ. 30 دقيقة اليوم."],
  ["Showing up is the whole game this week. Light weights, perfect form.", "Ove nedelje je najvažnije da se pojavite. Lakši tegovi, savršena tehnika.", "الحضور هو كل شيء هذا الأسبوع. أوزان خفيفة وأداء صحيح."],
  ["Your kids won't remember your excuses. They'll remember your energy.", "Deca neće pamtiti Vaše izgovore. Pamtiće Vašu energiju.", "أطفالك لن يتذكروا أعذارك. سيتذكرون طاقتك."],
  ["Busy is not a reason. It's the reason this plan is only 30–40 minutes.", "Zauzetost nije razlog. Zato ovaj plan traje samo 30–40 minuta.", "الانشغال ليس عذراً. لهذا البرنامج 30–40 دقيقة فقط."],
  ["Protein at every meal today. One rule, done right.", "Protein uz svaki obrok danas. Jedno pravilo, urađeno kako treba.", "بروتين في كل وجبة اليوم. قاعدة واحدة، بشكل صحيح."],
  ["Missed a session? Don't double up. Just do the next one.", "Propustili ste trening? Ne duplirajte. Samo odradite sledeći.", "فاتتك حصة؟ لا تضاعف. فقط قم بالحصة التالية."],
  ["One week down. The hardest part — starting — is behind you.", "Prva nedelja je za Vama. Najteži deo — početak — je prošao.", "انتهى الأسبوع الأول. الجزء الأصعب — البداية — أصبح خلفك."],
  ["Walk 20 minutes on your rest day. Recovery is part of training.", "Prošetajte 20 minuta na dan odmora. Oporavak je deo treninga.", "امشِ 20 دقيقة في يوم الراحة. التعافي جزء من التدريب."],
  ["Strength is built in the boring reps. Keep them clean.", "Snaga se gradi u dosadnim ponavljanjima. Neka budu čista.", "القوة تُبنى في التكرارات المملة. اجعلها نظيفة."],
  ["Tired? A 10-minute session still counts. Do the short one.", "Umorni ste? I trening od 10 minuta se računa. Odradite kraći.", "متعب؟ حصة 10 دقائق ما زالت تُحتسب. قم بالقصيرة."],
  ["Sleep is your secret supplement. Aim for 7 hours tonight.", "San je Vaš tajni suplement. Ciljajte 7 sati večeras.", "النوم هو مكملك السري. استهدف 7 ساعات الليلة."],
  ["You're not behind. You're on day 12 of something most people never start.", "Niste u zaostatku. Na 12. ste danu nečega što većina nikad ne počne.", "لست متأخراً. أنت في اليوم 12 من شيء لا يبدأه معظم الناس."],
  ["Drink water before coffee today. Small wins stack up.", "Danas popijte vodu pre kafe. Male pobede se sabiraju.", "اشرب الماء قبل القهوة اليوم. الانتصارات الصغيرة تتراكم."],
  ["Two weeks done. Notice your energy — it's already changing.", "Dve nedelje su iza Vas. Primetite energiju — već se menja.", "أسبوعان انتهيا. لاحظ طاقتك — إنها تتغير بالفعل."],
  ["Train before the day gets loud. Morning sessions protect your plan.", "Trenirajte pre nego što dan postane bučan. Jutarnji trening čuva plan.", "تدرّب قبل أن يزدحم يومك. حصص الصباح تحمي خطتك."],
  ["Eat with your family, just add protein. No food scale needed.", "Jedite sa porodicom, samo dodajte protein. Vaga nije potrebna.", "كُل مع عائلتك، فقط أضف البروتين. لا حاجة لميزان طعام."],
  ["Motivation fades. Habits stay. Today you're building the habit.", "Motivacija prolazi. Navike ostaju. Danas gradite naviku.", "الحماس يتلاشى. العادات تبقى. اليوم تبني العادة."],
  ["Form first, weight later. Your joints will thank you in week 12.", "Prvo tehnika, pa težina. Zglobovi će Vam zahvaliti u 12. nedelji.", "الأداء أولاً، ثم الوزن. مفاصلك ستشكرك في الأسبوع 12."],
  ["Bad day at work? Lift it out. 30 minutes, then go home lighter.", "Loš dan na poslu? Istrenirajte ga. 30 minuta, pa kući lakši.", "يوم عمل سيئ؟ تخلّص منه بالتمرين. 30 دقيقة ثم عُد أخف."],
  ["Weigh in Monday morning, same time, same conditions. Track, don't guess.", "Merite se u ponedeljak ujutru, isto vreme, isti uslovi. Pratite, ne nagađajte.", "زِن نفسك صباح الإثنين، نفس الوقت والظروف. تتبّع ولا تخمّن."],
  ["Three weeks. You're officially someone who trains.", "Tri nedelje. Zvanično ste neko ko trenira.", "ثلاثة أسابيع. أصبحت رسمياً شخصاً يتدرب."],
  ["Plan tomorrow's session tonight. Decide once, then just execute.", "Večeras isplanirajte sutrašnji trening. Odlučite jednom, pa samo izvršite.", "خطط لحصة الغد الليلة. قرّر مرة واحدة ثم نفّذ."],
  ["Week three is where most people quit. You're not most people.", "U trećoj nedelji većina odustane. Vi niste većina.", "في الأسبوع الثالث يستسلم معظم الناس. أنت لست منهم."],
  ["Travelling? Use the home or 10-minute version. No hotel gym excuses.", "Putujete? Koristite verziju za kuću ili od 10 minuta. Bez izgovora.", "مسافر؟ استخدم نسخة المنزل أو العشر دقائق. بلا أعذار."],
  ["Your back, knees and mood all improve with strength. Keep going.", "Leđa, kolena i raspoloženje se poboljšavaju sa snagom. Nastavite.", "ظهرك وركبتاك ومزاجك تتحسن مع القوة. استمر."],
  ["Skip the sugary drink today. It's the easiest fat loss you'll get.", "Danas preskočite zaslađeno piće. To je najlakši gubitak masnoće.", "تجنّب المشروب السكري اليوم. أسهل خسارة دهون ستحققها."],
  ["Consistency beats intensity. A good session today beats a perfect one never.", "Doslednost pobeđuje intenzitet. Dobar trening danas je bolji od savršenog nikad.", "الاستمرارية تتفوق على الشدة. حصة جيدة اليوم أفضل من مثالية لا تأتي."],
  ["Foundation phase complete. Four weeks of proof that you can do this.", "Faza osnove je završena. Četiri nedelje dokaza da Vi to možete.", "اكتملت مرحلة الأساس. أربعة أسابيع تثبت أنك تستطيع."],
  // Phase 2 — Intensity (days 29–56)
  ["Phase 2 starts now: weights go up. Add a little, keep the form.", "Počinje faza 2: tegovi idu gore. Dodajte malo, zadržite tehniku.", "تبدأ المرحلة 2 الآن: الأوزان ترتفع. أضف قليلاً وحافظ على الأداء."],
  ["Progressive overload: one more rep or 2.5 kg more than last time.", "Progresivno opterećenje: jedno ponavljanje ili 2,5 kg više nego prošli put.", "الحمل التدريجي: تكرار إضافي أو 2.5 كغ أكثر من المرة السابقة."],
  ["The scale isn't the only score. Check how your clothes fit.", "Vaga nije jedini rezultat. Proverite kako Vam stoji odeća.", "الميزان ليس المقياس الوحيد. لاحظ كيف تناسبك ملابسك."],
  ["Lower body day is the hardest. That's why it works.", "Trening nogu je najteži. Zato i deluje.", "يوم الجزء السفلي هو الأصعب. ولهذا هو فعّال."],
  ["You don't find time. You protect it. Block your session in the calendar.", "Vreme se ne nalazi, već čuva. Upišite trening u kalendar.", "لا تجد الوقت، بل تحميه. احجز حصتك في التقويم."],
  ["Rest days are growth days. Walk, stretch, sleep.", "Dani odmora su dani rasta. Šetnja, istezanje, san.", "أيام الراحة هي أيام النمو. امشِ، تمدّد، نَم."],
  ["Five weeks in. People around you are starting to notice.", "Pet nedelja. Ljudi oko Vas počinju da primećuju.", "خمسة أسابيع. الناس من حولك بدأوا يلاحظون."],
  ["Eating out? Grilled over fried, double the salad, skip the sauce.", "Jedete napolju? Grilovano umesto prženog, duplo salate, bez sosa.", "تأكل خارجاً؟ مشوي بدل المقلي، سلطة مضاعفة، بدون صلصة."],
  ["Discipline is choosing what you want most over what you want now.", "Disciplina je izbor onoga što najviše želite umesto onoga što želite sada.", "الانضباط هو اختيار ما تريده أكثر بدل ما تريده الآن."],
  ["Brace your core on every lift today. Strong middle, strong everything.", "Danas zategnite stomak na svakom dizanju. Jak centar, jako sve.", "شدّ عضلات بطنك في كل رفعة اليوم. وسط قوي، كل شيء قوي."],
  ["Low energy? Start with the warm-up. Momentum usually follows.", "Slaba energija? Počnite zagrevanjem. Zamah obično dođe sam.", "طاقة منخفضة؟ ابدأ بالإحماء. الزخم يأتي عادة بعده."],
  ["Your future self is built by what you do today, not what you plan.", "Budućeg sebe gradite onim što radite danas, ne onim što planirate.", "ذاتك المستقبلية تُبنى بما تفعله اليوم، لا بما تخطط له."],
  ["Prep tomorrow's lunch tonight. Hunger makes bad decisions.", "Večeras spremite sutrašnji ručak. Glad donosi loše odluke.", "حضّر غداء الغد الليلة. الجوع يصنع قرارات سيئة."],
  ["Six weeks. That's 18 sessions most people talked about and never did.", "Šest nedelja. To je 18 treninga o kojima većina samo priča.", "ستة أسابيع. هذه 18 حصة يتحدث عنها الآخرون ولا يفعلونها."],
  ["Halfway is close. Don't slow down now — this is where results speed up.", "Polovina je blizu. Ne usporavajte sada — sada rezultati ubrzavaju.", "منتصف الطريق قريب. لا تتباطأ الآن — هنا تتسارع النتائج."],
  ["Lift like your kids are watching. One day they'll copy you.", "Trenirajte kao da Vas deca gledaju. Jednog dana će Vas kopirati.", "تمرّن كأن أطفالك يشاهدونك. يوماً ما سيقلدونك."],
  ["Day 45 — halfway through. Be proud, then go train.", "Dan 45 — polovina programa. Budite ponosni, pa idite na trening.", "اليوم 45 — منتصف البرنامج. افتخر بنفسك، ثم اذهب للتمرين."],
  ["Stress is high? Training is the one meeting that lowers it.", "Stres je visok? Trening je jedini sastanak koji ga smanjuje.", "التوتر مرتفع؟ التمرين هو الاجتماع الوحيد الذي يخفضه."],
  ["Count your protein today, not your calories. Hit your target.", "Danas brojite protein, ne kalorije. Dostignite cilj.", "احسب البروتين اليوم، لا السعرات. حقق هدفك."],
  ["Rough week? Do the minimum, not nothing. The 10-minute session counts.", "Teška nedelja? Uradite minimum, ne ništa. Trening od 10 minuta se računa.", "أسبوع صعب؟ افعل الحد الأدنى، لا لا شيء. حصة العشر دقائق تُحتسب."],
  ["Seven weeks of showing up. That's not luck — that's character.", "Sedam nedelja dolaženja. To nije sreća — to je karakter.", "سبعة أسابيع من الالتزام. هذا ليس حظاً — هذه شخصية."],
  ["Strength gains are showing. Write down your main lifts today.", "Snaga raste. Danas zapišite glavna dizanja.", "مكاسب القوة واضحة. سجّل رفعاتك الأساسية اليوم."],
  ["You're not training to be tired. You're training to have energy for life.", "Ne trenirate da biste bili umorni. Trenirate da imate energije za život.", "لا تتدرب لتتعب. تتدرب لتملك طاقة للحياة."],
  ["Weekends test the plan. One good choice per meal is enough.", "Vikendi testiraju plan. Jedan dobar izbor po obroku je dovoljno.", "عطلات نهاية الأسبوع تختبر الخطة. خيار جيد واحد في كل وجبة يكفي."],
  ["You're in week eight. The habit is real now — protect it.", "U osmoj ste nedelji. Navika je sada stvarna — čuvajte je.", "أنت في الأسبوع الثامن. العادة حقيقية الآن — احمها."],
  ["Hydrate before you train today. Two glasses of water, then go.", "Danas se hidrirajte pre treninga. Dve čaše vode, pa krenite.", "اشرب الماء قبل التمرين اليوم. كوبان من الماء ثم انطلق."],
  ["Push the last set today. Controlled, but honest.","Danas pogurajte poslednju seriju. Kontrolisano, ali iskreno.", "ادفع المجموعة الأخيرة اليوم. بتحكم، لكن بصدق."],
  ["Intensity phase complete. Next: transformation. You earned it.", "Faza intenziteta je završena. Sledi: transformacija. Zaslužili ste.", "اكتملت مرحلة الشدة. التالي: التحول. لقد استحققته."],
  // Phase 3 — Transformation (days 57–90)
  ["Phase 3: peak effort. Everything you built now comes together.", "Faza 3: maksimalni napor. Sve što ste izgradili sada se spaja.", "المرحلة 3: أقصى جهد. كل ما بنيته يجتمع الآن."],
  ["Take your progress photo this week. You'll want to remember this.", "Ove nedelje napravite fotografiju napretka. Želećete da zapamtite ovo.", "التقط صورة تقدمك هذا الأسبوع. ستريد أن تتذكر هذا."],
  ["You're not the same person who started on day one. Keep proving it.", "Niste ista osoba koja je počela prvog dana. Nastavite da to dokazujete.", "لست الشخص نفسه الذي بدأ في اليوم الأول. استمر في إثبات ذلك."],
  ["Hard sessions build hard men. Today is one of those.", "Teški treninzi grade jake ljude. Danas je jedan od njih.", "الحصص الصعبة تصنع رجالاً أقوياء. اليوم واحدة منها."],
  ["Energy at 5 pm used to be gone. Notice it's there now?", "Energija u 17h je ranije nestajala. Primećujete da je sada tu?", "الطاقة في الخامسة مساءً كانت تختفي. هل لاحظت أنها موجودة الآن؟"],
  ["Don't let a great week make you skip. Results love boring consistency.", "Ne dozvolite da Vas odlična nedelja natera da preskočite. Rezultati vole doslednost.", "لا تدع أسبوعاً رائعاً يجعلك تتغيب. النتائج تحب الاستمرارية."],
  ["Nine weeks. Three to go. Finish what you started.", "Devet nedelja. Još tri. Završite ono što ste počeli.", "تسعة أسابيع. بقي ثلاثة. أكمل ما بدأته."],
  ["Recovery matters more now. Sleep, water, protein — non-negotiable.", "Oporavak je sada važniji. San, voda, protein — bez pregovora.", "التعافي أهم الآن. النوم، الماء، البروتين — غير قابلة للتفاوض."],
  ["The man you're becoming doesn't negotiate with his alarm.", "Čovek koji postajete ne pregovara sa alarmom.", "الرجل الذي تصبحه لا يفاوض المنبه."],
  ["Heavy legs today. Strong legs for the next 30 years.", "Danas teške noge. Jake noge za narednih 30 godina.", "أرجل ثقيلة اليوم. أرجل قوية للثلاثين سنة القادمة."],
  ["Your family sees the change before the mirror does. Keep showing them.", "Porodica primeti promenu pre ogledala. Nastavite da im pokazujete.", "عائلتك ترى التغيير قبل المرآة. استمر في إظهاره لهم."],
  ["Count the weeks left on one hand. You can do anything for that long.", "Preostale nedelje izbrojite na jednoj ruci. Toliko možete sve.", "عدّ الأسابيع المتبقية على يد واحدة. تستطيع فعل أي شيء لهذه المدة."],
  ["Plan the week on Sunday. Busy weeks don't beat prepared people.", "Isplanirajte nedelju u nedelju. Zauzete nedelje ne pobeđuju spremne ljude.", "خطط للأسبوع يوم الأحد. الأسابيع المزدحمة لا تهزم المستعدين."],
  ["Ten weeks. You've built a body and a habit. Both are yours to keep.", "Deset nedelja. Izgradili ste telo i naviku. Oboje ostaju Vaši.", "عشرة أسابيع. بنيت جسداً وعادة. كلاهما لك لتحتفظ به."],
  ["Beat one number from last week today — a rep, a kilo, a minute.", "Danas pobedite jedan broj od prošle nedelje — ponavljanje, kilogram, minut.", "تغلّب على رقم واحد من الأسبوع الماضي — تكرار، كيلو، دقيقة."],
  ["Celebrate with something that isn't food. You've earned real rewards.", "Proslavite nečim što nije hrana. Zaslužili ste prave nagrade.", "احتفل بشيء غير الطعام. لقد استحققت مكافآت حقيقية."],
  ["Doubts are normal. Check your Monday weights — the data doesn't lie.", "Sumnje su normalne. Pogledajte ponedeljkom kilažu — podaci ne lažu.", "الشكوك طبيعية. راجع أوزان الإثنين — البيانات لا تكذب."],
  ["You don't rise to your goals. You fall to your systems. Yours works.", "Ne dostižete ciljeve, padate na nivo svojih sistema. Vaš radi.", "لا ترتقي لأهدافك، بل تنزل لمستوى أنظمتك. ونظامك يعمل."],
  ["Train today like it's week one — with the strength of week eleven.", "Trenirajte danas kao u prvoj nedelji — sa snagom jedanaeste.", "تمرّن اليوم كأنه الأسبوع الأول — بقوة الأسبوع الحادي عشر."],
  ["Think about who you'll be on day 91. That person trains today.", "Pomislite ko ćete biti 91. dana. Ta osoba danas trenira.", "فكّر في من ستكون في اليوم 91. ذلك الشخص يتدرب اليوم."],
  ["Eleven weeks. The finish line is close — sprint, don't coast.", "Jedanaest nedelja. Cilj je blizu — sprintajte, ne usporavajte.", "أحد عشر أسبوعاً. خط النهاية قريب — اركض ولا تتباطأ."],
  ["Your kids now see a dad who trains. That's a lesson for life.", "Deca sada vide oca koji trenira. To je lekcija za ceo život.", "أطفالك يرون الآن أباً يتدرب. هذا درس مدى الحياة."],
  ["Nutrition on autopilot? That's the real transformation.", "Ishrana na autopilotu? To je prava transformacija.", "التغذية على الطيار الآلي؟ هذا هو التحول الحقيقي."],
  ["One more strong week. Give it everything you've got.", "Još jedna jaka nedelja. Dajte sve od sebe.", "أسبوع قوي آخر. أعطه كل ما لديك."],
  ["Last stretch. Form tight, effort high, no skipped sessions.", "Poslednja deonica. Tehnika čista, napor visok, bez preskakanja.", "المرحلة الأخيرة. أداء محكم، جهد عالٍ، بلا تغيب."],
  ["Take your week-12 photo soon. Put it next to week one.", "Uskoro napravite fotografiju 12. nedelje. Stavite je pored prve.", "التقط صورة الأسبوع 12 قريباً. ضعها بجانب الأسبوع الأول."],
  ["One week to go. No new plans, no shortcuts — just the next session.", "Još nedelju dana. Bez novih planova, bez prečica — samo sledeći trening.", "أسبوع واحد متبقٍ. لا خطط جديدة ولا اختصارات — فقط الحصة التالية."],
  ["Write down why you started. Read it before today's workout.", "Zapišite zašto ste počeli. Pročitajte pre današnjeg treninga.", "اكتب لماذا بدأت. اقرأه قبل تمرين اليوم."],
  ["Five days left. One last push — make it your best stretch yet.", "Još pet dana. Poslednji napor — neka bude najbolji deo programa.", "خمسة أيام متبقية. دفعة أخيرة — اجعلها أفضل مرحلة."],
  ["Four days left. Finish strong — the way you'll remember it.", "Još četiri dana. Završite jako — onako kako ćete pamtiti.", "أربعة أيام متبقية. أنهِ بقوة — بالطريقة التي ستتذكرها."],
  ["Three days. You've already won — now make it official.", "Tri dana. Već ste pobedili — sada to učinite zvaničnim.", "ثلاثة أيام. لقد فزت بالفعل — الآن اجعلها رسمية."],
  ["Two days. Most people quit at day 20. You're at day 88.", "Dva dana. Većina odustane 20. dana. Vi ste na 88.", "يومان. معظم الناس يستسلمون في اليوم 20. أنت في اليوم 88."],
  ["Tomorrow is day 90. Look back at day one — and be proud of the man who kept going.", "Sutra je 90. dan. Pogledajte prvi dan — i budite ponosni na čoveka koji je nastavio.", "غداً اليوم 90. انظر إلى اليوم الأول — وافتخر بالرجل الذي استمر."],
  ["Day 90. You did it. Busy, tired, and you still showed up. Ready for round two?", "Dan 90. Uspeli ste. Zauzeti, umorni, a ipak ste dolazili. Spremni za drugi krug?", "اليوم 90. لقد فعلتها. مشغول ومتعب ومع ذلك التزمت. مستعد للجولة الثانية؟"],
];

const TITLES: Record<MotivationLocale, (day: number) => string> = {
  en: (day) => `Day ${day} of 90 · BUSY STRONG 90`,
  sr: (day) => `Dan ${day} od 90 · BUSY STRONG 90`,
  ar: (day) => `اليوم ${day} من 90 · BUSY STRONG 90`,
};

export const MOTIVATION_DAYS = MESSAGES.length;

/** Message for a program day; days past 90 start the cycle again. */
export function getMotivationMessage(day: number, locale: string): { title: string; body: string } {
  const lang: MotivationLocale = locale === "sr" || locale === "ar" ? locale : "en";
  const index = (((Math.max(1, Math.floor(day)) - 1) % MESSAGES.length) + MESSAGES.length) % MESSAGES.length;
  const [en, sr, ar] = MESSAGES[index];
  const body = lang === "sr" ? sr : lang === "ar" ? ar : en;
  return { title: TITLES[lang](index + 1), body };
}
