import Link from "next/link";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const categories = getAllCategories(locale);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(locale, "categories")}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh" ? `${categories.length} 个分类` : `${categories.length} categories`}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const posts = getPostsByCategory(locale, category);
          return (
            <Link
              key={category}
              href={`/${locale}/categories/${encodeURIComponent(category)}`}
              className="card-glow group flex items-center justify-between rounded-xl border border-border/60 bg-bg-secondary/20 p-6 transition-all duration-300 hover:border-border-light hover:bg-bg-secondary/50"
            >
              <div>
                <h2 className="text-lg font-bold text-foreground-bright transition-colors group-hover:text-accent">
                  {category}
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  {locale === "zh" ? `${posts.length} 篇文章` : `${posts.length} posts`}
                </p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-text-muted transition-all group-hover:text-accent group-hover:translate-x-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
