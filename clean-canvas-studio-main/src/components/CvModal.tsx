import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Download, X } from "lucide-react";
import { CV_PATH } from "@/data/profile";
import { getLenis } from "@/lib/lenis";
import { sfx } from "@/lib/sound";

// Tiny module store so any button on any page can open the viewer.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const openCv = () => {
  if (open) return;
  sfx("open");
  open = true;
  emit();
};

export const closeCv = () => {
  if (!open) return;
  sfx("close");
  open = false;
  emit();
};

const useCvOpen = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );

const EASE = [0.23, 1, 0.32, 1] as const;
// Rendered from the PDF; re-export these when the resume changes.
const CV_PAGES = ["/cv/resume-2026-1.webp"];

export const CvModal = () => {
  const isOpen = useCvOpen();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus after the panel has mounted
    const t = setTimeout(() => closeRef.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCv();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      returnFocus.current?.focus?.();
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cv"
          className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Kien Serapio — Resume"
          data-lenis-prevent
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close resume"
            tabIndex={-1}
            data-hover-silent
            className="no-scale absolute inset-0 cursor-default bg-white/55 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={closeCv}
          />

          {/* Panel */}
          <motion.div
            className="relative flex h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.15 } }
                : { opacity: 0, y: 16, scale: 0.98, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } }
            }
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/10 px-4 py-3 sm:px-6">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Kien Serapio — Resume 2026</div>
                <div className="text-xs text-neutral-500">Updated 2026</div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={CV_PATH}
                  download="Kien Serapio - Resume 2026.pdf"
                  data-sfx="tap"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm transition-[background-color,scale] duration-200 ease-out hover:bg-black/[0.05]"
                >
                  <Download size={15} strokeWidth={1.8} />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noreferrer"
                  data-sfx="tap"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm transition-[background-color,scale] duration-200 ease-out hover:bg-black/[0.05]"
                >
                  <ArrowUpRight size={15} strokeWidth={1.8} />
                  <span className="hidden sm:inline">New tab</span>
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeCv}
                  aria-label="Close"
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-[background-color,scale] duration-200 ease-out hover:bg-neutral-700 active:scale-[0.94] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Pages are pre-rendered images (public/cv/), so the viewer works the
                same everywhere — Android Chrome won't render a PDF in an iframe. */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain bg-neutral-100 px-3 py-4 sm:px-8 sm:py-8">
              <div className="mx-auto flex max-w-[780px] flex-col gap-4 sm:gap-6">
                {CV_PAGES.map((src, i) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`Resume page ${i + 1} of ${CV_PAGES.length}`}
                    width={1600}
                    height={2070}
                    loading={i === 0 ? "eager" : "lazy"}
                    className="block h-auto w-full rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_32px_-16px_rgba(0,0,0,0.25)]"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.12 + i * 0.07, ease: EASE }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CvModal;
