"use server";

import { revalidatePath } from "next/cache";
import { ALL_SETTING_KEYS } from "@/lib/settings";

// Returns void — required by Next.js form action type
export async function saveSettingsAction(formData: FormData): Promise<void> {
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

    // Invalidate cached settings across the site
    revalidatePath("/", "layout");
  } catch (err) {
    console.error("saveSettingsAction error:", err);
    // Can't return error from void action — log only
  }
}
