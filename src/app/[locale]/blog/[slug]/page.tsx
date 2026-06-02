import { type Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/posts";
import { generatePostMetadata } from "@/lib/metadata";
import TableOfContents from "@/components/TableOfContents";
import PostCard from "@/components/PostCard";
import BackToTop from "@/components/BackToTop";

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
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
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
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://digital-garden.vercel.app/${locale}/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-light px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-accent hover:bg-accent-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </a>
            </div>
          </div>
        </div>
      </article>

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
              />
            ))}
          </div>
        </section>
      )}

      <BackToTop locale={l} />
    </>
  );
}

function renderMarkdown(content: string): string {
  let html = content;

  // Code blocks
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre><code class="language-$1">$2</code></pre>'
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code>$1</code>'
  );

  // Headers with IDs
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff-]/g, "").replace(/\s+/g, "-");
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff-]/g, "").replace(/\s+/g, "-");
    return `<h2 id="${id}">${text}</h2>`;
  });

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Links
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2">$1</a>'
  );

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote><p>$1</p></blockquote>'
  );

  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (block.startsWith("<") || block === "") return block;
      return `<p>${block.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return html;
}
