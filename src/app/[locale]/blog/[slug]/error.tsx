"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "zh";

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 text-6xl">!</div>
      <h1 className="mb-3 text-2xl font-bold">Failed to load post</h1>
      <p className="mb-8 max-w-md text-text-secondary">
        {error.message || "Could not load this blog post."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href={`/${locale}/blog`}
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
        >
          Back to blog
        </Link>
      </div>
    </div>
  );
}
