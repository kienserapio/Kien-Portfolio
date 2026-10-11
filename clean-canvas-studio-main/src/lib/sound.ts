import { useSyncExternalStore } from "react";
import { CUES, type SfxCue } from "./sound-cues";

/**
 * UI sound engine: a self-contained Web Audio synth. No audio files, no deps.
 *
 * PALETTE (recipes live in ./sound-cues.ts)
 *   hover        tiny glassy tick for links/buttons (very quiet)
 *   hoverImage   airy "breath across glass" shimmer for photos/cards
 *   tap          light click: secondary buttons, chips, icon links
 *   press        deep "thock" for primary CTAs
 *   navigate     soft upward swish (downward with { direction: "back" })
 *   open/close   disclosure / modal: rising vs falling two-note blip
 *   islandOpen   Dynamic-Island expand: rounded bloop gliding up
 *   islandClose  Dynamic-Island collapse: bloop gliding down
 *   toggle       two-stage switch click
 *   success      small C-E-G chime (copy email, form sent)
 *   count        tiny tick for count-ups (rate-limited to one per 45 ms;
 *                pass { duration: ms } to schedule a whole eased run)
 *   swipe        papery flick for carousel steps
 *   error        gentle low "bonk" (404)
 *   pop          playful bubble pop (easter eggs)
 *
 * MARKUP (delegated; installed once by initSound())
 *   data-sfx="<cue>"         plays on pointerdown (primary button) and on
 *                            Enter/Space keydown. data-sfx="none" = silent.
 *   data-sfx-hover="<cue>"   hover sound for this element (mouse only), e.g.
 *                            data-sfx-hover="hoverImage" on photos/cards.
 *                            data-sfx-hover="none" mutes hover here.
 *   Default hover: anything matching a, button, [role="tab"], [data-hover]
 *   plays `hover`. Any ancestor with [data-hover-silent] mutes hover.
 *   Legacy: data-cuelume-tap → tap, data-cuelume-navigate → navigate.
 *
 * LATENCY
 *   One AudioContext (latencyHint "interactive") is created and resumed on
 *   the first pointerdown/keydown/touchstart anywhere (window, capture), with
 *   its noise buffer and master → compressor chain pre-built. play() schedules
 *   at ctx.currentTime immediately; it never awaits resume(). Before that
 *   first gesture there is no context and every cue is silently skipped.
 */

export type { SfxCue } from "./sound-cues";

/** Old cuelume names still accepted by `sfx()`. */
type LegacyCue = "select";

export interface SfxOptions {
  /** 0–1, multiplied into the cue's own level. */
  volume?: number;
  /** Pitch multiplier, e.g. 1.05. */
  pitch?: number;
  /** Mirrors directional cues (navigate, swipe) and nudges pitch for ticks. */
  direction?: "forward" | "back";
  /** `count` only: spread an eased run of ticks over this many ms. */
  duration?: number;
  /** Legacy cuelume emphasis; maps to a volume scale. */
  emphasis?: "subtle" | "normal" | "strong";
}

const STORAGE_KEY = "kien-sound";
const MASTER_GAIN = 0.5;
const HOVER_GAP_MS = 55;
const COUNT_GAP_MS = 45;
const NOISE_SECONDS = 1;
const CLEANUP_MARGIN_MS = 1000;

const LEGACY: Record<LegacyCue, SfxCue> = { select: "hover" };

const isCue = (name: unknown): name is SfxCue =>
  typeof name === "string" && Object.prototype.hasOwnProperty.call(CUES, name);

function resolveCue(name: string | null | undefined): SfxCue | null {
  if (!name) return null;
  if (isCue(name)) return name;
  return (LEGACY as Record<string, SfxCue>)[name] ?? null;
}

/* ------------------------------------------------------------------ */
/* Preference store                                                    */
/* ------------------------------------------------------------------ */

function readPref(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    /* storage blocked: fall through to the default */
  }
  try {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
  } catch {
    /* ignore */
  }
  return true;
}

let enabled = true;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/* ------------------------------------------------------------------ */
/* Audio graph                                                         */
/* ------------------------------------------------------------------ */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;
let suspendTimer: number | undefined;

function resume() {
  if (!ctx || ctx.state === "running" || ctx.state === "closed") return;
  try {
    void ctx.resume().catch(() => {});
  } catch {
    /* some browsers throw synchronously while audio is blocked */
  }
}

/** Create (once) and wake the shared context. Must run inside a user gesture. */
function ensureContext() {
  if (typeof window === "undefined") return;
  if (ctx) {
    resume();
    return;
  }
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;

  try {
    // iOS 16.4+: mix with (don't pause) the user's music; respect the mute switch.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session && session.type === "auto") session.type = "ambient";
  } catch {
    /* ignore */
  }

  let created: AudioContext;
  try {
    created = new Ctor({ latencyHint: "interactive" });
  } catch {
    try {
      created = new Ctor();
    } catch {
      return;
    }
  }
  ctx = created;

  // Master bus → gentle glue compressor → speakers.
  master = created.createGain();
  master.gain.value = MASTER_GAIN;
  const comp = created.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 12;
  comp.ratio.value = 3;
  comp.attack.value = 0.002;
  comp.release.value = 0.12;
  master.connect(comp).connect(created.destination);

  // Shared white noise; noise layers loop it from a random offset.
  const length = Math.max(1, Math.floor(NOISE_SECONDS * created.sampleRate));
  noiseBuffer = created.createBuffer(1, length, created.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  resume();

  // One silent sample wakes the render thread (and unlocks iOS Safari).
  try {
    const src = created.createBufferSource();
    src.buffer = created.createBuffer(1, 1, created.sampleRate);
    src.connect(created.destination);
    src.start(0);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Playback                                                            */
/* ------------------------------------------------------------------ */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const EMPHASIS: Record<NonNullable<SfxOptions["emphasis"]>, number> = { subtle: 0.6, normal: 1, strong: 1.25 };
let lastCountAt = -Infinity;

/** Schedule one cue `at` seconds from now. Never awaits. */
function play(cue: SfxCue, options?: SfxOptions, at = 0) {
  if (!enabled || !ctx || !master || !noiseBuffer || ctx.state === "closed") return;
  // Context suspended (backgrounded, interrupted)? Kick it, but schedule now:
  // the clock is frozen, so the cue plays the instant it resumes.
  if (ctx.state !== "running") resume();

  const def = CUES[cue];
  const volume =
    (typeof options?.volume === "number" && Number.isFinite(options.volume) ? clamp01(options.volume) : 1) *
    (options?.emphasis ? EMPHASIS[options.emphasis] ?? 1 : 1);
  if (volume <= 0) return;

  const dir: 1 | -1 = options?.direction === "back" ? -1 : 1;
  const callerPitch = typeof options?.pitch === "number" && options.pitch > 0 ? options.pitch : 1;
  // Ticks drop a hair for "back" so tab/filter direction is audible.
  const dirPitch = dir < 0 && (cue === "hover" || cue === "tap") ? 0.94 : 1;
  const jitter = 1 + (Math.random() * 2 - 1) * def.jitter;

  const bus = ctx.createGain();
  bus.gain.value = def.gain * volume;
  bus.connect(master);
  try {
    def.render({
      ctx,
      out: bus,
      t: ctx.currentTime + at,
      p: jitter * callerPitch * dirPitch,
      dir,
      noise: noiseBuffer,
    });
  } catch {
    /* a malformed param must never break the UI */
  }
  window.setTimeout(() => bus.disconnect(), (at + def.dur) * 1000 + CLEANUP_MARGIN_MS);
}

/** A whole count-up in one call: ticks thin out like an ease-out curve. */
function playCountRun(durationMs: number, options?: SfxOptions) {
  const total = durationMs / 1000;
  const steps = Math.min(28, Math.max(6, Math.round(total / 0.06)));
  let lastAt = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    // invert a quartic ease-out: value crosses x at this time
    const at = total * (1 - Math.pow(1 - x, 1 / 4));
    if (at - lastAt < COUNT_GAP_MS / 1000) continue;
    lastAt = at;
    const base = typeof options?.volume === "number" ? options.volume : 1;
    play("count", { ...options, volume: base * (1 - 0.4 * x), pitch: (options?.pitch ?? 1) * (1 + 0.1 * x) }, at);
  }
  lastCountAt = performance.now() + durationMs;
}

/**
 * Play a cue from code. Unknown names are ignored. Legacy cuelume names are
 * accepted (`select` → `hover`).
 */
export function sfx(name: SfxCue | LegacyCue, options?: SfxOptions) {
  const cue = resolveCue(name);
  if (!cue || !enabled || !ctx) return;
  if (cue === "count") {
    if (typeof options?.duration === "number" && options.duration > 0) {
      playCountRun(options.duration, options);
      return;
    }
    const now = performance.now();
    if (now - lastCountAt < COUNT_GAP_MS) return;
    lastCountAt = now;
  }
  play(cue, options);
}

/* ------------------------------------------------------------------ */
/* DOM bindings                                                        */
/* ------------------------------------------------------------------ */

const TAP_TARGET = "[data-sfx], [data-cuelume-tap], [data-cuelume-navigate]";
const HOVER_TARGET = '[data-sfx-hover], a, button, [role="tab"], [data-hover]';

const isDisabled = (el: Element) =>
  (el as HTMLButtonElement).disabled === true || el.getAttribute("aria-disabled") === "true";

function tapCueFor(el: Element): SfxCue | null {
  const explicit = el.getAttribute("data-sfx");
  if (explicit !== null) return explicit === "none" ? null : resolveCue(explicit);
  if (el.hasAttribute("data-cuelume-navigate")) return "navigate";
  if (el.hasAttribute("data-cuelume-tap")) return "tap";
  return null;
}

function closest(target: EventTarget | null, selector: string): Element | null {
  return target instanceof Element ? target.closest(selector) : null;
}

interface Installed {
  teardown: () => void;
}
const GLOBAL_KEY = "__kienSfx";

function install() {
  const w = window as unknown as Record<string, Installed | undefined>;
  // Vite HMR re-evaluates this module: drop the previous instance's listeners
  // and context so sounds never double up in dev.
  w[GLOBAL_KEY]?.teardown();

  const ac = new AbortController();
  const capture = { capture: true, passive: true, signal: ac.signal } as AddEventListenerOptions;

  // 1. Unlock / keep-alive. Registered on window in the capture phase so it
  //    runs before the document-level tap handler below: the very first tap
  //    already has a context to schedule on.
  const wake = () => {
    if (enabled) ensureContext();
  };
  for (const type of ["pointerdown", "keydown", "touchstart"] as const) {
    window.addEventListener(type, wake, capture);
  }
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "visible" && enabled) resume();
    },
    { signal: ac.signal },
  );

  // 2. Taps. Mouse/pen: pointerdown, so sound lands the instant you press.
  //    Touch: pointerup, and only if the finger barely moved; otherwise every
  //    scroll that starts on a card would click.
  let touchStart: { el: Element; x: number; y: number } | null = null;
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return;
      const el = closest(e.target, TAP_TARGET);
      if (!el || isDisabled(el)) return;
      if (e.pointerType === "touch") {
        touchStart = { el, x: e.clientX, y: e.clientY };
        return;
      }
      const cue = tapCueFor(el);
      if (cue) sfx(cue);
    },
    capture,
  );
  document.addEventListener(
    "pointerup",
    (e) => {
      const start = touchStart;
      touchStart = null;
      if (!start || e.pointerType !== "touch") return;
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) return;
      const cue = tapCueFor(start.el);
      if (cue) sfx(cue);
    },
    capture,
  );
  document.addEventListener("pointercancel", () => (touchStart = null), capture);

  // Keyboard activation: Enter anywhere it applies, Space except on links
  // (Space scrolls the page on an <a>, it doesn't activate it).
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.repeat || (e.key !== "Enter" && e.key !== " ")) return;
      const el = closest(e.target, TAP_TARGET);
      if (!el || isDisabled(el)) return;
      if (e.key === " " && el.tagName === "A") return;
      const cue = tapCueFor(el);
      if (cue) sfx(cue);
    },
    capture,
  );

  // 3. Hover: mouse only, only on entering a new target, one per 55 ms.
  let current: Element | null = null;
  let lastHoverAt = -Infinity;
  document.addEventListener(
    "pointerover",
    (e) => {
      if (e.pointerType !== "mouse") return;
      const el = closest(e.target, HOVER_TARGET);
      if (el === current) return;
      current = el;
      if (!el || !ctx || isDisabled(el) || el.closest("[data-hover-silent]")) return;
      const attr = el.getAttribute("data-sfx-hover");
      if (attr === "none") return;
      const cue = attr !== null ? resolveCue(attr) : "hover";
      if (!cue) return;
      const now = performance.now();
      if (now - lastHoverAt < HOVER_GAP_MS) return;
      lastHoverAt = now;
      play(cue);
    },
    { passive: true, signal: ac.signal },
  );

  w[GLOBAL_KEY] = {
    teardown: () => {
      ac.abort();
      try {
        void ctx?.close().catch(() => {});
      } catch {
        /* ignore */
      }
    },
  };
}

let installed = false;

export function initSound() {
  enabled = readPref();
  if (!installed && typeof window !== "undefined" && typeof document !== "undefined") {
    installed = true;
    install();
  }
  emit();
}

/* ------------------------------------------------------------------ */
/* On / off                                                            */
/* ------------------------------------------------------------------ */

export function setSoundEnabled(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* private mode: preference just won't persist */
  }
  window.clearTimeout(suspendTimer);
  if (next) {
    // Usually called from a click, so this counts as a gesture.
    ensureContext();
  } else if (ctx) {
    // Let any last cue ring out, then idle the audio thread.
    const c = ctx;
    suspendTimer = window.setTimeout(() => {
      if (!enabled && c.state === "running") void c.suspend().catch(() => {});
    }, 400);
  }
  emit();
}

export function toggleSound() {
  // The off click is the last thing you hear, so play it before muting;
  // when turning on, unmute first so the click confirms the new state.
  if (enabled) {
    sfx("toggle");
    setSoundEnabled(false);
  } else {
    setSoundEnabled(true);
    sfx("toggle");
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const useSoundEnabled = () => useSyncExternalStore(subscribe, () => enabled, () => true);
