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
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-accent-dim to-[var(--gradient-end)] transition-transform group-hover:scale-110" />
          <span className="text-foreground-bright transition-colors group-hover:text-accent">
            {siteConfig.name}
          </span>
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
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-accent"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
          <div className="mx-2 h-5 w-px bg-border" />
          <Link
            href={`/${locale}/search`}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-foreground"
            aria-label={t(locale, "search")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
