import { type Metadata } from "next";
import { type Locale, siteConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "zh" ? "关于我" : "About" };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: {
      name: true, nickname: true, bio: true, avatar: true,
      skills: true, socialLinks: true,
    },
  });

  const displayName = adminUser?.nickname || adminUser?.name || siteConfig.author.name;
  const avatar = adminUser?.avatar || null;
  const bio = adminUser?.bio || null;
  const skills: string[] = adminUser?.skills ? JSON.parse(adminUser.skills) : [];
  const socialLinks: Record<string, string> = adminUser?.socialLinks ? JSON.parse(adminUser.socialLinks) : {};

  const githubUrl = socialLinks.github || siteConfig.author.github;
  const twitterUrl = socialLinks.twitter || "";
  const websiteUrl = socialLinks.website || "";
  const email = siteConfig.author.email;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-8">
        {/* Header with avatar */}
        <div className="flex items-center gap-6">
          {avatar ? (
            <Image src={avatar} alt={displayName} width={96} height={96}
              className="h-24 w-24 rounded-full object-cover border-2 border-border" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-3xl font-bold text-accent">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold">{displayName}</h1>
            {adminUser?.name && adminUser.name !== displayName && (
              <p className="text-text-secondary">@{adminUser.name}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {bio ? (
          <section className="prose prose-lg prose-invert max-w-none">
            <p>{bio}</p>
          </section>
        ) : (
          <section className="prose prose-lg prose-invert max-w-none">
            {locale === "zh" ? (
              <>
                <p>你好！我是 <strong>{displayName}</strong>，一名热爱技术的开发者。</p>
                <p>这个博客是我的「数字花园」—— 一个用来沉淀知识、记录思考、分享学习过程的地方。</p>
              </>
            ) : (
              <>
                <p>Hi! I&apos;m <strong>{displayName}</strong>, a developer passionate about technology.</p>
                <p>This blog is my &ldquo;digital garden&rdquo; — a place to grow knowledge, document thoughts, and share my learning journey.</p>
              </>
            )}
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-bold">{locale === "zh" ? "技能" : "Skills"}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="mb-3 text-xl font-bold">{locale === "zh" ? "联系我" : "Contact"}</h2>
          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              GitHub: {githubUrl.replace("https://", "")}
            </a>
            <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
              Email: {email}
            </a>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                Twitter: {twitterUrl.replace("https://", "")}
              </a>
            )}
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                Website: {websiteUrl.replace("https://", "")}
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
