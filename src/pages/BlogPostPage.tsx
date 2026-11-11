import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { BlogPostingSchema } from "@/components/seo/BlogPostingSchema";
import { PageMeta } from "@/components/seo/PageMeta";
import type { BlogBlock } from "@/data/blog";
import { formatBlogDate } from "@/lib/formatBlogDate";
import { usePricing } from "@/hooks/usePricing";
import { useAppLocale } from "@/hooks/useAppLocale";
import { usePublishedBlogPost } from "@/hooks/usePublishedBlogPosts";
import NotFound from "@/pages/NotFound";

function resolveBlogBlocks(blocks: BlogBlock[], priceLabel: string): BlogBlock[] {
  return blocks.map((block) => {
    if (block.type !== "cta") return block;
    const primaryLabel = block.primaryLabel?.includes("{{price}}")
      ? block.primaryLabel.replace("{{price}}", priceLabel)
      : block.primaryLabel;
    const secondaryLabel = block.secondaryLabel?.includes("{{price}}")
      ? block.secondaryLabel.replace("{{price}}", priceLabel)
      : block.secondaryLabel;
    if (primaryLabel === block.primaryLabel && secondaryLabel === block.secondaryLabel) return block;
    return { ...block, primaryLabel, secondaryLabel };
  });
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation("blog");
  const { t: tCommon } = useTranslation("common");
  const pricing = usePricing();
  const { to, locale } = useAppLocale();
  const { post, posts, isLoading } = usePublishedBlogPost(slug);
  const articleBlocks = useMemo(
    () => (post ? resolveBlogBlocks(post.blocks, pricing.selfGuided.label) : []),
    [post, pricing.selfGuided.label],
  );

  if (isLoading && !post) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading article…
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  const path = `/blog/${post.slug}`;
  const otherPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const title = post.title;
  const metaTitle = post.metaTitle || post.title;
  const metaDescription = post.metaDescription || post.excerpt;

  return (
    <div className="font-sans">
      <PageMeta title={metaTitle} description={metaDescription} path={path} ogType="article" keywords={post.keywords} locale={locale} />
      <BlogPostingSchema
        title={title}
        description={metaDescription}
        slug={post.slug}
        publishedAt={post.publishedAt}
        keywords={post.keywords}
        locale={locale}
        coverImage={post.coverImage}
        blocks={post.blocksByLocale?.[locale] ?? post.blocks}
      />

      <section className="pt-8 pb-8 md:pt-12">
        <div className="container mx-auto max-w-3xl px-6">
          <Link
            to={to("/blog")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="icon-directional h-4 w-4" aria-hidden />
            {t("post.allArticles")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, i18n.language)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {t("post.minRead", { minutes: post.readingTimeMinutes })}
            </span>
          </div>
          <h1 className="font-display mt-4 text-balance text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] text-foreground">
            {title}
          </h1>
          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt ?? title}
                className="aspect-[16/9] w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          )}
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="container mx-auto max-w-3xl">
          <BlogArticleBody blocks={articleBlocks} />
        </div>
      </section>

      {otherPosts.length > 0 && (
        <section className="border-t border-border px-6 py-12 md:py-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-xl text-foreground">{t("post.moreArticles")}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {otherPosts.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={to(`/blog/${other.slug}`)}
                    className="group flex items-start justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/40"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">
                      {other.title}
                    </span>
                    <ArrowRight className="icon-directional h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-card/30 px-6 py-12 md:py-16">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl text-foreground">{t("post.ctaTitle")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("post.ctaSubhead")}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-12 rounded-lg bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link to={to("/pricing")}>
                {t("post.getProgram", { price: pricing.selfGuided.label })}{" "}
                <ArrowRight className="icon-directional ms-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-lg border-border px-8 text-base font-semibold">
              <Link to={to("/coaching-apply?plan=coached-strong-90#apply")}>{tCommon("cta.startCoaching")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
