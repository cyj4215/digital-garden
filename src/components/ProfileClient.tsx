"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  githubId: string | null;
  createdAt: string;
}

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/zh/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/auth/session`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.user) {
            setUser({
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
              role: (data.user as Record<string, unknown>).role as string || "USER",
              githubId: null,
              createdAt: new Date().toISOString(),
            });
          }
        })
        .catch(() => {});
    }
  }, [session]);

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">个人资料</h1>

      <div className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-8">
        <div className="flex items-center gap-5 mb-8">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name || "User"}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <span
              className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                user.role === "ADMIN"
                  ? "bg-warning/20 text-warning"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">登录方式</span>
            <span className="text-text-secondary">GitHub</span>
          </div>
          {user.email && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">邮箱</span>
              <span className="text-text-secondary">{user.email}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
