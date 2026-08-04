"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AUTH_COOKIE, TOKEN_TTL_SECONDS, createAuthToken } from "@/lib/auth";

// Form action — redirect'i burada yapıyoruz (void döner)
export async function loginAction(formData: FormData): Promise<void> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email ve şifre gereklidir.")}`);
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    await prisma.$disconnect();

    if (!user) {
      redirect(`/login?error=${encodeURIComponent("Kullanıcı bulunamadı.")}`);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      redirect(`/login?error=${encodeURIComponent("Şifre yanlış.")}`);
    }

    const authToken = createAuthToken(user.id, user.role);
    if (!authToken) {
      redirect(`/login?error=${encodeURIComponent("Sunucu kimlik doğrulama ayarı eksik.")}`);
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: TOKEN_TTL_SECONDS,
    });
  } catch (err: unknown) {
    // redirect() throws internally — re-throw it
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    console.error("Login error:", err);
    redirect(`/login?error=${encodeURIComponent("Sunucu hatası. Lütfen tekrar deneyin.")}`);
  }

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  redirect("/login");
}
