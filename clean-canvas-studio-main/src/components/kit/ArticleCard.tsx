import { Link } from "react-router-dom";
import { Photo } from "@/components/kit/Photo";
import { formatDate, type ArticleMeta } from "@/data/writing";
import { cn } from "@/lib/utils";

export const ArticleCard = ({ a, className, large = false }: { a: ArticleMeta; className?: string; large?: boolean }) => (
  <Link
    to={`/writing/${a.slug}`}
    data-sfx="navigate"
    data-sfx-hover="hoverImage"
    className={cn("no-scale group flex flex-col gap-5", className)}
  >
    <Photo src={a.cover} alt={a.coverAlt ?? a.title} ratio={large ? "16/9" : "3/2"} className="rounded-3xl" />
    <div>
      <div className="text-xs text-ink/50">
        {formatDate(a.date)} · {a.readingMinutes} min read
      </div>
      <h3
        className={cn(
          "mt-2 font-medium tracking-[-0.02em] text-ink transition-opacity group-hover:opacity-70",
          large ? "text-2xl md:text-4xl" : "text-xl md:text-2xl",
        )}
      >
        {a.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink/60">{a.description}</p>
    </div>
  </Link>
);

export default ArticleCard;
