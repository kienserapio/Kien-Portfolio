import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { sfx } from "@/lib/sound";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts 0 → value once when scrolled into view. Writes straight to the DOM
 * (no React re-render per frame) and ticks softly as the digits roll.
 */
export const CountUp = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  ticks = true,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  /** Play the `count` cue while rolling. */
  ticks?: boolean;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const final = `${prefix}${fmt(value, decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!inView || reduce || !el) return;
    let lastTick = 0;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${prefix}${fmt(v, decimals)}${suffix}`;
        const now = performance.now();
        // ticks thin out as the roll decelerates
        if (ticks && v < value * 0.97 && now - lastTick > 70) {
          lastTick = now;
          sfx("count", { volume: 0.5 });
        }
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, prefix, suffix, decimals, duration, ticks]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} aria-label={final}>
      {reduce ? final : `${prefix}${fmt(0, decimals)}${suffix}`}
    </span>
  );
};
