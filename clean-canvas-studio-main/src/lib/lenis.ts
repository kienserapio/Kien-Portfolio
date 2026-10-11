import Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
  // handy for poking at scroll-driven sections from the console in dev
  if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis | null }).__lenis = l;
};

export const getLenis = () => instance;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Smooth-scroll to an element id (Lenis if running, native otherwise). */
export function scrollToId(id: string, offset = 0, tries = 40) {
  const el = document.getElementById(id);
  // sections below the fold are lazy-loaded; wait a few frames for them
  if (!el) {
    if (tries > 0) requestAnimationFrame(() => scrollToId(id, offset, tries - 1));
    return;
  }
  if (instance) {
    instance.scrollTo(el, { offset, duration: 1.4, easing: easeOutExpo });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTop(immediate = false) {
  if (instance) instance.scrollTo(0, { immediate, duration: 1.4, easing: easeOutExpo });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}
