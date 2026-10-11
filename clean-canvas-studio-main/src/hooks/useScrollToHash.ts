import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToId, scrollToTop } from "@/lib/lenis";

export function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Let the page-transition enter finish before gliding to the section.
      const t = setTimeout(() => scrollToId(id), 450);
      return () => clearTimeout(t);
    }
    scrollToTop(true);
  }, [pathname, hash]);
}
