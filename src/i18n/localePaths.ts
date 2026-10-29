import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type AppLanguage } from "./constants";

const LOCALE_PREFIXES = new Set<AppLanguage>(["sr", "ar"]);

const PUBLIC_PATHS = new Set([
  "/",
  "/program",
  "/app",
  "/training",
  "/nutrition",
  "/faq",
  "/pricing",
  "/coaching-apply",
  "/blog",
  "/results",
]);

export function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.has(path) || path.startsWith("/blog/");
}

export function splitLocalePath(pathname: string): { locale: AppLanguage; path: string } {
  if (!pathname || pathname === "/") return { locale: DEFAULT_LANGUAGE, path: "/" };

  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];

  if (first === "sr" || first === "ar") {
    const rest = parts.slice(1).join("/");
    return { locale: first, path: rest ? `/${rest}` : "/" };
  }

  return {
    locale: DEFAULT_LANGUAGE,
    path: pathname.startsWith("/") ? pathname : `/${pathname}`,
  };
}

export function stripLocalePrefix(pathname: string): string {
  return splitLocalePath(pathname).path;
}

export function localePath(path: string, locale: AppLanguage): string {
  let pathname = path;
  let hash = "";
  let search = "";

  if (pathname.includes("#")) {
    const hashIndex = pathname.indexOf("#");
    hash = pathname.slice(hashIndex);
    pathname = pathname.slice(0, hashIndex);
  }

  if (pathname.includes("?")) {
    const queryIndex = pathname.indexOf("?");
    search = pathname.slice(queryIndex);
    pathname = pathname.slice(0, queryIndex);
  }

  const stripped = stripLocalePrefix(pathname.startsWith("/") ? pathname : `/${pathname}`);
  const normalized = stripped === "/" ? "" : stripped;

  if (locale === DEFAULT_LANGUAGE) {
    return `${normalized || "/"}${search}${hash}`;
  }

  return `/${locale}${normalized}${search}${hash}`;
}

export function localeFromPathname(pathname: string): AppLanguage {
  return splitLocalePath(pathname).locale;
}

export function isLocalePrefixedPath(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "sr" || first === "ar";
}

export function hreflangForLocale(locale: AppLanguage): string {
  return locale;
}

export function allLocaleAlternates(path: string, origin: string): { hreflang: string; href: string }[] {
  const stripped = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
  const alternates = SUPPORTED_LANGUAGES.map((locale) => ({
    hreflang: hreflangForLocale(locale),
    href: `${origin}${localePath(stripped, locale)}`,
  }));

  return [
    ...alternates,
    { hreflang: "x-default", href: `${origin}${localePath(stripped, DEFAULT_LANGUAGE)}` },
  ];
}
