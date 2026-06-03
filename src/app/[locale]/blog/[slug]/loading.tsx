export default function PostLoading() {
  return (
    <article className="mx-auto max-w-3xl animate-pulse">
      <div className="mb-10">
        <div className="h-4 w-28 rounded bg-bg-tertiary" />
      </div>

      <header className="mb-10 flex flex-col gap-5">
        <div className="flex gap-2">
          <div className="h-4 w-20 rounded bg-bg-tertiary" />
          <div className="h-4 w-16 rounded bg-bg-tertiary" />
        </div>
        <div className="h-10 w-3/4 rounded bg-bg-tertiary" />
        <div className="h-5 w-full rounded bg-bg-tertiary" />
        <div className="flex gap-2">
          <div className="h-6 w-14 rounded bg-bg-tertiary" />
          <div className="h-6 w-16 rounded bg-bg-tertiary" />
        </div>
      </header>

      <div className="divider-gradient mb-10" />

      <div className="flex gap-12">
        <div className="flex-1 flex flex-col gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-bg-tertiary" style={{ width: `${85 + (i * 3) % 15}%` }} />
          ))}
        </div>
        <div className="hidden xl:block w-56">
          <div className="h-4 w-16 rounded bg-bg-tertiary mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-bg-tertiary mb-2" style={{ width: `${70 + (i * 5) % 30}%` }} />
          ))}
        </div>
      </div>
    </article>
  );
}
