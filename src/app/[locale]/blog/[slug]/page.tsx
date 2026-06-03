import { type Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getPostBySlug, getAllSlugs, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { generatePostMetadata } from "@/lib/metadata";
import TableOfContents from "@/components/TableOfContents";
import PostCard from "@/components/PostCard";
import BackToTop from "@/components/BackToTop";
import GiscusComments from "@/components/GiscusComments";
import ShareButtons from "@/components/ShareButtons";
import { compileMDXContent } from "@/lib/mdx";

export async function generateStaticParams() {
  const allSlugsZh = getAllSlugs("zh");
  const allSlugsEn = getAllSlugs("en");
  return [
    ...allSlugsZh.map((slug) => ({ locale: "zh", slug })),
    ...allSlugsEn.map((slug) => ({ locale: "en", slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(locale, slug);
  if (!post) return {};
  return generatePostMetadata(post);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const post = getPostBySlug(locale, slug);

  if (!post) notFound();

  const relatedPosts = getRelatedPosts(locale, slug, 3);
  const { prev, next } = getAdjacentPosts(locale, slug);

  return (
    <>
      <article className="mx-auto max-w-3xl animate-fade-in">
        {/* Back to blog */}
        <div className="mb-10">
          <Link
            href={`/${locale}/blog`}
            className="group inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {t(locale, "backToBlog")}
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-10 flex flex-col gap-5">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <time dateTime={post.date} className="tabular-nums">{post.date}</time>
            <span className="text-border-light">·</span>
            <span className="tabular-nums">{post.readingTime}</span>
            <span className="text-border-light">·</span>
            <Link
              href={`/${locale}/categories/${encodeURIComponent(post.category)}`}
              className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            >
              {post.category}
            </Link>
            {post.series && (
              <>
                <span className="text-border-light">·</span>
                <Link
                  href={`/${locale}/series/${encodeURIComponent(post.series)}`}
                  className="rounded-full bg-gradient-to-r from-accent/10 to-purple-500/10 px-3 py-0.5 text-xs font-medium text-accent transition-colors hover:from-accent/20 hover:to-purple-500/20"
                >
                  {t(locale, "series")}: {post.series}
                </Link>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          {/* Summary */}
          {post.summary && (
            <p className="text-lg leading-relaxed text-text-secondary">
              {post.summary}
            </p>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl border border-border">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/tags/${encodeURIComponent(tag)}`}
                className="rounded-md bg-tag-bg px-2.5 py-1 text-xs font-medium text-tag-text transition-colors hover:bg-accent/15"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        {/* Divider */}
        <div className="divider-gradient mb-10" />

        {/* Content + TOC */}
        <div className="relative flex gap-12">
          <article className="prose prose-lg prose-invert max-w-none flex-1 prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
            <MDXContent content={post.content} />
          </article>
          <TableOfContents locale={locale} content={post.content} />
        </div>

        {/* Share */}
        <div className="mt-12 rounded-xl border border-border/60 bg-bg-secondary/20 p-5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-text-secondary">
              {t(locale, "shareArticle")}
            </span>
            <div className="h-4 w-px bg-border-light" />
            <ShareButtons
              title={post.title}
              url={`https://digital-garden.vercel.app/${locale}/blog/${slug}`}
              locale={locale}
            />
          </div>
        </div>
      </article>

      {/* Giscus Comments */}
      <div className="mx-auto max-w-3xl">
        <GiscusComments locale={locale} slug={slug} />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <div className="divider-gradient mb-10" />
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            {t(locale, "relatedPosts")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((rp, i) => (
              <PostCard
                key={rp.slug}
                title={rp.title}
                date={rp.date}
                summary={rp.summary}
                category={rp.category}
                tags={rp.tags}
                slug={rp.slug}
                locale={l}
                readingTime={rp.readingTime}
                index={i}
                coverImage={rp.coverImage}
              />
            ))}
          </div>
        </section>
      )}

      {/* Post Navigation */}
      {(prev || next) && (
        <nav className="mx-auto mt-12 flex max-w-3xl gap-4" aria-label="Post navigation">
          {prev ? (
            <Link
              href={`/${locale}/blog/${prev.slug}`}
              className="flex flex-1 flex-col gap-1 rounded-xl border border-border/60 bg-bg-secondary/20 p-5 transition-all hover:border-accent/40 hover:bg-bg-secondary/50"
            >
              <span className="text-xs text-text-muted">{t(locale, "previousPost")}</span>
              <span className="text-sm font-medium text-foreground">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/${locale}/blog/${next.slug}`}
              className="flex flex-1 flex-col items-end gap-1 rounded-xl border border-border/60 bg-bg-secondary/20 p-5 transition-all hover:border-accent/40 hover:bg-bg-secondary/50 text-right"
            >
              <span className="text-xs text-text-muted">{t(locale, "nextPost")}</span>
              <span className="text-sm font-medium text-foreground">
                {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      )}

      <BackToTop locale={l} />
    </>
  );
}

async function MDXContent({ content }: { content: string }) {
  const mdx = await compileMDXContent(content);
  return <div>{mdx}</div>;
}
