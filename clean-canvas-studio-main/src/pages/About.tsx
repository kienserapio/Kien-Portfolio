import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Seo from "@/components/Seo";
import { Reveal, SplitWords } from "@/components/fx/Reveal";
import {
  IconApi,
  IconBrain,
  IconBrandAdobe,
  IconBrandFigma,
  IconBrandFramer,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandReact,
  IconBrandReactNative,
  IconBrandSupabase,
  IconBrandTypescript,
  IconBrandWebflow,
  IconChartDots,
  IconComponents,
  IconCpu,
  IconDatabase,
  IconDeviceMobile,
  IconFileSearch,
  IconHierarchy,
  IconPrompt,
  IconRobot,
  IconScan,
  IconTerminal2,
  type Icon,
} from "@tabler/icons-react";
import Cta from "@/components/kit/Cta";
import { openCv } from "@/components/CvModal";
import { BIONOTE, EMAIL, experiences, FULL_NAME, SKILLS, type Experience } from "@/data/profile";
import { extras } from "@/data/projects";
import { PERSON_ID, SITE_URL } from "@/lib/site";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About Kien Serapio",
  mainEntity: { "@id": PERSON_ID },
};

const STORY = [
  "I started in design: brand assets and social cards for small brands and for Globe, then booking flows and websites for bus lines serving more than 5,000 commuters a month.",
  "Design pulled me into code. At DEVCON Philippines I built the design system and features for DEVCON+, the hub for its 11 chapters. At NMBLR AI Foundry I tested and evaluated Forge and built agent tooling that runs across Claude Code, Cursor and OpenCode.",
  "In 2026 I founded Wika PH to teach the languages of the Philippines. In its first month on the App Store it welcomed more than 2,000 new learners, 39% of them outside the country. Dialecto, an offline tutor that speaks six Philippine languages, grew out of the same mission.",
  "I also lead engineering on systems that replace paper with software: ATLAS for Equilife Medical, and web and mobile products for teams in Australia and beyond.",
];

const COMMUNITY = [
  "GDGoC TUP Manila: President & Chapter Organizer (2025–26), Co-Lead (2026–27)",
  "DEVCON Manila: Vice President of Technology",
];

/** An icon per skill; brand marks where one exists. Unknown skills fall back to a neutral glyph. */
const SKILL_ICON: Record<string, Icon> = {
  React: IconBrandReact,
  "React Native": IconBrandReactNative,
  "Next.js": IconBrandNextjs,
  TypeScript: IconBrandTypescript,
  "Node.js": IconBrandNodejs,
  Python: IconBrandPython,
  PostgreSQL: IconDatabase,
  Supabase: IconBrandSupabase,
  Expo: IconDeviceMobile,
  FastAPI: IconApi,
  "LLM integration": IconBrain,
  "RAG pipelines": IconFileSearch,
  "Agentic workflows": IconRobot,
  "On-device inference": IconCpu,
  "OCR document extraction": IconScan,
  "Prompt engineering": IconPrompt,
  Evaluation: IconChartDots,
  "Claude Code": IconTerminal2,
  Figma: IconBrandFigma,
  "Design systems": IconComponents,
  Framer: IconBrandFramer,
  Webflow: IconBrandWebflow,
  "Adobe Creative Suite": IconBrandAdobe,
};

const SKILL_GROUPS: { label: string; items: string[] }[] = [
  { label: "Build", items: SKILLS.build },
  { label: "AI", items: SKILLS.ai },
  { label: "Design", items: SKILLS.design },
];

const Mark = ({ e }: { e: Experience }) =>
  e.logo ? (
    <img src={e.logo} alt="" loading="lazy" decoding="async" className="h-10 w-10 rounded-xl border border-ink/10 bg-white object-cover" />
  ) : (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-xs font-medium tracking-wide text-white">
      {e.monogram ?? e.company.slice(0, 2).toUpperCase()}
    </span>
  );

/**
 * Experience timeline: a graphite line that draws as you scroll, sticky dates
 * on desktop. (Same idea as Aceternity's Timeline, in the site's palette.)
 */
const Timeline = () => {
  const ref = useRef<HTMLOListElement>(null);
  const [height, setHeight] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.getBoundingClientRect().height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], [0, height]);

  return (
    <ol ref={ref} className="relative mt-14">
      <div aria-hidden className="absolute left-[19px] top-0 w-px bg-ink/10" style={{ height }}>
        <motion.div className="absolute inset-x-0 top-0 w-px bg-ink" style={{ height: reduce ? height : line }} />
      </div>
      {experiences.map((e) => (
        <li key={`${e.company}-${e.role}`} className="relative grid gap-4 pb-16 pl-14 md:grid-cols-[14rem_1fr] md:gap-10 md:pl-0">
          <div className="md:sticky md:top-32 md:self-start md:pl-14">
            <span aria-hidden className="absolute left-[13px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-ink shadow-[0_0_0_1px_rgba(29,29,31,0.15)]" />
            <div className="text-sm font-medium text-ink/45">{e.date}</div>
          </div>
          <Reveal y={20}>
            <div className="flex items-center gap-3">
              <Mark e={e} />
              <div>
                <h3 className="font-hn text-xl font-medium leading-tight tracking-[-0.02em] text-ink sm:text-2xl">{e.role}</h3>
                <p className="text-ink/60">
                  {e.company}
                  {e.place ? ` · ${e.place}` : ""}
                </p>
              </div>
            </div>
            <ul className="mt-5 flex max-w-2xl flex-col gap-3">
              {e.bullets.map((b) => (
                <li key={b} className="relative pl-5 leading-relaxed text-ink/70 before:absolute before:left-0 before:top-[0.7em] before:h-1 before:w-1 before:rounded-full before:bg-ink/30">
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </li>
      ))}
    </ol>
  );
};

const About = () => {
  const headshot = extras.headshot;
  const reduce = useReducedMotion();

  return (
    <main className="relative z-10 pb-40 pt-32 sm:pt-40">
      <Seo
        title="About — Kien Serapio"
        description="Kien Leriss R. Serapio is the Founder & CEO of Wika PH, a PH100 Brightest Minds Under 30 honoree, and an AI Engineer & Software Developer from Quezon City, Philippines."
        path="/about"
        type="profile"
        jsonLd={JSON_LD}
      />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-end gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] bg-[#f2f2f4]"
          data-sfx-hover="hoverImage"
        >
          {headshot ? (
            <img src={headshot.src} alt={headshot.alt || "Kien Serapio"} width={headshot.w} height={headshot.h} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <img src="/kien-cutout.webp" alt="Kien Serapio" width={1180} height={1130} className="absolute inset-x-0 bottom-0 h-[92%] w-full object-cover object-[45%_0%]" />
          )}
        </motion.div>

        <div>
          <Reveal y={12} className="eyebrow">
            About
          </Reveal>
          <SplitWords as="h1" immediate text="Kien Serapio" className="mt-4 font-hn text-6xl font-medium leading-[0.95] tracking-[-0.045em] text-ink sm:text-8xl" />
          <Reveal delay={0.15} className="mt-4 text-lg text-ink/55 sm:text-xl">
            Founder · AI Engineer · Software Developer
          </Reveal>
          <Reveal delay={0.2} className="mt-1 text-sm text-ink/40">
            Quezon City, Philippines
          </Reveal>
          <Reveal delay={0.25} className="mt-8 max-w-xl text-lg leading-relaxed text-ink/75">
            {BIONOTE}
          </Reveal>
          <Reveal delay={0.3} className="mt-3 text-sm text-ink/40">
            {FULL_NAME}
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section aria-label="My story" className="mx-auto mt-32 max-w-3xl px-6 sm:px-10">
        <Reveal y={12} className="eyebrow">
          My story
        </Reveal>
        <SplitWords as="h2" text="From pixels to products to a company." className="mt-4 font-hn text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl" />
        <div className="mt-10 flex flex-col gap-6">
          {STORY.map((p, i) => (
            <Reveal key={i} delay={i * 0.05} className="text-lg leading-relaxed text-ink/70 sm:text-xl">
              {p}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section aria-labelledby="experience" className="mx-auto mt-32 max-w-5xl px-6 sm:px-10">
        <Reveal y={12} className="eyebrow">
          Experience
        </Reveal>
        <h2 id="experience" className="mt-4 font-hn text-4xl font-medium tracking-[-0.035em] text-ink sm:text-6xl">
          Where I’ve shipped.
        </h2>
        <Timeline />
      </section>

      {/* Skills */}
      <section aria-labelledby="skills" className="mx-auto mt-16 max-w-5xl px-6 sm:px-10">
        <h2 id="skills" className="font-hn text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
          What I work with
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.label} delay={i * 0.06}>
              <div className="eyebrow">{g.label}</div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.items.map((s) => {
                  const Glyph = SKILL_ICON[s] ?? IconHierarchy;
                  return (
                    <li key={s} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1.5 pl-2.5 pr-3.5 text-sm text-ink/75">
                      <Glyph size={16} stroke={1.6} className="shrink-0 text-ink/70" aria-hidden />
                      {s}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 border-t border-ink/10 pt-6 text-sm leading-relaxed text-ink/45">
          <span className="text-ink/60">Community:</span> {COMMUNITY.join(" · ")}
        </Reveal>

        <Reveal className="mt-16 flex flex-wrap gap-3">
          <Cta onClick={openCv}>View resume</Cta>
          <Cta href={`mailto:${EMAIL}`} variant="secondary">
            Email me
          </Cta>
        </Reveal>
      </section>
    </main>
  );
};

export default About;
