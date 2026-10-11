import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Base = {
  children: ReactNode;
  className?: string;
  /** primary: graphite shimmer (heavy press + ripple). secondary: outline that floods on hover. */
  variant?: "primary" | "secondary";
  "aria-label"?: string;
};
type AsLink = Base & { to: string; href?: never; onClick?: () => void };
type AsAnchor = Base & { href: string; to?: never; onClick?: () => void; download?: boolean };
type AsButton = Base & { to?: never; href?: never; onClick: () => void };
export type CtaProps = AsLink | AsAnchor | AsButton;

type Ripple = { x: number; y: number; size: number; key: number };

/**
 * The site's two buttons.
 * - primary: magicui shimmer button visuals + ripple on press, `press` sound.
 * - secondary: magicui interactive-hover button, `tap` sound.
 * Renders a router <Link>, an <a> or a <button> depending on props, so
 * navigation stays crawlable.
 */
export const Cta = (props: CtaProps) => {
  const { children, className, variant = "primary" } = props;
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (variant !== "primary") return;
    const r = e.currentTarget.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 1.2;
    const ripple = { x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size, key: performance.now() };
    setRipples((rs) => [...rs, ripple]);
    window.setTimeout(() => setRipples((rs) => rs.filter((x) => x.key !== ripple.key)), 650);
  };

  const inner =
    variant === "primary" ? (
      <>
        {/* shimmer: a conic spark that orbits the edge */}
        <span aria-hidden className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
          <span className="absolute inset-0 aspect-square h-[100cqh] animate-shimmer-slide rounded-none">
            <span className="absolute -inset-full w-auto animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </span>
        </span>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <span
          aria-hidden
          className="absolute inset-0 rounded-[inherit] shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 group-hover:shadow-[inset_0_-6px_12px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
        />
        <span aria-hidden className="absolute inset-[var(--cut)] -z-20 rounded-[inherit] [background:var(--bg)]" />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-0">
          {ripples.map((r) => (
            <span
              key={r.key}
              className="absolute animate-rippling rounded-full bg-white/30"
              style={{ width: r.size, height: r.size, left: r.x, top: r.y, transform: "scale(0)", "--duration": "650ms" } as CSSProperties}
            />
          ))}
        </span>
      </>
    ) : (
      <>
        <span className="relative flex items-center justify-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-ink transition-transform duration-500 ease-out group-hover:scale-[100]" />
          <span className="inline-block transition-all duration-300 group-hover:translate-x-10 group-hover:opacity-0">{children}</span>
        </span>
        <span className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <span>{children}</span>
          <ArrowRight className="h-4 w-4" />
        </span>
      </>
    );

  const cls = cn(
    "no-scale group relative z-0 inline-flex select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium outline-none transition-transform duration-200 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2",
    variant === "primary"
      ? "border border-white/10 text-white [background:var(--bg)]"
      : "border border-ink/15 bg-white text-ink",
    className,
  );
  const style =
    variant === "primary"
      ? ({ "--spread": "90deg", "--shimmer-color": "#ffffff", "--speed": "3s", "--cut": "0.05em", "--bg": "#1d1d1f" } as CSSProperties)
      : undefined;
  const common = {
    className: cls,
    style,
    onPointerDown,
    "data-sfx": variant === "primary" ? "press" : "tap",
    "data-sfx-hover": variant === "primary" ? "hover" : "hover",
    "aria-label": props["aria-label"],
  };

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} onClick={props.onClick} {...common}>
        {inner}
      </Link>
    );
  }
  if ("href" in props && props.href) {
    const external = /^https?:/.test(props.href);
    return (
      <a
        href={props.href}
        onClick={props.onClick}
        download={(props as AsAnchor).download}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...common}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={props.onClick} {...common}>
      {inner}
    </button>
  );
};

export default Cta;
