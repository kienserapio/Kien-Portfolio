import { SectionHead } from "@/components/kit/SectionHead";
import { ArticleCard } from "@/components/kit/ArticleCard";
import { Cta } from "@/components/kit/Cta";
import { Reveal } from "@/components/fx/Reveal";
import { articles } from "@/data/writing";

/** Home: the latest three articles. */
const Writing = () => {
  if (!articles.length) return null;
  const latest = articles.slice(0, 3);
  return (
    <section id="writing" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionHead
          eyebrow="Writing"
          title="Notes from building."
          lede="On AI, craft, and what shipping real products teaches you."
          action={
            <Cta to="/writing" variant="secondary">
              All writing
            </Cta>
          }
        />
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {latest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <ArticleCard a={a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Writing;
