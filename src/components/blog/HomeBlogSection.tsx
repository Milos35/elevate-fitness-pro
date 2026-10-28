import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock } from "lucide-react";
import { formatBlogDate } from "@/lib/formatBlogDate";
import { useAppLocale } from "@/hooks/useAppLocale";
import { usePublishedBlogPosts } from "@/hooks/usePublishedBlogPosts";

export function HomeBlogSection() {
  const { t, i18n } = useTranslation("blog");
  const { to } = useAppLocale();
  const { posts } = usePublishedBlogPosts();
  // Always the 3 newest posts; older ones stay on the /blog page
  const featured = [...posts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="theme-light section-padding bg-background">
      <div className="container mx-auto max-w-[1100px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[hsl(171_55%_32%)]">{t("home.eyebrow")}</p>
        <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
          {t("home.headline")} <span className="text-[hsl(171_55%_36%)]">{t("home.headlineHighlight")}</span>
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">{t("home.subhead")}</p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {featured.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/60"
            >
              {post.coverImage && (
                <Link to={to(`/blog/${post.slug}`)} className="block aspect-[16/10] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt ?? post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, i18n.language)}</time>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {t("index.minRead", { minutes: post.readingTimeMinutes })}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-xl leading-snug text-foreground">
                  <Link to={to(`/blog/${post.slug}`)} className="transition-colors hover:text-[hsl(171_55%_32%)]">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <Link
                  to={to(`/blog/${post.slug}`)}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(171_55%_32%)] hover:text-[hsl(171_55%_26%)]"
                >
                  {t("index.readArticle")}
                  <ArrowRight className="icon-directional h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to={to("/blog")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(171_55%_32%)] hover:text-[hsl(171_55%_26%)]"
          >
            {t("home.viewAll")}
            <ArrowRight className="icon-directional h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
