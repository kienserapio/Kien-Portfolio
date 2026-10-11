import { Safari } from "@/components/ui/safari";
import { cn } from "@/lib/utils";

/**
 * The original phone frame: a graphite slab with a thin bezel. The screen
 * area has the exact aspect of an iPhone screenshot (1206×2622), so captures
 * sit edge to edge inside it, nothing cropped or letterboxed.
 */
export const Phone = ({
  src,
  videoSrc,
  alt = "",
  className,
}: {
  src?: string;
  videoSrc?: string;
  alt?: string;
  className?: string;
}) => (
  <div
    className={cn("w-full rounded-[2.6rem] bg-ink p-[5px] shadow-[0_28px_50px_-22px_rgba(29,29,31,0.55)]", className)}
    data-sfx-hover="hoverImage"
  >
    <div className="relative aspect-[1206/2622] overflow-hidden rounded-[2.3rem] bg-neutral-900 [transform:translateZ(0)]">
      {videoSrc ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={videoSrc} poster={src} autoPlay loop muted playsInline preload="metadata" />
      ) : src ? (
        <img className="absolute inset-0 h-full w-full object-cover object-top" src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <div className="ph-tile absolute inset-0" />
      )}
    </div>
  </div>
);

/** A product shot in the right frame: the phone for apps, Safari for the web. */
export const Device = ({
  kind,
  src,
  videoSrc,
  url,
  alt,
  className,
}: {
  kind: "phone" | "desktop";
  src?: string;
  videoSrc?: string;
  url?: string;
  alt?: string;
  className?: string;
}) =>
  kind === "phone" ? (
    <Phone src={src} videoSrc={videoSrc} alt={alt} className={className} />
  ) : (
    // box-shadow, not a drop-shadow filter: it doesn't re-rasterize while the frame animates
    <div className={cn("rounded-xl shadow-[0_30px_60px_-28px_rgba(29,29,31,0.35)]", className)} data-sfx-hover="hoverImage">
      <Safari imageSrc={src} videoSrc={videoSrc} url={url} mode="simple" />
    </div>
  );

export default Device;
