import { notFound } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export async function generateStaticParams() {
  const allZh = getAllTags("zh").map((name) => ({ locale: "zh", name }));
  const allEn = getAllTags("en").map((name) => ({ locale: "en", name }));
  return [...allZh, ...allEn];
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}) {
  const { locale, name } = await params;
  const decodedName = decodeURIComponent(name);
  const posts = getPostsByTag(locale, decodedName);

  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={`/${locale}/tags`}
          className="text-sm text-text-secondary hover:text-accent transition-colors"
        >
          ← {t(locale, "tags")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">#{decodedName}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `${posts.length} 篇文章` : `${posts.length} posts`}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            title={post.title}
            date={post.date}
            summary={post.summary}
            category={post.category}
            tags={post.tags}
            slug={post.slug}
            locale={locale as "zh" | "en"}
            readingTime={post.readingTime}
          />
        ))}
      </div>
    </div>
  );
}
