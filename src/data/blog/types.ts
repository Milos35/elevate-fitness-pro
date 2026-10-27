import type { AppLanguage } from "@/i18n/constants";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "blockquote"; text: string }
  | {
      type: "cta";
      title?: string;
      bullets?: string[];
      primaryHref: string;
      primaryLabel: string;
      secondaryHref?: string;
      secondaryLabel?: string;
    };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishedAt: string;
  readingTimeMinutes: number;
  coverImage?: string;
  coverImageAlt?: string;
  featuredOnHomepage?: boolean;
  /** Added from the repo by the daily blog workflow; shown even when the CMS has its own post list. */
  autoPublished?: boolean;
  blocks: BlogBlock[];
  blocksByLocale?: Partial<Record<AppLanguage, BlogBlock[]>>;
};
