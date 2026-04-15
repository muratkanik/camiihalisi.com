"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email ve şifre gereklidir." };

  try {
    // Lazy import to avoid module-level crash if DB is unreachable
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({ where: { email } });
    await prisma.$disconnect();

    if (!user) return { error: "Kullanıcı bulunamadı." };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: "Şifre yanlış." };

    const cookieStore = await cookies();
    cookieStore.set("auth_token", user.id + "-secure-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Sunucu hatası. Lütfen tekrar deneyin." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
