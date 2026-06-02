import { type Locale, siteConfig } from "@/lib/config";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold">
          {locale === "zh" ? "关于我" : "About Me"}
        </h1>
        <section className="prose prose-lg prose-invert max-w-none">
          {locale === "zh" ? (
            <>
              <p>你好！我是 <strong>{siteConfig.author.name}</strong>，一名热爱技术的开发者。</p>
              <p>这个博客是我的「数字花园」—— 一个用来沉淀知识、记录思考、分享学习过程的地方。我相信知识应该被整理和分享，而写作是最好的整理方式。</p>
              <h2>我关注的领域</h2>
              <ul>
                <li>Web 前端开发（React、Next.js、TypeScript）</li>
                <li>全栈工程与系统架构</li>
                <li>开发工具与效率提升</li>
                <li>AI 与机器学习的实践应用</li>
              </ul>
              <h2>关于这个博客</h2>
              <p>这个站点使用 Next.js + MDX 构建，部署在 Vercel 上。它支持中英双语，包含暗色主题、代码高亮、全文搜索等功能。</p>
              <p>所有文章都基于我的实际经验和学习笔记，力求「高信息密度、可复用」。如果这些内容能对你有所帮助，那将是我最大的荣幸。</p>
              <h2>联系我</h2>
              <p>如果你有任何问题、建议或想交流技术，欢迎通过以下方式联系我：</p>
              <ul>
                <li>GitHub: <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer">{siteConfig.author.name}</a></li>
                <li>Email: <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a></li>
              </ul>
            </>
          ) : (
            <>
              <p>Hi! I&apos;m <strong>{siteConfig.author.name}</strong>, a developer passionate about technology.</p>
              <p>This blog is my &ldquo;digital garden&rdquo; — a place to grow knowledge, document thoughts, and share my learning journey.</p>
              <h2>What I Focus On</h2>
              <ul>
                <li>Web Frontend Development (React, Next.js, TypeScript)</li>
                <li>Full-Stack Engineering &amp; System Architecture</li>
                <li>Developer Tools &amp; Productivity</li>
                <li>Practical AI &amp; Machine Learning Applications</li>
              </ul>
              <h2>About This Blog</h2>
              <p>This site is built with Next.js + MDX, deployed on Vercel. It supports bilingual content, featuring a dark theme, code highlighting, and full-text search.</p>
              <p>All articles are based on my real-world experience and learning notes, aiming for &ldquo;high information density and reusability.&rdquo;</p>
              <h2>Contact</h2>
              <ul>
                <li>GitHub: <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer">{siteConfig.author.name}</a></li>
                <li>Email: <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a></li>
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
