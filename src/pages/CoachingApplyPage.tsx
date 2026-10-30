import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageMeta } from "@/components/seo/PageMeta";
import { usePricing } from "@/hooks/usePricing";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveCoachingCms } from "@/lib/siteCms";
import { parseCoachingPlanParam } from "@/lib/coachingPlan";
import { trackLead } from "@/lib/metaPixel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const ageOptions = ["25-34", "35-39", "40-44", "45-49", "50+"] as const;
const roleOptions = ["founder", "corporate", "parent", "freelance", "other"] as const;
const fitnessOptions = ["scratch", "inconsistent", "no-results", "experienced"] as const;
const minutesOptions = ["20-30", "30-40", "40-60", "less"] as const;

export default function CoachingApplyPage() {
  const { t } = useTranslation("coaching");
  const { toast } = useToast();
  const pricing = usePricing();
  const { data: coachingCms } = usePublishedSiteCms("coaching");
  const content = resolveCoachingCms(coachingCms ?? null, t);
  const [searchParams] = useSearchParams();
  const coachingPlanSlug = useMemo(() => parseCoachingPlanParam(searchParams.get("plan")), [searchParams]);
  const coachingPlanDisplay = useMemo(() => {
    if (!coachingPlanSlug) return null;
    const planKey = coachingPlanSlug === "coached-strong-90" ? "coachedStrong90" : "privateTransformation";
    const price =
      coachingPlanSlug === "coached-strong-90"
        ? pricing.coachedStrong90.labelMonthly
        : pricing.privateTransformation.labelMonthly;
    const name = t(`planPicker.${planKey}.name`);
    const tier = t(`planPicker.${planKey}.tier`, { price });
    return {
      name,
      tier,
      price,
      emailLabel: `${name} — ${tier}`,
    };
  }, [coachingPlanSlug, pricing, t]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");
  const [fitness, setFitness] = useState("");
  const [goal, setGoal] = useState("");
  const [triedBefore, setTriedBefore] = useState("");
  const [minutes, setMinutes] = useState("");
  const [anythingElse, setAnythingElse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      toast({ title: t("toast.incompleteTitle"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/coaching-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          whatsapp,
          location,
          age,
          role,
          fitness,
          goal,
          triedBefore,
          minutes,
          anythingElse,
          coachingPlan: coachingPlanSlug ?? "",
          coachingPlanLabel: coachingPlanDisplay?.emailLabel ?? "",
        }),
      });
      const ct = r.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        throw new Error(t("toast.deployError"));
      }
      const data = (await r.json()) as { ok?: boolean; error?: string; warning?: string };
      if (!r.ok || !data.ok) {
        throw new Error(
          data.error ||
            (r.status === 503 ? t("toast.emailNotConfigured") : t("toast.serverError"))
        );
      }
      toast({
        title: t("toast.successTitle"),
        description: data.warning ? data.warning : t("toast.successDescription"),
      });
      trackLead("Coaching Application", {
        content_ids: coachingPlanSlug ?? "general",
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setWhatsapp("");
      setLocation("");
      setAge("");
      setRole("");
      setFitness("");
      setGoal("");
      setTriedBefore("");
      setMinutes("");
      setAnythingElse("");
    } catch (err) {
      toast({
        title: t("toast.errorTitle"),
        description: err instanceof Error ? err.message : t("toast.errorFallback"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans">
      <PageMeta title={t("meta.title")} description={t("meta.description")} path="/coaching-apply" />
      <div className="mx-auto max-w-[680px] px-6 py-12 md:py-16">
        <Link
          to="/#coaching"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {coachingPlanDisplay ? t("back.toPlan", { planName: coachingPlanDisplay.name }) : t("back.toCoaching")}
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{content.heading.eyebrow}</p>
          <h1 className="font-display text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            {content.heading.title} <span className="text-primary">{content.heading.titleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-lg text-pretty text-[1.05rem] leading-relaxed text-muted-foreground">{content.heading.body}</p>
          {coachingPlanDisplay ? (
            <div
              className={cn(
                "mt-8 max-w-lg rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/[0.12] to-primary/[0.03] p-6 shadow-[0_0_0_1px_hsl(var(--primary)/0.08)]"
              )}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("planPicker.applyingFor")}</p>
              <p className="mt-3 font-display text-balance text-2xl font-black tracking-tight text-foreground md:text-3xl">
                {coachingPlanDisplay.name}
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">{coachingPlanDisplay.tier}</p>
              <p className="mt-5 font-display text-4xl font-black tracking-tight text-foreground md:text-5xl">{coachingPlanDisplay.price}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t("planPicker.monthlyBilling")}</p>
            </div>
          ) : (
            <div className="mt-8 max-w-lg space-y-4 rounded-2xl border border-border bg-[#0d0d0d] p-5">
              <p className="text-sm text-muted-foreground">
                {t("planPicker.noPlanBody")}{" "}
                <Link to="/#coaching" className="font-semibold text-primary hover:underline">
                  {t("planPicker.pricingCards")}
                </Link>{" "}
                {t("planPicker.noPlanBodySuffix")}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button asChild variant="outline" className="h-auto justify-start border-primary/40 py-3 text-left">
                  <Link to="/coaching-apply?plan=coached-strong-90#apply" className="flex flex-col gap-0.5">
                    <span className="font-display text-base font-bold text-foreground">{t("planPicker.coachedStrong90.name")}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {t("planPicker.coachedStrong90.tier", { price: pricing.coachedStrong90.labelMonthly })}
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto justify-start border-primary/40 py-3 text-left">
                  <Link to="/coaching-apply?plan=private-transformation#apply" className="flex flex-col gap-0.5">
                    <span className="font-display text-base font-bold text-foreground">{t("planPicker.privateTransformation.name")}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {t("planPicker.privateTransformation.tier", { price: pricing.privateTransformation.labelMonthly })}
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.firstName.label")}</Label>
              <Input
                className="h-11 border-border bg-[#111] text-foreground"
                placeholder={t("form.firstName.placeholder")}
                required
                value={firstName}
                onChange={(ev) => setFirstName(ev.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.lastName.label")}</Label>
              <Input
                className="h-11 border-border bg-[#111] text-foreground"
                placeholder={t("form.lastName.placeholder")}
                value={lastName}
                onChange={(ev) => setLastName(ev.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.email.label")}</Label>
              <Input
                type="email"
                className="h-11 border-border bg-[#111] text-foreground"
                placeholder={t("form.email.placeholder")}
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.whatsapp.label")}</Label>
              <Input
                type="tel"
                className="h-11 border-border bg-[#111] text-foreground"
                placeholder={t("form.whatsapp.placeholder")}
                value={whatsapp}
                onChange={(ev) => setWhatsapp(ev.target.value)}
                disabled={submitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("form.goal.label")}</Label>
            <p className="text-xs text-muted-foreground">{t("form.goal.hint")}</p>
            <Textarea
              className="min-h-[100px] border-border bg-[#111] text-foreground"
              placeholder={t("form.goal.placeholder")}
              required
              value={goal}
              onChange={(ev) => setGoal(ev.target.value)}
              disabled={submitting}
            />
          </div>

          <details className="group rounded-xl border border-border bg-[#0d0d0d] p-4 open:pb-6">
            <summary className="cursor-pointer list-none text-sm font-semibold text-foreground">
              {t("form.moreOptional")}
              <span className="ms-2 text-primary group-open:hidden">+</span>
            </summary>
            <div className="mt-6 flex flex-col gap-7">
          <div className="space-y-2">
            <Label>{t("form.location.label")}</Label>
            <Input
              className="h-11 border-border bg-[#111] text-foreground"
              placeholder={t("form.location.placeholder")}
              value={location}
              onChange={(ev) => setLocation(ev.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="h-px bg-border" aria-hidden />

          <div className="space-y-2">
            <Label>{t("form.age.label")}</Label>
            <Select value={age} onValueChange={setAge} disabled={submitting}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder={t("form.age.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {ageOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {t(`form.age.options.${opt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("form.role.label")}</Label>
            <Select value={role} onValueChange={setRole} disabled={submitting}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder={t("form.role.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {t(`form.role.options.${opt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("form.fitness.label")}</Label>
            <RadioGroup value={fitness} onValueChange={setFitness} className="gap-2" disabled={submitting}>
              {fitnessOptions.map((opt) => (
                <div
                  key={opt}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-[#111] p-4 transition-colors hover:border-primary/40",
                    fitness === opt && "border-primary/50",
                    submitting && "pointer-events-none opacity-70"
                  )}
                >
                  <RadioGroupItem value={opt} id={`fit-${opt}`} className="mt-1" />
                  <label htmlFor={`fit-${opt}`} className="cursor-pointer text-left">
                    <span className="block text-sm text-foreground">{t(`form.fitness.options.${opt}.title`)}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{t(`form.fitness.options.${opt}.subtitle`)}</span>
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>


          <div className="space-y-2">
            <Label>{t("form.triedBefore.label")}</Label>
            <p className="text-xs text-muted-foreground">{t("form.triedBefore.hint")}</p>
            <Textarea
              className="min-h-[100px] border-border bg-[#111] text-foreground"
              placeholder={t("form.triedBefore.placeholder")}
              value={triedBefore}
              onChange={(ev) => setTriedBefore(ev.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="h-px bg-border" aria-hidden />

          <div className="space-y-2">
            <Label>{t("form.minutes.label")}</Label>
            <Select value={minutes} onValueChange={setMinutes} disabled={submitting}>
              <SelectTrigger className="h-11 border-border bg-[#111] text-foreground">
                <SelectValue placeholder={t("form.minutes.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {minutesOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {t(`form.minutes.options.${opt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("form.anythingElse.label")}</Label>
            <p className="text-xs text-muted-foreground">{t("form.anythingElse.hint")}</p>
            <Textarea
              className="min-h-[100px] border-border bg-[#111] text-foreground"
              placeholder={t("form.anythingElse.placeholder")}
              value={anythingElse}
              onChange={(ev) => setAnythingElse(ev.target.value)}
              disabled={submitting}
            />
          </div>

            </div>
          </details>

          <div className="pt-2" id="apply">
            <Button
              type="submit"
              className="h-12 w-full bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 md:h-14"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                <>
                  {t("form.submit")}
                  <ArrowRight className="icon-directional ms-1 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
              {t("form.footerNote")}{" "}
              <span className="text-muted-foreground/95">
                {t("form.footerSpamNote")}{" "}
                <strong className="font-semibold text-foreground/90">{t("form.spam")}</strong> or{" "}
                <strong className="font-semibold text-foreground/90">{t("form.promotions")}</strong>.
              </span>
            </p>
          </div>
        </form>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-border pt-8 text-sm text-muted-foreground">
          {content.trust.map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
