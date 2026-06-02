import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-8xl font-bold text-accent">404</h1>
      <p className="text-xl text-text-secondary">Page Not Found</p>
      <p className="max-w-md text-sm text-text-secondary/60">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link
        href="/zh"
        className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
      >
        Back to Home
      </Link>
    </div>
  );
}
