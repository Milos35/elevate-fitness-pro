import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Check, Home, PhoneCall, Scale, Timer, TrendingDown } from "lucide-react";
import { TestimonialVideoCard } from "@/components/TestimonialVideoCard";
import { CountUpValue } from "@/components/CountUpValue";
import { HomeBlogSection } from "@/components/blog/HomeBlogSection";
import { resolveTestimonialsCms } from "@/lib/memberAppCms";
import { usePublishedTestimonials } from "@/hooks/usePublishedTestimonials";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import coachAbout from "@/assets/coach-about.webp";
import { PageMeta } from "@/components/seo/PageMeta";
import { HandbooksLeadSection } from "@/components/HandbooksLeadSection";
import { AppShowcaseSection } from "@/components/AppShowcaseSection";
import { TransformationsGallery } from "@/components/TransformationsGallery";
import { GoogleReviews } from "@/components/GoogleReviews";
import { GOOGLE_REVIEWS } from "@/data/googleReviews";
import { CALENDLY_FREE_CALL_URL } from "@/lib/pricing";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedHomepageCms } from "@/hooks/usePublishedHomepageCms";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import {
  resolveHomepageCoach,
  resolveHomepageFinalCta,
  resolveHomepageHero,
  resolveHomepagePillars,
  resolveHomepageStats,
  resolveHomepageTiers,
  resolveHomepageWho,
  resolveSectionHeaders,
} from "@/lib/homepageCms";
import { resolveFaqCms } from "@/lib/siteCms";
import { applyPricingTokens } from "@/lib/pricingTokens";
import { homepageStorageUrl } from "@/lib/homepageMedia";
import { useAppLocale } from "@/hooks/useAppLocale";
import { gsap } from "@/lib/gsap";

const whoCardKeys = [
  { key: "fathers", icon: "👨‍👧‍👦", featured: true },
  { key: "founders", icon: "💼" },
  { key: "professionals", icon: "🏢" },
] as const;

type FaqItem = { q: string; a: string };

/** Icons for the free-call CTA chips, in the order of `tiersCta.chips` */
const tiersCtaIcons = [Timer, CalendarDays, Home, Scale] as const;

const HomePage = () => {
  const { t } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const { t: tFaq } = useTranslation("faq");
  const pricing = usePricing();
  const { to } = useAppLocale();
  const { data: homepageCms } = usePublishedHomepageCms();
  const { data: faqCms } = usePublishedSiteCms("faq");
  const { data: testimonialsCms } = usePublishedTestimonials();
  const testimonialVideos = resolveTestimonialsCms(testimonialsCms ?? null);

  const hero = resolveHomepageHero(homepageCms?.hero, t, "Coach Milos — cable training in the gym");
  const coach = resolveHomepageCoach(homepageCms?.coach, t);
  const stats = resolveHomepageStats(homepageCms?.stats, t);
  const who = resolveHomepageWho(homepageCms?.who, t);
  const tiers = resolveHomepageTiers(homepageCms?.tiers, t);
  const tiersCta = t("tiersCta", { returnObjects: true }) as { eyebrow: string; headline: string; body: string; chips: string[] };
  const pillars = resolveHomepagePillars(homepageCms?.pillars, t);
  const testimonialsHeaders = resolveSectionHeaders(homepageCms?.testimonials, t, "testimonials");
  const faqHeaders = resolveSectionHeaders(homepageCms?.faq, t, "faq");
  const finalCta = resolveHomepageFinalCta(homepageCms?.finalCta, t);
  const faqResolved = resolveFaqCms(faqCms ?? null, tFaq);
  const faqItems = faqResolved.items.map((item) => ({
    ...item,
    a: applyPricingTokens(item.a, pricing),
  }));

  // Fallback matches what index.html preloads (same srcset/sizes), so the LCP image is fetched once
  const heroImage = homepageStorageUrl(hero.imagePath) ?? "/hero-lcp.webp";
  const heroSrcSet = hero.imagePath
    ? undefined
    : "/hero-lcp-1280.webp 1280w, /hero-lcp.webp 1920w, /hero-lcp-2000.webp 2000w";
  const coachImage = homepageStorageUrl(coach.imagePath) ?? coachAbout;
  const heroSubhead = applyPricingTokens(hero.subhead, pricing);
  const metaDescription = applyPricingTokens(t("meta.description"), pricing);

  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const tiersRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from("[data-hero-reveal]", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.1 });
        gsap.from("[data-hero-image]", { scale: 1.08, duration: 1.6, ease: "power2.out" });
      },
      heroRef,
    );
    // Parallax only when the photo is the full-bleed background (lg+)
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to("[data-hero-parallax]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      },
      heroRef,
    );
    // Cards fade up one after another when their section scrolls into view
    const revealCards = [
      [statsRef, "[data-stat-card]"],
      [tiersRef, "[data-tier-card]"],
    ] as const;
    for (const [ref, selector] of revealCards) {
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(selector, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: "top 85%" },
          });
        },
        ref,
      );
    }
    return () => mm.revert();
  }, []);

  return (
    <div className="font-sans">
      <PageMeta title={t("meta.title")} description={metaDescription} path="/" />

      {/* Hero — lg+: full-bleed photo with text over it, everything sized in em off a vw-based font-size so it scales with the screen; below lg: photo first, text underneath */}
      <section
        ref={heroRef}
        className="relative isolate flex flex-col overflow-hidden bg-[#070707] text-white lg:-mt-20 lg:min-h-[100svh]"
      >
        <div
          data-hero-parallax
          className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto"
        >
          <img
            data-hero-image
            src={heroImage}
            srcSet={heroSrcSet}
            sizes="100vw"
            alt={hero.imageAlt}
            width={1920}
            height={1080}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_20%] lg:object-[25%_20%] lg:rtl:object-[75%_20%]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070707] to-transparent lg:hidden"
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-[#070707]/90 via-[#070707]/45 via-[45%] to-transparent rtl:bg-gradient-to-l lg:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-40 bg-gradient-to-b from-[#070707]/60 to-transparent lg:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-48 bg-gradient-to-t from-[#070707] to-transparent lg:block"
          aria-hidden
        />

        <div className="container relative mx-auto -mt-8 flex flex-1 flex-col px-6 pb-12 text-[16px] lg:mt-0 lg:max-w-none lg:justify-center lg:px-[5vw] lg:pb-[4em] lg:pt-[7em] lg:text-[clamp(13px,1.1vw,24px)]">
          <div className="max-w-[36em]">
            <p data-hero-reveal className="mb-[0.75em] text-pretty text-[1.05em] leading-relaxed text-white/70 lg:text-[1.15em]">
              {hero.eyebrow}
            </p>
            <h1
              data-hero-reveal
              className="font-display text-[3em] leading-[0.95] text-white sm:text-[3.75em] lg:text-[4.75em]"
            >
              <span className="block max-w-[18ch] text-balance">
                {hero.headline}{" "}
                <span className="text-primary">{hero.headlineEnergy}</span> {hero.headlineSuffix}
              </span>
            </h1>
            <p data-hero-reveal className="mt-[1.25em] max-w-[31em] text-pretty text-[1.1em] leading-relaxed text-white/75">
              {heroSubhead}
            </p>
            <div data-hero-reveal className="mt-[2em] flex flex-col gap-[0.75em] sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                className="h-[3em] rounded-full bg-primary px-[1.75em] text-[1em] font-bold text-primary-foreground shadow-[0_8px_30px_hsl(171_47%_50%/0.35)] transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.04] hover:bg-primary/90 hover:shadow-[0_12px_40px_hsl(171_47%_50%/0.5)] motion-reduce:hover:scale-100"
              >
                <Link to={to("/pricing")}>
                  {tCommon("cta.seePlans")}
                  <ArrowRight className="icon-directional ms-1 !h-[1em] !w-[1em]" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-[3em] rounded-full bg-white px-[1.75em] text-[1em] font-semibold text-[#0a0a0a] hover:bg-white/90"
              >
                <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                  {tCommon("cta.bookFreeCall")}
                </a>
              </Button>
            </div>
            {/* Proof in the first screen: one real client result (no photos, client's wish) */}
            <div
              data-hero-reveal
              className="mt-[1.25em] inline-flex max-w-full items-center gap-[0.6em] rounded-2xl border border-primary/30 bg-black/40 px-[1em] py-[0.6em] backdrop-blur-sm"
            >
              <TrendingDown className="h-[1.4em] w-[1.4em] shrink-0 text-primary" aria-hidden />
              <span className="text-[0.9em] leading-snug text-white/90">
                <span className="font-bold text-primary">{t("hero.proofLabel")}:</span> {t("hero.proof")}
              </span>
            </div>
            <div data-hero-reveal className="mt-[1.5em] flex flex-wrap gap-[0.5em]">
              {hero.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-[1em] py-[0.35em] text-[0.75em] font-semibold tracking-tight text-primary"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats — first light (#fdfcfa) section, slides over the hero bottom as a rounded sheet */}
      <section
        ref={statsRef}
        className="theme-light relative z-[1] -mt-8 overflow-hidden rounded-t-[2rem] bg-background py-14 md:py-20"
      >
        <div className="pointer-events-none absolute -top-24 start-[8%] h-72 w-72 rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div
          className="pointer-events-none absolute -bottom-28 end-[6%] h-80 w-80 rounded-full bg-[hsl(190_60%_70%/0.35)] blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-[1100px] px-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((s) => (
              <div key={s.label} data-stat-card className="glass-light rounded-3xl px-5 py-7 text-center md:py-9">
                <h3 className="font-display text-5xl leading-none text-foreground md:text-6xl">
                  <CountUpValue value={s.value} />
                </h3>
                <span className="mx-auto mt-3 block h-0.5 w-8 rounded-full bg-primary" aria-hidden />
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real client before/after photos right after the numbers: proof before the pitch */}
      <TransformationsGallery />

      {GOOGLE_REVIEWS.length > 0 && (
        <div className="bg-[#070707] px-6 py-14 md:py-20">
          <GoogleReviews className="container mx-auto max-w-[1100px]" />
        </div>
      )}

      {/* Who — plain light #fdfcfa, no gradients */}
      <section className="theme-light section-padding bg-background">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{who.eyebrow}</p>
          <h2 className="font-display text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            {who.headline} <span className="text-[hsl(171_55%_36%)]">{who.headlineHighlight}</span> {who.headlineSuffix}
          </h2>
          <p className="mb-10 mt-4 max-w-[600px] text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">
            {who.body}
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whoCardKeys.map((c) => (
              <div
                key={c.key}
                className={`group rounded-xl border bg-card p-8 transition-colors ${
                  c.featured
                    ? "border-2 border-primary"
                    : "border-border hover:border-primary/60"
                }`}
              >
                {c.featured && (
                  <div className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[hsl(171_55%_30%)]">
                    {who.mostCommon}
                  </div>
                )}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                  style={{ background: "hsl(171 47% 50% / 0.12)" }}
                >
                  {c.icon}
                </div>
                <h4 className="font-sans text-base font-bold text-foreground">{who.cards[c.key].title}</h4>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{who.cards[c.key].text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppShowcaseSection />

      {/* Tiers — dark Anatoly-style pricing: left-aligned header, fully transparent blurred-glass cards over teal glows, free-call CTA card */}
      <section id="coaching" ref={tiersRef} className="relative overflow-hidden bg-[hsl(0_0%_6.5%)] py-20 md:py-28">
        <div className="pointer-events-none absolute start-[-6%] top-[30%] h-[28rem] w-[28rem] rounded-full bg-primary/30 blur-3xl" aria-hidden />
        <div
          className="pointer-events-none absolute end-[-4%] top-[22%] h-[26rem] w-[26rem] rounded-full bg-[hsl(190_70%_55%/0.25)] blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-[1200px] px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{tiers.eyebrow}</p>
          <h2 className="font-display mt-3 text-balance text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.95] text-foreground">
            {tiers.headlinePrefix} <span className="text-primary">{tiers.headlineProgram}</span> {tiers.headlineMiddle}{" "}
            <span className="text-primary">{tiers.headlineCoach}</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-pretty text-muted-foreground">{tiers.subhead}</p>

          <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-3 md:gap-4 lg:gap-5">
            <div data-tier-card className="glass-clear flex flex-col rounded-[2rem] p-7 text-[#f5f3ee] lg:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#717786]">{tiers.selfGuided.tier}</p>
              <h3 className="font-display mt-1.5 text-2xl leading-none">{tiers.selfGuided.name}</h3>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
                <strong className="font-display text-[45px] font-normal leading-[0.95]">{pricing.selfGuided.label}</strong>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-[#717786]">
                {tCommon("misc.paidOnce")}
              </p>
              <Button
                asChild
                className="mt-6 h-12 w-full justify-between rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-wide text-[#07070a] hover:bg-primary/90"
              >
                <Link to={to("/pricing")}>
                  {tiers.selfGuided.cta}
                  <ArrowRight className="icon-directional h-4 w-4" />
                </Link>
              </Button>
              <ul className="mt-6 flex-1 list-none space-y-3 border-t border-white/10 pt-6 text-[13px] font-semibold">
                {tiers.selfGuided.benefits.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-tier-card
              className="relative flex flex-col rounded-[2rem] border border-primary/25 bg-transparent p-7 text-[#f5f3ee] backdrop-blur-xl backdrop-saturate-150 md:-my-4 md:py-11 lg:p-8 lg:py-12"
            >
              <div className="neon-border" aria-hidden>
                <div className="neon-glow opacity-50 blur-[8px]">
                  <div className="neon-ring [--w:10px]" />
                </div>
                <div className="neon-glow opacity-30 blur-[15px]">
                  <div className="neon-ring [--w:17px]" />
                </div>
                <div className="neon-glow opacity-[0.18] blur-[57px]">
                  <div className="neon-ring [--w:27px]" />
                </div>
                <div className="neon-ring [--w:2px]" />
              </div>
              <span className="absolute -top-3.5 start-7 z-[3] inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-display text-[13.5px] leading-none tracking-wide text-[#0c0c0c] shadow-md">
                <span aria-hidden>🔥</span>
                {tiers.coached.recommended}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{tiers.coached.tier}</p>
              <h3 className="font-display mt-1.5 text-2xl leading-none">{tiers.coached.name}</h3>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
                <strong className="font-display text-[45px] font-normal leading-[0.95]">{pricing.coachedStrong90.label}</strong>
                <span className="font-display text-[30px] leading-none">{tCommon("misc.perMonth")}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-white/60">{tiers.coached.recommendedNote}</p>
              <Button
                asChild
                className="mt-6 h-12 w-full justify-between rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-wide text-[#07070a] shadow-[0_8px_30px_hsl(171_47%_50%/0.35)] hover:bg-primary/90"
              >
                <Link to={to("/coaching-apply?plan=coached-strong-90#apply")}>
                  {tiers.coached.cta}
                  <ArrowRight className="icon-directional h-4 w-4" />
                </Link>
              </Button>
              <ul className="mt-6 flex-1 list-none space-y-3 border-t border-white/10 pt-6 text-[13px] font-semibold">
                {tiers.coached.benefits.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <div data-tier-card className="glass-clear flex flex-col rounded-[2rem] p-7 text-[#f5f3ee] lg:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#717786]">{tiers.elite.tier}</p>
              <h3 className="font-display mt-1.5 text-2xl leading-none">{tiers.elite.name}</h3>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-2">
                <strong className="font-display text-[45px] font-normal leading-[0.95]">{pricing.privateTransformation.label}</strong>
                <span className="font-display text-[30px] leading-none">{tCommon("misc.perMonth")}</span>
              </div>
              <Button
                asChild
                className="mt-6 h-12 w-full justify-between rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-wide text-[#07070a] hover:bg-primary/90"
              >
                <Link to={to("/coaching-apply?plan=private-transformation#apply")}>
                  {tiers.elite.cta}
                  <ArrowRight className="icon-directional h-4 w-4" />
                </Link>
              </Button>
              <ul className="mt-6 flex-1 list-none space-y-3 border-t border-white/10 pt-6 text-[13px] font-semibold">
                {tiers.elite.benefits.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Free-call CTA card */}
          <div
            data-tier-card
            className="relative mt-16 overflow-hidden rounded-[2.25rem] border-s-4 border-primary bg-[#141414] text-white md:mt-20"
          >
            <div
              className="pointer-events-none absolute inset-y-0 start-0 w-2/5 bg-gradient-to-r from-primary/20 to-transparent rtl:bg-gradient-to-l"
              aria-hidden
            />
            <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10 lg:px-12">
              <div className="hidden h-20 w-20 items-center justify-center rounded-2xl border border-primary/60 bg-primary/10 sm:flex">
                <PhoneCall className="h-8 w-8 text-primary" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{tiersCta.eyebrow}</p>
                <h3 className="font-display mt-3 max-w-[20ch] text-balance text-[clamp(2rem,3.5vw,3.25rem)] leading-[0.95]">
                  {tiersCta.headline}
                </h3>
                <p className="mt-4 max-w-[480px] text-pretty text-sm leading-relaxed text-white/65 md:text-base">{tiersCta.body}</p>
              </div>
              <div className="flex flex-col gap-6 lg:max-w-[440px]">
                <div className="flex flex-wrap gap-2">
                  {tiersCta.chips.map((chip, i) => {
                    const Icon = tiersCtaIcons[i % tiersCtaIcons.length];
                    return (
                      <span
                        key={chip}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary"
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {chip}
                      </span>
                    );
                  })}
                </div>
                <Button
                  asChild
                  className="h-14 self-start rounded-2xl bg-primary px-8 text-base font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
                >
                  <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                    {tCommon("cta.bookFreeCall")}
                    <ArrowRight className="icon-directional ms-1 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HandbooksLeadSection />

      {/* Pillars — fully transparent glass cards over soft teal glows */}
      <section className="section-padding relative overflow-hidden">
        <div className="pointer-events-none absolute start-[8%] top-[45%] h-[24rem] w-[24rem] rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute end-[6%] top-[35%] h-[22rem] w-[22rem] rounded-full bg-[hsl(190_70%_55%/0.2)] blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{pillars.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {pillars.headlinePrefix} <span className="text-primary">{pillars.headlineBrand}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-[1.05rem] text-muted-foreground">{pillars.subhead}</p>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.items.map((p) => (
              <div
                key={p.num}
                className="glass-clear relative overflow-hidden rounded-[2rem] p-8 pt-10 text-center"
              >
                <div className="absolute left-0 right-0 top-0 h-0.5 bg-primary" />
                <div className="font-display text-5xl text-primary/30 md:text-6xl">{p.num}</div>
                <h3 className="mt-1 font-display text-2xl text-foreground md:text-3xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach — light #fdfcfa; lg+: photo fills the left half edge to edge, text on the right half */}
      <section className="theme-light bg-background lg:grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[680px]">
          <img
            src={coachImage}
            alt={coach.imageAlt}
            width={1024}
            height={576}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[52%_20%]"
          />
        </div>
        <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16 lg:py-20 xl:px-24">
          <div className="max-w-[560px]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{coach.eyebrow}</p>
            <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,2.75rem)] text-foreground">
              {coach.headline} <span className="text-[hsl(171_55%_36%)]">{coach.headlineHighlight}</span>
            </h2>
            {coach.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-4 text-[0.95rem] leading-8 text-foreground/75 first:mt-5">
                {paragraph}
              </p>
            ))}
            <p className="mt-4 text-[0.95rem] font-medium leading-8 text-[hsl(171_55%_30%)]">{coach.highlight}</p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {coach.stats.map((s) => (
                <div key={s.label}>
                  <h3 className="font-display text-3xl text-[hsl(171_55%_36%)]">{s.value}</h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding border-t border-border/60 bg-card/30">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{testimonialsHeaders.eyebrow}</p>
          <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
            {testimonialsHeaders.headline} <span className="text-primary">{testimonialsHeaders.headlineHighlight}</span>
          </h2>
          <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">{testimonialsHeaders.subhead}</p>
          {/* Sticky stack: cards stick near the top and later ones slide up over them — two per row on md+, one at a time on mobile.
              Each row sticks 16px lower than the one before so the stacked edges stay visible. */}
          <div className="mt-12 grid grid-cols-1 justify-items-center gap-y-[12svh] md:grid-cols-2 md:gap-x-6">
            {testimonialVideos.map((item, i) => (
              <div
                key={item.id}
                className="sticky top-[calc(max(6rem,13svh)+var(--row-m)*16px)] md:top-[calc(max(6rem,13svh)+var(--row-d)*16px)] md:even:justify-self-start md:odd:justify-self-end"
                style={{ "--row-m": i, "--row-d": Math.floor(i / 2) } as CSSProperties}
              >
                <TestimonialVideoCard testimonial={item} />
              </div>
            ))}
            {/* Scroll room so the last row stays stacked on top for a moment before the section scrolls away */}
            <div className="col-span-full h-[25svh]" aria-hidden />
          </div>
        </div>
      </section>

      <HomeBlogSection />

      {/* FAQ — Anatoly-style: dark; on lg the title + CTA stay sticky on the left while the questions scroll up on the right */}
      <section className="bg-[#07070a] py-20 lg:py-[120px]">
        <div className="container mx-auto grid max-w-[1278px] grid-cols-1 gap-10 px-6 lg:grid-cols-[397fr_780fr] lg:gap-[52px]">
          <div className="lg:sticky lg:top-[180px] lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-primary">{faqHeaders.eyebrow}</p>
            <h2 className="font-display mt-3 text-balance text-[40px] uppercase leading-[0.95] text-[#f5f3ee] lg:text-[45px]">
              {faqHeaders.headline} <span className="text-primary">{faqHeaders.headlineHighlight}</span>
            </h2>
            <p className="mt-4 max-w-[397px] text-pretty text-[15px] leading-relaxed text-[#f5f3ee]/[0.68]">{faqHeaders.subhead}</p>
            <Button
              asChild
              className="mt-8 h-12 gap-6 rounded-xl bg-primary px-6 text-xs font-bold uppercase tracking-wide text-[#07070a] hover:bg-primary/90"
            >
              <Link to={to("/pricing")}>
                {tCommon("cta.getProgramPrice", { price: pricing.selfGuided.label })}
                <ArrowRight className="icon-directional h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="flex w-full flex-col gap-1.5">
            {faqItems.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-[18px] border-0 bg-[#171717] px-6">
                <AccordionTrigger className="gap-4 py-6 text-start text-lg font-bold leading-snug text-white hover:no-underline [&>svg]:h-[26px] [&>svg]:w-[26px] [&>svg]:rounded-full [&>svg]:bg-white/10 [&>svg]:p-[5px] [&>svg]:text-white">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="-mt-3 pb-6 text-[15px] leading-relaxed text-white/75">
                  {f.a
                    .replaceAll("{{selfGuided}}", pricing.selfGuided.label)
                    .replaceAll("{{coachedMonthly}}", pricing.coachedStrong90.labelMonthly)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA — light #fdfcfa. lg+: the photo spans the whole section like the hero, 120% wide so the figure sits on the right,
          cropped at the waist (section is 50vw tall ≈ waist line), text on the left over a light fade.
          Below lg: photo first (image 135% of the box, so the box ends at the waist), text underneath. */}
      <section id="apply" className="theme-light relative isolate flex flex-col overflow-hidden bg-background lg:h-[max(560px,50vw)] lg:justify-center">
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
          <img
            src="/final-cta.webp"
            srcSet="/final-cta-1280.webp 1280w, /final-cta.webp 2000w"
            sizes="(min-width: 1024px) 120vw, 100vw"
            alt=""
            width={2000}
            height={1125}
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 top-0 h-[135%] w-full object-cover object-top lg:inset-x-auto lg:start-0 lg:h-auto lg:w-[120%] lg:max-w-none"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent lg:hidden"
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-background from-[30%] via-background/70 via-[40%] to-transparent to-[52%] rtl:bg-gradient-to-l lg:block"
          aria-hidden
        />

        <div className="container relative mx-auto px-6 pb-16 pt-6 lg:mx-0 lg:max-w-none lg:px-[5vw] lg:py-16">
          <div className="max-w-[560px] lg:max-w-[min(440px,32vw)]">
            <h2 className="font-display text-balance text-[clamp(2.5rem,4.5vw,4rem)] leading-[0.95] text-foreground">
              {finalCta.headline} <span className="text-[hsl(171_55%_36%)]">{finalCta.headlineHighlight}</span>
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground lg:text-lg">{finalCta.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-[0_8px_30px_hsl(171_47%_50%/0.35)] transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.04] hover:bg-primary/90 motion-reduce:hover:scale-100"
              >
                <Link to={to("/pricing")}>
                  {tCommon("cta.seePlans")}
                  <ArrowRight className="icon-directional ms-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-foreground/15 bg-card px-7 text-base font-semibold text-foreground hover:bg-card/80"
              >
                <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                  {tCommon("cta.bookFreeCall")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
