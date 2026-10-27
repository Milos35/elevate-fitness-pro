import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play } from "lucide-react";
import type { TestimonialVideo } from "@/data/testimonials";
import { testimonialPosterSrc, testimonialVideoSrc } from "@/data/testimonials";
import { cn } from "@/lib/utils";

type Props = {
  testimonial: TestimonialVideo;
  className?: string;
};

/** Tall 9:16 video card (≈70% of the screen height) with the name over the bottom of the video. Opaque, so stacked cards fully cover the ones below. */
export function TestimonialVideoCard({ testimonial, className }: Props) {
  const { t } = useTranslation("common");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const src = testimonialVideoSrc(testimonial);
  const poster = testimonialPosterSrc(testimonial);

  const startPlayback = () => {
    const el = videoRef.current;
    if (!el || !src) return;
    setPlaying(true);
    void el.play();
  };

  return (
    <article
      className={cn(
        "relative aspect-[9/16] h-[70svh] max-h-[760px] max-w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] shadow-[0_30px_80px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src || undefined}
        poster={poster}
        controls={playing}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <>
          <button
            type="button"
            onClick={startPlayback}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30 transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            aria-label={`Play ${testimonial.name}'s story`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Play className="h-8 w-8 fill-current ps-0.5" aria-hidden />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-white/90">{t("misc.watchStory")}</span>
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-6 pb-6 pt-16">
            <p className="font-display text-3xl leading-none text-white">{testimonial.name}</p>
          </div>
        </>
      )}
    </article>
  );
}
