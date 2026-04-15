"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

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

    const cookieStore = await cookies();
    cookieStore.set("auth_token", user.id + "-secure-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
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
  cookieStore.delete("auth_token");
  redirect("/login");
}
