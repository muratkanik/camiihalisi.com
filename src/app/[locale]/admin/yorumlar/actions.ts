"use server";

import { revalidatePath } from "next/cache";
import type { Testimonial } from "@/components/blocks/TrustSection";

async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient();
}

const SETTINGS_KEY = "testimonials";

export async function getTestimonials(): Promise<Testimonial[]> {
  const prisma = await getPrisma();
  try {
    const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
    if (!row) return [];
    return JSON.parse(row.value) as Testimonial[];
  } catch {
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveTestimonialsAction(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const raw = formData.get("testimonials_json") as string;
    const items: Testimonial[] = JSON.parse(raw);

    const prisma = await getPrisma();
    try {
      await prisma.setting.upsert({
        where: { key: SETTINGS_KEY },
        update: { value: JSON.stringify(items) },
        create: { key: SETTINGS_KEY, value: JSON.stringify(items) },
      });
    } finally {
      await prisma.$disconnect();
    }

    revalidatePath("/");
    revalidatePath("/[locale]", "page");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
