import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE = "https://busystrong90.com";
type Post = { slug: string; title: string; excerpt: string; publishedAt: string; enabled?: boolean };
// Snapshot of the existing built-in articles; new CMS publications are fetched on every cache refresh.
const builtinPosts: Post[] = [
  {
    "slug": "tips-for-muscle-growth",
    "title": "4 Hacks for Massive Muscle Growth",
    "excerpt": "Protein at every meal, eat more, compound lifts, and train heavy — four proven hacks for building serious muscle mass without the Instagram hype.",
    "publishedAt": "2026-06-10"
  },
  {
    "slug": "five-foods-for-bodybuilding",
    "title": "Eat to Grow – 5 Foods Perfect for Bodybuilders",
    "excerpt": "Muscle is built in the kitchen. Five bodybuilding staples — eggs, salmon, oats, beef, and chicken — and why each earns a place on your plate.",
    "publishedAt": "2026-06-12"
  },
  {
    "slug": "four-mistakes-training-arms",
    "title": "4 Mistakes When Training Arms",
    "excerpt": "From leaning back on curls to skipping triceps — four common arm training mistakes that stop your biceps and triceps from growing.",
    "publishedAt": "2026-06-14"
  },
  {
    "slug": "health-fitness-supplements",
    "title": "4 Supplements for the Ultimate Health and Fitness Stack",
    "excerpt": "Omega-3, creatine, multivitamins, and protein — four supplements to build the ultimate health and fitness stack alongside diet and exercise.",
    "publishedAt": "2026-06-16"
  },
  {
    "slug": "no-time-too-tired-workout-busy-men",
    "title": "No Time to Work Out? Too Tired? Here's What Actually Works for Busy Men",
    "excerpt": "No time and too tired to exercise? Why busy men 35+ fail at fitness — and how 30-minute, 3×/week home workouts restore energy without adding hours to your schedule.",
    "publishedAt": "2026-05-20"
  },
  {
    "slug": "fallen-off-wagon-fitness-consistency-busy-men",
    "title": "Fallen Off the Wagon? How Busy Men Build Fitness Consistency Without Motivation",
    "excerpt": "Off and on with fitness? Why busy men quit, how to stop the rinse-and-repeat cycle, and build workout habits that stick — without relying on motivation.",
    "publishedAt": "2026-05-22"
  },
  {
    "slug": "dad-bod-out-of-shape-after-kids-fitness",
    "title": "Dad Bod and Out of Shape After Kids? How to Get Strong Again Without Starting Over",
    "excerpt": "Out of shape after kids? A practical guide for men 35+ to rebuild strength, lose weight, and get back the body — and energy — you had before life got busy.",
    "publishedAt": "2026-05-25"
  }
];

// Articles published from the repo (autoPublished in src/data/blog). Always in the feed, even when the CMS has its own list.
// Newest first; add each new auto-published article here too.
const autoPosts: Post[] = [
  {
    "slug": "vitamin-d-deficiency-dubai",
    "title": "Vitamin D Deficiency in Dubai: Why It's So Common and What Busy Parents Can Do",
    "excerpt": "Sun almost every day, yet low vitamin D is common in Dubai and the UAE. A coach's practical guide for busy parents: why it happens, when to get tested and the simple habits that help.",
    "publishedAt": "2026-10-30"
  },
  {
    "slug": "increase-testosterone-naturally-after-40",
    "title": "How to Increase Testosterone Naturally After 40: A Coach's Guide for Busy Men",
    "excerpt": "Tired, softer around the middle and losing strength after 40? Here is how to increase testosterone naturally with the basics that matter: strength training, sleep, body fat, food and stress.",
    "publishedAt": "2026-10-29"
  },
  {
    "slug": "lose-weight-without-counting-calories-after-40",
    "title": "How to Lose Weight Without Counting Calories After 40: A Simple System for Busy Parents",
    "excerpt": "You can lose weight without counting calories after 40. Here is the simple plate system I use with busy parents: protein first, hand-sized portions and a few rules you can follow at a family dinner.",
    "publishedAt": "2026-10-28"
  },
  {
    "slug": "online-vs-in-person-personal-trainer-dubai",
    "title": "Online Personal Trainer vs In-Person Personal Trainer in Dubai: Which Is Right for a Busy Parent?",
    "excerpt": "Choosing a personal trainer in Dubai? Compare online coaching and in-person training for busy parents over 35, and find the option you will still be doing in six months.",
    "publishedAt": "2026-10-27"
  }
];

const withAutoPosts = (posts: Post[]): Post[] =>
  [...posts, ...autoPosts.filter(a => !posts.some(p => p.slug === a.slug)).map(a => ({ ...a }))];

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, fallback: string) => typeof v === "string" ? v : fallback;
const xml = (v: string) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// Match the English blog's built-in articles and CMS fallback behavior.
export function resolveFeedPosts(payload: unknown): Post[] {
  const defaults = builtinPosts.map(p => ({ ...p }));
  if (!record(payload) || !Array.isArray(payload.posts)) return withAutoPosts(defaults);
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
  return withAutoPosts(posts.length ? posts : defaults);
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
