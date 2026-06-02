import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content/posts");

export async function GET(request: Request) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "zh";
  const dir = path.join(postsDir, locale);

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ posts: [] });
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const content = fs.readFileSync(path.join(dir, filename), "utf-8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter: Record<string, string> = {};

    if (frontmatterMatch) {
      const lines = frontmatterMatch[1].split("\n");
      for (const line of lines) {
        const [key, ...valueParts] = line.split(":");
        if (key && valueParts.length) {
          frontmatter[key.trim()] = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
        }
      }
    }

    return {
      slug,
      title: frontmatter.title || "Untitled",
      date: frontmatter.date || "",
      category: frontmatter.category || "",
      tags: frontmatter.tags || "",
      draft: frontmatter.draft === "true",
      lang: frontmatter.lang || locale,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ posts });
}
