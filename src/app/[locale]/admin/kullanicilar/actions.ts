"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUsers(): Promise<AdminUser[]> {
  const prisma = await getPrisma();
  try {
    return await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: "asc" },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function addUserAction(formData: FormData): Promise<{ error?: string }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "admin";

  if (!email || !password) return { error: "Email ve şifre gereklidir." };
  if (password.length < 8) return { error: "Şifre en az 8 karakter olmalıdır." };

  const prisma = await getPrisma();
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Bu email zaten kayıtlı." };

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, passwordHash, role } });
    revalidatePath("/admin/kullanicilar");
    return {};
  } finally {
    await prisma.$disconnect();
  }
}

export async function changePasswordAction(formData: FormData): Promise<{ error?: string }> {
  const id = formData.get("id") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!newPassword || newPassword.length < 8) return { error: "Şifre en az 8 karakter olmalıdır." };

  const prisma = await getPrisma();
  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { passwordHash } });
    revalidatePath("/admin/kullanicilar");
    return {};
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteUserAction(formData: FormData): Promise<{ error?: string }> {
  const id = formData.get("id") as string;
  const prisma = await getPrisma();
  try {
    // Safety: don't delete the last admin
    const count = await prisma.user.count();
    if (count <= 1) return { error: "Son admin kullanıcısı silinemez." };
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/kullanicilar");
    return {};
  } finally {
    await prisma.$disconnect();
  }
}
