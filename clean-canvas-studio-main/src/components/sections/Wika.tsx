import { Eyebrow, Reveal, SplitWords } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import { Cta } from "@/components/kit/Cta";
import { Phone } from "@/components/kit/Device";
import { LinkPreview } from "@/components/ui/link-preview";
import { WIKA } from "@/data/profile";

const SCREENS = [1, 2, 3, 4, 5, 6, 7].map((i) => `/wika/sim-${i}.webp`);

/** Founder & CEO: Wika PH, told with September 2026's numbers. */
const Wika = () => (
  <section id="wika" className="relative z-10 py-24 md:py-36">
    <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
      <Eyebrow>Founder &amp; CEO</Eyebrow>

      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-5">
            <Reveal y={20}>
              <img
                src="/wika/icon.webp"
                alt="Wika PH app icon"
                width={88}
                height={88}
                loading="lazy"
                className="h-16 w-16 rounded-[22%] shadow-[0_10px_30px_-10px_rgba(29,29,31,0.35)] md:h-[88px] md:w-[88px]"
              />
            </Reveal>
            <SplitWords
              as="h2"
              text="Wika PH"
              className="text-[clamp(3.5rem,11vw,9rem)] font-medium leading-[0.9] tracking-[-0.045em]"
            />
          </div>

          <SplitWords
            as="p"
            text="Teaching, and keeping alive, the languages of the Philippines."
            delay={0.15}
            className="mt-10 max-w-2xl text-balance text-2xl font-medium leading-[1.15] tracking-tight md:text-4xl"
          />
          <Reveal delay={0.2} className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 md:text-lg">
            {WIKA.lede}
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-6">
          <ul className="space-y-5">
            {WIKA.bullets.map((b, i) => (
              <Reveal as="li" key={b} delay={0.08 * i} className="flex gap-3 text-base leading-relaxed text-ink/65">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-ink" />
                <span>{b}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-2">
            {WIKA.languages.map((t) => (
              <span key={t} className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white">
                {t}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-ink/25 px-3 py-1 text-xs font-medium text-ink/50">
              +5 coming
            </span>
          </Reveal>

          <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center gap-3">
            <Cta href={WIKA.url}>Visit wikaph.com</Cta>
            <Cta href={WIKA.release} variant="secondary">
              September report
            </Cta>
          </Reveal>
        </div>
      </div>

      {/* The number, Apple-sized */}
      <div className="mt-24 border-t border-ink/10 pt-12">
        <Reveal>
          <div className="eyebrow">First month on the App Store</div>
          <div className="mt-4 font-hn text-[clamp(5rem,20vw,16rem)] font-medium leading-[0.85] tracking-[-0.06em]">
            <CountUp value={WIKA.headline.value} duration={2.2} />
          </div>
          <div className="mt-4 max-w-md text-ink/60">
            {WIKA.headline.label}, plus 161+ testers on the Android beta.{" "}
            <LinkPreview url={WIKA.release} className="font-medium text-ink underline decoration-ink/25 underline-offset-4">
              Read the release
            </LinkPreview>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {WIKA.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} ticks={i === 0} />
              </div>
              <div className="mt-3 max-w-[12rem] text-sm text-ink/55">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    {/* Screens, in real iPhone frames */}
    <Reveal className="relative mt-16 overflow-hidden" y={50}>
      {/* generous vertical padding so the phones' drop shadows aren't clipped */}
      <div className="marquee-slow flex w-max gap-6 pb-20 pt-8">
        {[...SCREENS, ...SCREENS].map((src, i) => (
          <div key={i} className="w-[210px] shrink-0 md:w-[250px]">
            <Phone src={src} alt={`Wika PH app screen ${(i % SCREENS.length) + 1}`} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </Reveal>
  </section>
);

export default Wika;
