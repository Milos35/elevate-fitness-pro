import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/components/seo/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { trackPurchase } from "@/lib/metaPixel";

type ClaimResponse = {
  ok?: boolean;
  error?: string;
  email?: string | null;
  loginUrl?: string | null;
  value?: number;
  currency?: string;
};

type State =
  | { kind: "working" }
  | { kind: "email"; email: string | null }
  | { kind: "error"; message: string };

/**
 * Thank-you page after Stripe (Payment Link "after payment" redirect:
 * https://busystrong90.com/welcome?session_id={CHECKOUT_SESSION_ID}).
 * Confirms the payment, unlocks the program and logs the buyer straight into the app — no signup form.
 */
export default function WelcomePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const { user, refreshProfile } = useAuth();
  const [state, setState] = useState<State>({ kind: "working" });
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!sessionId.startsWith("cs_")) {
      setState({ kind: "error", message: "We could not find your payment. Check your email for your login link." });
      return;
    }

    void (async () => {
      try {
        const r = await fetch("/api/stripe/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = (await r.json().catch(() => ({}))) as ClaimResponse;
        if (!r.ok || !data.ok) {
          setState({ kind: "error", message: data.error ?? "We could not confirm the payment yet." });
          return;
        }

        if (typeof data.value === "number" && data.currency) {
          trackPurchase(data.value, data.currency, sessionId);
        }

        // Already logged in with the same email: just open the app.
        if (user?.email && data.email && user.email.toLowerCase() === data.email.toLowerCase()) {
          await refreshProfile();
          window.location.replace("/dashboard");
          return;
        }

        if (data.loginUrl) {
          window.location.replace(data.loginUrl);
          return;
        }

        setState({ kind: "email", email: data.email ?? null });
      } catch {
        setState({ kind: "error", message: "Connection problem. Your payment is safe; check your email for your login link." });
      }
    })();
  }, [sessionId, user?.email, refreshProfile]);

  return (
    <>
      <PageMeta title="Welcome to Busy Strong 90" description="Your program is ready." path="/welcome" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-16">
        <div className="glass-card w-full max-w-md border-border/60 p-8 text-center">
          {state.kind === "working" && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" aria-hidden />
              <h1 className="mt-5 text-2xl font-black">Payment received</h1>
              <p className="mt-2 text-sm text-muted-foreground">Unlocking your program and opening your app…</p>
            </>
          )}

          {state.kind === "email" && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden />
              <h1 className="mt-5 text-2xl font-black">You're in.</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Your program is unlocked. We sent your login link to{" "}
                <strong className="text-foreground">{state.email ?? "your email"}</strong>. Open it on this phone and the app
                opens with Week 1 ready.
              </p>
              <Button asChild className="mt-6 w-full bg-primary font-bold text-primary-foreground">
                <Link to="/login?magic=1">
                  <Mail className="me-2 h-4 w-4" aria-hidden />
                  Send me a new login link
                </Link>
              </Button>
            </>
          )}

          {state.kind === "error" && (
            <>
              <Mail className="mx-auto h-12 w-12 text-primary" aria-hidden />
              <h1 className="mt-5 text-2xl font-black">Almost there</h1>
              <p className="mt-3 text-sm text-muted-foreground">{state.message}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Log in with the email you used at checkout and tap "Email me a login link". Questions:{" "}
                <a className="text-primary hover:underline" href="mailto:info@ptmilosilic.com">
                  info@ptmilosilic.com
                </a>
              </p>
              <Button asChild className="mt-6 w-full bg-primary font-bold text-primary-foreground">
                <Link to="/login?magic=1">Log in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
