import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/zh/auth/login",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" && user?.email) {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { githubId: account.providerAccountId },
          });
          if (!existingUser) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                githubId: account.providerAccountId,
                role: "ADMIN",
                image: user.image,
              },
            }).catch(async () => {
              await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  githubId: account.providerAccountId,
                  role: "ADMIN",
                },
              });
            });
          }
        } catch (e) {
          console.error("signIn callback error:", e);
          // Don't block sign-in on DB errors
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true, avatar: true },
          });
          token.role = dbUser?.role || "USER";
          token.avatar = dbUser?.avatar || user.image;
        } catch (e) {
          console.error("jwt callback error:", e);
          token.role = "USER";
          token.avatar = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as Record<string, unknown>).role = (token.role as string) || "USER";
        (session.user as unknown as Record<string, unknown>).avatar = token.avatar as string | undefined;
      }
      return session;
    },
  },
});
