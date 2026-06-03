"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
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
  const { data: session } = useSession();
  const role = (session?.user as Record<string, unknown>)?.role as string | undefined;
  const isAdmin = role === "ADMIN";

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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
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

            <Link
              href={`/${locale}/profile`}
              onClick={onClose}
              className="w-full py-3 text-center text-lg text-text-secondary hover:text-foreground transition-colors"
            >
              {locale === "zh" ? "个人资料" : "Profile"}
            </Link>
            {isAdmin && (
              <Link
                href={`/${locale}/admin`}
                onClick={onClose}
                className="w-full py-3 text-center text-lg text-warning hover:text-warning/80 transition-colors"
              >
                管理
              </Link>
            )}

            <div className="mt-4 flex flex-col items-center gap-3">
              <LanguageSwitcher locale={locale} pathname={pathname} />

              {session?.user ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt=""
                        className="h-6 w-6 rounded-full"
                      />
                    ) : null}
                    <span className="text-sm text-text-secondary">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="rounded-lg border border-border-light px-4 py-2 text-sm text-text-secondary hover:text-error hover:border-error/40 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth/login`}
                  onClick={onClose}
                  className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20"
                >
                  登录
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
