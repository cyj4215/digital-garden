"use client";

import { useRouter, usePathname } from "next/navigation";
import { siteConfig, type Locale } from "@/lib/config";

export default function LanguageSwitcher({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const router = useRouter();
  const currentPath = pathname;

  const switchLanguage = (newLocale: Locale) => {
    const segments = currentPath.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const otherLocale: Locale = locale === "zh" ? "en" : "zh";

  return (
    <button
      onClick={() => switchLanguage(otherLocale)}
      className="ml-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
      aria-label={`Switch to ${otherLocale === "zh" ? "中文" : "English"}`}
    >
      {locale === "zh" ? "EN" : "中"}
    </button>
  );
}
