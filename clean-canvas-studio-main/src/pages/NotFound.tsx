import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Seo from "@/components/Seo";
import { Cta } from "@/components/kit/Cta";
import { sfx } from "@/lib/sound";

/**
 * "This page got lost", in the languages Wika teaches. Word forms checked
 * against the Dialecto dictionary (nawala / napukaw / nadula; pahina / panid).
 */
const LOST = [
  { lang: "Tagalog", text: "Nawala ang pahina." },
  { lang: "Cebuano", text: "Nawala ang panid." },
  { lang: "Ilocano", text: "Napukaw ti panid." },
  { lang: "Hiligaynon", text: "Nadula ang pahina." },
  { lang: "English", text: "This page got lost." },
];

/** One draggable, springy digit. Toss it around; it always comes home. */
const Digit = ({ ch, i }: { ch: string; i: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.span
      drag={!reduce}
      dragSnapToOrigin
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 380, bounceDamping: 14 }}
      onDragStart={() => sfx("pop")}
      onDragEnd={() => sfx("error", { volume: 0.6 })}
      whileHover={reduce ? undefined : { y: -12, rotate: i === 1 ? 8 : -6 }}
      whileDrag={{ scale: 1.08, rotate: i % 2 ? 10 : -10, cursor: "grabbing" }}
      initial={reduce ? false : { y: "60%", opacity: 0, rotate: i === 1 ? -20 : 12 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", bounce: 0.45, visualDuration: 0.7, delay: 0.1 + i * 0.09 }}
      className="inline-block cursor-grab touch-none select-none"
      data-hover
      data-sfx-hover="pop"
    >
      {ch}
    </motion.span>
  );
};

const NotFound = () => {
  const location = useLocation();
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  const timer = useRef<number>();

  useEffect(() => {
    console.warn("404:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (reduce) return;
    timer.current = window.setInterval(() => setN((x) => (x + 1) % LOST.length), 2200);
    return () => window.clearInterval(timer.current);
  }, [reduce]);

  const phrase = LOST[n];

  return (
    <main className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-28 text-center">
      <Seo title="Page not found — Kien Serapio" description="This page got lost in translation." path={location.pathname} noIndex />

      <div className="eyebrow">Error 404 · Lost in translation</div>

      <h1 className="mt-6 font-hn text-[clamp(8rem,34vw,22rem)] font-medium leading-[0.8] tracking-[-0.07em] text-ink" aria-label="404">
        {"404".split("").map((ch, i) => (
          <Digit key={i} ch={ch} i={i} />
        ))}
      </h1>

      <div className="mt-10 h-[5.5rem] sm:h-24" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={phrase.text}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="font-hn text-3xl font-medium tracking-[-0.03em] sm:text-5xl">{phrase.text}</p>
            <p className="mt-2 text-sm text-ink/45">{phrase.lang}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-6 max-w-md text-ink/60">
        Whatever you were looking for isn’t here. Toss the numbers around if you like, then let’s get you somewhere useful.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Cta to="/">Take me home</Cta>
        <Cta to="/work" variant="secondary">
          See my work
        </Cta>
      </div>
    </main>
  );
};

export default NotFound;
