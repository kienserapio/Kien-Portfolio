import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A photo, or a placeholder until the real one exists. Placeholders are
 * deliberate-looking (soft stripes + label), not broken images.
 */
export const Photo = ({
  src,
  alt,
  label = "Photo coming soon",
  className,
  ratio = "4/3",
  priority = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
}) => (
  <div
    className={cn("relative overflow-hidden rounded-2xl bg-neutral-100", className)}
    style={{ aspectRatio: ratio }}
    data-sfx-hover="hoverImage"
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    ) : (
      <div className="ph-tile absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/35" role="img" aria-label={`${alt} (photo coming soon)`}>
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">{label}</span>
      </div>
    )}
  </div>
);

export default Photo;
