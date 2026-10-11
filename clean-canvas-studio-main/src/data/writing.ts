/**
 * Articles live as MDX in src/content/writing/<slug>.mdx. Frontmatter is read
 * eagerly (it's tiny); article bodies are code-split and load on demand.
 *
 * To publish: add a new .mdx file with the same frontmatter shape. Cross-post
 * to Medium with "Import a story" so Medium's canonical points back here.
 */
import type { ComponentType } from "react";
import index from "virtual:writing-index";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  coverAlt?: string;
  coverCaption?: string;
  tags: string[];
  readingMinutes: number;
  originalUrl?: string;
};

const bodies = import.meta.glob<{ default: ComponentType<{ components?: Record<string, unknown> }> }>(
  "../content/writing/*.mdx",
);

const slugOf = (path: string) => path.split("/").pop()!.replace(/\.mdx$/, "");

export const articles: ArticleMeta[] = (index as ArticleMeta[])
  .map((a) => ({ ...a, title: a.title.replace(/\.$/, "") }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

export const loadArticle = (slug: string) => {
  const entry = Object.entries(bodies).find(([path]) => slugOf(path) === slug);
  return entry ? entry[1]() : Promise.reject(new Error(`No article: ${slug}`));
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
