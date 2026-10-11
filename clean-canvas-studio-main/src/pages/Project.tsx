import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import Seo from "@/components/Seo";
import Cta from "@/components/kit/Cta";
import Device, { Phone } from "@/components/kit/Device";
import Photo from "@/components/kit/Photo";
import ProjectLogo from "@/components/kit/ProjectLogo";
import { Eyebrow, Reveal, SplitWords } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PERSON_ID, SITE_URL, absoluteUrl } from "@/lib/site";
import { mediaFor, projectBySlug, projects, type MediaImage, type Project as P } from "@/data/projects";
import NotFound from "./NotFound";

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`);

const APP_CATEGORY: Record<P["category"], string> = {
  Flagship: "EducationalApplication",
  "AI systems": "DeveloperApplication",
  "Client work": "BusinessApplication",
  "Products & community": "WebApplication",
};

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Reveal className="grid gap-4 border-t border-ink/10 pt-8 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
    <h2 className="text-[13px] font-medium uppercase tracking-[0.18em] text-ink/45">{title}</h2>
    <div className="text-xl leading-relaxed text-ink/80 sm:text-2xl sm:leading-relaxed">{children}</div>
  </Reveal>
);

const Gallery = ({ p, onOpen }: { p: P; onOpen: (im: MediaImage) => void }) => {
  const { images } = mediaFor(p.slug);
  const phones = images.filter((im) => im.kind === "phone");
  const wide = images.filter((im) => im.kind !== "phone");
  if (!images.length) return null;
  return (
    <section aria-label={`${p.name} screenshots`} className="mt-24 sm:mt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-10">
        <Eyebrow>Screens</Eyebrow>
      </div>

      {phones.length > 0 && (
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 scroll-px-4 sm:gap-8 sm:px-10 sm:scroll-px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))]">
          {phones.map((im) => (
            <button
              key={im.src}
              type="button"
              onClick={() => onOpen(im)}
              data-sfx="open"
              data-sfx-hover="hoverImage"
              aria-label={`Enlarge: ${im.alt}`}
              className="no-scale w-[58vw] max-w-[15rem] shrink-0 snap-center transition-transform duration-500 hover:-translate-y-1.5 sm:w-60"
            >
              <Phone src={im.src} alt={im.alt} />
            </button>
          ))}
        </div>
      )}

      {wide.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 sm:px-10 md:grid-cols-2">
          {wide.map((im, i) => (
            <Reveal key={im.src} delay={(i % 2) * 0.06} className={wide.length % 2 === 1 && i === 0 ? "md:col-span-2" : ""}>
              <button
                type="button"
                onClick={() => onOpen(im)}
                data-sfx="open"
                data-sfx-hover="hoverImage"
                aria-label={`Enlarge: ${im.alt}`}
                className="no-scale group block w-full overflow-hidden rounded-2xl bg-[#f2f2f4] shadow-[0_20px_50px_-24px_rgba(29,29,31,0.35)] ring-1 ring-ink/5"
              >
                <img
                  src={im.src}
                  alt={im.alt}
                  width={im.w}
                  height={im.h}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </button>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
};

const Project = () => {
  const { slug = "" } = useParams();
  const p = projectBySlug(slug);
  const [zoom, setZoom] = useState<MediaImage | null>(null);

  const seo = useMemo(() => {
    if (!p) return null;
    const m = mediaFor(p.slug);
    const cover = m.cover ?? m.images[0]?.src;
    const title = clip(`${p.name} — Kien Serapio`, 60);
    const description = clip(`${p.tagline} ${p.problem}`, 155);
    const url = absoluteUrl(`/work/${p.slug}`);
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "@id": `${url}#app`,
          name: p.name,
          description: p.tagline,
          url: p.url ?? url,
          ...(p.repo ? { codeRepository: p.repo } : {}),
          ...(cover ? { image: `${SITE_URL}${cover}` } : {}),
          applicationCategory: APP_CATEGORY[p.category],
          operatingSystem: p.device === "phone" ? "iOS, Android, Web" : "Web",
          author: { "@id": PERSON_ID },
          keywords: p.stack.join(", "),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Work", item: absoluteUrl("/work") },
            { "@type": "ListItem", position: 3, name: p.name, item: url },
          ],
        },
      ],
    };
    return { title, description, image: cover ? `${SITE_URL}${cover}` : undefined, jsonLd };
  }, [p]);

  if (!p || !seo) return <NotFound />;

  const m = mediaFor(p.slug);
  const cover = m.cover ?? m.images[0]?.src;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const nextCover = mediaFor(next.slug).cover ?? mediaFor(next.slug).images[0]?.src;

  return (
    <main className="relative z-10 pb-40">
      <Seo
        title={seo.title}
        description={seo.description}
        path={`/work/${p.slug}`}
        type="article"
        image={seo.image}
        imageAlt={`${p.name}: ${p.tagline}`}
        jsonLd={seo.jsonLd}
      />

      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 pt-32 sm:px-10 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-ink/45">
          <Link to="/work" data-sfx="navigate" className="hover-dim">
            Work
          </Link>
          <span className="mx-2 text-ink/25">/</span>
          <span className="text-ink/70">{p.name}</span>
        </nav>

        <Reveal y={16} className="mb-6">
          <ProjectLogo slug={p.slug} name={p.name} className="h-16 w-16 shadow-[0_14px_30px_-14px_rgba(29,29,31,0.4)] sm:h-20 sm:w-20" />
        </Reveal>
        <SplitWords
          as="h1"
          immediate
          text={p.name}
          className="font-hn text-[3.2rem] font-medium leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl lg:text-8xl"
        />
        <Reveal delay={0.1} className="mt-6 max-w-3xl text-xl leading-relaxed text-ink/60 sm:text-2xl">
          {p.tagline}
        </Reveal>

        <Reveal delay={0.16} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-ink/55">
          <span>
            <span className="text-ink/35">Role</span> {p.role}
          </span>
          <span>
            <span className="text-ink/35">When</span> {p.period}
          </span>
          <span>
            <span className="text-ink/35">Status</span> {p.status}
          </span>
          <span>
            <span className="text-ink/35">Category</span> {p.category}
          </span>
        </Reveal>

        <Reveal delay={0.22} className="mt-8 flex flex-wrap items-center gap-3">
          {p.url && p.status !== "Internal" && (
            <Cta href={p.url}>
              Visit {p.urlLabel ?? "site"} <ArrowUpRight className="h-4 w-4" />
            </Cta>
          )}
          {p.repo && (
            <Cta href={p.repo} variant="secondary">
              View code
            </Cta>
          )}
          {p.status === "Internal" && (
            <p className="inline-flex items-center gap-2 rounded-full bg-[#f2f2f4] px-4 py-2.5 text-[13px] text-ink/60">
              <Lock className="h-3.5 w-3.5" /> Internal tool, shown with permission. Not publicly accessible.
            </p>
          )}
        </Reveal>
      </section>

      {/* Hero mockup */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-10">
        <Reveal y={48}>
          <div className={`mx-auto ${p.device === "phone" ? "w-[68%] max-w-[18rem]" : "w-full"}`}>
            {cover || m.video ? (
              <Device kind={p.device} src={cover} videoSrc={m.video?.src} url={p.urlLabel} />
            ) : (
              <Photo alt={`${p.name} screenshot`} ratio={p.device === "phone" ? "9/19" : "16/10"} label="Screens coming soon" />
            )}
          </div>
        </Reveal>
      </section>

      {/* Story */}
      <section className="mx-auto mt-24 flex max-w-6xl flex-col gap-14 px-4 sm:mt-32 sm:px-10">
        <Block title="The problem">{p.problem}</Block>
        <Block title="What it does">{p.solution}</Block>
        <Block title="Who it helps">{p.who}</Block>
      </section>

      {/* Impact */}
      {p.impact.length > 0 && (
        <section aria-label="Impact" className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-10">
          <Eyebrow>Impact</Eyebrow>
          <dl className={`mt-8 grid grid-cols-2 gap-x-6 gap-y-10 ${p.impact.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {p.impact.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-hn text-4xl font-medium tracking-[-0.04em] text-ink sm:text-6xl">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </dd>
                <dd className="mt-2 max-w-[14rem] text-[14px] leading-snug text-ink/55">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
        </section>
      )}

      {/* Features + AI */}
      <section className="mx-auto mt-24 grid max-w-6xl gap-14 px-4 sm:mt-32 sm:px-10 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="font-hn text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">What’s inside</h2>
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {p.features.map((f) => (
              <li key={f} className="py-3.5 text-[16px] leading-relaxed text-ink/75">
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
        {p.ai && (
          <Reveal delay={0.08}>
            <div className="rounded-3xl bg-ink p-8 text-white sm:p-10">
              <p className="text-[12px] uppercase tracking-[0.2em] text-white/45">How it uses AI</p>
              <p className="mt-5 text-lg leading-relaxed text-white/85">{p.ai}</p>
            </div>
          </Reveal>
        )}
      </section>

      {/* Stack */}
      <section aria-label="Tech stack" className="mx-auto mt-16 max-w-6xl px-4 sm:px-10">
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-ink/45">Built with</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-[13px] text-ink/70">
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Gallery p={p} onOpen={setZoom} />

      {/* Next */}
      <section className="mx-auto mt-28 max-w-6xl px-4 sm:mt-36 sm:px-10">
        <Reveal>
          <Link
            to={`/work/${next.slug}`}
            data-sfx="navigate"
            data-sfx-hover="hoverImage"
            className="no-scale group grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#f2f2f4] p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:p-10"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[12px] uppercase tracking-[0.2em] text-ink/45">Next project</span>
              <span className="font-hn text-4xl font-medium tracking-[-0.04em] text-ink sm:text-5xl">{next.name}</span>
              <span className="max-w-sm text-[15px] leading-relaxed text-ink/60">{next.tagline}</span>
              <span className="mt-2 inline-flex items-center gap-2 text-sm text-ink">
                Read the story <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl">
              {nextCover ? (
                <img
                  src={nextCover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <Photo alt={next.name} ratio="16/10" label="Screens coming soon" />
              )}
            </div>
          </Link>
        </Reveal>
        <div className="mt-10 flex justify-center">
          <Link to="/work" data-sfx="navigate" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> All work
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!zoom} onOpenChange={(o) => !o && setZoom(null)}>
        <DialogContent className="max-h-[92vh] max-w-[min(92vw,80rem)] overflow-auto border-0 bg-white p-2 sm:rounded-3xl">
          <DialogTitle className="sr-only">{zoom?.alt ?? p.name}</DialogTitle>
          {zoom && (
            <img
              src={zoom.src}
              alt={zoom.alt}
              width={zoom.w}
              height={zoom.h}
              className={`mx-auto h-auto rounded-2xl ${zoom.kind === "phone" ? "max-h-[86vh] w-auto" : "w-full"}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Project;
