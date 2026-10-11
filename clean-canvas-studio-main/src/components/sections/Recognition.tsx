import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { CometCard } from "@/components/ui/comet-card";
import { Reveal } from "@/components/fx/Reveal";
import Cta from "@/components/kit/Cta";
import SectionHead from "@/components/kit/SectionHead";
import { awards, type Award } from "@/data/recognition";
import { extras } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Award photos come from media.json once the real image exists; otherwise a placeholder. */
const AWARD_MEDIA: Record<string, string> = {
  "devcamp-manila": "devcamp-manila-2026",
};
export const awardImage = (a: Award) => {
  const key = AWARD_MEDIA[a.id] ?? a.id;
  return extras.awards?.[key]?.src;
};

/** Short, poster-sized label for the comet cards. */
const SHORT: Record<string, string> = {
  ph100: "PH100",
  "devcamp-manila": "1st Runner-Up",
  "founders-live": "1st Place",
  "startup-qc-2026": "Silver",
};

/** Tilt only where there's a real mouse; touch gets a flat card. */
export const useFinePointer = () => {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    setFine(mq.matches);
    const on = () => setFine(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
};

const Tilt = ({ children, className }: { children: ReactNode; className?: string }) => {
  const fine = useFinePointer();
  return fine ? (
    // v3 has no perspective utilities, so the 3D context is set with arbitrary properties
    <CometCard rotateDepth={10} translateDepth={10} className={cn("[perspective:1000px] [transform-style:preserve-3d]", className)}>
      {children}
    </CometCard>
  ) : (
    <div className={className}>{children}</div>
  );
};

/** One featured award as a comet card, styled like the On stage posters: photo as the background. */
export const AwardCard = ({ award, large = false }: { award: Award; dark?: boolean; large?: boolean }) => {
  const src = awardImage(award);
  const body = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-ink p-6 text-white",
        large ? "min-h-[30rem]" : "min-h-[26rem] sm:min-h-[28rem]",
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(255,255,255,0.14),transparent_60%),repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_10px,transparent_10px_20px)]"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

      <div className="relative flex items-center justify-between gap-3">
        {award.project ? (
          <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
            {award.project}
          </span>
        ) : (
          <span />
        )}
        {award.url && <ArrowUpRight className="h-4 w-4 text-white/70" />}
      </div>

      <div className="relative">
        {!src && <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/35">Award photo coming soon</div>}
        <div className="text-sm text-white/60">{award.date}</div>
        <div className={cn("mt-1 font-hn font-medium leading-none tracking-[-0.03em]", large ? "text-5xl" : "text-[2.4rem]")}>
          {SHORT[award.id] ?? award.title}
        </div>
        <div className="mt-3 text-sm text-white/65">
          {/* the big label already says the placing; this line says where */}
          {award.title.startsWith("PH100 ") ? `${award.title.slice(6)} · ${award.org}` : award.org}
        </div>
      </div>
    </div>
  );

  return (
    <Tilt className="h-full">
      {award.url ? (
        <a
          href={award.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${award.title}, ${award.org} (opens in a new tab)`}
          className="no-scale group block h-full"
          data-sfx="tap"
          data-sfx-hover="hoverImage"
        >
          {body}
        </a>
      ) : (
        <div className="group h-full" data-hover data-sfx-hover="hoverImage">
          {body}
        </div>
      )}
    </Tilt>
  );
};

export const featuredAwards = awards.filter((a) => a.featured);

/** Home: the four wins that matter most, as comet cards. */
const Recognition = () => (
  <section id="recognition" className="relative z-10 mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-36">
    <SectionHead
      eyebrow="Recognition"
      title="Recognized for building what matters."
      lede="Each of these came from building Wika PH: a national recognition, a pitch-night win, a startup-competition silver and a hackathon podium."
    />
    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {featuredAwards.map((a, i) => (
        <Reveal key={a.id} delay={i * 0.08} className="h-full">
          <AwardCard award={a} />
        </Reveal>
      ))}
    </div>
    <Reveal className="mt-12 flex justify-center sm:justify-start">
      <Cta to="/awards" variant="secondary">
        All awards
      </Cta>
    </Reveal>
  </section>
);

export default Recognition;
