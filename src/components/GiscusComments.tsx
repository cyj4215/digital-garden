"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface GiscusCommentsProps {
  locale: string;
  slug: string;
}

const GiscusComments: React.FC<GiscusCommentsProps> = ({ locale, slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous content
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "cyj4215/digital-garden");
    script.setAttribute("data-repo-id", "R_kgDOSuqi-A");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOSuqi-M4C-VyU");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolvedTheme === "light" ? "light" : "dark");
    script.setAttribute("data-lang", locale === "zh" ? "zh-CN" : "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
  }, [locale, slug, resolvedTheme]);

  return (
    <div className="mt-12 rounded-xl border border-border/60 bg-bg-secondary/20 p-6">
      <div className="mb-6 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5 text-accent"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
        <h3 className="text-lg font-semibold">
          {locale === "zh" ? "评论" : "Comments"}
        </h3>
      </div>
      <p className="mb-4 text-sm text-text-muted">
        {locale === "zh"
          ? "使用 GitHub 账号登录后即可评论"
          : "Sign in with GitHub to leave a comment"}
      </p>
      <div ref={containerRef} className="giscus" />
    </div>
  );
};

export default GiscusComments;
