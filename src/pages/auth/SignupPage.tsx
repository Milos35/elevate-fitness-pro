import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/seo/PageMeta";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { safeInternalPath } from "@/lib/safeRedirect";

export default function SignupPage() {
  const { t } = useTranslation("auth");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { signUp, configured } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const redirectAfterLogin = safeInternalPath(searchParams.get("redirect"), undefined, "/dashboard");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await signUp(email, password, fullName);
    setBusy(false);
    if (error) {
      toast({ title: t("signup.toastFailed"), description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    toast({ title: t("signup.toastCheckEmail"), description: t("signup.toastCheckEmailDesc") });
  }

  return (
    <>
      <PageMeta title={t("signup.meta.title")} description={t("signup.meta.description")} path="/signup" noindex />
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background relative">
        <div className="absolute top-4 end-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-md glass-card p-8 border-border/60">
          <h1 className="text-2xl font-black mb-1">{t("signup.title")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("signup.subhead")}</p>
          {!configured && (
            <p className="text-xs text-amber-500 mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              {t("signup.supabaseWarning")}
            </p>
          )}
          {done ? (
            <p className="text-sm text-muted-foreground">
              {t("signup.doneMessage")}{" "}
              <Link to={`/login?redirect=${encodeURIComponent(redirectAfterLogin)}`} className="text-primary font-semibold hover:underline">
                {t("signup.signInLink")}
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("signup.fullName")}</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("signup.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("signup.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold" disabled={busy || !configured}>
                {busy ? t("signup.creating") : t("signup.createAccount")}
              </Button>
            </form>
          )}
          <p className="text-sm text-muted-foreground mt-6 text-center">
            {t("signup.hasAccount")}{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirectAfterLogin)}`} className="text-primary font-semibold hover:underline">
              {t("signup.logIn")}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
