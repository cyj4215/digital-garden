"use client";

import Link from "next/link";
import { siteConfig, type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

interface MobileMenuProps {
  locale: Locale;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function MobileMenu({
  locale,
  pathname,
  isOpen,
  onToggle,
  onClose,
}: MobileMenuProps) {
  const navItems = siteConfig.navItems[locale];

  return (
    <div className="md:hidden">
      <button
        onClick={onToggle}
        className="rounded-lg p-2 text-text-secondary hover:text-foreground hover:bg-bg-secondary/50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col items-center gap-2 pt-8">
            {navItems.map((item) => {
              const href =
                item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
              const isActive =
                pathname === href ||
                (item.href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={onClose}
                  className={`w-full text-center py-3 text-lg transition-colors ${
                    isActive
                      ? "text-accent bg-bg-secondary"
                      : "text-text-secondary hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={`/${locale}/search`}
              onClick={onClose}
              className="w-full py-3 text-center text-lg text-text-secondary hover:text-foreground transition-colors"
            >
              {t(locale, "search")}
            </Link>
            <div className="mt-4">
              <LanguageSwitcher locale={locale} pathname={pathname} />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
