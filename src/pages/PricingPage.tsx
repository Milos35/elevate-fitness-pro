import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star, Loader2, PhoneCall, ShieldCheck, TrendingDown } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { buildProgramCheckoutUrl } from "@/lib/stripeProgramCheckout";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolvePricingCms } from "@/lib/siteCms";
import { CALENDLY_FREE_CALL_URL } from "@/lib/pricing";
import { usePublishedHomepageCms } from "@/hooks/usePublishedHomepageCms";
import { resolveHomepageTiers } from "@/lib/homepageCms";
import { useAppLocale } from "@/hooks/useAppLocale";

const PricingPage = () => {
  const { t } = useTranslation("pricing");
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const { t: tHome } = useTranslation("home");
  const { to } = useAppLocale();
  const { data: homepageCms } = usePublishedHomepageCms();
  const tiers = resolveHomepageTiers(homepageCms?.tiers, tHome);
  const pricing = usePricing();
  const { user, hasProgramAccess, configured, loading } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const { data: pricingCms } = usePublishedSiteCms("pricing");
  const content = resolvePricingCms(pricingCms ?? null, t);

  const features = content.features;
  const testimonials = content.testimonials;

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled && session?.user) setSessionUser(session.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured]);

  useEffect(() => {
    if (user) setSessionUser(user);
  }, [user]);

  const checkoutUser = user ?? sessionUser;

  useEffect(() => {
    if (searchParams.get("checkout") === "canceled") {
      toast({
        title: t("checkout.canceledTitle"),
        description: t("checkout.canceledDescription"),
      });
      const next = new URLSearchParams(searchParams);
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, toast, t]);

  async function startCheckout() {
    if (!configured) {
      toast({
        title: t("checkout.notConfiguredTitle"),
        description: t("checkout.notConfiguredDescription"),
        variant: "destructive",
      });
      return;
    }
    let payer = checkoutUser;
    if (!payer) {
      const { data } = await supabase.auth.getSession();
      payer = data.session?.user ?? null;
    }
    // No account needed: guests pay first, the account is created from the email used at Stripe.
    setCheckoutBusy(true);
    try {
      trackInitiateCheckout(pricing.selfGuided.amount, pricing.currency);
      window.location.href = buildProgramCheckoutUrl(payer);
    } catch {
      toast({
        title: t("checkout.failedTitle"),
        description: t("checkout.failedDescription"),
        variant: "destructive",
      });
    } finally {
      setCheckoutBusy(false);
    }
  }

  const programButton = loading ? (
    <Button type="button" className="h-12 w-full bg-primary font-bold text-primary-foreground" disabled>
      <Loader2 className="me-2 h-4 w-4 shrink-0 animate-spin" aria-hidden />
      {t("checkout.checkingAccount")}
    </Button>
  ) : hasProgramAccess ? (
    <Button className="h-12 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90" asChild>
      <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2">
        {tDashboard("openYourTraining")}
        <ArrowRight className="icon-directional h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </Button>
  ) : (
    <Button
      type="button"
      className="h-12 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
      disabled={checkoutBusy || !configured}
      onClick={() => void startCheckout()}
    >
      {checkoutBusy ? (
        <>
          <Loader2 className="me-2 h-4 w-4 shrink-0 animate-spin" aria-hidden />
          {t("checkout.redirecting")}
        </>
      ) : (
        <>
          {t("plans.programCta")} · {pricing.selfGuided.label}
          <ArrowRight className="icon-directional ms-1 h-4 w-4 shrink-0" aria-hidden />
        </>
      )}
    </Button>
  );

  return (
    <div>
      <PageMeta
        title={t("meta.title")}
        description={t("meta.description", { priceOneTime: pricing.selfGuided.labelOneTime })}
        path="/pricing"
      />

      <section className="px-4 pb-10 pt-24 md:pb-14 md:pt-32">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="mb-4 text-xs font-bold tracking-widest text-primary">{t("plans.eyebrow")}</div>
          <h1 className="text-balance text-4xl font-black md:text-6xl">
            {t("plans.headline")} <span className="text-gradient">{t("plans.headlineHighlight")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-muted-foreground">{t("plans.subhead")}</p>
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-start">
            <TrendingDown className="h-6 w-6 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">{t("plans.proofLabel")}</p>
              <p className="text-sm font-semibold text-foreground">{t("plans.proof")}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="px-3 pb-16 sm:px-4 md:pb-24">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
          {/* Coached first on mobile: the main offer */}
          <div className="glass-card glow-green relative order-1 flex flex-col border-2 border-primary p-6 sm:p-8 md:order-2">
            <span className="absolute -top-3 start-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              {tiers.coached.recommended || t("plans.coachedNote")}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{tiers.coached.tier}</p>
            <h2 className="mt-1 text-2xl font-black">{tiers.coached.name}</h2>
            <p className="mt-4 text-4xl font-black">
              {pricing.coachedStrong90.label}
              <span className="text-lg font-bold text-muted-foreground">{t("plans.perMonth")}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("plans.coachedNote")}</p>
            <Button asChild className="mt-6 h-12 w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              <Link to={to("/coaching-apply?plan=coached-strong-90#apply")}>
                {t("plans.coachedCta")}
                <ArrowRight className="icon-directional ms-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <ul className="mt-6 space-y-3 border-t border-border/50 pt-6 text-sm">
              {tiers.coached.benefits.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card order-2 flex flex-col p-6 sm:p-8 md:order-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("plans.programTier")}</p>
            <h2 className="mt-1 text-2xl font-black">{t("plans.programName")}</h2>
            <p className="mt-4 text-4xl font-black">{pricing.selfGuided.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("plans.programOnce")}</p>
            <div className="mt-6">{programButton}</div>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
              <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              {t("plans.checkoutNote")}
            </p>
            <p className="mt-6 border-t border-border/50 pt-6 text-xs font-bold uppercase tracking-wider text-primary">
              {t("plans.seeAll")}
            </p>
            <ul className="mt-3 space-y-2.5 text-sm">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                  <span className="break-words">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card order-3 flex flex-col p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{tiers.elite.tier}</p>
            <h2 className="mt-1 text-2xl font-black">{tiers.elite.name}</h2>
            <p className="mt-4 text-4xl font-black">
              {pricing.privateTransformation.label}
              <span className="text-lg font-bold text-muted-foreground">{t("plans.perMonth")}</span>
            </p>
            <Button asChild variant="outline" className="mt-6 h-12 w-full font-bold">
              <Link to={to("/coaching-apply?plan=private-transformation#apply")}>
                {t("plans.eliteCta")}
                <ArrowRight className="icon-directional ms-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <ul className="mt-6 space-y-3 border-t border-border/50 pt-6 text-sm">
              {tiers.elite.benefits.map((x) => (
                <li key={x} className="flex gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container mx-auto mt-10 max-w-6xl">
          <div className="flex flex-col gap-5 rounded-3xl border-s-4 border-primary bg-card/60 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <PhoneCall className="mt-1 hidden h-8 w-8 shrink-0 text-primary sm:block" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{t("plans.callEyebrow")}</p>
                <h3 className="mt-1 text-2xl font-black">{t("plans.callHeadline")}</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t("plans.callBody")}</p>
              </div>
            </div>
            <Button asChild className="h-12 shrink-0 bg-primary px-8 font-bold text-primary-foreground hover:bg-primary/90">
              <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
                {t("plans.callCta")}
                <ArrowRight className="icon-directional ms-1 h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>

        {testimonials.length > 0 && (
          <div className="container mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-xl border border-border bg-card/50 p-6 text-left">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden />
                  ))}
                </div>
                <blockquote className="text-sm italic leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</blockquote>
                <p className="mt-4 text-sm font-bold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>
        )}

        <div className="container mx-auto mt-12 max-w-md text-center">
          <p className="text-sm italic text-muted-foreground">&ldquo;{content.coachQuote.text}&rdquo;</p>
          <p className="mt-2 text-sm font-bold">{content.coachQuote.attribution}</p>
          <p className="mt-6 text-xs text-muted-foreground">{t("plans.guarantee")}</p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
