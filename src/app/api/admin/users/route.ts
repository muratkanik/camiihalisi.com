import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return !!token;
}

// GET — list users
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const prisma = await getPrisma();
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ users });
  } finally {
    await prisma.$disconnect();
  }
}

// POST — add user
export async function POST(req: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const fd = await req.formData();
  const email = (fd.get("email") as string)?.trim().toLowerCase();
  const password = fd.get("password") as string;
  const role = (fd.get("role") as string) || "admin";

  if (!email || !password) return NextResponse.json({ error: "Email ve şifre gereklidir." });
  if (password.length < 8) return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." });

  const prisma = await getPrisma();
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Bu email zaten kayıtlı." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash, role } });
    return NextResponse.json({ ok: true, id: user.id });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH — change password
export async function PATCH(req: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const fd = await req.formData();
  const id = fd.get("id") as string;
  const newPassword = fd.get("newPassword") as string;

  if (!id) return NextResponse.json({ error: "Kullanıcı ID gereklidir." });
  if (!newPassword || newPassword.length < 8) return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." });

  const prisma = await getPrisma();
  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { passwordHash } });
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE — remove user
export async function DELETE(req: NextRequest) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  const fd = await req.formData();
  const id = fd.get("id") as string;

  if (!id) return NextResponse.json({ error: "Kullanıcı ID gereklidir." });

  const prisma = await getPrisma();
  try {
    const count = await prisma.user.count();
    if (count <= 1) return NextResponse.json({ error: "Son admin kullanıcısı silinemez." });
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } finally {
    await prisma.$disconnect();
  }
}
