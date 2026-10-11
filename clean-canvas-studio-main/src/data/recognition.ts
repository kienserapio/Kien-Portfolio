/**
 * Awards, talks, events and press. `image` is optional: anything without one
 * renders a tasteful placeholder until a real photo is added to /public.
 */

// ------------------------------------------------------------- Awards

export type Award = {
  id: string;
  title: string;
  org: string;
  date: string;
  /** Shown on the home page as a comet card. */
  featured?: boolean;
  project?: string;
  note?: string;
  url?: string;
  image?: string;
};

export const awards: Award[] = [
  {
    id: "ph100",
    title: "PH100 Brightest Minds Under 30",
    org: "StellarPH",
    date: "2026",
    featured: true,
    project: "Wika PH",
    note: "Named among the hundred brightest minds under 30 in the Philippines.",
    url: "https://stellarph.io/programs/ph100/2026",
  },
  {
    id: "devcamp-manila",
    title: "1st Runner-Up",
    org: "Developer Camp Manila 2026",
    date: "Mar 2026",
    featured: true,
    project: "Wika PH",
    note: "For Wika, the AI-driven Philippine language-learning app.",
    url: "https://developer.camp/2026/05/01/developer-camp-manila-2026-winners/",
    image: "/awards/devcamp-manila-2026.webp",
  },
  {
    id: "founders-live",
    title: "1st Place",
    org: "Founders Live Manila",
    date: "Jun 2026",
    featured: true,
    project: "Wika PH",
    note: "Took first place at the Manila edition of the global 99-second pitch night, for Wika PH.",
  },
  {
    id: "startup-qc-2026",
    title: "Silver Awardee",
    org: "StartUp QC Batch 3 2026",
    date: "2026",
    featured: true,
    project: "Wika PH",
    note: "Quezon City’s startup competition, Batch 3.",
  },
  {
    id: "ggj-2026",
    title: "Most Fun Game",
    org: "Global Game Jam 2026 · CIIT",
    date: "Feb 2026",
    project: "Eclipse",
    note: "A 2D platformer with a dual-state physics engine, built in 48 hours.",
    url: "https://kamiyon-studio.itch.io/eclipse",
  },
  {
    id: "aral-arcade",
    title: "Champion",
    org: "Aral Arcade Game Jam · Kwentoon & Indie Games Group Philippines",
    date: "2025",
  },
  {
    id: "ywca",
    title: "Champion, Logo Making Contest",
    org: "YWCA Philippines · Period Positive Project",
    date: "2025",
  },
  {
    id: "packethacks",
    title: "NCR Finalist, Top 4",
    org: "Packethacks 2024 · IoT",
    date: "2024",
    project: "XorBin",
    note: "An IoT smart bin that sorts and shreds metal, plastic and paper.",
  },
  {
    id: "startup-qc-2024",
    title: "Bronze Awardee",
    org: "StartUp QC 2024",
    date: "May 2024",
    project: "BEEU",
    note: "A nutrition-research mobile prototype.",
    url: "https://quezoncity.gov.ph/startup-qc-student-competition-demo-day/",
  },
];

// -------------------------------------------------------------- Talks

export type TalkKind = "Speaker" | "Judge" | "Organizer";

export type Talk = {
  id: string;
  title: string;
  event: string;
  host: string;
  date: string;
  kind: TalkKind;
  topic?: string;
  note?: string;
  url?: string;
  image?: string;
};

export const talks: Talk[] = [
  {
    id: "ai-handa-na-ba-tayo",
    title: "Panel Speaker",
    event: "AI: Handa na ba tayo?",
    host: "DEVCON Manila · Charnest Cafe, Quezon City",
    date: "Oct 2026",
    kind: "Speaker",
    note: "DEVCON Manila’s yearly celebration: a panel on how AI is shaping the way we learn, create, work and innovate.",
    url: "https://devcon.plus/events/ai-handa-na-ba-tayo-1beca6e3",
  },
  {
    id: "batstateu-catalycst",
    title: "Resource Speaker",
    event: "CatalyCSt",
    host: "Batangas State University",
    date: "Sept 2026",
    kind: "Speaker",
  },
  {
    id: "sk-pembo",
    title: "AI Ethics & Digital Skills Speaker",
    event: "Digital Skills and Career Readiness Workshop",
    host: "SK Pembo, Taguig",
    date: "Sept 2026",
    kind: "Speaker",
    note: "AI ethics: using AI responsibly, critically and ethically, plus resume building for the youth of Pembo.",
  },
  {
    id: "wika-opening-night",
    title: "Host & Founder",
    event: "Wika PH Opening Night Manila",
    host: "Wika PH · Cubao Expo",
    date: "Aug 2026",
    kind: "Organizer",
    note: "The public launch of Wika PH, with iSkolar, AWS e:Novators and Tutorials Dojo.",
  },
  {
    id: "gdgoc-plm",
    title: "Journey Talk",
    event: "GDGoC PLM General Assembly 2025",
    host: "Google Developer Groups on Campus PLM",
    date: "2025",
    kind: "Speaker",
  },
  {
    id: "sikaptala",
    title: "Hackathon Judge",
    event: "SIKAPTala Hackathon",
    host: "De La Salle University – Dasmariñas",
    date: "2026",
    kind: "Judge",
  },
  {
    id: "study-jam-2026",
    title: "Lead Organizer",
    event: "Google Study Jam 2026: Dream, Design, Develop!",
    host: "GDGoC · White Cloak, Pasig",
    date: "Mar 2026",
    kind: "Organizer",
    note: "Trained 70 builders from requirements in NotebookLM to design in Google Stitch and frontend with Flutter MCP.",
    url: "https://gdg.community.dev/events/details/google-gdg-on-campus-technological-university-of-the-philippines-manila-philippines-presents-google-study-jam-2026-dream-design-develop/",
  },
  {
    id: "caffeine-ai",
    title: "Event Volunteer Lead",
    event: "Caffeine AI Manila Hackathon",
    host: "DEVCON Philippines × ICP Hub PH",
    date: "Oct 2025",
    kind: "Organizer",
    note: "Led a 15-person volunteer team for 200+ participants and 300+ attendees.",
  },
  {
    id: "jru",
    title: "AI Resource Speaker",
    event: "AI Am Ready Seminar",
    host: "José Rizal University",
    date: "2025",
    kind: "Speaker",
  },
  {
    id: "earist",
    title: "AI Resource Speaker",
    event: "COMSA Seminar 2025",
    host: "EARIST",
    date: "2025",
    kind: "Speaker",
  },
  {
    id: "pup-unlock",
    title: "Game Development Speaker",
    event: "Unlock()",
    host: "PUP The Programmers’ Guild",
    date: "2025",
    kind: "Speaker",
  },
  {
    id: "devcon-game-on",
    title: "Game Development Speaker",
    event: "Game On Game Jam!",
    host: "DEVCON Manila",
    date: "2025",
    kind: "Speaker",
  },
  {
    id: "pup-se-day",
    title: "Ideathon Judge",
    event: "Software Engineering Day 2025",
    host: "Polytechnic University of the Philippines",
    date: "2025",
    kind: "Judge",
  },
  {
    id: "hawkathon",
    title: "Chairperson",
    event: "UI/UX Hawk-A-Thon 2025",
    host: "Designing the Future",
    date: "Mar 2025",
    kind: "Organizer",
    note: "A UI/UX hackathon for 89 participants built around the SDGs.",
  },
];

export const SPEAKING_TOPICS = [
  "Building a startup for Philippine languages",
  "Offline and on-device AI for education",
  "AI-native workflows for software teams",
  "AI ethics and career readiness for young people",
  "From idea to App Store as a young founder",
  "Designing with AI: Figma, Stitch and Claude Code",
];

// -------------------------------------------------------------- Press

export type Press = {
  id: string;
  outlet: string;
  kind: "Article" | "Radio" | "TV" | "Feature" | "Social";
  title: string;
  date: string;
  country?: string;
  url?: string;
  image?: string;
  /** Outlet wordmark colour for the placeholder tile. */
  tone?: string;
};

export const press: Press[] = [
  {
    id: "dzmm",
    outlet: "DZMM TeleRadyo",
    kind: "TV",
    title: "Magkakaibigang developer, naglunsad ng app para sa iba’t ibang wika",
    date: "Sept 2026",
    url: "https://www.facebook.com/reel/2938414476513200",
    image: "/press/dzmm.webp",
  },
  {
    id: "radyo-pilipinas",
    outlet: "Radyo Pilipinas",
    kind: "Article",
    title: "Makabagong language app na ‘Wika PH,’ inilunsad upang sagipin ang mga rehiyonal at katutubong wika sa bansa",
    date: "Oct 2026",
    url: "https://radyopilipinas.ph/2026/10/06/makabagong-language-app-na-wika-ph-inilunsad-upang-sagipin-ang-mga-rehiyonal-at-katutubong-wika-sa-bansa/",
    image: "/press/radyo-pilipinas.webp",
  },
  {
    id: "frequency-news",
    outlet: "Frequency News",
    kind: "Article",
    title: "Wika PH helps diaspora Filipinos reconnect through language",
    date: "Oct 2026",
    country: "Canada",
    url: "https://www.frequencynews.ca/news/wika-ph-helps-diaspora-filipinos-reconnect-through-language/",
    image: "/press/frequency-news.webp",
  },
  {
    id: "mabuhay-canada",
    outlet: "Mabuhay Canada",
    kind: "Article",
    title: "Wika PH helps diaspora Filipinos reconnect through language",
    date: "Oct 2026",
    country: "Canada",
    url: "https://mabuhaycanada.org/wika-ph/",
    image: "/press/mabuhay-canada.webp",
  },
  {
    id: "radyo-magasin",
    outlet: "Radyo Magasin 1278 AM",
    kind: "Radio",
    title: "Abangan ang mga nasa likod ng Wika PH (Iskultura, live)",
    date: "Oct 2026",
    url: "https://www.facebook.com/photo/?fbid=1612667347543128&set=a.341776204632255",
    image: "/press/radyo-magasin.webp",
  },
  {
    id: "iskolar-ng-bayan",
    outlet: "Iskolar ng Bayan",
    kind: "Feature",
    title: "Wika Forward",
    date: "2026",
    url: "https://www.facebook.com/photo/?fbid=1385519677069605&set=a.398337042454545",
    image: "/press/iskolar-ng-bayan.webp",
  },
  {
    id: "radar-ph",
    outlet: "radar.ph",
    kind: "Feature",
    title: "This ‘Duolingo for PH languages’ brings regional tongues to Gen Z",
    date: "2026",
    url: "https://www.facebook.com/radarphmedia/posts/pfbid0BZko1wJ5AwGjQZsq92dMiCxZeWf7rtTJW3sg71dKn7AFxwxBhXka1rtfYNAbNaxgl",
    image: "/press/radar-ph.webp",
  },
  {
    id: "philippine-coding-camp",
    outlet: "Philippine Coding Camp",
    kind: "Feature",
    title: "He struggled to learn his family’s language. Now, he’s helping others learn theirs.",
    date: "2026",
    url: "https://www.facebook.com/photo/?fbid=1605605251580159&set=a.681076720699688",
    image: "/press/philippine-coding-camp.webp",
  },
  {
    id: "science-department",
    outlet: "Science Department",
    kind: "Feature",
    title: "Feature on the Wika PH team",
    date: "2026",
    url: "https://www.facebook.com/photo.php?fbid=1536521375167580&set=a.464672842352444&type=3",
    image: "/press/science-department.webp",
  },
  {
    id: "ases-manila",
    outlet: "ASES Manila",
    kind: "Social",
    title: "Duolingo for Philippine languages?",
    date: "Sept 2026",
    url: "https://www.linkedin.com/posts/asesmanila_duolingo-for-philippine-languages-activity-7505944124940922880-zJm3",
    image: "/press/ases-manila.webp",
  },
];
