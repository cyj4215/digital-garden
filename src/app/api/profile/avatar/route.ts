import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  // Delete old avatar
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { avatar: true } });
  if (currentUser?.avatar?.startsWith("https://")) {
    await del(currentUser.avatar).catch(() => {});
  }

  const ext = file.name.split(".").pop() || "jpg";
  const blob = await put(`avatars/${session.user.id}.${ext}`, file, { access: "public" });

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { avatar: blob.url },
    select: { avatar: true },
  });

  return NextResponse.json({ avatar: updated.avatar });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { avatar: true } });
  if (currentUser?.avatar?.startsWith("https://")) {
    await del(currentUser.avatar).catch(() => {});
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { avatar: null } });
  return NextResponse.json({ success: true });
}
