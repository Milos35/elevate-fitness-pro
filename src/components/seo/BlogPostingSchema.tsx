import { Helmet } from "react-helmet-async";
import { localePath } from "@/i18n/localePaths";
import type { AppLanguage } from "@/i18n/constants";
import type { BlogBlock } from "@/data/blog/types";

const SITE_ORIGIN = "https://busystrong90.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

type BlogPostingSchemaProps = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  keywords?: string[];
  locale?: AppLanguage;
  coverImage?: string;
  blocks?: BlogBlock[];
};

const stripMd = (t: string) =>
  t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|\*/g, "").trim();

/** Pull question/answer pairs from the post's FAQ section (h2 containing "FAQ", then h3 + p). */
function extractFaq(blocks: BlogBlock[] = []) {
  const out: { q: string; a: string }[] = [];
  let inFaq = false;
  let q: string | null = null;
  for (const b of blocks) {
    if (b.type === "h2") {
      inFaq = /faq|frequently asked/i.test(b.text);
      q = null;
      continue;
    }
    if (!inFaq) continue;
    if (b.type === "h3") q = stripMd(b.text);
    else if (b.type === "p" && q) {
      out.push({ q, a: stripMd(b.text) });
      q = null;
    }
  }
  return out;
}

export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  keywords = [],
  locale = "en",
  coverImage,
  blocks,
}: BlogPostingSchemaProps) {
  const image = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `${SITE_ORIGIN}${coverImage}`
    : DEFAULT_OG_IMAGE;
  const url = `${SITE_ORIGIN}${localePath(`/blog/${slug}`, locale)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      "@id": `${SITE_ORIGIN}/#milos-ilic`,
      name: "Milos Ilic",
      alternateName: "Coach Milos",
      jobTitle: "Personal trainer and online fitness coach",
      url: `${SITE_ORIGIN}/`,
      sameAs: ["https://www.instagram.com/_coachmilos/"],
    },
    publisher: {
      "@type": "Organization",
      name: "BUSY STRONG 90",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/pwa-512.png`,
      },
    },
    image,
    keywords: keywords.join(", "),
    inLanguage: locale === "sr" ? "sr-RS" : locale === "ar" ? "ar-AE" : "en-GB",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_ORIGIN}${localePath("/blog", locale)}` },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  const faq = extractFaq(blocks);
  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
    </Helmet>
  );
}

export { DEFAULT_OG_IMAGE, SITE_ORIGIN };
