import { useEffect, useState } from "react";

const TITLES = ["DESIGNER", "DEVELOPER"];

const useTypingLoop = () => {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(TITLES[0]);
  const [phase, setPhase] = useState<"hold" | "delete" | "type">("hold");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const next = TITLES[(idx + 1) % TITLES.length];

    if (phase === "hold") {
      t = setTimeout(() => setPhase("delete"), 3000);
    } else if (phase === "delete") {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), 70);
      } else {
        setIdx((idx + 1) % TITLES.length);
        setPhase("type");
      }
    } else if (phase === "type") {
      if (text.length < next.length) {
        t = setTimeout(() => setText(next.slice(0, text.length + 1)), 110);
      } else {
        setPhase("hold");
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx]);

  return text;
};

const TimeStamp = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);
  return <div className="text-xs tracking-widest text-muted-foreground">{time}</div>;
};

const TargetIcon = () => (
  <svg viewBox="0 0 48 48" className="inline-block w-9 h-9 md:w-12 md:h-12 align-middle mx-1" aria-hidden>
    <circle cx="24" cy="24" r="22" fill="#22c55e" />
    <circle cx="24" cy="24" r="14" fill="#fff" />
    <circle cx="24" cy="24" r="8" fill="#22c55e" />
    <circle cx="24" cy="24" r="3" fill="#fff" />
  </svg>
);

const FlowerIcon = () => (
  <svg viewBox="0 0 48 48" className="inline-block w-9 h-9 md:w-12 md:h-12 align-middle mx-1" aria-hidden>
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <ellipse
        key={deg}
        cx="24"
        cy="12"
        rx="6"
        ry="10"
        fill="hsl(var(--pink))"
        transform={`rotate(${deg} 24 24)`}
      />
    ))}
    <circle cx="24" cy="24" r="5" fill="#fde047" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path d="M5 6l6 6-6 6" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6l6 6-6 6" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Hero = () => {
  const title = useTypingLoop();

  return (
    <section id="home" className="relative min-h-screen px-6 pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* top time */}
      <div className="flex justify-center reveal-fade" style={{ ["--delay" as any]: "100ms" }}>
        <TimeStamp />
      </div>

      {/* Floating colored glass pills */}
      <div
        className="absolute left-[6%] md:left-[10%] top-[34%] reveal-pop z-10"
        style={{ ["--delay" as any]: "700ms" }}
      >
        <div className="float-a">
          <div className="glass glass-pill glass-yellow text-[11px] md:text-xs font-bold tracking-wider px-4 py-2 rounded-full whitespace-nowrap">
            FROM QUEZON CITY
          </div>
        </div>
      </div>

      <div
        className="absolute right-[6%] md:right-[10%] top-[40%] reveal-pop z-10"
        style={{ ["--delay" as any]: "850ms" }}
      >
        <div className="float-b">
          <div className="glass glass-pill glass-red text-[11px] md:text-xs font-bold tracking-wider px-4 py-2 rounded-full whitespace-nowrap">
            I DO GAME DEV!
          </div>
        </div>
      </div>

      <div
        className="absolute left-[14%] md:left-[18%] bottom-[14%] reveal-pop z-10"
        style={{ ["--delay" as any]: "1000ms" }}
      >
        <div className="float-c">
          <div className="glass glass-pill glass-green text-[11px] md:text-xs font-bold tracking-wider px-4 py-2 rounded-full whitespace-nowrap">
            KAMUSTA?
          </div>
        </div>
      </div>

      {/* center stack */}
      <div className="max-w-5xl mx-auto mt-10 text-center">
        <div
          className="font-script text-3xl md:text-5xl reveal-up"
          style={{ ["--delay" as any]: "200ms" }}
        >
          Kamusta? I'm <span className="underline decoration-1 underline-offset-4">Kien Serapio</span>
        </div>

        <div
          className="relative mt-8 inline-block mx-auto reveal-up"
          style={{ ["--delay" as any]: "350ms" }}
        >
          {/* tags */}
          <div
            className="absolute -top-5 left-4 md:left-10 z-10 glass glass-pill glass-mint text-mint-foreground text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-full reveal-pop"
            style={{ ["--delay" as any]: "1100ms", ["--rev-rot" as any]: "-6deg" }}
          >
            WEBSITE DESIGN
          </div>
          <div
            className="absolute -top-5 right-4 md:right-10 z-10 glass glass-pill glass-tan text-tan-foreground text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-full reveal-pop"
            style={{ ["--delay" as any]: "1200ms", ["--rev-rot" as any]: "6deg" }}
          >
            APP DESIGN
          </div>

          <div className="figma-frame rounded-sm py-4 md:py-6 px-6 md:px-10 bg-background inline-block">
            <span className="handle bl" />
            <span className="handle br" />
            <span className="handle tm" />
            <span className="handle bm" />
            <span className="handle lm" />
            <span className="handle rm" />
            <h1 className="font-display font-bold text-[14vw] md:text-[10rem] leading-[0.9] tracking-tighter whitespace-nowrap">
              <span className="caret-inline title-gradient">{title}</span>
            </h1>
          </div>
        </div>

        {/* Status — fixed below the frame, NOT following the caret */}
        <div
          className="mt-8 flex justify-center reveal-fade"
          style={{ ["--delay" as any]: "550ms" }}
        >
          <div className="inline-flex items-center gap-2 text-xs md:text-sm tracking-widest text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan shadow-[0_0_12px_hsl(var(--cyan))]" />
            PROFICIENT IN DESIGN TO DEVELOPMENT
          </div>
        </div>

        {/* Merged Intro line */}
        <h2
          className="mt-16 font-display font-medium text-2xl md:text-4xl tracking-tight max-w-4xl mx-auto leading-tight reveal-up"
          style={{ ["--delay" as any]: "700ms" }}
        >
          I design and <TargetIcon /> develop
          <br />
          from concept to code <FlowerIcon />.
        </h2>

        <div
          className="mt-8 flex justify-center reveal-up"
          style={{ ["--delay" as any]: "850ms" }}
        >
          <a
            href="https://medium.com/@kienserapio"
            target="_blank"
            className="group inline-flex items-center gap-3 glass glass-button rounded-full pl-2 pr-5 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_hsl(var(--foreground)/0.45)] active:translate-y-0"
          >
            <span className="rounded-full w-9 h-9 inline-flex items-center justify-center bg-white/10 border border-white/20">
              <ArrowIcon />
            </span>
            <span className="text-sm font-bold tracking-widest">READ MORE ABOUT ME</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
