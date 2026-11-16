/**
 * Build-time entry (bundled with `vite build --ssr`, run by scripts/prerender.mjs).
 * Lists every public page in every language it exists in, with the same head tags <PageMeta> sets in the browser.
 * Runs in Node: no browser APIs, no Supabase calls. Blog CMS overrides made in the admin aren't known here;
 * the browser still applies them after load.
 */
import { createInstance, type TFunction } from "i18next";
import { blogPosts, getBlogBlocks, hasLocalizedBlogBody } from "@/data/blog";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type AppLanguage } from "@/i18n/constants";
import { localePath } from "@/i18n/localePaths";
import { resources } from "@/i18n/resources";
import { buildPricing, currencyForLanguage } from "@/lib/pricing";
import { applyPricingTokens } from "@/lib/pricingTokens";
import {
  HOME_SOCIAL,
  SITE_ORIGIN,
  blogPostingJsonLd,
  buildPageHead,
  pricingJsonLdFromSet,
  type PageHead,
} from "@/seo/siteMeta";

export type PrerenderPage = {
  /** URL path including the locale prefix, e.g. "/sr/program". */
  url: string;
  head: PageHead;
  /** Preload the homepage hero image (only the homepage shows it above the fold). */
  preloadHero: boolean;
  sitemap: { lastmod?: string; alternates: { hreflang: string; href: string }[] } | null;
};

type BlogLocaleMeta = { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string };

function translator(locale: AppLanguage): TFunction {
  const i18n = createInstance();
  void i18n.init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  return i18n.t.bind(i18n) as TFunction;
}

function alternatesFor(head: PageHead): { hreflang: string; href: string }[] {
  return head.tags
    .filter((tag) => tag.tag === "link" && tag.attrs.rel === "alternate")
    .map((tag) => ({ hreflang: tag.attrs.hreflang, href: tag.attrs.href }));
}

function canonicalOf(head: PageHead): string | undefined {
  return head.tags.find((tag) => tag.tag === "link" && tag.attrs.rel === "canonical")?.attrs.href;
}

export function getPrerenderPages(): PrerenderPage[] {
  const pages: PrerenderPage[] = [];

  const add = (path: string, locale: AppLanguage, head: PageHead, options: { lastmod?: string } = {}) => {
    const url = localePath(path, locale);
    const canonical = canonicalOf(head);
    // Only canonical URLs belong in the sitemap.
    const inSitemap = canonical === `${SITE_ORIGIN}${url}`;
    pages.push({
      url,
      head,
      preloadHero: path === "/",
      sitemap: inSitemap ? { lastmod: options.lastmod, alternates: alternatesFor(head) } : null,
    });
  };

  for (const locale of SUPPORTED_LANGUAGES) {
    const t = translator(locale);
    const pricing = buildPricing(currencyForLanguage(locale), {
      oneTime: t("common:misc.oneTime"),
      perMonth: t("common:misc.perMonth"),
    });

    // Same keys and arguments as each page's <PageMeta>.
    add(
      "/",
      locale,
      buildPageHead({
        title: t("home:meta.title"),
        description: applyPricingTokens(t("home:meta.description"), pricing),
        path: "/",
        locale,
        social: HOME_SOCIAL,
      }),
    );
    add("/program", locale, buildPageHead({ title: t("program:meta.title"), description: t("program:meta.description"), path: "/program", locale }));
    add(
      "/app",
      locale,
      buildPageHead({
        title: t("appPage:meta.title"),
        description: t("appPage:meta.description", { priceOneTime: pricing.selfGuided.labelOneTime }),
        path: "/app",
        locale,
      }),
    );
    add("/faq", locale, buildPageHead({ title: t("faq:meta.title"), description: t("faq:meta.description"), path: "/faq", locale }));
    add(
      "/pricing",
      locale,
      buildPageHead({
        title: t("pricing:meta.title"),
        description: t("pricing:meta.description", { priceOneTime: pricing.selfGuided.labelOneTime }),
        path: "/pricing",
        locale,
        jsonLd: [pricingJsonLdFromSet(pricing, locale)],
      }),
    );
    add(
      "/coaching-apply",
      locale,
      buildPageHead({ title: t("coaching:meta.title"), description: t("coaching:meta.description"), path: "/coaching-apply", locale }),
    );
    add("/blog", locale, buildPageHead({ title: t("blog:meta.title"), description: t("blog:meta.description"), path: "/blog", locale }));
    add(
      "/start",
      locale,
      buildPageHead({
        title: "Start here — Coach Milos | Busy Strong 90",
        description: "Free training, nutrition and supplement guides from Coach Milos, plus online coaching for busy parents worldwide.",
        path: "/start",
        locale,
        locales: ["en"],
      }),
    );

    const blogMeta = (resources[locale].blog as { posts?: Record<string, BlogLocaleMeta> }).posts ?? {};
    for (const post of blogPosts) {
      const meta = blogMeta[post.slug] ?? {};
      const title = meta.title ?? post.title;
      const metaTitle = meta.metaTitle || post.metaTitle || title;
      const metaDescription = meta.metaDescription || post.metaDescription || meta.excerpt || post.excerpt;
      const availableLocales = SUPPORTED_LANGUAGES.filter((lang) => hasLocalizedBlogBody(post, lang));
      // Touch the localised body so a missing translation file fails the build instead of shipping silently.
      getBlogBlocks(post, locale);
      add(
        `/blog/${post.slug}`,
        locale,
        buildPageHead({
          title: metaTitle,
          description: metaDescription,
          path: `/blog/${post.slug}`,
          locale,
          locales: availableLocales,
          ogType: "article",
          ogImage: post.coverImage,
          jsonLd: blogPostingJsonLd({
            title,
            description: metaDescription,
            slug: post.slug,
            publishedAt: post.publishedAt,
            locale,
            availableLocales,
            coverImage: post.coverImage,
            keywords: post.keywords,
          }),
        }),
        { lastmod: post.publishedAt },
      );
    }
  }

  return pages;
}
