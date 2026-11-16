import { describe, expect, it } from "vitest";
import { alternateLinks, buildPageHead, canonicalUrl, withBrand } from "./siteMeta";

describe("withBrand", () => {
  it("adds the brand once, ignoring letter case", () => {
    expect(withBrand("Pricing")).toBe("Pricing | BUSY STRONG 90");
    expect(withBrand("Busy Strong 90 — 90-Day Fitness | Coach Milos")).toBe("Busy Strong 90 — 90-Day Fitness | Coach Milos");
  });
});

describe("canonicalUrl", () => {
  it("uses the page's own language when it exists", () => {
    expect(canonicalUrl("/program", "sr")).toBe("https://busystrong90.com/sr/program");
    expect(canonicalUrl("/", "en")).toBe("https://busystrong90.com/");
  });

  it("points untranslated language versions at the original", () => {
    expect(canonicalUrl("/blog/some-post", "ar", ["en"])).toBe("https://busystrong90.com/blog/some-post");
    expect(canonicalUrl("/ar/blog/some-post", "ar", ["en", "sr"])).toBe("https://busystrong90.com/blog/some-post");
  });
});

describe("alternateLinks", () => {
  it("lists only languages that exist, plus x-default", () => {
    expect(alternateLinks("/blog/some-post", ["en", "sr"])).toEqual([
      { hreflang: "en", href: "https://busystrong90.com/blog/some-post" },
      { hreflang: "sr", href: "https://busystrong90.com/sr/blog/some-post" },
      { hreflang: "x-default", href: "https://busystrong90.com/blog/some-post" },
    ]);
  });

  it("outputs nothing for single-language pages", () => {
    expect(alternateLinks("/start", ["en"])).toEqual([]);
  });
});

describe("buildPageHead", () => {
  it("drops canonical and hreflang on noindex pages", () => {
    const head = buildPageHead({ title: "Login", description: "Members", path: "/login", locale: "en", noindex: true });
    expect(head.tags.some((t) => t.attrs.rel === "canonical")).toBe(false);
    expect(head.tags.find((t) => t.attrs.name === "robots")?.attrs.content).toBe("noindex, nofollow");
  });

  it("uses absolute cover images for link previews", () => {
    const head = buildPageHead({ title: "Post", description: "D", path: "/blog/x", locale: "en", ogImage: "/blog/x.jpg" });
    expect(head.tags.find((t) => t.attrs.property === "og:image")?.attrs.content).toBe("https://busystrong90.com/blog/x.jpg");
  });
});
