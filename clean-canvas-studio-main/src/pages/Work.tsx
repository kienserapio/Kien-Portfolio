import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import Seo from "@/components/Seo";
import SectionHead from "@/components/kit/SectionHead";
import Photo from "@/components/kit/Photo";
import ProjectLogo from "@/components/kit/ProjectLogo";
import { Reveal } from "@/components/fx/Reveal";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { PERSON_ID, SITE_URL, absoluteUrl } from "@/lib/site";
import { CATEGORIES, mediaFor, projects, type Category, type Project } from "@/data/projects";

type Filter = "All" | Category;
const FILTERS: Filter[] = ["All", ...CATEGORIES];

const TITLE = "Work — Kien Serapio";
const DESCRIPTION =
  "Products by Kien Serapio: Wika PH, Dialecto, ATLAS, EverythingOS, OneTUP and more. AI systems, client work and community platforms, with the impact behind each.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/work#page`,
  url: absoluteUrl("/work"),
  name: TITLE,
  description: DESCRIPTION,
  author: { "@id": PERSON_ID },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/work/${p.slug}`),
      name: p.name,
    })),
  },
};

/**
 * Landscape shots for the 3D marquee. The marquee crops to 970×700, so phone
 * shots are skipped; the list is repeated until there are enough tiles.
 */
const marqueeImages = () => {
  const all = projects.flatMap((p) => {
    const m = mediaFor(p.slug);
    const shots = m.images.filter((im) => im.kind !== "phone").map((im) => im.src);
    if (m.cover && !shots.includes(m.cover) && m.images.find((im) => im.src === m.cover)?.kind !== "phone") shots.unshift(m.cover);
    return shots;
  });
  const unique = Array.from(new Set(all));
  if (unique.length < 6) return [];
  const out: string[] = [];
  while (out.length < 24) out.push(...unique);
  return out.slice(0, 24);
};

const STATUS_DOT: Record<Project["status"], string> = {
  Live: "bg-emerald-500",
  "On the App Store": "bg-emerald-500",
  "Open source": "bg-sky-500",
  Internal: "bg-ink/40",
  "In development": "bg-amber-500",
  Prototype: "bg-ink/25",
};

const StatusBadge = ({ status, className = "" }: { status: Project["status"]; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-ink/70 backdrop-blur ${className}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
    {status}
  </span>
);

const fmtStat = (p: Project) => {
  const s = p.impact[0];
  if (!s) return null;
  const n = s.value.toLocaleString("en-US", { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 });
  return { value: `${s.prefix ?? ""}${n}${s.suffix ?? ""}`, label: s.label };
};

const Card = ({ p, i }: { p: Project; i: number }) => {
  const m = mediaFor(p.slug);
  const cover = m.cover ?? m.images[0]?.src;
  const stat = fmtStat(p);
  return (
    <Reveal delay={(i % 3) * 0.05} y={24}>
      <Link
        to={`/work/${p.slug}`}
        data-sfx="navigate"
        data-sfx-hover="hoverImage"
        className="no-scale group flex h-full flex-col gap-4 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
      >
        <div className="relative overflow-hidden rounded-3xl bg-[#f2f2f4] shadow-[0_1px_0_rgba(29,29,31,0.04)]">
          {cover ? (
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={cover}
                alt={`${p.name}: ${p.tagline}`}
                loading="lazy"
                decoding="async"
                className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                  p.device === "phone" ? "object-top" : "object-left-top"
                }`}
              />
            </div>
          ) : (
            <Photo alt={p.name} ratio="16/10" label="Screens coming soon" className="rounded-none" />
          )}
          <StatusBadge status={p.status} className="absolute left-3 top-3" />
        </div>
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ProjectLogo slug={p.slug} name={p.name} className="h-8 w-8" />
              <h3 className="font-hn text-xl font-medium tracking-[-0.02em] text-ink">{p.name}</h3>
            </div>
            <span className="shrink-0 text-[12px] text-ink/40">{p.category}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-ink/60">{p.tagline}</p>
          {stat && (
            <p className="mt-1 text-[13px] text-ink/50">
              <span className="font-medium tabular-nums text-ink">{stat.value}</span> {stat.label}
            </p>
          )}
        </div>
      </Link>
    </Reveal>
  );
};

const Work = () => {
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const raw = params.get("c");
  const filter: Filter = FILTERS.includes(raw as Filter) ? (raw as Filter) : "All";
  const images = useMemo(marqueeImages, []);
  const list = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const setFilter = (f: Filter) => {
    const next = new URLSearchParams(params);
    if (f === "All") next.delete("c");
    else next.set("c", f);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <main className="relative z-10 pb-40">
      <Seo title={TITLE} description={DESCRIPTION} path="/work" jsonLd={JSON_LD} />

      {/* Hero: title over a slowly drifting wall of screens */}
      <section className="relative overflow-hidden pt-32 sm:pt-40">
        {images.length > 0 && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[640px] opacity-35 sm:opacity-45">
            <ThreeDMarquee images={images} className="h-[640px] rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white" />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-10">
          <SectionHead
            as="h1"
            eyebrow="Work"
            title="Work that ships."
            lede={`${projects.length} products for real people: language learners in the Philippines and abroad, hospitals, schools, startups, and businesses in Australia. Here’s what each one does and who it helps.`}
          />
        </div>
      </section>

      {/* Filters */}
      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-24 sm:px-10">
        <div role="tablist" aria-label="Filter by category" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((f) => {
            const active = f === filter;
            const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f)}
                data-sfx="tap"
                className={`no-scale relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                  active ? "text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0.25, visualDuration: 0.4 }}
                  />
                )}
                <span className="relative">
                  {f} <span className={active ? "text-white/50" : "text-ink/30"}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.ul layout={!reduce} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.li key={p.slug} layout={!reduce ? "position" : false}>
              <Card p={p} i={i} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </main>
  );
};

export default Work;
