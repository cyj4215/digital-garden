"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto login after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/zh/auth/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold">注册</h1>
            <p className="mt-2 text-sm text-text-secondary">
              创建账号后即可发表评论
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">用户名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/50 focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/50 focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/50 focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-background transition-all hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? "注册中..." : "注册"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            已有账号？{" "}
            <Link href="/zh/auth/login" className="text-accent hover:text-accent-hover">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
