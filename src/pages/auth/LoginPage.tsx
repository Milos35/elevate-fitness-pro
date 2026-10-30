import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/seo/PageMeta";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useAppLocale } from "@/hooks/useAppLocale";
import { safeInternalPath } from "@/lib/safeRedirect";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [magicBusy, setMagicBusy] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const { signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { to } = useAppLocale();
  const from = safeInternalPath(searchParams.get("redirect"), (location.state as { from?: string } | null)?.from, "/dashboard");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast({ title: t("login.toastFailed"), description: error.message, variant: "destructive" });
      return;
    }
    navigate(from, { replace: true });
  }

  async function sendMagicLink() {
    if (!email) {
      document.getElementById("email")?.focus();
      return;
    }
    setMagicBusy(true);
    const site = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "") || window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: `${site}/auth/callback` },
    });
    setMagicBusy(false);
    if (error) {
      toast({ title: t("login.toastFailed"), description: error.message, variant: "destructive" });
      return;
    }
    setMagicSent(true);
    toast({ title: t("login.magicSent"), description: t("login.magicSentDescription") });
  }

  const magicFirst = searchParams.get("magic") === "1";

  return (
    <>
      <PageMeta title={t("login.meta.title")} description={t("login.meta.description")} path="/login" />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background relative">
        <div className="absolute top-4 end-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-md glass-card p-8 border-border/60">
          <h1 className="text-2xl font-black mb-1">{t("login.title")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("login.subhead")}</p>
          {!configured && (
            <p className="text-xs text-amber-500 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              {t("login.supabaseMissing")}
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={`rounded-lg border p-3 ${magicFirst ? "border-primary/50 bg-primary/5" : "border-border/60"}`}>
              <p className="mb-2 text-xs text-muted-foreground">{magicSent ? t("login.magicSentDescription") : t("login.magicTitle")}</p>
              <Button
                type="button"
                variant="outline"
                className="w-full font-semibold"
                disabled={magicBusy || !configured}
                onClick={() => void sendMagicLink()}
              >
                {magicBusy ? t("login.magicSending") : magicSent ? t("login.magicSent") : t("login.magicSubmit")}
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground">{t("login.magicOr")}</p>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold" disabled={busy || !configured}>
              {busy ? t("login.submitting") : t("login.submit")}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            {t("login.noAccount")}{" "}
            <Link to={`/signup?redirect=${encodeURIComponent(from)}`} className="text-primary font-semibold hover:underline">
              {t("login.createOne")}
            </Link>
          </p>
          <p className="text-center mt-4">
            <Link to={to("/")} className="text-xs text-muted-foreground hover:text-foreground">
              {t("login.backToWebsite")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
