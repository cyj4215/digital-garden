"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/config";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useState, useRef, useEffect } from "react";

export default function Header({ locale }: { locale: string }) {
  const typedLocale = locale as "zh" | "en";
  const pathname = usePathname();
  const { data: session } = useSession();
  const navItems = siteConfig.navItems[locale as keyof typeof siteConfig.navItems] || siteConfig.navItems.zh;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const role = (session?.user as Record<string, unknown>)?.role as string | undefined;
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {isAdmin && (
            <Link
              href={`/${locale}/admin`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                pathname.startsWith(`/${locale}/admin`)
                  ? "text-warning"
                  : "text-text-secondary hover:text-warning"
              }`}
            >
              管理
            </Link>
          )}

          <div className="mx-2 h-5 w-px bg-border" />

          <Link
            href={`/${locale}/search`}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-foreground"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>

          {/* User Menu */}
          {session?.user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-bg-secondary"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-7 w-7 rounded-full"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    {(session.user.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-background-secondary p-2 shadow-xl animate-fade-in">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-text-muted truncate">{session.user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-foreground transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {locale === "zh" ? "个人资料" : "Profile"}
                  </Link>
                  {isAdmin && (
                    <Link
                      href={`/${locale}/admin`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-foreground transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      管理面板
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-error transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20"
            >
              登录
            </Link>
          )}

          <LanguageSwitcher locale={typedLocale} pathname={pathname} />
        </div>

        <MobileMenu
          locale={typedLocale}
          pathname={pathname}
          isOpen={mobileOpen}
          onToggle={() => setMobileOpen(!mobileOpen)}
          onClose={() => setMobileOpen(false)}
        />
      </nav>
    </header>
  );
}
