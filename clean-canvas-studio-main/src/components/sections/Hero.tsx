import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { NAME, ROLES } from "@/data/profile";

/** ms → inline animation-delay */
const at = (ms: number) => ({ animationDelay: `${ms}ms` });

/**
 * "Kien Serapio •" as individually rising letters. Every copy is identical
 * (same glyphs, same bullet, same gaps) so the marquee seam is invisible.
 */
const Name = ({ hidden = false, offset = 0 }: { hidden?: boolean; offset?: number }) => (
  <span className="flex shrink-0 items-center [perspective:800px]" aria-hidden={hidden || undefined}>
    {NAME.split("").map((ch, i) => (
      <span key={i} className="letter-rise" style={at(offset + 160 + i * 42)}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
    <span
      aria-hidden
      className="letter-rise mx-[0.32em] inline-block h-[0.1em] w-[0.1em] rounded-full bg-ink/25"
      style={at(offset + 160 + NAME.length * 42)}
    />
  </span>
);

/** The gray roles line, "Founder • AI Engineer • …", repeated for a seamless loop. */
const RolesRun = ({ hidden = false }: { hidden?: boolean }) => (
  <span className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
    {ROLES.map((r) => (
      <Fragment key={r}>
        <span>{r}</span>
        <span className="mx-[0.9em] text-ink/20">•</span>
      </Fragment>
    ))}
  </span>
);

/**
 * Hero. Load sequence (no preloader): greeting → letters rise → portrait lifts
 * out of a blur → roles slide in the opposite direction → footer + island.
 * On scroll the name and roles drift apart and the portrait sinks slower than
 * the page, for depth.
 */
const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-18%"]);
  const rolesX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "14%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.06]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-[100svh] min-h-[560px] w-full overflow-hidden text-ink">
      <h1 className="sr-only">Kien Serapio: Founder of Wika PH, AI Engineer and Software Developer</h1>

      {/* Greeting + name + roles, all behind the portrait */}
      <div className="absolute inset-x-0 top-[13svh] z-10 sm:top-[12svh]">
        <p className="anim-fade-up px-6 font-hn text-base text-ink/55 sm:px-10 sm:text-xl" style={at(80)}>
          <span className="anim-wave mr-1.5">Kumusta?</span> I’m
        </p>

        <motion.div style={{ x: nameX }} className="mt-1 overflow-hidden sm:-mt-1">
          <div className="marquee flex w-max whitespace-nowrap pb-[0.08em] [animation-duration:44s] font-hn text-[17vw] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[19vh] lg:text-[23vh]">
            {/* two identical halves of two names each: wider than any screen */}
            <Name />
            <Name hidden offset={120} />
            <Name hidden offset={240} />
            <Name hidden offset={360} />
          </div>
        </motion.div>

        <motion.div style={{ x: rolesX }} className="anim-fade-up overflow-hidden" data-hover-silent>
          <div
            className="marquee-reverse flex w-max whitespace-nowrap font-hn text-lg tracking-[-0.01em] text-ink/40 sm:text-2xl lg:text-[1.7rem]"
            style={{ animationDuration: "38s" }}
          >
            <RolesRun />
            <RolesRun hidden />
            <RolesRun hidden />
            <RolesRun hidden />
          </div>
        </motion.div>
      </div>

      {/* Portrait: tall enough that the head reaches the top of the name */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
        style={{ y: portraitY, scale: portraitScale, transformOrigin: "50% 100%" }}
      >
        <img
          src="/kien-cutout.webp"
          alt="Portrait of Kien Serapio"
          width={1180}
          height={1130}
          {...{ fetchpriority: "high" }}
          decoding="async"
          className="anim-portrait h-[86svh] w-auto max-w-none object-contain object-bottom sm:h-[90svh]"
          style={{
            ...at(380),
            WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 97%)",
            maskImage: "linear-gradient(to bottom, #000 62%, transparent 97%)",
          }}
        />
      </motion.div>

      {/* Footer */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-24 font-hn text-xs leading-relaxed text-ink/70 sm:px-10 sm:pb-9 sm:text-sm"
      >
        <div className="anim-fade-up" style={at(1250)}>
          <div className="text-ink">Founder &amp; CEO, Wika PH</div>
          <div>AI Engineer &amp; Software Developer</div>
          <div>Quezon City, Philippines</div>
        </div>
        <div className="anim-fade-up hidden text-right sm:block" style={at(1380)}>
          <div className="text-ink">PH100 2026</div>
          <div>Brightest Minds Under 30</div>
          <div className="mt-2 inline-flex items-center gap-2 text-ink/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink/70" />
            </span>
            Scroll
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
