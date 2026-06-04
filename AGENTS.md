# Repository Guidelines

## Project Structure & Module Organization

```
digital-garden/
├── src/
│   ├── app/[locale]/          # i18n pages (blog, admin, auth, search, tags, categories)
│   ├── app/api/               # API routes (auth, admin, search, og)
│   ├── components/            # React components (Header, Footer, PostCard, SearchClient, etc.)
│   ├── lib/                   # Utilities (prisma, i18n, posts, config, rate-limit, security-headers)
│   ├── middleware.ts          # i18n routing + security headers
│   └── auth.ts                # NextAuth config
├── prisma/                    # Database schema (MySQL)
├── content/                   # MDX blog posts
├── public/                    # Static assets
└── docs/agents/               # Agent skill configuration
```

## Build, Test, and Development Commands

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build (generates Prisma client + Pagefind index) |
| `npm run start` | Run production server |
| `npm run lint` | ESLint with Next.js core-web-vitals + TypeScript rules |

No test framework is configured. If you add one, document the runner here.

## Coding Style & Naming Conventions

- **TypeScript** with strict mode; path alias `@/*` maps to `src/*`
- **React 19** functional components, `.tsx` extension
- **Tailwind CSS v4** via `@tailwindcss/postcss`; typography plugin available
- **Component names**: PascalCase (`PostCard.tsx`, `SearchClient.tsx`)
- **Utility modules**: kebab-case (`rate-limit.ts`, `security-headers.ts`)
- **ESLint** enforced via `eslint.config.mjs` (core-web-vitals + TypeScript)
- No Prettier config present; follow existing formatting in touched files

## Commit & Pull Request Guidelines

Commit messages use conventional prefixes observed in git history:

- `feat:` — new functionality
- `fix:` — bug fixes
- `security:` — hardening, headers, XSS prevention
- `debug:` — temporary diagnostic changes (remove before merge)
- `chore:` — maintenance, dependency updates

Keep PRs focused on one concern. Include a short description of what changed and why.

## Security & Configuration

- Environment variables go in `.env` (git-ignored). Required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`
- GitHub OAuth configured for admin access; role-based gating in `src/app/api/admin/`
- Rate limiting applied to API routes via `src/lib/rate-limit.ts`
- Security headers enforced globally via `src/middleware.ts`

## Architecture Notes

- **Next.js 16** App Router with `[locale]` dynamic segment for i18n (`next-intl`)
- **Prisma + MySQL** for user/auth storage (NextAuth adapter pattern)
- **MDX** blog content rendered via `next-mdx-remote` with Shiki syntax highlighting
- **Pagefind** for static full-text search (built post-build)
- **Giscus** for blog comments
- Deployed on **Vercel** with custom build command in `vercel.json`
