import { motion, useReducedMotion } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Blur-in is lovely on desktop and costly on phones; decide once. */
const BLUR =
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "blur(6px)" : "blur(0px)";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span" | "h2" | "h3";
};

/** Slide-in on scroll. Fades + rises from slightly blurred; once only. */
export const Reveal = ({ children, delay = 0, y = 36, className, as = "div" }: RevealProps) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;
  return (
    <Tag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: BLUR }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
};

type SplitProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  /** Run on mount instead of when scrolled into view. */
  immediate?: boolean;
};

/** Word-by-word mask reveal for headings. */
export const SplitWords = ({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as = "h2",
  immediate = false,
}: SplitProps) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag
      className={className}
      initial="hide"
      {...trigger}
      transition={{ staggerChildren: reduce ? 0 : stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        // extra bottom room (offset by the negative margin) so descenders like
        // p/g/y aren't clipped on tight leading
        <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.24em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{
              hide: reduce ? { opacity: 0 } : { y: "108%", rotate: 3 },
              show: reduce ? { opacity: 1 } : { y: "0%", rotate: 0 },
            }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
};

/** Small uppercase section label with a line that draws in. */
export const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <Reveal className={`flex items-center gap-3 ${className}`} y={12}>
    <span className="h-px w-8 bg-ink" />
    <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink/60">
      {children}
    </span>
  </Reveal>
);
