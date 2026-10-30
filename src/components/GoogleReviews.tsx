import { Star } from "lucide-react";
import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_URL } from "@/data/googleReviews";

type Props = { className?: string; limit?: number; dark?: boolean };

/** Real Google reviews. Renders nothing until reviews are added in src/data/googleReviews.ts. */
export function GoogleReviews({ className = "", limit = 4, dark = true }: Props) {
  const reviews = GOOGLE_REVIEWS.slice(0, limit);
  if (reviews.length === 0) {
    // No reviews copied in yet: still point people to the real ones on Google.
    if (!GOOGLE_REVIEWS_URL) return null;
    return (
      <p className={`${className} text-center text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
          Read client reviews on Google
        </a>
      </p>
    );
  }

  const avg = GOOGLE_REVIEWS.reduce((s, r) => s + r.rating, 0) / GOOGLE_REVIEWS.length;

  return (
    <section className={className} aria-labelledby="google-reviews-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Google reviews</p>
          <h2 id="google-reviews-title" className={`mt-1 text-2xl font-black ${dark ? "text-white" : "text-foreground"}`}>
            What clients say
          </h2>
        </div>
        <p className={`flex items-center gap-1.5 text-sm ${dark ? "text-white/70" : "text-muted-foreground"}`}>
          <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
          <strong className={dark ? "text-white" : "text-foreground"}>{avg.toFixed(1)}</strong> on Google
          {GOOGLE_REVIEWS_URL && (
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="ms-1 text-primary hover:underline">
              · See all
            </a>
          )}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reviews.map((r) => (
          <figure
            key={r.name + r.text.slice(0, 20)}
            className={`rounded-2xl border p-5 text-start ${dark ? "border-white/10 bg-white/[0.04]" : "border-border bg-card/50"}`}
          >
            <div className="mb-2 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden />
              ))}
            </div>
            <blockquote className={`text-sm leading-relaxed ${dark ? "text-white/80" : "text-muted-foreground"}`}>
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <figcaption className={`mt-3 text-sm font-bold ${dark ? "text-white" : "text-foreground"}`}>
              {r.name}
              {r.when && <span className="ms-2 text-xs font-normal opacity-60">{r.when}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
