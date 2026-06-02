import Link from "next/link";
import { type Locale } from "@/lib/config";

interface PostCardProps {
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  slug: string;
  locale: Locale;
  readingTime: string;
  index?: number;
}

export default function PostCard({
  title,
  date,
  summary,
  category,
  tags,
  slug,
  locale,
  readingTime,
  index = 0,
}: PostCardProps) {
  const href = `/${locale}/blog/${slug}`;

  return (
    <article
      className="card-glow group rounded-xl border border-border/60 bg-bg-secondary/20 p-6 transition-all duration-300 hover:border-border-light hover:bg-bg-secondary/50 hover:shadow-lg hover:shadow-black/10"
      style={{ animationDelay: `${index * 75}ms` }}
    >
      <div className="flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          <time dateTime={date} className="tabular-nums">{date}</time>
          <span className="text-border-light">·</span>
          <span className="tabular-nums">{readingTime}</span>
          <span className="text-border-light">·</span>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
            {category}
          </span>
        </div>

        {/* Title */}
        <Link href={href} className="block">
          <h2 className="text-xl font-bold tracking-tight text-foreground-bright transition-colors duration-200 group-hover:text-accent">
            {title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
          {summary}
        </p>

        {/* Tags + Read more */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/tags/${encodeURIComponent(tag)}`}
                className="rounded-md bg-tag-bg px-2 py-0.5 text-xs font-medium text-tag-text transition-colors hover:bg-accent/15"
              >
                #{tag}
              </Link>
            ))}
            {tags.length > 3 && (
              <span className="px-1 py-0.5 text-xs text-text-muted">
                +{tags.length - 3}
              </span>
            )}
          </div>
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-text-muted transition-colors group-hover:text-accent"
          >
            {locale === "zh" ? "阅读" : "Read"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3 transition-transform group-hover:translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
