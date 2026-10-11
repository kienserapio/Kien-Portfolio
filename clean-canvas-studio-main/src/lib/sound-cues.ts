/**
 * Cue recipes for the UI sound engine (see `./sound.ts` for the engine,
 * DOM bindings and the full palette notes).
 *
 * Every cue is synthesized live from oscillators and filtered noise, layered
 * and shaped by short envelopes: a straight-line attack (heard immediately)
 * and an exponential decay (dies away naturally). Nothing here touches the
 * DOM or owns an AudioContext; a recipe just schedules nodes on the `Voice`
 * it is handed, starting at `voice.t`.
 */

export type SfxCue =
  | "hover"
  | "hoverImage"
  | "tap"
  | "press"
  | "navigate"
  | "open"
  | "close"
  | "islandOpen"
  | "islandClose"
  | "toggle"
  | "success"
  | "count"
  | "swipe"
  | "error"
  | "pop";

/** Everything a recipe needs to schedule one play. */
export interface Voice {
  ctx: BaseAudioContext;
  /** Per-play bus (already scaled by cue gain × play volume). */
  out: AudioNode;
  /** Start time on the context clock, in seconds. */
  t: number;
  /** Pitch multiplier (random variation × caller's `pitch`). */
  p: number;
  /** 1 = forward / up, -1 = back / down. Directional cues mirror on -1. */
  dir: 1 | -1;
  /** Shared looping white-noise buffer. */
  noise: AudioBuffer;
}

export interface CueDef {
  /** Cue level before the master bus (may exceed 1). Hover cues sit far below press. */
  gain: number;
  /** Random pitch variation per play, as a fraction (0.025 = ±2.5%). */
  jitter: number;
  /** Approximate audible length in seconds (used for node cleanup). */
  dur: number;
  render: (v: Voice) => void;
}

const SILENT = 0.0001;
const STOP_PAD = 0.03;

function envelope(param: AudioParam, t: number, attack: number, decay: number, peak: number) {
  param.setValueAtTime(0, t);
  param.linearRampToValueAtTime(peak, t + attack);
  param.exponentialRampToValueAtTime(SILENT, t + attack + decay);
}

interface Layer {
  /** Offset from the voice start, seconds. */
  at?: number;
  /** Attack, seconds. */
  a?: number;
  /** Decay, seconds. */
  d: number;
  peak: number;
  /** Start frequency (oscillator pitch, or filter cutoff for noise). */
  f: number;
  /** Optional glide target frequency. */
  to?: number;
  /** Glide time, seconds (defaults to the whole layer). */
  glide?: number;
}

interface ToneLayer extends Layer {
  type?: OscillatorType;
}

interface NoiseLayer extends Layer {
  filter?: BiquadFilterType;
  q?: number;
}

function tone(v: Voice, l: ToneLayer) {
  const { ctx } = v;
  const t = v.t + (l.at ?? 0);
  const a = l.a ?? 0.002;
  const osc = ctx.createOscillator();
  osc.type = l.type ?? "sine";
  osc.frequency.setValueAtTime(l.f * v.p, t);
  if (l.to) osc.frequency.exponentialRampToValueAtTime(l.to * v.p, t + (l.glide ?? a + l.d));
  const g = ctx.createGain();
  envelope(g.gain, t, a, l.d, l.peak);
  osc.connect(g).connect(v.out);
  osc.start(t);
  osc.stop(t + a + l.d + STOP_PAD);
}

function noise(v: Voice, l: NoiseLayer) {
  const { ctx } = v;
  const t = v.t + (l.at ?? 0);
  const a = l.a ?? 0.001;
  const src = ctx.createBufferSource();
  src.buffer = v.noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = l.filter ?? "bandpass";
  filter.frequency.setValueAtTime(l.f * v.p, t);
  if (l.to) filter.frequency.exponentialRampToValueAtTime(l.to * v.p, t + (l.glide ?? a + l.d));
  if (l.q !== undefined) filter.Q.value = l.q;
  const g = ctx.createGain();
  envelope(g.gain, t, a, l.d, l.peak);
  src.connect(filter).connect(g).connect(v.out);
  // a different stretch of the same noise every time
  src.start(t, Math.random() * v.noise.duration);
  src.stop(t + a + l.d + STOP_PAD);
}

/** Swap a glide's endpoints when the voice runs backwards. */
const way = (v: Voice, from: number, to: number): [number, number] => (v.dir > 0 ? [from, to] : [to, from]);

export const CUES: Record<SfxCue, CueDef> = {
  /** Tiny glassy tick: a fast high sine with a whisper of air. */
  hover: {
    gain: 0.6,
    jitter: 0.025,
    dur: 0.035,
    render(v) {
      tone(v, { f: 2600, to: 2300, a: 0.001, d: 0.028, peak: 0.09 });
      noise(v, { filter: "highpass", f: 7000, q: 0.7, a: 0.0005, d: 0.006, peak: 0.035 });
    },
  },

  /** A breath across glass: rising band of air, faint high sine shimmer. */
  hoverImage: {
    gain: 0.6,
    jitter: 0.02,
    dur: 0.2,
    render(v) {
      noise(v, { f: 2200, to: 6500, glide: 0.16, q: 0.9, a: 0.035, d: 0.15, peak: 0.1 });
      noise(v, { filter: "highpass", f: 9000, a: 0.02, d: 0.09, peak: 0.022 });
      tone(v, { f: 1975.5, a: 0.03, d: 0.16, peak: 0.012 }); // B6
      tone(v, { f: 2960, at: 0.015, a: 0.03, d: 0.12, peak: 0.006 }); // F#7
    },
  },

  /** Light button click: a short triangle "tik" with a crisp transient. */
  tap: {
    gain: 1.3,
    jitter: 0.025,
    dur: 0.05,
    render(v) {
      tone(v, { type: "triangle", f: 1500, to: 1100, glide: 0.03, a: 0.001, d: 0.04, peak: 0.16 });
      tone(v, { f: 3000, a: 0.0005, d: 0.012, peak: 0.04 });
      noise(v, { f: 4500, q: 1.2, a: 0.0005, d: 0.01, peak: 0.1 });
    },
  },

  /** Primary CTA "thock": low sine thump that drops, a woody body, a click. */
  press: {
    gain: 1.1,
    jitter: 0.012,
    dur: 0.17,
    render(v) {
      tone(v, { f: 160, to: 62, glide: 0.1, a: 0.002, d: 0.16, peak: 0.7 });
      tone(v, { type: "triangle", f: 420, to: 210, glide: 0.05, a: 0.001, d: 0.05, peak: 0.18 });
      noise(v, { f: 1800, q: 0.9, a: 0.0005, d: 0.016, peak: 0.35 });
      noise(v, { filter: "lowpass", f: 600, a: 0.001, d: 0.04, peak: 0.12 });
    },
  },

  /** Soft upward swish (downward when `direction: "back"`). */
  navigate: {
    gain: 1.3,
    jitter: 0.015,
    dur: 0.17,
    render(v) {
      const [n0, n1] = way(v, 700, 3600);
      const [t0, t1] = way(v, 520, 1040);
      noise(v, { f: n0, to: n1, glide: 0.14, q: 1.1, a: 0.05, d: 0.11, peak: 0.22 });
      tone(v, { f: t0, to: t1, glide: 0.12, a: 0.03, d: 0.1, peak: 0.035 });
    },
  },

  /** Disclosure open: rising fifth, G5 → D6. */
  open: {
    gain: 1.2,
    jitter: 0.01,
    dur: 0.15,
    render(v) {
      blip(v, 784, 0, 0.07, 0.16);
      blip(v, 1175, 0.055, 0.09, 0.14);
    },
  },

  /** Disclosure close: the same fifth falling, a touch softer. */
  close: {
    gain: 1.1,
    jitter: 0.01,
    dur: 0.15,
    render(v) {
      blip(v, 1175, 0, 0.06, 0.14);
      blip(v, 784, 0.05, 0.09, 0.15);
    },
  },

  /** Dynamic-Island expand: a rounded "bloop" gliding up. */
  islandOpen: {
    gain: 0.9,
    jitter: 0.01,
    dur: 0.18,
    render(v) {
      tone(v, { f: 260, to: 640, glide: 0.09, a: 0.012, d: 0.16, peak: 0.34 });
      tone(v, { f: 520, to: 1280, glide: 0.09, a: 0.012, d: 0.1, peak: 0.05 });
      noise(v, { filter: "lowpass", f: 900, a: 0.01, d: 0.05, peak: 0.04 });
    },
  },

  /** Dynamic-Island collapse: the bloop gliding down. */
  islandClose: {
    gain: 0.85,
    jitter: 0.01,
    dur: 0.18,
    render(v) {
      tone(v, { f: 620, to: 250, glide: 0.1, a: 0.01, d: 0.15, peak: 0.32 });
      tone(v, { f: 1240, to: 500, glide: 0.1, a: 0.01, d: 0.09, peak: 0.045 });
      noise(v, { filter: "lowpass", f: 800, a: 0.008, d: 0.04, peak: 0.035 });
    },
  },

  /** Switch: two-stage mechanical click (latch, then settle). */
  toggle: {
    gain: 1.4,
    jitter: 0.01,
    dur: 0.06,
    render(v) {
      noise(v, { f: 3200, q: 1.8, a: 0.0005, d: 0.012, peak: 0.18 });
      tone(v, { type: "triangle", f: 1900, a: 0.0005, d: 0.02, peak: 0.08 });
      noise(v, { f: 2400, q: 1.8, at: 0.032, a: 0.0005, d: 0.012, peak: 0.1 });
      tone(v, { type: "triangle", f: 1500, at: 0.032, a: 0.0005, d: 0.02, peak: 0.05 });
    },
  },

  /** Little major-triad chime, C6 E6 G6. */
  success: {
    gain: 1.1,
    jitter: 0.005,
    dur: 0.5,
    render(v) {
      const notes = [1046.5, 1318.5, 1568];
      notes.forEach((f, i) => {
        const at = i * 0.075;
        const last = i === notes.length - 1;
        tone(v, { f, at, a: 0.003, d: last ? 0.34 : 0.22, peak: 0.11 });
        tone(v, { f: f * 2, at, a: 0.002, d: 0.09, peak: 0.018 });
      });
    },
  },

  /** Tiny dry tick for count-ups; built to be played rapidly. */
  count: {
    gain: 0.6,
    jitter: 0.03,
    dur: 0.025,
    render(v) {
      tone(v, { f: 2800, a: 0.0008, d: 0.016, peak: 0.1 });
      noise(v, { filter: "highpass", f: 6500, a: 0.0005, d: 0.005, peak: 0.03 });
    },
  },

  /** Carousel step: a papery flick, brightening as it goes. */
  swipe: {
    gain: 1.2,
    jitter: 0.03,
    dur: 0.1,
    render(v) {
      const [n0, n1] = way(v, 1500, 4800);
      noise(v, { f: n0, to: n1, glide: 0.07, q: 1.6, a: 0.012, d: 0.07, peak: 0.2 });
      noise(v, { filter: "highpass", f: 6000, at: 0.055, a: 0.001, d: 0.012, peak: 0.04 });
    },
  },

  /** Gentle low "bonk", with a softer second knock (uh-oh). */
  error: {
    gain: 0.85,
    jitter: 0.01,
    dur: 0.28,
    render(v) {
      tone(v, { f: 200, to: 120, glide: 0.16, a: 0.004, d: 0.2, peak: 0.42 });
      tone(v, { type: "triangle", f: 400, to: 240, glide: 0.12, a: 0.004, d: 0.07, peak: 0.05 });
      tone(v, { f: 150, to: 95, glide: 0.12, at: 0.1, a: 0.004, d: 0.16, peak: 0.2 });
      noise(v, { filter: "lowpass", f: 700, a: 0.001, d: 0.025, peak: 0.1 });
    },
  },

  /** Playful bubble pop: a sine that snaps upward, with a sparkle. */
  pop: {
    gain: 0.8,
    jitter: 0.06,
    dur: 0.09,
    render(v) {
      tone(v, { f: 380, to: 1500, glide: 0.04, a: 0.002, d: 0.065, peak: 0.32 });
      tone(v, { f: 2200, at: 0.035, a: 0.001, d: 0.03, peak: 0.04 });
      noise(v, { f: 1200, q: 2, a: 0.0005, d: 0.012, peak: 0.06 });
    },
  },
};

/** A rounded note: sine fundamental plus a faint triangle for definition. */
function blip(v: Voice, f: number, at: number, d: number, peak: number) {
  tone(v, { f, at, a: 0.002, d, peak });
  tone(v, { type: "triangle", f, at, a: 0.002, d: d * 0.6, peak: peak * 0.18 });
}
