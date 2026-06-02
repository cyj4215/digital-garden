"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useState } from "react";

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const navItems = siteConfig.navItems[locale];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold tracking-tight text-foreground hover:text-accent transition-colors"
        >
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const href = item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
            const isActive =
              pathname === href ||
              (item.href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={item.href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-bg-secondary text-accent"
                    : "text-text-secondary hover:text-foreground hover:bg-bg-secondary/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={`/${locale}/search`}
            className="rounded-lg p-2 text-text-secondary hover:text-foreground hover:bg-bg-secondary/50 transition-colors"
            aria-label={t(locale, "search")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </div>

        <MobileMenu
          locale={locale}
          pathname={pathname}
          isOpen={mobileOpen}
          onToggle={() => setMobileOpen(!mobileOpen)}
          onClose={() => setMobileOpen(false)}
        />
      </nav>
    </header>
  );
}
