import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import t01 from "@/assets/transformations/t01.webp";
import t02 from "@/assets/transformations/t02.webp";
import t03 from "@/assets/transformations/t03.webp";
import t04 from "@/assets/transformations/t04.webp";
import t05 from "@/assets/transformations/t05.webp";
import t06 from "@/assets/transformations/t06.webp";
import t07 from "@/assets/transformations/t07.webp";
import t08 from "@/assets/transformations/t08.webp";
import t09 from "@/assets/transformations/t09.webp";

/** Client before/after photos (720px tall; widths keep each collage's own aspect). */
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

const AUTOPLAY_MS = 1500;
const TILT_DEG = 12; // rotateY of side cards
const SIDE_TILT_DEG = 4; // rotateZ of side cards
const INACTIVE_OPACITY = 0.6;

/** Signed shortest distance from the active card, wrapping around (e.g. -1 = just left of center). */
function wrappedOffset(index: number, active: number, count: number): number {
  let d = index - active;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

/**
 * 3D coverflow of client transformations (in the spirit of Originkit's Coverflow Gallery):
 * center card in focus, neighbours tilted behind it. Autoplays, pauses on hover/focus,
 * and works with arrows, dots, card clicks, swipe and the keyboard.
 */
export function TransformationsGallery() {
  const { t, i18n } = useTranslation("home");
  const rtl = i18n.dir() === "rtl";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const count = PHOTOS.length;

  const go = useCallback((step: number) => setActive((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, go]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
  }

  function onPointerUp(e: PointerEvent) {
    if (pointerStart.current === null) return;
    const dx = e.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 !== rtl ? 1 : -1);
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[40rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/15 blur-3xl" aria-hidden />
      <div className="container relative mx-auto max-w-[1100px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{t("transformations.eyebrow")}</p>
        <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
          {t("transformations.headline")} <span className="text-primary">{t("transformations.headlineHighlight")}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-center text-pretty text-muted-foreground">{t("transformations.subhead")}</p>
      </div>

      <div
        className="relative mx-auto mt-12 h-[260px] w-full max-w-[1200px] touch-pan-y select-none outline-none [perspective:1400px] sm:h-[380px] lg:h-[440px]"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("transformations.eyebrow")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onPointerDown={(e) => (pointerStart.current = e.clientX)}
        onPointerUp={onPointerUp}
      >
        {PHOTOS.map((photo, i) => {
          const offset = wrappedOffset(i, active, count);
          const distance = Math.abs(offset);
          const visible = distance <= 2;
          const dir = rtl ? -1 : 1;
          const style: CSSProperties = {
            transform: `translate(-50%, -50%) translateX(calc(${offset * dir} * var(--cf-step))) translateZ(${-distance * 140}px) rotateY(${-offset * dir * TILT_DEG}deg) rotateZ(${offset * dir * SIDE_TILT_DEG}deg) scale(${1 - distance * 0.1})`,
            opacity: !visible ? 0 : offset === 0 ? 1 : INACTIVE_OPACITY,
            zIndex: 10 - distance,
          };
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden={offset !== 0}
              onClick={() => (offset === 0 ? undefined : go(offset))}
              className={cn(
                "absolute left-1/2 top-1/2 h-full w-[min(86vw,320px)] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111] shadow-[0_30px_70px_hsl(0_0%_0%/0.55)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,0.8,0.2,1)] [--cf-step:min(42vw,170px)] motion-reduce:transition-none sm:w-[480px] sm:[--cf-step:260px] lg:w-[560px] lg:[--cf-step:340px]",
                !visible && "pointer-events-none",
                offset !== 0 && "cursor-pointer",
              )}
              style={style}
            >
              {/* Blurred copy fills the card; the sharp photo is contained so before/after collages are never cropped */}
              <img src={photo.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl" loading="lazy" decoding="async" />
              <img
                src={photo.src}
                alt={t("transformations.imageAlt", { n: i + 1 })}
                width={photo.width}
                height={720}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="relative h-full w-full object-contain"
              />
            </button>
          );
        })}
      </div>

      <div className="relative mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(rtl ? 1 : -1)}
          className="glass-subtle flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
          aria-label={t("transformations.prev")}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex gap-1.5">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t("transformations.goTo", { n: i + 1 })}
              aria-current={i === active}
              className={cn("h-2 rounded-full transition-all", i === active ? "w-6 bg-primary" : "w-2 bg-white/25 hover:bg-white/50")}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(rtl ? -1 : 1)}
          className="glass-subtle flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
          aria-label={t("transformations.next")}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
