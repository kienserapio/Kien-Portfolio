import { useEffect } from "react";
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_ALT,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
} from "@/lib/site";

type JsonLd = Record<string, unknown>;

type SeoProps = {
  /** Full <title>, already including the name. */
  title: string;
  description: string;
  /** Route path, e.g. "/" or "/about". Used for canonical and og:url. */
  path: string;
  type?: "website" | "profile" | "article";
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  /** Route-scoped structured data, injected alongside the site-wide graph in index.html. */
  jsonLd?: JsonLd;
};

/** Marks every tag this component owns so route changes can replace them cleanly. */
const OWNED = "data-seo";

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(OWNED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    el.setAttribute(OWNED, "");
    document.head.appendChild(el);
  }
  el.href = href;
};

const Seo = ({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt = OG_IMAGE_ALT,
  noIndex = false,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const url = absoluteUrl(path);

    document.title = title;
    upsertCanonical(url);

    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "robots",
      noIndex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", imageAlt);
    upsertMeta("property", "og:locale", "en_PH");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:site", TWITTER_HANDLE);
    upsertMeta("name", "twitter:creator", TWITTER_HANDLE);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:image:alt", imageAlt);
  }, [title, description, path, type, image, imageAlt, noIndex]);

  useEffect(() => {
    if (!jsonLd) return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(OWNED, "route");
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
};

export default Seo;
