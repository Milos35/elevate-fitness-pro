import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, CheckCircle2, Dumbbell, Pill, Utensils, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { HANDBOOK_IDS, type HandbookId } from "@/lib/handbooks";
import { HANDBOOK_IMAGES } from "@/lib/handbookImages";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import { resolveHandbooksCms } from "@/lib/siteCms";
import { homepageStorageUrl } from "@/lib/homepageMedia";
import { trackLead } from "@/lib/metaPixel";
import { cn } from "@/lib/utils";

const ICONS: Record<HandbookId, typeof Utensils> = {
  "eat-nutrition": Utensils,
  "fuel-supplements": Pill,
  "muscle-handbook": Dumbbell,
  "busy-strong-7day": Zap,
};

export function HandbooksLeadSection() {
  const { t } = useTranslation("handbooks");
  const { data: handbooksCms } = usePublishedSiteCms("handbooks");
  const content = resolveHandbooksCms(handbooksCms ?? null, t);
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<HandbookId>>(new Set());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sentCount === null) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sentCount]);

  function toggle(id: HandbookId, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: t("toast.nameRequired"), variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({ title: t("toast.invalidEmail"), variant: "destructive" });
      return;
    }
    if (selected.size === 0) {
      toast({ title: t("toast.selectOne"), variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const r = await fetch("/api/handbook-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          handbooks: [...selected],
        }),
      });
      const ct = r.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        const text = await r.text().catch(() => "");
        throw new Error(text.slice(0, 200) || t("toast.errorFallback"));
      }
      const data = (await r.json()) as { ok?: boolean; error?: string; count?: number };
      if (!r.ok || !data.ok) {
        throw new Error(data.error || t("toast.errorFallback"));
      }
      trackLead("Free Handbooks", { num_items: data.count ?? selected.size });
      setSentCount(data.count ?? selected.size);
    } catch (err) {
      toast({
        title: t("toast.errorTitle"),
        description: err instanceof Error ? err.message : t("toast.errorFallback"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="free-handbooks"
      className="theme-light section-padding scroll-mt-24 bg-background"
    >
      {sentCount !== null ? (
        <div className="container mx-auto max-w-[640px] px-6 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h2 className="font-display mt-6 text-3xl text-foreground md:text-4xl">{t("success.title")}</h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            {sentCount === 1 ? t("success.body") : t("success.bodyPlural")}
          </p>
          <p className="mt-8 text-sm font-semibold text-foreground">{t("success.cta")}</p>
          <Button asChild className="mt-4 h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
            <Link to="/pricing">
              {t("success.ctaButton")}
              <ArrowRight className="icon-directional ms-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="container mx-auto max-w-[1100px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{content.eyebrow}</p>
        <h2 className="font-display mt-2 text-balance text-center text-[clamp(1.75rem,4vw,2.75rem)] text-foreground">
          {content.title}
        </h2>
        <p className="mx-auto mt-3 max-w-[640px] text-center text-pretty text-muted-foreground">{content.subhead}</p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {HANDBOOK_IDS.map((id) => {
            const Icon = ICONS[id];
            const checked = selected.has(id);
            const cardId = `handbook-${id}`;
            const item = content.items[id];
            const cover = homepageStorageUrl(item?.imagePath) ?? HANDBOOK_IMAGES[id];
            return (
              <label
                key={id}
                htmlFor={cardId}
                className={cn(
                  "group flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all",
                  checked
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={cover}
                    alt={item?.imageAlt ?? t(`items.${id}.imageAlt`)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <Checkbox
                    id={cardId}
                    checked={checked}
                    className={cn(
                      "absolute start-3 top-3 z-10 h-5 w-5 border-white/70 bg-black/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
                    )}
                    onCheckedChange={(v) => toggle(id, v === true)}
                  />
                  {checked ? (
                    <span className="absolute end-3 top-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      {t("selected")}
                    </span>
                  ) : null}
                </div>
                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-[hsl(171_55%_32%)]" aria-hidden />
                    <span className="font-display text-lg text-foreground">{item?.title ?? t(`items.${id}.title`)}</span>
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {item?.description ?? t(`items.${id}.description`)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground/70">{t("photoCredit")}</p>

        <form
          onSubmit={(e) => void onSubmit(e)}
          className="mx-auto mt-10 max-w-lg rounded-xl border border-border bg-card p-6 md:p-8"
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-[hsl(171_55%_32%)]" aria-hidden />
            {selected.size === 0 ? t("form.selectHint") : null}
            {selected.size === 1 ? t("form.submit") : selected.size > 1 ? t("form.submitPlural") : null}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handbook-name">{t("form.name")}</Label>
              <Input
                id="handbook-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.namePlaceholder")}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handbook-email">{t("form.email")}</Label>
              <Input
                id="handbook-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.emailPlaceholder")}
                autoComplete="email"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting || selected.size === 0}
              className="h-12 w-full rounded-lg bg-primary text-base font-bold text-primary-foreground"
            >
              {submitting ? t("form.submitting") : selected.size > 1 ? t("form.submitPlural") : t("form.submit")}
            </Button>
          </div>
        </form>
        </div>
      )}
    </section>
  );
}
