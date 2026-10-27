import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  /** Stat text such as "3×", "90", "30-40" or "35+"; every number in it counts up from 0, the rest stays as is. */
  value: string;
  className?: string;
  duration?: number;
};

/** Counts the numbers in `value` up from 0 once it scrolls into view. Renders the final text without JS or with reduced motion. */
export function CountUpValue({ value, className, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Odd indexes are the numbers: "30-40" → ["", "30", "-", "40", ""]
    const parts = value.split(/(\d+(?:\.\d+)?)/);
    if (parts.length < 2) return;
    const render = (progress: number) => {
      el.textContent = parts
        .map((part, i) => {
          if (i % 2 === 0) return part;
          const decimals = part.split(".")[1]?.length ?? 0;
          return (parseFloat(part) * progress).toFixed(decimals);
        })
        .join("");
    };

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { progress: 0 };
      render(0);
      gsap.to(state, {
        progress: 1,
        duration,
        ease: "power2.out",
        onUpdate: () => render(state.progress),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      return () => {
        el.textContent = value;
      };
    });
    return () => mm.revert();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
