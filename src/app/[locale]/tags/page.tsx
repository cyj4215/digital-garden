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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t(locale, "tags")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `共 ${tags.length} 个标签` : `${tags.length} tags in total`}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {tagCounts.map(({ name, count }) => (
          <Link
            key={name}
            href={`/${locale}/tags/${encodeURIComponent(name)}`}
            className="rounded-lg border border-border bg-tag-bg/30 px-4 py-2 text-sm text-tag-text transition-all hover:border-accent/40 hover:bg-tag-bg/60"
          >
            #{name} <span className="text-text-secondary text-xs">({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
