import { Link, Outlet, useLocation } from "react-router-dom";
import { NoIndex } from "@/components/seo/NoIndex";
import { LayoutDashboard, Users, FileText, Bell, Dumbbell, ArrowLeft, BookOpen, Home, Layers, Smartphone, Video, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MEMBER_APP_LINK_LABEL } from "@/lib/memberAppLabels";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/homepage", label: "Homepage", icon: Home },
  { to: "/admin/pages", label: "Site pages", icon: Layers },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/member", label: "Member app", icon: Smartphone },
  { to: "/admin/testimonials", label: "Testimonials", icon: Video },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/leads", label: "Handbook leads", icon: BookOpen },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/reminders", label: "Reminders", icon: Bell },
  { to: "/admin/workouts", label: "Workouts", icon: Dumbbell },
];

function AdminNavLink({
  item,
  isActive,
  compact,
}: {
  item: (typeof nav)[number];
  isActive: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      to={item.to}
      className={cn(
        "flex items-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap",
        compact ? "shrink-0 px-3 py-2" : "px-3 py-2",
        isActive ? "bg-amber-500/15 text-amber-400" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <NoIndex />
      <div className="lg:hidden border-b border-border bg-card/50">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Coach Admin</p>
            <p className="text-sm text-muted-foreground">Edit site content under Homepage</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-thin">
          {nav.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return <AdminNavLink key={item.to} item={item} isActive={isActive} compact />;
          })}
        </nav>
      </div>

      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card/50">
        <div className="p-5 border-b border-border/60">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Coach</p>
          <p className="font-black text-lg">Admin</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {nav.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
            return <AdminNavLink key={item.to} item={item} isActive={isActive} />;
          })}
        </nav>
        <div className="p-2 border-t border-border/60">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              {MEMBER_APP_LINK_LABEL}
            </Link>
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
