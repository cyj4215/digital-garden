"use client";

import { type Locale } from "@/lib/config";
import { t } from "@/lib/i18n";

export default function BackToTop({ locale }: { locale: Locale }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-accent/20 p-3 text-accent backdrop-blur-sm transition-all hover:bg-accent/30 hover:scale-110"
      aria-label={t(locale, "scrollToTop")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
}
