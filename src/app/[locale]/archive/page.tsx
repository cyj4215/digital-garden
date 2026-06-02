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
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold">{t(locale, "archive")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `共 ${posts.length} 篇文章` : `${posts.length} posts in total`}
        </p>
      </div>
      {years.map((year) => (
        <section key={year}>
          <h2 className="mb-4 text-2xl font-bold text-accent">{year}</h2>
          <div className="flex flex-col gap-3 border-l border-border pl-6">
            {postsByYear[year].map((post) => (
              <div key={post.slug} className="relative">
                <div className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-background" />
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col gap-1"
                >
                  <time className="text-xs text-text-secondary">{post.date}</time>
                  <span className="text-foreground group-hover:text-accent transition-colors font-medium">
                    {post.title}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {post.category} · {post.readingTime}
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
