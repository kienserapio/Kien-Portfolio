import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { IconBrandFacebookFilled, IconBrandGithubFilled, IconBrandLinkedinFilled } from "@tabler/icons-react";
import { SOCIALS, NAME } from "@/data/profile";
import { sfx } from "@/lib/sound";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/events", label: "Events" },
  { to: "/awards", label: "Awards" },
  { to: "/writing", label: "Writing" },
];

const ICONS = {
  linkedin: IconBrandLinkedinFilled,
  github: IconBrandGithubFilled,
  facebook: IconBrandFacebookFilled,
} as const;

type SocialId = (typeof SOCIALS)[number]["id"];

const SPRING = { type: "spring", bounce: 0.28, visualDuration: 0.5 } as const;

const useIsTouch = () => {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    setTouch(mq.matches);
    const on = () => setTouch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return touch;
};

/**
 * The header, as an iOS Dynamic Island.
 *  - boots as a small capsule, then blooms to logo + socials
 *  - hover (or tap the logo on touch) expands it to show the pages
 *  - hovering a social icon morphs the middle into a name + handle card
 *  - hides while scrolling down, drops back in on scroll up
 */
export const Island = () => {
  const location = useLocation();
  const reduce = useReducedMotion();
  const touch = useIsTouch();
  const [booted, setBooted] = useState(false);
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState<SocialId | null>(null);
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const wasExpanded = useRef(false);

  // boot: capsule → full island, after the hero name has risen
  useEffect(() => {
    const t = window.setTimeout(() => setBooted(true), reduce ? 0 : 1150);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // close on route change
  useEffect(() => {
    setOpen(false);
    setPeek(null);
  }, [location.pathname]);

  // hide on scroll down, show on scroll up / near the top
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 80) return setHidden(false);
    if (open) return;
    if (y - prev > 6) setHidden(true);
    else if (prev - y > 6) setHidden(false);
  });

  // tap outside closes on touch
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const expanded = open;
  useEffect(() => {
    if (expanded === wasExpanded.current) return;
    wasExpanded.current = expanded;
    sfx(expanded ? "islandOpen" : "islandClose", { volume: 0.7 });
  }, [expanded]);

  const social = peek ? SOCIALS.find((s) => s.id === peek) : null;
  const mobileCard = touch && open;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-3 sm:top-4">
      <motion.nav
        ref={ref}
        aria-label="Site"
        layout
        initial={reduce ? false : { y: -70, scale: 0.6, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, scale: hidden ? 0.85 : 1, opacity: hidden ? 0 : 1 }}
        transition={{ ...SPRING, delay: booted ? 0 : 0.75 }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          setOpen(false);
          setPeek(null);
        }}
        style={{ borderRadius: mobileCard ? 28 : 999 }}
        className="pointer-events-auto relative flex max-w-full flex-col overflow-hidden bg-ink text-white shadow-[0_12px_40px_-12px_rgba(29,29,31,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]"
      >
        <motion.div layout="position" className="flex h-11 items-center gap-1 pl-2.5 pr-1.5 sm:h-12">
          {/* Logo: home on desktop, toggles the menu on touch */}
          {/* hovering the logo (not the icons) opens the pages, so the icons never jump away */}
          <motion.div
            layout="position"
            className="shrink-0"
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
          >
            {touch ? (
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className="no-scale flex h-8 w-8 items-center justify-center rounded-full"
                data-sfx="none"
              >
                <img src="/brand/k-white.png" alt="" width={20} height={18} className="h-[18px] w-auto" />
              </button>
            ) : (
              <Link to="/" aria-label={`${NAME}, home`} className="no-scale flex h-8 w-8 items-center justify-center rounded-full" data-sfx="navigate">
                <img src="/brand/k-white.png" alt="" width={20} height={18} className="h-[18px] w-auto" />
              </Link>
            )}
          </motion.div>

          {/* Middle: idle spacer → page links while hovered (desktop) */}
          <motion.div
            layout
            className="flex min-w-[1.25rem] items-center justify-center overflow-hidden sm:min-w-[2.5rem]"
            onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {open && !touch ? (
                <motion.ul
                  key="nav"
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  exit={{ opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-0.5 px-2"
                >
                  {NAV.map((n) => {
                    const active = n.to === "/" ? location.pathname === "/" : location.pathname.startsWith(n.to);
                    return (
                      <li key={n.to}>
                        <Link
                          to={n.to}
                          data-sfx="navigate"
                          className={`no-scale relative block rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                            active ? "text-white" : "text-white/55 hover:text-white"
                          }`}
                        >
                          {active && (
                            <motion.span layoutId="island-active" className="absolute inset-0 rounded-full bg-white/15" transition={SPRING} />
                          )}
                          <span className="relative">{n.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Socials: plain elements, CSS-only hover, so nothing re-lays-out under the pointer */}
          <motion.ul
            layout="position"
            initial={false}
            animate={{ opacity: booted ? 1 : 0, width: booted ? "auto" : 0 }}
            transition={SPRING}
            className="flex shrink-0 items-center gap-0.5 overflow-hidden"
            onPointerLeave={() => setPeek(null)}
          >
            {SOCIALS.map((s) => {
              const Icon = ICONS[s.id];
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.label}: ${s.handle}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setPeek(s.id)}
                    onFocus={() => setPeek(s.id)}
                    onBlur={() => setPeek(null)}
                    data-sfx="tap"
                    className="no-scale flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-[color,background-color,transform] duration-150 ease-out hover:scale-110 hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>

        {/* Touch: the island opens into a card of pages */}
        <AnimatePresence initial={false}>
          {mobileCard && (
            <motion.ul
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={SPRING}
              className="grid w-[min(20rem,calc(100vw-1.5rem))] grid-cols-2 gap-1 px-2 pb-2"
            >
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    data-sfx="navigate"
                    className={`no-scale block rounded-2xl px-4 py-3 text-[15px] ${
                      location.pathname === n.to ? "bg-white/15 text-white" : "text-white/70"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
      <AnimatePresence>
        {social && !hidden && (
          <motion.div
            key="peek"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute top-[3.6rem] flex items-center gap-2 whitespace-nowrap rounded-full bg-ink/90 px-3.5 py-1.5 text-[12px] text-white shadow-[0_8px_24px_-10px_rgba(29,29,31,0.5)] backdrop-blur-md sm:top-[3.85rem]"
          >
            <span className="font-medium">{NAME}</span>
            <motion.span key={social.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/55">
              {social.label} · {social.handle}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Island;
