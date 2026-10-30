import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { localePath } from "@/i18n/localePaths";
import type { AppLanguage } from "@/i18n/constants";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireProgramAccess?: boolean;
};

export function ProtectedRoute({ children, requireAdmin, requireProgramAccess }: ProtectedRouteProps) {
  const { user, loading, configured, isAdmin, hasProgramAccess } = useAuth();
  const location = useLocation();
  const { i18n } = useTranslation();
  const locale = (i18n.language?.split("-")[0] ?? "en") as AppLanguage;

  if (!configured) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-center text-muted-foreground max-w-md">
          Add <code className="text-primary">VITE_SUPABASE_URL</code> and{" "}
          <code className="text-primary">VITE_SUPABASE_ANON_KEY</code> to your environment to enable accounts and the member training app.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Guest checkout: Stripe sent a buyer without an account here — finish on /welcome (auto-login).
    const params = new URLSearchParams(location.search);
    const sid = params.get("session_id");
    if (params.get("checkout") === "success" && sid) {
      return <Navigate to={`/welcome?session_id=${encodeURIComponent(sid)}`} replace />;
    }
    const fullPath = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(fullPath)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireProgramAccess && !hasProgramAccess) {
    return <Navigate to={localePath("/pricing", locale)} replace />;
  }

  return <>{children}</>;
}
