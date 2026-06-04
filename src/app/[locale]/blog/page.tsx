import { type Metadata } from "next";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(locale, "blog") };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const l = locale as Locale;
  const currentPage = Number(pageParam) || 1;
  const postsPerPage = 10;
  const allPosts = getAllPosts(locale);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const posts = allPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t(locale, "allPosts")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh"
            ? `共 ${allPosts.length} 篇文章`
            : `${allPosts.length} posts in total`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <PostCard
            key={post.slug}
            title={post.title}
            date={post.date}
            summary={post.summary}
            category={post.category}
            tags={post.tags}
            slug={post.slug}
            locale={l}
            readingTime={post.readingTime}
            wordCount={post.wordCount}
            index={i}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="py-12 text-center text-text-secondary">
          {t(locale, "noPosts")}
        </p>
      )}

      <Pagination
        locale={l}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/${locale}/blog`}
      />
    </div>
  );
}
