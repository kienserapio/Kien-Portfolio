/**
 * Every project on the site. Order inside each category is display order.
 * Images come from ./media.json (generated from screenshots), keyed by slug.
 */
import media from "./media.json";

export type Category = "Flagship" | "AI systems" | "Client work" | "Products & community";

export const CATEGORIES: Category[] = ["Flagship", "AI systems", "Client work", "Products & community"];

export type Status = "Live" | "On the App Store" | "Internal" | "Open source" | "In development" | "Prototype";

export type Stat = { value: number; suffix?: string; prefix?: string; label: string; decimals?: number };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  role: string;
  period: string;
  status: Status;
  /** Primary device for mockups. */
  device: "phone" | "desktop";
  url?: string;
  urlLabel?: string;
  repo?: string;
  /** One paragraph: the problem, in the user's words. */
  problem: string;
  /** One paragraph: what it does. */
  solution: string;
  who: string;
  impact: Stat[];
  features: string[];
  ai?: string;
  stack: string[];
  /** Short story beat for the home page's flagship scroll. */
  pull?: string;
};

export const projects: Project[] = [
  // ------------------------------------------------------------ Flagship
  {
    slug: "wika-ph",
    name: "Wika PH",
    tagline: "The app that teaches, and keeps alive, the languages of the Philippines.",
    category: "Flagship",
    role: "Founder & CEO",
    period: "2026 — Present",
    status: "On the App Store",
    device: "phone",
    url: "https://wikaph.com",
    urlLabel: "wikaph.com",
    problem:
      "The Philippines has more than 180 languages, yet most learning tools only teach Tagalog. Filipinos abroad lose the language of their grandparents, and kids at home grow up unable to speak their region’s own tongue.",
    solution:
      "Wika PH teaches Tagalog, Cebuano, Ilocano, Hiligaynon and Asi through short lessons, quizzes, daily streaks and leagues, designed around Filipino culture instead of a generic template. Dialecto, its voice AI tutor, lets learners practise real conversations out loud. Five languages today, expanding to ten.",
    who:
      "Learners across Luzon, Metro Manila, the Visayas and Mindanao, and the Filipino diaspora: 39% of learners are outside the Philippines, and 31% study to connect with family.",
    impact: [
      { value: 4790, label: "App Store downloads, first month" },
      { value: 2038, label: "new learners in September" },
      { value: 14356, label: "lessons completed" },
      { value: 93.5, suffix: "%", label: "average quiz accuracy", decimals: 1 },
    ],
    features: [
      "Seven-stage lessons, quizzes, XP, hearts and a shop",
      "Daily streaks, streak freezes and missions",
      "Leaderboards and leagues",
      "Translator and dictionary",
      "Dialecto: talk to an AI tutor in your target language",
      "Built with the Romblon Provincial Office to validate Asi content",
    ],
    ai: "Dialecto pairs speech-to-text with Cartesia’s real-time voices so learners can hold a spoken conversation in a regional language and get corrected as they go.",
    stack: ["React Native", "Expo", "TypeScript", "Supabase", "Cartesia", "Groq", "Zustand", "TanStack Query"],
    pull: "4,790 downloads and 2,038 new learners in its first month. 39% of them are outside the Philippines.",
  },
  {
    slug: "dialecto",
    name: "Dialecto",
    tagline: "An offline AI tutor that speaks six Philippine languages. No internet, no cloud.",
    category: "Flagship",
    role: "Solo builder",
    period: "Oct 2026",
    status: "Open source",
    device: "phone",
    repo: "https://github.com/kienserapio/Dialecto",
    problem:
      "In 2024, Republic Act 12027 ended mother-tongue instruction from Kindergarten to Grade 3, so many children now start school in a language they don’t speak at home. About 12,000 public schools have no internet, and mainstream AI barely speaks Cebuano, let alone Bikol or Kapampangan.",
    solution:
      "Dialecto puts a tutor in the room that answers a child in their own language and reads it aloud, with no connection. Children ask Hari, a Philippine eagle chick, anything. Every regional word can be tapped for its meaning and sound. Teachers turn any topic or PDF module into a read-along lesson and quiz in seconds.",
    who:
      "K–3 learners and their teachers, especially in classrooms with no internet and in communities whose language was left out when mother-tongue instruction ended.",
    impact: [
      { value: 6, label: "Philippine languages, spoken aloud" },
      { value: 89050, label: "dictionary entries grounding every answer" },
      { value: 24963, label: "example sentence pairs" },
      { value: 0, prefix: "₱", label: "per question. Runs entirely on-device" },
    ],
    features: [
      "Ask Hari: answers in the child’s language with English underneath, read aloud",
      "Tap any word for its dictionary meaning and pronunciation",
      "Read-along lessons and quizzes with stars and badges",
      "Teachers: make a lesson from any topic, or from a PDF module",
      "Edit or regenerate any sentence, so the teacher stays in control",
      "Tagalog 36,420 · Cebuano 17,415 · Bikol 14,476 · Kapampangan 8,122 · Ilocano 6,663 · Hiligaynon 5,954 words",
    ],
    ai: "Google Gemma runs locally: Gemma 4 on a laptop CPU through Ollama, or Gemma 2 2B inside the browser on WebGPU. Small models are weak in low-resource languages, so every request retrieves matching dictionary entries and real sentences and grounds the answer in them. The words used are shown on screen. Meta MMS-TTS voices speak all six languages.",
    stack: ["React 19", "TypeScript", "WebLLM", "WebGPU", "Ollama", "Gemma", "FastAPI", "SQLite FTS5", "MMS-TTS", "PWA"],
    pull: "89,050 dictionary entries, six languages, and zero internet required. A tutor for the classrooms the cloud can’t reach.",
  },
  {
    slug: "atlas",
    name: "ATLAS",
    tagline: "The operating system for Equilife Medical, built to replace spreadsheets and paper slips.",
    category: "Flagship",
    role: "Lead Software Developer",
    period: "2026",
    status: "Internal",
    device: "desktop",
    problem:
      "Equilife rents ICU equipment pay-per-use to about 50 hospitals. Its operations ran on Dynamics 365 for inventory, Google Sheets for nearly everything else, and handwritten charge slips and delivery receipts, about 3,000 paper documents per hospital cycle. Machines went unaccounted for, stock didn’t match, and billing leaked revenue.",
    solution:
      "ATLAS puts the whole company on one offline-first platform: warehouse and inventory, QR-tagged parts and assets, fleet census, logistics and dispatch, preventive and corrective maintenance, hospital portal, purchase-to-pay, billing and finance, with approvals routed to the right department and audit trails throughout.",
    who:
      "Every department at Equilife, from warehouse staff and drivers to biomedical engineers, finance and management, and the hospitals they serve.",
    impact: [
      { value: 88, suffix: "%", label: "less time on routine operational tasks" },
      { value: 207614, label: "records migrated from 62 spreadsheets" },
      { value: 9790, label: "assets tracked in real time" },
      { value: 17, label: "departments on one system" },
    ],
    features: [
      "Ten integrated modules: ERP, inventory and assets, logistics and warehouse, maintenance, billing and revenue",
      "QR labels and phone-camera scanning for every part and machine",
      "Offline-first PWA: drivers and engineers keep working with no signal and sync later",
      "Processor and approver seats per department, row-level security on every table",
      "Live dashboards, census and audit trails replace end-of-month reconciliation",
      "1,604 automated tests across 117 database migrations",
    ],
    ai: "Document intelligence reads receipts and invoices with OCR and files them automatically. A retrieval pipeline over engineering manuals helps engineers diagnose defective equipment. Predictive analytics forecast demand and flag machines due for maintenance before they fail.",
    stack: ["Next.js", "React 19", "TypeScript", "Supabase", "PostgreSQL", "pgvector", "RAG", "OCR", "Serwist PWA", "Tailwind"],
    pull: "Routine work that took two hours now takes under ten minutes. 207,614 records moved out of spreadsheets and onto one platform.",
  },
  {
    slug: "everythingos",
    name: "EverythingOS",
    tagline: "An AI-native company brain: booking, CRM, websites, design and payments in one place.",
    category: "Flagship",
    role: "Founder & builder",
    period: "2026",
    status: "In development",
    device: "desktop",
    url: "https://everythingos-landing.vercel.app",
    urlLabel: "everythingos-landing.vercel.app",
    problem:
      "Small businesses in the Philippines juggle a booking app, a CRM, a website builder, a design tool and GCash screenshots, and none of them know anything about the business. Every tool asks the owner to start from a blank page.",
    solution:
      "EverythingOS is one suite of 30+ apps across 8 categories that share one brain. EveryBooking runs appointments with a built-in CRM, EverySite publishes fast websites, EveryDesign makes on-brand marketing material, and EveryPay takes GCash payments. They all share the business’s data, branding and context.",
    who: "Small and growing businesses, from salons and sports courts to clinics, that need to look professional without hiring an agency.",
    impact: [
      { value: 30, suffix: "+", label: "apps in one suite" },
      { value: 13000, suffix: "+", label: "design elements in the library" },
      { value: 112, label: "template families" },
      { value: 1272, label: "unit tests" },
    ],
    features: [
      "EveryBooking with CRM, Paste-to-Book and AI migration from old tools",
      "EverySite: on-brand websites, pages under 10 kB",
      "EveryDesign: Konva editor, brand kit from your logo, PSD and print-PDF export",
      "On-device background removal",
      "37 prompt-injection evaluations guard the AI layer",
    ],
    ai: "A compiler, not a generator. The AI reads the business’s data, branding and context, then outputs a validated design spec that can only choose from real templates, canvases, palettes and font pairs and bind them to real business records. A deterministic layout solver places everything. No image generation, just composition from pre-existing design elements.",
    stack: ["Next.js", "React 19", "Turborepo", "Supabase", "Drizzle", "Konva", "ONNX Runtime Web", "Groq", "Tailwind"],
    pull: "AI that composes instead of generates: real templates and real brand assets, laid out by a solver.",
  },
  {
    slug: "onetup",
    name: "OneTUP",
    tagline: "A better TUP website and a student super-app, in one.",
    category: "Flagship",
    role: "Solo builder",
    period: "2026",
    status: "Live",
    device: "desktop",
    url: "https://onetup-app.vercel.app",
    urlLabel: "onetup-app.vercel.app",
    repo: "https://github.com/kienserapio/OneTUP",
    problem:
      "A TUP student’s life is spread across systems that don’t talk to each other: the schedule behind a portal login, deadlines across half a dozen group chats, grades computed by hand, cuts tracked from memory. Commuting is guesswork because maps don’t know jeepney routes or the student fare.",
    solution:
      "OneTUP brings classes, attendance cuts, grades with a what-if planner, deadlines, announcements, commute routes and fares, and flashcards into one offline-first app, plus a public campus guide with a 360° tour that the official site never had.",
    who: "The 15,000 students of TUP Manila, from freshmen finding their first room to commuters planning around the first jeep.",
    impact: [
      { value: 10, label: "modules in one app" },
      { value: 12, label: "AI features, all grounded" },
      { value: 557, label: "automated tests" },
      { value: 0, label: "passwords stored, enforced in CI" },
    ],
    features: [
      "Schedule import with no stored credentials",
      "Attendance cuts counted against the real limit",
      "GWA and a what-if grade planner",
      "Commute: real routes and fares that work back to a wake-up time",
      "Campus map, room codes and a 360° tour",
      "Spaced-repetition flashcards and study tools",
    ],
    ai: "Twelve AI features turn screenshots of announcements into deadlines, answer campus questions from a grounded knowledge base, and generate flashcards. The rule: models interpret, they never compute. Every grade, fare and date comes from tested code.",
    stack: ["Next.js 16", "TypeScript", "Supabase", "IndexedDB", "OpenRouter", "Playwright", "Leaflet", "PWA"],
    pull: "Ten modules for 15,000 students, and an AI that interprets but never does the math.",
  },
  {
    slug: "wika-hq",
    name: "Wika HQ",
    tagline: "The company’s whole workspace in one dashboard, with an AI teammate built in.",
    category: "Flagship",
    role: "Founder & builder",
    period: "2026",
    status: "Internal",
    device: "desktop",
    problem:
      "A startup team of founders and interns was running on ClickUp, group chats, Telegram stand-ups, scattered docs and a dozen analytics tabs. Context lived everywhere except where the work happened.",
    solution:
      "Wika HQ centralizes everything the team needs in one place: chat, tasks, calendar, sprints and stand-ups, docs, whiteboard, OKRs, CRM, email, articles, applicants, app analytics, learner insights, the course editor and runway, each gated by role.",
    who: "The Wika PH team: six founders and seven interns across engineering, design, marketing and operations.",
    impact: [
      { value: 33, label: "tools in one workspace" },
      { value: 185, label: "API routes" },
      { value: 13, label: "teammates on one login" },
      { value: 45, label: "pages, gated by role" },
    ],
    features: [
      "Chat, tasks, calendar with Google sync, sprints and stand-ups",
      "Docs and wiki, whiteboard, OKRs and phase progress",
      "Feedback inbox that turns threads into tickets",
      "App Store analytics, active users and learner insights",
      "Course editor for lesson content",
      "Role-based access per module: off, view or edit",
    ],
    ai: "Ask Wika answers questions about the company with permission-scoped, read-only tools. /catchup summarizes what you missed, threads become tickets, and Email Studio drafts outreach. An MCP server lets Claude or Cursor operate HQ directly.",
    stack: ["Next.js", "React", "Neon", "Supabase", "TipTap", "Groq", "MCP", "Vercel Cron", "PWA"],
    pull: "33 tools, one login. The team stopped switching apps and started shipping.",
  },

  // ---------------------------------------------------------- AI systems
  {
    slug: "devcon-agent-kit",
    name: "DEVCON Agent Kit",
    tagline: "One idea in; a PRD, user flow, architecture record and design system out.",
    category: "AI systems",
    role: "AI Engineering Intern, NMBLR",
    period: "Jul 2026",
    status: "Live",
    device: "desktop",
    url: "https://devcon-agent.vercel.app",
    urlLabel: "devcon-agent.vercel.app",
    problem:
      "DEVCON’s interns lost days turning an idea into the documents a team needs before writing code, and every AI tool wanted its own prompts.",
    solution:
      "A portable kit of agent skills that turns one idea into a product requirements doc, user flow, architecture decision record and design system, ready for the intern team to plan from.",
    who: "DEVCON Philippines’ intern program and the chapters that build with it.",
    impact: [
      { value: 4, label: "planning artifacts from one prompt" },
      { value: 3, label: "AI coding tools supported" },
      { value: 2, label: "layers: portable core + thin adapters" },
    ],
    features: [
      "Two-layer architecture: skills live in a portable core",
      "Thin adapters for Claude Code, Cursor and OpenCode",
      "A read-only validator checks each artifact, with one retry",
      "Diagrams rendered by a script, not hallucinated by the model",
    ],
    ai: "Agentic workflows with a validator loop. The model drafts, a separate read-only agent checks the draft against the spec, and deterministic scripts handle anything that must be exact.",
    stack: ["Claude Code", "Cursor", "OpenCode", "Python", "Markdown skills"],
  },
  {
    slug: "logmark-ai",
    name: "LogMark AI",
    tagline: "Search everything you’ve ever bookmarked, by meaning.",
    category: "AI systems",
    role: "Solo builder",
    period: "2026",
    status: "Prototype",
    device: "desktop",
    problem: "Bookmarks on X and YouTube pile up into a list nobody ever searches again.",
    solution:
      "LogMark collects your X and YouTube bookmarks, summarizes each one, and lets you search them semantically, by what they were about rather than the words in the title.",
    who: "People who save more than they can remember.",
    impact: [],
    features: ["Bookmark ingestion from X and YouTube", "AI summaries per item", "Semantic search over embeddings"],
    ai: "Gemini summarizes and embeds every bookmark; pgvector powers similarity search.",
    stack: ["React", "Vite", "Flask", "Supabase", "pgvector", "Gemini"],
  },

  // --------------------------------------------------------- Client work
  {
    slug: "kpve",
    name: "KPVE",
    tagline: "An agency website with a full CRM and client portal behind it.",
    category: "Client work",
    role: "Software Developer",
    period: "2026",
    status: "Live",
    device: "desktop",
    url: "https://kpve.com",
    urlLabel: "kpve.com",
    problem: "An Australian venture studio ran leads, invoices and client updates across inboxes and spreadsheets.",
    solution:
      "A fast marketing site backed by a CRM: lead pipeline, MRR and ARR dashboards, invoices, a client portal, payment-ready checkout and a nightly AutoPay job.",
    who: "KPVE’s team and its clients across Australia.",
    impact: [{ value: 20, label: "data tables behind one website" }],
    features: ["Lead pipeline", "MRR / ARR dashboards", "Invoices and AutoPay", "Client portal", "Case-study CMS"],
    stack: ["Next.js 16", "TypeScript", "Drizzle", "Neon", "Stripe"],
  },
  {
    slug: "kap-group",
    name: "KAP Group",
    tagline: "A marketing site, staff admin and investor app for a property investment firm.",
    category: "Client work",
    role: "Software Developer",
    period: "2026",
    status: "In development",
    device: "phone",
    problem: "Investors wanted their portfolio, documents and signatures in one secure place, not in email threads.",
    solution: "A marketing site with project pages, a staff admin and an iOS investor app with Face ID, 2FA, a wallet and e-signing.",
    who: "An Australian property investment firm and its investors.",
    impact: [],
    features: ["Investor app with Face ID and 2FA", "Wallet and e-signing", "Project pages and staff admin"],
    stack: ["Next.js", "Expo", "Neon", "Resend"],
  },
  {
    slug: "sda-rentals",
    name: "SDA Rentals",
    tagline: "Tenancy for Specialist Disability Accommodation, from application to signature.",
    category: "Client work",
    role: "Software Developer",
    period: "2026",
    status: "In development",
    device: "phone",
    problem: "Disability housing tenancies involve many parties and a lot of paper.",
    solution: "A mobile app for tenants and landlords with listings, applications and in-app e-signing with an audit trail.",
    who: "SDA tenants, their supporters and housing providers in Australia.",
    impact: [],
    features: ["Tenant and landlord apps", "Applications", "E-signing with audit trail"],
    stack: ["Expo", "React Native", "TypeScript"],
  },
  {
    slug: "doc-on-call",
    name: "Doc On Call",
    tagline: "Patient app, clinic dashboard and an AI receptionist for an Australian health group.",
    category: "Client work",
    role: "Software Developer (team)",
    period: "2026",
    status: "In development",
    device: "phone",
    problem: "Clinics lose time to phone bookings and fragmented patient follow-up.",
    solution:
      "A patient app for appointments, a clinic dashboard and an AI receptionist, plus the Recovery Suites brand site.",
    who: "Patients and clinic staff across the group’s Australian practices.",
    impact: [],
    features: ["Appointments and reminders", "Clinic dashboard", "AI receptionist", "Recovery Suites website"],
    stack: ["Flutter", "Next.js"],
  },
  {
    slug: "rare-gem",
    name: "Rare Gem Exchange",
    tagline: "A luxury gemstone marketplace: landing site, backend and mobile app.",
    category: "Client work",
    role: "Software Developer",
    period: "2026",
    status: "In development",
    device: "phone",
    problem: "Buying rare gems online needs trust, provenance and a premium feel.",
    solution: "A polished landing site, a backend and an Expo app for browsing and acquiring certified stones.",
    who: "Collectors and investors.",
    impact: [],
    features: ["Premium onboarding", "Catalog and provenance", "Mobile app and website"],
    stack: ["Expo", "Next.js", "TypeScript"],
  },
  {
    slug: "bytheway",
    name: "ByTheWay",
    tagline: "A marketplace of AI personas you can chat with and hear.",
    category: "Client work",
    role: "Mobile developer (team)",
    period: "2026",
    status: "In development",
    device: "phone",
    url: "https://btw.chat",
    urlLabel: "btw.chat",
    problem: "Creators want AI versions of themselves that sound like them and know their work.",
    solution: "A persona-chat marketplace with retrieval-grounded personas and real-time voice, built as a team for a client.",
    who: "Creators and their audiences.",
    impact: [],
    features: ["Persona marketplace", "Grounded chat", "Real-time voice"],
    ai: "Retrieval-augmented personas with Cartesia voices.",
    stack: ["Expo", "Fastify", "Turborepo", "Cartesia"],
  },

  // ----------------------------------------------- Products & community
  {
    slug: "superkick",
    name: "Superkick",
    tagline: "Every free, legal wrestling match on YouTube, indexed.",
    category: "Products & community",
    role: "Solo builder",
    period: "2026",
    status: "Live",
    device: "desktop",
    url: "https://superkick-blond.vercel.app",
    urlLabel: "superkick-blond.vercel.app",
    problem: "Promotions upload thousands of full matches for free, but there’s no way to find them by wrestler, show or promotion.",
    solution: "Superkick ingests official channels nightly and matches every video to the wrestlers in it.",
    who: "Wrestling fans who want to watch legally.",
    impact: [
      { value: 1439, label: "matches indexed" },
      { value: 5, label: "promotions" },
      { value: 99.6, suffix: "%", label: "of wrestlers matched", decimals: 1 },
    ],
    features: ["Nightly ingest", "Wrestler matching", "Browse by promotion, show and wrestler"],
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel Cron"],
  },
  {
    slug: "devcon-plus",
    name: "DEVCON+",
    tagline: "The member platform for DEVCON Philippines’ 11 chapters.",
    category: "Products & community",
    role: "Contributor: design system, features, mobile",
    period: "2025 — 2026",
    status: "Live",
    device: "desktop",
    url: "https://devcon.plus",
    urlLabel: "devcon.plus",
    problem: "A nationwide developer community ran events, points and jobs across forms and spreadsheets.",
    solution:
      "One platform for members: QR check-in, points, missions, a jobs board and an admin panel. I built the design system, Missions, the Jobs Board and the Expo mobile port.",
    who: "DEVCON’s 60,000+ community members across 11 chapters.",
    impact: [
      { value: 11, label: "chapters nationwide" },
      { value: 40, suffix: "%", label: "faster design-to-prototype" },
      { value: 24, label: "screens in the mobile port" },
    ],
    features: ["QR event check-in", "Points and missions", "Jobs board", "Admin panel"],
    stack: ["React 19", "Vite", "NestJS", "Supabase", "Firebase Auth", "Expo"],
  },
  {
    slug: "eclipse",
    name: "Eclipse",
    tagline: "A 2D platformer with a dual-state physics engine, built in 48 hours.",
    category: "Products & community",
    role: "Game developer (team)",
    period: "Global Game Jam 2026",
    status: "Live",
    device: "desktop",
    url: "https://kamiyon-studio.itch.io/eclipse",
    urlLabel: "itch.io",
    problem: "Make a game around the jam’s theme in a weekend.",
    solution: "A platformer where the world flips between two physical states, and so do the puzzles.",
    who: "Players. It won Most Fun Game at the CIIT site.",
    impact: [{ value: 48, label: "hours from idea to game" }],
    features: ["Dual-state physics", "Puzzle platforming"],
    stack: ["Godot"],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

export const flagships = projects.filter((p) => p.category === "Flagship");

// ------------------------------------------------------------- Media

export type MediaImage = { src: string; alt: string; kind: "desktop" | "phone" | "poster"; w: number; h: number };
export type ProjectMedia = {
  cover?: string;
  /** Square app icon / brand mark. */
  logo?: string;
  images: MediaImage[];
  video?: { src: string; poster: string; w: number; h: number };
};

const MEDIA = media as unknown as Record<string, ProjectMedia | undefined>;

export const mediaFor = (slug: string): ProjectMedia => MEDIA[slug] ?? { images: [] };

type Extras = {
  headshot?: MediaImage;
  press?: Record<string, MediaImage | undefined>;
  awards?: Record<string, MediaImage | undefined>;
};

export const extras = (MEDIA as unknown as { _extras?: Extras })._extras ?? {};
