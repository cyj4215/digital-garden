import { type Metadata } from "next";
import Link from "next/link";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getSeriesGroups } from "@/lib/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: t(locale, "allSeries") };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const seriesGroups = getSeriesGroups(locale);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">{t(locale, "allSeries")}</h1>
      </div>

      {seriesGroups.length === 0 ? (
        <p className="py-12 text-center text-text-secondary">
          {t(locale, "noSeries")}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {seriesGroups.map((group) => (
            <Link
              key={group.name}
              href={`/${locale}/series/${encodeURIComponent(group.name)}`}
              className="card-glow group rounded-xl border border-border/60 bg-bg-secondary/20 p-6 transition-all duration-300 hover:border-border-light hover:bg-bg-secondary/50"
            >
              <h2 className="text-xl font-bold tracking-tight group-hover:text-accent transition-colors">
                {group.name}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {group.posts.length} {locale === "zh" ? "篇文章" : "posts"}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {group.posts.map((post, i) => (
                  <div key={post.slug} className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="shrink-0 w-6 text-center text-xs font-medium text-accent">
                      {i + 1}
                    </span>
                    <span>{post.title}</span>
                    <span className="ml-auto tabular-nums text-xs">{post.date}</span>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
