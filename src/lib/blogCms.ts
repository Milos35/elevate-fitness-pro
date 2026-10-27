import { blogPosts, getBlogBlocks } from "@/data/blog";
import type { BlogBlock, BlogPost } from "@/data/blog";
import { asNullableString, asString, asStringArray, isRecord } from "@/lib/cmsUtils";
import { blogCoverUrl, BLOG_IMAGE_BUCKET } from "@/lib/blogMedia";
import { supabase } from "@/lib/supabase";
import arBlog from "@/i18n/locales/ar/blog";
import enBlog from "@/i18n/locales/en/blog";
import srBlog from "@/i18n/locales/sr/blog";
import type { HomepageLocale } from "@/types/homepageCms";
import type { BlogCmsPayload, BlogPostCms } from "@/types/siteCms";

type BlogI18nPosts = Record<
  string,
  { title: string; excerpt: string; metaTitle: string; metaDescription: string }
>;

function localeBlogMeta(locale: HomepageLocale): BlogI18nPosts {
  const bundle = locale === "ar" ? arBlog : locale === "sr" ? srBlog : enBlog;
  return bundle.posts as BlogI18nPosts;
}

function cloneBlocks(blocks: BlogBlock[]): BlogBlock[] {
  return blocks.map((block) => {
    if (block.type === "ul" || block.type === "ol") {
      return { type: block.type, items: [...block.items] };
    }
    if (block.type === "table") {
      return {
        type: "table",
        headers: [...block.headers],
        rows: block.rows.map((row) => [...row]),
      };
    }
    if (block.type === "cta") {
      return {
        ...block,
        bullets: block.bullets ? [...block.bullets] : undefined,
      };
    }
    return { ...block };
  });
}

function postToCms(post: BlogPost, locale: HomepageLocale): BlogPostCms {
  const meta = localeBlogMeta(locale)[post.slug];
  return {
    id: post.slug,
    slug: post.slug,
    title: meta?.title ?? post.title,
    excerpt: meta?.excerpt ?? post.excerpt,
    metaTitle: meta?.metaTitle ?? post.metaTitle,
    metaDescription: meta?.metaDescription ?? post.metaDescription,
    keywords: [...post.keywords],
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    coverPath: post.coverImage ?? null,
    coverAlt: post.coverImageAlt ?? "",
    featuredOnHomepage: Boolean(post.featuredOnHomepage),
    enabled: true,
    blocks: cloneBlocks(getBlogBlocks(post, locale)),
  };
}

export function getDefaultBlogCms(locale: HomepageLocale): BlogCmsPayload {
  return {
    posts: blogPosts.map((post) => postToCms(post, locale)),
  };
}

function parseBlock(raw: unknown): BlogBlock | null {
  if (!isRecord(raw)) return null;
  const type = asString(raw.type, "");
  if (type === "p" || type === "h2" || type === "h3" || type === "blockquote") {
    return { type, text: asString(raw.text, "") };
  }
  if (type === "ul" || type === "ol") {
    const items = asStringArray(raw.items, []);
    return { type, items };
  }
  if (type === "table") {
    const headers = asStringArray(raw.headers, []);
    const rowsRaw = Array.isArray(raw.rows) ? raw.rows : [];
    const rows = rowsRaw
      .map((row) => (Array.isArray(row) ? row.filter((c): c is string => typeof c === "string") : null))
      .filter((row): row is string[] => row !== null);
    return { type: "table", headers, rows };
  }
  if (type === "cta") {
    return {
      type: "cta",
      title: typeof raw.title === "string" ? raw.title : undefined,
      bullets: Array.isArray(raw.bullets)
        ? raw.bullets.filter((b): b is string => typeof b === "string")
        : undefined,
      primaryHref: asString(raw.primaryHref, "/pricing"),
      primaryLabel: asString(raw.primaryLabel, "Get the Program"),
      secondaryHref: typeof raw.secondaryHref === "string" ? raw.secondaryHref : undefined,
      secondaryLabel: typeof raw.secondaryLabel === "string" ? raw.secondaryLabel : undefined,
    };
  }
  return null;
}

function parsePost(raw: unknown, fallback?: BlogPostCms): BlogPostCms | null {
  if (!isRecord(raw)) return null;
  const slug = asString(raw.slug, fallback?.slug ?? "").trim();
  if (!slug) return null;
  const blocksRaw = Array.isArray(raw.blocks) ? raw.blocks : null;
  const blocks =
    blocksRaw
      ?.map(parseBlock)
      .filter((b): b is BlogBlock => b !== null) ??
    fallback?.blocks ??
    [];

  return {
    id: asString(raw.id, fallback?.id ?? slug).trim() || slug,
    slug,
    title: asString(raw.title, fallback?.title ?? "Untitled"),
    excerpt: asString(raw.excerpt, fallback?.excerpt ?? ""),
    metaTitle: asString(raw.metaTitle, fallback?.metaTitle ?? asString(raw.title, "Untitled")),
    metaDescription: asString(raw.metaDescription, fallback?.metaDescription ?? ""),
    keywords: asStringArray(raw.keywords, fallback?.keywords ?? []),
    publishedAt: asString(raw.publishedAt, fallback?.publishedAt ?? new Date().toISOString().slice(0, 10)),
    readingTimeMinutes:
      typeof raw.readingTimeMinutes === "number" && Number.isFinite(raw.readingTimeMinutes)
        ? Math.max(1, Math.round(raw.readingTimeMinutes))
        : (fallback?.readingTimeMinutes ?? 5),
    coverPath: asNullableString(raw.coverPath, fallback?.coverPath ?? null),
    coverAlt: asString(raw.coverAlt, fallback?.coverAlt ?? ""),
    featuredOnHomepage:
      typeof raw.featuredOnHomepage === "boolean"
        ? raw.featuredOnHomepage
        : Boolean(fallback?.featuredOnHomepage),
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : (fallback?.enabled ?? true),
    blocks,
  };
}

export function parseBlogCms(raw: unknown, locale: HomepageLocale): BlogCmsPayload {
  const defaults = getDefaultBlogCms(locale);
  if (!isRecord(raw) || !Array.isArray(raw.posts)) return defaults;
  const byId = new Map(defaults.posts.map((p) => [p.id, p]));
  const posts = raw.posts
    .map((item) => {
      if (!isRecord(item)) return null;
      const id = asString(item.id, asString(item.slug, ""));
      return parsePost(item, byId.get(id));
    })
    .filter((p): p is BlogPostCms => p !== null);
  return { posts: posts.length > 0 ? posts : defaults.posts };
}

export function cmsPostToBlogPost(post: BlogPostCms): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    keywords: [...post.keywords],
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    coverImage: blogCoverUrl(post.coverPath) ?? undefined,
    coverImageAlt: post.coverAlt || undefined,
    featuredOnHomepage: post.featuredOnHomepage,
    blocks: cloneBlocks(post.blocks),
  };
}

export function resolveBlogCms(cms: BlogCmsPayload | null | undefined, locale: HomepageLocale): BlogPost[] {
  if (!cms?.posts?.length) {
    return blogPosts.map((post) => ({
      ...post,
      title: localeBlogMeta(locale)[post.slug]?.title ?? post.title,
      excerpt: localeBlogMeta(locale)[post.slug]?.excerpt ?? post.excerpt,
      metaTitle: localeBlogMeta(locale)[post.slug]?.metaTitle ?? post.metaTitle,
      metaDescription: localeBlogMeta(locale)[post.slug]?.metaDescription ?? post.metaDescription,
      blocks: cloneBlocks(getBlogBlocks(post, locale)),
      blocksByLocale: undefined,
    }));
  }

  const cmsSlugs = new Set(cms.posts.map((p) => p.slug));
  const autoPosts = blogPosts
    .filter((post) => post.autoPublished && !cmsSlugs.has(post.slug))
    .map((post) => postToCms(post, locale));

  return [...cms.posts, ...autoPosts]
    .filter((p) => p.enabled && p.slug.trim())
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(cmsPostToBlogPost);
}

export function createEmptyBlogPost(): BlogPostCms {
  const stamp = Date.now();
  return {
    id: `post-${stamp}`,
    slug: `new-post-${stamp}`,
    title: "New blog post",
    excerpt: "",
    metaTitle: "New blog post",
    metaDescription: "",
    keywords: [],
    publishedAt: new Date().toISOString().slice(0, 10),
    readingTimeMinutes: 5,
    coverPath: null,
    coverAlt: "",
    featuredOnHomepage: false,
    enabled: true,
    blocks: [{ type: "p", text: "Write your article here…" }],
  };
}

export function emptyBlogBlock(type: BlogBlock["type"]): BlogBlock {
  switch (type) {
    case "p":
    case "h2":
    case "h3":
    case "blockquote":
      return { type, text: "" };
    case "ul":
    case "ol":
      return { type, items: [""] };
    case "table":
      return { type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "cta":
      return {
        type: "cta",
        title: "",
        bullets: [],
        primaryHref: "/pricing",
        primaryLabel: "Get the Program",
      };
  }
}

export async function uploadBlogCover(
  file: File,
  locale: HomepageLocale,
  slug: string
): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const safeExt = ["jpeg", "jpg", "png", "webp"].includes(ext) ? ext.replace("jpg", "jpeg") : "webp";
  const safeSlug = slug.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase().slice(0, 60) || "post";
  const path = `${locale}/${safeSlug}/cover-${Date.now()}.${safeExt === "jpeg" ? "jpg" : safeExt}`;
  const { error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}
