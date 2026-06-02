import Link from "next/link";
import { type Locale } from "@/lib/config";

export default function Pagination({
  locale,
  currentPage,
  totalPages,
  basePath,
}: {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8"
      aria-label="Pagination"
    >
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          ←
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={`rounded-lg px-3 py-2 text-sm transition-colors ${
            page === currentPage
              ? "bg-accent text-background font-medium"
              : "border border-border text-text-secondary hover:border-accent hover:text-accent"
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="rounded-lg border border-border px-3 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          →
        </Link>
      )}
    </nav>
  );
}
