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
    <div className="flex flex-col gap-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative flex flex-col gap-6 py-12 md:py-16">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-accent/[0.03] blur-[100px]" />

        <div className="relative">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
            {locale === "zh" ? "欢迎光临" : "Welcome"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight md:text-5xl lg:text-6xl">
            {locale === "zh" ? (
              <>
                你好，欢迎来到我的
                <br />
                <span className="gradient-text">数字花园</span>
              </>
            ) : (
              <>
                Welcome to my
                <br />
                <span className="gradient-text">Digital Garden</span>
              </>
            )}
          </h1>
        </div>

        <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
          {siteConfig.description[locale as keyof typeof siteConfig.description]}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={`/${locale}/blog`}
            className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/30 hover:scale-[1.02]"
          >
            {t(locale, "allPosts")}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 rounded-xl border border-border-light px-6 py-3 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-accent/40 hover:text-accent hover:bg-accent-glow"
          >
            {t(locale, "about")}
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-4 text-sm text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span>{getAllPosts(locale).length} {locale === "zh" ? "篇文章" : "posts"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>zh / en</span>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {locale === "zh" ? "最新文章" : "Latest Posts"}
            </h2>
            <Link
              href={`/${locale}/blog`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {locale === "zh" ? "查看全部" : "View all"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
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
        </section>
      )}

      {posts.length === 0 && (
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-bg-secondary/30 py-16 text-center">
          <div className="text-4xl">🌱</div>
          <p className="text-lg text-text-secondary">{t(locale, "noPosts")}</p>
          <p className="text-sm text-text-muted">
            {locale === "zh" ? "开始写你的第一篇文章吧！" : "Start writing your first post!"}
          </p>
        </section>
      )}
    </div>
  );
}
