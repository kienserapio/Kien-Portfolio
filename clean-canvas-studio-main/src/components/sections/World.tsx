import { lazy, Suspense, useMemo, useRef } from "react";
import { useInView } from "motion/react";
import type { COBEOptions } from "cobe";
import { SectionHead } from "@/components/kit/SectionHead";
import { Reveal } from "@/components/fx/Reveal";
import PH from "country-flag-icons/react/3x2/PH";
import US from "country-flag-icons/react/3x2/US";
import CA from "country-flag-icons/react/3x2/CA";
import AU from "country-flag-icons/react/3x2/AU";
import SG from "country-flag-icons/react/3x2/SG";
import { COUNTRIES } from "@/data/profile";

const FLAGS = { PH, US, CA, AU, SG } as const;

const Globe = lazy(() => import("@/components/ui/globe").then((m) => ({ default: m.Globe })));

/** Clients and learners around the world, on a globe that only renders while visible. */
const World = () => {
  const ref = useRef<HTMLDivElement>(null);
  // mount the WebGL globe only near the viewport; unmount when far away
  const near = useInView(ref, { margin: "200px 0px 200px 0px" });

  const config = useMemo<COBEOptions>(
    () => ({
      width: 800,
      height: 800,
      onRender: () => {},
      devicePixelRatio: 2,
      phi: 4.4,
      theta: 0.25,
      dark: 0,
      diffuse: 0.5,
      mapSamples: 16000,
      mapBrightness: 1.15,
      baseColor: [1, 1, 1],
      markerColor: [29 / 255, 29 / 255, 31 / 255],
      glowColor: [0.96, 0.96, 0.97],
      markers: COUNTRIES.map((c) => ({ location: c.location, size: c.name === "Philippines" ? 0.12 : 0.07 })),
    }),
    [],
  );

  return (
    <section id="world" className="relative z-10 overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 sm:px-10 lg:grid-cols-2">
        <div>
          <SectionHead
            eyebrow="Worldwide"
            title="Built in the Philippines. Used around the world."
            lede="I’ve shipped for teams and clients around the world, and Wika PH reaches Filipinos wherever they live."
          />
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-2">
            {COUNTRIES.map((c) => {
              const Flag = FLAGS[c.code];
              return (
                <span key={c.name} className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/70 py-2 pl-2.5 pr-4 text-sm backdrop-blur-sm">
                  <Flag title="" aria-hidden className="h-[14px] w-[21px] rounded-[3px] shadow-[0_0_0_0.5px_rgba(29,29,31,0.18)]" />
                  {c.name}
                </span>
              );
            })}
            <span className="inline-flex items-center rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm text-ink/50">
              and more
            </span>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-ink/10 pt-8">
            <div>
              <div className="text-4xl font-medium tracking-[-0.04em]">39%</div>
              <div className="mt-1 text-sm text-ink/55">of Wika PH learners live outside the Philippines</div>
            </div>
            <div>
              <div className="text-4xl font-medium tracking-[-0.04em]">1,917</div>
              <div className="mt-1 text-sm text-ink/55">people learned on Wika PH in September alone</div>
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[560px]" data-hover-silent>
          {near && (
            <Suspense fallback={null}>
              <Globe config={config} className="cursor-grab" />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
};

export default World;
