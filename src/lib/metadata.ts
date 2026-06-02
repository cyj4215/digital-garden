import { type Metadata } from "next";
import { siteConfig, type Locale } from "./config";

export function generateSiteMetadata(locale: Locale): Metadata {
  const title = {
    zh: `${siteConfig.name} - 个人数字花园`,
    en: `${siteConfig.name} - Personal Digital Garden`,
  };

  return {
    title: {
      default: title[locale],
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description[locale],
    authors: [{ name: siteConfig.author.name }],
    metadataBase: new URL("https://digital-garden.vercel.app"),
    openGraph: {
      title: title[locale],
      description: siteConfig.description[locale],
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: title[locale],
      description: siteConfig.description[locale],
    },
    alternates: {
      types: {
        "application/rss+xml": [
          { url: "/feed.xml", title: "RSS Feed" },
        ],
      },
    },
  };
}

export function generatePostMetadata(post: {
  title: string;
  summary: string;
  date: string;
  coverImage?: string;
  slug: string;
  lang: Locale;
}): Metadata {
  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      url,
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}
