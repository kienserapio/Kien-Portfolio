/**
 * Everything on the site that is "about Kien" lives here. Edit once; every
 * section and page follows. Projects live in ./projects.ts, talks/awards/press
 * in ./recognition.ts.
 */

export const EMAIL = "kienleriss28@gmail.com";
/** The 2026 resume. The in-site viewer shows /cv/resume-2026-*.webp, rendered from this PDF. */
export const CV_PATH = "/Kien-Serapio-Resume-2026.pdf";

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/kienserapio",
  github: "https://github.com/kienserapio",
  facebook: "https://www.facebook.com/kienserapio28",
  medium: "https://medium.com/@kienserapio",
  wika: "https://wikaph.com",
};

/** Header island: hovering an icon reveals the name and handle. */
export const SOCIALS = [
  { id: "linkedin", label: "LinkedIn", handle: "in/kienserapio", href: LINKS.linkedin },
  { id: "github", label: "GitHub", handle: "@kienserapio", href: LINKS.github },
  { id: "facebook", label: "Facebook", handle: "kienserapio28", href: LINKS.facebook },
] as const;

export const NAME = "Kien Serapio";
export const FULL_NAME = "Kien Leriss R. Serapio";

/** Gray marquee under the hero name. */
export const ROLES = [
  "Founder",
  "AI Engineer",
  "Software Developer",
  "PH100 Brightest Minds Under 30",
];

/** The formal bionote (third person), shown right after the hero. */
export const BIONOTE =
  "Kien Leriss R. Serapio is the Founder and Chief Executive Officer of Wika PH, a Philippine EdTech startup dedicated to preserving and teaching regional Filipino languages, which welcomed more than 2,000 learners in its first month on the App Store. He is recognized among StellarPH’s PH100 Brightest Minds Under 30. He works professionally as a software developer and AI engineer, specializing in automated workflows, offline and on-device AI, and enterprise systems that replace paper with software.";

// ---------------------------------------------------------------- Wika

/** Source: wikaph.com/updates/wika-ph-september-2026 (Sept 1–30, 2026, Manila time). */
export const WIKA = {
  url: "https://wikaph.com",
  appStore: "https://apps.apple.com/ph/app/wika-ph-filipino-languages/id6795520282",
  release: "https://www.wikaph.com/updates/wika-ph-september-2026",
  lede:
    "A language-learning app for the languages of the Philippines. Short lessons, quizzes and daily streaks in Tagalog, Cebuano, Ilocano, Hiligaynon and Asi, with Dialecto, a voice AI tutor you can talk to. Five languages today, expanding to ten.",
  headline: { value: 4790, label: "App Store downloads in the first month" },
  stats: [
    { value: 2038, suffix: "", label: "new learners in September" },
    { value: 14356, suffix: "", label: "lessons completed" },
    { value: 1373, suffix: "", label: "weekly active learners at peak" },
    { value: 93.5, suffix: "%", label: "average quiz accuracy", decimals: 1 },
    { value: 39, suffix: "%", label: "of learners outside the Philippines" },
    { value: 4.8, suffix: "★", label: "App Store rating", decimals: 1 },
  ],
  bullets: [
    "Built for Filipinos at home and the diaspora abroad. 31% of learners study to connect with family.",
    "More than 50× the beta’s lessons in the first month, with 94% of new sign-ups finishing onboarding.",
    "I lead a team of six across engineering, product, design and growth, and partner with the Romblon Provincial Office to validate Asi content.",
  ],
  languages: ["Tagalog", "Cebuano", "Ilocano", "Hiligaynon", "Asi"],
  stack: ["React Native Expo", "TypeScript", "Supabase", "Cartesia", "Groq"],
};

// ---------------------------------------------------------- Experience

export type Experience = {
  company: string;
  role: string;
  date: string;
  place?: string;
  bullets: string[];
  logo?: string;
  monogram?: string;
};

export const experiences: Experience[] = [
  {
    company: "Wika PH",
    role: "Founder & Chief Executive Officer",
    date: "Mar 2026 — Present",
    place: "Manila",
    logo: "/logos/icon.png",
    bullets: [
      "Founded and scaled an AI-powered language-learning platform for Philippine languages: 4,790 App Store downloads and 2,038 new learners in its first month.",
      "Built Dialecto, a conversational voice tutor for regional languages, and lead a cross-functional team of six.",
      "Partnered with the Romblon Provincial Office to validate regional language content.",
    ],
  },
  {
    company: "Equilife Medical",
    role: "Lead Software Developer",
    date: "Jul 2026 — Sept 2026",
    place: "Project-based · Philippines",
    logo: "/logos/equilife.webp",
    bullets: [
      "Led design and delivery of ATLAS, an offline-first operations platform that replaced spreadsheets and paper slips across inventory, assets, logistics, maintenance and billing.",
      "Engineered its AI layer: OCR for receipts and invoices, retrieval over engineering manuals for fault diagnosis, and demand and maintenance forecasting.",
      "Cut routine operational tasks from about 2 hours to under 10 minutes, an 88% cycle-time reduction.",
    ],
  },
  {
    company: "NMBLR AI Foundry",
    role: "AI Engineering Intern",
    date: "Jun 2026 — Jul 2026",
    place: "Salcedo, Makati",
    logo: "/logos/nmblr-mark.jpg",
    bullets: [
      "Ran structured testing and evaluation cycles for Forge, the company’s core AI technology, and supported NMBLR+ model integrations.",
      "Built NMBLR Rewards for Forge, a reusable enterprise rewards architecture for large consumer brands.",
      "Built an AI agent kit for DEVCON with a two-layer core and adapter architecture that runs across Claude Code, Cursor and OpenCode.",
    ],
  },
  {
    company: "DEVCON Philippines",
    role: "Full Stack Development Intern",
    date: "Sept 2025 — Apr 2026",
    place: "Ortigas, Pasig",
    logo: "/logos/devcon.jpg",
    bullets: [
      "Sped up design-to-prototype work by 40% with an AI-automated workflow (Claude Code, Google Stitch, Figma) that built the design system for DEVCON+, the hub for 11 nationwide chapters.",
      "Built responsive single-page apps and custom WordPress themes from Figma, improving CMS performance, schemas and SEO.",
      "Built on the Internet Computer with Caffeine AI and led the volunteer team for the Caffeine AI Manila Hackathon (200+ participants).",
    ],
  },
  {
    company: "Easybus PH",
    role: "UI/UX Intern",
    date: "Jul 2025 — Oct 2025",
    place: "Diliman, Quezon City",
    logo: "/logos/easybus.png",
    bullets: [
      "Designed booking-flow prototypes in Figma for Ohayami Trans, DLTB Co. and Raymond.",
      "Published and maintained their websites in WordPress + Elementor for 5,000+ monthly commuters.",
    ],
  },
  {
    company: "Globe Telecom",
    role: "Digital and Social Media Operations Intern",
    date: "Apr 2025 — Jul 2025",
    logo: "/logos/globe.png",
    bullets: [
      "Designed social cards and key visuals for GlobeICON and Globe of Good, reaching 300,000+ followers.",
    ],
  },
  {
    company: "Widustalk Academy",
    role: "Junior Graphic Designer",
    date: "Feb 2023 — Aug 2023",
    logo: "/logos/widustalk.jpeg",
    bullets: [
      "Designed 10+ digital and print assets weekly for four brands with a combined 9,000+ followers.",
    ],
  },
];

/** The globe: places Kien has shipped for or reached. */
export const COUNTRIES = [
  { code: "PH", name: "Philippines", location: [14.5995, 120.9842] as [number, number] },
  { code: "US", name: "United States", location: [37.7749, -122.4194] as [number, number] },
  { code: "CA", name: "Canada", location: [43.6532, -79.3832] as [number, number] },
  { code: "AU", name: "Australia", location: [-37.8136, 144.9631] as [number, number] },
  { code: "SG", name: "Singapore", location: [1.3521, 103.8198] as [number, number] },
];

export const SKILLS = {
  build: [
    "React", "React Native", "Next.js", "TypeScript", "Node.js", "Python",
    "PostgreSQL", "Supabase", "Expo", "FastAPI",
  ],
  ai: [
    "LLM integration", "RAG pipelines", "Agentic workflows", "On-device inference",
    "OCR document extraction", "Prompt engineering", "Evaluation", "Claude Code",
  ],
  design: ["Figma", "Design systems", "Framer", "Webflow", "Adobe Creative Suite"],
};
