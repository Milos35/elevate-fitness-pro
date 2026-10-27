import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, CalendarCheck, CirclePlay, LayoutDashboard, Lock, Route, TrendingUp, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/usePricing";
import { useAppLocale } from "@/hooks/useAppLocale";
import { cn } from "@/lib/utils";
import appOverview from "@/assets/app/app-overview.webp";
import appWeek from "@/assets/app/app-week.webp";
import appWorkout from "@/assets/app/app-workout.webp";
import appNutrition from "@/assets/app/app-nutrition.webp";
import appProgress from "@/assets/app/app-progress.webp";
import appRoadmap from "@/assets/app/app-roadmap.webp";

/** Screens captured from the member app (390×844), in the order the features are listed.
 *  `locked` screens have the paid details (sets/reps, coach tips, meals and macros) blurred into the image itself. */
const FEATURES = [
  { key: "overview", icon: LayoutDashboard, image: appOverview },
  { key: "week", icon: CalendarCheck, image: appWeek },
  { key: "workout", icon: CirclePlay, image: appWorkout, locked: true },
  { key: "nutrition", icon: Utensils, image: appNutrition, locked: true },
  { key: "progress", icon: TrendingUp, image: appProgress },
  { key: "roadmap", icon: Route, image: appRoadmap },
] as const;

const AUTO_ADVANCE_MS = 4500;

/** Shows what buyers get: the member app, one feature at a time in a phone mockup. Auto-advances until the visitor picks a feature. */
export function AppShowcaseSection() {
  const { t } = useTranslation("home");
  const { t: tCommon } = useTranslation("common");
  const pricing = usePricing();
  const { to } = useAppLocale();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % FEATURES.length), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, auto]);

  const select = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section className="theme-light section-padding bg-background">
      <div className="container mx-auto max-w-[1100px] px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{t("app.eyebrow")}</p>
            <h2 className="font-display mt-2 text-balance text-[clamp(2rem,5vw,3rem)] leading-[0.95] text-foreground">
              {t("app.headline")} <span className="text-[hsl(171_55%_36%)]">{t("app.headlineHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-[520px] text-pretty text-muted-foreground">{t("app.subhead")}</p>

            <ul className="mt-8 flex list-none flex-col gap-2">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                const isActive = i === active;
                return (
                  <li key={feature.key}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      aria-pressed={isActive}
                      className={cn(
                        "relative flex w-full gap-4 overflow-hidden rounded-2xl border p-4 text-start transition-colors",
                        isActive ? "border-border bg-card shadow-[0_8px_30px_hsl(0_0%_0%/0.06)]" : "border-transparent hover:bg-card/70",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                          isActive ? "bg-primary text-[#07070a]" : "bg-primary/10 text-[hsl(171_55%_32%)]",
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-semibold text-foreground">{t(`app.features.${feature.key}.title`)}</span>
                        <span className={cn("mt-1 block text-sm leading-relaxed text-muted-foreground", !isActive && "hidden sm:block")}>
                          {t(`app.features.${feature.key}.text`)}
                        </span>
                      </span>
                      {isActive && auto && (
                        <span
                          key={active}
                          className="app-feature-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary rtl:origin-right"
                          style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

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

          {/* Phone mockup with the active screen cross-fading in */}
          <div className="order-1 mx-auto lg:order-2">
            <div className="relative w-[290px] rounded-[3rem] border-[10px] border-[#0d0d0d] bg-[#0d0d0d] shadow-[0_40px_80px_hsl(0_0%_0%/0.25)] sm:w-[330px] lg:w-[370px]">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[2rem] bg-[#0a0a0a]">
                {FEATURES.map((feature, i) => (
                  <img
                    key={feature.key}
                    src={feature.image}
                    alt={t(`app.features.${feature.key}.title`)}
                    width={390}
                    height={844}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500",
                      i === active ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={i !== active}
                  />
                ))}
                <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" aria-hidden />
                {"locked" in FEATURES[active] && (
                  <span className="absolute inset-x-4 bottom-4 inline-flex items-center justify-center gap-2 rounded-full bg-black/70 px-4 py-2.5 text-center text-xs font-semibold text-white backdrop-blur-md">
                    <Lock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {t("app.locked")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
