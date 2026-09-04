import { useState } from "react";
import wikaIcon from "@/assets/wika/icon.svg";
import devconIcon from "@/assets/devcon+/devconicon.png";
import akbaiIcon from "@/assets/akbai/akbai.png";
import s1 from "@/assets/wika/wika1.png";
import s2 from "@/assets/wika/wika2.png";
import s3 from "@/assets/wika/wika3.png";
import s4 from "@/assets/wika/wika4.png";
import s5 from "@/assets/wika/wika5.png";
import devcon1 from "@/assets/devcon+/devcon1.png";
import devcon2 from "@/assets/devcon+/devcon2.png";
import devcon3 from "@/assets/devcon+/devcon3.png";
import devcon4 from "@/assets/devcon+/devcon4.png";
import akbai1 from "@/assets/akbai/akbai1.png";
import akbai2 from "@/assets/akbai/akbai2.png";
import akbai3 from "@/assets/akbai/akbai3.png";
import akbai4 from "@/assets/akbai/akbai4.png";

const screens = [s1, s2, s3, s4, s5];
const devconScreens = [devcon1, devcon2, devcon3, devcon4];
const akbaiScreens = [akbai1, akbai2, akbai3, akbai4];

const SignalIcon = () => (
  <svg viewBox="0 0 16 16" className="inline-block w-3.5 h-3.5 ml-1 align-middle" aria-hidden>
    <rect x="1"  y="11" width="2" height="4" fill="#22c55e" />
    <rect x="5"  y="8"  width="2" height="7" fill="#22c55e" />
    <rect x="9"  y="5"  width="2" height="10" fill="#22c55e" />
    <rect x="13" y="2"  width="2" height="13" fill="#22c55e" />
  </svg>
);

const FeaturedWorks = () => {
  const [active, setActive] = useState<"ui" | "dev">("ui");

  return (
    <section id="projects" className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center relative">
          <div className="font-script text-3xl md:text-4xl underline decoration-1 underline-offset-4">
            explore my work!
          </div>
          <div className="relative inline-block mt-4">
            <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.95]">
              FEATURED
              <br />
              APP WORKS
            </h2>
            <div className="absolute -top-2 right-0 md:-right-12 rotate-[8deg] glass glass-pill glass-tan text-tan-foreground text-xs font-bold tracking-wider px-3 py-1.5 rounded-full">
              BEST ONES!
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-12 flex justify-center gap-3">
          {(["ui", "dev"] as const).map((k) => {
            const label = k === "ui" ? "UI DESIGN" : "DEVELOPMENT";
            const isActive = active === k;
            return (
              <button
                key={k}
                onClick={() => setActive(k)}
                className={`inline-flex items-center text-xs font-bold tracking-widest px-6 py-2.5 rounded-full transition-all duration-200 glass glass-pill hover-scale ${
                  isActive
                    ? "glass-button"
                    : "text-muted-foreground hover:text-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_hsl(var(--foreground)/0.2)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* WIKA row */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-5">
            <img src={wikaIcon} alt="WIKA app icon" width={88} height={88} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-md" loading="lazy" />
            <div>
              <div className="text-xs tracking-widest text-muted-foreground flex items-center">
                LANGUAGE LEARNING <SignalIcon />
              </div>
              <div className="font-display font-bold text-4xl md:text-5xl tracking-tighter mt-1">WIKA</div>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            A Philippine language learning app focused on teaching and preserving Filipino regional languges.
          </p>
        </div>

        {/* Marquee */}
        <div className="mt-12 relative overflow-hidden py-6 rounded-2xl border border-border bg-secondary/30">
          <div className="flex gap-6 marquee w-max">
            {[...screens, ...screens].map((src, i) => (
              <div
                key={i}
                className="w-[220px] md:w-[260px] aspect-[9/19] rounded-[2.2rem] overflow-hidden bg-foreground p-1.5 shadow-xl shrink-0 hover-scale cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Wika app screen ${(i % screens.length) + 1}`}
                  className="w-full h-full object-cover object-top rounded-[1.8rem]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* DEVCON+ row */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-5">
            <img src={devconIcon} alt="DEVCON+ app icon" width={88} height={88} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-md" loading="lazy" />
            <div>
              <div className="text-xs tracking-widest text-muted-foreground flex items-center">
                MEMBER PLATFORM <SignalIcon />
              </div>
              <div className="font-display font-bold text-4xl md:text-5xl tracking-tighter mt-1">DEVCON+</div>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            The main platform for DEVCON members to find events and exclusive rewards through an XP system.
          </p>
        </div>

        {/* Marquee */}
        <div className="mt-12 relative overflow-hidden py-6 rounded-2xl border border-border bg-secondary/30">
          <div className="flex gap-6 marquee marquee-rtl w-max">
            {[...devconScreens, ...devconScreens].map((src, i) => (
              <div
                key={i}
                className="w-[220px] md:w-[260px] aspect-[9/19] rounded-[2.2rem] overflow-hidden bg-foreground p-1.5 shadow-xl shrink-0 hover-scale cursor-pointer"
              >
                <img
                  src={src}
                  alt={`DEVCON+ app screen ${(i % devconScreens.length) + 1}`}
                  className="w-full h-full object-cover object-top rounded-[1.8rem]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* AKBAI row */}
        <div className="mt-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-5">
            <img src={akbaiIcon} alt="AKBAI app icon" width={88} height={88} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-md" loading="lazy" />
            <div>
              <div className="text-xs tracking-widest text-muted-foreground flex items-center">
                AI TRAVEL PLANNER <SignalIcon />
              </div>
              <div className="font-display font-bold text-4xl md:text-5xl tracking-tighter mt-1">AKBAI</div>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
            An AI-powered itinerary travel planner and local translator for tourists in the Philippines.
          </p>
        </div>

        {/* Marquee */}
        <div className="mt-12 relative overflow-hidden py-6 rounded-2xl border border-border bg-secondary/30">
          <div className="flex gap-6 marquee w-max">
            {[...akbaiScreens, ...akbaiScreens].map((src, i) => (
              <div
                key={i}
                className="w-[220px] md:w-[260px] aspect-[9/19] rounded-[2.2rem] overflow-hidden bg-foreground p-1.5 shadow-xl shrink-0 hover-scale cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Akbai app screen ${(i % akbaiScreens.length) + 1}`}
                  className="w-full h-full object-cover object-top rounded-[1.8rem]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorks;
