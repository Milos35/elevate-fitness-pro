import { useTranslation } from "react-i18next";
import t01 from "@/assets/transformations/t01.webp";
import t02 from "@/assets/transformations/t02.webp";
import t03 from "@/assets/transformations/t03.webp";
import t04 from "@/assets/transformations/t04.webp";
import t05 from "@/assets/transformations/t05.webp";
import t06 from "@/assets/transformations/t06.webp";
import t07 from "@/assets/transformations/t07.webp";
import t08 from "@/assets/transformations/t08.webp";
import t09 from "@/assets/transformations/t09.webp";

/** Client before/after photos (all 720px tall; widths keep each collage's own aspect). */
const PHOTOS = [
  { src: t01, width: 720 },
  { src: t02, width: 900 },
  { src: t03, width: 1500 },
  { src: t04, width: 720 },
  { src: t05, width: 720 },
  { src: t06, width: 900 },
  { src: t07, width: 720 },
  { src: t08, width: 900 },
  { src: t09, width: 720 },
] as const;

/** Endless, auto-scrolling showcase of client transformations; pauses on hover, static and scrollable with reduced motion. */
export function TransformationsMarquee() {
  const { t } = useTranslation("home");

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto max-w-[1100px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{t("transformations.eyebrow")}</p>
        <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
          {t("transformations.headline")} <span className="text-primary">{t("transformations.headlineHighlight")}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-muted-foreground">{t("transformations.subhead")}</p>
      </div>

      <div className="marquee mt-12 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex w-max">
          {/* Two identical sets so the loop is seamless; the second set is hidden from screen readers */}
          {[0, 1].map((copy) =>
            PHOTOS.map((photo, i) => (
              <div key={`${copy}-${i}`} className="shrink-0 pe-4" aria-hidden={copy === 1}>
                <img
                  src={photo.src}
                  alt={copy === 0 ? t("transformations.imageAlt", { n: i + 1 }) : ""}
                  width={photo.width}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="h-[260px] w-auto rounded-[1.75rem] border border-white/10 object-cover shadow-[0_20px_50px_hsl(0_0%_0%/0.35)] transition-transform duration-500 hover:scale-[1.03] sm:h-[340px] lg:h-[400px]"
                />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
