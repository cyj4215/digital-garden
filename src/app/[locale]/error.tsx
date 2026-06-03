"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 text-6xl">404</div>
      <h1 className="mb-3 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-text-secondary">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
