import Link from "next/link";
import { type Locale, siteConfig } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const posts = getAllPosts(locale).slice(0, 5);

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {locale === "zh" ? "你好，欢迎来到我的" : "Welcome to my"}{" "}
          <span className="text-accent">
            {locale === "zh" ? "数字花园" : "Digital Garden"}
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-text-secondary leading-relaxed">
          {siteConfig.description[locale as keyof typeof siteConfig.description]}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/${locale}/blog`}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
          >
            {t(locale, "allPosts")} →
          </Link>
          <Link
            href={`/${locale}/about`}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            {t(locale, "about")}
          </Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {locale === "zh" ? "最新文章" : "Latest Posts"}
            </h2>
            <Link
              href={`/${locale}/blog`}
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {locale === "zh" ? "查看全部" : "View all"} →
            </Link>
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
                locale={l}
                readingTime={post.readingTime}
              />
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="py-12 text-center text-text-secondary">
          <p className="text-lg">{t(locale, "noPosts")}</p>
        </section>
      )}
    </div>
  );
}
