import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MIGRATION_SQL = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS nickname VARCHAR(191)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS birthDate DATETIME`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(191)`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS socialLinks TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS themePreference VARCHAR(191) DEFAULT 'dark'`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS profilePublic BOOLEAN DEFAULT true`,
];

export async function POST() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown>)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const results: string[] = [];
  const errors: string[] = [];

  for (const sql of MIGRATION_SQL) {
    try {
      await prisma.$executeRawUnsafe(sql);
      const col = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || "unknown";
      results.push(`✓ ${col}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // "Duplicate column" means it already exists — that's fine
      if (msg.includes("Duplicate column") || msg.includes("already exists")) {
        const col = sql.match(/ADD COLUMN IF NOT EXISTS (\w+)/)?.[1] || "unknown";
        results.push(`✓ ${col} (already exists)`);
      } else {
        errors.push(`✗ ${sql.substring(0, 50)}... → ${msg}`);
      }
    }
  }

  return NextResponse.json({
    success: errors.length === 0,
    results,
    errors,
  });
}
