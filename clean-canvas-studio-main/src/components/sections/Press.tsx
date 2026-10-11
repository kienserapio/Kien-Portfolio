import { useRef, useState } from "react";
import { useDragScroll } from "@/hooks/useDragScroll";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import SectionHead from "@/components/kit/SectionHead";
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { press, type Press as PressItem } from "@/data/recognition";
import { extras } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Real coverage images come from media.json; everything else gets a typographic tile. */
export const pressImage = (p: PressItem) => extras.press?.[p.id]?.src;

/** One press card. `compact` is the smaller variant used on /events. */
export const PressCard = ({ item, compact = false }: { item: PressItem; compact?: boolean }) => {
  const src = pressImage(item);
  const media = (
    <div className={cn("relative overflow-hidden rounded-2xl", compact ? "aspect-[16/10]" : "aspect-[4/3]")} data-sfx-hover="hoverImage">
      {src ? (
        <img
          src={src}
          alt={`${item.outlet}: ${item.title}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="ph-tile absolute inset-0 flex flex-col justify-between p-5">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink/40">{item.kind} · coverage photo coming soon</span>
          <span
            className={cn("font-hn font-medium leading-[0.95] tracking-[-0.04em]", compact ? "text-3xl" : "text-4xl sm:text-5xl")}
            style={{ color: item.tone ?? "#1d1d1f" }}
          >
            {item.outlet}
          </span>
        </div>
      )}
    </div>
  );

  const meta = (
    <div className="flex flex-col gap-1.5 px-1 pt-4">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
        <span>{item.outlet}</span>
        <span aria-hidden>·</span>
        <span>{item.kind}</span>
        {item.country && (
          <>
            <span aria-hidden>·</span>
            <span>{item.country}</span>
          </>
        )}
      </div>
      <div className={cn("font-hn font-medium leading-snug tracking-[-0.01em] text-ink", compact ? "text-base" : "text-lg")}>
        {item.title}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-ink/50">
        {item.date}
        {item.url && (
          <>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-0.5 text-ink/70">
              Read <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </>
        )}
      </div>
    </div>
  );

  return item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="no-scale group block"
      data-sfx="tap"
      aria-label={`${item.outlet}: ${item.title} (opens in a new tab)`}
    >
      {media}
      {meta}
    </a>
  ) : (
    <div className="group">
      {media}
      {meta}
    </div>
  );
};

/** Home: horizontal shelf of coverage. */
const Press = () => {
  const scroller = useRef<HTMLDivElement>(null);
  useDragScroll(scroller);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  };

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 20), behavior: "smooth" });
  };

  return (
    <section id="press" className="relative z-10 py-28 sm:py-36">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
        <SectionHead
          eyebrow="In the press"
          title="Featured by."
          lede="Radio, articles and features on Wika PH and the languages it teaches, from Manila to Canada."
        />
        <Reveal className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            disabled={edge.start}
            data-sfx="swipe"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-opacity disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            disabled={edge.end}
            data-sfx="swipe"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-opacity disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </Reveal>
      </div>

      <div className="relative mt-12">
        <div
          ref={scroller}
          onScroll={update}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-6 pb-4 scroll-px-6 sm:px-10 sm:scroll-px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
          style={{
            // soft fade on the trailing edge so cards slide out of view
            WebkitMaskImage: edge.end ? undefined : "linear-gradient(to right, #000 85%, transparent)",
            maskImage: edge.end ? undefined : "linear-gradient(to right, #000 85%, transparent)",
          }}
        >
          {press.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="w-[78vw] shrink-0 snap-start sm:w-[360px]">
              <div data-card>
                <PressCard item={p} />
              </div>
            </Reveal>
          ))}
          <div aria-hidden className="w-2 shrink-0" />
        </div>
      </div>

      {/* outlet band that speeds up with the scroll */}
      <ScrollVelocityContainer className="mt-16 select-none font-hn text-4xl font-medium tracking-[-0.03em] text-ink/[0.08] sm:text-6xl" aria-hidden>
        <ScrollVelocityRow baseVelocity={2} direction={-1}>
          {press.map((p) => (
            <span key={p.id} className="mx-8">
              {p.outlet}
            </span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  );
};

export default Press;
