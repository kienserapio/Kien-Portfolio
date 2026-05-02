import NavBar from "@/components/portfolio/NavBar";
import Footer from "@/components/portfolio/Footer";
// import portrait from "@/assets/about-portrait.jpg";
const portrait = "/Unknown-33.jpg";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  ReactIcon,
  ExpoIcon,
  NextIcon,
  NodeIcon,
  TSIcon,
  PostgresIcon,
  TailwindIcon,
  FigmaIcon,
  WordPressIcon,
  PhotoshopIcon,
  IllustratorIcon,
  MonoLogo,
} from "../components/portfolio/icons";

type Exp = {
  company: string;
  role: string;
  date: string;
  bullets: string[];
  pillClass: string;
  logo: { label?: string; bg?: string; fg?: string; src?: string };
};

const experiences: Exp[] = [
  {
    company: "Wika PH",
    role: "Founder & CEO",
    date: "2026 — Present",
    pillClass: "glass-purple",
    logo: { src: "/logos/icon.png" },
    bullets: [
      "Leading product, design, and engineering for a Filipino-first language platform.",
      "Defining brand, strategy, and end-to-end user experience.",
    ],
  },
  {
    company: "KadaKareer",
    role: "Product Engineering — Junior Mission Specialist",
    date: "Jan 2026",
    pillClass: "glass-navy",
    logo: { src: "/logos/kadakareer_logo.jpeg" },
    bullets: [
      "Re-engineered the “Koach” interface for clarity, speed, and accessibility.",
      "Owned cross-browser testing and shipped UI fixes across the product surface.",
    ],
  },
  {
    company: "DEVCON Philippines",
    role: "Product Designer & Project Manager",
    date: "Jan 2026 - Apr 2026",
    pillClass: "glass-vpurple",
    logo: { src: "/logos/devcon.jpg" },
    bullets: [
      "Architected an AI-automated design workflow using Google Stitch + Figma.",
      "Built the DEVCON+ R&D beta prototype in React with Claude Code.",
    ],
  },
  {
    company: "DEVCON Philippines",
    role: "Full Stack Developer & Studios Intern",
    date: "Sept 2025 — Jan 2026",
    pillClass: "glass-vpurple",
    logo: { src: "/logos/devcon.jpg" },
    bullets: [
      "Engineered dApps on the Internet Computer Protocol (ICP).",
      "Pioneered work inside the Caffeine AI ecosystem.",
    ],
  },
  {
    company: "Easybus PH",
    role: "UI/UX Intern",
    date: "July 2025 - Nov 2025",
    pillClass: "glass-navy-yellow",
    logo: { src: "/logos/easybus.png" },
    bullets: [
      "Designed prototypes for Ohayami Trans and DLTB Co.",
      "Translated rider research into clean, conversion-driven flows.",
    ],
  },
  {
    company: "Globe Telecom",
    role: "Digital and Social Media Operations Intern",
    date: "Apr 2025 - July 2025",
    pillClass: "glass-cyan",
    logo: { src: "/logos/globe.png" },
    bullets: [
      "Developed key visuals for GlobeICON.",
      "Supported social campaigns reaching a national audience.",
    ],
  },
    {
    company: "Widustalk Academy",
    role: "Junior Graphic Designer",
    date: "Feb 2023 - Aug 2023",
    pillClass: "",
    logo: { src: "/logos/widustalk.jpeg"},
    bullets: [
      "Designed digital assets for Lingoloco, Bobjo, Mango Rush and Bueno.",
      "Increased social media engagement with a reach of 9,000+ followers",
    ],
  },
];

const leadership = [
  {
    org: "Google Developer Group on Campus — TUP Manila",
    role: "President / Chapter Organizer",
    note: "Manage 100+ executives. Facilitate workshops on Firebase, Flutter, and Gemini.",
    logo: { src: "/logos/GDGOC LOGO.png" },
  },
  {
    org: "DEVCON Manila",
    role: "Vice President of Technology",
    note: "Execute Code Camps focused on AI and Blockchain.",
    logo: { src: "/logos/devcon.jpg" },
  },
  {
    org: "TUP USG Manila",
    role: "Vice Governor — College of Science Student Council",
    note: "Impacted 1,500+ students and boosted event productivity.",
    logo: { src: "/logos/usg.jpeg" },
  },
];

const techStack = [
  { name: "React", Icon: ReactIcon },
  { name: "React Native (Expo)", Icon: ExpoIcon },
  { name: "Next.js", Icon: NextIcon },
  { name: "Node.js", Icon: NodeIcon },
  { name: "TypeScript", Icon: TSIcon },
  { name: "PostgreSQL", Icon: PostgresIcon },
  { name: "Tailwind CSS", Icon: TailwindIcon },
];

const designStack = [
  { name: "Figma", Icon: FigmaIcon },
  { name: "WordPress + Elementor", Icon: WordPressIcon },
  { name: "Adobe Photoshop", Icon: PhotoshopIcon },
  { name: "Adobe Illustrator", Icon: IllustratorIcon },
];

const About = () => {
  useScrollReveal();

  return (
    <main className="min-h-screen bg-background">
      <NavBar />

      {/* Hero / Intro */}
      <section className="px-6 pt-20 md:pt-28 pb-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Portrait */}
          <div
            className="md:col-span-5 reveal-up"
            style={{ ["--delay" as any]: "100ms" }}
          >
            <div className="relative group transition-transform duration-500 ease-out hover:scale-[1.03]">
              <div className="absolute -top-4 -left-4 glass glass-pill glass-mint text-mint-foreground text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full rotate-[-6deg] z-10">
                ABOUT ME
              </div>
              <div className="absolute -bottom-4 -right-4 glass glass-pill glass-tan text-tan-foreground text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full rotate-[6deg] z-10">
                TUP MANILA
              </div>
              <div className="figma-frame rounded-2xl overflow-hidden bg-background">
                <span className="handle bl" />
                <span className="handle br" />
                <span className="handle tm" />
                <span className="handle bm" />
                <span className="handle lm" />
                <span className="handle rm" />
                <img
                  src={portrait}
                  alt="Portrait of Kien Leriss R. Serapio"
                  className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="md:col-span-7">
            <div
              className="font-script text-2xl md:text-3xl reveal-up"
              style={{ ["--delay" as any]: "200ms" }}
            >
              hi, kamusta — I'm
            </div>
            <h1
              className="mt-3 font-display font-bold text-5xl md:text-7xl tracking-tighter leading-[0.95] title-gradient reveal-up"
              style={{ ["--delay" as any]: "320ms" }}
            >
              Kien Leriss R.
              <br />
              Serapio
            </h1>

            <h2
              className="mt-6 font-display font-medium text-xl md:text-2xl tracking-tight leading-snug reveal-up"
              style={{ ["--delay" as any]: "450ms" }}
            >
              Founder & CEO of{" "}
              <span className="font-script not-italic font-normal text-2xl md:text-3xl align-middle">
                Wika PH
              </span>{" "}
              <span className="text-muted-foreground">|</span> Product Designer & Software Engineer.
            </h2>

            <p
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed reveal-fade"
              style={{ ["--delay" as any]: "600ms" }}
            >
              BS Computer Science student at <span className="text-foreground font-medium">TUP Manila</span> bridging the gap between
              high-fidelity design and scalable engineering. I obsess over the
              tiny details that make products feel inevitable.
            </p>

            <div
              className="mt-8 flex flex-wrap gap-2 reveal-fade"
              style={{ ["--delay" as any]: "750ms" }}
            >
              {[
                { t: "FOUNDER", c: "glass-yellow" },
                { t: "ENGINEER", c: "glass-green" },
                { t: "DESIGNER", c: "glass-red" },
                { t: "COMMUNITY", c: "glass-blue" },
              ].map((p) => (
                <span
                  key={p.t}
                  className={`glass glass-pill ${p.c} text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full transition-transform duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 cursor-default`}
                >
                  {p.t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center scroll-reveal">
            <div className="font-script text-2xl md:text-3xl underline decoration-1 underline-offset-4">
              the journey so far
            </div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-6xl tracking-tighter title-gradient">
              MY WORK EXPERIENCES
            </h2>
          </div>

          <ol className="mt-14 relative border-l border-border ml-3 md:ml-6 space-y-8">
            {experiences.map((e, i) => (
              <li
                key={`${e.company}-${i}`}
                className="pl-6 md:pl-10 relative scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="absolute -left-[7px] top-6 w-3 h-3 rounded-full bg-foreground" />
                <div className="glass glass-card-glow rounded-2xl p-5 md:p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015]">
                  <div className="flex items-start gap-4">
                    {e.logo.src ? (
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md overflow-hidden bg-white/10 p-2">
                        <img src={e.logo.src} alt={e.company} className="w-full h-full rounded-full object-contain" />
                      </div>
                    ) : (
                      <MonoLogo label={e.logo.label!} bg={e.logo.bg!} fg={e.logo.fg} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`glass glass-pill ${e.pillClass} text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1 rounded-full`}
                        >
                          {e.company}
                        </span>
                        <span className="text-[10px] md:text-[11px] tracking-widest text-muted-foreground">
                          {e.date}
                        </span>
                      </div>
                      <div className="font-display font-bold text-xl md:text-2xl tracking-tight">
                        {e.role}
                      </div>
                      <ul className="mt-3 space-y-1.5 text-sm md:text-base text-muted-foreground">
                        {e.bullets.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="text-foreground/60 mt-1.5 w-1 h-1 rounded-full bg-foreground/60 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center scroll-reveal">
            <div className="font-script text-2xl md:text-3xl underline decoration-1 underline-offset-4">
              giving back
            </div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-6xl tracking-tighter title-gradient">
              LEADERSHIP & COMMUNITY
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {leadership.map((l, i) => (
              <div
                key={l.org}
                className="glass glass-card-glow rounded-3xl p-6 scroll-reveal transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {l.logo.src ? (
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md overflow-hidden bg-white/10 p-2">
                    <img src={l.logo.src} alt={l.org} className="w-full h-full object-contain rounded-full" />
                  </div>
                ) : (
                  <MonoLogo label={l.logo.label!} bg={l.logo.bg!} />
                )}
                <div className="mt-4 text-[10px] font-bold tracking-widest text-muted-foreground">
                  {l.role}
                </div>
                <div className="mt-2 font-display font-bold text-lg md:text-xl tracking-tight leading-snug">
                  {l.org}
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {l.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center scroll-reveal">
            <div className="font-script text-2xl md:text-3xl underline decoration-1 underline-offset-4">
              the toolbox
            </div>
            <h2 className="mt-3 font-display font-bold text-4xl md:text-6xl tracking-tighter title-gradient">
              MY TECHNICAL SKILLS
            </h2>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div
              className="glass glass-card-glow rounded-3xl p-6 md:p-8 scroll-reveal transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
              style={{ transitionDelay: "0ms" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_hsl(var(--cyan))]" />
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground">
                  TECH STACK
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {techStack.map(({ name, Icon }) => (
                  <span
                    key={name}
                    className="glass glass-pill text-xs md:text-sm font-bold tracking-tight px-4 py-2 rounded-full inline-flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-0.5 cursor-default"
                  >
                    <Icon />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="glass glass-card-glow rounded-3xl p-6 md:p-8 scroll-reveal transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
              style={{ transitionDelay: "120ms" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink shadow-[0_0_10px_hsl(var(--pink))]" />
                <div className="text-[10px] font-bold tracking-widest text-muted-foreground">
                  DESIGN STACK
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {designStack.map(({ name, Icon }) => (
                  <span
                    key={name}
                    className="glass glass-pill glass-tan text-tan-foreground text-xs md:text-sm font-bold tracking-tight px-4 py-2 rounded-full inline-flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-0.5 cursor-default"
                  >
                    <Icon />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
