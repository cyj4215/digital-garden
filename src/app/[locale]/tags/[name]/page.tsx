import { notFound } from "next/navigation";
import Link from "next/link";
import { t } from "@/lib/i18n";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export async function generateStaticParams() {
  const allZh = getAllTags("zh").map((name) => ({ locale: "zh", name }));
  const allEn = getAllTags("en").map((name) => ({ locale: "en", name }));
  return [...allZh, ...allEn];
}

export default async function TagDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; name: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, name } = await params;
  const { page: pageParam } = await searchParams;
  const l = locale as "zh" | "en";
  const decodedName = decodeURIComponent(name);
  const currentPage = Number(pageParam) || 1;
  const postsPerPage = 10;
  const allTagPosts = getPostsByTag(locale, decodedName);
  const totalPages = Math.ceil(allTagPosts.length / postsPerPage);
  const posts = allTagPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  if (allTagPosts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <Link
          href={`/${locale}/tags`}
          className="group inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          {t(locale, "tags")}
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          <span className="text-accent">#</span>{decodedName}
        </h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `${allTagPosts.length} 篇文章` : `${allTagPosts.length} posts`}
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
            index={i}
          />
        ))}
      </div>

      <Pagination
        locale={l}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/${locale}/tags/${encodeURIComponent(decodedName)}`}
      />
    </div>
  );
}
