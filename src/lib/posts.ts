import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  category: string;
  series?: string;
  summary: string;
  coverImage?: string;
  lang: "zh" | "en";
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  slug: string;
  readingTime: string;
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

function getLocaleDir(locale: string): string {
  return path.join(postsDirectory, locale);
}

export function getAllPosts(locale: string): Post[] {
  const dir = getLocaleDir(locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(dir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as PostFrontmatter;
    const stats = readingTime(content);

    return {
      ...frontmatter,
      slug,
      readingTime: stats.text.replace("min read", "分钟阅读"),
      content,
    };
  });

  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string): Post | null {
  const dir = getLocaleDir(locale);
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;
  const stats = readingTime(content);

  return {
    ...frontmatter,
    slug,
    readingTime: stats.text.replace("min read", "分钟阅读"),
    content,
  };
}

export function getAllSlugs(locale: string): string[] {
  const dir = getLocaleDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllCategories(locale: string): string[] {
  const posts = getAllPosts(locale);
  const categories = new Set(posts.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getAllTags(locale: string): string[] {
  const posts = getAllPosts(locale);
  const tags = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}

export function getPostsByCategory(locale: string, category: string): Post[] {
  return getAllPosts(locale).filter((p) => p.category === category);
}

export function getPostsByTag(locale: string, tag: string): Post[] {
  return getAllPosts(locale).filter((p) => p.tags.includes(tag));
}

export function getRelatedPosts(
  locale: string,
  currentSlug: string,
  limit = 3
): Post[] {
  const current = getPostBySlug(locale, currentSlug);
  if (!current) return [];

  return getAllPosts(locale)
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      post: p,
      score:
        (p.category === current.category ? 2 : 0) +
        p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}
