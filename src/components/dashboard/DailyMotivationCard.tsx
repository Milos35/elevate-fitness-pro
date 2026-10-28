import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellRing, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  disableDailyMotivation,
  enableDailyMotivation,
  getCurrentPushSubscription,
  getPushSupport,
} from "@/lib/pushNotifications";

/** Lets a member turn the daily motivation push on/off for this device (Android Chrome, iPhone Home Screen app). */
export function DailyMotivationCard() {
  const { t, i18n } = useTranslation("dashboard");
  const { user } = useAuth();
  const { toast } = useToast();
  const support = getPushSupport();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getCurrentPushSubscription()
      .then((sub) => setSubscribed(Boolean(sub)))
      .catch(() => setSubscribed(false));
  }, []);

  async function toggle() {
    if (!user) return;
    setBusy(true);
    try {
      if (subscribed) {
        await disableDailyMotivation(user.id);
        setSubscribed(false);
        toast({ title: t("dailyMotivation.toastDisabled") });
      } else {
        await enableDailyMotivation(user.id, i18n.language);
        setSubscribed(true);
        toast({ title: t("dailyMotivation.toastEnabled"), description: t("dailyMotivation.toastEnabledSub") });
      }
    } catch (err) {
      toast({
        title: t("dailyMotivation.toastFailed"),
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BellRing className="h-5 w-5 text-primary" aria-hidden />
          {t("dailyMotivation.title")}
        </CardTitle>
        <CardDescription>{t("dailyMotivation.sub")}</CardDescription>
      </CardHeader>
      <CardContent>
        {support === "supported" && (
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => void toggle()} disabled={busy} variant={subscribed ? "outline" : "default"}>
              {busy ? t("dailyMotivation.working") : subscribed ? t("dailyMotivation.disable") : t("dailyMotivation.enable")}
            </Button>
            {subscribed && <span className="text-sm font-medium text-primary">{t("dailyMotivation.enabled")}</span>}
          </div>
        )}
        {support === "ios-needs-install" && (
          <div className="rounded-2xl border border-border p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Share className="h-4 w-4 text-primary" aria-hidden />
              {t("dailyMotivation.iosTitle")}
            </p>
            <ol className="mt-3 list-decimal space-y-1 ps-5 text-sm text-muted-foreground">
              {(t("dailyMotivation.iosSteps", { returnObjects: true }) as string[]).map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        {support === "unsupported" && <p className="text-sm text-muted-foreground">{t("dailyMotivation.unsupported")}</p>}
      </CardContent>
    </Card>
  );
}
