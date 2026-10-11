import { useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import Cta from "@/components/kit/Cta";
import Photo from "@/components/kit/Photo";
import SectionHead from "@/components/kit/SectionHead";
import { talks, type Talk } from "@/data/recognition";
import { extras } from "@/data/projects";
import { EMAIL } from "@/data/profile";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

/** Event photos come from media.json when they exist (e.g. a certificate), else a placeholder. */
export const talkImage = (t: Talk) => extras.awards?.[`${t.id}-cert`]?.src ?? extras.awards?.[t.id]?.src;

export const SPEAK_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Speaking invitation")}&body=${encodeURIComponent(
  "Hi Kien,\n\nWe'd love to invite you to speak at:\n\nEvent:\nDate:\nFormat (keynote / panel / workshop / judging):\nAudience:\n\nThanks!",
)}`;

const KIND_TONE: Record<Talk["kind"], string> = {
  Speaker: "bg-white text-ink",
  Judge: "bg-white/15 text-white",
  Organizer: "bg-white/15 text-white",
};

/** Tall poster card used in the shelf. */
const TalkPoster = ({ talk, onOpen }: { talk: Talk; onOpen: () => void }) => {
  const src = talkImage(talk);
  return (
    <motion.button
      type="button"
      layoutId={`talk-${talk.id}`}
      onClick={onOpen}
      data-sfx="open"
      data-sfx-hover="hoverImage"
      aria-label={`${talk.title}, ${talk.event}. Open details`}
      className="no-scale group relative flex h-[26rem] w-[72vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl bg-ink p-6 text-left text-white sm:h-[30rem] sm:w-[22rem]"
    >
      {src ? (
        <img src={src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_0%,rgba(255,255,255,0.14),transparent_60%),repeating-linear-gradient(135deg,rgba(255,255,255,0.035)_0_10px,transparent_10px_20px)]" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <span className={cn("relative w-fit rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]", KIND_TONE[talk.kind])}>
        {talk.kind}
      </span>
      <div className="relative">
        {!src && <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/35">Event photo coming soon</div>}
        <div className="text-sm text-white/60">{talk.title}</div>
        <div className="mt-1 font-hn text-2xl font-medium leading-tight tracking-[-0.02em] sm:text-[1.75rem]">{talk.event}</div>
        <div className="mt-3 text-sm text-white/55">
          {talk.host} · {talk.date}
        </div>
      </div>
    </motion.button>
  );
};

/** Expanded talk, morphing out of its poster. */
const TalkDetail = ({ talk, onClose }: { talk: Talk; onClose: () => void }) => {
  const reduce = useReducedMotion();
  const src = talkImage(talk);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={talk.event}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        layoutId={reduce ? undefined : `talk-${talk.id}`}
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-4 text-ink shadow-2xl sm:p-6"
        data-lenis-prevent
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          data-sfx="none"
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <Photo src={src} alt={`${talk.event}, ${talk.host}`} ratio="16/9" label="Event photo coming soon" />
        <div className="px-2 pb-2 pt-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
            {talk.kind} · {talk.date}
          </div>
          <h3 className="mt-2 font-hn text-3xl font-medium tracking-[-0.03em] sm:text-4xl">{talk.event}</h3>
          <p className="mt-1 text-ink/60">
            {talk.title}, {talk.host}
          </p>
          {talk.note && <p className="mt-5 text-lg leading-relaxed text-ink/75">{talk.note}</p>}
          {talk.url && (
            <a
              href={talk.url}
              target="_blank"
              rel="noreferrer"
              data-sfx="tap"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Event page <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/** Home: a draggable shelf of talk posters, with the invite CTA in the header. */
const Stage = () => {
  const scroller = useRef<HTMLDivElement>(null);
  useDragScroll(scroller);
  const [active, setActive] = useState<Talk | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const shelf = talks.filter((t) => t.kind !== "Organizer" || t.id === "wika-opening-night" || t.id === "caffeine-ai");

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };
  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("button[data-sfx='open']");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 340) + 16), behavior: "smooth" });
  };
  const close = () => {
    sfx("close");
    setActive(null);
  };

  return (
    <section id="stage" className="relative z-10 py-28 sm:py-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <SectionHead
          eyebrow="On stage"
          title="Talks, judging and the rooms I’ve helped fill."
          lede="Universities, developer communities and launch nights across Luzon."
          action={
            <div className="flex flex-wrap gap-3">
              <Cta href={SPEAK_MAILTO}>Invite me to speak</Cta>
              <Cta to="/events" variant="secondary">
                All events
              </Cta>
            </div>
          }
        />
        <Reveal className="flex shrink-0 gap-2">
          {([-1, 1] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={d < 0 ? "Previous" : "Next"}
              onClick={() => step(d)}
              disabled={d < 0 ? edge.start : edge.end}
              data-sfx="swipe"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-opacity disabled:opacity-30"
            >
              {d < 0 ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          ))}
        </Reveal>
      </div>

      <div
        ref={scroller}
        onScroll={update}
        className="no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 scroll-px-6 sm:px-10 sm:scroll-px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
      >
        {shelf.map((t, i) => (
          <Reveal key={t.id} delay={Math.min(i, 5) * 0.06} className="shrink-0 snap-start">
            <TalkPoster talk={t} onOpen={() => setActive(t)} />
          </Reveal>
        ))}
        <div aria-hidden className="w-2 shrink-0" />
      </div>

      <AnimatePresence>{active && <TalkDetail talk={active} onClose={close} />}</AnimatePresence>
    </section>
  );
};

export default Stage;
