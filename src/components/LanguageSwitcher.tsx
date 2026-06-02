"use client";

import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher({
  locale,
  pathname,
}: {
  locale: string;
  pathname: string;
}) {
  const router = useRouter();

  const switchLanguage = () => {
    const newLocale = locale === "zh" ? "en" : "zh";
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <button
      onClick={switchLanguage}
      className="rounded-lg border border-border-light/50 px-2.5 py-1.5 text-xs font-medium text-text-muted transition-all hover:border-accent/40 hover:text-accent hover:bg-accent-glow"
      aria-label={`Switch to ${locale === "zh" ? "English" : "中文"}`}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
