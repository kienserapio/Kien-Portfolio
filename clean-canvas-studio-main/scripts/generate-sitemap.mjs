// Writes public/sitemap.xml from the routes, project slugs and MDX articles.
// Runs before every build (npm "prebuild"), so new projects and posts are
// picked up automatically.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://kienserapio.com";
const today = new Date().toISOString().slice(0, 10);

const projectsSrc = readFileSync(join(root, "src/data/projects.ts"), "utf8");
const projects = [...projectsSrc.matchAll(/^\s+slug: "([^"]+)",\n\s+name: "([^"]+)"/gm)].map((m) => ({ slug: m[1], name: m[2] }));

const writingDir = join(root, "src/content/writing");
const articles = readdirSync(writingDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const src = readFileSync(join(writingDir, f), "utf8");
    const fm = src.slice(0, src.indexOf("\n---", 4));
    const get = (k) => fm.match(new RegExp(`^${k}: "(.*)"$`, "m"))?.[1];
    return { slug: f.replace(/\.mdx$/, ""), date: get("date") ?? today, title: get("title"), cover: get("cover") };
  });

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urls = [
  { loc: "/", priority: "1.0", image: ["/og-image.jpg", "Kien Serapio — Founder of Wika PH, AI Engineer & Software Developer"] },
  { loc: "/about", priority: "0.9" },
  { loc: "/work", priority: "0.9" },
  { loc: "/events", priority: "0.8" },
  { loc: "/awards", priority: "0.8" },
  { loc: "/writing", priority: "0.8" },
  ...projects.map((p) => ({ loc: `/work/${p.slug}`, priority: "0.7" })),
  ...articles.map((a) => ({ loc: `/writing/${a.slug}`, priority: "0.6", lastmod: a.date, image: a.cover ? [a.cover, a.title] : undefined })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod ?? today}</lastmod>
    <priority>${u.priority}</priority>${
      u.image
        ? `
    <image:image>
      <image:loc>${SITE}${u.image[0]}</image:loc>
      <image:title>${esc(u.image[1])}</image:title>
    </image:image>`
        : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap: ${urls.length} urls`);
