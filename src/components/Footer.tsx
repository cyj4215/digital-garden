import Link from "next/link";
import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";
import { siteConfig } from "@/lib/config";

export default function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/50">
      {/* Gradient divider */}
      <div className="divider-gradient mx-auto max-w-4xl" />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2"
          >
            <span className="inline-block h-5 w-5 rounded-md bg-gradient-to-br from-accent-dim to-[var(--gradient-end)] transition-transform group-hover:scale-110" />
            <span className="text-lg font-bold text-foreground-bright transition-colors group-hover:text-accent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-text-secondary">
            {siteConfig.description[locale as keyof typeof siteConfig.description]}
          </p>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2.5 text-text-muted transition-all hover:bg-bg-secondary hover:text-accent"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href={`mailto:${siteConfig.author.email}`}
              className="rounded-lg p-2.5 text-text-muted transition-all hover:bg-bg-secondary hover:text-accent"
              aria-label="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </a>
            <Link
              href={`/${locale}/feed.xml`}
              className="rounded-lg p-2.5 text-text-muted transition-all hover:bg-bg-secondary hover:text-accent"
              aria-label="RSS"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[18px] w-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm4.5 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-xs text-text-muted/60">
            <span>&copy; {year}</span>
            <span className="text-border-light">·</span>
            <span>{siteConfig.author.name}</span>
            <span className="text-border-light">·</span>
            <span>{t(locale, "copyright")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
