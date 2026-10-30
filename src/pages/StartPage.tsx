import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell, PhoneCall, Pill, Salad, TrendingDown } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { Button } from "@/components/ui/button";
import { CALENDLY_FREE_CALL_URL } from "@/lib/pricing";
import { trackLead } from "@/lib/metaPixel";
import { useAppLocale } from "@/hooks/useAppLocale";
import { GoogleReviews } from "@/components/GoogleReviews";

/** The same free guides ManyChat sends for the comment keywords RESET / EAT / FUEL. */
const FREE_GUIDES = [
  {
    key: "RESET",
    title: "Free 5-day training reset",
    text: "Short home workouts to restart. Opens in the Trainerize app.",
    href: "https://www.trainerize.me/profile/milosilicpt/?planGUID=725e05995a1b406e8ff9b7399e4c035d",
    icon: Dumbbell,
  },
  {
    key: "EAT",
    title: "Free nutrition guide",
    text: "High-protein meals with normal family food. No food scale.",
    href: "https://drive.google.com/file/d/1a3CUWgJ-aJzbhJyCGc0Z2B4j5fggRikz/view?usp=drivesdk",
    icon: Salad,
  },
  {
    key: "FUEL",
    title: "Free supplement guide",
    text: "What is worth buying and what is not, explained simply.",
    href: "https://drive.google.com/file/d/12BKJNMlIvi9X1REs5kwrs9XDHo0_37qr/view?usp=drivesdk",
    icon: Pill,
  },
] as const;

/**
 * Link-in-bio landing page for Instagram / TikTok / Threads (busystrong90.com/start?utm_source=instagram).
 * One screen: who Milos is, one real result, the free guides, and the two ways to work together.
 */
export default function StartPage() {
  const { to } = useAppLocale();

  return (
    <div className="bg-[#070707] font-sans text-white">
      <PageMeta
        title="Start here — Coach Milos | Busy Strong 90"
        description="Free training, nutrition and supplement guides from Coach Milos, plus online coaching for busy parents worldwide."
        path="/start"
      />
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-14 pt-24">
        <div className="flex items-center gap-4">
          <img
            src="/hero-lcp-1280.webp"
            alt="Coach Milos"
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-full border-2 border-primary object-cover object-[30%_20%]"
          />
          <div>
            <h1 className="font-display text-3xl leading-none">Coach Milos</h1>
            <p className="mt-1 text-sm text-white/70">3rd at Mr. Universe · Dad of 2 · 15 years of coaching</p>
          </div>
        </div>

        <p className="mt-6 text-pretty text-lg leading-snug text-white/90">
          Online coaching for busy parents, anywhere in the world. Bodybuilding made simple: food, supplements and
          strength training that fit a real week.
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3">
          <TrendingDown className="h-6 w-6 shrink-0 text-primary" aria-hidden />
          <p className="text-sm">
            <span className="font-bold text-primary">Real client result:</span> 110 kg → 78 kg in one year, at almost 50.
          </p>
        </div>

        <h2 className="mt-9 text-xs font-bold uppercase tracking-[0.2em] text-primary">Free guides</h2>
        <div className="mt-3 flex flex-col gap-3">
          {FREE_GUIDES.map((g) => (
            <a
              key={g.key}
              href={g.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackLead(`Free guide ${g.key}`)}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-primary/60"
            >
              <g.icon className="h-7 w-7 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{g.title}</span>
                <span className="block text-xs text-white/60">{g.text}</span>
              </span>
              <ArrowRight className="icon-directional h-4 w-4 shrink-0 text-white/50" aria-hidden />
            </a>
          ))}
        </div>

        <GoogleReviews className="mt-9" limit={2} />

        <h2 className="mt-9 text-xs font-bold uppercase tracking-[0.2em] text-primary">Work with me</h2>
        <div className="mt-3 flex flex-col gap-3">
          <Button asChild className="h-14 rounded-2xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90">
            <Link to={to("/pricing")}>
              See plans &amp; prices
              <ArrowRight className="icon-directional ms-1 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild className="h-14 rounded-2xl bg-white text-base font-bold text-[#0a0a0a] hover:bg-white/90">
            <a href={CALENDLY_FREE_CALL_URL} target="_blank" rel="noopener noreferrer">
              <PhoneCall className="me-2 h-4 w-4" aria-hidden />
              Book a free 15-min call
            </a>
          </Button>
          <Link
            to={to("/app")}
            className="text-center text-sm text-white/70 underline decoration-white/30 underline-offset-4 hover:text-primary"
          >
            See how the app works
          </Link>
        </div>

        <div className="mt-auto pt-10 text-center text-xs text-white/50">
          <Link to={to("/blog")} className="hover:text-primary">
            Read the blog
          </Link>
          {" · "}
          <Link to={to("/")} className="hover:text-primary">
            busystrong90.com
          </Link>
        </div>
      </div>
    </div>
  );
}
