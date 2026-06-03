import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getAllSlugs } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages = [
    { url: base, lastModified: now, changeFrequency: "daily" as const, priority: 1 },
    { url: `${base}/zh/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/en/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/zh/categories`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/en/categories`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/zh/archive`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/en/archive`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${base}/zh/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/en/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const zhPosts = getAllSlugs("zh").map((slug) => ({
    url: `${base}/zh/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const enPosts = getAllSlugs("en").map((slug) => ({
    url: `${base}/en/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...zhPosts, ...enPosts];
}
