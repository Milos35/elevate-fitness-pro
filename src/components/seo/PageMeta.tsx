import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE, type AppLanguage } from "@/i18n/constants";
import { buildPageHead } from "@/seo/siteMeta";

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  /** Kept for existing callers; search engines ignore the keywords tag, so it is no longer output. */
  keywords?: string[];
  locale?: AppLanguage;
  /** Languages this page is really translated into. Defaults to every site language. */
  locales?: readonly AppLanguage[];
  /** Member, account and checkout pages: keep them out of search results. */
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
  social?: { title?: string; description?: string; imageAlt?: string };
};

/** React attribute names for the few head attributes that differ from HTML. */
const REACT_ATTR: Record<string, string> = { hreflang: "hrefLang" };

function toReactProps(attrs: Record<string, string>): Record<string, string> {
  const props: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) props[REACT_ATTR[key] ?? key] = value;
  return props;
}

export function PageMeta({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  locale,
  locales,
  noindex,
  jsonLd,
  social,
}: PageMetaProps) {
  const { i18n } = useTranslation();
  const activeLocale = locale ?? ((i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE) as AppLanguage);
  const head = buildPageHead({
    title,
    description,
    path: path.startsWith("/") ? path : `/${path}`,
    locale: activeLocale,
    locales,
    ogImage,
    ogType,
    noindex,
    jsonLd,
    social,
  });

  return (
    <Helmet>
      <html lang={head.lang} />
      <title>{head.title}</title>
      {head.tags.map(({ tag, attrs }) => {
        const key = `${tag}:${attrs.name ?? attrs.property ?? attrs.rel}:${attrs.hreflang ?? ""}`;
        return tag === "meta" ? <meta key={key} {...toReactProps(attrs)} /> : <link key={key} {...toReactProps(attrs)} />;
      })}
      {head.jsonLd.map((schema, index) => (
        <script key={`ld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
