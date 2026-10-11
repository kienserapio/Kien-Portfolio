import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  BriefcaseIcon,
  HouseIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
  StackIcon,
  ChatsCircleIcon,
  TrophyIcon,
  UserIcon,
  NewspaperIcon,
  MicrophoneStageIcon,
  PenNibIcon,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { scrollToId } from "@/lib/lenis";
import { toggleSound, useSoundEnabled } from "@/lib/sound";

type Item =
  | { kind: "section"; id: string; label: string; Icon: PhosphorIcon }
  | { kind: "route"; to: string; label: string; Icon: PhosphorIcon };

const ITEMS: Item[] = [
  { kind: "section", id: "home", label: "Home", Icon: HouseIcon },
  { kind: "section", id: "about", label: "About", Icon: UserIcon },
  { kind: "section", id: "wika", label: "Wika PH", Icon: ChatsCircleIcon },
  { kind: "section", id: "recognition", label: "Recognition", Icon: TrophyIcon },
  { kind: "section", id: "press", label: "Press", Icon: NewspaperIcon },
  { kind: "section", id: "stage", label: "On stage", Icon: MicrophoneStageIcon },
  { kind: "section", id: "journey", label: "Experience", Icon: BriefcaseIcon },
  { kind: "section", id: "work", label: "Work", Icon: StackIcon },
  { kind: "section", id: "writing", label: "Writing", Icon: PenNibIcon },
];

/** Phones drop these to keep the dock inside 390px. */
const COMPACT_HIDDEN = new Set(["home", "press", "writing"]);

const SECTION_IDS = ITEMS.filter((i) => i.kind === "section").map((i) => (i as { id: string }).id);

const REACH = 130;

/** Phones get a slimmer dock (and drop "Home", the page top is one swipe away). */
function useCompact() {
  const [compact, setCompact] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setCompact(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return compact;
}

/** Which on-page section is centered in the viewport. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!enabled) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    // sections below the fold mount lazily, so keep watching for them
    const seen = new Set<Element>();
    const observeAll = () =>
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [enabled]);
  return active;
}

const DockButton = ({
  mouseX,
  base,
  label,
  active,
  onClick,
  children,
  cue = "navigate",
}: {
  mouseX: MotionValue<number>;
  base: number;
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  cue?: "navigate" | "tap" | "none";
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  // distance from the cursor to this button's center → size
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return v - b.x - b.width / 2;
  });
  const size = useSpring(useTransform(distance, [-REACH, 0, REACH], [base, base * 1.55, base]), {
    stiffness: 320,
    damping: 24,
    mass: 0.4,
  });
  const iconScale = useTransform(size, [base, base * 1.55], [1, 1.5]);

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      data-sfx={cue}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.12 }}
      className={`no-scale relative flex shrink-0 items-center justify-center rounded-full outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ink/60 ${
        active ? "text-ink" : "text-ink/45 hover:text-ink"
      }`}
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.1 } }}
            transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: "bottom center" }}
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && (
        // Liquid-glass lens: glides between items on a bouncy spring (eases in,
        // eases out, overshoots a touch), and the inner glass squashes and
        // settles like a droplet when it lands.
        <motion.span
          layoutId="dock-lens"
          aria-hidden
          className="absolute inset-0"
          transition={reduce ? { duration: 0 } : { type: "spring", visualDuration: 0.55, bounce: 0.32 }}
        >
          <motion.span
            className="liquid-lens absolute inset-0 rounded-full"
            initial={reduce ? false : { scaleX: 1.22, scaleY: 0.86 }}
            animate={{ scaleX: 1, scaleY: 1 }}
            transition={{ type: "spring", visualDuration: 0.6, bounce: 0.45 }}
          />
        </motion.span>
      )}
      <motion.span style={{ scale: iconScale }} className="relative z-10 flex">
        {children}
      </motion.span>
    </motion.button>
  );
};

export const Dock = () => {
  const mouseX = useMotionValue(Infinity);
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";
  const activeSection = useActiveSection(onHome);
  const soundOn = useSoundEnabled();
  // specular highlight that slides along the glass with the cursor
  const glintX = useSpring(useMotionValue(50), { stiffness: 200, damping: 30 });
  const glint = useMotionTemplate`radial-gradient(90px 60px at ${glintX}% 0%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)`;
  const compact = useCompact();
  const base = compact ? 38 : 44;
  const items = compact ? ITEMS.filter((i) => !(i.kind === "section" && COMPACT_HIDDEN.has(i.id))) : ITEMS;

  const go = (item: Item) => {
    if (item.kind === "route") {
      navigate(item.to);
      return;
    }
    if (onHome) {
      scrollToId(item.id);
      // keep the URL in step without triggering the route's scroll effect
      history.replaceState(null, "", item.id === "home" ? "/" : `/#${item.id}`);
    } else {
      navigate(item.id === "home" ? "/" : `/#${item.id}`);
    }
  };

  const isActive = (item: Item) =>
    item.kind === "route"
      ? location.pathname === item.to
      : onHome && activeSection === item.id;

  return (
    <motion.nav
      aria-label="Primary"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.5 }}
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6"
    >
      <motion.div
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          mouseX.set(e.clientX);
          const r = e.currentTarget.getBoundingClientRect();
          glintX.set(((e.clientX - r.left) / r.width) * 100);
        }}
        onPointerLeave={() => {
          mouseX.set(Infinity);
          glintX.set(50);
        }}
        className="liquid-glass flex max-w-full items-end gap-1 rounded-[2rem] px-2.5 py-1.5 sm:gap-1.5"
      >
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-80" style={{ backgroundImage: glint }} />
        {items.map((item, i) => (
          <div key={item.label} className="flex items-end gap-1.5 sm:gap-2">
            <DockButton
              mouseX={mouseX}
              base={base}
              label={item.label}
              active={isActive(item)}
              onClick={() => go(item)}
            >
              <item.Icon size={22} weight="fill" />
            </DockButton>
          </div>
        ))}
        <span aria-hidden className="mx-1 h-6 w-px self-center bg-black/10" />
        <DockButton
          mouseX={mouseX}
          base={base}
          label={soundOn ? "Sound on" : "Sound off"}
          active={false}
          // toggleSound plays its own cue (before muting / after unmuting)
          onClick={() => toggleSound()}
          cue="none"
        >
          {soundOn ? <SpeakerHighIcon size={22} weight="fill" /> : <SpeakerSlashIcon size={22} weight="fill" />}
        </DockButton>
      </motion.div>
    </motion.nav>
  );
};

export default Dock;
