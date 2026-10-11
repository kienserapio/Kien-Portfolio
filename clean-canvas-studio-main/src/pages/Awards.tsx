import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  IconAward,
  IconCalendar,
  IconCrown,
  IconDeviceGamepad2,
  IconMedal,
  IconPencil,
  IconRocket,
  IconTrophy,
  type Icon,
} from "@tabler/icons-react";
import Seo from "@/components/Seo";
import { Reveal, SplitWords } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import Cta from "@/components/kit/Cta";
import { CometCard } from "@/components/ui/comet-card";
import { extras } from "@/data/projects";
import { awards, type Award } from "@/data/recognition";
import { PERSON_ID, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The one warm accent on the page; icons and fine rules only. */
const GOLD = "#b8955a";

const featured = awards.filter((a) => a.featured);
const others = awards.filter((a) => !a.featured);
const years = new Set(awards.map((a) => a.date.match(/\d{4}/)?.[0]).filter(Boolean));

/** Poster-sized label for the featured cards. */
const SHORT: Record<string, string> = {
  ph100: "PH100",
  "devcamp-manila": "1st Runner-Up",
  "founders-live": "1st Place",
  "startup-qc-2026": "Silver",
};

/** An icon by the kind of win. */
const ICON: Record<string, Icon> = {
  ph100: IconCrown,
  "devcamp-manila": IconMedal,
  "founders-live": IconTrophy,
  "startup-qc-2026": IconMedal,
  "ggj-2026": IconDeviceGamepad2,
  "aral-arcade": IconDeviceGamepad2,
  ywca: IconPencil,
  packethacks: IconRocket,
  "startup-qc-2024": IconMedal,
};
const iconFor = (a: Award) => ICON[a.id] ?? IconAward;

/** Images come from media.json extras once added; "devcamp-manila" lives under its dated key. */
const imageFor = (a: Award) =>
  extras.awards?.[a.id]?.src ?? (a.id === "devcamp-manila" ? extras.awards?.["devcamp-manila-2026"]?.src : undefined);

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/awards#list`,
      name: "Awards and recognition of Kien Serapio",
      itemListElement: awards.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${a.title}, ${a.org} (${a.date})`,
        ...(a.url ? { url: a.url } : {}),
      })),
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Kien Serapio",
      award: awards.map((a) => `${a.title}, ${a.org} (${a.date})`),
    },
  ],
};

const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const on = () => setFine(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
};

/** A laurel branch drawn in hairlines; mirrored for the right side. */
const Laurel = ({ flip = false, className }: { flip?: boolean; className?: string }) => (
  <svg viewBox="0 0 120 220" fill="none" aria-hidden className={cn(className, flip && "-scale-x-100")}>
    <path d="M96 214C58 184 34 136 40 78 44 46 58 22 74 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const y = 196 - i * 24;
      const x = 86 - i * 6 + (i > 4 ? (i - 4) * 4 : 0);
      return (
        <g key={i}>
          <path d={`M${x} ${y}c-18-2-30-12-34-26 14 0 28 10 34 26z`} stroke="currentColor" strokeWidth="1" />
          <path d={`M${x} ${y}c4-16 16-26 30-28-2 14-14 24-30 28z`} stroke="currentColor" strokeWidth="1" />
        </g>
      );
    })}
  </svg>
);

/** Featured win: image as the full-bleed background (like the On stage cards), comet tilt on desktop. */
const FeaturedCard = ({ award }: { award: Award }) => {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const Glyph = iconFor(award);
  const src = imageFor(award);
  const card = (
    <div className="group relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-[1.6rem] bg-ink p-6 text-white sm:aspect-[5/6] sm:p-8" data-sfx-hover="hoverImage">
      {src ? (
        <img src={src} alt={`${award.title}, ${award.org}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      ) : (
        <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_80%_at_50%_0%,#2c2c2e_0%,#1d1d1f_60%)]">
          <Glyph size={120} stroke={0.8} style={{ color: GOLD }} className="opacity-40" />
        </div>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
          <Glyph size={16} stroke={1.6} style={{ color: GOLD }} aria-hidden />
          {award.date}
        </div>
        <div className="mt-3 font-hn text-5xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl">{SHORT[award.id] ?? award.title}</div>
        <div className="mt-3 text-white/75">
          {award.title.startsWith("PH100 ") ? `${award.title.slice(6)} · ${award.org}` : award.org}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
          {award.project ? <span className="text-sm text-white/70">{award.project}</span> : <span />}
          {award.url && <ArrowUpRight className="h-4 w-4 text-white/70" aria-hidden />}
        </div>
      </div>
    </div>
  );
  const tilted = fine && !reduce ? <CometCard className="w-full">{card}</CometCard> : card;
  return award.url ? (
    <a href={award.url} target="_blank" rel="noreferrer" data-sfx="tap" className="no-scale block" aria-label={`${award.title}, ${award.org} (opens in a new tab)`}>
      {tilted}
    </a>
  ) : (
    tilted
  );
};

/** Every other win: a refined row with its icon, hairline dividers between. */
const Row = ({ award, i }: { award: Award; i: number }) => {
  const Glyph = iconFor(award);
  const inner = (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-5 gap-y-1 py-7 sm:grid-cols-[3rem_6rem_1fr_auto] sm:items-baseline sm:gap-x-8">
      <span className="row-span-3 flex h-10 w-10 items-center justify-center rounded-full border sm:row-span-1 sm:h-12 sm:w-12" style={{ borderColor: `${GOLD}55` }}>
        <Glyph size={20} stroke={1.5} style={{ color: GOLD }} aria-hidden />
      </span>
      <span className="text-sm tabular-nums text-ink/40">
        {String(i + 1).padStart(2, "0")} · {award.date}
      </span>
      <div>
        <h3 className="font-hn text-xl font-medium leading-tight tracking-[-0.02em] text-ink sm:text-2xl">{award.title}</h3>
        <p className="mt-1 text-ink/60">{award.org}</p>
        {(award.project || award.note) && (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/50">
            {award.project && <span className="font-medium text-ink/70">{award.project}. </span>}
            {award.note}
          </p>
        )}
      </div>
      {award.url ? (
        <span className="col-start-2 mt-2 inline-flex items-center gap-1 text-sm font-medium text-ink sm:col-start-auto sm:mt-0">
          Source <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      ) : (
        <span className="hidden sm:block" />
      )}
    </div>
  );
  return award.url ? (
    <a href={award.url} target="_blank" rel="noreferrer" data-sfx="tap" className="no-scale block transition-colors hover:bg-ink/[0.02]" aria-label={`${award.title}, ${award.org} (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
};

const STATS: { value: number; label: string; Glyph: Icon }[] = [
  { value: awards.length, label: "awards & honors", Glyph: IconTrophy },
  { value: featured.length, label: "won with Wika PH", Glyph: IconMedal },
  { value: 1, label: "national recognition: PH100", Glyph: IconCrown },
  { value: years.size, label: "years of wins", Glyph: IconCalendar },
];

const Awards = () => (
  <main className="relative z-10 pb-40 pt-24 sm:pt-28">
    <Seo
      title="Awards — Kien Serapio"
      description="Awards and recognition of Kien Serapio: StellarPH PH100 Brightest Minds Under 30, 1st Runner-Up at Developer Camp Manila 2026, 1st Place at Founders Live Manila and Silver at StartUp QC 2026."
      path="/awards"
      jsonLd={JSON_LD}
    />

    {/* Hero: on the page's own background, laurels and gold rule kept */}
    <section className="relative text-ink">
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-20 text-center sm:pb-28 sm:pt-28">
        <Laurel className="pointer-events-none absolute left-[2%] top-1/2 h-[70%] -translate-y-1/2 text-ink opacity-[0.16] sm:left-[8%]" />
        <Laurel flip className="pointer-events-none absolute right-[2%] top-1/2 h-[70%] -translate-y-1/2 text-ink opacity-[0.16] sm:right-[8%]" />
        <span style={{ color: GOLD }}>
          <IconCrown size={28} stroke={1.3} aria-hidden />
        </span>
        <Reveal y={10} className="mt-5 text-[11px] font-medium uppercase tracking-[0.32em] text-ink/50">
          Awards &amp; honors
        </Reveal>
        <SplitWords
          as="h1"
          immediate
          text="Wins, and the work behind them."
          className="mt-5 max-w-3xl font-hn text-[2.6rem] font-medium leading-[1.02] tracking-[-0.04em] sm:text-7xl"
        />
        <Reveal delay={0.15} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
          National recognition, pitch nights, startup competitions, hackathons and game jams.
        </Reveal>
        <div aria-hidden className="mt-12 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
      </div>
    </section>

    <div className="mx-auto max-w-7xl px-6 sm:px-10">
      {/* Stats */}
      <Reveal className="mt-16 grid grid-cols-2 gap-y-10 border-y border-ink/10 py-10 sm:grid-cols-4">
        {STATS.map(({ value, label, Glyph }, i) => (
          <div key={label} className={cn("px-2 sm:px-6", i > 0 && "sm:border-l sm:border-ink/10")}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full border" style={{ borderColor: `${GOLD}55` }}>
              <Glyph size={20} stroke={1.5} style={{ color: GOLD }} aria-hidden />
            </span>
            <div className="mt-5 font-hn text-5xl font-medium tracking-[-0.04em] text-ink">
              <CountUp value={value} />
            </div>
            <div className="mt-1 text-sm text-ink/55">{label}</div>
          </div>
        ))}
      </Reveal>

      {/* Featured */}
      <section aria-labelledby="featured-awards" className="mt-24">
        <div className="flex items-center gap-4">
          <span aria-hidden className="h-px w-8" style={{ background: GOLD }} />
          <h2 id="featured-awards" className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink/60">
            Highest honors
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featured.map((a, i) => (
            <Reveal key={a.id} delay={(i % 2) * 0.08}>
              <FeaturedCard award={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* The rest */}
      <section aria-labelledby="more-awards" className="mt-28">
        <div className="flex items-center gap-4">
          <span aria-hidden className="h-px w-8" style={{ background: GOLD }} />
          <h2 id="more-awards" className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink/60">
            More wins
          </h2>
        </div>
        <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {others.map((a, i) => (
            <Reveal key={a.id} delay={0.04} y={14}>
              <Row award={a} i={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <motion.div className="mt-24 flex flex-wrap gap-3">
        <Cta to="/events">See where I’ve spoken</Cta>
        <Cta to="/work" variant="secondary">
          The work behind them
        </Cta>
      </motion.div>
    </div>
  </main>
);

export default Awards;
