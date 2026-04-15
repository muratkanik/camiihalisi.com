"use server";

import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email ve şifre gereklidir." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Kullanıcı bulunamadı." };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Şifre yanlış." };

  const cookieStore = await cookies();
  cookieStore.set("auth_token", user.id + "-secure-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 // 1 day
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
