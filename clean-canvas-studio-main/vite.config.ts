import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

/**
 * `virtual:writing-index`: every article's frontmatter, read at build/dev time,
 * so listing pages never bundle article bodies (those stay lazy).
 * Frontmatter values are JSON-compatible (quoted strings, arrays, numbers).
 */
const writingIndex = (): Plugin => {
  const id = "virtual:writing-index";
  const dir = path.resolve(__dirname, "src/content/writing");
  return {
    name: "writing-index",
    resolveId: (source: string) => (source === id ? "\0" + id : null),
    load(resolved: string) {
      if (resolved !== "\0" + id) return null;
      const items = fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => {
          const src = fs.readFileSync(path.join(dir, f), "utf8");
          this.addWatchFile(path.join(dir, f));
          const fm = src.slice(4, src.indexOf("\n---", 4));
          const meta: Record<string, unknown> = { slug: f.replace(/\.mdx$/, "") };
          for (const line of fm.split("\n")) {
            const m = line.match(/^([A-Za-z]+):\s*(.*)$/);
            if (!m) continue;
            try {
              meta[m[1]] = JSON.parse(m[2]);
            } catch {
              meta[m[1]] = m[2];
            }
          }
          return meta;
        });
      return `export default ${JSON.stringify(items)};`;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    // Articles in src/content/writing/*.mdx; frontmatter is exported as `frontmatter`
    { enforce: "pre" as const, ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm], providerImportSource: "@mdx-js/react" }) },
    writingIndex(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
