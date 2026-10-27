// Makes a 1200x800 blog cover in the Busy Strong 90 style from one of the coach photos in src/assets.
// Usage: node scripts/blog-cover.mjs <slug> "<title>" [photo] [kicker]
//   photo: coach-training | coach-workout | coach-about | coach-front | coach-hanging (default: picked from the slug)
// Writes public/blog/<slug>.jpg. Needs Playwright with Chromium installed (not a site dependency).
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const [slug, title, photoArg, kicker = "BUSY STRONG 90"] = process.argv.slice(2);
if (!slug || !title) {
  console.error('Usage: node scripts/blog-cover.mjs <slug> "<title>" [photo] [kicker]');
  process.exit(1);
}

const photos = ["coach-training", "coach-workout", "coach-about", "coach-front", "coach-hanging"];
const photo = photoArg || photos[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % photos.length];
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const img = readFileSync(path.join(root, "src/assets", `${photo}.webp`)).toString("base64");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const size = title.length > 70 ? 50 : title.length > 45 ? 58 : 68;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;800;900&display=swap" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:800px;background:#0a0a0a;font-family:Inter,Arial,sans-serif;overflow:hidden;position:relative}
  .photo{position:absolute;inset:0 0 0 38%;background:url(data:image/webp;base64,${img}) center 25%/cover}
  .fade{position:absolute;inset:0;background:linear-gradient(90deg,#0a0a0a 36%,rgba(10,10,10,.85) 52%,rgba(10,10,10,.15) 80%,rgba(10,10,10,0))}
  .text{position:absolute;left:64px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:28px}
  .kicker{color:#43bca9;font-weight:800;letter-spacing:.18em;font-size:22px}
  h1{color:#fff;font-weight:900;font-size:${size}px;line-height:1.06;letter-spacing:-.02em}
  .bar{width:96px;height:8px;background:#43bca9;border-radius:4px}
  .by{color:#cfcfcf;font-weight:500;font-size:22px}
</style></head><body>
<div class="photo"></div><div class="fade"></div>
<div class="text"><div class="kicker">${esc(kicker)}</div><h1>${esc(title).replace(/-/g, "\u2011")}</h1><div class="bar"></div><div class="by">Coach Milos · busystrong90.com</div></div>
</body></html>`;

const out = path.join(root, "public/blog", `${slug}.jpg`);
mkdirSync(path.dirname(out), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.setContent(html, { waitUntil: "networkidle" }).catch(() => {});
await page.screenshot({ path: out, type: "jpeg", quality: 86 });
await browser.close();
console.log(`${out} (${photo})`);
