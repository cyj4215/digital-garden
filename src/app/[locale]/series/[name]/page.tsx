import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale } from "@/lib/config";
import { getSeriesPosts, getAllSeriesNames } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export function generateStaticParams() {
  const zhNames = getAllSeriesNames("zh");
  const enNames = getAllSeriesNames("en");
  return [
    ...zhNames.map((name) => ({ locale: "zh", name })),
    ...enNames.map((name) => ({ locale: "en", name })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  return { title: decodeURIComponent(name) };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}) {
  const { locale, name } = await params;
  const l = locale as Locale;
  const seriesName = decodeURIComponent(name);
  const posts = getSeriesPosts(locale, seriesName);

  if (posts.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-accent mb-2">{locale === "zh" ? "系列" : "Series"}</p>
        <h1 className="text-3xl font-bold">{seriesName}</h1>
        <p className="mt-2 text-text-secondary">
          {locale === "zh"
            ? `该系列共 ${posts.length} 篇文章`
            : `${posts.length} posts in this series`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <div key={post.slug} className="relative">
            <div className="absolute -left-8 top-6 flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
              {i + 1}
            </div>
            <PostCard
              title={post.title}
              date={post.date}
              summary={post.summary}
              category={post.category}
              tags={post.tags}
              slug={post.slug}
              locale={l}
              readingTime={post.readingTime}
              index={i}
              coverImage={post.coverImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
