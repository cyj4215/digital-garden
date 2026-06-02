import Link from "next/link";
import { t } from "@/lib/i18n";
import { getAllTags, getAllPosts } from "@/lib/posts";

export default async function TagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tags = getAllTags(locale);
  const posts = getAllPosts(locale);

  const tagCounts = tags.map((tag) => ({
    name: tag,
    count: posts.filter((p) => p.tags.includes(tag)).length,
  }));

  const maxCount = Math.max(...tagCounts.map((t) => t.count), 1);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(locale, "tags")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `共 ${tags.length} 个标签` : `${tags.length} tags in total`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {tagCounts.map(({ name, count }) => {
          const scale = 0.8 + (count / maxCount) * 0.4;
          return (
            <Link
              key={name}
              href={`/${locale}/tags/${encodeURIComponent(name)}`}
              className="group rounded-lg border border-border/60 bg-bg-secondary/20 px-4 py-2.5 text-sm font-medium text-tag-text transition-all duration-200 hover:border-accent/30 hover:bg-accent/10 hover:text-accent hover:scale-[1.02]"
              style={{ fontSize: `${scale}rem` }}
            >
              <span className="text-text-muted mr-1.5 font-normal">#</span>
              {name}
              <span className="ml-2 text-xs text-text-muted tabular-nums">({count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
