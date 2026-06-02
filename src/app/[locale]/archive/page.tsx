import Link from "next/link";
import { t } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  const postsByYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="flex flex-col gap-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(locale, "archive")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `共 ${posts.length} 篇文章` : `${posts.length} posts in total`}
        </p>
      </div>

      {years.map((year) => (
        <section key={year}>
          <div className="mb-5 flex items-center gap-3">
            <span className="gradient-text text-3xl font-bold">{year}</span>
            <div className="flex-1 divider-gradient" />
            <span className="text-sm text-text-muted tabular-nums">
              {postsByYear[year].length} {locale === "zh" ? "篇" : "posts"}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-l border-border pl-6">
            {postsByYear[year].map((post, i) => (
              <div key={post.slug} className="relative group">
                <div className="absolute -left-[29px] top-3 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background transition-all group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--accent)]" />
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="flex flex-col gap-0.5 rounded-lg py-3 px-4 -ml-4 transition-colors hover:bg-bg-secondary/40"
                >
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <time className="tabular-nums">{post.date}</time>
                    <span className="text-border-light">·</span>
                    <span>{post.category}</span>
                    <span className="text-border-light">·</span>
                    <span className="tabular-nums">{post.readingTime}</span>
                  </div>
                  <span className="text-foreground-bright font-medium transition-colors group-hover:text-accent">
                    {post.title}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
