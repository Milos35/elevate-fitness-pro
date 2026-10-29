import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  Check,
  Languages,
  Scale,
  Smartphone,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/seo/PageMeta";
import { AppShowcaseSection } from "@/components/AppShowcaseSection";
import { CALENDLY_FREE_CALL_URL } from "@/lib/pricing";
import { usePricing } from "@/hooks/usePricing";
import { useAppLocale } from "@/hooks/useAppLocale";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import appOverview from "@/assets/app/app-overview.webp";

type Fact = { value: string; label: string; note: string };
type Step = { title: string; text: string };
type WeekMode = "gym" | "home" | "quick";
type WeekDay = { day: string; kind: "train" | "walk" | "bonus" | "rest"; focus: string; titles: Record<WeekMode, string> };
type Phase = { weeks: string; name: string; text: string; focus: string[] };
type Feature = { stat: string; title: string; text: string };

const WEEK_MODES: WeekMode[] = ["gym", "home", "quick"];

/** Session length per weekday (Mon→Sun), matching `weeklySchedule` in data/busyStrong90. Null = no timed session. */
const DAY_MINUTES = [35, null, 40, null, 35, 10, null] as const;

/** Icons for `features.items`, in order */
const FEATURE_ICONS: LucideIcon[] = [Scale, Timer, CalendarCheck, Smartphone, BellRing, Languages];

/** "About the app" — what the member app does and how a week inside it works. Modelled on the homepage's dark/light rhythm. */
const AppPage = () => {
  const { t } = useTranslation("appPage");
  const { t: tCommon } = useTranslation("common");
  const pricing = usePricing();
  const { to } = useAppLocale();
  const [mode, setMode] = useState<WeekMode>("gym");

  const facts = t("facts", { returnObjects: true }) as Fact[];
  const ticker = t("ticker", { returnObjects: true }) as string[];
  const steps = t("steps.items", { returnObjects: true }) as Step[];
  const days = t("week.days", { returnObjects: true }) as WeekDay[];
  const points = t("week.points", { returnObjects: true }) as Step[];
  const phases = t("roadmap.phases", { returnObjects: true }) as Phase[];
  const features = t("features.items", { returnObjects: true }) as Feature[];

  const pageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from("[data-hero-reveal]", { opacity: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.1 });
        // Cards fade up one after another when their group scrolls into view
        gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
          gsap.from(group.querySelectorAll("[data-reveal]"), {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: "top 85%" },
          });
        });
      },
      pageRef,
    );
    return () => mm.revert();
  }, []);

  const minutesFor = (index: number, day: WeekDay) => {
    if (day.kind === "train" && mode === "quick") return t("week.minutes", { n: 10 });
    const minutes = DAY_MINUTES[index];
    return day.kind === "walk" || minutes === null ? null : t("week.minutes", { n: minutes });
  };

  return (
    <div ref={pageRef} className="font-sans">
      <PageMeta
        title={t("meta.title")}
        description={t("meta.description", { priceOneTime: pricing.selfGuided.labelOneTime })}
        path="/app"
      />

      {/* Hero — dark with teal glows, text beside a phone showing the overview screen */}
      <section className="relative isolate overflow-hidden bg-[#070707] pb-20 pt-28 text-white md:pb-28 md:pt-36">
        <div className="pointer-events-none absolute -top-32 start-[10%] -z-10 h-[30rem] w-[30rem] rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div
          className="pointer-events-none absolute bottom-[-8rem] end-[0%] -z-10 h-[28rem] w-[28rem] rounded-full bg-[hsl(190_70%_55%/0.18)] blur-3xl"
          aria-hidden
        />
        <div className="container mx-auto grid max-w-[1200px] items-center gap-14 px-6 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <nav data-hero-reveal aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/60">
              <Link to={to("/")} className="hover:text-white">
                {t("breadcrumb.home")}
              </Link>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
              <span className="text-white">{t("breadcrumb.current")}</span>
            </nav>
            <p data-hero-reveal className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {t("hero.eyebrow")}
            </p>
            <h1 data-hero-reveal className="font-display mt-3 text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[0.95]">
              {t("hero.headline")} <span className="text-primary">{t("hero.headlineHighlight")}</span>
            </h1>
            <p data-hero-reveal className="mt-6 max-w-[540px] text-pretty text-lg leading-relaxed text-white/75">
              {t("hero.subhead")}
            </p>
            <div data-hero-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-7 font-bold text-primary-foreground shadow-[0_8px_30px_hsl(171_47%_50%/0.35)] hover:bg-primary/90"
              >
                <Link to={to("/pricing")}>
                  {tCommon("cta.getProgramPrice", { price: pricing.selfGuided.label })}
                  <ArrowRight className="icon-directional ms-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="h-12 rounded-full bg-white px-7 font-semibold text-[#0a0a0a] hover:bg-white/90">
                <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                  {tCommon("cta.bookFreeCall")}
                </a>
              </Button>
            </div>
          </div>

          <div data-hero-reveal className="mx-auto">
            <div className="relative w-[260px] rounded-[3rem] border-[10px] border-[#1a1a1a] bg-[#1a1a1a] shadow-[0_40px_100px_hsl(171_47%_50%/0.25)] sm:w-[300px] lg:w-[330px]">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] bg-[#0a0a0a]">
                <img
                  src={appOverview}
                  alt={t("hero.screenAlt")}
                  width={390}
                  height={844}
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facts — light rounded sheet over the hero bottom, like the homepage stats */}
      <section className="theme-light relative z-[1] -mt-8 overflow-hidden rounded-t-[2rem] bg-background py-14 md:py-20">
        <div className="container relative mx-auto max-w-[1100px] px-6">
          <div data-reveal-group className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {facts.map((fact) => (
              <div key={fact.label} data-reveal className="glass-light rounded-3xl px-5 py-7 text-center md:py-9">
                <p dir="ltr" className="font-display text-5xl leading-none text-foreground md:text-6xl">
                  {fact.value}
                </p>
                <span className="mx-auto mt-3 block h-0.5 w-8 rounded-full bg-primary" aria-hidden />
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-foreground">{fact.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fact.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker — teal band; the list is doubled so the loop is seamless */}
      <div className="overflow-hidden bg-primary py-4 text-[#07070a]" dir="ltr" aria-hidden>
        <div className="marquee-track flex">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {ticker.map((item) => (
                <span key={item} className="flex items-center gap-6 px-6 text-sm font-bold uppercase tracking-wider">
                  {item}
                  <span className="h-1.5 w-1.5 rounded-full bg-[#07070a]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <ul className="sr-only">
        {ticker.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {/* How it works — four numbered steps */}
      <section className="theme-light section-padding bg-background">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{t("steps.eyebrow")}</p>
          <h2 className="font-display mt-3 text-balance text-[clamp(2rem,5vw,3rem)] leading-[0.95] text-foreground">
            {t("steps.headline")} <span className="text-[hsl(171_55%_36%)]">{t("steps.headlineHighlight")}</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-pretty text-muted-foreground">{t("steps.subhead")}</p>
          <ol data-reveal-group className="mt-12 grid list-none gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal className="rounded-3xl border border-border bg-card p-7">
                <span className="font-display text-4xl leading-none text-[hsl(171_55%_36%)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Weekly plan — dark, transparent glass; the gym / home / 10-min switch changes each training day's session */}
      <section className="relative overflow-hidden bg-[hsl(0_0%_6.5%)] py-20 text-[#f5f3ee] md:py-28">
        <div className="pointer-events-none absolute start-[-6%] top-[25%] h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div
          className="pointer-events-none absolute end-[-4%] bottom-[5%] h-[24rem] w-[24rem] rounded-full bg-[hsl(190_70%_55%/0.2)] blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-[1200px] px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("week.eyebrow")}</p>
          <h2 className="font-display mt-3 text-balance text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95]">
            {t("week.headline")} <span className="text-primary">{t("week.headlineHighlight")}</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-pretty text-white/65">{t("week.subhead")}</p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
            <div className="glass-clear min-w-0 rounded-[2rem] p-3 sm:p-6">
              <div role="radiogroup" aria-label={t("week.modesLabel")} className="mb-4 flex gap-1 rounded-full bg-white/[0.06] p-1">
                {WEEK_MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                      mode === m ? "bg-primary text-[#07070a]" : "text-white/70 hover:text-white",
                    )}
                  >
                    {t(`week.modes.${m}`)}
                  </button>
                ))}
              </div>
              <ul className="list-none divide-y divide-white/10">
                {days.map((day, i) => {
                  const minutes = minutesFor(i, day);
                  const isTraining = day.kind === "train";
                  return (
                    <li key={day.day} className="flex items-center gap-3 px-1 py-3.5 sm:gap-4 sm:px-2">
                      <span
                        className={cn(
                          "w-[4.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wider sm:w-28 sm:text-xs",
                          isTraining ? "text-primary" : "text-white/45",
                        )}
                      >
                        {day.day}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block font-semibold", isTraining ? "text-white" : "text-white/70")}>
                          {day.titles[mode]}
                        </span>
                        <span className="block truncate text-xs text-white/50">{day.focus}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        {minutes && (
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-semibold",
                              isTraining ? "bg-primary/15 text-primary" : "bg-white/[0.08] text-white/70",
                            )}
                          >
                            {minutes}
                          </span>
                        )}
                        {day.kind === "bonus" && <span className="text-[10px] uppercase tracking-wider text-white/45">{t("week.optional")}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div data-reveal-group className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {points.map((point) => (
                <div key={point.title} data-reveal className="glass-clear rounded-3xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inside the app — the same feature tour as the homepage */}
      <AppShowcaseSection />

      {/* Features — dark grid of what a busy week needs */}
      <section className="relative overflow-hidden bg-[#070707] py-20 text-[#f5f3ee] md:py-28">
        <div className="pointer-events-none absolute end-[10%] top-[-6rem] h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-[1200px] px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("features.eyebrow")}</p>
          <h2 className="font-display mt-3 max-w-[18ch] text-balance text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95]">
            {t("features.headline")} <span className="text-primary">{t("features.headlineHighlight")}</span>
          </h2>
          <div data-reveal-group className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = FEATURE_ICONS[i] ?? Check;
              return (
                <div key={feature.title} data-reveal className="glass-clear flex flex-col rounded-3xl p-7">
                  <div className="flex items-start justify-between gap-4">
                    <p dir="ltr" className="font-display text-5xl leading-none text-white">
                      {feature.stat}
                    </p>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12-week roadmap — three phases on a line */}
      <section className="theme-light section-padding bg-background">
        <div className="container mx-auto max-w-[1100px] px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{t("roadmap.eyebrow")}</p>
          <h2 className="font-display mt-3 text-balance text-[clamp(2rem,5vw,3rem)] leading-[0.95] text-foreground">
            {t("roadmap.headline")} <span className="text-[hsl(171_55%_36%)]">{t("roadmap.headlineHighlight")}</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-pretty text-muted-foreground">{t("roadmap.subhead")}</p>
          <ol data-reveal-group className="relative mt-12 grid list-none gap-5 md:grid-cols-3">
            <span className="absolute inset-x-[16%] top-[2.1rem] hidden h-px bg-border md:block" aria-hidden />
            {phases.map((phase, i) => (
              <li key={phase.name} data-reveal className="relative rounded-3xl border border-border bg-card p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-lg text-[#07070a]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{phase.weeks}</p>
                <h3 className="font-display mt-1 text-3xl leading-none text-foreground">{phase.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{phase.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {phase.focus.map((f) => (
                    <span key={f} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-[hsl(171_55%_30%)]">
                      {f}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA — dark, price shown per month over a year like the pricing cards */}
      <section className="relative overflow-hidden bg-[#070707] py-24 text-center text-white md:py-32">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-[720px] px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("cta.eyebrow")}</p>
          <h2 className="font-display mt-3 text-balance text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.95]">
            {t("cta.headline")} <span className="text-primary">{t("cta.headlineHighlight")}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-pretty text-white/70">{t("cta.body")}</p>
          <div className="mt-8 flex flex-wrap items-baseline justify-center gap-x-2">
            <strong className="font-display text-5xl font-normal leading-none">{pricing.selfGuided.monthlyEquivalent}</strong>
            <span className="font-display text-2xl leading-none text-white/70">{tCommon("misc.perMonth")}</span>
          </div>
          <p className="mt-2 text-sm text-white/55">{tCommon("misc.paidOnce", { price: pricing.selfGuided.label })}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-primary px-7 font-bold text-primary-foreground shadow-[0_8px_30px_hsl(171_47%_50%/0.35)] hover:bg-primary/90"
            >
              <Link to={to("/pricing")}>
                {tCommon("cta.getProgramPrice", { price: pricing.selfGuided.label })}
                <ArrowRight className="icon-directional ms-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="h-12 rounded-full bg-white px-7 font-semibold text-[#0a0a0a] hover:bg-white/90">
              <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                {tCommon("cta.bookFreeCall")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppPage;
