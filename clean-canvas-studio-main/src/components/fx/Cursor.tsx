import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

/** Anything you can click turns the arrow into a hand. */
const CLICKABLE =
  'a, button, [role="button"], [role="tab"], [role="link"], summary, label, select, [data-hover], [data-cursor="pointer"]';
/** Text fields keep the native I-beam; the custom cursor steps aside. */
const TEXT = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Graphite fill, white rim, soft drop shadow: shared by both shapes. */
const SHADOW = "drop-shadow(0 1.5px 2px rgba(0,0,0,0.18))";

const Arrow = () => (
  <svg width="25" height="27" viewBox="0 0 50 54" fill="none" style={{ filter: SHADOW }}>
    <path
      d="M42.68 41.15L27.51 6.8c-.78-1.77-3.3-1.77-4.12 0L7.6 41.15c-.84 1.83.93 3.74 2.81 3.05l13.97-5.15c.5-.19 1.06-.19 1.57 0l13.87 5.15c1.87.69 3.67-1.22 2.87-3.05z"
      fill="#1d1d1f"
      stroke="#fff"
      strokeWidth={3.2}
      strokeLinejoin="round"
    />
  </svg>
);

const Hand = () => (
  <svg width="29" height="29" viewBox="0 0 28 28" fill="none" style={{ filter: SHADOW }}>
    <path
      transform="translate(1.2 1.2)"
      d="M7.6 12.8V4.1a2.05 2.05 0 0 1 4.1 0v5.6a1.85 1.85 0 0 1 3.7 0v.8a1.85 1.85 0 0 1 3.7 0v.9a1.7 1.7 0 0 1 3.4 0v3.9c0 4.2-3.1 7.4-7.3 7.4h-2c-2.4 0-3.9-.8-5.4-2.3l-3.8-3.9a1.75 1.75 0 0 1 2.5-2.5z"
      fill="#1d1d1f"
      stroke="#fff"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </svg>
);

const MORPH = { type: "spring", bounce: 0.35, visualDuration: 0.28 } as const;

/**
 * Desktop-only custom cursor. Small, tracks tightly (no floaty lag), turns to
 * face the direction of travel, and morphs into a hand over anything
 * clickable. Squishes on press. Hidden on touch, over text fields, and when
 * the pointer leaves the window.
 */
const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"arrow" | "hand" | "text">("arrow");
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 1600, damping: 70, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 1600, damping: 70, mass: 0.3 });
  // the arrow turns to face where it's going (the original smooth-cursor effect)
  const rotate = useSpring(0, { stiffness: 900, damping: 70 });
  const last = useRef({ x: 0, y: 0, t: 0, angle: 0, acc: 0 });

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => {
      setEnabled(mq.matches);
      document.documentElement.classList.toggle("smooth-cursor", mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      document.documentElement.classList.remove("smooth-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let current: Element | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const now = performance.now();
      const l = last.current;
      const dt = Math.max(1, now - l.t);
      const vx = (e.clientX - l.x) / dt;
      const vy = (e.clientY - l.y) / dt;
      if (Math.hypot(vx, vy) > 0.15) {
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
        let diff = angle - l.angle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        l.acc += diff;
        l.angle = angle;
        rotate.set(l.acc);
      }
      l.x = e.clientX;
      l.y = e.clientY;
      l.t = now;
      setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || t === current) return;
      current = t;
      const el = t.closest?.(`${TEXT}, ${CLICKABLE}`);
      if (!el) return setMode("arrow");
      if (el.matches(TEXT)) return setMode("text");
      const disabled = (el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true";
      setMode(disabled ? "arrow" : "hand");
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y, rotate]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible && mode !== "text" ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div animate={{ scale: down ? 0.82 : 1 }} transition={{ type: "spring", stiffness: 700, damping: 28 }}>
        <AnimatePresence initial={false} mode="popLayout">
          {mode === "hand" ? (
            <motion.div
              key="hand"
              className="absolute -translate-x-1/2 -translate-y-[30%]"
              initial={{ scale: 0.4, rotate: -25, opacity: 0, filter: "blur(2px)" }}
              animate={{ scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              exit={{ scale: 0.4, rotate: 20, opacity: 0, filter: "blur(2px)" }}
              transition={MORPH}
            >
              <Hand />
            </motion.div>
          ) : (
            <motion.div
              key="arrow"
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ rotate }}
              initial={{ scale: 0.4, opacity: 0, filter: "blur(2px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              exit={{ scale: 0.4, opacity: 0, filter: "blur(2px)" }}
              transition={MORPH}
            >
              <Arrow />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Cursor;
