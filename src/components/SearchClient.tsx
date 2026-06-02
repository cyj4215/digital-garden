"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";

interface SearchPageProps {
  locale: string;
}

export default function SearchClient({ locale }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/search?locale=${locale}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      posts.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.summary.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          post.category.toLowerCase().includes(q)
      )
    );
  }, [query, posts]);

  const searchPlaceholder = locale === "zh" ? "搜索文章..." : "Search posts...";
  const noResults = locale === "zh" ? "未找到相关结果" : "No results found";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === "zh" ? "搜索" : "Search"}
        </h1>
      </div>
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-border bg-background-secondary/30 py-3 pl-12 pr-4 text-foreground placeholder-text-secondary outline-none transition-colors focus:border-accent"
          autoFocus
        />
      </div>
      {isLoading && <p className="text-center text-text-secondary py-8">Loading...</p>}
      {!isLoading && query.trim() && results.length === 0 && (
        <p className="text-center text-text-secondary py-8">{noResults}</p>
      )}
      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-text-secondary">
            {locale === "zh" ? `找到 ${results.length} 个结果` : `${results.length} results found`}
          </p>
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-background-secondary/30 p-5 transition-all hover:border-accent/40 hover:bg-background-secondary/60"
            >
              <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">{post.title}</h2>
              <p className="mt-1 text-sm text-text-secondary line-clamp-1">{post.summary}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-text-secondary">
                <span>{post.date}</span>
                <span className="text-border">|</span>
                <span>{post.category}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
