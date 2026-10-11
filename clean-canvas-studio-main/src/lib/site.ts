/**
 * Single source of truth for anything that ends up in a <head> tag, a sitemap,
 * or a piece of structured data. Change the domain here and everywhere follows.
 */
export const SITE_URL = "https://kienserapio.com";

export const SITE_NAME = "Kien Serapio";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const OG_IMAGE_ALT =
  "Kien Serapio — Founder, AI Engineer, Software Developer. PH100 Brightest Minds Under 30.";

export const PERSON_ID = `${SITE_URL}/#person`;

export const SOCIAL_LINKS = [
  "https://www.linkedin.com/in/kienserapio",
  "https://github.com/kienserapio",
  "https://www.facebook.com/kienserapio28",
  "https://medium.com/@kienserapio",
];

/** Absolute URL for a route path such as "/" or "/about". */
export const absoluteUrl = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
