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
}: PostCardProps) {
  const href = locale === "zh" ? `/zh/blog/${slug}` : `/en/blog/${slug}`;

  return (
    <article className="group rounded-xl border border-border bg-background-secondary/30 p-6 transition-all hover:border-accent/40 hover:bg-background-secondary/60">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <time dateTime={date}>{date}</time>
          <span className="text-border">|</span>
          <span>{readingTime}</span>
          <span className="text-border">|</span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
            {category}
          </span>
        </div>

        <Link href={href} className="block">
          <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h2>
        </Link>

        <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
          {summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={
                locale === "zh"
                  ? `/zh/tags/${encodeURIComponent(tag)}`
                  : `/en/tags/${encodeURIComponent(tag)}`
              }
              className="rounded-md bg-tag-bg/50 px-2 py-0.5 text-xs text-tag-text hover:bg-tag-bg transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
