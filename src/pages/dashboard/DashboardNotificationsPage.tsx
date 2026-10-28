import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MemberGate } from "@/components/MemberGate";
import { DailyMotivationCard } from "@/components/dashboard/DailyMotivationCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database";

type Prefs = Database["public"]["Tables"]["notification_preferences"]["Row"];

export default function DashboardNotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation("dashboard");
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle();
    if (error) {
      toast({ title: t("notifications.toastLoadFailed"), description: error.message, variant: "destructive" });
    } else {
      setPrefs(data);
    }
    setLoading(false);
  }, [user, toast, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(partial: Partial<Prefs>) {
    if (!user || !prefs) return;
    const next = { ...prefs, ...partial };
    setPrefs(next);
    const { error } = await supabase.from("notification_preferences").upsert({
      user_id: user.id,
      email_reminders: next.email_reminders,
      push_enabled: next.push_enabled,
      preferred_reminder_time: next.preferred_reminder_time,
      timezone: next.timezone,
    });
    if (error) {
      toast({ title: t("home.toastUpdateFailed"), description: error.message, variant: "destructive" });
      load();
    }
  }

  return (
    <MemberGate>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black">{t("notifications.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("notifications.subhead")}</p>
        </div>

        <DailyMotivationCard />

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">{t("notifications.preferences")}</CardTitle>
            <CardDescription>{t("notifications.preferencesSub")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading || !prefs ? (
              <p className="text-sm text-muted-foreground">{t("notifications.loading")}</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="text-base">{t("notifications.emailReminders")}</Label>
                    <p className="text-xs text-muted-foreground">{t("notifications.emailRemindersSub")}</p>
                  </div>
                  <Switch checked={prefs.email_reminders} onCheckedChange={(v) => patch({ email_reminders: v })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tz">{t("notifications.timezone")}</Label>
                  <Input
                    id="tz"
                    placeholder={t("notifications.timezonePlaceholder")}
                    defaultValue={prefs.timezone ?? ""}
                    onBlur={(e) => patch({ timezone: e.target.value || null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">{t("notifications.reminderTime")}</Label>
                  <Input
                    id="time"
                    type="time"
                    defaultValue={prefs.preferred_reminder_time?.slice(0, 5) ?? ""}
                    onBlur={(e) => patch({ preferred_reminder_time: e.target.value ? `${e.target.value}:00` : null })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MemberGate>
  );
}
