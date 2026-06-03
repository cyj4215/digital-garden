export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="h-8 w-48 rounded-lg bg-bg-tertiary" />
        <div className="h-4 w-32 rounded bg-bg-tertiary" />
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/60 bg-bg-secondary/20 p-6"
          >
            <div className="flex flex-col gap-3">
              <div className="h-3 w-40 rounded bg-bg-tertiary" />
              <div className="h-5 w-3/4 rounded bg-bg-tertiary" />
              <div className="h-3 w-full rounded bg-bg-tertiary" />
              <div className="h-3 w-2/3 rounded bg-bg-tertiary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
