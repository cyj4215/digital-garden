"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";

/** Sanitize Pagefind excerpt, keeping only safe inline tags: em, strong, mark, br. */
function sanitizeExcerpt(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["em", "strong", "mark", "br"],
    ALLOWED_ATTR: [],
  });
}

function highlightTitle(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query.trim().split(/\s+/);
  const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  if (!pattern) return text;
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i}>{part}</mark>
      : part
  );
}

interface PagefindResult {
  id: string;
  url: string;
  meta: { title: string };
  excerpt: string;
}

interface PagefindSearchAPI {
  search: (query: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>;
  destroy?: () => void;
}

interface SearchClientProps {
  locale: string;
}

export default function SearchClient({ locale }: SearchClientProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ title: string; url: string; excerpt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const pagefindRef = useRef<PagefindSearchAPI | null>(null);
  const initRef = useRef(false);

  const initPagefind = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;
    try {
      // @ts-expect-error Pagefind static file
      const pagefind = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
      await pagefind.init();
      pagefindRef.current = pagefind;
      setIsReady(true);
    } catch {
      // Pagefind not available (e.g. in dev mode)
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    initPagefind();
  }, [initPagefind]);

  useEffect(() => {
    if (!query.trim() || !pagefindRef.current) {
      setResults([]);
      return;
    }

    let cancelled = false;

    const doSearch = async () => {
      setIsLoading(true);
      try {
        const search = await pagefindRef.current!.search(query);
        const data = await Promise.all(
          search.results.slice(0, 20).map((r) => r.data())
        );
        if (!cancelled) {
          setResults(
            data.map((item) => ({
              title: item.meta?.title || "Untitled",
              url: item.url,
              excerpt: item.excerpt,
            }))
          );
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const timer = setTimeout(doSearch, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const searchPlaceholder = locale === "zh" ? "搜索文章、标签、分类..." : "Search posts, tags, categories...";
  const noResults = locale === "zh" ? "未找到相关结果" : "No results found";
  const resultLabel = locale === "zh" ? "找到 {count} 个结果" : "{count} results found";

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {locale === "zh" ? "搜索" : "Search"}
        </h1>
      </div>

      {/* Search Input */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-border bg-bg-secondary/30 py-3.5 pl-12 pr-4 text-foreground-bright placeholder-text-muted outline-none transition-all duration-200 focus:border-accent/50 focus:shadow-[0_0_0_3px_var(--accent-glow)] focus:bg-bg-secondary/50"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition-colors hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status */}
      {!isReady && (
        <p className="text-center text-sm text-text-muted py-8">
          {locale === "zh" ? "正在加载搜索引擎..." : "Loading search engine..."}
        </p>
      )}

      {isReady && isLoading && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <span>{locale === "zh" ? "搜索中..." : "Searching..."}</span>
        </div>
      )}

      {!isLoading && query.trim() && results.length === 0 && isReady && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="text-3xl">🔍</div>
          <p className="text-text-secondary">{noResults}</p>
          <p className="text-sm text-text-muted">
            {locale === "zh"
              ? "试试其他关键词，如「Next.js」、「React」"
              : "Try different keywords like \"Next.js\", \"React\""}
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !isLoading && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-text-muted">
            {resultLabel.replace("{count}", String(results.length))}
          </p>
          {results.map((result, i) => (
            <Link
              key={`${result.url}-${i}`}
              href={result.url}
              className="card-glow group rounded-xl border border-border/60 bg-bg-secondary/20 p-5 transition-all duration-300 hover:border-border-light hover:bg-bg-secondary/50"
            >
              <h2 className="font-semibold text-foreground-bright transition-colors group-hover:text-accent">
                {highlightTitle(result.title, query)}
              </h2>
              <div
                className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2 [&_mark]:bg-accent/20 [&_mark]:text-accent [&_mark]:rounded [&_mark]:px-0.5"
                dangerouslySetInnerHTML={{ __html: sanitizeExcerpt(result.excerpt) }}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!query && isReady && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="text-4xl">✨</div>
          <p className="text-lg text-text-secondary">
            {locale === "zh" ? "输入关键词开始搜索" : "Type to start searching"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Next.js", "React", "TypeScript", "博客"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="rounded-lg border border-border-light px-3 py-1.5 text-sm text-text-muted transition-all hover:border-accent/40 hover:text-accent hover:bg-accent-glow"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
