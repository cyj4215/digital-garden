import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center animate-fade-in">
      <div className="relative">
        <h1 className="gradient-text text-[10rem] font-bold leading-none md:text-[12rem]">404</h1>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
      <p className="text-xl font-medium text-foreground-bright -mt-16 relative z-10">Page Not Found</p>
      <p className="max-w-sm text-sm leading-relaxed text-text-secondary relative z-10">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        href="/zh"
        className="relative z-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30 hover:scale-[1.02]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
