import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Briefcase, Rocket, Sparkles, WifiOff } from "lucide-react";
import SectionHead from "@/components/kit/SectionHead";
import Cta from "@/components/kit/Cta";
import Device from "@/components/kit/Device";
import Photo from "@/components/kit/Photo";
import ProjectLogo from "@/components/kit/ProjectLogo";
import { Reveal } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import { WobbleCard } from "@/components/ui/wobble-card";
import { getLenis } from "@/lib/lenis";
import { flagships, mediaFor, projects, type Category, type Project } from "@/data/projects";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Cover (or first image / Dialecto's demo video) for a project's mockup. */
const shotFor = (p: Project) => {
  const m = mediaFor(p.slug);
  return { src: m.cover ?? m.images[0]?.src, video: m.video?.src };
};

const Stats = ({ p, ticks = false }: { p: Project; ticks?: boolean }) =>
  p.impact.length ? (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
      {p.impact.slice(0, 3).map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-hn text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
            <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} ticks={ticks} />
          </dd>
          <dd className="mt-1 text-[13px] leading-snug text-ink/55">{s.label}</dd>
        </div>
      ))}
    </dl>
  ) : null;

const Meta = ({ p }: { p: Project }) => (
  <p className="text-[13px] text-ink/50">
    {p.role} <span className="mx-1.5 text-ink/25">·</span> {p.status}
  </p>
);

const Mockup = ({ p, className }: { p: Project; className?: string }) => {
  const { src, video } = shotFor(p);
  if (!src && !video) return <Photo alt={`${p.name} screenshot`} ratio={p.device === "phone" ? "9/19" : "16/10"} className={className} label="Screens coming soon" />;
  return <Device kind={p.device} src={src} videoSrc={video} url={p.urlLabel} className={className} />;
};

// ------------------------------------------------- Desktop: sticky story

const Story = () => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const n = flagships.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  // jump to a project from the rail
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const y = top + ((i + 0.5) / n) * travel;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const p = flagships[active];
  const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(10px)" };
  const exit = reduce ? { opacity: 0 } : { opacity: 0, y: -24, filter: "blur(10px)" };

  return (
    <div ref={ref} className="relative hidden md:block" style={{ height: `${n * 95 + 20}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-12 px-10 lg:gap-16">
          {/* Copy */}
          <div className="relative min-h-[26rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.slug}
                initial={enter}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                exit={exit}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-hn text-sm tabular-nums text-ink/35">0{active + 1}</span>
                  <Meta p={p} />
                </div>
                <div className="flex items-center gap-4">
                  <ProjectLogo slug={p.slug} name={p.name} className="h-14 w-14 shadow-[0_10px_24px_-12px_rgba(29,29,31,0.35)]" />
                  <h3 className="font-hn text-5xl font-medium tracking-[-0.04em] text-ink lg:text-6xl">{p.name}</h3>
                </div>
                <p className="max-w-md text-lg leading-relaxed text-ink/60">{p.tagline}</p>
                {p.pull && <p className="max-w-md text-[15px] leading-relaxed text-ink">{p.pull}</p>}
                <Stats p={p} />
                <div>
                  <Cta to={`/work/${p.slug}`} variant="secondary">
                    Read the story
                  </Cta>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Device */}
          <div className="relative flex h-[72vh] items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.slug}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03, y: -30, filter: "blur(12px)" }}
                transition={{ duration: 0.55, ease: EASE }}
                className={p.device === "phone" ? "w-[min(17rem,30vh)]" : "w-full"}
              >
                <Link to={`/work/${p.slug}`} aria-label={`${p.name} case study`} data-sfx="navigate" className="no-scale block">
                  <Mockup p={p} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress rail */}
        <nav aria-label="Flagship projects" className="absolute bottom-28 left-1/2 w-[min(56rem,calc(100%-5rem))] -translate-x-1/2">
          <div className="relative mb-3 h-px w-full bg-ink/10">
            <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-ink" style={{ scaleX: bar }} />
          </div>
          <ol className="grid grid-cols-6 gap-2">
            {flagships.map((f, i) => (
              <li key={f.slug}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  data-sfx="tap"
                  className={`no-scale w-full truncate text-left text-[12px] transition-colors duration-300 ${
                    i === active ? "text-ink" : "text-ink/35 hover:text-ink/70"
                  }`}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

// ---------------------------------------------------- Mobile: stacked

const Stack = () => (
  <ol className="flex flex-col gap-20 px-4 md:hidden">
    {flagships.map((p, i) => (
      <li key={p.slug}>
        <Reveal className="flex flex-col gap-6">
          <Link
            to={`/work/${p.slug}`}
            aria-label={`${p.name} case study`}
            data-sfx="navigate"
            className={`no-scale mx-auto block ${p.device === "phone" ? "w-[62%]" : "w-full"}`}
          >
            <Mockup p={p} />
          </Link>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="font-hn text-sm tabular-nums text-ink/35">0{i + 1}</span>
              <Meta p={p} />
            </div>
            <div className="flex items-center gap-3">
              <ProjectLogo slug={p.slug} name={p.name} className="h-11 w-11" />
              <h3 className="font-hn text-4xl font-medium tracking-[-0.04em] text-ink">{p.name}</h3>
            </div>
            <p className="text-base leading-relaxed text-ink/60">{p.tagline}</p>
            {p.pull && <p className="text-[15px] leading-relaxed text-ink">{p.pull}</p>}
          </div>
          <Stats p={p} />
          <div>
            <Cta to={`/work/${p.slug}`} variant="secondary">
              Read the story
            </Cta>
          </div>
        </Reveal>
      </li>
    ))}
  </ol>
);

// ------------------------------------------------------- Bento teaser
//
// A feature grid: each cell is a small looping visual (pure SVG/CSS, so it
// costs nothing when idle), faded into the card, then an icon + header.

/** Agents passing work along a graph: pulses travel the edges into a core. */
const VizAgents = () => {
  const nodes = [
    [60, 40],
    [60, 120],
    [170, 80],
    [300, 30],
    [300, 130],
    [420, 80],
  ] as const;
  const edges = [
    [0, 2],
    [1, 2],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ] as const;
  return (
    <svg viewBox="0 0 480 160" className="h-full w-full" aria-hidden>
      {edges.map(([a, b], i) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        const d = `M${x1} ${y1} L${x2} ${y2}`;
        return (
          <g key={i}>
            <path d={d} stroke="rgba(29,29,31,0.14)" strokeWidth="1.5" fill="none" />
            <circle r="3.5" fill="#1d1d1f">
              <animateMotion dur={`${2 + (i % 3) * 0.5}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        );
      })}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 2 ? 18 : 10} fill="#fff" stroke="rgba(29,29,31,0.2)" />
          {i === 2 && <circle cx={x} cy={y} r="18" fill="none" stroke="#1d1d1f" className="bento-ping" style={{ transformOrigin: `${x}px ${y}px` }} />}
          <circle cx={x} cy={y} r={i === 2 ? 6 : 3.5} fill="#1d1d1f" />
        </g>
      ))}
    </svg>
  );
};

/** Client products: a few app windows drifting in a stack. */
const VizWindows = () => (
  <div className="relative h-full w-full" aria-hidden>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="bento-float absolute rounded-xl border border-ink/10 bg-white shadow-[0_12px_30px_-14px_rgba(29,29,31,0.35)]"
        style={{
          left: `${12 + i * 18}%`,
          top: `${14 + i * 14}%`,
          width: "52%",
          height: "62%",
          animationDelay: `${i * -1.3}s`,
          zIndex: i,
        }}
      >
        <div className="flex gap-1 border-b border-ink/5 px-2.5 py-2">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          ))}
        </div>
        <div className="space-y-1.5 p-2.5">
          <div className="h-1.5 w-2/3 rounded-full bg-ink/15" />
          <div className="h-1.5 w-1/2 rounded-full bg-ink/10" />
          <div className="mt-2 h-6 rounded-md bg-ink/[0.06]" />
        </div>
      </div>
    ))}
  </div>
);

/** Products & community: usage bars that keep growing. */
const VizBars = () => (
  <div className="flex h-full w-full items-end justify-center gap-2.5 px-8 pb-2" aria-hidden>
    {[38, 52, 46, 64, 58, 76, 70, 88, 82, 96].map((h, i) => (
      <span
        key={i}
        className="bento-bar w-full max-w-[22px] origin-bottom rounded-t-md bg-ink/80"
        style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
      />
    ))}
  </div>
);

/** Offline-first: a signal that drops, while the app keeps working. */
const VizOffline = () => (
  <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="bento-ripple absolute h-24 w-24 rounded-full border border-ink/20"
        style={{ animationDelay: `${i * 0.9}s` }}
      />
    ))}
    <div className="relative flex h-[84%] w-[22%] min-w-[64px] flex-col gap-1.5 rounded-[14px] border-[3px] border-ink bg-white p-2">
      <div className="h-1.5 w-1/2 rounded-full bg-ink/20" />
      <div className="h-1.5 w-3/4 rounded-full bg-ink/10" />
      <div className="mt-auto h-5 rounded-md bg-ink" />
    </div>
  </div>
);

const TEASE: {
  title: string;
  blurb: string;
  Icon: typeof Sparkles;
  Viz: () => JSX.Element;
  to: string;
  count?: number;
  span: string;
}[] = [
  {
    title: "AI systems",
    blurb: "Agents, retrieval and on-device models. The AI interprets; tested code does the math.",
    Icon: Sparkles,
    Viz: VizAgents,
    to: `/work?c=${encodeURIComponent("AI systems")}`,
    count: projects.filter((p) => p.category === "AI systems" || p.ai).length,
    span: "lg:col-span-4",
  },
  {
    title: "Client work",
    blurb: "Web and mobile products for businesses in Australia and the Philippines.",
    Icon: Briefcase,
    Viz: VizWindows,
    to: `/work?c=${encodeURIComponent("Client work")}`,
    count: projects.filter((p) => p.category === "Client work").length,
    span: "lg:col-span-2",
  },
  {
    title: "Products & community",
    blurb: "Built because people needed them: fans, a nationwide developer community, a game jam.",
    Icon: Rocket,
    Viz: VizBars,
    to: `/work?c=${encodeURIComponent("Products & community")}`,
    count: projects.filter((p) => p.category === "Products & community").length,
    span: "lg:col-span-3",
  },
  {
    title: "Offline-first",
    blurb: "Classrooms, warehouses and campuses with bad signal. The work keeps going, then syncs.",
    Icon: WifiOff,
    Viz: VizOffline,
    to: "/work",
    span: "lg:col-span-3",
  },
];

const Bento = () => (
  <div className="mx-auto mt-24 grid max-w-6xl grid-cols-1 gap-4 px-4 sm:px-10 lg:mt-32 lg:grid-cols-6">
    {TEASE.map((t, i) => (
      <Reveal key={t.title} delay={i * 0.06} className={t.span}>
        <Link to={t.to} data-sfx="navigate" data-sfx-hover="hoverImage" className="no-scale group block h-full">
          <WobbleCard containerClassName="h-full bg-[#f5f5f7] ring-1 ring-ink/5" className="flex h-full flex-col p-0 sm:p-0">
            {/* visual, faded into the card from the bottom */}
            <div className="relative h-48 overflow-hidden sm:h-56">
              <t.Viz />
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5f5f7]/0 via-[#f5f5f7]/20 to-[#f5f5f7]" />
            </div>
            <div className="relative flex flex-1 flex-col gap-2 px-6 pb-7 sm:px-8 sm:pb-8">
              <div className="flex items-center gap-2.5 text-ink">
                <t.Icon className="h-5 w-5" strokeWidth={1.75} />
                <h3 className="font-hn text-xl font-medium tracking-[-0.02em] sm:text-2xl">{t.title}</h3>
                <ArrowUpRight className="ml-auto h-5 w-5 text-ink/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink/60" />
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-ink/60">{t.blurb}</p>
              {t.count ? <span className="mt-auto pt-3 text-[12px] uppercase tracking-[0.18em] text-ink/40">{t.count} projects</span> : null}
            </div>
          </WobbleCard>
        </Link>
      </Reveal>
    ))}
  </div>
);

/** Home: the flagships as a scroll story, then the rest of the work as a bento. */
const Work = () => (
  <section id="work" className="relative z-10 py-28 sm:py-36">
    <div className="mx-auto max-w-6xl px-4 sm:px-10">
      <SectionHead
        eyebrow="Impact"
        title="Every person, team and company I’ve impacted."
        lede="Six products I’m proudest of: who they’re for, what changed, and the numbers that prove it."
      />
    </div>

    <div className="mt-16 md:mt-4">
      <Story />
      <Stack />
    </div>

    <Bento />

    <div className="mt-14 flex justify-center px-4">
      <Cta to="/work">See all work</Cta>
    </div>
  </section>
);

export default Work;
