import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true, role: true,
      nickname: true, bio: true, birthDate: true, avatar: true,
      skills: true, socialLinks: true, themePreference: true,
      profilePublic: true, createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowed = ["nickname", "bio", "birthDate", "skills", "socialLinks", "themePreference", "profilePublic"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  if (data.themePreference && !["dark", "light", "system"].includes(data.themePreference as string)) {
    return NextResponse.json({ error: "Invalid theme preference" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, nickname: true, bio: true, birthDate: true, skills: true, socialLinks: true, themePreference: true, profilePublic: true },
  });

  return NextResponse.json({ user: updated });
}
