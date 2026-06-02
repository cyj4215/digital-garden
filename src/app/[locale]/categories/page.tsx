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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t(locale, "categories")}</h1>
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
              className="group rounded-xl border border-border bg-background-secondary/30 p-6 transition-all hover:border-accent/40 hover:bg-background-secondary/60"
            >
              <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {category}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {locale === "zh" ? `${posts.length} 篇文章` : `${posts.length} posts`}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
