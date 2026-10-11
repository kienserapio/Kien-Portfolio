import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  IconBookmark,
  IconDots,
  IconGavel,
  IconHeart,
  IconMessageCircle,
  IconMicrophone2,
  IconRosetteDiscountCheckFilled,
  IconSend,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import Cta from "@/components/kit/Cta";
import Photo from "@/components/kit/Photo";
import SectionHead from "@/components/kit/SectionHead";
import { openCv } from "@/components/CvModal";
import { EMAIL } from "@/data/profile";
import { extras } from "@/data/projects";
import { press, SPEAKING_TOPICS, talks, type Press, type Talk, type TalkKind } from "@/data/recognition";
import { PERSON_ID, SITE_URL } from "@/lib/site";

const FILTERS: ("All" | TalkKind)[] = ["All", "Speaker", "Judge", "Organizer"];
const FORMATS = ["Keynote", "Panel", "Workshop", "Hackathon judging"];

const KIND_ICON: Record<TalkKind, Icon> = { Speaker: IconMicrophone2, Judge: IconGavel, Organizer: IconUsers };

const SPEAK_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent("Speaking invitation")}&body=${encodeURIComponent(
  "Hi Kien,\n\nWe'd love to invite you to speak at our event.\n\nEvent:\nDate:\nAudience:\nTopic:\n\nThank you!",
)}`;

/** Photos come from media.json extras once they exist (certificates count). */
const talkImage = (t: Talk) => extras.awards?.[`${t.id}-cert`]?.src ?? extras.awards?.[t.id]?.src;
const pressImage = (p: Press) => extras.press?.[p.id]?.src;

const MONTHS: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sept: "09", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};
/** "Sept 2026" → "2026-09"; bare years return null (not precise enough for an Event). */
const isoMonth = (d: string) => {
  const m = d.match(/^([A-Za-z]+)\s+(\d{4})$/);
  return m && MONTHS[m[1]] ? `${m[2]}-${MONTHS[m[1]]}` : null;
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/events#list`,
  name: "Talks, judging and events by Kien Serapio",
  itemListElement: talks.map((t, i) => {
    const start = isoMonth(t.date);
    const item = start
      ? {
          "@type": "Event",
          name: t.event,
          startDate: start,
          organizer: { "@type": "Organization", name: t.host },
          performer: { "@id": PERSON_ID },
          ...(t.url ? { url: t.url } : {}),
        }
      : {
          "@type": "CreativeWork",
          name: `${t.title}, ${t.event}`,
          publisher: { "@type": "Organization", name: t.host },
          creator: { "@id": PERSON_ID },
        };
    return { "@type": "ListItem", position: i + 1, item };
  }),
};

/** "José Rizal University" → "JR"; skips filler words. */
const monogram = (host: string) =>
  host
    .split(/[\s·×–-]+/)
    .filter((w) => /^[A-Z]/.test(w) && !["The", "Of", "On", "And"].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** A talk, dressed as a social post: avatar + host, photo, caption, action row. */
const Post = ({ talk }: { talk: Talk }) => {
  const reduce = useReducedMotion();
  const KindIcon = KIND_ICON[talk.kind];
  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", bounce: 0.3, visualDuration: 0.35 }}
      className="group overflow-hidden rounded-[1.6rem] border border-ink/10 bg-white shadow-[0_1px_0_rgba(29,29,31,0.04),0_24px_60px_-40px_rgba(29,29,31,0.45)]"
    >
      {/* header */}
      <header className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-medium tracking-wide text-white ring-2 ring-white ring-offset-1 ring-offset-ink/10">
          {monogram(talk.host) || "K"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm font-medium text-ink">
            <span className="truncate">{talk.host}</span>
            {talk.url && <IconRosetteDiscountCheckFilled size={15} className="shrink-0 text-ink" aria-label="Official event page" />}
          </div>
          <div className="text-xs text-ink/50">
            {talk.date} · {talk.kind}
          </div>
        </div>
        <IconDots size={18} className="shrink-0 text-ink/40" aria-hidden />
      </header>

      {/* photo */}
      <Photo src={talkImage(talk)} alt={`${talk.event}, ${talk.host}`} ratio="4/5" className="rounded-none" label="Event photo coming soon" />

      {/* actions (decorative) */}
      <div aria-hidden className="flex items-center gap-4 px-4 pt-3.5 text-ink/80">
        <IconHeart size={22} stroke={1.6} />
        <IconMessageCircle size={22} stroke={1.6} />
        <IconSend size={22} stroke={1.6} />
        <IconBookmark size={22} stroke={1.6} className="ml-auto" />
      </div>

      {/* caption */}
      <div className="px-4 pb-5 pt-3">
        <p className="text-[15px] leading-relaxed text-ink/80">
          <span className="font-medium text-ink">{talk.title}</span> · {talk.event}
          {talk.note ? <span className="text-ink/60"> {talk.note}</span> : null}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70">
            <KindIcon size={13} stroke={1.8} aria-hidden />
            {talk.kind}
          </span>
          {talk.url && (
            <a
              href={talk.url}
              target="_blank"
              rel="noreferrer"
              data-sfx="tap"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink underline-offset-4 hover:underline"
            >
              Event page <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/** Compact press tile: image or the outlet's name set large in its colour. */
const PressTile = ({ item }: { item: Press }) => {
  const src = pressImage(item);
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100" data-sfx-hover="hoverImage">
        {src ? (
          <img src={src} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="ph-tile absolute inset-0 flex items-end p-5">
            <span className="font-hn text-3xl font-medium leading-none tracking-[-0.03em]" style={{ color: item.tone ?? "#1d1d1f" }}>
              {item.outlet}
            </span>
          </div>
        )}
      </div>
      <div className="px-1 pt-4">
        <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/45">
          {item.outlet} · {item.kind}
          {item.country ? ` · ${item.country}` : ""}
        </div>
        <h3 className="mt-1.5 text-lg leading-snug text-ink">{item.title}</h3>
        <div className="mt-1 text-sm text-ink/50">{item.date}</div>
      </div>
    </>
  );
  return item.url ? (
    <a href={item.url} target="_blank" rel="noreferrer" data-sfx="tap" className="no-scale group block">
      {body}
    </a>
  ) : (
    <div className="group">{body}</div>
  );
};

const Events = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const shown = useMemo(() => (filter === "All" ? talks : talks.filter((t) => t.kind === filter)), [filter]);
  const count = (k: TalkKind) => talks.filter((t) => t.kind === k).length;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-6 pb-40 pt-32 sm:px-10 sm:pt-40">
      <Seo
        title="Speaking & Events — Kien Serapio"
        description="Talks, hackathon judging and events by Kien Serapio, Founder & CEO of Wika PH: AI, Philippine languages, and building products as a young founder. Invite him to speak."
        path="/events"
        jsonLd={JSON_LD}
      />

      <SectionHead
        as="h1"
        eyebrow="Speaking & events"
        title="On stage."
        lede="I talk about building Wika PH, AI that works offline and on-device, and shipping products fast with AI-native workflows. I also judge hackathons and help run the events that bring builders together."
      />

      {/* Counts */}
      <Reveal className="mt-14 grid grid-cols-3 gap-4 border-y border-ink/10 py-8 sm:max-w-2xl">
        {(["Speaker", "Judge", "Organizer"] as TalkKind[]).map((k) => {
          const KindIcon = KIND_ICON[k];
          return (
            <div key={k}>
              <KindIcon size={20} stroke={1.6} className="text-ink/50" aria-hidden />
              <div className="mt-3 font-hn text-4xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
                <CountUp value={count(k)} />
              </div>
              <div className="mt-1 text-sm text-ink/55">{k === "Speaker" ? "talks" : k === "Judge" ? "panels judged" : "events organized"}</div>
            </div>
          );
        })}
      </Reveal>

      {/* Feed */}
      <section aria-labelledby="all-events" className="mt-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="all-events" className="font-hn text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
            Every event
          </h2>
          <div role="tablist" aria-label="Filter events" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                data-sfx="tap"
                className={`no-scale relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  filter === f ? "text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {filter === f && (
                  <motion.span layoutId="events-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.25, visualDuration: 0.4 }} />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </div>

        {/* masonry-ish: CSS columns keep posts of different heights tidy */}
        <div className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3">
          {shown.map((t, i) => (
            <Reveal key={`${filter}-${t.id}`} delay={(i % 3) * 0.06} className="mb-6 break-inside-avoid">
              <Post talk={t} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Press */}
      <section aria-labelledby="press-events" className="mt-28">
        <h2 id="press-events" className="font-hn text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
          In the press
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {press.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <PressTile item={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Invite (last, as the closing call to action) */}
      <Reveal className="mt-28">
        <div className="grid gap-10 rounded-[2rem] bg-ink p-6 text-white sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-white/50">Invite me to speak</div>
            <h2 className="mt-3 font-hn text-3xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Have a stage, a class or a hackathon? Let’s talk.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Cta href={SPEAK_MAILTO} variant="secondary">
                Invite me to speak
              </Cta>
              <button
                type="button"
                onClick={openCv}
                aria-haspopup="dialog"
                data-sfx="tap"
                className="no-scale rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                View resume
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <div className="text-sm font-medium">Topics</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SPEAKING_TOPICS.map((t) => (
                  <li key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm font-medium">Formats</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {FORMATS.map((f) => (
                  <li key={f} className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/70">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
};

export default Events;
