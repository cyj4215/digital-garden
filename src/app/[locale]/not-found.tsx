import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center animate-fade-in">
      <div className="relative">
        <h1 className="gradient-text text-[10rem] font-bold leading-none md:text-[12rem]">404</h1>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
      <p className="text-xl font-medium text-foreground-bright -mt-16 relative z-10">页面不存在</p>
      <p className="max-w-sm text-sm leading-relaxed text-text-secondary relative z-10">
        你访问的页面可能已被移除、更名，或暂时不可用。
      </p>
      <Link
        href="/zh"
        className="relative z-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30 hover:scale-[1.02]"
      >
        回到首页
      </Link>
    </div>
  );
}
