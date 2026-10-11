import Seo from "@/components/Seo";
import { SectionHead } from "@/components/kit/SectionHead";
import { ArticleCard } from "@/components/kit/ArticleCard";
import { Reveal } from "@/components/fx/Reveal";
import { articles } from "@/data/writing";
import { LINKS } from "@/data/profile";
import { PERSON_ID, SITE_URL } from "@/lib/site";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/writing#blog`,
  name: "Writing by Kien Serapio",
  url: `${SITE_URL}/writing`,
  author: { "@id": PERSON_ID },
  blogPost: articles.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    url: `${SITE_URL}/writing/${a.slug}`,
    ...(a.cover ? { image: `${SITE_URL}${a.cover}` } : {}),
    author: { "@id": PERSON_ID },
  })),
};

const Writing = () => {
  const [first, ...rest] = articles;
  return (
    <main className="relative z-10 mx-auto max-w-[1400px] px-6 pb-40 pt-32 sm:px-10 md:pt-40">
      <Seo
        title="Writing — Kien Serapio"
        description="Essays by Kien Serapio on AI, software craft, startups and building products for the Philippines."
        path="/writing"
        jsonLd={JSON_LD}
      />
      <SectionHead
        as="h1"
        eyebrow="Writing"
        title="Notes from building."
        lede={
          <>
            On AI, craft, and what shipping real products teaches you. Also on{" "}
            <a href={LINKS.medium} target="_blank" rel="noreferrer" className="underline decoration-ink/25 underline-offset-4" data-sfx="tap">
              Medium
            </a>
            .
          </>
        }
      />

      {first && (
        <Reveal className="mt-16">
          <ArticleCard a={first} large />
        </Reveal>
      )}

      <div className="mt-20 grid gap-14 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {rest.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.06}>
            <ArticleCard a={a} />
          </Reveal>
        ))}
      </div>
    </main>
  );
};

export default Writing;
