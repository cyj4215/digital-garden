import { notFound } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export async function generateStaticParams() {
  const allZh = getAllCategories("zh").map((name) => ({ locale: "zh", name }));
  const allEn = getAllCategories("en").map((name) => ({ locale: "en", name }));
  return [...allZh, ...allEn];
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}) {
  const { locale, name } = await params;
  const decodedName = decodeURIComponent(name);
  const posts = getPostsByCategory(locale, decodedName);

  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={`/${locale}/categories`}
          className="text-sm text-text-secondary hover:text-accent transition-colors"
        >
          ← {t(locale, "categories")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{decodedName}</h1>
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
