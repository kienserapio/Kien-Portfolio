import { mediaFor } from "@/data/projects";
import { cn } from "@/lib/utils";

/** A project's app icon / mark, as a rounded tile. Falls back to a monogram. */
export const ProjectLogo = ({ slug, name, className }: { slug: string; name: string; className?: string }) => {
  const logo = mediaFor(slug).logo;
  return logo ? (
    <img
      src={logo}
      alt={`${name} logo`}
      width={256}
      height={256}
      loading="lazy"
      decoding="async"
      className={cn("h-10 w-10 shrink-0 rounded-[22%] bg-white object-cover ring-1 ring-ink/10", className)}
    />
  ) : (
    <span
      aria-hidden
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-[22%] bg-ink text-[13px] font-medium tracking-wide text-white",
        className,
      )}
    >
      {name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
};

export default ProjectLogo;
