import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import Seo from "@/components/Seo";
import { Reveal } from "@/components/fx/Reveal";
import { ArticleCard } from "@/components/kit/ArticleCard";
import { articleBySlug, articles, formatDate, loadArticle } from "@/data/writing";
import { PERSON_ID, SITE_URL } from "@/lib/site";
import NotFound from "./NotFound";

type MdxProps = { components?: Record<string, unknown> };

/** Markdown → site components. Image titles become captions. */
const components = {
  img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => (
    <figure className="not-prose my-10">
      <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" className="w-full rounded-2xl bg-neutral-100" data-sfx-hover="hoverImage" />
      {title && <figcaption className="mt-3 text-center text-sm text-ink/50">{title}</figcaption>}
    </figure>
  ),
  // figures can't live inside <p>; unwrap paragraphs that only hold an image
  p: ({ children }: { children?: ReactNode }) => {
    const only = Array.isArray(children) ? null : children;
    if (only && typeof only === "object" && "props" in (only as object) && (only as { props: { src?: string } }).props.src) {
      return <>{children}</>;
    }
    return <p>{children}</p>;
  },
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    const external = href && /^https?:/.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} data-sfx="tap">
        {children}
      </a>
    );
  },
};

const Article = () => {
  const { slug = "" } = useParams();
  const meta = articleBySlug(slug);
  const [Body, setBody] = useState<ComponentType<MdxProps> | null>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    let alive = true;
    setBody(null);
    if (meta) loadArticle(slug).then((m) => alive && setBody(() => m.default));
    return () => {
      alive = false;
    };
  }, [slug, meta]);

  if (!meta) return <NotFound />;

  const i = articles.findIndex((a) => a.slug === slug);
  const next = articles[(i + 1) % articles.length];
  const url = `${SITE_URL}/writing/${slug}`;

  return (
    <main className="relative z-10 pb-40 pt-32 md:pt-40">
      <Seo
        title={`${meta.title} — Kien Serapio`}
        description={meta.description}
        path={`/writing/${slug}`}
        type="article"
        image={meta.cover ? `${SITE_URL}${meta.cover}` : undefined}
        imageAlt={meta.coverAlt}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: meta.title,
          description: meta.description,
          datePublished: meta.date,
          url,
          mainEntityOfPage: url,
          ...(meta.cover ? { image: `${SITE_URL}${meta.cover}` } : {}),
          author: { "@id": PERSON_ID, "@type": "Person", name: "Kien Serapio" },
          keywords: meta.tags.join(", "),
          ...(meta.originalUrl ? { sameAs: meta.originalUrl } : {}),
        }}
      />
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-ink" style={{ scaleX: progress }} />

      <article className="mx-auto max-w-3xl px-6">
        <Link to="/writing" data-sfx="navigate" className="no-scale inline-flex items-center gap-2 text-sm text-ink/55 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Writing
        </Link>
        <Reveal>
          <div className="mt-8 text-sm text-ink/50">
            {formatDate(meta.date)} · {meta.readingMinutes} min read
          </div>
          <h1 className="mt-4 font-hn text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-ink md:text-6xl">{meta.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/60 md:text-xl">{meta.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span key={t} className="rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/60">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </article>

      {meta.cover && (
        <Reveal className="mx-auto mt-12 max-w-5xl px-6" y={30}>
          <figure>
            <img src={meta.cover} alt={meta.coverAlt ?? ""} className="w-full rounded-3xl bg-neutral-100" {...{ fetchpriority: "high" }} />
            {meta.coverCaption && <figcaption className="mt-3 text-center text-sm text-ink/50">{meta.coverCaption}</figcaption>}
          </figure>
        </Reveal>
      )}

      <div className="prose prose-lg mx-auto mt-14 max-w-3xl px-6 font-hn prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-ink prose-p:text-ink/80 prose-a:text-ink prose-a:decoration-ink/30 prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:border-ink/20 prose-blockquote:font-normal prose-blockquote:text-ink/70 prose-li:text-ink/80">
        {Body ? <Body components={components} /> : <div className="h-[60vh]" aria-busy="true" />}
      </div>

      <div className="mx-auto mt-16 max-w-3xl px-6">
        {meta.originalUrl && (
          <a
            href={meta.originalUrl}
            target="_blank"
            rel="noreferrer"
            data-sfx="tap"
            className="no-scale inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink"
          >
            Also published on Medium <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>

      {next && next.slug !== slug && (
        <div className="mx-auto mt-20 max-w-5xl border-t border-ink/10 px-6 pt-12">
          <div className="eyebrow mb-6">Read next</div>
          <ArticleCard a={next} large />
        </div>
      )}
    </main>
  );
};

export default Article;
