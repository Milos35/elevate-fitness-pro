import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StripeCheckoutSuccess } from "@/components/StripeCheckoutSuccess";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Map,
  LineChart,
  BellRing,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navKeys = [
  { to: "/dashboard", key: "overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/training", key: "training", icon: Dumbbell },
  { to: "/dashboard/nutrition", key: "nutrition", icon: Utensils },
  { to: "/dashboard/roadmap", key: "roadmap", icon: Map },
  { to: "/dashboard/progress", key: "progress", icon: LineChart },
  { to: "/dashboard/reminders", key: "reminders", icon: BellRing },
  { to: "/dashboard/profile", key: "profile", icon: User },
] as const;

export default function DashboardLayout() {
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();
  const { t } = useTranslation("dashboard");

  const isNavActive = (item: (typeof navKeys)[number]) =>
    "end" in item && item.end
      ? location.pathname === item.to
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

  return (
    // Dark page with teal glows; sidebar, header and cards are light see-through frosted glass (see .dashboard-app in index.css)
    <div className="dashboard-app relative flex min-h-screen bg-[#070707]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 start-[20%] h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-[-10rem] end-[5%] h-[30rem] w-[30rem] rounded-full bg-[hsl(190_70%_55%/0.2)] blur-3xl" />
      </div>

      <aside className="dashboard-surface sticky top-4 z-10 m-4 me-0 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-[1.75rem] md:flex">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-start justify-between gap-2">
            <Link to="/dashboard" className="inline-flex min-w-0 items-center gap-2 text-lg font-black tracking-tight">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/15">
                <Dumbbell className="h-5 w-5 text-primary" />
              </span>
              <span>
                BUSY<span className="text-gradient">STRONG</span>90
              </span>
            </Link>
            <LanguageSwitcher size="icon" />
          </div>
          <p className="mt-2 truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navKeys.map((item) => {
            const isActive = isNavActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary font-semibold text-[#07070a] shadow-[0_8px_24px_hsl(171_47%_50%/0.3)]"
                    : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                location.pathname.startsWith("/admin")
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4 shrink-0" />
              {t("nav.coachAdmin")}
            </Link>
          )}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            to="/"
            className="block rounded-full px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            {t("nav.publicSite")}
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
            {t("nav.signOut")}
          </Button>
        </div>
      </aside>

      {/* iOS home-screen app draws under the status bar (black-translucent); keep that strip solid so content scrolls behind it */}
      <div className="fixed inset-x-0 top-0 z-30 h-[env(safe-area-inset-top)] bg-[#070707] md:hidden" aria-hidden />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="dashboard-surface sticky top-[max(0.75rem,env(safe-area-inset-top))] z-20 mx-3 mt-[max(0.75rem,env(safe-area-inset-top))] rounded-[1.75rem] md:hidden">
          <div className="flex h-14 items-center justify-between ps-5 pe-2">
            <Link to="/dashboard" className="text-sm font-black tracking-tight">
              BUSY<span className="text-primary">STRONG</span>90
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher size="icon" />
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {t("nav.signOut")}
              </Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none]">
            {navKeys.map((item) => {
              const isActive = isNavActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive ? "bg-primary font-semibold text-[#07070a]" : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  {t(`nav.${item.key}`)}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 lg:p-10">
          <StripeCheckoutSuccess />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
