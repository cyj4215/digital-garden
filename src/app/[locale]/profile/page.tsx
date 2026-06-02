import { auth } from "@/auth";
import { type Locale, siteConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const l = locale as Locale;

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-text-secondary">
          {locale === "zh" ? "请先登录" : "Please sign in first"}
        </p>
        <Link
          href={`/${locale}/auth/login`}
          className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-accent-hover"
        >
          {locale === "zh" ? "去登录" : "Sign in"}
        </Link>
      </div>
    );
  }

  const userId = session.user.id;
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
      githubId: true,
      createdAt: true,
    },
  });

  const role = (session.user as Record<string, unknown>)?.role as string;
  const displayUser = dbUser || {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role,
    githubId: null,
    createdAt: new Date(),
  };

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <h1 className="mb-8 text-3xl font-bold">
        {locale === "zh" ? "个人资料" : "Profile"}
      </h1>

      <div className="rounded-2xl border border-border/60 bg-bg-secondary/20 p-8">
        <div className="flex items-center gap-5 mb-8">
          {displayUser.image ? (
            <img
              src={displayUser.image}
              alt=""
              className="h-16 w-16 rounded-full"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
              {(displayUser.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{displayUser.name || "User"}</h2>
            <p className="text-sm text-text-secondary">{displayUser.email}</p>
            <span
              className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
                role === "ADMIN"
                  ? "bg-warning/20 text-warning"
                  : "bg-accent/10 text-accent"
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">
              {locale === "zh" ? "登录方式" : "Sign-in method"}
            </span>
            <span className="text-text-secondary">
              {displayUser.githubId ? "GitHub" : "Email"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">
              {locale === "zh" ? "注册时间" : "Joined"}
            </span>
            <span className="text-text-secondary">
              {new Date(displayUser.createdAt).toLocaleDateString(
                locale === "zh" ? "zh-CN" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>
          {displayUser.githubId && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">GitHub ID</span>
              <span className="text-text-secondary font-mono text-xs">
                {displayUser.githubId}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
