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
      <article className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href={`/${locale}/blog`}
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            ← {t(locale, "backToBlog")}
          </Link>
        </div>

        <header className="mb-8 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <time dateTime={post.date}>{post.date}</time>
            <span className="text-border">|</span>
            <span>{post.readingTime}</span>
            <span className="text-border">|</span>
            <Link
              href={`/${locale}/categories/${encodeURIComponent(post.category)}`}
              className="rounded-full bg-accent/10 px-2.5 py-0.5 text-accent hover:bg-accent/20 transition-colors"
            >
              {post.category}
            </Link>
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-lg text-text-secondary leading-relaxed">
              {post.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/tags/${encodeURIComponent(tag)}`}
                className="rounded-md bg-tag-bg/50 px-2.5 py-1 text-xs text-tag-text hover:bg-tag-bg transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </header>

        <hr className="border-border" />

        <div className="relative mt-8 flex gap-12">
          <article className="prose prose-lg prose-invert max-w-none flex-1 prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
          </article>
          <TableOfContents locale={l} content={post.content} />
        </div>

        <div className="mt-12 flex items-center gap-4 rounded-xl border border-border bg-background-secondary/30 p-4">
          <span className="text-sm text-text-secondary">
            {t(locale, "shareArticle")}
          </span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://digital-garden.vercel.app/${locale}/blog/${slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
          >
            Twitter / X
          </a>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">
            {t(locale, "relatedPosts")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((rp) => (
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
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="rounded bg-code-bg px-1.5 py-0.5 text-accent text-sm">$1</code>');
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff-]/g, "").replace(/\s+/g, "-");
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff-]/g, "").replace(/\s+/g, "-");
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:text-accent-hover underline underline-offset-2">$1</a>');
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent pl-4 text-text-secondary italic my-4">$1</blockquote>');
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.split("\n\n").map((block) => {
    block = block.trim();
    if (block.startsWith("<") || block === "") return block;
    return `<p class="my-4 leading-relaxed">${block.replace(/\n/g, "<br />")}</p>`;
  }).join("\n");
  return html;
}
