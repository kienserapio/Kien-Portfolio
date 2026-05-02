// Minimal inline SVG logos. Brand-correct colors at small sizes.
import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
  ...p,
});

export const ReactIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} fill="none">
    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1.4" fill="none">
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

export const ExpoIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path
      fill="#000"
      d="M12 3 2 19h4l6-9 6 9h4L12 3Z"
    />
  </svg>
);

export const NextIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="11" fill="#000" />
    <path d="M8 7v10M8 7l8 10" stroke="#fff" strokeWidth="1.6" />
  </svg>
);

export const NodeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path
      fill="#3C873A"
      d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 7 3.9v7.6l-7 3.9-7-3.9V8.2l7-3.9Z"
    />
    <text x="12" y="15" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">JS</text>
  </svg>
);

export const TSIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect width="24" height="24" rx="3" fill="#3178C6" />
    <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="sans-serif">TS</text>
  </svg>
);

export const PostgresIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <ellipse cx="12" cy="12" rx="9" ry="10" fill="#336791" />
    <text x="12" y="15.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="sans-serif">PG</text>
  </svg>
);

export const TailwindIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)} viewBox="0 0 32 32">
    <path
      fill="#38BDF8"
      d="M16 6c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.285 1.953 1.108 2.853 2.018C17.97 13.265 19.65 15 23 15c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.285-1.953-1.108-2.853-2.018C20.78 7.735 19.1 6 16 6ZM8.5 15c-4 0-6.5 2-7.5 6 1.5-2 3.25-2.75 5.25-2.25 1.14.285 1.953 1.108 2.853 2.018C10.47 22.265 12.15 24 15.5 24c4 0 6.5-2 7.5-6-1.5 2-3.25 2.75-5.25 2.25-1.14-.285-1.953-1.108-2.853-2.018C13.28 16.735 11.6 15 8.5 15Z"
    />
  </svg>
);

export const FigmaIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="9" cy="5" r="3" fill="#F24E1E" />
    <circle cx="15" cy="5" r="3" fill="#FF7262" />
    <circle cx="9" cy="11" r="3" fill="#A259FF" />
    <circle cx="15" cy="11" r="3" fill="#1ABCFE" />
    <circle cx="9" cy="17" r="3" fill="#0ACF83" />
  </svg>
);

export const WordPressIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" fill="#21759B" />
    <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="serif">W</text>
  </svg>
);

export const PhotoshopIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect width="24" height="24" rx="4" fill="#001E36" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#31A8FF" fontFamily="sans-serif">Ps</text>
  </svg>
);

export const IllustratorIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect width="24" height="24" rx="4" fill="#330000" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FF9A00" fontFamily="sans-serif">Ai</text>
  </svg>
);

// ---- Org / Company placeholder logos (monogram tiles) ----
type MonoProps = { label: string; bg: string; fg?: string };
export const MonoLogo = ({ label, bg, fg = "#fff" }: MonoProps) => (
  <div
    className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-base shrink-0 shadow-md"
    style={{
      background: bg,
      color: fg,
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 0 14px rgba(255,255,255,0.18), 0 8px 22px -8px rgba(0,0,0,0.35)",
      border: "1px solid rgba(255,255,255,0.35)",
      backdropFilter: "blur(8px)",
    }}
  >
    {label}
  </div>
);
