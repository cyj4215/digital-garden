"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string;
  draft: boolean;
  lang: string;
}

export default function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState("zh");
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "editor">("posts");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [editorSlug, setEditorSlug] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDate, setEditorDate] = useState(new Date().toISOString().split("T")[0]);
  const [editorCategory, setEditorCategory] = useState("");
  const [editorTags, setEditorTags] = useState("");
  const [editorSummary, setEditorSummary] = useState("");
  const [editorLang, setEditorLang] = useState("zh");
  const [editorContent, setEditorContent] = useState("");
  const [editorDraft, setEditorDraft] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/posts?locale=${locale}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/auth/login`);
    }
    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, locale, router, fetchPosts]);

  const role = (session?.user as Record<string, unknown>)?.role;
  if (role !== "ADMIN") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-text-secondary">
        <p>无权限访问</p>
      </div>
    );
  }

  function resetEditor() {
    setEditingPost(null);
    setEditorSlug("");
    setEditorTitle("");
    setEditorDate(new Date().toISOString().split("T")[0]);
    setEditorCategory("");
    setEditorTags("");
    setEditorSummary("");
    setEditorLang("zh");
    setEditorContent("");
    setEditorDraft(false);
    setSaveMessage("");
  }

  function startNewPost() {
    resetEditor();
    setActiveTab("editor");
  }

  async function handleSave() {
    setSaveMessage("");
    const slug = editorSlug || editorTitle.toLowerCase().replace(/[^\w\s\u4e00-\u9fff-]/g, "").replace(/\s+/g, "-");

    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editorTitle,
          date: editorDate,
          category: editorCategory,
          tags: editorTags,
          summary: editorSummary,
          lang: editorLang,
          content: editorContent,
          draft: editorDraft,
        }),
      });

      if (res.ok) {
        setSaveMessage("保存成功！");
        fetchPosts();
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("保存失败");
      }
    } catch {
      setSaveMessage("网络错误");
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">管理面板</h1>
          <p className="mt-1 text-sm text-text-muted">
            {session?.user?.name} · {posts.length} 篇文章
          </p>
        </div>
        <button
          onClick={startNewPost}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-accent-hover"
        >
          + 新建文章
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-border/60 bg-bg-secondary/20 p-1">
        {[
          { key: "posts" as const, label: "文章管理" },
          { key: "editor" as const, label: editingPost ? "编辑文章" : "新建文章" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {activeTab === "posts" && (
        <div className="flex flex-col gap-3">
          {loading && (
            <p className="py-8 text-center text-text-muted">加载中...</p>
          )}
          {!loading && posts.length === 0 && (
            <div className="rounded-xl border border-border/60 bg-bg-secondary/20 py-12 text-center">
              <p className="text-text-secondary">暂无文章</p>
              <button
                onClick={startNewPost}
                className="mt-3 text-sm text-accent hover:text-accent-hover"
              >
                创建第一篇文章 →
              </button>
            </div>
          )}
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-bg-secondary/20 p-4 transition-all hover:border-border-light"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-foreground-bright">
                    {post.title}
                  </h3>
                  {post.draft && (
                    <span className="shrink-0 rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                      草稿
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.lang}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingPost(post.slug);
                    setEditorSlug(post.slug);
                    setEditorTitle(post.title);
                    setEditorDate(post.date);
                    setEditorCategory(post.category);
                    setEditorTags(post.tags);
                    setEditorLang(post.lang);
                    setEditorDraft(post.draft);
                    setActiveTab("editor");
                  }}
                  className="rounded-lg border border-border-light px-3 py-1.5 text-xs text-text-secondary hover:border-accent/40 hover:text-accent transition-colors"
                >
                  编辑
                </button>
                <a
                  href={`/${post.lang}/blog/${post.slug}`}
                  target="_blank"
                  className="rounded-lg border border-border-light px-3 py-1.5 text-xs text-text-secondary hover:border-accent/40 hover:text-accent transition-colors"
                >
                  查看
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      {activeTab === "editor" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">标题</label>
              <input
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="文章标题"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">日期</label>
              <input
                type="date"
                value={editorDate}
                onChange={(e) => setEditorDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">语言</label>
              <select
                value={editorLang}
                onChange={(e) => setEditorLang(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">分类</label>
              <input
                value={editorCategory}
                onChange={(e) => setEditorCategory(e.target.value)}
                placeholder="如：前端开发"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">标签（逗号分隔）</label>
              <input
                value={editorTags}
                onChange={(e) => setEditorTags(e.target.value)}
                placeholder="如：React, TypeScript"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">摘要</label>
              <input
                value={editorSummary}
                onChange={(e) => setEditorSummary(e.target.value)}
                placeholder="一句话摘要"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent/50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">正文内容 (MDX)</label>
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="## 标题&#10;&#10;正文内容..."
              rows={20}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:border-accent/50 resize-y"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={editorDraft}
                onChange={(e) => setEditorDraft(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              保存为草稿
            </label>

            <div className="flex items-center gap-3">
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes("成功") ? "text-success" : "text-error"}`}>
                  {saveMessage}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={!editorTitle}
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-accent-hover disabled:opacity-50"
              >
                {editingPost ? "更新文章" : "保存文章"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
