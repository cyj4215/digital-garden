import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";

const postsDir = path.join(process.cwd(), "content/posts");

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await params;
  const body = await request.json();
  const { title, date, tags, category, summary, lang, content, draft } = body;

  const locale = lang || "zh";
  const dir = path.join(postsDir, locale);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const frontmatter = [
    "---",
    `title: "${title || "Untitled"}"`,
    `date: "${date || new Date().toISOString().split("T")[0]}"`,
    `tags: [${(tags || "").split(",").map((t: string) => `"${t.trim()}"`).filter(Boolean).join(", ")}]`,
    `category: "${category || "Uncategorized"}"`,
    `summary: "${summary || ""}"`,
    `lang: "${locale}"`,
    draft ? `draft: true` : "",
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const fileContent = `${frontmatter}\n\n${content || ""}`;
  const filePath = path.join(dir, `${slug}.mdx`);

  fs.writeFileSync(filePath, fileContent, "utf-8");

  return NextResponse.json({ message: "Post saved", slug });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "zh";

  const filePath = path.join(postsDir, locale, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: "Post deleted" });
  }

  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}
