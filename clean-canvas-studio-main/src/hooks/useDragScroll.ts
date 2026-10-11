import { useEffect, type RefObject } from "react";

/**
 * Mouse drag-to-swipe for a native horizontal scroller, with momentum.
 * Touch already swipes natively; this gives mouse users the same feel.
 * - snapping is suspended while dragging and gliding, then restored so the
 *   row settles on a card
 * - a drag swallows the click that would otherwise open whatever you grabbed
 */
export function useDragScroll(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let moved = 0;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let raf = 0;

    const setGrab = (on: boolean) => {
      el.style.scrollSnapType = on ? "none" : "";
      el.style.scrollBehavior = on ? "auto" : "";
      el.style.cursor = on ? "grabbing" : "";
      el.style.userSelect = on ? "none" : "";
    };

    const glide = () => {
      velocity *= 0.94;
      el.scrollLeft -= velocity;
      if (Math.abs(velocity) > 0.4) raf = requestAnimationFrame(glide);
      else setGrab(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelAnimationFrame(raf);
      dragging = true;
      moved = 0;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      velocity = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved < 4) return;
      if (moved >= 4 && el.style.scrollSnapType !== "none") setGrab(true);
      el.scrollLeft = startLeft - dx;
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      velocity = ((e.clientX - lastX) / dt) * 16;
      lastX = e.clientX;
      lastT = now;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (moved < 4) return setGrab(false);
      raf = requestAnimationFrame(glide);
    };
    const onClick = (e: MouseEvent) => {
      if (moved >= 4) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    el.style.cursor = "";
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [ref]);
}
