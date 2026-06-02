import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "zh";

  const posts = getAllPosts(locale).map((post) => ({
    title: post.title,
    date: post.date,
    summary: post.summary,
    category: post.category,
    tags: post.tags,
    slug: post.slug,
    readingTime: post.readingTime,
  }));

  return NextResponse.json({ posts });
}
