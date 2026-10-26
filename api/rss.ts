import type { VercelRequest, VercelResponse } from "@vercel/node";
import { blogPosts } from "../src/data/blog/index.js";
import enBlog from "../src/i18n/locales/en/blog.js";

const SITE = "https://busystrong90.com";
type Post = { slug: string; title: string; excerpt: string; publishedAt: string; enabled?: boolean };
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, fallback: string) => typeof v === "string" ? v : fallback;
const xml = (v: string) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// Match the English blog's built-in articles and CMS fallback behavior.
export function resolveFeedPosts(payload: unknown): Post[] {
  const meta = enBlog.posts as Record<string, { title: string; excerpt: string }>;
  const defaults = blogPosts.map(p => ({ ...p,
    title: meta[p.slug]?.title ?? p.title, excerpt: meta[p.slug]?.excerpt ?? p.excerpt,
  }));
  if (!record(payload) || !Array.isArray(payload.posts)) return defaults;
  const posts = payload.posts.filter(record).map(raw => {
    const fallback = defaults.find(p => p.slug === str(raw.id, str(raw.slug, "")));
    return {
      slug: str(raw.slug, fallback?.slug ?? "").trim(),
      title: str(raw.title, fallback?.title ?? "Untitled"),
      excerpt: str(raw.excerpt, fallback?.excerpt ?? ""),
      publishedAt: str(raw.publishedAt, fallback?.publishedAt ?? new Date().toISOString().slice(0, 10)),
      enabled: typeof raw.enabled === "boolean" ? raw.enabled : true,
    };
  }).filter(p => p.slug);
  return posts.length ? posts : defaults;
}

export function renderFeed(posts: Post[], now = Date.now()): string {
  const items = posts.filter(p => p.enabled !== false && p.slug && Number.isFinite(Date.parse(p.publishedAt))
    && Date.parse(p.publishedAt) <= now)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).slice(0, 50)
    .map(p => {
      const url = `${SITE}/blog/${encodeURIComponent(p.slug)}`;
      return `<item><title>${xml(p.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(p.excerpt)}</description><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate></item>`;
    }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>BUSY STRONG 90 — Coach Milos</title><link>${SITE}/blog</link>
<description>Training and nutrition advice for busy fathers.</description><language>en</language>
<atom:link href="${SITE}/api/rss" rel="self" type="application/rss+xml" />
${items}
</channel></rss>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  // Use the same public credentials as the website, never an admin/service-role key.
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  try {
    if (!url || !key) throw new Error("Missing public Supabase configuration");
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/get_published_site_content`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_page_key: "blog", p_locale: "en" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Published blog request failed: ${response.status}`);
    const feed = renderFeed(resolveFeedPosts(await response.json()));
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
    return res.status(200).send(req.method === "HEAD" ? "" : feed);
  } catch (error) {
    console.error("[rss]", error instanceof Error ? error.message : "Feed unavailable");
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).send("Blog feed temporarily unavailable");
  }
}
