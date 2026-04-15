"use server";

import { ALL_SETTING_KEYS } from "@/lib/settings";

export async function saveSettingsAction(formData: FormData) {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const updates = ALL_SETTING_KEYS.map((key) => {
      const value = (formData.get(key) as string) ?? "";
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    });

    await Promise.all(updates);
    await prisma.$disconnect();

    return { success: true };
  } catch (err) {
    console.error("saveSettingsAction error:", err);
    return { success: false, error: "Kayıt sırasında hata oluştu." };
  }
}
