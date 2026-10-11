import type { ReactNode } from "react";
import { Eyebrow, Reveal, SplitWords } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

/** Eyebrow + big word-reveal title + optional lede. Used by every section. */
export const SectionHead = ({
  eyebrow,
  title,
  lede,
  className,
  align = "left",
  as = "h2",
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  action?: ReactNode;
}) => (
  <header className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}>
    {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
    <SplitWords
      as={as}
      text={title}
      immediate={as === "h1"}
      className={cn(
        "max-w-4xl font-hn text-[2.6rem] font-medium leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-7xl",
        align === "center" && "mx-auto",
      )}
    />
    {lede && (
      <Reveal delay={0.1} className={cn("max-w-2xl text-lg leading-relaxed text-ink/60 sm:text-xl", align === "center" && "mx-auto")}>
        {lede}
      </Reveal>
    )}
    {action && <Reveal delay={0.18}>{action}</Reveal>}
  </header>
);

export default SectionHead;
