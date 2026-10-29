import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Star, Loader2 } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { buildProgramCheckoutUrl } from "@/lib/stripeProgramCheckout";
import { trackInitiateCheckout } from "@/lib/metaPixel";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolvePricingCms } from "@/lib/siteCms";

const PricingPage = () => {
  const { t } = useTranslation("pricing");
  const { t: tDashboard } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const pricing = usePricing();
  const { user, hasProgramAccess, configured, loading } = useAuth();
  const navigate = useNavigate();
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
    if (!payer) {
      navigate(`/login?redirect=${encodeURIComponent("/pricing")}`);
      return;
    }
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

  return (
    <div>
      <PageMeta
        title={t("meta.title")}
        description={t("meta.description", { priceOneTime: pricing.selfGuided.labelOneTime })}
        path="/pricing"
      />
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs text-primary font-bold tracking-widest mb-4">{content.hero.eyebrow}</div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {content.hero.headline} <span className="text-gradient">{content.hero.headlineHighlight}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">{content.hero.subhead}</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg min-w-0">
          <div className="glass-card glow-green overflow-hidden min-w-0">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-5 sm:p-8 text-center border-b border-border/50">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                <Zap className="h-3 w-3" /> {content.launchBadge}
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-2">
                {pricing.selfGuided.monthlyEquivalent}{" "}
                <span className="text-xl md:text-2xl font-bold text-muted-foreground">{tCommon("misc.perMonth")}</span>
              </h2>
              <p className="text-muted-foreground text-xs leading-snug md:text-sm tracking-tight text-center text-balance px-1">
                {t("oneTimeLifetime", { price: pricing.selfGuided.label })}
              </p>
            </div>

            <div className="p-5 sm:p-8">
              <h3 className="font-bold text-sm uppercase tracking-wider text-primary mb-6">{t("everythingIncluded")}</h3>
              <div className="space-y-3 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-left break-words">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {loading ? (
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base h-auto min-h-12 py-3 px-2 leading-snug whitespace-normal"
                    disabled
                  >
                    <Loader2 className="me-2 h-4 w-4 animate-spin shrink-0" aria-hidden />
                    {t("checkout.checkingAccount")}
                  </Button>
                ) : hasProgramAccess ? (
                  <Button
                    className="w-full bg-primary text-primary-foreground font-bold text-sm md:text-base h-12 hover:bg-primary/90 animate-pulse-glow"
                    asChild
                  >
                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2">
                      {tDashboard("openYourTraining")}
                      <ArrowRight className="icon-directional h-4 w-4 shrink-0" aria-hidden />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm md:text-base h-auto min-h-12 py-3 px-2 hover:bg-primary/90 animate-pulse-glow leading-snug whitespace-normal"
                    disabled={checkoutBusy || !configured}
                    onClick={() => void startCheckout()}
                  >
                    {checkoutBusy ? (
                      <>
                        <Loader2 className="me-2 h-4 w-4 animate-spin shrink-0" aria-hidden />
                        {t("checkout.redirecting")}
                      </>
                    ) : (
                      <>
                        <span className="max-w-full text-pretty">{t("checkout.getProgram")}</span>
                        <ArrowRight className="icon-directional ms-1 h-4 w-4 shrink-0 sm:h-5 sm:w-5" aria-hidden />
                      </>
                    )}
                  </Button>
                )}

                {!hasProgramAccess && !loading && (
                  <p className="text-center text-xs text-muted-foreground">
                    {checkoutUser ? (
                      <>{t("checkout.checkoutOpensStripe")}</>
                    ) : (
                      <>
                        {t("checkout.alreadyRegistered")}{" "}
                        <Link to="/login?redirect=/pricing" className="text-primary font-semibold hover:underline">
                          {t("checkout.logIn")}
                        </Link>
                        {" · "}
                        {t("checkout.newHere")}{" "}
                        <Link to="/signup?redirect=/pricing" className="text-primary font-semibold hover:underline">
                          {t("checkout.signUp")}
                        </Link>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-xl border border-border bg-card/50 p-6 text-left">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-sm italic leading-relaxed text-muted-foreground">&ldquo;{item.quote}&rdquo;</blockquote>
                <p className="mt-4 text-sm font-bold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic max-w-md mx-auto">&ldquo;{content.coachQuote.text}&rdquo;</p>
            <p className="text-sm font-bold mt-2">{content.coachQuote.attribution}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
