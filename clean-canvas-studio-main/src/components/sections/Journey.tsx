import { Timeline } from "@/components/ui/timeline";
import { SectionHead } from "@/components/kit/SectionHead";
import { Cta } from "@/components/kit/Cta";
import { experiences, type Experience } from "@/data/profile";

export const ExperienceEntry = ({ e }: { e: Experience }) => (
  <div className="pb-6">
    <div className="flex items-center gap-3">
      {e.logo ? (
        <img src={e.logo} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded-xl object-cover ring-1 ring-ink/10" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[11px] font-medium tracking-wider text-white">
          {e.monogram}
        </span>
      )}
      <div>
        <h3 className="text-lg font-medium leading-tight tracking-[-0.01em] text-ink md:text-xl">{e.role}</h3>
        <p className="text-sm text-ink/55">
          {e.company}
          {e.place ? ` · ${e.place}` : ""}
        </p>
      </div>
    </div>
    <ul className="mt-5 space-y-3">
      {e.bullets.map((b) => (
        <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-ink/70 md:text-base">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink/50" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Home: the six roles that matter most right now, on a scroll-drawn line. */
const Journey = () => (
  <section id="journey" className="relative z-10 py-24 md:py-32">
    <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
      <SectionHead
        eyebrow="Experience"
        title="Where I’ve shipped."
        lede="Founding a company, leading enterprise builds, and engineering AI, from Quezon City to clients in Australia."
      />
    </div>
    <Timeline data={experiences.slice(0, 6).map((e) => ({ title: e.date, content: <ExperienceEntry e={e} /> }))} />
    <div className="mx-auto mt-4 flex max-w-[1400px] px-6 sm:px-10">
      <Cta to="/about" variant="secondary">
        Full story
      </Cta>
    </div>
  </section>
);

export default Journey;
