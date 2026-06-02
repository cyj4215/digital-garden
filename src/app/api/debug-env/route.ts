import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    AUTH_SECRET: process.env.AUTH_SECRET ? `SET (${process.env.AUTH_SECRET.length} chars)` : "EMPTY",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? `SET (${process.env.GITHUB_CLIENT_ID.length} chars)` : "EMPTY",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? `SET (${process.env.GITHUB_CLIENT_SECRET.length} chars)` : "EMPTY",
    DATABASE_URL: process.env.DATABASE_URL ? `SET (${process.env.DATABASE_URL.length} chars)` : "EMPTY",
    VERCEL: process.env.VERCEL || "NOT_VERCEL",
    NODE_ENV: process.env.NODE_ENV,
  });
}
