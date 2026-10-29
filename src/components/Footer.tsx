import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dumbbell, Instagram, Link2, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { programPublicPath } from "@/lib/programNav";
import { useAppLocale } from "@/hooks/useAppLocale";

const INSTAGRAM_URL = "https://www.instagram.com/_coachmilos/";
const LINKTREE_URL =
  "https://linktr.ee/_coachmilos?utm_source=linktree_profile_share&ltsid=fe5925df-65e8-4bb1-a976-f26dd53ef32d";

const Footer = () => {
  const { t } = useTranslation();
  const { to } = useAppLocale();
  const { configured, hasProgramAccess, loading, user } = useAuth();
  const navOpts = { configured, hasProgramAccess, loading, user };
  const nutritionTo = to(programPublicPath("/nutrition", navOpts));

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to={to("/")} className="flex items-center gap-2 font-display text-xl font-bold tracking-tight mb-4">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span>
                BUSY<span className="text-primary">STRONG</span>90
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">{t("footer.tagline")}</p>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-4 text-primary">{t("footer.program")}</h4>
            <div className="flex flex-col gap-2">
              <Link to={to("/program")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.programOverview")}</Link>
              <Link to={to("/app")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.app")}</Link>
              <Link to={nutritionTo} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.nutritionGuide")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-4 text-primary">{t("footer.support")}</h4>
            <div className="flex flex-col gap-2">
              <Link to={to("/coaching-apply")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.coaching")}</Link>
              <Link to={to("/faq")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.faq")}</Link>
              <Link to={to("/pricing")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.pricing")}</Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("nav.memberLogin")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-semibold text-sm uppercase tracking-wider mb-4 text-primary">{t("footer.connect")}</h4>
            <div className="flex flex-col gap-2">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-4 w-4 shrink-0" /> @_coachmilos
              </a>
              <a href={LINKTREE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Link2 className="h-4 w-4 shrink-0" /> {t("footer.linktree")}
              </a>
              <a href="mailto:info@ptmilosilic.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" /> info@ptmilosilic.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="text-xs text-muted-foreground">{t("footer.motto")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
