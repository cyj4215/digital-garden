import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts("zh");
  const postsEn = getAllPosts("en");

  const items = [...posts, ...postsEn]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://digital-garden.vercel.app/${post.lang}/blog/${post.slug}</link>
      <guid>https://digital-garden.vercel.app/${post.lang}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
      <category>${post.category}</category>
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Digital Garden</title>
    <link>https://digital-garden.vercel.app</link>
    <description>Personal digital garden - tech notes, blog posts and knowledge base</description>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://digital-garden.vercel.app/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
