import type { Metadata } from "next";
import "@/app/globals.css";
import { Inter, Fira_Code } from "next/font/google";
import { siteConfig, type Locale } from "@/lib/config";
import { generateSiteMetadata } from "@/lib/metadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthSessionProvider from "@/components/AuthSessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateSiteMetadata(locale as Locale);
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  return (
    <html lang={locale} className={`${inter.variable} ${firaCode.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthSessionProvider>
        <Header locale={typedLocale} />
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        <Footer locale={typedLocale} />
      </AuthSessionProvider>
      </body>
    </html>
  );
}
