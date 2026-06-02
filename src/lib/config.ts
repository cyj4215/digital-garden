export const siteConfig = {
  name: "Digital Garden",
  description: {
    zh: "一个热爱技术的开发者的数字花园，记录技术思考、学习笔记与项目复盘。",
    en: "A digital garden of a tech enthusiast, documenting technical insights, learning notes, and project retrospectives.",
  },
  author: {
    name: "cyj4215",
    email: "cyj4215@example.com",
    github: "https://github.com/cyj4215",
  },
  defaultLocale: "zh" as const,
  locales: ["zh", "en"] as const,
  navItems: {
    zh: [
      { label: "首页", href: "/" },
      { label: "文章", href: "/blog" },
      { label: "分类", href: "/categories" },
      { label: "归档", href: "/archive" },
      { label: "关于", href: "/about" },
    ],
    en: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Categories", href: "/categories" },
      { label: "Archive", href: "/archive" },
      { label: "About", href: "/about" },
    ],
  },
};

export type Locale = (typeof siteConfig.locales)[number];
