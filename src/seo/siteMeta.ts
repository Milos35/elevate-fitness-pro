/**
 * Shared SEO helpers. Used in the browser by <PageMeta> / schema components and at build time by
 * src/seo/prerender.ts, so the HTML Google receives and the tags React sets afterwards always match.
 * Keep this file free of browser-only APIs.
 */
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type AppLanguage } from "@/i18n/constants";
import { localePath, stripLocalePrefix } from "@/i18n/localePaths";
import type { PricingSet } from "@/lib/pricing";

export const SITE_ORIGIN = "https://busystrong90.com";
export const SITE_NAME = "BUSY STRONG 90";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;
export const ALL_LOCALES: readonly AppLanguage[] = SUPPORTED_LANGUAGES;

/** Adds " | BUSY STRONG 90" unless the title already names the brand (any letter case). */
export function withBrand(title: string): string {
  return title.toLowerCase().includes(SITE_NAME.toLowerCase()) ? title : `${title} | ${SITE_NAME}`;
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * The locale a page should name as canonical. A page viewed in a language it hasn't been
 * translated into (for example an English-only article under /ar) points at its main version.
 */
export function canonicalLocale(active: AppLanguage, available: readonly AppLanguage[]): AppLanguage {
  if (available.includes(active)) return active;
  return available.includes(DEFAULT_LANGUAGE) ? DEFAULT_LANGUAGE : available[0] ?? DEFAULT_LANGUAGE;
}

export function canonicalUrl(path: string, active: AppLanguage, available: readonly AppLanguage[] = ALL_LOCALES): string {
  const base = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
  return `${SITE_ORIGIN}${localePath(base, canonicalLocale(active, available))}`;
}

/** hreflang links for the languages a page really exists in (none when it exists in only one). */
export function alternateLinks(path: string, available: readonly AppLanguage[] = ALL_LOCALES): { hreflang: string; href: string }[] {
  if (available.length < 2) return [];
  const base = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
  const links = available.map((locale) => ({ hreflang: locale, href: `${SITE_ORIGIN}${localePath(base, locale)}` }));
  const xDefault = available.includes(DEFAULT_LANGUAGE) ? DEFAULT_LANGUAGE : available[0];
  return [...links, { hreflang: "x-default", href: `${SITE_ORIGIN}${localePath(base, xDefault)}` }];
}

export function ogLocale(locale: AppLanguage): string {
  if (locale === "sr") return "sr_RS";
  if (locale === "ar") return "ar_AE";
  return "en_GB";
}

export function schemaLanguage(locale: AppLanguage): string {
  if (locale === "sr") return "sr-RS";
  if (locale === "ar") return "ar-AE";
  return "en-GB";
}

/** Link-preview copy for the homepage, unchanged from the original index.html. */
export const HOME_SOCIAL = {
  title: "Busy Strong 90 — Stronger Body. More Energy.",
  description: "90-day system for busy fathers 35+. 22 min, 3x/week, no gym.",
  imageAlt: "Busy Strong 90 — 90-day fitness for busy fathers",
} as const;

export type HeadTag = { tag: "meta" | "link"; attrs: Record<string, string> };

export type PageHeadInput = {
  title: string;
  description: string;
  /** Path without locale prefix, e.g. "/blog/my-post". */
  path: string;
  locale: AppLanguage;
  /** Languages this page really exists in. Defaults to all site languages. */
  locales?: readonly AppLanguage[];
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  /** Optional link-preview copy (WhatsApp, Facebook, X) when it should differ from the search title. */
  social?: { title?: string; description?: string; imageAlt?: string };
};

export type PageHead = {
  title: string;
  lang: AppLanguage;
  tags: HeadTag[];
  jsonLd: Record<string, unknown>[];
};

/** Every page-level head tag, in one place. Rendered by <PageMeta> and serialised by the prerender step. */
export function buildPageHead(input: PageHeadInput): PageHead {
  const locales = input.locales && input.locales.length > 0 ? input.locales : ALL_LOCALES;
  const title = withBrand(input.title);
  const canonical = canonicalUrl(input.path, input.locale, locales);
  const ogImage = input.ogImage ? absoluteUrl(input.ogImage) : DEFAULT_OG_IMAGE;
  const isDefaultImage = ogImage === DEFAULT_OG_IMAGE;
  const tags: HeadTag[] = [{ tag: "meta", attrs: { name: "description", content: input.description } }];

  if (input.noindex) {
    tags.push({ tag: "meta", attrs: { name: "robots", content: "noindex, nofollow" } });
  } else {
    tags.push({ tag: "link", attrs: { rel: "canonical", href: canonical } });
    for (const alt of alternateLinks(input.path, locales)) {
      tags.push({ tag: "link", attrs: { rel: "alternate", hreflang: alt.hreflang, href: alt.href } });
    }
  }

  const socialTitle = input.social?.title ?? title;
  const socialDescription = input.social?.description ?? input.description;
  tags.push(
    { tag: "meta", attrs: { property: "og:title", content: socialTitle } },
    { tag: "meta", attrs: { property: "og:description", content: socialDescription } },
    { tag: "meta", attrs: { property: "og:url", content: canonical } },
    { tag: "meta", attrs: { property: "og:locale", content: ogLocale(input.locale) } },
    { tag: "meta", attrs: { property: "og:type", content: input.ogType ?? "website" } },
    { tag: "meta", attrs: { property: "og:image", content: ogImage } },
    { tag: "meta", attrs: { property: "og:image:secure_url", content: ogImage } },
  );
  if (isDefaultImage) {
    tags.push(
      { tag: "meta", attrs: { property: "og:image:type", content: "image/jpeg" } },
      { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
      { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    );
  }
  if (input.social?.imageAlt) {
    tags.push({ tag: "meta", attrs: { property: "og:image:alt", content: input.social.imageAlt } });
  }
  tags.push(
    { tag: "meta", attrs: { property: "og:site_name", content: SITE_NAME } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: socialTitle } },
    { tag: "meta", attrs: { name: "twitter:description", content: socialDescription } },
    { tag: "meta", attrs: { name: "twitter:image", content: ogImage } },
  );

  return { title, lang: input.locale, tags, jsonLd: input.jsonLd ?? [] };
}

type BlogPostingInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  locale: AppLanguage;
  availableLocales: readonly AppLanguage[];
  coverImage?: string;
  keywords?: string[];
};

/** BlogPosting + BreadcrumbList structured data for one article. */
export function blogPostingJsonLd(input: BlogPostingInput): Record<string, unknown>[] {
  const url = canonicalUrl(`/blog/${input.slug}`, input.locale, input.availableLocales);
  const blogUrl = `${SITE_ORIGIN}${localePath("/blog", input.locale)}`;
  const homeUrl = `${SITE_ORIGIN}${localePath("/", input.locale)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: input.title,
      description: input.description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: input.publishedAt,
      dateModified: input.publishedAt,
      author: { "@type": "Person", name: "Coach Milos", url: "https://www.instagram.com/_coachmilos/" },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/pwa-512.png` },
      },
      image: input.coverImage ? absoluteUrl(input.coverImage) : DEFAULT_OG_IMAGE,
      ...(input.keywords && input.keywords.length > 0 ? { keywords: input.keywords.join(", ") } : {}),
      inLanguage: schemaLanguage(canonicalLocale(input.locale, input.availableLocales)),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: homeUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: blogUrl },
        { "@type": "ListItem", position: 3, name: input.title, item: url },
      ],
    },
  ];
}

type OfferInput = { name: string; description: string; price: number; currency: string; billing: "once" | "monthly" };

/** Service structured data for the pricing page: one Offer per plan. */
export function pricingJsonLd(offers: OfferInput[], locale: AppLanguage): Record<string, unknown> {
  const url = `${SITE_ORIGIN}${localePath("/pricing", locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Busy Strong 90 coaching and program",
    serviceType: "Online fitness coaching",
    provider: { "@type": "Organization", name: SITE_NAME, url: `${SITE_ORIGIN}/` },
    areaServed: "Worldwide",
    url,
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      description: offer.description,
      price: String(offer.price),
      priceCurrency: offer.currency,
      url,
      ...(offer.billing === "monthly"
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(offer.price),
              priceCurrency: offer.currency,
              unitCode: "MON",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            },
          }
        : {}),
    })),
  };
}

/** The three plans as structured data, in the currency the page shows. */
export function pricingJsonLdFromSet(pricing: PricingSet, locale: AppLanguage): Record<string, unknown> {
  return pricingJsonLd(
    [
      {
        name: "Busy Strong 90 — self-guided 90-day program",
        description: "Full 90-day program in the Busy Strong 90 app: 36 sessions, nutrition guidance and progress tracking.",
        price: pricing.selfGuided.amount,
        currency: pricing.currency,
        billing: "once",
      },
      {
        name: "Coached Strong 90 — core coaching",
        description: "The 90-day program with a personal schedule, weekly check-ins, form checks and WhatsApp support.",
        price: pricing.coachedStrong90.amount,
        currency: pricing.currency,
        billing: "monthly",
      },
      {
        name: "Private Transformation — 1:1 coaching",
        description: "Weekly 1:1 calls with Coach Milos, a program rebuilt monthly and direct WhatsApp access.",
        price: pricing.privateTransformation.amount,
        currency: pricing.currency,
        billing: "monthly",
      },
    ],
    locale,
  );
}

export { stripLocalePrefix };
